/* =========================================================
   DPR Tab — Daily Progress Reports
   Views: list | detail | pdf
   ========================================================= */

const dprState = {
  view: 'list',
  idx: 0,
  sub: 'manpower',   /* manpower | today | tomorrow */
};

function renderDPR() {
  switch (dprState.view) {
    case 'detail': return dprDetail();
    case 'pdf':    return dprPdf();
    default:       return dprList();
  }
}

/* ── List ── */
function dprList() {
  if (!pdata.dpr.length) {
    return `
      <div class="toolbar">
        <h2 style="margin:0;font-size:26px;font-weight:800">DPR Records</h2>
        <button class="btn btn-primary" onclick="toast('Add DPR')">+ Add DPR</button>
      </div>
      <div class="empty">
        <div class="e-icon">📋</div>
        <div class="e-title">No DPR records yet</div>
        <div class="e-sub">Tap "+ Add DPR" to create one</div>
      </div>`;
  }

  const rows = pdata.dpr.map((d, i) => `
    <div class="dpr-rec" onclick="dprState.view='detail';dprState.idx=${i};dprState.sub='manpower';renderActiveTab()">
      <div class="cal">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="30" height="30">
          <rect x="3" y="4" width="18" height="18" rx="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      </div>
      <div style="flex:1">
        <div class="d-date">${d.date}</div>
        <div class="d-meta">
          <span class="mi">
            <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15">
              <path d="M5 3a1 1 0 0 0-1 1v17h6v-3a2 2 0 1 1 4 0v3h6V4a1 1 0 0 0-1-1H5Z"/>
            </svg>
            ${d.agencies} ${d.agencies === 1 ? 'Agency' : 'Agencies'}
          </span>
          <span class="mi">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            ${d.personnel} Personnel
          </span>
        </div>
      </div>
      <span class="chev">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </span>
    </div>`).join('');

  return `
    <div class="toolbar">
      <h2 style="margin:0;font-size:26px;font-weight:800">DPR Records</h2>
      <button class="btn btn-primary" onclick="toast('Add DPR')">+ Add DPR</button>
    </div>
    <div class="list">${rows}</div>`;
}

/* ── Detail ── */
function dprDetail() {
  const d = pdata.dpr[dprState.idx];

  const sub = (id, label) =>
    `<button class="st ${dprState.sub === id ? 'active' : ''}" onclick="dprState.sub='${id}';renderActiveTab()">${label}</button>`;

  let body = '';
  if (dprState.sub === 'manpower') {
    const sk = d.manpower.reduce((a, x) => a + x.skilled, 0);
    const un = d.manpower.reduce((a, x) => a + x.unskilled, 0);
    body = `
      <div class="mp-summary">
        <div><div class="mp-l">SKILLED</div><div class="mp-v blue">${sk}</div></div>
        <div><div class="mp-l">UNSKILLED</div><div class="mp-v amber">${un}</div></div>
        <div><div class="mp-l">TOTAL</div><div class="mp-v green">${sk + un}</div></div>
      </div>
      <div class="list">
        ${d.manpower.map(a => `
          <div class="mp-agency-card">
            <h3>${a.name}</h3>
            <div class="mp-mini">
              <div><div class="l">Skilled</div><div class="v" style="color:var(--primary)">${a.skilled}</div></div>
              <div><div class="l">Unskilled</div><div class="v" style="color:var(--amber)">${a.unskilled}</div></div>
              <div><div class="l">Total</div><div class="v" style="color:var(--success)">${a.skilled + a.unskilled}</div></div>
            </div>
          </div>`).join('')}
      </div>`;
  } else {
    const acts = dprState.sub === 'today' ? d.today : d.tomorrow;
    body = acts.length
      ? `<div class="list">${acts.map(a => `
          <div class="activity-card">
            <h3>${a.name}</h3>
            <p>${a.remarks}</p>
          </div>`).join('')}</div>`
      : emptyText('No activities recorded.');
  }

  return `
    <div class="toolbar">
      <button class="link-btn small" onclick="dprState.view='list';renderActiveTab()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" width="20" height="20" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        Back
        <span style="color:#111;font-weight:700"> DPR - ${d.date}</span>
      </button>
      <button class="btn btn-primary btn-sm" onclick="dprState.view='pdf';renderActiveTab()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="17" height="17"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
        Preview
      </button>
    </div>

    <div class="subtabs">
      ${sub('manpower', 'Manpower')}
      ${sub('today', 'Today Activity')}
      ${sub('tomorrow', 'Tomorrow Activity')}
    </div>

    ${body}`;
}

/* ── PDF preview ── */
function dprPdf() {
  const d = pdata.dpr[dprState.idx];
  const sk = d.manpower.reduce((a, x) => a + x.skilled, 0);
  const un = d.manpower.reduce((a, x) => a + x.unskilled, 0);

  return `
    <div class="doc-toolbar">
      <button class="link-btn" onclick="dprState.view='detail';renderActiveTab()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" width="20" height="20" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        Back
      </button>
      <div style="position:relative">
        <button class="btn btn-amber" onclick="toggleMenu('dprShareMenu')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7"/><polyline points="14 4 20 4 20 10"/><path d="M20 4 9 15"/></svg>
          Share ▾
        </button>
        <div class="menu" id="dprShareMenu">
          <div class="menu-item" onclick="toast('Sharing PDF…');toggleMenu('dprShareMenu')">
            <svg viewBox="0 0 24 24" fill="none" stroke="#e54b4b" stroke-width="2" width="22" height="22"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            Share PDF
          </div>
          <div class="menu-item" onclick="toast('Sharing image…');toggleMenu('dprShareMenu')">
            <svg viewBox="0 0 24 24" fill="none" stroke="#3f4ee8" stroke-width="2" width="22" height="22"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            Share Image
          </div>
        </div>
      </div>
    </div>

    <div class="doc-paper soft-border dpr-doc">
      <div class="dd-head">
        <div>
          <div class="dd-name">SHREEMAY ASSOCIATES</div>
          <div class="dd-sub">DAILY PROGRESS REPORT</div>
        </div>
        <div class="doc-logo">
          <div class="l-name" style="font-family:serif;letter-spacing:4px;font-size:18px;font-weight:700">SHREEMAY</div>
          <div class="l-sub">PROJECT MANAGEMENT | CONSTRUCTION | INTERIORS</div>
        </div>
      </div>
      <hr class="dd-rule">

      <div class="dpr-info">
        ${diRow('PROJECT:',      project.name)}
        ${diRow('DATE:',         d.date)}
        ${diRow('PROJECT ID:',   project.projectId)}
        ${diRow('ASSIGNED TO:',  DB.user.name)}
        ${diRow('CUSTOMER:',     DB.company.customer)}
        ${diRow('PROJECT TYPE:', project.type)}
      </div>

      <div class="dpr-bar">MANPOWER DETAILS</div>
      <table class="dpr-table">
        <thead>
          <tr>
            <th style="width:12%">SR. NO.</th>
            <th style="text-align:left">DESCRIPTION OF AGENCY</th>
            <th>SKILLED LABOR</th>
            <th>UNSKILLED LABOR</th>
            <th>TOTAL</th>
          </tr>
        </thead>
        <tbody>
          ${d.manpower.map((a, i) => `
            <tr>
              <td class="center">${i + 1}</td>
              <td>${a.name}</td>
              <td class="center">${a.skilled}</td>
              <td class="center">${a.unskilled}</td>
              <td class="center">${a.skilled + a.unskilled}</td>
            </tr>`).join('')}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2" class="center">Total No. of Workers</td>
            <td class="center">${sk}</td>
            <td class="center">${un}</td>
            <td class="center">${sk + un}</td>
          </tr>
        </tfoot>
      </table>

      <div class="dpr-bar">TODAY'S ACTIVITY</div>
      ${dprActivityTable(d.today)}

      <div class="dpr-bar">TOMORROW'S ACTIVITY</div>
      ${dprActivityTable(d.tomorrow)}
    </div>`;
}

function diRow(l, v) {
  return `<div class="di-row"><div class="di-label">${l}</div><div>${v}</div></div>`;
}

function dprActivityTable(acts) {
  const rows = acts.map((a, i) =>
    `<tr><td class="center">${i + 1}</td><td>${a.name}</td><td>${a.remarks}</td></tr>`
  ).join('') || `<tr><td class="center">—</td><td>—</td><td>—</td></tr>`;
  return `
    <table class="dpr-table">
      <thead>
        <tr>
          <th style="width:12%">SR. NO.</th>
          <th style="text-align:center">ACTIVITY NAME</th>
          <th style="text-align:center">REMARKS</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>`;
}
