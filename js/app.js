// Global App Configuration and Initialization
class ArayaApp {
  constructor() {
    this.activeProjectId = null;
    this.config = {
      theme: localStorage.getItem('araya-theme') || 'dark',
      language: localStorage.getItem('araya-language') || 'es',
      currency: 'DOP'
    };
  }

  // Inicializar aplicación
  async init() {
    try {
      const updateStatus = (msg) => {
        console.log(msg);
        const el = document.getElementById('debug-status');
        if (el) {
          // Append message instead of replacing
          el.textContent += '\n' + msg;
          el.style.whiteSpace = 'pre-wrap';
          el.style.maxHeight = '600px';
        }
      };

      updateStatus('Inicializando base de datos...');
      // Inicializar BD - ensure it's fully ready
      const dbReady = await db.init();
      if (!dbReady) throw new Error('Database initialization failed');

      // Wait an extra tick to ensure DB is really ready
      await new Promise(r => setTimeout(r, 50));
      console.log('✓ Database initialized');
      updateStatus('✓ Base de datos lista');

      // Cargar proyecto activo
      updateStatus('Cargando proyecto activo...');
      await this.loadActiveProject();
      updateStatus('✓ Proyecto cargado');

      // Aplicar configuración
      updateStatus('Aplicando configuración...');
      this.applyTheme();
      this.applyLanguage();

      // Registrar módulos en router
      updateStatus('Registrando módulos...');
      this.registerRoutes();
      updateStatus('✓ Módulos registrados');

      // Inicializar router
      updateStatus('Inicializando navegador...');
      await router.init('#app-content', '.navbar-links');
      updateStatus('✓ Navegador listo');

      // Setup UI after everything is ready
      updateStatus('Configurando interfaz...');
      this.setupUI();

      // Ocultar pantalla de carga
      const loadingContainer = document.querySelector('.loading-container');
      if (loadingContainer) {
        loadingContainer.style.display = 'none';
      }

      console.log('✓ App initialized');
      updateStatus('✓ Aplicación lista');
      return true;
    } catch (error) {
      console.error('App initialization error:', error);
      const el = document.getElementById('debug-status');
      if (el) el.textContent = `❌ Error: ${error.message}`;
      // Mostrar error en un elemento sin limpiar todo el body
      const errorDiv = document.createElement('div');
      errorDiv.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: red; color: white; padding: 40px; border-radius: 8px; max-width: 600px; z-index: 10000; font-family: monospace;';
      errorDiv.innerHTML = `<h1>❌ Error de inicialización</h1><p>${error.message}</p><pre style="overflow: auto; max-height: 300px; background: #000; padding: 10px;">${error.stack}</pre>`;
      document.body.appendChild(errorDiv);
      return false;
    }
  }

  // Setup UI elements after app is initialized
  setupUI() {
    // Theme toggle
    const btnTheme = document.getElementById('btnTheme');
    const themeIcon = document.getElementById('themeIcon');

    if (btnTheme) {
      btnTheme.addEventListener('click', () => {
        this.toggleTheme();
        themeIcon.textContent = this.config.theme === 'dark' ? '☀️' : '🌙';
      });
    }

    // Set initial theme icon
    if (themeIcon) {
      themeIcon.textContent = this.config.theme === 'dark' ? '☀️' : '🌙';
    }

    // Language selector
    const langSelector = document.getElementById('langSelector');
    if (langSelector) {
      langSelector.value = this.config.language;
      langSelector.addEventListener('change', (e) => {
        this.setLanguage(e.target.value);
      });
    }

    // Project name
    const projectName = document.getElementById('projectName');
    if (projectName && this.activeProjectId) {
      db.read('projects', this.activeProjectId).then(project => {
        if (project) projectName.textContent = project.name;
      });
    }

    // Mobile menu
    const btnMenu = document.getElementById('btnMenu');
    const navBar = document.querySelector('.navbar');
    if (btnMenu && navBar) {
      btnMenu.addEventListener('click', () => {
        navBar.classList.toggle('mobile-open');
      });
    }
  }

  // Cargar proyecto activo
  async loadActiveProject() {
    const projectId = localStorage.getItem('araya-active-project');
    if (projectId) {
      try {
        const project = await db.read('projects', projectId);
        if (project) {
          this.activeProjectId = project.id;
          this.config.currency = project.currency || 'CLP';
          return project;
        }
      } catch (error) {
        console.warn('Active project not found, creating default', error);
      }
    }

    // Crear/usar proyecto por defecto
    await this.createDefaultProject();
  }

  // Crear proyecto por defecto
  async createDefaultProject() {
    const defaultProject = {
      id: this.generateUUID(),
      name: 'Araya Punta Cana',
      status: 'active',
      startDate: '2025-01-01',
      endDate: '2026-12-31',
      currency: 'DOP',
      active: true,
      createdAt: Date.now(),
      config: {
        theme: this.config.theme,
        language: this.config.language,
        budgetModel: 'construction'
      }
    };

    try {
      const created = await db.create('projects', defaultProject);
      this.activeProjectId = created.id;
      localStorage.setItem('araya-active-project', created.id);
      return created;
    } catch (error) {
      console.error('Error creating default project:', error);
      throw error;
    }
  }

  // Registrar rutas
  registerRoutes() {
    router.register('/', () => {
      console.log('[App] Loading dashboard module');
      return import('./modules/dashboard.js').then(m => {
        console.log('[App] Dashboard module imported:', m);
        return m.dashboardModule;
      });
    });
    router.register('/projects', () => import('./modules/projects.js').then(m => m.projectsModule));
    router.register('/import', () => import('./modules/import.js').then(m => m.importModule));
    router.register('/accounting', () => import('./modules/accounting.js').then(m => m.accountingModule));
    router.register('/invoices', () => import('./modules/invoices.js').then(m => m.invoicesModule));
    router.register('/reports', () => import('./modules/reports.js').then(m => m.reportsModule));
  }

  // Tema claro/oscuro
  applyTheme() {
    const theme = this.config.theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('araya-theme', theme);
  }

  toggleTheme() {
    this.config.theme = this.config.theme === 'dark' ? 'light' : 'dark';
    this.applyTheme();
  }

  // Idioma
  applyLanguage() {
    const lang = this.config.language;
    document.documentElement.setAttribute('lang', lang);
    localStorage.setItem('araya-language', lang);
    // TODO: traducir elementos del DOM
  }

  setLanguage(lang) {
    this.config.language = lang;
    this.applyLanguage();
  }

  // Cambiar proyecto activo
  async setActiveProject(projectId) {
    try {
      const project = await db.read('projects', projectId);
      if (project) {
        this.activeProjectId = project.id;
        this.config.currency = project.currency || 'CLP';
        localStorage.setItem('araya-active-project', project.id);

        // Recargar página actual con nuevo proyecto
        await router.navigate(router.getCurrentPage());
        return project;
      }
    } catch (error) {
      console.error('Error setting active project:', error);
    }
  }

  // Obtener proyecto activo
  async getActiveProject() {
    if (!this.activeProjectId) {
      await this.loadActiveProject();
    }
    return await db.read('projects', this.activeProjectId);
  }

  // UUID generator
  generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  // Formato de dinero
  formatCurrency(value, currency = null) {
    const curr = currency || this.config.currency;
    const num = Math.round(value);
    const symbol = curr === 'DOP' ? 'RD$' : (curr === 'CLP' ? '$' : curr);

    // Si es >= 1 millón, mostrar con "M"
    if (num >= 1000000) {
      const millions = num / 1000000;
      const formatted = millions % 1 === 0 ? millions.toString() : millions.toFixed(2);
      return symbol + formatted + 'M';
    }

    // Para números < 1 millón, formatear con comas
    const parts = num.toString().split('');
    let formatted = '';
    let count = 0;
    for (let i = parts.length - 1; i >= 0; i--) {
      if (count > 0 && count % 3 === 0) {
        formatted = ',' + formatted;
      }
      formatted = parts[i] + formatted;
      count++;
    }

    return symbol + formatted;
  }

  // Formato de fecha
  formatDate(date, format = 'es-CL') {
    return new Intl.DateTimeFormat(format).format(new Date(date));
  }
}

// Global app instance
const app = new ArayaApp();

// Auto-init on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => app.init());
} else {
  app.init();
}
