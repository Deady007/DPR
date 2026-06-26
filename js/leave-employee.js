/* =========================================================
   Leave — Employee View
   ========================================================= */

const leaveEmpState = {
  view: 'list',   /* list | apply */
};

function renderLeaveEmployee(emp) {
  return leaveEmpState.view === 'apply'
    ? leaveApplyForm(emp)
    : leaveEmployeeHome(emp);
}

function leaveEmployeeHome(emp) {
  const types  = DB.leave.types;
  const shorts = DB.leave.typeShort;
  const bal    = emp.balance;

  const balCards = types.map(t => {
    const k = shorts[t];
    return `
      <div class="leave-bal-card">
        <div class="lbc-short">${bal[k] ?? 0}</div>
        <div class="lbc-type">${t}</div>
        <div class="lbc-avail">days left</div>
      </div>`;
  }).join('');

  const myApps = DB.leave.applications.filter(a => a.empId === emp.id);
  const appRows = myApps.length
    ? myApps.map(a => `
        <div class="leave-app-row">
          <div style="flex:1;min-width:0">
            <div style="font-weight:700;font-size:16px">${a.type}</div>
            <div class="la-dates">${a.from}${a.from !== a.to ? ' → ' + a.to : ''} · ${a.days} day${a.days > 1 ? 's' : ''}</div>
            <div class="la-type faint">${a.reason}</div>
          </div>
          <span class="badge-pill badge-${a.status}">${a.status.charAt(0).toUpperCase() + a.status.slice(1)}</span>
        </div>`).join('')
    : `<p class="empty-text">No applications yet.</p>`;

  return `
    <div class="section-head" style="margin-bottom:12px">
      <h2 style="font-size:22px">Leave Balance</h2>
    </div>
    <div class="leave-balance-grid">${balCards}</div>

    <div class="section-head" style="margin-bottom:12px">
      <h2 style="font-size:22px">My Applications</h2>
      <button class="btn btn-primary btn-sm" onclick="leaveEmpState.view='apply';renderLeave()">Apply</button>
    </div>
    ${appRows}`;
}

function leaveApplyForm(emp) {
  const types = DB.leave.types;
  return `
    <div class="toolbar">
      <button class="link-btn small" onclick="leaveEmpState.view='list';renderLeave()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" width="20" height="20" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>
        Back
      </button>
      <span style="font-weight:800;font-size:18px">Apply for Leave</span>
      <span></span>
    </div>

    <div class="field">
      <label class="item-label">Leave Type <span class="req">*</span></label>
      <select class="input select" id="la_type">
        ${types.map(t => `<option>${t}</option>`).join('')}
      </select>
    </div>

    <div class="field-2">
      <div>
        <label class="item-label">From Date <span class="req">*</span></label>
        <div class="pseudo-input select-look" onclick="pickLeaveDate('la_from')">
          <span id="la_from" class="ph">Select</span>
        </div>
      </div>
      <div>
        <label class="item-label">To Date <span class="req">*</span></label>
        <div class="pseudo-input select-look" onclick="pickLeaveDate('la_to')">
          <span id="la_to" class="ph">Select</span>
        </div>
      </div>
    </div>

    <div class="field">
      <label class="item-label">Reason</label>
      <textarea class="input" id="la_reason" rows="3" placeholder="Briefly describe the reason…"></textarea>
    </div>

    <div class="form-actions" style="margin-top:24px">
      <button class="btn btn-light" onclick="leaveEmpState.view='list';renderLeave()">Cancel</button>
      <button class="btn btn-primary" onclick="leaveSubmitApplication('${emp.id}','${emp.name}')">Submit</button>
    </div>`;
}

function pickLeaveDate(spanId) {
  const el = document.getElementById(spanId);
  const cur = el && !el.classList.contains('ph') ? el.textContent : fmtDMY(new Date());
  showDatePicker(cur, v => {
    if (el) { el.textContent = v; el.classList.remove('ph'); }
  });
}

function leaveSubmitApplication(empId, empName) {
  const type   = document.getElementById('la_type')?.value;
  const fromEl = document.getElementById('la_from');
  const toEl   = document.getElementById('la_to');
  const reason = document.getElementById('la_reason')?.value.trim();

  if (!fromEl || fromEl.classList.contains('ph')) { toast('Select From Date'); return; }
  if (!toEl   || toEl.classList.contains('ph'))   { toast('Select To Date');   return; }

  const from = fromEl.textContent;
  const to   = toEl.textContent;
  const days = calcDays(from, to);

  DB.leave.applications.push({
    id: 'la' + Date.now(),
    empId, empName, type, from, to, days,
    reason: reason || '',
    status: 'pending',
    appliedOn: fmtDMY(new Date()),
    approvedBy: '',
  });

  leaveEmpState.view = 'list';
  toast('Leave application submitted');
  renderLeave();
}

function calcDays(from, to) {
  const parse = d => { const [dd,mm,yy] = d.split('/'); return new Date(yy, mm-1, dd); };
  const diff = (parse(to) - parse(from)) / 86400000;
  return Math.max(1, Math.round(diff) + 1);
}
