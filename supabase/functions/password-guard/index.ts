import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

const JSON_HEADERS = {
  ...CORS_HEADERS,
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store",
};

const MIN_PASSWORD_LENGTH = 12;
const MAX_PASSWORD_LENGTH = 128;
const HIBP_RANGE_URL = "https://api.pwnedpasswords.com/range/";

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: JSON_HEADERS });
}

function publicKeys(): string[] {
  const keys: string[] = [];

  const modern = Deno.env.get("SUPABASE_PUBLISHABLE_KEYS");
  if (modern) {
    try {
      const parsed = JSON.parse(modern) as Record<string, string>;
      for (const value of Object.values(parsed)) {
        if (typeof value === "string" && value.length > 0) keys.push(value);
      }
    } catch {
      // If the platform variable is malformed, legacy fallback below may still work.
    }
  }

  const legacy = Deno.env.get("SUPABASE_ANON_KEY");
  if (legacy) keys.push(legacy);

  return [...new Set(keys)];
}

function requirePublishableKey(req: Request): string | null {
  const supplied = req.headers.get("apikey")?.trim() ?? "";
  if (!supplied) return null;
  return publicKeys().includes(supplied) ? supplied : null;
}

function validatePasswordShape(password: unknown): string | null {
  if (typeof password !== "string") return "Password is required.";
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  }
  if (password.length > MAX_PASSWORD_LENGTH) {
    return `Password must be no more than ${MAX_PASSWORD_LENGTH} characters.`;
  }
  return null;
}

async function sha1Hex(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-1", bytes);
  return [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();
}

async function checkPwnedPassword(password: string): Promise<number> {
  const hash = await sha1Hex(password);
  const prefix = hash.slice(0, 5);
  const suffix = hash.slice(5);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 6000);

  try {
    const response = await fetch(`${HIBP_RANGE_URL}${prefix}`, {
      method: "GET",
      headers: {
        "Add-Padding": "true",
        "User-Agent": "Jarvis-Legal-Enterprise-PasswordGuard/1.0",
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`HIBP_HTTP_${response.status}`);
    }

    const text = await response.text();
    for (const line of text.split(/\r?\n/)) {
      if (!line) continue;
      const [candidateSuffix, countText] = line.split(":");
      if (candidateSuffix?.toUpperCase() === suffix) {
        return Number.parseInt(countText ?? "0", 10) || 0;
      }
    }
    return 0;
  } finally {
    clearTimeout(timer);
  }
}

async function ensurePasswordAllowed(password: string): Promise<Response | null> {
  const shapeError = validatePasswordShape(password);
  if (shapeError) {
    return json({ error: "WEAK_PASSWORD", message: shapeError }, 400);
  }

  try {
    const breachCount = await checkPwnedPassword(password);
    if (breachCount > 0) {
      return json({
        error: "COMPROMISED_PASSWORD",
        message: "This password appears in known breach data. Choose a different password.",
      }, 400);
    }
    return null;
  } catch {
    return json({
      error: "PASSWORD_SECURITY_UNAVAILABLE",
      message: "Password security verification is temporarily unavailable. Try again shortly.",
    }, 503);
  }
}

async function authRequest(
  supabaseUrl: string,
  apiKey: string,
  path: string,
  init: RequestInit,
  authorization?: string,
): Promise<Response> {
  const headers = new Headers(init.headers);
  headers.set("apikey", apiKey);
  headers.set("Content-Type", "application/json");
  if (authorization) headers.set("Authorization", authorization);

  return await fetch(`${supabaseUrl}${path}`, { ...init, headers });
}

async function proxyJson(response: Response): Promise<Response> {
  const text = await response.text();
  let body: unknown;
  try {
    body = text ? JSON.parse(text) : {};
  } catch {
    body = response.ok ? { ok: true } : { error: "AUTH_REQUEST_FAILED" };
  }
  return json(body, response.status);
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  const url = new URL(req.url);
  if (req.method === "GET" && url.pathname.endsWith("/health")) {
    return json({
      status: "ok",
      service: "password-guard",
      breachSource: "HIBP Pwned Passwords",
      policy: { minLength: MIN_PASSWORD_LENGTH, maxLength: MAX_PASSWORD_LENGTH, failClosed: true },
    });
  }

  if (req.method !== "POST") {
    return json({ error: "METHOD_NOT_ALLOWED" }, 405);
  }

  const apiKey = requirePublishableKey(req);
  if (!apiKey) {
    return json({ error: "INVALID_APPLICATION_KEY" }, 401);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  if (!supabaseUrl) {
    return json({ error: "SERVER_CONFIGURATION_ERROR" }, 500);
  }

  let payload: Record<string, unknown>;
  try {
    payload = await req.json();
  } catch {
    return json({ error: "INVALID_JSON" }, 400);
  }

  const action = typeof payload.action === "string" ? payload.action : "";
  const password = payload.password;

  if (action === "signup") {
    const email = typeof payload.email === "string" ? payload.email.trim() : "";
    if (!email || !email.includes("@")) {
      return json({ error: "INVALID_EMAIL" }, 400);
    }

    const passwordError = validatePasswordShape(password);
    if (passwordError) return json({ error: "WEAK_PASSWORD", message: passwordError }, 400);

    const blocked = await ensurePasswordAllowed(password as string);
    if (blocked) return blocked;

    const response = await authRequest(
      supabaseUrl,
      apiKey,
      "/auth/v1/signup",
      { method: "POST", body: JSON.stringify({ email, password }) },
    );
    return await proxyJson(response);
  }

  if (action === "change_password") {
    const authorization = req.headers.get("Authorization")?.trim() ?? "";
    if (!authorization.toLowerCase().startsWith("bearer ")) {
      return json({ error: "AUTHENTICATION_REQUIRED" }, 401);
    }

    const passwordError = validatePasswordShape(password);
    if (passwordError) return json({ error: "WEAK_PASSWORD", message: passwordError }, 400);

    const blocked = await ensurePasswordAllowed(password as string);
    if (blocked) return blocked;

    const userCheck = await authRequest(
      supabaseUrl,
      apiKey,
      "/auth/v1/user",
      { method: "GET" },
      authorization,
    );
    if (!userCheck.ok) return await proxyJson(userCheck);

    const updatePayload: Record<string, unknown> = { password };
    if (typeof payload.nonce === "string" && payload.nonce.length > 0) {
      updatePayload.nonce = payload.nonce;
    }

    const response = await authRequest(
      supabaseUrl,
      apiKey,
      "/auth/v1/user",
      { method: "PUT", body: JSON.stringify(updatePayload) },
      authorization,
    );
    return await proxyJson(response);
  }

  return json({ error: "UNKNOWN_ACTION" }, 400);
});
