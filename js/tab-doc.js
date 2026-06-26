/* =========================================================
   Document Tab — Folder & File management
   Views: list | folder
   ========================================================= */

const docState = {
  view: 'list',
  folderId: null,
};

function renderDocument() {
  return docState.view === 'folder' ? docFolderDetail() : docFolderList();
}

/* ── Folder list ── */
function docFolderList() {
  const items = pdata.folders.length
    ? pdata.folders.map(f => `
        <div class="row-item" onclick="docState.view='folder';docState.folderId='${f.id}';renderActiveTab()">
          <div class="row-item-body">
            <div class="row-item-title">
              <svg viewBox="0 0 24 24" fill="#f3c969" stroke="#d9a93b" stroke-width="1.5" width="22" height="22" aria-hidden="true"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
              ${f.name}
            </div>
            <div class="row-item-date row-item-indent">${f.date}</div>
          </div>
          ${f.locked
            ? `<span class="folder-lock" title="Default folder — cannot be deleted"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></span>`
            : `<button class="icon-btn-danger" onclick="event.stopPropagation();deleteFolder('${f.id}')" aria-label="Delete folder" title="Delete folder">${icon('trash')}</button>`}
        </div>`).join('')
    : emptyText('No folders yet. Tap "+ Create Folder" to start.');

  return `
    <button class="btn btn-primary btn-block" onclick="openOverlay('createFolder')">+ Create Folder</button>
    <div style="margin-top:8px">${items}</div>`;
}

function deleteFolder(id) {
  const idx = pdata.folders.findIndex(f => f.id === id);
  if (idx !== -1) pdata.folders.splice(idx, 1);
  renderActiveTab();
  toast('Folder deleted');
}

/* ── Folder detail ── */
function docFolderDetail() {
  const f = pdata.folders.find(x => x.id === docState.folderId);
  if (!f) { docState.view = 'list'; return docFolderList(); }

  const files = f.files.length
    ? f.files.map(fl => `
        <div class="list-card file-card">
          <div class="file-card-inner">
            <div class="file-card-info">
              <span class="file-icon">${fileIcon(fl)}</span>
              <div style="min-width:0">
                <div class="file-name">${fl.name}</div>
                <div class="file-desc muted">${fl.desc}</div>
                <div class="file-date faint">${fl.date}</div>
              </div>
            </div>
            <div class="file-actions">
              <button class="icon-btn-muted" onclick="toast('Previewing file')" aria-label="Preview file" title="Preview">${icon('eye')}</button>
              <button class="icon-btn-danger" onclick="deleteFile('${f.id}','${fl.id}')" aria-label="Delete file" title="Delete">${icon('trash')}</button>
            </div>
          </div>
        </div>`)
      .join('')
    : `<div class="empty" style="margin-top:18px">
        <div class="e-icon">📄</div>
        <div class="e-title">No files yet</div>
        <div class="e-sub">Tap "+ Upload File" to add one</div>
      </div>`;

  return `
    <div class="toolbar">
      <button class="link-btn small" onclick="docState.view='list';renderActiveTab()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" width="20" height="20" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>
        Back
      </button>
      <span style="font-weight:800;font-size:18px;display:flex;align-items:center;gap:8px">
        <svg viewBox="0 0 24 24" fill="#f3c969" stroke="#d9a93b" stroke-width="1.5" width="20" height="20" aria-hidden="true"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
        ${f.name}
      </span>
      <span></span>
    </div>

    <button class="btn btn-primary btn-block" style="margin-bottom:18px" onclick="simulateUpload('${f.id}')">+ Upload File</button>

    <div class="list">${files}</div>`;
}

function fileIcon(fl) {
  if (!fl.name) return '📄';
  const ext = fl.name.split('.').pop().toLowerCase();
  if (['jpg','jpeg','png','gif','webp'].includes(ext)) return '<svg viewBox="0 0 24 24" fill="none" stroke="#3f4ee8" stroke-width="1.8" width="26" height="26"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>';
  if (ext === 'pdf') return '<svg viewBox="0 0 24 24" fill="none" width="26" height="26"><path d="M6 2h8l6 6v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z" fill="#fdecec" stroke="#e54b4b" stroke-width="1.6"/><text x="12" y="17" font-size="5.5" font-weight="700" fill="#e54b4b" text-anchor="middle">PDF</text></svg>';
  return '<svg viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="1.8" width="26" height="26"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>';
}

function deleteFile(folderId, fileId) {
  const f = pdata.folders.find(x => x.id === folderId);
  if (!f) return;
  f.files = f.files.filter(x => x.id !== fileId);
  renderActiveTab();
  toast('File deleted');
}

function simulateUpload(folderId) {
  const f = pdata.folders.find(x => x.id === folderId);
  if (!f) return;
  const names = ['drawing_v2.pdf', 'site_photo.jpg', 'approval.pdf', 'specs.pdf'];
  const descs = ['Revised drawing', 'Site progress photo', 'Client approval', 'Technical specs'];
  const idx = Math.floor(Math.random() * names.length);
  f.files.push({
    id: 'fl' + Date.now(),
    name: names[idx],
    desc: descs[idx],
    date: fmtDMY(new Date()),
    type: names[idx].endsWith('.pdf') ? 'pdf' : 'image',
  });
  toast('File uploaded');
  renderActiveTab();
}
