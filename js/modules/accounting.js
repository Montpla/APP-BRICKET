// Accounting Module - Chart of Accounts, Journal Entries, Financial Reports
export const accountingModule = {
  accounts: [],
  entries: [],
  filters: { type: 'all', search: '' },
  editingAccountId: null,

  async render() {
    const project = await app.getActiveProject();
    const accounts = await db.getByIndex('chartOfAccounts', 'projectId', project.id);
    const entries = await db.getByIndex('journalEntries', 'projectId', project.id);

    const accountsHTML = (accounts || []).slice(0, 15).map(acc => `
      <tr>
        <td><strong>${acc.code}</strong></td>
        <td>${acc.name}</td>
        <td><span class="badge type-${acc.type}">${acc.type}</span></td>
        <td class="num">${app.formatCurrency(acc.balance)}</td>
        <td>
          <button class="btn-edit-account" data-account-id="${acc.id}">✎</button>
          <button class="btn-delete-account" data-account-id="${acc.id}">✕</button>
        </td>
      </tr>
    `).join('');

    const entriesHTML = (entries || []).slice(0, 10).map(entry => `
      <tr>
        <td>${entry.date}</td>
        <td>${entry.description}</td>
        <td><span class="badge status-${entry.status}">${entry.status}</span></td>
        <td class="num">${app.formatCurrency(entry.lines.reduce((s,l) => s + (l.debit || 0), 0))}</td>
        <td>
          <button class="btn-view-entry" data-entry-id="${entry.id}">Ver</button>
          ${entry.status === 'posted' ? `<button class="btn-reverse-entry" data-entry-id="${entry.id}">Reversar</button>` : ''}
        </td>
      </tr>
    `).join('');

    return `
      <div class="accounting-page">
        <div class="page-header">
          <h1>Contabilidad</h1>
          <div class="header-actions">
            <button id="btn-new-account" class="btn btn-primary">+ Cuenta</button>
            <button id="btn-new-entry" class="btn btn-primary">+ Asiento</button>
            <button id="btn-import-accounting" class="btn">📤 Importar desde archivo</button>
          </div>
        </div>
        <input type="file" id="fileImportAccounting" accept=".xlsx,.xls,.csv,.json,.xml,.txt" style="display:none;">

        <div class="tabs">
          <button class="tab active" data-tab="accounts">Plan de Cuentas</button>
          <button class="tab" data-tab="entries">Asientos</button>
          <button class="tab" data-tab="reports">Estados Financieros</button>
        </div>

        <div class="tab-content">
          <div id="accounts-tab" class="tab-panel active">
            <div style="margin-bottom: 16px;">
              <input type="text" id="searchAccounts" placeholder="Buscar cuenta..." style="width: 300px;">
              <select id="filterType" style="width: 200px;">
                <option value="all">Todos los tipos</option>
                <option value="asset">Activo</option>
                <option value="liability">Pasivo</option>
                <option value="equity">Patrimonio</option>
                <option value="income">Ingreso</option>
                <option value="expense">Gasto</option>
              </select>
            </div>
            <table class="table">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Nombre</th>
                  <th>Tipo</th>
                  <th class="num">Saldo</th>
                  <th style="width: 100px;">Acciones</th>
                </tr>
              </thead>
              <tbody>
                ${accountsHTML}
              </tbody>
            </table>
          </div>

          <div id="entries-tab" class="tab-panel">
            <table class="table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Descripción</th>
                  <th>Estado</th>
                  <th class="num">Monto</th>
                  <th style="width: 150px;">Acciones</th>
                </tr>
              </thead>
              <tbody>
                ${entriesHTML}
              </tbody>
            </table>
          </div>

          <div id="reports-tab" class="tab-panel">
            <div style="margin-bottom: 16px;">
              <label>Tipo de reporte:</label>
              <select id="reportType">
                <option value="summary">Resumen de Cuentas</option>
                <option value="income-statement">Estado de Resultados</option>
                <option value="balance-sheet">Balance General</option>
              </select>
              <button id="btn-generate-report" class="btn btn-primary">Generar</button>
              <button id="btn-export-report" class="btn">Descargar PDF</button>
            </div>
            <div id="reportContent" style="background: var(--card); padding: 20px; border-radius: var(--radius); overflow-x: auto;"></div>
          </div>
        </div>
      </div>

      <!-- Modal Cuenta -->
      <div id="accountModal" class="modal" style="display:none;">
        <div class="modal-content">
          <div class="modal-header">
            <h2 id="accountModalTitle">Nueva Cuenta</h2>
            <button class="btn-close" id="btnCloseAccountModal">×</button>
          </div>
          <form id="accountForm" class="form">
            <div class="form-group">
              <label>Código de Cuenta *</label>
              <input type="text" id="accountCode" placeholder="Ej: 1.1.1" required>
            </div>
            <div class="form-group">
              <label>Nombre *</label>
              <input type="text" id="accountName" placeholder="Ej: Banco Principal" required>
            </div>
            <div class="layout-2col">
              <div class="form-group">
                <label>Tipo *</label>
                <select id="accountType" required>
                  <option value="asset">Activo</option>
                  <option value="liability">Pasivo</option>
                  <option value="equity">Patrimonio</option>
                  <option value="income">Ingreso</option>
                  <option value="expense">Gasto</option>
                </select>
              </div>
              <div class="form-group">
                <label>Saldo Inicial</label>
                <input type="number" id="accountBalance" placeholder="0" value="0">
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" id="btnCancelAccountModal">Cancelar</button>
              <button type="submit" class="btn btn-primary">Guardar Cuenta</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Modal Asiento -->
      <div id="entryModal" class="modal" style="display:none;">
        <div class="modal-content" style="max-width: 700px;">
          <div class="modal-header">
            <h2 id="entryModalTitle">Nuevo Asiento</h2>
            <button class="btn-close" id="btnCloseEntryModal">×</button>
          </div>
          <form id="entryForm" class="form">
            <div class="layout-2col">
              <div class="form-group">
                <label>Fecha *</label>
                <input type="date" id="entryDate" required>
              </div>
              <div class="form-group">
                <label>Estado</label>
                <select id="entryStatus">
                  <option value="draft">Borrador</option>
                  <option value="posted">Registrado</option>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label>Descripción *</label>
              <input type="text" id="entryDescription" placeholder="Descripción del asiento" required>
            </div>
            <div style="margin-bottom: 16px;">
              <h4>Líneas del Asiento</h4>
              <div id="entryLines"></div>
              <button type="button" class="btn" id="btnAddLine">+ Agregar Línea</button>
            </div>
            <div class="layout-2col">
              <div style="padding: 12px; background: var(--card); border-radius: var(--radius);">
                <small>Total Débitos</small>
                <div class="num" style="font-size: 18px; font-weight: 600;" id="totalDebits">0</div>
              </div>
              <div style="padding: 12px; background: var(--card); border-radius: var(--radius);">
                <small>Total Créditos</small>
                <div class="num" style="font-size: 18px; font-weight: 600;" id="totalCredits">0</div>
              </div>
            </div>
            <div id="balanceWarning" style="color: var(--red); font-size: 12px; margin-top: 8px;"></div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" id="btnCancelEntryModal">Cancelar</button>
              <button type="submit" class="btn btn-primary">Guardar Asiento</button>
            </div>
          </form>
        </div>
      </div>
    `;
  },

  async init() {
    console.log('Accounting module initialized');

    // File import
    const fileImportAccounting = document.getElementById('fileImportAccounting');
    const btnImportAccounting = document.getElementById('btn-import-accounting');

    if (btnImportAccounting) {
      btnImportAccounting.addEventListener('click', () => fileImportAccounting?.click());
    }

    if (fileImportAccounting) {
      fileImportAccounting.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          this.importAccountingFromFile(file);
        }
      });
    }

    // Tab switching
    document.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        const tabName = e.target.getAttribute('data-tab');
        document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        e.target.classList.add('active');
        document.getElementById(tabName + '-tab').classList.add('active');
      });
    });

    // Account modal
    const accountModal = document.getElementById('accountModal');
    const btnNewAccount = document.getElementById('btn-new-account');
    const btnCloseAccountModal = document.getElementById('btnCloseAccountModal');
    const btnCancelAccountModal = document.getElementById('btnCancelAccountModal');
    const accountForm = document.getElementById('accountForm');

    if (btnNewAccount) {
      btnNewAccount.addEventListener('click', () => {
        this.editingAccountId = null;
        document.getElementById('accountModalTitle').textContent = 'Nueva Cuenta';
        accountForm.reset();
        accountModal.style.display = 'flex';
      });
    }

    if (btnCloseAccountModal) {
      btnCloseAccountModal.addEventListener('click', () => {
        accountModal.style.display = 'none';
      });
    }

    if (btnCancelAccountModal) {
      btnCancelAccountModal.addEventListener('click', () => {
        accountModal.style.display = 'none';
      });
    }

    if (accountForm) {
      accountForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.saveAccount();
      });
    }

    // Account edit/delete
    document.querySelectorAll('.btn-edit-account').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const accountId = e.target.getAttribute('data-account-id');
        await this.editAccount(accountId);
      });
    });

    document.querySelectorAll('.btn-delete-account').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const accountId = e.target.getAttribute('data-account-id');
        if (confirm('¿Eliminar esta cuenta?')) {
          await db.delete('chartOfAccounts', accountId);
          await router.navigate('/accounting');
        }
      });
    });

    // Entry modal
    const entryModal = document.getElementById('entryModal');
    const btnNewEntry = document.getElementById('btn-new-entry');
    const btnCloseEntryModal = document.getElementById('btnCloseEntryModal');
    const btnCancelEntryModal = document.getElementById('btnCancelEntryModal');
    const entryForm = document.getElementById('entryForm');
    const btnAddLine = document.getElementById('btnAddLine');

    if (btnNewEntry) {
      btnNewEntry.addEventListener('click', () => {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('entryDate').value = today;
        document.getElementById('entryDescription').value = '';
        document.getElementById('entryStatus').value = 'draft';
        document.getElementById('entryLines').innerHTML = '';
        this.addEntryLine();
        this.addEntryLine();
        entryModal.style.display = 'flex';
      });
    }

    if (btnCloseEntryModal) {
      btnCloseEntryModal.addEventListener('click', () => {
        entryModal.style.display = 'none';
      });
    }

    if (btnCancelEntryModal) {
      btnCancelEntryModal.addEventListener('click', () => {
        entryModal.style.display = 'none';
      });
    }

    if (btnAddLine) {
      btnAddLine.addEventListener('click', (e) => {
        e.preventDefault();
        this.addEntryLine();
      });
    }

    if (entryForm) {
      entryForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.saveEntry();
      });
    }

    // Set default date
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('entryDate');
    if (dateInput) dateInput.value = today;

    // Search and filter
    const searchAccounts = document.getElementById('searchAccounts');
    const filterType = document.getElementById('filterType');

    if (searchAccounts) {
      searchAccounts.addEventListener('input', (e) => {
        this.filters.search = e.target.value;
        this.applyAccountFilters();
      });
    }

    if (filterType) {
      filterType.addEventListener('change', (e) => {
        this.filters.type = e.target.value;
        this.applyAccountFilters();
      });
    }

    // Reports
    const btnGenerateReport = document.getElementById('btn-generate-report');
    const btnExportReport = document.getElementById('btn-export-report');

    if (btnGenerateReport) {
      btnGenerateReport.addEventListener('click', () => this.generateReport());
    }

    if (btnExportReport) {
      btnExportReport.addEventListener('click', () => this.exportReport());
    }
  },

  addEntryLine() {
    const project = app.getActiveProject();
    const accounts = db.getByIndex('chartOfAccounts', 'projectId', project.id).then(accs => accs || []);

    accounts.then(accs => {
      const entryLines = document.getElementById('entryLines');
      const lineIndex = entryLines.children.length;
      const lineHTML = `
        <div class="entry-line" style="display: grid; grid-template-columns: 1fr 1fr 1fr 80px; gap: 8px; margin-bottom: 8px; padding: 8px; background: var(--card); border-radius: 4px;">
          <select class="account-select" data-line="${lineIndex}" required>
            <option value="">Seleccionar cuenta...</option>
            ${accs.map(a => `<option value="${a.id}">${a.code} - ${a.name}</option>`).join('')}
          </select>
          <input type="number" class="debit-input" data-line="${lineIndex}" placeholder="Débito" step="0.01" value="0">
          <input type="number" class="credit-input" data-line="${lineIndex}" placeholder="Crédito" step="0.01" value="0">
          <button type="button" class="btn-remove-line" data-line="${lineIndex}" style="padding: 6px; font-size: 12px;">✕</button>
        </div>
      `;
      entryLines.insertAdjacentHTML('beforeend', lineHTML);

      const removeBtn = document.querySelector(`[data-line="${lineIndex}"].btn-remove-line`);
      if (removeBtn) {
        removeBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.target.parentElement.remove();
          this.updateLineBalance();
        });
      }

      const inputs = document.querySelectorAll(`[data-line="${lineIndex}"]`);
      inputs.forEach(input => {
        input.addEventListener('input', () => this.updateLineBalance());
      });
    });
  },

  updateLineBalance() {
    let totalDebits = 0;
    let totalCredits = 0;

    document.querySelectorAll('.debit-input').forEach(input => {
      totalDebits += parseFloat(input.value) || 0;
    });

    document.querySelectorAll('.credit-input').forEach(input => {
      totalCredits += parseFloat(input.value) || 0;
    });

    document.getElementById('totalDebits').textContent = app.formatCurrency(totalDebits);
    document.getElementById('totalCredits').textContent = app.formatCurrency(totalCredits);

    const diff = Math.abs(totalDebits - totalCredits);
    const warning = document.getElementById('balanceWarning');
    if (diff > 0.01) {
      warning.textContent = `Desbalance: ${app.formatCurrency(diff)}`;
    } else {
      warning.textContent = '';
    }
  },

  async saveAccount() {
    const accountData = {
      code: document.getElementById('accountCode').value.trim(),
      name: document.getElementById('accountName').value.trim(),
      type: document.getElementById('accountType').value,
      balance: parseFloat(document.getElementById('accountBalance').value) || 0,
      projectId: (await app.getActiveProject()).id,
      active: true,
      createdAt: Date.now()
    };

    if (!accountData.code || !accountData.name) {
      alert('Código y nombre son requeridos');
      return;
    }

    try {
      if (this.editingAccountId) {
        await db.update('chartOfAccounts', this.editingAccountId, accountData);
      } else {
        await db.create('chartOfAccounts', accountData);
      }
      document.getElementById('accountModal').style.display = 'none';
      await router.navigate('/accounting');
    } catch (error) {
      console.error('Error saving account:', error);
      alert('Error al guardar cuenta: ' + error.message);
    }
  },

  async editAccount(accountId) {
    const account = await db.read('chartOfAccounts', accountId);
    if (!account) return;

    this.editingAccountId = accountId;
    document.getElementById('accountModalTitle').textContent = 'Editar Cuenta';
    document.getElementById('accountCode').value = account.code;
    document.getElementById('accountName').value = account.name;
    document.getElementById('accountType').value = account.type;
    document.getElementById('accountBalance').value = account.balance;

    document.getElementById('accountModal').style.display = 'flex';
  },

  async saveEntry() {
    const project = await app.getActiveProject();
    const date = document.getElementById('entryDate').value;
    const description = document.getElementById('entryDescription').value.trim();
    const status = document.getElementById('entryStatus').value;

    const lines = [];
    document.querySelectorAll('.entry-line').forEach((lineEl, idx) => {
      const accountId = lineEl.querySelector('.account-select').value;
      const debit = parseFloat(lineEl.querySelector('.debit-input').value) || 0;
      const credit = parseFloat(lineEl.querySelector('.credit-input').value) || 0;

      if (accountId && (debit > 0 || credit > 0)) {
        lines.push({ accountId, debit, credit });
      }
    });

    if (lines.length < 2) {
      alert('El asiento debe tener al menos 2 líneas');
      return;
    }

    const totalDebits = lines.reduce((s, l) => s + l.debit, 0);
    const totalCredits = lines.reduce((s, l) => s + l.credit, 0);

    if (Math.abs(totalDebits - totalCredits) > 0.01) {
      alert('El asiento no está balanceado');
      return;
    }

    try {
      const entryData = {
        projectId: project.id,
        date,
        description,
        status,
        lines,
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

      document.getElementById('entryModal').style.display = 'none';
      await router.navigate('/accounting');
    } catch (error) {
      console.error('Error saving entry:', error);
      alert('Error al guardar asiento: ' + error.message);
    }
  },

  applyAccountFilters() {
    // Would filter visible accounts based on this.filters.search and this.filters.type
    // For now, this is a placeholder for advanced filtering
  },

  async generateReport() {
    const project = await app.getActiveProject();
    const reportType = document.getElementById('reportType').value;
    const accounts = await db.getByIndex('chartOfAccounts', 'projectId', project.id);

    let reportHTML = '';

    if (reportType === 'summary') {
      reportHTML = `<h3>Resumen de Cuentas</h3>
        <table class="table">
          <thead><tr><th>Código</th><th>Nombre</th><th>Tipo</th><th class="num">Saldo</th></tr></thead>
          <tbody>
            ${(accounts || []).map(a => `
              <tr>
                <td>${a.code}</td>
                <td>${a.name}</td>
                <td>${a.type}</td>
                <td class="num">${app.formatCurrency(a.balance)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>`;
    } else if (reportType === 'income-statement') {
      const incomes = (accounts || []).filter(a => a.type === 'income');
      const expenses = (accounts || []).filter(a => a.type === 'expense');
      const totalIncome = incomes.reduce((s, a) => s + a.balance, 0);
      const totalExpense = expenses.reduce((s, a) => s + a.balance, 0);
      const netIncome = totalIncome - totalExpense;

      reportHTML = `<h3>Estado de Resultados</h3>
        <table class="table">
          <tr><td><strong>Ingresos</strong></td><td class="num"><strong>${app.formatCurrency(totalIncome)}</strong></td></tr>
          <tr><td><strong>Gastos</strong></td><td class="num"><strong>${app.formatCurrency(totalExpense)}</strong></td></tr>
          <tr style="border-top: 2px solid var(--stroke);"><td><strong>Resultado Neto</strong></td><td class="num"><strong>${app.formatCurrency(netIncome)}</strong></td></tr>
        </table>`;
    } else if (reportType === 'balance-sheet') {
      const assets = (accounts || []).filter(a => a.type === 'asset').reduce((s, a) => s + a.balance, 0);
      const liabilities = (accounts || []).filter(a => a.type === 'liability').reduce((s, a) => s + a.balance, 0);
      const equity = (accounts || []).filter(a => a.type === 'equity').reduce((s, a) => s + a.balance, 0);

      reportHTML = `<h3>Balance General</h3>
        <table class="table">
          <tr><td><strong>Activos</strong></td><td class="num"><strong>${app.formatCurrency(assets)}</strong></td></tr>
          <tr><td><strong>Pasivos</strong></td><td class="num"><strong>${app.formatCurrency(liabilities)}</strong></td></tr>
          <tr><td><strong>Patrimonio</strong></td><td class="num"><strong>${app.formatCurrency(equity)}</strong></td></tr>
          <tr style="border-top: 2px solid var(--stroke);"><td><strong>Total Pasivo + Patrimonio</strong></td><td class="num"><strong>${app.formatCurrency(liabilities + equity)}</strong></td></tr>
        </table>`;
    }

    document.getElementById('reportContent').innerHTML = reportHTML;
  },

  exportReport() {
    const content = document.getElementById('reportContent').innerText;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `reporte_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  },

  async importAccountingFromFile(file) {
    try {
      const ext = file.name.toLowerCase().split('.').pop();
      const project = await app.getActiveProject();
      let rows = [];

      if (ext === 'xlsx' || ext === 'xls') {
        const text = await file.arrayBuffer();
        const workbook = XLSX.read(text, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        rows = XLSX.utils.sheet_to_json(sheet);
      } else if (ext === 'csv' || ext === 'txt') {
        const text = await file.text();
        const lines = text.split('\n').filter(l => l.trim());
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        rows = lines.slice(1).map(line => {
          const values = line.split(',').map(v => v.trim());
          const obj = {};
          headers.forEach((h, i) => obj[h] = values[i]);
          return obj;
        });
      } else if (ext === 'json') {
        const text = await file.text();
        const data = JSON.parse(text);
        rows = Array.isArray(data) ? data : (data.cuentas || data.accounts || []);
      } else if (ext === 'xml') {
        const text = await file.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'application/xml');
        const items = doc.querySelectorAll('cuenta, account, row, item');
        rows = Array.from(items).map(el => ({
          codigo: el.querySelector('codigo, code, id')?.textContent || '',
          nombre: el.querySelector('nombre, name')?.textContent || '',
          tipo: el.querySelector('tipo, type')?.textContent || 'asset',
          saldo: parseFloat(el.querySelector('saldo, balance, amount')?.textContent || 0)
        }));
      }

      if (rows.length === 0) {
        alert('No se encontraron datos en el archivo');
        return;
      }

      // Detect if file contains accounts or journal entries
      const firstRow = rows[0];
      const hasAccountFields = Object.keys(firstRow).some(k =>
        k.toLowerCase().includes('código') || k.toLowerCase().includes('code') ||
        k.toLowerCase().includes('cuenta') || k.toLowerCase().includes('account')
      );
      const hasEntryFields = Object.keys(firstRow).some(k =>
        k.toLowerCase().includes('fecha') || k.toLowerCase().includes('date') ||
        k.toLowerCase().includes('asiento')
      );

      if (hasAccountFields) {
        await this.importAccounts(rows, project.id);
      } else if (hasEntryFields) {
        await this.importEntries(rows, project.id);
      } else {
        alert('No se pudo detectar el tipo de datos. Asegúrate de tener columnas para códigos o fechas.');
      }
    } catch (error) {
      console.error('Error importing accounting file:', error);
      alert('Error al importar: ' + error.message);
    }
  },

  async importAccounts(rows, projectId) {
    const accounts = rows.map((row, idx) => ({
      projectId,
      code: row.código || row.code || row.codigo || `${idx+1}`,
      name: row.nombre || row.name || 'Sin nombre',
      type: (row.tipo || row.type || 'asset').toLowerCase(),
      balance: parseFloat(row.saldo || row.balance || row.amount || 0) || 0,
      category: row.categoría || row.category || 'general',
      active: true,
      createdAt: Date.now()
    }));

    let importedCount = 0;
    for (const acc of accounts) {
      try {
        await db.create('chartOfAccounts', acc);
        importedCount++;
      } catch (e) {
        console.error('Error importing account:', e);
      }
    }

    alert(`✓ ${importedCount} cuentas importadas exitosamente`);
    await router.navigate('/accounting');
  },

  async importEntries(rows, projectId) {
    const accounts = await db.getByIndex('chartOfAccounts', 'projectId', projectId) || [];
    const entries = rows.map(row => ({
      projectId,
      date: row.fecha || row.date || new Date().toISOString().split('T')[0],
      description: row.descripción || row.description || row.desc || '',
      status: row.estado || row.status || 'draft',
      lines: [
        {
          accountId: accounts[0]?.id || '',
          debit: parseFloat(row.débito || row.debit || 0) || 0,
          credit: 0,
          description: row.descripción_línea || 'Débito'
        },
        {
          accountId: accounts[1]?.id || '',
          debit: 0,
          credit: parseFloat(row.crédito || row.credit || 0) || 0,
          description: row.descripción_línea2 || 'Crédito'
        }
      ],
      createdAt: Date.now()
    }));

    let importedCount = 0;
    for (const entry of entries) {
      try {
        await db.create('journalEntries', entry);
        importedCount++;
      } catch (e) {
        console.error('Error importing entry:', e);
      }
    }

    alert(`✓ ${importedCount} asientos importados exitosamente`);
    await router.navigate('/accounting');
  }
};
