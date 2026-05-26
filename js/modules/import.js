// Import Module - Multi-Format Data Importer
export const importModule = {
  currentFile: null,
  currentData: null,
  dataType: null,

  async render() {
    return `
      <div class="import-page">
        <div class="page-header">
          <h1>Importador de Datos</h1>
          <p class="subtitle">Carga datos desde Excel, CSV y otros formatos</p>
        </div>

        <div class="import-container">
          <div class="upload-zone" id="uploadZone">
            <div class="upload-icon">📁</div>
            <h3>Arrastra archivos aquí</h3>
            <p>Formatos: Excel (.xlsx, .xls), CSV, JSON, XML, PDF</p>
            <input type="file" id="fileInput" accept=".xlsx,.xls,.csv,.json,.xml,.pdf,.txt" style="display:none;">
          </div>

          <div id="previewArea" style="display:none;">
            <h3>Vista previa - <span id="dataTypeLabel"></span></h3>
            <div style="margin-bottom: 16px;">
              <label>Tipo de datos detectado:</label>
              <select id="dataTypeSelector">
                <option value="budget">Presupuesto</option>
                <option value="expense">Gastos</option>
                <option value="income">Ingresos</option>
                <option value="invoice">Facturas</option>
                <option value="generic">Genérico</option>
              </select>
            </div>
            <div style="margin-bottom: 16px; padding: 12px; background: var(--card); border-radius: var(--radius);">
              <h4 style="margin-top: 0;">Opciones de importación</h4>
              <div class="form-group inline">
                <input type="checkbox" id="createNewProject" checked>
                <label for="createNewProject">Crear nuevo proyecto con estos datos</label>
              </div>
              <div class="form-group" id="newProjectNameGroup">
                <label>Nombre del proyecto *</label>
                <input type="text" id="newProjectName" placeholder="Ej: Proyecto Nuevo" style="width: 100%;">
              </div>
            </div>
            <div id="previewContent" style="overflow-x: auto; margin-bottom: 16px;"></div>
            <div id="validationMessages" style="margin-bottom: 16px;"></div>
            <div style="display: flex; gap: 12px;">
              <button id="btnConfirmImport" class="btn btn-primary">✓ Importar <span id="recordCount"></span> registros</button>
              <button id="btnCancelImport" class="btn">Cancelar</button>
            </div>
          </div>
        </div>

        <div id="importHistory">
          <h3>Historial de importaciones</h3>
          <div id="historyList"></div>
        </div>
      </div>
    `;
  },

  async init() {
    console.log('Import module initialized');

    const uploadZone = document.getElementById('uploadZone');
    const fileInput = document.getElementById('fileInput');
    const btnConfirm = document.getElementById('btnConfirmImport');
    const btnCancel = document.getElementById('btnCancelImport');
    const dataTypeSelector = document.getElementById('dataTypeSelector');

    if (uploadZone && fileInput) {
      uploadZone.addEventListener('click', () => fileInput.click());

      uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadZone.classList.add('dragover');
      });

      uploadZone.addEventListener('dragleave', () => {
        uploadZone.classList.remove('dragover');
      });

      uploadZone.addEventListener('drop', async (e) => {
        e.preventDefault();
        uploadZone.classList.remove('dragover');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
          await this.handleFile(files[0]);
        }
      });

      fileInput.addEventListener('change', async (e) => {
        if (e.target.files.length > 0) {
          await this.handleFile(e.target.files[0]);
        }
      });
    }

    if (btnConfirm) {
      btnConfirm.addEventListener('click', () => this.confirmImport());
    }

    if (btnCancel) {
      btnCancel.addEventListener('click', () => this.cancelImport());
    }

    if (dataTypeSelector) {
      dataTypeSelector.addEventListener('change', (e) => {
        this.dataType = e.target.value;
      });
    }

    // Create new project toggle
    const createNewProjectCheckbox = document.getElementById('createNewProject');
    const newProjectNameInput = document.getElementById('newProjectName');
    const newProjectNameGroup = document.getElementById('newProjectNameGroup');

    if (createNewProjectCheckbox && newProjectNameGroup) {
      createNewProjectCheckbox.addEventListener('change', (e) => {
        newProjectNameGroup.style.display = e.target.checked ? 'block' : 'none';
      });

      // Auto-fill with filename (without extension)
      if (newProjectNameInput) {
        const fileName = this.currentFile?.name?.replace(/\.[^.]+$/, '') || 'Nuevo Proyecto';
        newProjectNameInput.value = fileName;
      }
    }

    // Load history
    await this.loadHistory();
  },

  async handleFile(file) {
    try {
      const ext = file.name.toLowerCase().split('.').pop();

      let data = null;
      if (ext === 'xlsx' || ext === 'xls') {
        data = await this.parseExcel(file);
      } else if (ext === 'csv' || ext === 'txt') {
        data = await this.parseCSV(file);
      } else if (ext === 'json') {
        data = await this.parseJSON(file);
      } else if (ext === 'xml') {
        data = await this.parseXML(file);
      } else if (ext === 'pdf') {
        data = await this.parsePDF(file);
      } else {
        alert('Formato no soportado: .' + ext + '\n\nFormatos válidos: xlsx, xls, csv, txt, json, xml, pdf');
        return;
      }

      if (!Array.isArray(data) || data.length === 0) {
        alert('El archivo no contiene datos válidos o está vacío');
        return;
      }

      this.currentFile = file;
      this.currentData = data;
      this.dataType = this.detectDataType(data);

      this.showPreview(data);
    } catch (error) {
      console.error('Import error:', error);
      alert('Error al importar archivo:\n' + error.message);
    }
  },

  async parseExcel(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const workbook = XLSX.read(e.target.result, { type: 'array' });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const data = XLSX.utils.sheet_to_json(worksheet);
          resolve(data);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Error reading file'));
      reader.readAsArrayBuffer(file);
    });
  },

  async parseCSV(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const csv = e.target.result;
          const workbook = XLSX.read(csv, { type: 'string' });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const data = XLSX.utils.sheet_to_json(worksheet);
          resolve(data);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Error reading file'));
      reader.readAsText(file);
    });
  },

  async parseJSON(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target.result);
          let data = Array.isArray(json) ? json : [json];

          // Si es un objeto con una propiedad de array, usar esa
          if (!Array.isArray(json) && typeof json === 'object') {
            const keys = Object.keys(json);
            for (const key of keys) {
              if (Array.isArray(json[key])) {
                data = json[key];
                break;
              }
            }
          }

          resolve(data);
        } catch (error) {
          reject(new Error('JSON inválido: ' + error.message));
        }
      };
      reader.onerror = () => reject(new Error('Error al leer archivo'));
      reader.readAsText(file);
    });
  },

  async parseXML(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const xml = new DOMParser().parseFromString(e.target.result, 'text/xml');
          if (xml.getElementsByTagName('parsererror').length > 0) {
            throw new Error('XML inválido');
          }

          const data = [];

          // Buscar elementos que parecen filas (con múltiples hijos)
          const rows = xml.documentElement.children;
          for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            if (row.children.length > 0) {
              const obj = {};
              for (let j = 0; j < row.children.length; j++) {
                const child = row.children[j];
                obj[child.tagName.toLowerCase()] = child.textContent || child.innerText;
              }
              data.push(obj);
            }
          }

          resolve(data);
        } catch (error) {
          reject(new Error('Error al parsear XML: ' + error.message));
        }
      };
      reader.onerror = () => reject(new Error('Error al leer archivo'));
      reader.readAsText(file);
    });
  },

  async parsePDF(file) {
    // PDF básico: extraer texto
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          // Intenta usar PDFjs si está disponible, sino extrae como texto plano
          if (typeof pdfjsLib !== 'undefined') {
            const pdf = await pdfjsLib.getDocument(new Uint8Array(e.target.result)).promise;
            let fullText = '';

            for (let i = 1; i <= pdf.numPages; i++) {
              const page = await pdf.getPage(i);
              const text = await page.getTextContent();
              const pageText = text.items.map(item => item.str).join(' ');
              fullText += pageText + '\n';
            }

            // Parsejar como tabla simple
            const lines = fullText.split('\n').filter(l => l.trim());
            const data = lines.map(line => ({
              contenido: line.trim()
            }));

            resolve(data);
          } else {
            // Fallback: mostrar error
            reject(new Error('PDFs requieren librería adicional. Use CSV o Excel en su lugar.'));
          }
        } catch (error) {
          reject(new Error('Error al leer PDF: ' + error.message));
        }
      };
      reader.onerror = () => reject(new Error('Error al leer archivo'));
      reader.readAsArrayBuffer(file);
    });
  },

  detectDataType(data) {
    if (!data || data.length === 0) return 'generic';

    const headers = Object.keys(data[0]).map(h => h.toLowerCase());
    const headerStr = headers.join(',');

    if (headerStr.includes('presupuesto') || headerStr.includes('budget') ||
        headerStr.includes('partida') || headerStr.includes('categoria')) {
      return 'budget';
    } else if (headerStr.includes('gasto') || headerStr.includes('expense') ||
               headerStr.includes('costo') || headerStr.includes('cost')) {
      return 'expense';
    } else if (headerStr.includes('ingreso') || headerStr.includes('income') ||
               headerStr.includes('venta') || headerStr.includes('sales')) {
      return 'income';
    } else if (headerStr.includes('factura') || headerStr.includes('invoice') ||
               headerStr.includes('cliente') || headerStr.includes('client')) {
      return 'invoice';
    }
    return 'generic';
  },

  showPreview(data) {
    if (!data || data.length === 0) {
      alert('El archivo no contiene datos');
      return;
    }

    const previewArea = document.getElementById('previewArea');
    const previewContent = document.getElementById('previewContent');
    const recordCount = document.getElementById('recordCount');
    const dataTypeLabel = document.getElementById('dataTypeLabel');
    const dataTypeSelector = document.getElementById('dataTypeSelector');
    const validationMessages = document.getElementById('validationMessages');
    const newProjectNameInput = document.getElementById('newProjectName');

    // Auto-fill project name from filename
    if (newProjectNameInput && this.currentFile) {
      const fileName = this.currentFile.name.replace(/\.[^.]+$/, '');
      newProjectNameInput.value = fileName;
    }

    // Update labels
    recordCount.textContent = `(${data.length})`;
    dataTypeLabel.textContent = this.getDataTypeLabel(this.dataType);
    dataTypeSelector.value = this.dataType;

    // Build preview table
    const headers = Object.keys(data[0]);
    const previewRows = data.slice(0, 10);

    let tableHTML = `<table class="table">
      <thead>
        <tr>
          ${headers.map(h => `<th>${h}</th>`).join('')}
        </tr>
      </thead>
      <tbody>
        ${previewRows.map(row => `
          <tr>
            ${headers.map(h => `<td>${row[h] ?? ''}</td>`).join('')}
          </tr>
        `).join('')}
      </tbody>
    </table>`;

    previewContent.innerHTML = tableHTML;

    // Validation messages
    const validationHTML = `
      <div class="alert blue">
        <b>✓ Archivo detectado:</b> ${this.currentFile.name}<br>
        <b>Registros:</b> ${data.length}<br>
        <b>Columnas:</b> ${headers.length}
        ${data.length > 10 ? `<br><b>Nota:</b> Mostrando primeros 10 registros de ${data.length}` : ''}
      </div>
    `;
    validationMessages.innerHTML = validationHTML;

    previewArea.style.display = 'block';
    window.scrollTo(0, document.getElementById('previewArea').offsetTop - 100);
  },

  getDataTypeLabel(type) {
    const labels = {
      'budget': '💰 Presupuesto',
      'expense': '📉 Gastos',
      'income': '📈 Ingresos',
      'invoice': '🧾 Facturas',
      'generic': '📄 Genérico'
    };
    return labels[type] || 'Desconocido';
  },

  async confirmImport() {
    if (!this.currentData || this.currentData.length === 0) {
      alert('No hay datos para importar');
      return;
    }

    try {
      const createNewProject = document.getElementById('createNewProject').checked;
      const newProjectName = document.getElementById('newProjectName').value.trim();

      let projectId;

      // Create new project if requested
      if (createNewProject) {
        if (!newProjectName) {
          alert('Por favor ingresa un nombre para el nuevo proyecto');
          return;
        }

        const newProject = {
          id: app.generateUUID(),
          name: newProjectName,
          status: 'active',
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          currency: 'CLP',
          active: true,
          createdAt: Date.now(),
          projectIVAPercentage: 19,
          projectTaxName: 'IVA',
          projectIncludeTax: true
        };

        const created = await db.create('projects', newProject);
        projectId = created.id;
        await app.setActiveProject(projectId);
        console.log('✓ Nuevo proyecto creado:', newProjectName);
      } else {
        const project = await app.getActiveProject();
        projectId = project.id;
      }

      // Create import record
      const importRecord = {
        projectId: projectId,
        filename: this.currentFile.name,
        type: this.dataType,
        recordsImported: this.currentData.length,
        recordsRejected: 0,
        timestamp: Date.now(),
        createdAt: Date.now(),
        preview: this.currentData.slice(0, 5),
        status: 'confirmed'
      };

      await db.create('imports', importRecord);

      // Map data based on type and store in appropriate store
      await this.storeImportedData(this.currentData, this.dataType, projectId);

      console.log('✓ Datos importados exitosamente');
      alert(`✓ Se importaron ${this.currentData.length} registros correctamente`);

      this.cancelImport();
      await this.loadHistory();

      // Navigate to dashboard to show new data
      await router.navigate('/');
    } catch (error) {
      console.error('Error confirming import:', error);
      alert('Error al guardar los datos: ' + error.message);
    }
  },

  async storeImportedData(data, type, projectId) {
    switch(type) {
      case 'budget':
        await this.importBudgetData(data, projectId);
        break;
      case 'expense':
        await this.importExpenseData(data, projectId);
        break;
      case 'income':
        await this.importIncomeData(data, projectId);
        break;
      case 'invoice':
        await this.importInvoiceData(data, projectId);
        break;
      default:
        console.log(`Imported ${data.length} generic records`);
    }
  },

  async importBudgetData(data, projectId) {
    try {
      const budgetItems = [];
      for (const row of data) {
        const keys = Object.keys(row);
        let category = '';
        let name = '';
        let amount = 0;

        for (const key of keys) {
          const keyLower = key.toLowerCase();
          if (keyLower.includes('categoría') || keyLower.includes('categoria') || keyLower.includes('category')) {
            category = row[key];
          }
          if (keyLower.includes('partida') || keyLower.includes('concepto') || keyLower.includes('descripción') || keyLower.includes('descripcion') || keyLower.includes('name')) {
            name = row[key];
          }
          if (keyLower.includes('presupuesto') || keyLower.includes('budget') || keyLower.includes('monto') || keyLower.includes('amount')) {
            amount = parseFloat(row[key]) || 0;
          }
        }

        if (name && amount > 0) {
          budgetItems.push({
            id: app.generateUUID(),
            projectId,
            category: category || 'General',
            name,
            budgeted: amount,
            committed: 0,
            paid: 0,
            createdAt: Date.now()
          });
        }
      }

      // Store budget data
      for (const item of budgetItems) {
        await db.create('budgetData', item);
      }
      console.log(`✓ ${budgetItems.length} items de presupuesto importados`);
    } catch (error) {
      console.error('Error importing budget data:', error);
    }
  },

  async importExpenseData(data, projectId) {
    try {
      const expenses = [];
      for (const row of data) {
        const keys = Object.keys(row);
        let description = '';
        let amount = 0;
        let date = new Date().toISOString().split('T')[0];
        let category = 'Gasto';

        for (const key of keys) {
          const keyLower = key.toLowerCase();
          if (keyLower.includes('descripción') || keyLower.includes('descripcion') || keyLower.includes('concepto')) {
            description = row[key];
          }
          if (keyLower.includes('monto') || keyLower.includes('amount') || keyLower.includes('gasto') || keyLower.includes('costo') || keyLower.includes('cost')) {
            amount = parseFloat(row[key]) || 0;
          }
          if (keyLower.includes('fecha') || keyLower.includes('date')) {
            if (row[key]) date = row[key];
          }
          if (keyLower.includes('categoría') || keyLower.includes('categoria') || keyLower.includes('tipo') || keyLower.includes('type')) {
            category = row[key];
          }
        }

        if (description && amount > 0) {
          expenses.push({
            id: app.generateUUID(),
            projectId,
            date,
            description,
            amount,
            category,
            createdAt: Date.now()
          });
        }
      }

      // Store expense data
      for (const expense of expenses) {
        await db.create('expenseData', expense);
      }
      console.log(`✓ ${expenses.length} gastos importados`);
    } catch (error) {
      console.error('Error importing expense data:', error);
    }
  },

  async importIncomeData(data, projectId) {
    try {
      const incomes = [];
      for (const row of data) {
        const keys = Object.keys(row);
        let description = '';
        let amount = 0;
        let date = new Date().toISOString().split('T')[0];
        let source = 'Ingreso';

        for (const key of keys) {
          const keyLower = key.toLowerCase();
          if (keyLower.includes('descripción') || keyLower.includes('descripcion') || keyLower.includes('concepto')) {
            description = row[key];
          }
          if (keyLower.includes('monto') || keyLower.includes('amount') || keyLower.includes('ingreso') || keyLower.includes('income') || keyLower.includes('venta') || keyLower.includes('sales')) {
            amount = parseFloat(row[key]) || 0;
          }
          if (keyLower.includes('fecha') || keyLower.includes('date')) {
            if (row[key]) date = row[key];
          }
          if (keyLower.includes('fuente') || keyLower.includes('origen') || keyLower.includes('source')) {
            source = row[key];
          }
        }

        if (description && amount > 0) {
          incomes.push({
            id: app.generateUUID(),
            projectId,
            date,
            description,
            amount,
            source,
            createdAt: Date.now()
          });
        }
      }

      // Store income data
      for (const income of incomes) {
        await db.create('salesData', income);
      }
      console.log(`✓ ${incomes.length} ingresos importados`);
    } catch (error) {
      console.error('Error importing income data:', error);
    }
  },

  async importInvoiceData(data, projectId) {
    try {
      const invoices = [];
      const project = await db.read('projects', projectId);

      for (const row of data) {
        const keys = Object.keys(row);
        let clientName = '';
        let clientRut = '';
        let clientEmail = '';
        let amount = 0;
        let date = new Date().toISOString().split('T')[0];
        let invoiceNumber = '';

        for (const key of keys) {
          const keyLower = key.toLowerCase();
          if (keyLower.includes('cliente') || keyLower.includes('nombre') || keyLower.includes('client')) {
            clientName = row[key];
          }
          if (keyLower.includes('rut') || keyLower.includes('id')) {
            clientRut = row[key];
          }
          if (keyLower.includes('email') || keyLower.includes('correo')) {
            clientEmail = row[key];
          }
          if (keyLower.includes('monto') || keyLower.includes('amount') || keyLower.includes('total')) {
            amount = parseFloat(row[key]) || 0;
          }
          if (keyLower.includes('fecha') || keyLower.includes('date')) {
            if (row[key]) date = row[key];
          }
          if (keyLower.includes('número') || keyLower.includes('numero') || keyLower.includes('factura') || keyLower.includes('invoice')) {
            invoiceNumber = row[key];
          }
        }

        if (clientName && amount > 0) {
          const taxRate = (project?.projectIVAPercentage || 19) / 100;
          const subtotal = amount / (1 + taxRate);
          const tax = amount - subtotal;

          invoices.push({
            id: app.generateUUID(),
            projectId,
            number: invoiceNumber || `F-IMP-${Date.now()}`,
            date,
            dueDate: new Date(new Date(date).getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            client: { name: clientName, rut: clientRut, email: clientEmail },
            lines: [{ description: 'Importado', quantity: 1, unitPrice: subtotal, amount: subtotal }],
            subtotal,
            tax,
            total: amount,
            status: 'paid',
            paymentMethod: 'bank',
            createdAt: Date.now()
          });
        }
      }

      // Store invoice data
      for (const invoice of invoices) {
        await db.create('invoices', invoice);
      }
      console.log(`✓ ${invoices.length} facturas importadas`);
    } catch (error) {
      console.error('Error importing invoice data:', error);
    }
  },

  cancelImport() {
    const previewArea = document.getElementById('previewArea');
    const fileInput = document.getElementById('fileInput');

    if (previewArea) previewArea.style.display = 'none';
    if (fileInput) fileInput.value = '';

    this.currentFile = null;
    this.currentData = null;
    this.dataType = null;
  },

  async loadHistory() {
    try {
      const project = await app.getActiveProject();
      const imports = await db.getByIndex('imports', 'projectId', project.id);

      const historyList = document.getElementById('historyList');
      if (historyList) {
        if (!imports || imports.length === 0) {
          historyList.innerHTML = '<p style="color: var(--muted);">Sin importaciones aún</p>';
          return;
        }

        const html = imports.map(imp => {
          const date = new Date(imp.createdAt);
          const typeLabel = this.getDataTypeLabel(imp.type);
          return `
            <div class="import-item">
              <div>
                <strong>${imp.filename}</strong><br>
                <small>${typeLabel} • ${imp.recordsImported} registros importados</small>
              </div>
              <span class="date">${date.toLocaleDateString('es-ES')}</span>
            </div>
          `;
        }).join('');
        historyList.innerHTML = html;
      }
    } catch (error) {
      console.error('Error loading history:', error);
    }
  }
};
