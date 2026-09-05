import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "https://idpneeyysraraznqmiio.supabase.co";
const PUBLISHABLE_KEY = "sb_publishable_u1kIRdIQj2I3Tly5Trv0OQ_i-S7JnAw";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

function html(body: string, status = 200) {
  return new Response(body, {
    status,
    headers: {
      ...corsHeaders,
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
      "referrer-policy": "no-referrer",
      "content-security-policy": "default-src 'self'; connect-src 'self' https://idpneeyysraraznqmiio.supabase.co; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src 'self' data:; frame-ancestors 'none'; base-uri 'none'; form-action 'self'",
    },
  });
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders,
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
    },
  });
}

function page() {
  const resetUrl = `${SUPABASE_URL}/functions/v1/password-reset`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Jarvis Password Reset</title>
<style>
  :root { color-scheme: dark; font-family: Inter, system-ui, sans-serif; }
  body { margin:0; min-height:100vh; display:grid; place-items:center; background:#07111d; color:#eaf2ff; }
  .card { width:min(92vw,430px); background:#0d1b2a; border:1px solid #233852; border-radius:18px; padding:26px; box-shadow:0 24px 70px #0008; }
  h1 { margin:0 0 8px; font-size:26px; }
  p { color:#adbed4; line-height:1.45; }
  label { display:block; margin:18px 0 7px; font-weight:700; }
  input { box-sizing:border-box; width:100%; padding:13px 14px; border-radius:10px; border:1px solid #334d6c; background:#081522; color:#fff; font-size:16px; }
  button { width:100%; margin-top:18px; padding:13px; border:0; border-radius:10px; font-weight:800; font-size:16px; cursor:pointer; background:#d6e7ff; color:#06111d; }
  .msg { margin-top:16px; padding:12px; border-radius:10px; display:none; }
  .ok { display:block; background:#10311f; color:#c9ffda; }
  .err { display:block; background:#3b1717; color:#ffd1d1; }
  .small { font-size:13px; color:#8398b2; }
</style>
</head>
<body>
<main class="card">
  <section id="requestPane">
    <h1>Reset Jarvis password</h1>
    <p>Enter your Jarvis account email. If the account exists, a secure recovery link will be sent.</p>
    <form id="requestForm">
      <label for="email">Email</label>
      <input id="email" type="email" autocomplete="email" required />
      <button type="submit">Send reset link</button>
    </form>
    <div id="requestMsg" class="msg"></div>
  </section>

  <section id="updatePane" hidden>
    <h1>Choose a new password</h1>
    <p>Use at least 12 characters and avoid a password you use anywhere else.</p>
    <form id="updateForm">
      <label for="password">New password</label>
      <input id="password" type="password" autocomplete="new-password" minlength="12" required />
      <label for="confirm">Confirm new password</label>
      <input id="confirm" type="password" autocomplete="new-password" minlength="12" required />
      <button type="submit">Change password</button>
    </form>
    <div id="updateMsg" class="msg"></div>
  </section>

  <p class="small">Jarvis Legal Enterprise • Secure account recovery</p>
</main>
<script>
const SUPABASE_URL = ${JSON.stringify(SUPABASE_URL)};
const PUBLISHABLE_KEY = ${JSON.stringify(PUBLISHABLE_KEY)};
const RESET_URL = ${JSON.stringify(resetUrl)};
const hash = new URLSearchParams(location.hash.replace(/^#/, ''));
const accessToken = hash.get('access_token');
const type = hash.get('type');

if (accessToken && type === 'recovery') {
  document.getElementById('requestPane').hidden = true;
  document.getElementById('updatePane').hidden = false;
}

function show(el, text, ok) {
  el.textContent = text;
  el.className = 'msg ' + (ok ? 'ok' : 'err');
}

document.getElementById('requestForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const msg = document.getElementById('requestMsg');
  const email = document.getElementById('email').value.trim();
  try {
    const r = await fetch(RESET_URL, {
      method: 'POST',
      headers: {'content-type':'application/json'},
      body: JSON.stringify({action:'request', email})
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(data.error || 'Unable to send reset email.');
    show(msg, 'If that account exists, a reset link has been sent. Check your inbox and spam folder.', true);
  } catch (err) {
    show(msg, err.message || 'Unable to send reset email.', false);
  }
});

document.getElementById('updateForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const msg = document.getElementById('updateMsg');
  const password = document.getElementById('password').value;
  const confirm = document.getElementById('confirm').value;
  if (password.length < 12) return show(msg, 'Password must be at least 12 characters.', false);
  if (password !== confirm) return show(msg, 'Passwords do not match.', false);
  try {
    const r = await fetch(SUPABASE_URL + '/auth/v1/user', {
      method: 'PUT',
      headers: {
        'content-type':'application/json',
        'apikey': PUBLISHABLE_KEY,
        'authorization': 'Bearer ' + accessToken
      },
      body: JSON.stringify({password})
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(data.msg || data.message || data.error_description || 'Password update failed.');
    history.replaceState(null, '', location.pathname);
    document.getElementById('updateForm').hidden = true;
    show(msg, 'Password changed successfully. You can now sign in to Jarvis with your new password.', true);
  } catch (err) {
    show(msg, err.message || 'Password update failed.', false);
  }
});
</script>
</body>
</html>`;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method === "GET") return html(page());
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const body = await req.json().catch(() => ({}));
    if (body?.action !== "request") return json({ error: "Invalid action" }, 400);

    const email = String(body?.email ?? "").trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json({ error: "Enter a valid email address." }, 400);
    }

    const redirectTo = `${SUPABASE_URL}/functions/v1/password-reset`;
    const response = await fetch(`${SUPABASE_URL}/auth/v1/recover?redirect_to=${encodeURIComponent(redirectTo)}`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "apikey": PUBLISHABLE_KEY,
      },
      body: JSON.stringify({ email }),
    });

    // Do not reveal whether an email address is registered.
    if (!response.ok) {
      const detail = await response.text();
      console.error("Password recovery request failed:", response.status, detail);
      return json({ error: "Unable to send a reset link right now. Please try again shortly." }, 502);
    }

    return json({ ok: true });
  } catch (error) {
    console.error("password-reset error", error);
    return json({ error: "Unable to process the reset request." }, 500);
  }
});
