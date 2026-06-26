/* =========================================================
   P.O Tab — Purchase Orders
   Views: list | form | pdf
   ========================================================= */

const poState = {
  view: 'list',
  poId: null,       /* null = new order, else existing id */
  draft: null,      /* working copy of the PO being edited */
};

/* ── called after renderActiveTab() injects HTML ── */
function poPostRender() {
  if (poState.view === 'form') recalcPO();
}

function renderPO() {
  switch (poState.view) {
    case 'form': return poForm();
    case 'pdf':  return poPdf();
    default:     return poList();
  }
}

/* ── Order list ── */
function poList() {
  const rows = pdata.po.map(o => `
    <div class="list-card po-card" onclick="openPO('${o.id}')">
      <div class="po-top">
        <div class="po-id">${o.id}</div>
        <div class="po-amt">${DB.money(poTotal(o))}</div>
      </div>
      <div class="po-meta">
        ${o.orderDate}${o.expiry ? ' → ' + o.expiry : ''}<br>
        Supplier: ${o.supplier || '-'}<br>
        Engineer: ${o.engineer || '-'}
      </div>
      <span class="badge-draft">${o.status}</span>
    </div>`).join('') || emptyText('No orders yet. Tap "+ Add Order" to create one.');

  return `
    <div class="toolbar">
      <h2 style="margin:0;font-size:26px;font-weight:800">Orders</h2>
      <button class="btn btn-primary" onclick="newPO()">+ Add Order</button>
    </div>
    <div class="list">${rows}</div>`;
}

function openPO(id) {
  poState.poId = id;
  const src = pdata.po.find(o => o.id === id);
  poState.draft = JSON.parse(JSON.stringify(src)); /* deep clone */
  poState.view = 'form';
  renderActiveTab();
}
function newPO() {
  poState.poId = null;
  poState.draft = {
    id: null, orderDate: fmtDMY(new Date()), expiry: '',
    supplier: '', engineer: '', terms: '', status: 'DRAFT', signed: false,
    items: [{ product: '', qty: 1, uom: '', price: 0 }],
  };
  poState.view = 'form';
  renderActiveTab();
}

/* ── Order form ── */
function poForm() {
  const d = poState.draft;
  const isNew = !poState.poId;
  const heading = isNew ? '(will be generated)' : poState.poId;

  const itemsHTML = d.items.map((item, i) => `
    <div class="item-card" id="item_${i}">
      <div class="item-head">
        <span class="ih-title">Item #${i + 1}</span>
        <button class="remove" onclick="poRemoveItem(${i})">Remove</button>
      </div>
      <input class="input" id="it_prod_${i}" value="${escHtmlPO(item.product)}" placeholder="Product" oninput="poState.draft.items[${i}].product=this.value">
      <div class="field-2" style="margin-top:12px">
        <div>
          <div style="font-weight:700;margin-bottom:8px">Qty</div>
          <input class="input" type="number" id="it_qty_${i}" value="${item.qty}" min="1"
                 oninput="poState.draft.items[${i}].qty=+this.value;recalcPO()">
        </div>
        <div>
          <div style="font-weight:700;margin-bottom:8px">UOM</div>
          <input class="input" id="it_uom_${i}" value="${escHtmlPO(item.uom)}" placeholder="e.g. pcs"
                 oninput="poState.draft.items[${i}].uom=this.value">
        </div>
        <div>
          <div style="font-weight:700;margin-bottom:8px">Unit Price (₹)</div>
          <input class="input" type="number" id="it_price_${i}" value="${item.price}" min="0"
                 oninput="poState.draft.items[${i}].price=+this.value;recalcPO()">
        </div>
      </div>
      <div class="line-total" id="lt_${i}">Line Total: ${DB.money(item.qty * item.price)}</div>
    </div>`).join('');

  const sub = d.items.reduce((s, it) => s + it.qty * it.price, 0);

  /* Signature section (only on existing saved PO) */
  const sigSection = !isNew ? `
    <div class="sig-section">
      <h3>Signature</h3>
      ${d.signed
        ? `<div class="sig-buttons">
             <button class="btn btn-primary" onclick="toast('Viewing signature')">View Signature</button>
             <button class="btn btn-amber" onclick="openSign('Order', ()=>{ poState.draft.signed=true; renderActiveTab(); })">Re-sign</button>
           </div>`
        : `<button class="btn btn-primary" onclick="openSign('Order', ()=>{ poState.draft.signed=true; renderActiveTab(); })">Sign Order</button>`}
    </div>` : '';

  return `
    <!-- toolbar -->
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;flex-wrap:wrap;gap:10px">
      <button class="link-btn small" onclick="poState.view='list';renderActiveTab()">‹ Orders</button>
      <button class="btn btn-primary btn-sm" onclick="poState.view='pdf';renderActiveTab()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="17" height="17"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
        Preview
      </button>
    </div>

    <div class="order-head">Order No : ${heading}</div>

    <!-- dates -->
    <div class="field-2">
      <div class="field">
        <label>Order Date</label>
        <div class="pseudo-input select-look" onclick="showDatePicker('${d.orderDate}', v=>{ poState.draft.orderDate=v; renderActiveTab(); })">
          <span>${d.orderDate || 'Select'}</span>
        </div>
      </div>
      <div class="field">
        <label>Expiry Date</label>
        <div class="pseudo-input select-look" onclick="showDatePicker('${d.expiry||''}', v=>{ poState.draft.expiry=v; renderActiveTab(); })">
          <span>${d.expiry || 'Select'}</span>
        </div>
      </div>
    </div>

    <!-- supplier / engineer -->
    <div class="field">
      <label>Supplier</label>
      <input class="input" id="po_supplier" value="${escHtmlPO(d.supplier)}" placeholder="Supplier (free text)"
             oninput="poState.draft.supplier=this.value">
    </div>
    <div class="field">
      <label>Engineer</label>
      <input class="input" id="po_engineer" value="${escHtmlPO(d.engineer)}" placeholder="Engineer / contact"
             oninput="poState.draft.engineer=this.value">
    </div>

    <!-- payment terms -->
    <div class="field">
      <label>Payment Terms</label>
      <textarea class="textarea" id="po_terms" rows="3" placeholder="Payment terms"
                oninput="poState.draft.terms=this.value">${escHtmlPO(d.terms)}</textarea>
    </div>

    <!-- items -->
    <div class="label-strong">Items</div>
    <div id="poItems">${itemsHTML}</div>
    <button class="btn btn-outline btn-sm" style="margin-top:14px" onclick="poAddItem()">+ Add Item</button>

    <!-- totals -->
    <div class="po-totals" id="poTotals">
      Subtotal: ${DB.money(sub)}<br>
      Total: ${DB.money(sub)}
    </div>

    ${sigSection}

    <!-- actions -->
    <div class="form-actions">
      ${!isNew ? `<button class="btn btn-danger" onclick="deletePO('${poState.poId}')">Delete</button>` : ''}
      <button class="btn btn-light" onclick="poState.view='list';renderActiveTab()">Cancel</button>
      <button class="btn btn-primary" onclick="savePO()">Save</button>
    </div>`;
}

/* Item add/remove */
function poAddItem() {
  poState.draft.items.push({ product: '', qty: 1, uom: '', price: 0 });
  renderActiveTab();
}
function poRemoveItem(i) {
  if (poState.draft.items.length === 1) { toast('At least one item required'); return; }
  poState.draft.items.splice(i, 1);
  renderActiveTab();
}

/* Recalc totals live */
function recalcPO() {
  const d = poState.draft;
  let sub = 0;
  d.items.forEach((item, i) => {
    const lt = item.qty * item.price;
    const el = document.getElementById(`lt_${i}`);
    if (el) el.textContent = 'Line Total: ' + DB.money(lt);
    sub += lt;
  });
  const tot = document.getElementById('poTotals');
  if (tot) tot.innerHTML = `Subtotal: ${DB.money(sub)}<br>Total: ${DB.money(sub)}`;
}

/* Save / Delete */
function savePO() {
  const d = poState.draft;
  if (poState.poId) {
    /* update existing */
    const idx = pdata.po.findIndex(o => o.id === poState.poId);
    if (idx !== -1) pdata.po[idx] = { ...d, id: poState.poId };
  } else {
    /* create new */
    const nextNum = String(pdata.po.length + 1).padStart(4, '0');
    pdata.po.push({ ...d, id: `PO-${nextNum}` });
  }
  poState.view = 'list';
  toast('Order saved');
  renderActiveTab();
}
function deletePO(id) {
  pdata.po = pdata.po.filter(o => o.id !== id);
  poState.view = 'list';
  toast('Order deleted');
  renderActiveTab();
}

/* ── PO PDF (A4-style preview) ── */
function poPdf() {
  /* Use draft if in form→pdf flow, else load original */
  const d = poState.draft || pdata.po.find(o => o.id === poState.poId);
  if (!d) { poState.view = 'list'; return poList(); }

  const heading = poState.poId || '(will be generated)';
  const sub = d.items.reduce((s, it) => s + it.qty * it.price, 0);

  const itemRows = d.items.map((it, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>${escHtmlPO(it.product)}</td>
      <td style="text-align:center">${it.qty}</td>
      <td style="text-align:center">${escHtmlPO(it.uom)}</td>
      <td style="text-align:right">${DB.money(it.price)}</td>
      <td style="text-align:right">${DB.money(it.qty * it.price)}</td>
    </tr>`).join('');

  return `
    <div class="doc-toolbar">
      <button class="link-btn" onclick="poState.view='form';renderActiveTab()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" width="20" height="20" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>
        Back
      </button>
      <div style="position:relative">
        <button class="btn btn-primary" onclick="toggleMenu('poShareMenu')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="17" height="17"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          Preview ▾
        </button>
        <div class="menu" id="poShareMenu">
          <div class="menu-item" onclick="toast('Sharing PDF…');toggleMenu('poShareMenu')">
            <svg viewBox="0 0 24 24" fill="none" stroke="#e54b4b" stroke-width="2" width="22" height="22"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            Share PDF
          </div>
          <div class="menu-item" onclick="toast('Sharing image…');toggleMenu('poShareMenu')">
            <svg viewBox="0 0 24 24" fill="none" stroke="#3f4ee8" stroke-width="2" width="22" height="22"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            Share Image
          </div>
        </div>
      </div>
    </div>

    <div class="doc-paper soft-border" style="font-family:sans-serif">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:14px">
        <div>
          <div style="font-size:20px;font-weight:800">PURCHASE ORDER</div>
          <div style="font-size:13px;color:#555;margin-top:3px">${DB.company.name}</div>
        </div>
        <div style="text-align:right">
          <div style="font-size:18px;font-weight:800;color:var(--primary)">Order No: ${heading}</div>
          <div style="font-size:13px;color:#666;margin-top:4px">${d.orderDate}</div>
        </div>
      </div>
      <hr style="border:0;border-top:1.5px solid #111;margin-bottom:14px">

      <table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:16px">
        <tr>
          <td style="padding:6px 8px;font-weight:700;width:22%;border:1px solid #ddd;background:#f5f5f5">Order Date</td>
          <td style="padding:6px 8px;border:1px solid #ddd">${d.orderDate}</td>
          <td style="padding:6px 8px;font-weight:700;width:22%;border:1px solid #ddd;background:#f5f5f5">Expiry Date</td>
          <td style="padding:6px 8px;border:1px solid #ddd">${d.expiry || '—'}</td>
        </tr>
        <tr>
          <td style="padding:6px 8px;font-weight:700;border:1px solid #ddd;background:#f5f5f5">Supplier</td>
          <td style="padding:6px 8px;border:1px solid #ddd">${d.supplier || '—'}</td>
          <td style="padding:6px 8px;font-weight:700;border:1px solid #ddd;background:#f5f5f5">Engineer</td>
          <td style="padding:6px 8px;border:1px solid #ddd">${d.engineer || '—'}</td>
        </tr>
        <tr>
          <td style="padding:6px 8px;font-weight:700;border:1px solid #ddd;background:#f5f5f5">Payment Terms</td>
          <td colspan="3" style="padding:6px 8px;border:1px solid #ddd">${d.terms || '—'}</td>
        </tr>
      </table>

      <table class="doc-table">
        <thead>
          <tr>
            <th style="width:6%">#</th>
            <th style="text-align:left">Item / Product</th>
            <th style="width:10%">Qty</th>
            <th style="width:10%">UOM</th>
            <th style="width:20%">Unit Price</th>
            <th style="width:20%">Line Total</th>
          </tr>
        </thead>
        <tbody>${itemRows}</tbody>
        <tfoot>
          <tr>
            <td colspan="4"></td>
            <td style="text-align:right;font-weight:800;padding:8px;border:1px solid #111">Subtotal</td>
            <td style="text-align:right;font-weight:800;padding:8px;border:1px solid #111">${DB.money(sub)}</td>
          </tr>
          <tr>
            <td colspan="4"></td>
            <td style="text-align:right;font-weight:800;padding:8px;border:1px solid #111">Total</td>
            <td style="text-align:right;font-weight:800;padding:8px;border:1px solid #111">${DB.money(sub)}</td>
          </tr>
        </tfoot>
      </table>

      ${d.signed ? `
        <div style="margin-top:20px">
          <div style="font-weight:800;font-size:14px;margin-bottom:6px">Authorised Signature</div>
          <div style="border:1px solid #ddd;border-radius:8px;padding:14px;background:#f9fafb;font-size:13px;color:#888">
            [Digital signature captured]
          </div>
        </div>` : ''}

      <div style="text-align:right;font-size:11px;font-weight:700;margin-top:20px">Page 1 of 1</div>
    </div>`;
}

/* helpers */
function poTotal(o) { return o.items.reduce((s, it) => s + it.qty * it.price, 0); }
function escHtmlPO(s) { return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
