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
        <div style="display:flex;align-items:center;justify-content:space-between;padding:22px 4px;border-bottom:1px solid var(--line);cursor:pointer"
             onclick="docState.view='folder';docState.folderId='${f.id}';renderActiveTab()">
          <div>
            <div style="font-weight:800;font-size:20px">
              <svg viewBox="0 0 24 24" fill="#f3c969" stroke="#d9a93b" stroke-width="1.5" width="22" height="22" style="vertical-align:middle;margin-right:8px"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
              ${f.name}
            </div>
            <div class="faint" style="font-size:15px;margin-top:6px;padding-left:30px">${f.date}</div>
          </div>
          <button class="trash" style="font-size:24px" onclick="event.stopPropagation();deleteFolder('${f.id}')">🗑️</button>
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
        <div class="list-card" style="cursor:default">
          <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px">
            <div style="display:flex;gap:12px;align-items:flex-start">
              <span style="flex:0 0 26px;margin-top:2px">${fileIcon(fl)}</span>
              <div>
                <div style="color:var(--link);font-weight:700;font-size:18px">${fl.name}</div>
                <div class="muted" style="margin-top:4px;font-size:15px">${fl.desc}</div>
                <div class="faint" style="font-size:13px;margin-top:4px">${fl.date}</div>
              </div>
            </div>
            <div style="display:flex;gap:14px;align-items:center;flex:0 0 auto">
              <button style="background:none;border:0;cursor:pointer;font-size:22px" onclick="toast('Previewing file')">👁️</button>
              <button class="trash" style="font-size:22px" onclick="deleteFile('${f.id}','${fl.id}')">🗑️</button>
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
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px">
      <button class="link-btn small" onclick="docState.view='list';renderActiveTab()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" width="20" height="20" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>
        Back
      </button>
      <span style="font-weight:800;font-size:18px">
        <svg viewBox="0 0 24 24" fill="#f3c969" stroke="#d9a93b" stroke-width="1.5" width="20" height="20" style="vertical-align:middle"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
        ${f.name}
      </span>
      <span style="width:60px"></span>
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
