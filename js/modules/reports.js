// Reports Module - Financial Reports and Analytics
export const reportsModule = {
  async render() {
    return `
      <div class="reports-page">
        <div class="page-header">
          <h1>Reportes</h1>
          <div class="header-actions">
            <select id="reportType">
              <option value="balance">Balance General</option>
              <option value="income">Estado de Resultados</option>
              <option value="cash">Flujo de Caja</option>
              <option value="budget">Ejecución Presupuestal</option>
            </select>
            <button id="btnExportPDF" class="btn">Descargar PDF</button>
            <button id="btnExportExcel" class="btn">Descargar Excel</button>
            <button id="btn-import-reports" class="btn">📤 Importar datos</button>
          </div>
        </div>
        <input type="file" id="fileImportReports" accept=".xlsx,.xls,.csv,.json,.xml,.txt" style="display:none;">

        <div class="date-range">
          <label>Desde: <input type="date" id="dateFrom"></label>
          <label>Hasta: <input type="date" id="dateTo"></label>
          <button id="btnRefresh" class="btn">Actualizar</button>
        </div>

        <div id="reportContent">
          <p>Selecciona un reporte y haz clic en Actualizar</p>
        </div>
      </div>
    `;
  },

  async init() {
    console.log('Reports module initialized');

    const btnRefresh = document.getElementById('btnRefresh');
    const btnExportPDF = document.getElementById('btnExportPDF');
    const btnExportExcel = document.getElementById('btnExportExcel');
    const fileImportReports = document.getElementById('fileImportReports');
    const btnImportReports = document.getElementById('btn-import-reports');

    if (btnRefresh) {
      btnRefresh.addEventListener('click', () => this.generateReport());
    }

    if (btnExportPDF) {
      btnExportPDF.addEventListener('click', () => this.exportPDF());
    }

    if (btnExportExcel) {
      btnExportExcel.addEventListener('click', () => this.exportExcel());
    }

    if (btnImportReports) {
      btnImportReports.addEventListener('click', () => fileImportReports?.click());
    }

    if (fileImportReports) {
      fileImportReports.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          this.importReportsFromFile(file);
        }
      });
    }

    // Set default dates
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    document.getElementById('dateFrom').value = firstDay.toISOString().split('T')[0];
    document.getElementById('dateTo').value = today.toISOString().split('T')[0];
  },

  async generateReport() {
    // TODO: Implementar generación de reportes
    alert('Generación de reportes en desarrollo');
  },

  async exportPDF() {
    // TODO: Implementar exportación a PDF
    alert('Exportación a PDF en desarrollo');
  },

  async exportExcel() {
    // TODO: Implementar exportación a Excel
    alert('Exportación a Excel en desarrollo');
  },

  async importReportsFromFile(file) {
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
        rows = Array.isArray(data) ? data : (data.datos || data.data || []);
      } else if (ext === 'xml') {
        const text = await file.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'application/xml');
        const items = doc.querySelectorAll('fila, row, dato, data, item');
        rows = Array.from(items).map(el => ({
          concepto: el.querySelector('concepto, concept, name')?.textContent || '',
          monto: parseFloat(el.querySelector('monto, amount, value')?.textContent || 0),
          tipo: el.querySelector('tipo, type')?.textContent || 'ingreso',
          fecha: el.querySelector('fecha, date')?.textContent || new Date().toISOString().split('T')[0]
        }));
      }

      if (rows.length === 0) {
        alert('No se encontraron datos en el archivo');
        return;
      }

      // Create report data from imported rows
      const reportData = {
        projectId: project.id,
        type: 'custom',
        title: `Reporte importado - ${file.name}`,
        data: rows,
        dateImported: new Date().toISOString(),
        fileName: file.name
      };

      // Save to database
      await db.create('reports', reportData);

      // Generate preview in the reports module
      this.displayImportedReport(rows);

      alert(`✓ Datos importados exitosamente: ${rows.length} registros`);
    } catch (error) {
      console.error('Error importing reports file:', error);
      alert('Error al importar: ' + error.message);
    }
  },

  displayImportedReport(rows) {
    // Calculate totals and summaries from imported data
    const reportContent = document.getElementById('reportContent');

    const ingresos = rows.filter(r =>
      (r.tipo || r.type || '').toLowerCase().includes('ingreso') ||
      (r.tipo || r.type || '').toLowerCase().includes('income')
    ).reduce((sum, r) => sum + (parseFloat(r.monto || r.amount || 0) || 0), 0);

    const gastos = rows.filter(r =>
      (r.tipo || r.type || '').toLowerCase().includes('gasto') ||
      (r.tipo || r.type || '').toLowerCase().includes('expense')
    ).reduce((sum, r) => sum + (parseFloat(r.monto || r.amount || 0) || 0), 0);

    const rowsHTML = rows.map(r => `
      <tr>
        <td>${r.concepto || r.concept || r.nombre || r.name || 'Sin nombre'}</td>
        <td>${r.tipo || r.type || 'Otro'}</td>
        <td>${r.fecha || r.date || new Date().toISOString().split('T')[0]}</td>
        <td class="num">${app.formatCurrency(parseFloat(r.monto || r.amount || 0) || 0)}</td>
      </tr>
    `).join('');

    const html = `
      <div style="margin-bottom: 20px;">
        <h3>Datos Importados</h3>
        <p style="color: var(--text-secondary);">Archivo: ${rows.length} registros</p>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px;">
        <div style="background: rgba(76, 175, 80, 0.1); padding: 16px; border-radius: var(--radius);">
          <div style="font-size: 12px; color: var(--text-secondary); text-transform: uppercase; margin-bottom: 8px;">Ingresos Totales</div>
          <div style="font-size: 24px; font-weight: bold; color: #4caf50;">${app.formatCurrency(ingresos)}</div>
        </div>
        <div style="background: rgba(244, 67, 54, 0.1); padding: 16px; border-radius: var(--radius);">
          <div style="font-size: 12px; color: var(--text-secondary); text-transform: uppercase; margin-bottom: 8px;">Gastos Totales</div>
          <div style="font-size: 24px; font-weight: bold; color: #f44336;">${app.formatCurrency(gastos)}</div>
        </div>
      </div>

      <table class="table">
        <thead>
          <tr>
            <th>Concepto</th>
            <th>Tipo</th>
            <th>Fecha</th>
            <th class="num">Monto</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHTML}
        </tbody>
      </table>
    `;

    reportContent.innerHTML = html;
  }
};
