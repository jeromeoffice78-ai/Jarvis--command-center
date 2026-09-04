import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const HTML = String.raw`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<meta name="theme-color" content="#07101d" />
<title>Jarvis Legal Enterprise — Chairman Command</title>
<style>
:root{color-scheme:dark;--bg:#060d18;--panel:#0d1727;--panel2:#111f34;--line:#253750;--gold:#e5c66b;--text:#eef4ff;--muted:#9babc2;--green:#61d697;--red:#ff7c7c;--amber:#ffc96b;--blue:#76a9ff}
*{box-sizing:border-box}body{margin:0;background:radial-gradient(circle at 20% 0,#172944 0,#091321 34%,var(--bg) 68%);font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:var(--text);min-height:100vh}.wrap{width:min(1220px,95vw);margin:0 auto;padding:22px 0 70px}.top{display:flex;justify-content:space-between;align-items:center;gap:16px;margin-bottom:18px}.brand h1{margin:0;color:var(--gold);font-size:clamp(24px,4vw,38px)}.brand p{margin:5px 0 0;color:var(--muted)}.top-actions{display:flex;gap:10px;align-items:center}.chip{border:1px solid var(--line);background:#091422;color:var(--muted);padding:8px 11px;border-radius:999px;font-size:12px}.btn{border:1px solid #3a4e6b;background:#172943;color:var(--text);border-radius:10px;padding:10px 13px;font:600 13px inherit;cursor:pointer}.btn.gold{background:var(--gold);color:#19160c;border-color:var(--gold)}.btn.danger{background:#351923;color:#ffdce2;border-color:#6b3141}.btn.small{padding:7px 9px;font-size:12px}.login{max-width:520px;margin:10vh auto 0;background:linear-gradient(180deg,var(--panel2),var(--panel));border:1px solid var(--line);border-radius:20px;padding:26px;box-shadow:0 24px 70px rgba(0,0,0,.3)}.login h2{margin:0 0 8px}.login p{color:var(--muted);line-height:1.5}.hidden{display:none!important}label{display:block;color:#c6d1e2;font-size:13px;margin:13px 0 6px}input,select,textarea{width:100%;background:#07111f;color:var(--text);border:1px solid #30445f;border-radius:10px;padding:11px 12px;font:inherit;outline:none}textarea{min-height:90px;resize:vertical}input:focus,select:focus,textarea:focus{border-color:var(--gold);box-shadow:0 0 0 3px rgba(229,198,107,.1)}.status{margin-top:14px;padding:11px 12px;border:1px solid var(--line);background:#07111f;border-radius:10px;color:var(--muted)}.status.ok{color:var(--green);border-color:#24553d}.status.bad{color:var(--red);border-color:#6b3039}.status.warn{color:var(--amber);border-color:#665027}
.nav{display:flex;gap:7px;flex-wrap:wrap;margin:18px 0}.nav button{border:1px solid var(--line);background:#0b1727;color:var(--muted);padding:9px 12px;border-radius:10px;cursor:pointer}.nav button.active{color:#17140b;background:var(--gold);border-color:var(--gold);font-weight:700}.tab{display:none}.tab.active{display:block}.grid{display:grid;grid-template-columns:repeat(12,1fr);gap:14px}.card{background:linear-gradient(180deg,var(--panel2),var(--panel));border:1px solid var(--line);border-radius:16px;padding:17px;box-shadow:0 12px 35px rgba(0,0,0,.16)}.span3{grid-column:span 3}.span4{grid-column:span 4}.span5{grid-column:span 5}.span6{grid-column:span 6}.span7{grid-column:span 7}.span8{grid-column:span 8}.span12{grid-column:span 12}.metric .n{font-size:30px;font-weight:800;color:var(--gold)}.metric .k{color:var(--muted);font-size:13px}.card h2,.card h3{margin:0 0 10px}.sub{color:var(--muted);font-size:13px}.list{display:flex;flex-direction:column;gap:9px}.item{background:#091523;border:1px solid #21344d;border-radius:11px;padding:11px}.item .title{font-weight:700}.item .meta{font-size:12px;color:var(--muted);margin-top:5px}.item .body{color:#c8d3e5;margin-top:7px;line-height:1.45;font-size:13px}.badge{display:inline-block;border:1px solid #334b69;background:#0e1b2d;border-radius:999px;padding:4px 7px;font-size:11px;color:#c7d3e6;margin-right:4px}.badge.attn{border-color:#6c5221;color:var(--amber)}.badge.risk{border-color:#69323b;color:#ff9a9a}.empty{color:var(--muted);font-size:13px;padding:8px 0}.brief{line-height:1.6;color:#d4deec}.brief strong{color:var(--gold)}.form-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}.form-grid .full{grid-column:1/-1}.board-seat{display:grid;grid-template-columns:auto 1fr;gap:10px;align-items:start}.seat{width:34px;height:34px;border-radius:50%;display:grid;place-items:center;background:#1e2f49;border:1px solid #405879;color:var(--gold);font-weight:800}.money{font-size:34px;color:var(--green);font-weight:800}.security-ok{color:var(--green)}
@media(max-width:900px){.span3,.span4,.span5,.span6,.span7,.span8{grid-column:span 12}.top{align-items:flex-start;flex-direction:column}.form-grid{grid-template-columns:1fr}.form-grid .full{grid-column:auto}}
</style>
</head>
<body>
<div class="wrap">
  <section id="loginView" class="login">
    <div class="brand"><h1>Jarvis Legal Enterprise</h1><p>Chairman Command Center</p></div>
    <h2 style="margin-top:22px">Chairman sign in</h2>
    <p>This interface requires an authenticated MASTER_ADMIN account. Database Row Level Security remains authoritative.</p>
    <form id="loginForm">
      <label>Email</label><input id="email" type="email" autocomplete="username" required />
      <label>Password</label><input id="password" type="password" autocomplete="current-password" required />
      <button class="btn gold" style="width:100%;margin-top:15px" type="submit">Enter command center</button>
    </form>
    <div id="loginStatus" class="status">Ready.</div>
  </section>

  <section id="appView" class="hidden">
    <div class="top">
      <div class="brand"><h1>Chairman Command</h1><p id="who">Authenticated chairman session</p></div>
      <div class="top-actions"><span id="roleChip" class="chip">MASTER_ADMIN</span><button id="refreshAll" class="btn">Refresh</button><button id="logout" class="btn danger">Sign out</button></div>
    </div>
    <nav class="nav" id="nav">
      <button data-tab="dashboard" class="active">Dashboard</button><button data-tab="board">Board</button><button data-tab="matters">Matters</button><button data-tab="revenue">Revenue</button><button data-tab="security">Security</button>
    </nav>

    <section id="dashboard" class="tab active">
      <div class="grid">
        <div class="card span3 metric"><div id="mMatters" class="n">—</div><div class="k">Matters</div></div>
        <div class="card span3 metric"><div id="mDocs" class="n">—</div><div class="k">Legal documents</div></div>
        <div class="card span3 metric"><div id="mEvidence" class="n">—</div><div class="k">Evidence items</div></div>
        <div class="card span3 metric"><div id="mSubs" class="n">—</div><div class="k">Subscriptions</div></div>
        <div class="card span7"><h2>Chairman briefing</h2><div id="briefing" class="brief">Loading live enterprise briefing…</div></div>
        <div class="card span5"><h2>Deadlines</h2><div id="deadlineList" class="list"></div></div>
        <div class="card span6"><h2>Recent matters</h2><div id="matterList" class="list"></div></div>
        <div class="card span6"><h2>Board attention</h2><div id="attentionList" class="list"></div></div>
      </div>
    </section>

    <section id="board" class="tab">
      <div class="grid">
        <div class="card span5"><h2>Board members</h2><div id="boardMembers" class="list"></div></div>
        <div class="card span7"><h2>Board messages</h2><div id="boardMessages" class="list"></div></div>
        <div class="card span12"><h2>Resolutions</h2><div id="resolutions" class="list"></div></div>
      </div>
    </section>

    <section id="matters" class="tab">
      <div class="grid">
        <div class="card span5">
          <h2>Create matter</h2><p class="sub">Chairman-created matters are inserted under your authenticated identity and RLS context.</p>
          <form id="matterForm" class="form-grid">
            <div><label>Matter number</label><input id="matterNumber" required /></div>
            <div><label>Type</label><input id="matterType" placeholder="civil, criminal, contract…" required /></div>
            <div class="full"><label>Title</label><input id="matterTitle" required /></div>
            <div><label>Client name</label><input id="clientName" /></div>
            <div><label>Jurisdiction</label><input id="jurisdiction" /></div>
            <div><label>Risk level</label><select id="riskLevel"><option value="">Not set</option><option>low</option><option>medium</option><option>high</option><option>critical</option></select></div>
            <div><label>Status</label><select id="matterStatus"><option>active</option><option>pending</option><option>closed</option></select></div>
            <div class="full"><label>Summary</label><textarea id="matterSummary"></textarea></div>
            <div class="full"><button class="btn gold" type="submit">Create matter</button></div>
          </form>
          <div id="matterStatusMsg" class="status">Ready.</div>
        </div>
        <div class="card span7"><h2>All accessible matters</h2><div id="allMatters" class="list"></div></div>
      </div>
    </section>

    <section id="revenue" class="tab">
      <div class="grid">
        <div class="card span4"><h2>Estimated active MRR</h2><div id="mrr" class="money">$0</div><p class="sub">Calculated from active subscriptions matched to plan monthly prices.</p></div>
        <div class="card span4 metric"><div id="activeSubs" class="n">—</div><div class="k">Active subscriptions</div></div>
        <div class="card span4 metric"><div id="activePlans" class="n">—</div><div class="k">Active plans</div></div>
        <div class="card span6"><h2>Plans</h2><div id="plans" class="list"></div></div>
        <div class="card span6"><h2>Subscription status</h2><div id="subStatus" class="list"></div></div>
      </div>
    </section>

    <section id="security" class="tab">
      <div class="grid">
        <div class="card span6"><h2>Password protection</h2><p class="security-ok">● HIBP breached-password gateway deployed</p><p class="sub">New passwords must be 12–128 characters, known breached passwords are blocked, and breach-source failure fails closed.</p></div>
        <div class="card span6"><h2>Change Chairman password</h2><form id="changePasswordForm"><label>New password</label><input id="newPassword" type="password" autocomplete="new-password" minlength="12" maxlength="128" required /><button class="btn gold" style="width:100%;margin-top:13px" type="submit">Screen and update password</button></form><div id="securityStatus" class="status">Ready.</div></div>
      </div>
    </section>
  </section>
</div>
<script>
const PROJECT='https://idpneeyysraraznqmiio.supabase.co';
const KEY='sb_publishable_u1kIRdIQj2I3Tly5Trv0OQ_i-S7JnAw';
const GUARD=PROJECT+'/functions/v1/password-guard';
const SKEY='jle_chair_access',RKEY='jle_chair_refresh';
let currentUser=null,currentProfile=null,cache={};
const $=id=>document.getElementById(id);
function setStatus(id,msg,type=''){const e=$(id);e.textContent=msg;e.className='status'+(type?' '+type:'')}
function token(){return sessionStorage.getItem(SKEY)||''}function rtoken(){return sessionStorage.getItem(RKEY)||''}
function storeSession(d){if(d?.access_token)sessionStorage.setItem(SKEY,d.access_token);if(d?.refresh_token)sessionStorage.setItem(RKEY,d.refresh_token)}
function clearSession(){sessionStorage.removeItem(SKEY);sessionStorage.removeItem(RKEY);currentUser=null;currentProfile=null;cache={}}
async function readJson(res){const t=await res.text();try{return t?JSON.parse(t):null}catch{return null}}
async function authFetch(path,init={}){const h=new Headers(init.headers||{});h.set('apikey',KEY);if(token())h.set('Authorization','Bearer '+token());return fetch(PROJECT+path,{...init,headers:h})}
async function refreshToken(){if(!rtoken())throw new Error('Session expired. Sign in again.');const res=await fetch(PROJECT+'/auth/v1/token?grant_type=refresh_token',{method:'POST',headers:{apikey:KEY,'Content-Type':'application/json'},body:JSON.stringify({refresh_token:rtoken()})});const d=await readJson(res);if(!res.ok)throw new Error(d?.message||d?.msg||'Unable to refresh session.');storeSession(d);return d.access_token}
async function rest(path,init={},retry=true){let res=await authFetch('/rest/v1/'+path,init);if(res.status===401&&retry&&rtoken()){await refreshToken();res=await authFetch('/rest/v1/'+path,init)}return res}
function node(tag,cls,text){const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=String(text);return e}
function empty(container,text='No records found.'){container.replaceChildren(node('div','empty',text))}
function fmtDate(v){if(!v)return '—';const d=new Date(v);return Number.isNaN(d.valueOf())?String(v):d.toLocaleDateString()}
function money(cents){return new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format((cents||0)/100)}
async function getUser(){let res=await authFetch('/auth/v1/user');if(res.status===401&&rtoken()){await refreshToken();res=await authFetch('/auth/v1/user')}if(!res.ok)throw new Error('Session is not valid.');return await readJson(res)}
async function getProfile(uid){const res=await rest('profiles?id=eq.'+encodeURIComponent(uid)+'&select=id,email,full_name,role,active');if(!res.ok)throw new Error('Unable to verify chairman role.');const rows=await readJson(res);return rows?.[0]||null}
async function gate(){currentUser=await getUser();currentProfile=await getProfile(currentUser.id);if(!currentProfile||currentProfile.role!=='MASTER_ADMIN'||currentProfile.active!==true)throw new Error('This account is not authorized for Chairman Command.');$('who').textContent=(currentProfile.full_name||currentUser.email||'Chairman')+' • authenticated';$('roleChip').textContent=currentProfile.role;$('loginView').classList.add('hidden');$('appView').classList.remove('hidden');await loadAll()}
async function count(table){const res=await rest(table+'?select=id&limit=1',{headers:{Prefer:'count=exact'}});if(!res.ok)return 0;const cr=res.headers.get('content-range')||'';const m=cr.match(/\/(\d+|\*)$/);return m&&m[1]!=='*'?Number(m[1]):0}
async function rows(path){const res=await rest(path);if(!res.ok)return [];const d=await readJson(res);return Array.isArray(d)?d:[]}
async function loadAll(){setStatus('matterStatusMsg','Ready.');const [mc,dc,ec,sc,matters,deadlines,members,messages,resolutions,plans,subs]=await Promise.all([
count('matters'),count('legal_documents'),count('evidence'),count('subscriptions'),
rows('matters?select=id,matter_number,title,matter_type,status,client_name,risk_level,created_at&order=created_at.desc&limit=50'),
rows('deadlines?select=id,title,calculated_date,trigger_date,status,attorney_verified,matter_id&order=calculated_date.asc&limit=30'),
rows('board_members?select=seat_number,display_name,title,domain,is_active&order=seat_number.asc'),
rows('board_messages?select=id,sender_seat,recipient_seat,message_type,subject,body,priority,requires_chairman_attention,created_at&order=created_at.desc&limit=50'),
rows('board_resolutions?select=id,resolution_number,title,description,status,chairman_decision,created_at,decided_at&order=created_at.desc&limit=30'),
rows('subscription_plans?select=id,code,name,monthly_price_cents,active,features&order=monthly_price_cents.asc'),
rows('subscriptions?select=id,user_id,plan_id,status,current_period_end,created_at&order=created_at.desc&limit=500')]);
cache={matters,deadlines,members,messages,resolutions,plans,subs};$('mMatters').textContent=mc;$('mDocs').textContent=dc;$('mEvidence').textContent=ec;$('mSubs').textContent=sc;renderDashboard();renderBoard();renderMatters();renderRevenue()}
function itemBox(title,meta,body,badges=[]){const x=node('div','item');const t=node('div','title',title||'Untitled');x.appendChild(t);if(badges.length){const b=node('div','');b.style.marginTop='6px';for(const z of badges){const s=node('span','badge'+(z.kind?' '+z.kind:''),z.text);b.appendChild(s)}x.appendChild(b)}if(meta)x.appendChild(node('div','meta',meta));if(body)x.appendChild(node('div','body',body));return x}
function renderDashboard(){const d=$('deadlineList'),m=$('matterList'),a=$('attentionList');d.replaceChildren();m.replaceChildren();a.replaceChildren();const today=new Date();today.setHours(0,0,0,0);const upcoming=cache.deadlines.filter(x=>{const v=x.calculated_date||x.trigger_date;if(!v)return false;return new Date(v)>=today}).slice(0,6);if(!upcoming.length)empty(d,'No upcoming deadlines.');for(const x of upcoming)d.appendChild(itemBox(x.title,fmtDate(x.calculated_date||x.trigger_date)+' • '+(x.status||'status not set'),x.attorney_verified?'Attorney verified':'Not attorney verified'));
for(const x of cache.matters.slice(0,6))m.appendChild(itemBox((x.matter_number?x.matter_number+' — ':'')+x.title,(x.matter_type||'matter')+' • '+(x.status||'status not set')+(x.client_name?' • '+x.client_name:''),null,x.risk_level?[{text:'Risk: '+x.risk_level,kind:(x.risk_level==='high'||x.risk_level==='critical')?'risk':''}]:[]));if(!cache.matters.length)empty(m);
const attn=cache.messages.filter(x=>x.requires_chairman_attention).slice(0,8);if(!attn.length)empty(a,'No board messages currently require Chairman attention.');for(const x of attn)a.appendChild(itemBox(x.subject||x.message_type,'Seat '+(x.sender_seat??'—')+' • '+fmtDate(x.created_at),x.body,[{text:x.priority||'normal',kind:'attn'}]));
const pending=cache.resolutions.filter(x=>!x.chairman_decision&&String(x.status||'').toLowerCase()!=='closed').length;const activeMatters=cache.matters.filter(x=>String(x.status).toLowerCase()==='active').length;const thirty=new Date();thirty.setDate(thirty.getDate()+30);const due30=upcoming.filter(x=>new Date(x.calculated_date||x.trigger_date)<=thirty).length;$('briefing').replaceChildren();const p=node('div','brief');p.append('Enterprise status: ');p.appendChild(node('strong','',activeMatters));p.append(' active matters, ');p.appendChild(node('strong','',attn.length));p.append(' board items requiring attention, ');p.appendChild(node('strong','',pending));p.append(' unresolved board resolutions, and ');p.appendChild(node('strong','',due30));p.append(' deadlines due within 30 days.');$('briefing').appendChild(p)}
function renderBoard(){const bm=$('boardMembers'),msg=$('boardMessages'),rs=$('resolutions');bm.replaceChildren();msg.replaceChildren();rs.replaceChildren();if(!cache.members.length)empty(bm);for(const x of cache.members){const box=node('div','item board-seat');box.appendChild(node('div','seat',x.seat_number));const c=node('div','');c.appendChild(node('div','title',x.display_name||('Seat '+x.seat_number)));c.appendChild(node('div','meta',(x.title||'Board Member')+(x.domain?' • '+x.domain:'')+(x.is_active?' • Active':' • Inactive')));box.appendChild(c);bm.appendChild(box)}
if(!cache.messages.length)empty(msg);for(const x of cache.messages.slice(0,18))msg.appendChild(itemBox(x.subject||x.message_type,'Seat '+(x.sender_seat??'—')+' → '+(x.recipient_seat??'Board')+' • '+fmtDate(x.created_at),x.body,[{text:x.priority||'normal',kind:x.requires_chairman_attention?'attn':''},...(x.requires_chairman_attention?[{text:'Chairman attention',kind:'attn'}]:[])]));
if(!cache.resolutions.length)empty(rs);for(const x of cache.resolutions.slice(0,18))rs.appendChild(itemBox((x.resolution_number?x.resolution_number+' — ':'')+x.title,(x.status||'status not set')+' • '+fmtDate(x.created_at)+(x.decided_at?' • decided '+fmtDate(x.decided_at):''),x.description,[{text:x.chairman_decision?'Decision: '+x.chairman_decision:'No Chairman decision',kind:x.chairman_decision?'':'attn'}]))}
function renderMatters(){const c=$('allMatters');c.replaceChildren();if(!cache.matters.length)empty(c);for(const x of cache.matters)c.appendChild(itemBox((x.matter_number?x.matter_number+' — ':'')+x.title,(x.matter_type||'matter')+' • '+(x.status||'status not set')+(x.client_name?' • '+x.client_name:''),'Created '+fmtDate(x.created_at),x.risk_level?[{text:'Risk: '+x.risk_level,kind:(x.risk_level==='high'||x.risk_level==='critical')?'risk':''}]:[]))}
function renderRevenue(){const p=$('plans'),s=$('subStatus');p.replaceChildren();s.replaceChildren();const activePlans=cache.plans.filter(x=>x.active);$('activePlans').textContent=activePlans.length;const activeSubs=cache.subs.filter(x=>String(x.status).toLowerCase()==='active');$('activeSubs').textContent=activeSubs.length;const pm=new Map(cache.plans.map(x=>[x.id,x]));let cents=0;for(const sub of activeSubs)cents+=pm.get(sub.plan_id)?.monthly_price_cents||0;$('mrr').textContent=money(cents);if(!cache.plans.length)empty(p);for(const x of cache.plans)p.appendChild(itemBox(x.name||x.code,(x.active?'Active':'Inactive')+' • '+money(x.monthly_price_cents)+'/month',x.code));const counts={};for(const x of cache.subs){const k=x.status||'unknown';counts[k]=(counts[k]||0)+1}const entries=Object.entries(counts).sort((a,b)=>b[1]-a[1]);if(!entries.length)empty(s);for(const [k,v] of entries)s.appendChild(itemBox(k,String(v)+' subscription'+(v===1?'':'s'),null))}

document.getElementById('loginForm').addEventListener('submit',async e=>{e.preventDefault();setStatus('loginStatus','Signing in and verifying Chairman authority…','warn');const email=$('email').value.trim(),password=$('password').value;try{const res=await fetch(PROJECT+'/auth/v1/token?grant_type=password',{method:'POST',headers:{apikey:KEY,'Content-Type':'application/json'},body:JSON.stringify({email,password})});const d=await readJson(res);$('password').value='';if(!res.ok)throw new Error(d?.message||d?.msg||'Sign-in failed.');storeSession(d);await gate();setStatus('loginStatus','Authorized.','ok')}catch(err){clearSession();setStatus('loginStatus',err.message||'Sign-in failed.','bad')}});
$('logout').addEventListener('click',async()=>{try{if(token())await authFetch('/auth/v1/logout',{method:'POST'})}finally{clearSession();$('appView').classList.add('hidden');$('loginView').classList.remove('hidden');setStatus('loginStatus','Signed out.','ok')}});
$('refreshAll').addEventListener('click',loadAll);
$('nav').addEventListener('click',e=>{const b=e.target.closest('button[data-tab]');if(!b)return;document.querySelectorAll('.nav button').forEach(x=>x.classList.remove('active'));document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));b.classList.add('active');$(b.dataset.tab).classList.add('active')});
$('matterForm').addEventListener('submit',async e=>{e.preventDefault();setStatus('matterStatusMsg','Creating matter…','warn');const payload={matter_number:$('matterNumber').value.trim(),title:$('matterTitle').value.trim(),matter_type:$('matterType').value.trim(),client_name:$('clientName').value.trim()||null,jurisdiction:$('jurisdiction').value.trim()||null,risk_level:$('riskLevel').value||null,status:$('matterStatus').value,summary:$('matterSummary').value.trim()||null,created_by:currentUser.id};try{const res=await rest('matters',{method:'POST',headers:{'Content-Type':'application/json',Prefer:'return=representation'},body:JSON.stringify(payload)});const d=await readJson(res);if(!res.ok)throw new Error(d?.message||'Matter creation failed.');$('matterForm').reset();setStatus('matterStatusMsg','Matter created successfully.','ok');await loadAll()}catch(err){setStatus('matterStatusMsg',err.message||'Matter creation failed.','bad')}});
$('changePasswordForm').addEventListener('submit',async e=>{e.preventDefault();setStatus('securityStatus','Screening new password against breach data…','warn');const password=$('newPassword').value;try{let t=token();let res=await fetch(GUARD,{method:'POST',headers:{apikey:KEY,Authorization:'Bearer '+t,'Content-Type':'application/json'},body:JSON.stringify({action:'change_password',password})});if(res.status===401&&rtoken()){t=await refreshToken();res=await fetch(GUARD,{method:'POST',headers:{apikey:KEY,Authorization:'Bearer '+t,'Content-Type':'application/json'},body:JSON.stringify({action:'change_password',password})})}const d=await readJson(res);$('newPassword').value='';if(!res.ok)throw new Error(d?.message||d?.msg||d?.error||'Password update failed.');setStatus('securityStatus','Chairman password updated.','ok')}catch(err){setStatus('securityStatus',err.message||'Password update failed.','bad')}});
(async()=>{if(token()){try{await gate()}catch{clearSession()}}})();
</script>
</body>
</html>`;

Deno.serve((req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, apikey, content-type", "Access-Control-Allow-Methods": "GET, OPTIONS" } });
  if (req.method !== "GET") return new Response("Method not allowed", { status: 405 });
  return new Response(HTML, { headers: {
    "Content-Type": "text/html; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "no-referrer",
    "Content-Security-Policy": "default-src 'self'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; connect-src https://idpneeyysraraznqmiio.supabase.co; img-src 'self' data:; frame-ancestors 'none'; base-uri 'none'; form-action 'self'",
  }});
});
