/* =========================================================
   Query Tab — Q&A Sheets
   Views: list | detail | pdf
   ========================================================= */

const queryState = {
  view: 'list',
  queryId: null,
  editMode: false,
};

function renderQuery() {
  switch (queryState.view) {
    case 'detail': return queryDetail();
    case 'pdf':    return queryPdf();
    default:       return queryList();
  }
}

/* ── Query List ── */
function queryList() {
  const rows = pdata.query.map(q => `
    <div class="nav-row boxed"
         onclick="queryState.queryId='${q.id}';queryState.view='detail';queryState.editMode=false;renderActiveTab()">
      <div>
        <div class="nr-title">${q.id}</div>
        <div class="faint" style="font-size:15px;margin-top:6px">${q.date}</div>
      </div>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
        <polyline points="9 18 15 12 9 6"/>
      </svg>
    </div>`).join('') || emptyText('No queries yet. Tap "+ Add Query" to create one.');

  return `
    <div style="display:flex;justify-content:flex-end;margin-bottom:18px">
      <button class="btn btn-primary" onclick="addNewQuery()">+ Add Query</button>
    </div>
    ${rows}`;
}

function addNewQuery() {
  const nextNum = String(pdata.query.length + 1).padStart(4, '0');
  pdata.query.push({
    id: `Query/${nextNum}`,
    date: fmtDMY(new Date()),
    client: 'Siddhart Sarvaiya',
    rows: [],
  });
  toast('Query created');
  renderActiveTab();
}

/* ── Query Detail ── */
function queryDetail() {
  const q = curQuery();
  if (!q) { queryState.view = 'list'; return queryList(); }

  return `
    <!-- toolbar -->
    <div class="toolbar">
      <button class="link-btn small" onclick="queryState.view='list';renderActiveTab()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" width="20" height="20" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>
        Back
      </button>
      <button class="btn btn-primary btn-sm" onclick="queryState.view='pdf';renderActiveTab()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="17" height="17"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
        Preview
      </button>
    </div>

    <!-- meta card -->
    <div class="info-card" style="margin-bottom:24px">
      <div class="query-meta-row">
        <span class="qm-label">Query No</span>
        <span class="qm-value">${q.id}</span>
      </div>
      <div class="query-meta-row">
        <span class="qm-label">Query Date</span>
        <span class="qm-value">${q.date}</span>
      </div>
      <div style="display:flex;justify-content:flex-end;margin-top:14px">
        <button class="btn btn-primary btn-sm" onclick="showDatePicker('${q.date}', v=>{ curQuery().date=v; renderActiveTab(); })">Edit Date</button>
      </div>
    </div>

    <!-- Q&A section -->
    ${queryRepliesBlock(q)}`;
}

function queryRepliesBlock(q) {
  const hasRows = q.rows.length > 0;
  const header = `
    <div class="section-head" style="margin-bottom:16px">
      <h2 style="font-size:24px">Query &amp; Replies</h2>
      <button class="icon-btn-danger" onclick="clearQueryRows('${q.id}')" aria-label="Clear all replies" title="Clear all">${icon('trash')}</button>
    </div>`;

  if (queryState.editMode) {
    /* Edit mode: inline inputs */
    const tableRows = q.rows.map((r, i) => `
      <div class="q-row">
        <div class="q-row-num">${i + 1}</div>
        <div class="q-row-cell"><input class="input" id="qRow_q_${i}" value="${escHtml(r.q)}"></div>
        <div class="q-row-cell"><input class="input" id="qRow_r_${i}" value="${escHtml(r.r)}"></div>
      </div>`).join('');

    return header + `
      <div class="toolbar" style="margin-bottom:14px">
        <button class="btn btn-ghost btn-sm" onclick="queryAddRow('${q.id}')">+ Add Row</button>
        <div style="display:flex;gap:10px">
          <button class="btn btn-light btn-sm" onclick="queryState.editMode=false;renderActiveTab()">Cancel</button>
          <button class="btn btn-primary btn-sm" onclick="querySaveRows('${q.id}')">Save</button>
        </div>
      </div>
      <div class="q-table">
        <div class="q-table-head">
          <div class="q-row-num">Sr.</div>
          <div class="q-row-cell">Query</div>
          <div class="q-row-cell">Reply</div>
        </div>
        ${tableRows || '<div class="empty-text" style="padding:20px 16px">No rows yet. Tap "+ Add Row".</div>'}
      </div>`;
  }

  /* View mode */
  const editBtn = `
    <div style="display:flex;justify-content:flex-end;margin-bottom:14px">
      <button class="btn btn-primary btn-sm" onclick="queryState.editMode=true;renderActiveTab()">Edit Replies</button>
    </div>`;

  if (!hasRows) {
    return header + editBtn + `<p class="empty-text">No query-reply pairs yet. Click "Edit Replies" to add.</p>`;
  }

  const tableRows = q.rows.map((r, i) => `
    <div class="q-row">
      <div class="q-row-num">${i + 1}</div>
      <div class="q-row-cell"><div class="pseudo-input">${escHtml(r.q)}</div></div>
      <div class="q-row-cell"><div class="pseudo-input">${escHtml(r.r)}</div></div>
    </div>`).join('');

  return header + editBtn + `
    <div class="q-table">
      <div class="q-table-head">
        <div class="q-row-num">Sr.</div>
        <div class="q-row-cell">Query</div>
        <div class="q-row-cell">Reply</div>
      </div>
      ${tableRows}
    </div>`;
}

/* row actions */
function queryAddRow(id) {
  const q = pdata.query.find(x => x.id === id);
  if (q) q.rows.push({ q: '', r: '' });
  renderActiveTab();
}
function querySaveRows(id) {
  const q = pdata.query.find(x => x.id === id);
  if (!q) return;
  q.rows = q.rows.map((r, i) => ({
    q: document.getElementById(`qRow_q_${i}`)?.value || r.q,
    r: document.getElementById(`qRow_r_${i}`)?.value || r.r,
  }));
  queryState.editMode = false;
  toast('Query saved');
  renderActiveTab();
}
function clearQueryRows(id) {
  const q = pdata.query.find(x => x.id === id);
  if (q) q.rows = [];
  queryState.editMode = false;
  toast('Cleared');
  renderActiveTab();
}

/* ── Query PDF ── */
function queryPdf() {
  const q = curQuery();
  return `
    <div class="doc-toolbar">
      <button class="link-btn" onclick="queryState.view='detail';renderActiveTab()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" width="20" height="20" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>
        Back
      </button>
      <div style="position:relative">
        <button class="btn btn-amber" onclick="toggleMenu('qShareMenu')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7"/><polyline points="14 4 20 4 20 10"/><path d="M20 4 9 15"/></svg>
          Share ▾
        </button>
        <div class="menu" id="qShareMenu">
          <div class="menu-item" onclick="toast('Sharing PDF…');toggleMenu('qShareMenu')">
            <svg viewBox="0 0 24 24" fill="none" stroke="#e54b4b" stroke-width="2" width="22" height="22"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            Share PDF
          </div>
          <div class="menu-item" onclick="toast('Sharing image…');toggleMenu('qShareMenu')">
            <svg viewBox="0 0 24 24" fill="none" stroke="#3f4ee8" stroke-width="2" width="22" height="22"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            Share Image
          </div>
        </div>
      </div>
    </div>

    <div class="doc-paper soft-border" style="font-family:serif">
      <div style="display:flex;justify-content:space-between;align-items:flex-start">
        <div>
          <div style="font-size:17px;font-weight:800;letter-spacing:.3px">SHREEMAY ASSOCIATES</div>
          <div style="font-size:10px;letter-spacing:.5px;color:#444;margin-top:2px">PROJECT MANAGEMENT | CONSTRUCTION | INTERIORS</div>
        </div>
        <div style="text-align:right">
          <div style="font-family:serif;letter-spacing:3px;font-size:16px;font-weight:700">SHREEMAY</div>
          <div style="font-size:7px;letter-spacing:.4px;color:#555">PROJECT MANAGEMENT | CONSTRUCTION | INTERIORS</div>
        </div>
      </div>
      <hr style="border:0;border-top:1px solid #111;margin:12px 0">

      <div style="text-align:center">
        <span style="border:1.5px solid #111;padding:7px 16px;font-size:20px;font-weight:800;letter-spacing:.5px">QUERY SHEET</span>
        <div style="font-weight:700;margin-top:10px;font-size:14px">PROJECT: ${project.name}</div>
      </div>

      <table class="qs-meta" style="margin-top:12px">
        <tr>
          <td style="width:50%;font-size:13px"><b>DATE:</b> ${q.date}</td>
          <td style="text-align:right;font-size:13px"><b>CLIENT:</b> ${q.client}</td>
        </tr>
      </table>

      <div style="font-weight:800;font-size:13px;margin:14px 0 8px;border-left:4px solid #111;padding-left:8px;letter-spacing:.3px">
        PLEASE FURNISH US WITH THE FOLLOWING INFORMATION
      </div>

      <table class="doc-table">
        <thead>
          <tr>
            <th style="width:50%;text-align:center">QUERY</th>
            <th style="text-align:center">REPLY</th>
          </tr>
        </thead>
        <tbody>
          ${q.rows.length
            ? q.rows.map((r, i) => `<tr><td>${i + 1}. ${escHtml(r.q)}</td><td>${escHtml(r.r)}</td></tr>`).join('')
            : `<tr><td>&nbsp;</td><td></td></tr>`}
        </tbody>
      </table>

      <div style="text-align:right;font-size:11px;font-weight:700;margin-top:20px">Page 1 of 1</div>
    </div>`;
}

/* helpers */
function curQuery() { return pdata.query.find(q => q.id === queryState.queryId); }
function escHtml(s) { return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
