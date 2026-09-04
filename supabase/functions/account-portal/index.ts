import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const HTML = String.raw`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="theme-color" content="#07101d" />
  <title>Jarvis Legal Enterprise — Secure Account Portal</title>
  <style>
    :root{color-scheme:dark;--bg:#07101d;--panel:#0e1a2b;--panel2:#122139;--line:#263852;--gold:#e6c86c;--text:#eef3fb;--muted:#9eacc2;--ok:#69d69d;--bad:#ff7b7b;--warn:#ffc96b}
    *{box-sizing:border-box} body{margin:0;font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,sans-serif;background:radial-gradient(circle at top,#13233c 0,#07101d 42%);color:var(--text);min-height:100vh}
    .shell{width:min(1000px,94vw);margin:0 auto;padding:32px 0 64px}.top{display:flex;justify-content:space-between;gap:20px;align-items:center;margin-bottom:24px}.brand h1{font-size:clamp(24px,4vw,40px);margin:0;color:var(--gold);letter-spacing:.02em}.brand p{margin:7px 0 0;color:var(--muted)}
    .badge{border:1px solid var(--line);background:#0a1423;border-radius:999px;padding:9px 13px;color:var(--muted);font-size:13px}.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}.card{background:linear-gradient(180deg,var(--panel2),var(--panel));border:1px solid var(--line);border-radius:18px;padding:22px;box-shadow:0 15px 50px rgba(0,0,0,.18)}.card.full{grid-column:1/-1}.card h2{margin:0 0 8px;font-size:19px}.card p{margin:0 0 18px;color:var(--muted);line-height:1.5}
    label{display:block;font-size:13px;color:#c9d4e5;margin:13px 0 6px}input{width:100%;border:1px solid #31445f;background:#081322;color:var(--text);padding:12px 13px;border-radius:11px;outline:none;font:inherit}input:focus{border-color:var(--gold);box-shadow:0 0 0 3px rgba(230,200,108,.12)}button{border:0;border-radius:11px;padding:12px 15px;font:600 14px inherit;cursor:pointer;background:var(--gold);color:#17150e;margin-top:14px;width:100%}button.secondary{background:#1b2b43;color:var(--text);border:1px solid #344966}button.danger{background:#3a1b25;color:#ffdce2;border:1px solid #743349}.row{display:flex;gap:10px}.row button{flex:1}.status{margin-top:18px;border-radius:12px;padding:12px 14px;border:1px solid var(--line);background:#081322;color:var(--muted);min-height:44px}.status.ok{color:var(--ok);border-color:#24563d}.status.bad{color:var(--bad);border-color:#683139}.status.warn{color:var(--warn);border-color:#665126}.policy{display:flex;gap:9px;flex-wrap:wrap}.pill{font-size:12px;background:#091522;border:1px solid var(--line);border-radius:999px;padding:7px 10px;color:#c4d0e3}.session{display:none}.session.on{display:block}.small{font-size:12px;color:var(--muted)}@media(max-width:760px){.grid{grid-template-columns:1fr}.card.full{grid-column:auto}.top{align-items:flex-start;flex-direction:column}.shell{padding-top:20px}}
  </style>
</head>
<body>
  <main class="shell">
    <div class="top">
      <div class="brand"><h1>Jarvis Legal Enterprise</h1><p>Secure account portal • independent breached-password screening</p></div>
      <div class="badge">Chairman infrastructure • production</div>
    </div>

    <div class="card full">
      <h2>Password security policy</h2>
      <p>New passwords are screened against Have I Been Pwned using a k-anonymous hash-prefix lookup before Supabase Auth receives the accepted password.</p>
      <div class="policy"><span class="pill">12–128 characters</span><span class="pill">Known breached passwords blocked</span><span class="pill">HIBP failure = fail closed</span><span class="pill">Passwords never logged here</span></div>
      <div id="status" class="status">Ready.</div>
    </div>

    <section class="grid" style="margin-top:18px">
      <div class="card">
        <h2>Create account</h2><p>Customer accounts are created with the CLIENT role by default.</p>
        <form id="signupForm">
          <label for="signupEmail">Email</label><input id="signupEmail" type="email" autocomplete="email" required />
          <label for="signupPassword">Password</label><input id="signupPassword" type="password" autocomplete="new-password" minlength="12" maxlength="128" required />
          <button type="submit">Create secure account</button>
        </form>
      </div>

      <div class="card">
        <h2>Sign in</h2><p>Sign in to manage your password and account session.</p>
        <form id="signinForm">
          <label for="signinEmail">Email</label><input id="signinEmail" type="email" autocomplete="username" required />
          <label for="signinPassword">Password</label><input id="signinPassword" type="password" autocomplete="current-password" required />
          <button type="submit">Sign in</button>
        </form>
      </div>

      <div id="sessionCard" class="card full session">
        <h2>Signed-in account</h2><p id="accountLine">Session active.</p>
        <div class="grid">
          <form id="passwordForm" class="card" style="box-shadow:none">
            <h2>Change password</h2>
            <label for="newPassword">New password</label><input id="newPassword" type="password" autocomplete="new-password" minlength="12" maxlength="128" required />
            <button type="submit">Update password securely</button>
          </form>
          <div class="card" style="box-shadow:none">
            <h2>Session controls</h2><p>Session credentials are kept in this browser tab only.</p>
            <div class="row"><button id="refreshBtn" class="secondary" type="button">Refresh session</button><button id="signoutBtn" class="danger" type="button">Sign out</button></div>
            <p class="small" style="margin-top:12px">Closing the tab clears the local session copy.</p>
          </div>
        </div>
      </div>
    </section>
  </main>
<script>
const PROJECT_URL='https://idpneeyysraraznqmiio.supabase.co';
const API_KEY='sb_publishable_u1kIRdIQj2I3Tly5Trv0OQ_i-S7JnAw';
const GUARD_URL=PROJECT_URL+'/functions/v1/password-guard';
const statusEl=document.getElementById('status');
const sessionCard=document.getElementById('sessionCard');
const accountLine=document.getElementById('accountLine');

function setStatus(message,type=''){statusEl.textContent=message;statusEl.className='status'+(type?' '+type:'')}
function saveSession(data){if(data?.access_token)sessionStorage.setItem('jle_access_token',data.access_token);if(data?.refresh_token)sessionStorage.setItem('jle_refresh_token',data.refresh_token);renderSession()}
function clearSession(){sessionStorage.removeItem('jle_access_token');sessionStorage.removeItem('jle_refresh_token');sessionCard.classList.remove('on');accountLine.textContent='Session inactive.'}
function accessToken(){return sessionStorage.getItem('jle_access_token')||''}
function refreshToken(){return sessionStorage.getItem('jle_refresh_token')||''}
async function parse(res){const text=await res.text();try{return text?JSON.parse(text):{}}catch{return {message:text||'Unexpected response'}}}
async function renderSession(){const token=accessToken();if(!token){sessionCard.classList.remove('on');return}try{const res=await fetch(PROJECT_URL+'/auth/v1/user',{headers:{apikey:API_KEY,Authorization:'Bearer '+token}});if(!res.ok){sessionCard.classList.remove('on');return}const user=await parse(res);accountLine.textContent=user.email?'Signed in as '+user.email:'Session active.';sessionCard.classList.add('on')}catch{sessionCard.classList.remove('on')}}
async function refreshSession(){const token=refreshToken();if(!token)throw new Error('No refresh token is available. Sign in again.');const res=await fetch(PROJECT_URL+'/auth/v1/token?grant_type=refresh_token',{method:'POST',headers:{apikey:API_KEY,'Content-Type':'application/json'},body:JSON.stringify({refresh_token:token})});const data=await parse(res);if(!res.ok)throw new Error(data.msg||data.message||data.error_description||'Unable to refresh session.');saveSession(data);return data.access_token}

document.getElementById('signupForm').addEventListener('submit',async e=>{e.preventDefault();setStatus('Checking password against breach data…','warn');const email=document.getElementById('signupEmail').value.trim();const password=document.getElementById('signupPassword').value;try{const res=await fetch(GUARD_URL,{method:'POST',headers:{apikey:API_KEY,'Content-Type':'application/json'},body:JSON.stringify({action:'signup',email,password})});const data=await parse(res);if(!res.ok)throw new Error(data.message||data.msg||data.error_description||data.error||'Account creation failed.');document.getElementById('signupPassword').value='';setStatus('Account created. Check your email if confirmation is required.','ok')}catch(err){setStatus(err.message||'Account creation failed.','bad')}});

document.getElementById('signinForm').addEventListener('submit',async e=>{e.preventDefault();setStatus('Signing in…','warn');const email=document.getElementById('signinEmail').value.trim();const password=document.getElementById('signinPassword').value;try{const res=await fetch(PROJECT_URL+'/auth/v1/token?grant_type=password',{method:'POST',headers:{apikey:API_KEY,'Content-Type':'application/json'},body:JSON.stringify({email,password})});const data=await parse(res);document.getElementById('signinPassword').value='';if(!res.ok)throw new Error(data.msg||data.message||data.error_description||'Sign-in failed.');saveSession(data);setStatus('Signed in successfully.','ok')}catch(err){setStatus(err.message||'Sign-in failed.','bad')}});

document.getElementById('passwordForm').addEventListener('submit',async e=>{e.preventDefault();setStatus('Checking new password…','warn');const password=document.getElementById('newPassword').value;try{let token=accessToken();if(!token)throw new Error('Sign in first.');let res=await fetch(GUARD_URL,{method:'POST',headers:{apikey:API_KEY,Authorization:'Bearer '+token,'Content-Type':'application/json'},body:JSON.stringify({action:'change_password',password})});if(res.status===401&&refreshToken()){token=await refreshSession();res=await fetch(GUARD_URL,{method:'POST',headers:{apikey:API_KEY,Authorization:'Bearer '+token,'Content-Type':'application/json'},body:JSON.stringify({action:'change_password',password})})}const data=await parse(res);document.getElementById('newPassword').value='';if(!res.ok)throw new Error(data.message||data.msg||data.error_description||data.error||'Password update failed.');setStatus('Password updated successfully.','ok')}catch(err){setStatus(err.message||'Password update failed.','bad')}});

document.getElementById('refreshBtn').addEventListener('click',async()=>{setStatus('Refreshing session…','warn');try{await refreshSession();setStatus('Session refreshed.','ok')}catch(err){setStatus(err.message||'Refresh failed.','bad')}});
document.getElementById('signoutBtn').addEventListener('click',async()=>{const token=accessToken();try{if(token)await fetch(PROJECT_URL+'/auth/v1/logout',{method:'POST',headers:{apikey:API_KEY,Authorization:'Bearer '+token}})}finally{clearSession();setStatus('Signed out.','ok')}});
renderSession();
</script>
</body></html>`;

Deno.serve((req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "authorization, apikey, content-type",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
    }});
  }
  if (req.method !== "GET") return new Response("Method not allowed", { status: 405 });
  return new Response(HTML, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "no-referrer",
      "Content-Security-Policy": "default-src 'self'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; connect-src https://idpneeyysraraznqmiio.supabase.co; img-src 'self' data:; frame-ancestors 'none'; base-uri 'none'; form-action 'self'",
    },
  });
});
