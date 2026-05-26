// Projects Module - Project Management
export const projectsModule = {
  async render() {
    const projects = await db.getAll('projects');
    const activeProjectId = app.activeProjectId;

    const projectsHTML = projects.map(p => `
      <div class="project-card ${p.id === activeProjectId ? 'active' : ''}">
        <h3>${p.name}</h3>
        <p class="project-dates">${p.startDate} → ${p.endDate}</p>
        <p class="project-status"><span class="badge ${p.status}">${p.status}</span></p>
        <div class="project-actions">
          <button class="btn-select" data-project-id="${p.id}">Seleccionar</button>
          <button class="btn-edit" data-project-id="${p.id}">Editar</button>
          <button class="btn-export" data-project-id="${p.id}" title="Descargar como JSON">📥</button>
          <button class="btn-delete" data-project-id="${p.id}">Eliminar</button>
        </div>
      </div>
    `).join('');

    return `
      <div class="projects-page">
        <div class="page-header">
          <h1>Gestión de Proyectos</h1>
          <div style="display: flex; gap: 12px;">
            <button id="btn-new-project" class="btn btn-primary">+ Nuevo Proyecto</button>
            <button id="btn-import-project" class="btn">📤 Importar JSON</button>
          </div>
        </div>
        <input type="file" id="fileImportInput" accept=".json" style="display:none;">
        <div class="projects-grid">
          ${projectsHTML}
        </div>

        <!-- Modal Nuevo/Editar Proyecto -->
        <div id="projectModal" class="modal" style="display:none;">
          <div class="modal-content">
            <div class="modal-header">
              <h2 id="modalTitle">Nuevo Proyecto</h2>
              <button class="btn-close" id="btnCloseModal">×</button>
            </div>
            <form id="projectForm" class="form">
              <div class="form-group">
                <label for="projectName">Nombre del proyecto *</label>
                <input type="text" id="projectName" placeholder="Ej: ARAYA Punta Cana" required>
              </div>
              <div class="layout-2col">
                <div class="form-group">
                  <label for="projectStartDate">Fecha inicio *</label>
                  <input type="date" id="projectStartDate" required>
                </div>
                <div class="form-group">
                  <label for="projectEndDate">Fecha fin *</label>
                  <input type="date" id="projectEndDate" required>
                </div>
              </div>
              <div class="layout-2col">
                <div class="form-group">
                  <label for="projectCurrency">Moneda</label>
                  <select id="projectCurrency">
                    <option value="CLP">CLP - Pesos Chilenos</option>
                    <option value="USD">USD - Dólares</option>
                    <option value="DOP">DOP - Pesos Dominicanos</option>
                    <option value="MXN">MXN - Pesos Mexicanos</option>
                    <option value="EUR">EUR - Euros</option>
                    <option value="ARS">ARS - Pesos Argentinos</option>
                    <option value="BRL">BRL - Reales Brasileños</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="projectStatus">Estado</label>
                  <select id="projectStatus">
                    <option value="active">Activo</option>
                    <option value="archived">Archivado</option>
                  </select>
                </div>
              </div>

              <div style="background: var(--card); padding: 16px; border-radius: var(--radius); margin-bottom: 16px;">
                <h4 style="margin-top: 0;">Configuración de Impuestos</h4>
                <div class="layout-2col">
                  <div class="form-group">
                    <label for="projectIVAPercentage">Porcentaje de Impuesto (%)</label>
                    <input type="number" id="projectIVAPercentage" placeholder="19" value="19" step="0.1">
                  </div>
                  <div class="form-group">
                    <label for="projectTaxName">Nombre del Impuesto</label>
                    <input type="text" id="projectTaxName" placeholder="IVA, VAT, GST, etc." value="IVA">
                  </div>
                </div>
                <div class="form-group inline">
                  <input type="checkbox" id="projectIncludeTax" checked>
                  <label for="projectIncludeTax">Incluir impuesto en facturas</label>
                </div>
              </div>
              <div class="form-group">
                <label for="projectDescription">Descripción</label>
                <textarea id="projectDescription" placeholder="Descripción del proyecto (opcional)" rows="3"></textarea>
              </div>

              <div id="fileImportSection" style="display:none; background: var(--card); padding: 16px; border-radius: var(--radius); margin-bottom: 16px;">
                <h4 style="margin-top: 0;">Importar Datos al Nuevo Proyecto</h4>
                <p style="font-size: 0.9rem; color: var(--text-secondary); margin: 0 0 12px 0;">Después de crear el proyecto, puedes importar datos desde un archivo (Excel, CSV, JSON, XML).</p>
                <input type="file" id="projectFileImport" accept=".xlsx,.xls,.csv,.json,.xml,.txt" style="display:none;">
                <button type="button" class="btn btn-secondary" id="btnSelectFile" style="width: 100%;">📁 Seleccionar Archivo para Importar</button>
                <div id="fileSelected" style="margin-top: 8px; font-size: 0.85rem; color: var(--text-secondary);"></div>
              </div>

              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" id="btnCancelModal">Cancelar</button>
                <button type="submit" class="btn btn-primary">Guardar Proyecto</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;
  },

  async init() {
    console.log('Projects module initialized');

    // Modal elements
    const modal = document.getElementById('projectModal');
    const btnNew = document.getElementById('btn-new-project');
    const btnImport = document.getElementById('btn-import-project');
    const fileInput = document.getElementById('fileImportInput');
    const btnCloseModal = document.getElementById('btnCloseModal');
    const btnCancelModal = document.getElementById('btnCancelModal');
    const projectForm = document.getElementById('projectForm');
    const projectFileImport = document.getElementById('projectFileImport');
    const btnSelectFile = document.getElementById('btnSelectFile');
    const fileSelected = document.getElementById('fileSelected');

    // Open modal for new project
    if (btnNew) {
      btnNew.addEventListener('click', () => this.openProjectModal());
    }

    // Import project from JSON
    if (btnImport) {
      btnImport.addEventListener('click', () => fileInput.click());
    }
    if (fileInput) {
      fileInput.addEventListener('change', (e) => this.importProjectFromFile(e));
    }

    // Close modal handlers
    if (btnCloseModal) {
      btnCloseModal.addEventListener('click', () => this.closeProjectModal());
    }
    if (btnCancelModal) {
      btnCancelModal.addEventListener('click', () => this.closeProjectModal());
    }

    // Close on outside click
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) this.closeProjectModal();
      });
    }

    // Form submission
    if (projectForm) {
      projectForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.saveProject();
      });
    }

    // File import in project modal
    if (btnSelectFile) {
      btnSelectFile.addEventListener('click', () => projectFileImport?.click());
    }
    if (projectFileImport) {
      projectFileImport.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          fileSelected.textContent = `✓ Archivo seleccionado: ${file.name}`;
          projectForm.dataset.importFile = file;
        }
      });
    }

    // Set default dates for new project
    const today = new Date().toISOString().split('T')[0];
    const nextYear = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    document.getElementById('projectStartDate').value = today;
    document.getElementById('projectEndDate').value = nextYear;

    // Events: Seleccionar proyecto
    document.querySelectorAll('.btn-select').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const projectId = e.target.getAttribute('data-project-id');
        await app.setActiveProject(projectId);
      });
    });

    // Events: Edit project
    document.querySelectorAll('.btn-edit').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const projectId = e.target.getAttribute('data-project-id');
        await this.editProject(projectId);
      });
    });

    // Events: Export project
    document.querySelectorAll('.btn-export').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const projectId = e.target.getAttribute('data-project-id');
        await this.exportProject(projectId);
      });
    });

    // Events: Delete/Archive project
    document.querySelectorAll('.btn-delete').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const projectId = e.target.getAttribute('data-project-id');
        await this.archiveProject(projectId);
      });
    });
  },

  openProjectModal(editId = null) {
    const modal = document.getElementById('projectModal');
    const modalTitle = document.getElementById('modalTitle');
    const form = document.getElementById('projectForm');
    const fileImportSection = document.getElementById('fileImportSection');
    const fileSelected = document.getElementById('fileSelected');
    const projectFileImport = document.getElementById('projectFileImport');

    if (editId) {
      modalTitle.textContent = 'Editar Proyecto';
      form.dataset.editId = editId;
      if (fileImportSection) fileImportSection.style.display = 'none';
    } else {
      modalTitle.textContent = 'Nuevo Proyecto';
      form.reset();
      delete form.dataset.editId;
      if (fileImportSection) fileImportSection.style.display = 'block';
      if (fileSelected) fileSelected.textContent = '';
      if (projectFileImport) projectFileImport.value = '';
    }

    if (modal) modal.style.display = 'flex';
  },

  closeProjectModal() {
    const modal = document.getElementById('projectModal');
    if (modal) modal.style.display = 'none';
  },

  async saveProject() {
    const form = document.getElementById('projectForm');
    const editId = form.dataset.editId;

    const projectData = {
      name: document.getElementById('projectName').value.trim(),
      startDate: document.getElementById('projectStartDate').value,
      endDate: document.getElementById('projectEndDate').value,
      currency: document.getElementById('projectCurrency').value,
      status: document.getElementById('projectStatus').value,
      description: document.getElementById('projectDescription').value.trim(),
      projectIVAPercentage: parseFloat(document.getElementById('projectIVAPercentage').value) || 19,
      projectTaxName: document.getElementById('projectTaxName').value || 'IVA',
      projectIncludeTax: document.getElementById('projectIncludeTax').checked
    };

    // Validation
    if (!projectData.name) {
      alert('El nombre del proyecto es requerido');
      return;
    }

    if (new Date(projectData.startDate) >= new Date(projectData.endDate)) {
      alert('La fecha de inicio debe ser anterior a la fecha de fin');
      return;
    }

    try {
      let projectId;
      if (editId) {
        await db.update('projects', editId, projectData);
        projectId = editId;
        console.log('✓ Proyecto actualizado');
      } else {
        const project = await db.create('projects', { ...projectData, active: true, createdAt: Date.now() });
        projectId = project.id;
        console.log('✓ Proyecto creado');
      }

      // Check if file import is pending
      const importFile = form.dataset.importFile;
      if (importFile && !editId) {
        // Clear the form data
        this.closeProjectModal();

        // Set the new project as active
        await app.setActiveProject(projectId);

        // Show import dialog
        const importText = await importFile.text();
        const ext = importFile.name.toLowerCase().split('.').pop();

        alert(`✓ Proyecto creado. Iniciando importación de datos desde ${importFile.name}...`);

        // Navigate to import module with file data
        // For now, just show a message that file is ready to import
        console.log('File ready for import:', { name: importFile.name, ext, size: importFile.size });

        delete form.dataset.importFile;
        await router.navigate('/import');
      } else {
        this.closeProjectModal();
        await router.navigate('/projects');
      }
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Error al guardar el proyecto: ' + error.message);
    }
  },

  async editProject(projectId) {
    try {
      const project = await db.read('projects', projectId);
      if (!project) {
        alert('Proyecto no encontrado');
        return;
      }

      document.getElementById('projectName').value = project.name;
      document.getElementById('projectStartDate').value = project.startDate;
      document.getElementById('projectEndDate').value = project.endDate;
      document.getElementById('projectCurrency').value = project.currency;
      document.getElementById('projectStatus').value = project.status;
      document.getElementById('projectDescription').value = project.description || '';
      document.getElementById('projectIVAPercentage').value = project.projectIVAPercentage || 19;
      document.getElementById('projectTaxName').value = project.projectTaxName || 'IVA';
      document.getElementById('projectIncludeTax').checked = project.projectIncludeTax !== false;

      this.openProjectModal(projectId);
    } catch (error) {
      console.error('Error loading project:', error);
      alert('Error al cargar el proyecto');
    }
  },

  async archiveProject(projectId) {
    const project = await db.read('projects', projectId);
    if (!project) return;

    if (projectId === app.activeProjectId) {
      alert('No puedes eliminar el proyecto activo. Selecciona otro primero.');
      return;
    }

    try {
      // Count related records
      const accounts = await db.getByIndex('chartOfAccounts', 'projectId', projectId);
      const entries = await db.getByIndex('journalEntries', 'projectId', projectId);
      const invoices = await db.getByIndex('invoices', 'projectId', projectId);
      const budgets = await db.getByIndex('budgetData', 'projectId', projectId);

      const totalRecords = (accounts?.length || 0) + (entries?.length || 0) + (invoices?.length || 0) + (budgets?.length || 0);

      const message = `"${project.name}"

Registros relacionados:
- Cuentas: ${accounts?.length || 0}
- Asientos contables: ${entries?.length || 0}
- Facturas: ${invoices?.length || 0}
- Presupuestos: ${budgets?.length || 0}
Total: ${totalRecords} registros

¿Qué deseas hacer?`;

      // Use confirm with custom logic for archive or delete choice
      const choice = confirm(`${message}\n\nOK = Archivar (datos se mantienen pero ocultos)\nCancel = Eliminar permanentemente`);

      if (choice === true) {
        // Archive
        await db.update('projects', projectId, { status: 'archived' });
        console.log('✓ Proyecto archivado');
      } else {
        // Delete permanently
        const confirmDelete = confirm(`⚠️ ATENCIÓN: Esto eliminará permanentemente "${project.name}" y todos sus datos.\n\n¿Estás COMPLETAMENTE seguro?`);
        if (confirmDelete) {
          await this.deleteProject(projectId);
        }
      }

      await router.navigate('/projects');
    } catch (error) {
      console.error('Error managing project:', error);
      alert('Error al gestionar el proyecto');
    }
  },

  async deleteProject(projectId) {
    try {
      // Delete all related records
      const accounts = await db.getByIndex('chartOfAccounts', 'projectId', projectId);
      const entries = await db.getByIndex('journalEntries', 'projectId', projectId);
      const invoices = await db.getByIndex('invoices', 'projectId', projectId);
      const budgets = await db.getByIndex('budgetData', 'projectId', projectId);

      // Delete related records
      if (accounts) {
        for (const acc of accounts) {
          await db.delete('chartOfAccounts', acc.id);
        }
      }
      if (entries) {
        for (const entry of entries) {
          await db.delete('journalEntries', entry.id);
        }
      }
      if (invoices) {
        for (const inv of invoices) {
          await db.delete('invoices', inv.id);
        }
      }
      if (budgets) {
        for (const budget of budgets) {
          await db.delete('budgetData', budget.id);
        }
      }

      // Delete project
      await db.delete('projects', projectId);
      console.log('✓ Proyecto eliminado permanentemente');
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  },

  async exportProject(projectId) {
    try {
      const project = await db.read('projects', projectId);
      if (!project) {
        alert('Proyecto no encontrado');
        return;
      }

      const exportData = {
        project,
        exportDate: new Date().toISOString(),
        version: '1.0'
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${project.name.replace(/\s+/g, '_')}_${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      console.log('✓ Proyecto exportado');
    } catch (error) {
      console.error('Error exporting project:', error);
      alert('Error al exportar el proyecto');
    }
  },

  async importProjectFromFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      if (!data.project || !data.project.name) {
        alert('Archivo JSON inválido. Debe contener un objeto "project" con nombre.');
        return;
      }

      if (confirm(`¿Importar proyecto "${data.project.name}"?`)) {
        const projectData = { ...data.project };
        delete projectData.id; // Generar nuevo ID
        delete projectData.createdAt; // Nueva fecha de creación

        const created = await db.create('projects', {
          ...projectData,
          createdAt: Date.now(),
          description: projectData.description || `Importado desde ${file.name}`
        });

        alert(`✓ Proyecto importado: ${created.name}`);
        await router.navigate('/projects');
      }
    } catch (error) {
      console.error('Error importing project:', error);
      alert('Error al importar el proyecto: ' + error.message);
    } finally {
      // Clear file input
      event.target.value = '';
    }
  }
};
