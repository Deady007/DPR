/* =========================================================
   Shared app behaviours
   ========================================================= */

/* ---- URL params ---- */
function qp(name, fallback) {
  const v = new URLSearchParams(location.search).get(name);
  return v === null ? (fallback ?? null) : v;
}
function go(url) { location.href = url; }

/* ---- Status bar (simulated) ---- */
function statusBarHTML() {
  const now = new Date();
  const t = now.getHours().toString().padStart(2, "0") + ":" + now.getMinutes().toString().padStart(2, "0");
  return `
  <div class="statusbar">
    <span class="sb-time">${t}</span>
    <span class="sb-right">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2"/><path d="M5 3 2 6"/><path d="M22 6l-3-3"/></svg>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 12l5-3"/></svg>
      <span class="sb-net"><b>VoNR2</b></span>
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M2 17h3v3H2zM7 13h3v7H7zM12 9h3v11h-3zM17 5h3v15h-3z"/></svg>
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M2 17h3v3H2zM7 13h3v7H7zM12 9h3v11h-3zM17 5h3v15h-3z"/></svg>
    </span>
  </div>`;
}

/* ---- Top app bar (with hamburger -> opens drawer) ---- */
function appBarHTML(title, opts = {}) {
  const left = opts.back
    ? `<button class="icon-btn" onclick="${opts.back === true ? 'history.back()' : `go('${opts.back}')`}" aria-label="Back">${icon('back')}</button>`
    : `<button class="icon-btn" onclick="openDrawer()" aria-label="Menu">${icon('menu')}</button>`;
  return `<header class="appbar">${left}<h1>${title}</h1></header>`;
}

/* ---- Side drawer ---- */
function drawerHTML() {
  return `
  <div class="overlay" id="drawerOverlay" onclick="if(event.target===this)closeDrawer()">
    <nav class="drawer" role="menu">
      <div class="d-head">
        <div class="dh-title">${DB.user.name}</div>
        <div class="dh-sub">${DB.company.name}</div>
      </div>
      <div class="d-item" onclick="go('index.html')">${icon('list')} Dashboard</div>
      <div class="d-item" onclick="go('mom.html')">${icon('file')} Minutes Of Meeting</div>
      <div class="d-item" onclick="go('projects.html')">${icon('checkSquare')} My Projects</div>
      <div class="d-item" onclick="closeDrawer()">${icon('refresh')} Refresh</div>
      <div class="d-item" onclick="go('index.html')">${icon('back')} Logout</div>
    </nav>
  </div>`;
}
function openDrawer() { document.getElementById('drawerOverlay')?.classList.add('open'); }
function closeDrawer() { document.getElementById('drawerOverlay')?.classList.remove('open'); }

/* ---- Nav gesture bar ---- */
function gestureBarHTML() { return `<div class="navbar-gesture"></div>`; }

/* ---- Generic overlay open/close ---- */
function openOverlay(id) { document.getElementById(id)?.classList.add('open'); }
function closeOverlay(id) { document.getElementById(id)?.classList.remove('open'); }
function overlayBackdrop(e, id) { if (e.target === e.currentTarget) closeOverlay(id); }

/* ---- Toast ---- */
let _toastTimer;
function toast(msg) {
  let el = document.getElementById('toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'toast';
    el.style.cssText = 'position:absolute;left:50%;bottom:70px;transform:translateX(-50%);background:#1f2937;color:#fff;padding:12px 20px;border-radius:10px;font-size:15px;z-index:200;box-shadow:0 8px 24px rgba(0,0,0,.3);opacity:0;transition:opacity .2s;max-width:80%;text-align:center;';
    (document.querySelector('.app') || document.body).appendChild(el);
  }
  el.textContent = msg;
  el.style.opacity = '1';
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => { el.style.opacity = '0'; }, 1800);
}

/* =========================================================
   Signature pad
   ========================================================= */
function SignaturePad(canvas) {
  const ctx = canvas.getContext('2d');
  let drawing = false, last = null, hasInk = false;

  function resize() {
    const ratio = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * ratio;
    canvas.height = rect.height * ratio;
    ctx.scale(ratio, ratio);
    ctx.lineWidth = 2.4; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.strokeStyle = '#111';
  }
  function pos(e) {
    const rect = canvas.getBoundingClientRect();
    const p = e.touches ? e.touches[0] : e;
    return { x: p.clientX - rect.left, y: p.clientY - rect.top };
  }
  function start(e) { e.preventDefault(); drawing = true; last = pos(e); dot(last); }
  function move(e) {
    if (!drawing) return; e.preventDefault();
    const p = pos(e);
    ctx.beginPath(); ctx.moveTo(last.x, last.y); ctx.lineTo(p.x, p.y); ctx.stroke();
    last = p; hasInk = true;
  }
  function dot(p) { ctx.beginPath(); ctx.arc(p.x, p.y, 1.2, 0, Math.PI * 2); ctx.fill(); hasInk = true; }
  function end() { drawing = false; }

  canvas.addEventListener('mousedown', start);
  canvas.addEventListener('mousemove', move);
  window.addEventListener('mouseup', end);
  canvas.addEventListener('touchstart', start, { passive: false });
  canvas.addEventListener('touchmove', move, { passive: false });
  canvas.addEventListener('touchend', end);

  setTimeout(resize, 30);
  return {
    clear() { ctx.clearRect(0, 0, canvas.width, canvas.height); hasInk = false; },
    isEmpty() { return !hasInk; },
    resize,
  };
}

/* =========================================================
   Material-style date picker (returns dd/mm/yyyy)
   ========================================================= */
function showDatePicker(initial, onPick) {
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const dows = ["S","M","T","W","T","F","S"];
  let view = initial ? parseDMY(initial) : new Date();
  let sel = initial ? parseDMY(initial) : new Date();

  let host = document.getElementById('dpHost');
  if (!host) {
    host = document.createElement('div');
    host.id = 'dpHost';
    (document.querySelector('.app') || document.body).appendChild(host);
  }

  function render() {
    const y = view.getFullYear(), m = view.getMonth();
    const first = new Date(y, m, 1).getDay();
    const days = new Date(y, m + 1, 0).getDate();
    let cells = '';
    for (let i = 0; i < first; i++) cells += `<div class="day"></div>`;
    for (let d = 1; d <= days; d++) {
      const isSel = sel.getFullYear() === y && sel.getMonth() === m && sel.getDate() === d;
      cells += `<div class="day ${isSel ? 'selected' : ''}"><button data-d="${d}">${d}</button></div>`;
    }
    const dowRow = dows.map(d => `<div class="dow">${d}</div>`).join('');
    host.innerHTML = `
    <div class="overlay open" onclick="if(event.target===this)document.getElementById('dpHost').innerHTML=''">
      <div class="datepick">
        <div class="dp-head">
          <div class="dp-year">${sel.getFullYear()}</div>
          <div class="dp-day">${["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][sel.getDay()]}, ${months[sel.getMonth()].slice(0,3)} ${sel.getDate()}</div>
        </div>
        <div class="dp-body">
          <div class="dp-nav">
            <button id="dpPrev">${icon('chevLeft')}</button>
            <span class="dp-title">${months[m]} ${y}</span>
            <button id="dpNext">${icon('chevRight')}</button>
          </div>
          <div class="dp-grid">${dowRow}${cells}</div>
        </div>
        <div class="dp-foot">
          <button id="dpCancel">CANCEL</button>
          <button id="dpOk">OK</button>
        </div>
      </div>
    </div>`;
    host.querySelector('#dpPrev').onclick = () => { view = new Date(y, m - 1, 1); render(); };
    host.querySelector('#dpNext').onclick = () => { view = new Date(y, m + 1, 1); render(); };
    host.querySelectorAll('.day button').forEach(b => b.onclick = () => {
      sel = new Date(y, m, parseInt(b.dataset.d)); render();
    });
    host.querySelector('#dpCancel').onclick = () => host.innerHTML = '';
    host.querySelector('#dpOk').onclick = () => {
      host.innerHTML = '';
      onPick(fmtDMY(sel));
    };
  }
  render();
}
function parseDMY(s) {
  const m = /(\d{2})\/(\d{2})\/(\d{4})/.exec(s);
  if (!m) return new Date();
  return new Date(+m[3], +m[2] - 1, +m[1]);
}
function fmtDMY(d) {
  return String(d.getDate()).padStart(2, "0") + "/" + String(d.getMonth() + 1).padStart(2, "0") + "/" + d.getFullYear();
}

/* ---- Mount common chrome: call mountShell({title, back}) ---- */
function mountShell(content, opts = {}) {
  const app = document.querySelector('.app');
  app.innerHTML =
    statusBarHTML() +
    appBarHTML(opts.title || '', opts) +
    content +
    drawerHTML() +
    gestureBarHTML();
}

/* Esc closes overlays */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') document.querySelectorAll('.overlay.open').forEach(o => o.classList.remove('open'));
});
