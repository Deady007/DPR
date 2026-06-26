/* =========================================================
   Leave — Admin View
   ========================================================= */

const leaveAdminState = {
  sub: 'pending',   /* pending | all */
  detailId: null,
};

function renderLeaveAdmin() {
  return leaveAdminState.detailId ? leaveAdminDetail() : leaveAdminHome();
}

function leaveAdminHome() {
  const pending = DB.leave.applications.filter(a => a.status === 'pending');
  const all     = DB.leave.applications;
  const showAll = leaveAdminState.sub === 'all';
  const list    = showAll ? all : pending;

  const seg = (id, label, count) =>
    `<button class="seg ${leaveAdminState.sub === id ? 'active' : ''}"
             onclick="leaveAdminState.sub='${id}';renderLeave()">
       ${label} <span class="pill">${count}</span>
     </button>`;

  const cards = list.length
    ? list.map(a => `
        <div class="la-card" onclick="leaveAdminState.detailId='${a.id}';renderLeave()">
          <div class="la-card-head">
            <div>
              <div class="la-emp-name">${a.empName}</div>
              <div class="la-meta">${a.type} · ${a.days} day${a.days > 1 ? 's' : ''}<br>${a.from}${a.from !== a.to ? ' – ' + a.to : ''}</div>
            </div>
            <span class="badge-pill badge-${a.status}">${a.status.charAt(0).toUpperCase() + a.status.slice(1)}</span>
          </div>
          ${a.reason ? `<div class="faint" style="font-size:14px">"${a.reason}"</div>` : ''}
        </div>`).join('')
    : `<p class="empty-text">${showAll ? 'No applications found.' : 'No pending approvals.'}</p>`;

  return `
    <div class="segment" style="margin-bottom:20px">
      ${seg('pending', 'Pending', pending.length)}
      ${seg('all',     'All',     all.length)}
    </div>
    ${cards}`;
}

function leaveAdminDetail() {
  const a = DB.leave.applications.find(x => x.id === leaveAdminState.detailId);
  if (!a) { leaveAdminState.detailId = null; return leaveAdminHome(); }

  const isPending = a.status === 'pending';

  return `
    <div class="toolbar">
      <button class="link-btn small" onclick="leaveAdminState.detailId=null;renderLeave()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" width="20" height="20" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>
        Back
      </button>
      <span style="font-weight:800;font-size:18px">Application</span>
      <span></span>
    </div>

    <div class="info-card" style="margin-bottom:20px">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px">
        <div>
          <div style="font-size:20px;font-weight:800">${a.empName}</div>
          <div class="faint" style="font-size:14px;margin-top:2px">Applied on ${a.appliedOn}</div>
        </div>
        <span class="badge-pill badge-${a.status}">${a.status.charAt(0).toUpperCase() + a.status.slice(1)}</span>
      </div>
      <div class="query-meta-row">
        <span class="qm-label">Leave Type</span><span class="qm-value">${a.type}</span>
      </div>
      <div class="query-meta-row">
        <span class="qm-label">Duration</span><span class="qm-value">${a.days} day${a.days > 1 ? 's' : ''}</span>
      </div>
      <div class="query-meta-row">
        <span class="qm-label">From</span><span class="qm-value">${a.from}</span>
      </div>
      <div class="query-meta-row">
        <span class="qm-label">To</span><span class="qm-value">${a.to}</span>
      </div>
      ${a.reason ? `<div class="query-meta-row"><span class="qm-label">Reason</span><span class="qm-value" style="font-size:15px">${a.reason}</span></div>` : ''}
      ${a.approvedBy ? `<div class="query-meta-row"><span class="qm-label">Actioned by</span><span class="qm-value" style="font-size:15px">${a.approvedBy}</span></div>` : ''}
    </div>

    ${isPending ? `
    <div style="display:flex;gap:12px;margin-top:8px">
      <button class="btn btn-danger" style="flex:1" onclick="leaveAction('${a.id}','rejected')">Reject</button>
      <button class="btn btn-primary" style="flex:1" onclick="leaveAction('${a.id}','approved')">Approve</button>
    </div>` : ''}`;
}

function leaveAction(id, action) {
  const a = DB.leave.applications.find(x => x.id === id);
  if (!a) return;
  a.status     = action;
  a.approvedBy = DB.user.name;
  leaveAdminState.detailId = null;
  toast(action === 'approved' ? 'Application approved' : 'Application rejected');
  renderLeave();
}
