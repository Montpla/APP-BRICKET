// Invoices Module - Invoice Management and Creation
export const invoicesModule = {
  invoices: [],
  editingInvoiceId: null,
  currentInvoiceLines: [],
  projectTaxRate: 0.19,
  projectTaxName: 'IVA',
  projectIncludeTax: true,

  async render() {
    const project = await app.getActiveProject();
    const invoices = await db.getByIndex('invoices', 'projectId', project.id);

    const invoicesHTML = (invoices || []).map(inv => `
      <tr>
        <td><strong>${inv.number}</strong></td>
        <td>${inv.client.name}</td>
        <td>${inv.date}</td>
        <td class="num">${app.formatCurrency(inv.total)}</td>
        <td><span class="badge status-${inv.status}">${inv.status}</span></td>
        <td>
          <button class="btn-view-invoice" data-invoice-id="${inv.id}">Ver</button>
          <button class="btn-edit-invoice" data-invoice-id="${inv.id}">✎</button>
          <button class="btn-download-invoice" data-invoice-id="${inv.id}">📄</button>
        </td>
      </tr>
    `).join('');

    return `
      <div class="invoices-page">
        <div class="page-header">
          <h1>Facturas</h1>
          <div class="header-actions">
            <button id="btn-new-invoice" class="btn btn-primary">+ Nueva Factura</button>
            <button id="btn-import-invoice-file" class="btn">📤 Importar desde archivo</button>
          </div>
        </div>
        <input type="file" id="fileImportInvoice" accept=".xlsx,.xls,.csv,.json,.xml,.pdf,.txt" style="display:none;">

        <div style="margin-bottom: 16px;">
          <select id="filterInvoiceStatus" style="width: 200px;">
            <option value="all">Todos los estados</option>
            <option value="draft">Borrador</option>
            <option value="sent">Enviada</option>
            <option value="paid">Pagada</option>
            <option value="overdue">Vencida</option>
          </select>
        </div>

        <table class="table">
          <thead>
            <tr>
              <th>Número</th>
              <th>Cliente</th>
              <th>Fecha</th>
              <th class="num">Total</th>
              <th>Estado</th>
              <th style="width: 180px;">Acciones</th>
            </tr>
          </thead>
          <tbody>
            ${invoicesHTML}
          </tbody>
        </table>
      </div>

      <!-- Modal Nueva/Editar Factura -->
      <div id="invoiceModal" class="modal" style="display:none;">
        <div class="modal-content" style="max-width: 800px;">
          <div class="modal-header">
            <h2 id="invoiceModalTitle">Nueva Factura</h2>
            <button class="btn-close" id="btnCloseInvoiceModal">×</button>
          </div>
          <form id="invoiceForm" class="form">
            <div class="layout-2col">
              <div class="form-group">
                <label>Número *</label>
                <input type="text" id="invoiceNumber" placeholder="Auto-generado" readonly style="background: var(--card);">
              </div>
              <div class="form-group">
                <label>Fecha *</label>
                <input type="date" id="invoiceDate" required>
              </div>
            </div>

            <div style="background: var(--card); padding: 16px; border-radius: var(--radius); margin-bottom: 16px;">
              <h4 style="margin-top: 0;">Datos del Cliente</h4>
              <div class="layout-2col">
                <div class="form-group">
                  <label>Nombre del Cliente *</label>
                  <input type="text" id="clientName" placeholder="Nombre" required>
                </div>
                <div class="form-group">
                  <label>RUT/Identificación</label>
                  <input type="text" id="clientRut" placeholder="RUT o ID">
                </div>
              </div>
              <div class="layout-2col">
                <div class="form-group">
                  <label>Email</label>
                  <input type="email" id="clientEmail" placeholder="email@empresa.com">
                </div>
                <div class="form-group">
                  <label>Teléfono</label>
                  <input type="tel" id="clientPhone" placeholder="+56...">
                </div>
              </div>
            </div>

            <div style="margin-bottom: 16px;">
              <h4>Líneas de Factura</h4>
              <div id="invoiceLines"></div>
              <button type="button" class="btn" id="btnAddInvoiceLine">+ Agregar Línea</button>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
              <div></div>
              <div style="background: var(--card); padding: 12px; border-radius: var(--radius);">
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                  <span>Subtotal:</span>
                  <span id="subtotal" class="num">0</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                  <span data-tax-label>IVA (19%):</span>
                  <span id="taxAmount" class="num">0</span>
                </div>
                <div style="display: flex; justify-content: space-between; border-top: 1px solid var(--stroke); padding-top: 8px;">
                  <strong>Total:</strong>
                  <strong id="totalAmount" class="num">0</strong>
                </div>
              </div>
            </div>

            <div class="layout-2col" style="margin-top: 16px;">
              <div class="form-group">
                <label>Fecha de Vencimiento *</label>
                <input type="date" id="invoiceDueDate" required>
              </div>
              <div class="form-group">
                <label>Método de Pago</label>
                <select id="paymentMethod">
                  <option value="bank">Transferencia Bancaria</option>
                  <option value="cash">Efectivo</option>
                  <option value="check">Cheque</option>
                  <option value="credit">Crédito</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label>Notas/Observaciones</label>
              <textarea id="invoiceNotes" placeholder="Notas opcionales" rows="2"></textarea>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" id="btnCancelInvoiceModal">Cancelar</button>
              <button type="submit" class="btn btn-primary">Guardar Factura</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Modal Ver Detalles -->
      <div id="viewInvoiceModal" class="modal" style="display:none;">
        <div class="modal-content" style="max-width: 700px;">
          <div class="modal-header">
            <h2 id="viewInvoiceNumber">Factura</h2>
            <button class="btn-close" id="btnCloseViewInvoiceModal">×</button>
          </div>
          <div id="viewInvoiceContent" style="line-height: 1.8;"></div>
          <div class="modal-footer">
            <button id="btnChangeStatus" class="btn btn-primary">Cambiar Estado</button>
            <button class="btn" id="btnCloseViewInvoice">Cerrar</button>
          </div>
        </div>
      </div>
    `;
  },

  async init() {
    console.log('Invoices module initialized');

    // Load project tax settings
    const project = await app.getActiveProject();
    this.projectTaxRate = (project.projectIVAPercentage || 19) / 100;
    this.projectTaxName = project.projectTaxName || 'IVA';
    this.projectIncludeTax = project.projectIncludeTax !== false;

    // Update tax display in modal
    const taxLabel = document.querySelector('[data-tax-label]');
    if (taxLabel) {
      const taxPercent = Math.round(this.projectTaxRate * 100);
      taxLabel.textContent = `${this.projectTaxName} (${taxPercent}%):`;
    }

    const invoiceModal = document.getElementById('invoiceModal');
    const btnNewInvoice = document.getElementById('btn-new-invoice');
    const btnCloseInvoiceModal = document.getElementById('btnCloseInvoiceModal');
    const btnCancelInvoiceModal = document.getElementById('btnCancelInvoiceModal');
    const invoiceForm = document.getElementById('invoiceForm');
    const btnAddInvoiceLine = document.getElementById('btnAddInvoiceLine');
    const fileImportInvoice = document.getElementById('fileImportInvoice');

    // New invoice
    if (btnNewInvoice) {
      btnNewInvoice.addEventListener('click', async () => {
        const nextNumber = await this.generateNextInvoiceNumber();
        document.getElementById('invoiceModalTitle').textContent = 'Nueva Factura';
        document.getElementById('invoiceNumber').value = nextNumber;
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('invoiceDate').value = today;
        const dueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        document.getElementById('invoiceDueDate').value = dueDate;
        invoiceForm.reset();
        document.getElementById('invoiceLines').innerHTML = '';
        this.currentInvoiceLines = [];
        this.addInvoiceLine();
        this.editingInvoiceId = null;
        invoiceModal.style.display = 'flex';
      });
    }

    // Import invoice from file
    const btnImportInvoiceFile = document.getElementById('btn-import-invoice-file');
    if (btnImportInvoiceFile) {
      btnImportInvoiceFile.addEventListener('click', () => {
        fileImportInvoice?.click();
      });
    }

    if (btnCloseInvoiceModal) {
      btnCloseInvoiceModal.addEventListener('click', () => {
        invoiceModal.style.display = 'none';
      });
    }

    if (btnCancelInvoiceModal) {
      btnCancelInvoiceModal.addEventListener('click', () => {
        invoiceModal.style.display = 'none';
      });
    }

    if (invoiceForm) {
      invoiceForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.saveInvoice();
      });
    }

    if (btnAddInvoiceLine) {
      btnAddInvoiceLine.addEventListener('click', (e) => {
        e.preventDefault();
        this.addInvoiceLine();
      });
    }

    // View/Edit/Download
    document.querySelectorAll('.btn-view-invoice').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const invoiceId = e.target.getAttribute('data-invoice-id');
        await this.viewInvoice(invoiceId);
      });
    });

    document.querySelectorAll('.btn-edit-invoice').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const invoiceId = e.target.getAttribute('data-invoice-id');
        await this.editInvoice(invoiceId);
      });
    });

    document.querySelectorAll('.btn-download-invoice').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const invoiceId = e.target.getAttribute('data-invoice-id');
        await this.downloadInvoiceAsPDF(invoiceId);
      });
    });

    // View modal
    const viewInvoiceModal = document.getElementById('viewInvoiceModal');
    const btnCloseViewInvoiceModal = document.getElementById('btnCloseViewInvoiceModal');
    const btnCloseViewInvoice = document.getElementById('btnCloseViewInvoice');

    if (btnCloseViewInvoiceModal) {
      btnCloseViewInvoiceModal.addEventListener('click', () => {
        viewInvoiceModal.style.display = 'none';
      });
    }

    if (btnCloseViewInvoice) {
      btnCloseViewInvoice.addEventListener('click', () => {
        viewInvoiceModal.style.display = 'none';
      });
    }

    // Status filter
    const filterStatus = document.getElementById('filterInvoiceStatus');
    if (filterStatus) {
      filterStatus.addEventListener('change', (e) => {
        this.filterByStatus(e.target.value);
      });
    }

    // File import for invoice
    if (fileImportInvoice) {
      fileImportInvoice.addEventListener('change', async (e) => {
        await this.importInvoiceFromFile(e);
      });
    }
  },

  addInvoiceLine() {
    const invoiceLines = document.getElementById('invoiceLines');
    const lineIndex = this.currentInvoiceLines.length;

    const lineHTML = `
      <div class="invoice-line" data-line="${lineIndex}" style="display: grid; grid-template-columns: 2fr 1fr 1fr 1fr 60px; gap: 8px; margin-bottom: 8px; padding: 8px; background: var(--card); border-radius: 4px; align-items: end;">
        <input type="text" class="line-description" placeholder="Descripción" value="">
        <input type="number" class="line-quantity" placeholder="Cantidad" step="0.01" value="1">
        <input type="number" class="line-unitprice" placeholder="Precio unitario" step="0.01" value="0">
        <div style="padding: 6px; background: var(--bg); border-radius: 4px; text-align: right;">
          <div style="font-size: 12px; color: var(--muted);">Subtotal</div>
          <div class="line-amount num" style="font-weight: 600;">0</div>
        </div>
        <button type="button" class="btn-remove-line" data-line="${lineIndex}" style="padding: 6px; font-size: 12px;">✕</button>
      </div>
    `;

    invoiceLines.insertAdjacentHTML('beforeend', lineHTML);
    this.currentInvoiceLines.push({ description: '', quantity: 1, unitPrice: 0 });

    const lineEl = invoiceLines.querySelector(`[data-line="${lineIndex}"]`);
    const descInput = lineEl.querySelector('.line-description');
    const qtyInput = lineEl.querySelector('.line-quantity');
    const priceInput = lineEl.querySelector('.line-unitprice');
    const removeBtn = lineEl.querySelector('.btn-remove-line');

    const updateLine = () => {
      const qty = parseFloat(qtyInput.value) || 0;
      const price = parseFloat(priceInput.value) || 0;
      const amount = qty * price;
      lineEl.querySelector('.line-amount').textContent = app.formatCurrency(amount);
      this.updateInvoiceTotal();
    };

    descInput.addEventListener('input', () => {
      this.currentInvoiceLines[lineIndex].description = descInput.value;
    });

    qtyInput.addEventListener('input', updateLine);
    priceInput.addEventListener('input', updateLine);

    removeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      lineEl.remove();
      this.currentInvoiceLines.splice(lineIndex, 1);
      this.updateInvoiceTotal();
    });
  },

  updateInvoiceTotal() {
    let subtotal = 0;

    document.querySelectorAll('.invoice-line').forEach((lineEl, idx) => {
      const qty = parseFloat(lineEl.querySelector('.line-quantity').value) || 0;
      const price = parseFloat(lineEl.querySelector('.line-unitprice').value) || 0;
      subtotal += qty * price;
    });

    const tax = this.projectIncludeTax ? subtotal * this.projectTaxRate : 0;
    const total = subtotal + tax;

    document.getElementById('subtotal').textContent = app.formatCurrency(subtotal);
    document.getElementById('taxAmount').textContent = app.formatCurrency(tax);
    document.getElementById('totalAmount').textContent = app.formatCurrency(total);
  },

  async generateNextInvoiceNumber() {
    const project = await app.getActiveProject();
    const invoices = await db.getByIndex('invoices', 'projectId', project.id);
    const year = new Date().getFullYear();
    const count = (invoices || []).length + 1;
    return `F-${year}-${String(count).padStart(3, '0')}`;
  },

  async saveInvoice() {
    const project = await app.getActiveProject();
    const invoiceNumber = document.getElementById('invoiceNumber').value;
    const invoiceDate = document.getElementById('invoiceDate').value;
    const invoiceDueDate = document.getElementById('invoiceDueDate').value;
    const clientName = document.getElementById('clientName').value.trim();
    const clientRut = document.getElementById('clientRut').value.trim();
    const clientEmail = document.getElementById('clientEmail').value.trim();
    const paymentMethod = document.getElementById('paymentMethod').value;
    const notes = document.getElementById('invoiceNotes').value.trim();

    if (!clientName) {
      alert('Nombre del cliente es requerido');
      return;
    }

    const lines = [];
    let subtotal = 0;

    document.querySelectorAll('.invoice-line').forEach((lineEl) => {
      const description = lineEl.querySelector('.line-description').value.trim();
      const quantity = parseFloat(lineEl.querySelector('.line-quantity').value) || 0;
      const unitPrice = parseFloat(lineEl.querySelector('.line-unitprice').value) || 0;
      const amount = quantity * unitPrice;

      if (description && quantity > 0 && unitPrice > 0) {
        lines.push({ description, quantity, unitPrice, amount });
        subtotal += amount;
      }
    });

    if (lines.length === 0) {
      alert('Debe agregar al menos una línea con monto');
      return;
    }

    const tax = this.projectIncludeTax ? subtotal * this.projectTaxRate : 0;
    const total = subtotal + tax;

    try {
      const invoiceData = {
        projectId: project.id,
        number: invoiceNumber,
        date: invoiceDate,
        dueDate: invoiceDueDate,
        client: { name: clientName, rut: clientRut, email: clientEmail },
        lines,
        subtotal,
        tax,
        total,
        paymentMethod,
        notes,
        status: 'draft',
        createdAt: Date.now()
      };

      if (this.editingInvoiceId) {
        await db.update('invoices', this.editingInvoiceId, invoiceData);
      } else {
        const created = await db.create('invoices', invoiceData);
        await this.createAutomaticJournalEntry(created, subtotal, tax);
      }

      document.getElementById('invoiceModal').style.display = 'none';
      await router.navigate('/invoices');
    } catch (error) {
      console.error('Error saving invoice:', error);
      alert('Error al guardar factura: ' + error.message);
    }
  },

  async createAutomaticJournalEntry(invoice, subtotal, tax) {
    try {
      const project = await app.getActiveProject();
      const accounts = await db.getByIndex('chartOfAccounts', 'projectId', project.id);

      const cuentasCobrar = accounts?.find(a => a.code?.includes('1.2') || a.name?.includes('cobrar'));
      const ingresosVentas = accounts?.find(a => a.type === 'income');
      const cuentaIVA = accounts?.find(a => a.name?.includes('IVA'));

      if (cuentasCobrar && ingresosVentas) {
        const lines = [
          { accountId: cuentasCobrar.id, debit: subtotal + tax, credit: 0 },
          { accountId: ingresosVentas.id, debit: 0, credit: subtotal }
        ];

        if (cuentaIVA && tax > 0) {
          lines.push({ accountId: cuentaIVA.id, debit: 0, credit: tax });
        }

        const entryData = {
          projectId: project.id,
          date: invoice.date,
          description: `Factura ${invoice.number} - ${invoice.client.name}`,
          status: 'posted',
          lines,
          linkedInvoice: invoice.id,
          createdAt: Date.now()
        };

        await db.create('journalEntries', entryData);

        for (const line of lines) {
          const account = await db.read('chartOfAccounts', line.accountId);
          if (account) {
            const newBalance = account.balance + (line.debit - line.credit);
            await db.update('chartOfAccounts', line.accountId, { balance: newBalance });
          }
        }
      }
    } catch (error) {
      console.error('Error creating journal entry:', error);
    }
  },

  async editInvoice(invoiceId) {
    const invoice = await db.read('invoices', invoiceId);
    if (!invoice || invoice.status !== 'draft') {
      alert('Solo se pueden editar facturas en borrador');
      return;
    }

    this.editingInvoiceId = invoiceId;
    document.getElementById('invoiceModalTitle').textContent = 'Editar Factura';
    document.getElementById('invoiceNumber').value = invoice.number;
    document.getElementById('invoiceDate').value = invoice.date;
    document.getElementById('invoiceDueDate').value = invoice.dueDate;
    document.getElementById('clientName').value = invoice.client.name;
    document.getElementById('clientRut').value = invoice.client.rut || '';
    document.getElementById('clientEmail').value = invoice.client.email || '';
    document.getElementById('paymentMethod').value = invoice.paymentMethod;
    document.getElementById('invoiceNotes').value = invoice.notes || '';

    document.getElementById('invoiceLines').innerHTML = '';
    this.currentInvoiceLines = [];

    for (const line of invoice.lines) {
      this.addInvoiceLine();
      const lineEl = document.querySelector('[data-line="' + (this.currentInvoiceLines.length - 1) + '"]');
      lineEl.querySelector('.line-description').value = line.description;
      lineEl.querySelector('.line-quantity').value = line.quantity;
      lineEl.querySelector('.line-unitprice').value = line.unitPrice;
      lineEl.querySelector('.line-amount').textContent = app.formatCurrency(line.amount);
    }

    this.updateInvoiceTotal();
    document.getElementById('invoiceModal').style.display = 'flex';
  },

  async viewInvoice(invoiceId) {
    const invoice = await db.read('invoices', invoiceId);
    if (!invoice) return;

    const linesHTML = invoice.lines.map(line => `
      <tr>
        <td>${line.description}</td>
        <td class="num">${line.quantity}</td>
        <td class="num">${app.formatCurrency(line.unitPrice)}</td>
        <td class="num">${app.formatCurrency(line.amount)}</td>
      </tr>
    `).join('');

    const content = `
      <div style="background: var(--card); padding: 16px; border-radius: var(--radius); margin-bottom: 16px;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          <div>
            <h4 style="margin-top: 0;">Datos de Facturación</h4>
            <div><strong>Número:</strong> ${invoice.number}</div>
            <div><strong>Fecha:</strong> ${invoice.date}</div>
            <div><strong>Vencimiento:</strong> ${invoice.dueDate}</div>
          </div>
          <div>
            <h4 style="margin-top: 0;">Datos del Cliente</h4>
            <div><strong>${invoice.client.name}</strong></div>
            <div>RUT: ${invoice.client.rut || '-'}</div>
            <div>Email: ${invoice.client.email || '-'}</div>
          </div>
        </div>
      </div>

      <table class="table">
        <thead>
          <tr>
            <th>Descripción</th>
            <th class="num">Cantidad</th>
            <th class="num">Precio</th>
            <th class="num">Monto</th>
          </tr>
        </thead>
        <tbody>
          ${linesHTML}
        </tbody>
      </table>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
        <div></div>
        <div style="background: var(--card); padding: 12px; border-radius: var(--radius);">
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span>Subtotal:</span>
            <span class="num">${app.formatCurrency(invoice.subtotal)}</span>
          </div>
          ${this.projectIncludeTax ? `
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span>${this.projectTaxName} (${Math.round(this.projectTaxRate * 100)}%):</span>
            <span class="num">${app.formatCurrency(invoice.tax)}</span>
          </div>
          ` : ''}
          <div style="display: flex; justify-content: space-between; border-top: 1px solid var(--stroke); padding-top: 8px;">
            <strong>Total:</strong>
            <strong class="num">${app.formatCurrency(invoice.total)}</strong>
          </div>
        </div>
      </div>
    `;

    document.getElementById('viewInvoiceNumber').textContent = `Factura ${invoice.number}`;
    document.getElementById('viewInvoiceContent').innerHTML = content;

    const btnChangeStatus = document.getElementById('btnChangeStatus');
    btnChangeStatus.onclick = async () => {
      const statuses = ['draft', 'sent', 'paid', 'overdue'];
      const currentIndex = statuses.indexOf(invoice.status);
      const nextStatus = statuses[(currentIndex + 1) % statuses.length];

      await db.update('invoices', invoiceId, { status: nextStatus });
      document.getElementById('viewInvoiceModal').style.display = 'none';
      await router.navigate('/invoices');
    };

    document.getElementById('viewInvoiceModal').style.display = 'flex';
  },

  async downloadInvoiceAsPDF(invoiceId) {
    const invoice = await db.read('invoices', invoiceId);
    if (!invoice) return;

    const taxPercent = Math.round(this.projectTaxRate * 100);
    const content = `
FACTURA ${invoice.number}
${'='.repeat(50)}

FECHA: ${invoice.date}
VENCIMIENTO: ${invoice.dueDate}

CLIENTE: ${invoice.client.name}
RUT: ${invoice.client.rut || '-'}
EMAIL: ${invoice.client.email || '-'}

${'='.repeat(50)}
LÍNEAS DE FACTURA
${'='.repeat(50)}

${invoice.lines.map(l => `${l.description.padEnd(30)} ${l.quantity} x ${app.formatCurrency(l.unitPrice)} = ${app.formatCurrency(l.amount)}`).join('\n')}

${'='.repeat(50)}
SUBTOTAL: ${app.formatCurrency(invoice.subtotal)}
${this.projectIncludeTax ? `${this.projectTaxName} (${taxPercent}%): ${app.formatCurrency(invoice.tax)}` : ''}
TOTAL: ${app.formatCurrency(invoice.total)}
${'='.repeat(50)}

MÉTODO DE PAGO: ${invoice.paymentMethod}
ESTADO: ${invoice.status}

${invoice.notes ? 'NOTAS: ' + invoice.notes : ''}
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${invoice.number}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  },

  filterByStatus(status) {
    // Would filter visible invoices by status
    // For now, this is a placeholder for UI filtering
  },

  async importInvoiceFromFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const ext = file.name.toLowerCase().split('.').pop();
      let data = null;

      // Parse file based on extension
      if (ext === 'xlsx' || ext === 'xls') {
        data = await this.parseInvoiceExcel(file);
      } else if (ext === 'csv' || ext === 'txt') {
        data = await this.parseInvoiceCSV(file);
      } else if (ext === 'json') {
        data = await this.parseInvoiceJSON(file);
      } else if (ext === 'xml') {
        data = await this.parseInvoiceXML(file);
      } else if (ext === 'pdf') {
        data = await this.parseInvoicePDF(file);
      } else {
        alert('Formato no soportado: .' + ext + '\n\nFormatos válidos: xlsx, xls, csv, txt, json, xml, pdf');
        return;
      }

      if (!data || !data.lines || data.lines.length === 0) {
        alert('No se pudieron extraer datos de factura del archivo. Verifica el formato.');
        return;
      }

      // Open modal and populate form
      const nextNumber = await this.generateNextInvoiceNumber();
      document.getElementById('invoiceModalTitle').textContent = 'Nueva Factura (Importada)';
      document.getElementById('invoiceNumber').value = nextNumber;
      document.getElementById('invoiceDate').value = data.date || new Date().toISOString().split('T')[0];
      document.getElementById('invoiceDueDate').value = data.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      document.getElementById('clientName').value = data.clientName || '';
      document.getElementById('clientRut').value = data.clientRut || '';
      document.getElementById('clientEmail').value = data.clientEmail || '';
      document.getElementById('clientPhone').value = data.clientPhone || '';

      // Clear and populate lines
      document.getElementById('invoiceLines').innerHTML = '';
      this.currentInvoiceLines = [];

      for (const line of data.lines) {
        this.addInvoiceLine();
        const lineEl = document.querySelector('[data-line="' + (this.currentInvoiceLines.length - 1) + '"]');
        lineEl.querySelector('.line-description').value = line.description || '';
        lineEl.querySelector('.line-quantity').value = line.quantity || 1;
        lineEl.querySelector('.line-unitprice').value = line.unitPrice || 0;
        lineEl.querySelector('.line-amount').textContent = app.formatCurrency((line.quantity || 1) * (line.unitPrice || 0));
      }

      this.updateInvoiceTotal();
      this.editingInvoiceId = null;
      document.getElementById('invoiceModal').style.display = 'flex';
    } catch (error) {
      console.error('Error importing invoice file:', error);
      alert('Error al importar archivo: ' + error.message);
    } finally {
      event.target.value = '';
    }
  },

  async parseInvoiceExcel(file) {
    const self = this;
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          if (typeof XLSX === 'undefined') {
            throw new Error('Librería XLSX no disponible');
          }
          const workbook = XLSX.read(e.target.result, { type: 'array' });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const rows = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
          if (rows && rows.length > 0) {
            resolve(self.extractInvoiceDataFromRows(rows));
          } else {
            resolve(null);
          }
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Error al leer archivo'));
      reader.readAsArrayBuffer(file);
    });
  },

  async parseInvoiceCSV(file) {
    const self = this;
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target.result;
          const lines = content.trim().split('\n');
          if (lines.length < 2) {
            resolve(null);
            return;
          }
          const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
          const rows = [];
          for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(v => v.trim());
            const row = {};
            headers.forEach((header, idx) => {
              row[header] = values[idx] || '';
            });
            rows.push(row);
          }
          resolve(self.extractInvoiceDataFromRows(rows));
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Error al leer archivo'));
      reader.readAsText(file);
    });
  },

  async parseInvoiceJSON(file) {
    const self = this;
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target.result);
          let rows = Array.isArray(json) ? json : [json];
          if (!Array.isArray(json) && typeof json === 'object') {
            const keys = Object.keys(json);
            for (const key of keys) {
              if (Array.isArray(json[key])) {
                rows = json[key];
                break;
              }
            }
          }
          if (rows.length > 0) {
            resolve(self.extractInvoiceDataFromRows(rows));
          } else {
            resolve(null);
          }
        } catch (error) {
          reject(new Error('JSON inválido'));
        }
      };
      reader.onerror = () => reject(new Error('Error al leer archivo'));
      reader.readAsText(file);
    });
  },

  async parseInvoiceXML(file) {
    const self = this;
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const xml = new DOMParser().parseFromString(e.target.result, 'text/xml');
          if (xml.getElementsByTagName('parsererror').length > 0) {
            throw new Error('XML inválido');
          }
          const rows = [];
          const elements = xml.documentElement.children;
          for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            if (element.children.length > 0) {
              const obj = {};
              for (let j = 0; j < element.children.length; j++) {
                const child = element.children[j];
                obj[child.tagName.toLowerCase()] = child.textContent || '';
              }
              rows.push(obj);
            }
          }
          if (rows.length > 0) {
            resolve(self.extractInvoiceDataFromRows(rows));
          } else {
            resolve(null);
          }
        } catch (error) {
          reject(new Error('Error al parsear XML'));
        }
      };
      reader.onerror = () => reject(new Error('Error al leer archivo'));
      reader.readAsText(file);
    });
  },

  async parseInvoicePDF(file) {
    return new Promise((resolve, reject) => {
      reject(new Error('Los PDFs requieren procesamiento especial. Use CSV o Excel en su lugar.'));
    });
  },


  extractInvoiceDataFromRows(rows) {
    const data = {
      clientName: '',
      clientRut: '',
      clientEmail: '',
      clientPhone: '',
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      lines: []
    };

    const firstRow = rows[0];
    const keys = Object.keys(firstRow);

    // Try to detect client name, email, etc.
    for (const key of keys) {
      const keyLower = key.toLowerCase();
      if (keyLower.includes('cliente') || keyLower.includes('nombre')) {
        data.clientName = firstRow[key] || data.clientName;
      }
      if (keyLower.includes('rut') || keyLower.includes('id')) {
        data.clientRut = firstRow[key] || data.clientRut;
      }
      if (keyLower.includes('email') || keyLower.includes('correo')) {
        data.clientEmail = firstRow[key] || data.clientEmail;
      }
      if (keyLower.includes('teléfono') || keyLower.includes('phone')) {
        data.clientPhone = firstRow[key] || data.clientPhone;
      }
      if (keyLower.includes('fecha') && keyLower.includes('factura')) {
        if (firstRow[key]) data.date = firstRow[key];
      }
    }

    // Extract line items - look for description, quantity, price columns
    for (const row of rows) {
      let description = '';
      let quantity = 1;
      let unitPrice = 0;

      for (const key of keys) {
        const keyLower = key.toLowerCase();
        if (keyLower.includes('descripción') || keyLower.includes('descripcion') || keyLower.includes('concepto')) {
          description = row[key];
        }
        if (keyLower.includes('cantidad') || keyLower.includes('qty') || keyLower.includes('cantidad')) {
          const val = parseFloat(row[key]);
          if (!isNaN(val)) quantity = val;
        }
        if (keyLower.includes('precio') || keyLower.includes('unitario') || keyLower.includes('price') || keyLower.includes('value')) {
          const val = parseFloat(row[key]);
          if (!isNaN(val)) unitPrice = val;
        }
      }

      if (description && unitPrice > 0) {
        data.lines.push({ description, quantity, unitPrice });
      }
    }

    return data.lines.length > 0 ? data : null;
  }
};
