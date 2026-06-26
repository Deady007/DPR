/* =========================================================
   Pending Work Points Tab
   Views: list | detail | form
   ========================================================= */

const pendingState = {
  view: 'list',
  itemId: null,
  isNew: false,
};

function renderPending() {
  switch (pendingState.view) {
    case 'detail': return pendingDetail();
    case 'form':   return pendingForm();
    default:       return pendingList();
  }
}

/* ── List ── */
function pendingList() {
  const items = pdata.pendingWorks;
  const open   = items.filter(x => x.status !== 'Done').length;
  const rows = items.map(p => `
    <div class="pw-card" onclick="pendingState.itemId='${p.id}';pendingState.view='detail';renderActiveTab()">
      <div class="pw-card-top">
        <span class="badge-pill ${priorityClass(p.priority)}">${p.priority}</span>
        <span class="badge-pill ${statusClass(p.status)}">${p.status}</span>
      </div>
      <div class="pw-title">${escPending(p.title)}</div>
      ${p.dueDate ? `<div class="pw-due">Due: ${p.dueDate}</div>` : ''}
      ${p.attachments.length ? `<div class="pw-att-count">${p.attachments.length} attachment${p.attachments.length > 1 ? 's' : ''}</div>` : ''}
    </div>`).join('') || emptyText('No pending work points. Tap "+ Add" to create one.');

  return `
    <div class="pw-list-header">
      <div>
        <div style="font-size:22px;font-weight:800">Work Points</div>
        <div class="faint" style="font-size:14px;margin-top:2px">${open} open · ${items.length} total</div>
      </div>
      <button class="btn btn-primary btn-sm" onclick="pendingNewForm()">+ Add</button>
    </div>
    <div class="pw-filter-row">
      ${['All','Open','In Progress','Done'].map(f => `
        <button class="pw-filter ${pendingState.filter===f?'active':''}" onclick="pendingSetFilter('${f}')">${f}</button>`).join('')}
    </div>
    <div id="pwRows">${rows}</div>`;
}

const _pwFiltered = [];
pendingState.filter = 'All';
function pendingSetFilter(f) {
  pendingState.filter = f;
  const items = f === 'All'
    ? pdata.pendingWorks
    : pdata.pendingWorks.filter(p => p.status === f);
  const html = items.map(p => `
    <div class="pw-card" onclick="pendingState.itemId='${p.id}';pendingState.view='detail';renderActiveTab()">
      <div class="pw-card-top">
        <span class="badge-pill ${priorityClass(p.priority)}">${p.priority}</span>
        <span class="badge-pill ${statusClass(p.status)}">${p.status}</span>
      </div>
      <div class="pw-title">${escPending(p.title)}</div>
      ${p.dueDate ? `<div class="pw-due">Due: ${p.dueDate}</div>` : ''}
    </div>`).join('') || emptyText(`No ${f.toLowerCase()} items.`);

  /* re-render just the rows for instant filter feel */
  const el = document.getElementById('pwRows');
  if (el) { el.innerHTML = html; }
  /* also update filter buttons */
  document.querySelectorAll('.pw-filter').forEach(b => b.classList.toggle('active', b.textContent === f));
}

/* ── Detail ── */
function pendingDetail() {
  const p = curPending();
  if (!p) { pendingState.view = 'list'; return pendingList(); }

  const attRows = p.attachments.map((a, i) => `
    <div class="pw-att-row">
      <span class="file-icon" style="width:24px;height:24px">${fileIcon({ name: a.name })}</span>
      <span class="pw-att-name">${escPending(a.name)}</span>
      <button class="icon-btn-danger" onclick="pendingDeleteAtt('${p.id}',${i})" title="Remove">${icon('trash')}</button>
    </div>`).join('');

  return `
    <div class="toolbar">
      <button class="link-btn small" onclick="pendingState.view='list';renderActiveTab()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" width="20" height="20" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>
        Back
      </button>
      <button class="btn btn-primary btn-sm" onclick="pendingEditForm('${p.id}')">Edit</button>
    </div>

    <div class="info-card" style="margin-bottom:20px">
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px">
        <span class="badge-pill ${priorityClass(p.priority)}">${p.priority} Priority</span>
        <span class="badge-pill ${statusClass(p.status)}">${p.status}</span>
      </div>
      <div style="font-size:20px;font-weight:800;margin-bottom:10px;line-height:1.35">${escPending(p.title)}</div>
      ${p.dueDate ? `<div class="pw-due" style="margin-bottom:10px">Due: ${p.dueDate}</div>` : ''}
      ${p.description ? `<div style="font-size:16px;color:var(--ink-soft);line-height:1.6">${escPending(p.description)}</div>` : ''}
    </div>

    <div class="section-head" style="margin-bottom:12px">
      <h2 style="font-size:20px">Attachments</h2>
      <label class="btn btn-ghost btn-sm" style="cursor:pointer">
        + Add File
        <input type="file" style="display:none" onchange="pendingAddAtt('${p.id}',this)">
      </label>
    </div>
    ${attRows || `<p class="empty-text">No attachments.</p>`}`;
}

/* ── Add / Edit Form ── */
function pendingNewForm() {
  pendingState.isNew = true;
  pendingState.itemId = null;
  pendingState.view = 'form';
  renderActiveTab();
}
function pendingEditForm(id) {
  pendingState.isNew = false;
  pendingState.itemId = id;
  pendingState.view = 'form';
  renderActiveTab();
}

function pendingForm() {
  const p = pendingState.isNew ? null : curPending();
  const title       = p?.title       || '';
  const description = p?.description || '';
  const priority    = p?.priority    || 'Medium';
  const status      = p?.status      || 'Open';
  const dueDate     = p?.dueDate     || '';

  const priorities = ['High', 'Medium', 'Low'];
  const statuses   = ['Open', 'In Progress', 'Done'];

  return `
    <div class="toolbar">
      <button class="link-btn small" onclick="pendingState.view=${pendingState.isNew ? "'list'" : "'detail'"};renderActiveTab()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" width="20" height="20" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>
        Back
      </button>
      <span style="font-weight:800;font-size:18px">${pendingState.isNew ? 'New Work Point' : 'Edit Work Point'}</span>
      <span></span>
    </div>

    <div class="field">
      <label class="item-label">Title <span class="req">*</span></label>
      <input class="input" id="pw_title" value="${escAttr(title)}" placeholder="Describe the pending work…">
    </div>

    <div class="field">
      <label class="item-label">Description</label>
      <textarea class="input" id="pw_desc" rows="3" placeholder="Add more detail…">${escPending(description)}</textarea>
    </div>

    <div class="field-2">
      <div>
        <label class="item-label">Priority</label>
        <select class="input select" id="pw_priority">
          ${priorities.map(pr => `<option value="${pr}" ${priority===pr?'selected':''}>${pr}</option>`).join('')}
        </select>
      </div>
      <div>
        <label class="item-label">Status</label>
        <select class="input select" id="pw_status">
          ${statuses.map(st => `<option value="${st}" ${status===st?'selected':''}>${st}</option>`).join('')}
        </select>
      </div>
    </div>

    <div class="field">
      <label class="item-label">Due Date</label>
      <div class="pseudo-input select-look" id="pw_dueDateBtn" onclick="pickPendingDate()">
        <span id="pw_dueDateVal" class="${dueDate ? '' : 'ph'}">${dueDate || 'Select date'}</span>
      </div>
    </div>

    <div class="form-actions" style="margin-top:24px">
      <button class="btn btn-light" onclick="pendingState.view=${pendingState.isNew ? "'list'" : "'detail'"};renderActiveTab()">Cancel</button>
      <button class="btn btn-primary" onclick="pendingSave()">Save</button>
    </div>
    ${!pendingState.isNew ? `
    <div style="margin-top:16px;text-align:center">
      <button class="btn btn-danger btn-sm" onclick="pendingDelete('${p.id}')">Delete Work Point</button>
    </div>` : ''}`;
}

/* ── CRUD helpers ── */
function pendingSave() {
  const title = document.getElementById('pw_title')?.value.trim();
  if (!title) { toast('Title is required'); return; }
  const priority = document.getElementById('pw_priority')?.value;
  const status   = document.getElementById('pw_status')?.value;
  const desc     = document.getElementById('pw_desc')?.value.trim();
  const dueVal   = document.getElementById('pw_dueDateVal')?.textContent;
  const dueDate  = dueVal === 'Select date' ? '' : dueVal;

  if (pendingState.isNew) {
    pdata.pendingWorks.push({
      id: 'pw' + Date.now(),
      title, priority, status, dueDate, description: desc, attachments: [],
    });
    toast('Work point added');
    pendingState.view = 'list';
  } else {
    const p = curPending();
    if (!p) return;
    p.title = title; p.priority = priority; p.status = status;
    p.dueDate = dueDate; p.description = desc;
    toast('Saved');
    pendingState.view = 'detail';
  }
  renderActiveTab();
}

function pendingDelete(id) {
  pdata.pendingWorks = pdata.pendingWorks.filter(p => p.id !== id);
  pendingState.view = 'list';
  toast('Deleted');
  renderActiveTab();
}

function pendingAddAtt(id, input) {
  const p = pdata.pendingWorks.find(x => x.id === id);
  if (!p || !input.files.length) return;
  const file = input.files[0];
  const reader = new FileReader();
  reader.onload = e => {
    p.attachments.push({ name: file.name, data: e.target.result, size: file.size });
    toast('Attachment added');
    renderActiveTab();
  };
  reader.readAsDataURL(file);
}

function pendingDeleteAtt(id, idx) {
  const p = pdata.pendingWorks.find(x => x.id === id);
  if (p) p.attachments.splice(idx, 1);
  renderActiveTab();
  toast('Attachment removed');
}

function pickPendingDate() {
  const cur = document.getElementById('pw_dueDateVal')?.textContent;
  const val = cur === 'Select date' ? fmtDMY(new Date()) : cur;
  showDatePicker(val, v => {
    const el = document.getElementById('pw_dueDateVal');
    if (el) { el.textContent = v; el.classList.remove('ph'); }
  });
}

/* helpers */
function curPending() { return pdata.pendingWorks.find(p => p.id === pendingState.itemId); }
function priorityClass(p) { return p === 'High' ? 'badge-high' : p === 'Medium' ? 'badge-medium' : 'badge-low'; }
function statusClass(s) { return s === 'Open' ? 'badge-open' : s === 'In Progress' ? 'badge-in-progress' : 'badge-done'; }
function escPending(s) { return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function escAttr(s) { return String(s || '').replace(/"/g,'&quot;').replace(/'/g,'&#39;'); }
