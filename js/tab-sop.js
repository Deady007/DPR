/* =========================================================
   SOP Tab — Standard Operating Procedures
   Views: list | detail | pdf
   Sub-tabs: checkpoints | agencies
   ========================================================= */

const sopState = {
  view: 'list',
  sopId: null,
  sub: 'checkpoints',     /* checkpoints | agencies */
  editMode: false,        /* checkpoints edit mode */
};

function renderSOP() {
  switch (sopState.view) {
    case 'detail': return sopDetail();
    case 'pdf':    return sopPdf();
    default:       return sopList();
  }
}

/* ── SOP List ── */
function sopList() {
  const rows = pdata.sop.map(s => `
    <div style="display:flex;align-items:center;justify-content:space-between;
                padding:22px 2px;border-bottom:1px solid var(--line);cursor:pointer"
         onclick="sopState.sopId='${s.id}';sopState.view='detail';sopState.sub='checkpoints';sopState.editMode=false;renderActiveTab()">
      <div>
        <div style="color:var(--link);font-weight:800;font-size:21px">${s.id}</div>
        <div class="muted" style="margin-top:8px;font-size:16px">Structure: ${s.structure}</div>
        <div class="faint" style="font-size:14px;margin-top:5px">${s.date}</div>
      </div>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
        <polyline points="9 18 15 12 9 6"/>
      </svg>
    </div>`).join('') || emptyText('No SOPs yet. Tap "+ Add SOP" to create one.');

  return `
    <div style="display:flex;justify-content:flex-end;margin-bottom:18px">
      <button class="btn btn-primary" onclick="openAddSop()">+ Add SOP</button>
    </div>
    ${rows}`;
}

/* ── SOP Detail ── */
function sopDetail() {
  const s = curSop();
  if (!s) { sopState.view = 'list'; return sopList(); }

  const seg = (id, label, n) =>
    `<button class="seg ${sopState.sub === id ? 'active' : ''}"
             onclick="sopState.sub='${id}';sopState.editMode=false;renderActiveTab()">
       ${label} <span class="pill">${n}</span>
     </button>`;

  return `
    <!-- toolbar -->
    <div class="toolbar">
      <button class="link-btn small" onclick="sopState.view='list';renderActiveTab()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" width="20" height="20" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>
        Back
      </button>
      <button class="btn btn-primary btn-sm" onclick="sopState.view='pdf';renderActiveTab()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="17" height="17"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
        Preview
      </button>
    </div>

    <!-- info card -->
    <div class="doc-title">${s.id}</div>
    <div class="doc-date">${s.date}</div>
    <div class="info-card" style="margin-bottom:24px">
      <div class="info-grid">
        <div>
          <div class="ig-label">STRUCTURE</div>
          <div class="ig-box">${s.structure}</div>
        </div>
        <div>
          <div class="ig-label">AGENCIES</div>
          <div class="ig-box" style="font-size:15px">${s.agencies.join(', ')}</div>
        </div>
      </div>
      <div style="margin-top:18px">
        <div class="ig-label">DATE</div>
        <div class="ig-box" style="max-width:220px">${s.date}</div>
      </div>
      <button class="btn btn-primary" style="margin-top:18px" onclick="toast('Edit details')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="17" height="17"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
        Edit Details
      </button>
    </div>

    <hr class="soft">

    <!-- segment -->
    <div class="segment">
      ${seg('checkpoints', 'Checkpoints', s.checkpoints.length)}
      ${seg('agencies',    'Agencies',    s.agencyList.length)}
    </div>

    <!-- panel content -->
    ${sopState.sub === 'checkpoints' ? sopCheckpoints(s) : sopAgencies(s)}`;
}

/* Checkpoints panel */
function sopCheckpoints(s) {
  const header = `
    <div class="section-head" style="margin-bottom:16px">
      <h2 style="font-size:22px">Checkpoint Items</h2>
      ${sopState.editMode
        ? `<button class="btn btn-amber btn-sm" onclick="sopSaveCheckpoints()">Save</button>`
        : `<button class="btn btn-ghost btn-sm" onclick="sopState.editMode=true;renderActiveTab()">Edit</button>`}
    </div>`;

  if (!s.checkpoints.length) {
    return header + emptyText('No checkpoints in this SOP.');
  }

  const items = s.checkpoints.map((c, i) => `
    <div class="checkpoint-item">
      <div class="cp-head">
        <span class="point-num">${i + 1}</span>
        <span class="point-label">Checkpoint</span>
      </div>
      <div class="cp-text">${c}</div>
      <div class="field-2" style="margin-bottom:0">
        <div>
          <div class="point-sub-label" style="margin-top:0">STATUS</div>
          ${sopState.editMode
            ? `<input class="input" id="cpSt_${i}" placeholder="e.g. OK / NA">`
            : `<div class="point-body" style="color:var(--muted)">—</div>`}
        </div>
        <div>
          <div class="point-sub-label" style="margin-top:0">REMARKS</div>
          ${sopState.editMode
            ? `<input class="input" id="cpRem_${i}" placeholder="Add remarks…">`
            : `<div class="point-body" style="color:var(--muted)">—</div>`}
        </div>
      </div>
    </div>`).join('');

  return header + items;
}
function sopSaveCheckpoints() {
  sopState.editMode = false;
  toast('Checkpoints saved');
  renderActiveTab();
}

/* Agencies panel */
function sopAgencies(s) {
  return s.agencyList.map(a => `
    <div class="agency-card">
      <div class="agency-top">
        <div class="agency-id">
          <span class="agency-ic">
            <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
              <path d="M5 3a1 1 0 0 0-1 1v17h6v-3a2 2 0 1 1 4 0v3h6V4a1 1 0 0 0-1-1H5Z"/>
            </svg>
          </span>
          <span class="point-label">Agency</span>
        </div>
        <div class="agency-actions">
          ${a.signed
            ? `<span class="badge-signed">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" width="16" height="16"><polyline points="20 6 9 17 4 12"/></svg>
                Signed
               </span>
               <button class="sq-btn sq-view" onclick="toast('View signature — ${a.name}')">
                 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
               </button>
               <button class="sq-btn sq-resign" onclick="openSign('${a.name}', ()=>setAgencySigned('${a.code}',true))">
                 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
               </button>`
            : `<button class="btn btn-primary btn-sm" onclick="openSign('${a.name}', ()=>setAgencySigned('${a.code}',true))">
                 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                 Sign
               </button>`}
        </div>
      </div>
      <div>
        <div class="agency-name">${a.name}</div>
        <div class="agency-code">Code: ${a.code}</div>
      </div>
    </div>`).join('');
}

function setAgencySigned(code, val) {
  const s = curSop();
  const a = s?.agencyList.find(x => x.code === code);
  if (a) a.signed = val;
  renderActiveTab();
}

/* ── SOP PDF ── */
function sopPdf() {
  const s = curSop();
  return `
    <div class="doc-toolbar">
      <button class="link-btn" onclick="sopState.view='detail';renderActiveTab()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" width="20" height="20" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>
        Back
      </button>
      <div style="position:relative">
        <button class="btn btn-amber" onclick="toggleMenu('sopShareMenu')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7"/><polyline points="14 4 20 4 20 10"/><path d="M20 4 9 15"/></svg>
          Share ▾
        </button>
        <div class="menu" id="sopShareMenu">
          <div class="menu-item" onclick="toast('Sharing PDF…');toggleMenu('sopShareMenu')">
            <svg viewBox="0 0 24 24" fill="none" stroke="#e54b4b" stroke-width="2" width="22" height="22"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            Share PDF
          </div>
          <div class="menu-item" onclick="toast('Sharing image…');toggleMenu('sopShareMenu')">
            <svg viewBox="0 0 24 24" fill="none" stroke="#3f4ee8" stroke-width="2" width="22" height="22"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            Share Image
          </div>
        </div>
      </div>
    </div>

    <div class="doc-paper soft-border">
      <!-- Letterhead -->
      <div class="doc-letterhead">
        <div class="doc-brand">
          <div class="b-name">SHREEMAY ASSOCIATES</div>
          <div class="b-sub">PROJECT MANAGEMENT | CONSTRUCTION | INTERIORS</div>
        </div>
        <div class="doc-logo">
          <div style="font-family:serif;letter-spacing:4px;font-size:17px;font-weight:700">SHREEMAY</div>
          <div style="font-size:7px;letter-spacing:.4px;color:#555">PROJECT MANAGEMENT | CONSTRUCTION | INTERIORS</div>
        </div>
      </div>
      <hr style="border:0;border-top:1px solid #111;margin:12px 0">

      <!-- Title -->
      <div style="text-align:center">
        <span style="border:1.5px solid #111;padding:8px 18px;font-size:20px;font-weight:800;font-family:serif;letter-spacing:.5px">CHECKPOINT</span>
      </div>

      <!-- Meta -->
      <table class="qs-meta" style="margin-top:14px;font-family:serif">
        <tr>
          <td style="width:20%"><b>Project</b></td>
          <td style="width:30%">${project.name}</td>
          <td style="width:20%"><b>Date</b></td>
          <td>${toISO(s.date)}</td>
        </tr>
        <tr>
          <td><b>Structure</b></td>
          <td>${s.structure}</td>
          <td><b>Drg.Ref.No.</b></td>
          <td>${s.id}</td>
        </tr>
      </table>

      <!-- Checkpoints table -->
      <table class="doc-table" style="font-family:serif;margin-top:4px">
        <thead>
          <tr>
            <th style="width:12%">Sr No.</th>
            <th>Checkpoints</th>
            <th style="width:18%">Status</th>
            <th style="width:24%">Remarks</th>
          </tr>
        </thead>
        <tbody>
          ${s.checkpoints.map((c, i) => {
            const isHeader = i < 2; /* first 2 are unlabelled section headers */
            return `<tr>
              <td style="text-align:center">${isHeader ? '' : i - 1}</td>
              <td>${c}</td>
              <td></td>
              <td></td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>

      <div style="text-align:right;font-size:11px;font-weight:700;margin-top:20px">Page 1 of 1</div>
    </div>`;
}

/* helpers */
function curSop() { return pdata.sop.find(s => s.id === sopState.sopId); }
function toISO(dmy) {
  const r = /(\d{2})\/(\d{2})\/(\d{4})/.exec(dmy);
  return r ? `${r[3]}-${r[2]}-${r[1]}` : dmy;
}
