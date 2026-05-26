// Single Page App Router
class Router {
  constructor() {
    this.currentPage = null;
    this.pages = {};
    this.contentContainer = null;
    this.navBar = null;
    this.debugMode = false;
  }

  debug(msg) {
    if (this.debugMode) {
      console.log(msg);
      const debugEl = document.getElementById('router-debug');
      if (debugEl) {
        debugEl.innerHTML += '<div>' + msg + '</div>';
      }
    }
  }

  // Registrar una página/módulo
  register(path, moduleLoader) {
    this.pages[path] = moduleLoader;
  }

  // Inicializar router
  async init(contentSelector, navSelector) {
    this.debug(`[Router.init] Starting init with selectors: "${contentSelector}", "${navSelector}"`);

    this.contentContainer = document.querySelector(contentSelector);
    this.navBar = document.querySelector(navSelector);

    this.debug(`[Router.init] contentContainer found: ${!!this.contentContainer}`);
    this.debug(`[Router.init] navBar found: ${!!this.navBar}`);

    if (!this.contentContainer || !this.navBar) {
      this.debug(`[Router.init] ERROR: Missing container or navbar, returning early`);
      console.error('Router: content or nav container not found');
      return;
    }

    this.debug(`[Router.init] Both containers found, continuing...`);

    // Escuchar cambios en historial
    window.addEventListener('popstate', (e) => {
      this.navigate(e.state?.path || '/');
    });

    // Escuchar clicks en navbar
    this.navBar.addEventListener('click', (e) => {
      const link = e.target.closest('[data-route]');
      if (link) {
        e.preventDefault();
        const path = link.getAttribute('data-route');
        this.navigate(path);
      }
    });

    // Cargar página inicial
    this.debug(`[Router.init] About to call navigate('/')`);
    try {
      await this.navigate('/');
    } catch (e) {
      this.debug(`[Router.init] ERROR in navigate('/'): ${e.message}`);
      console.error('Router init navigate error:', e);
    }
  }

  // Navegar a página
  async navigate(path) {
    // Validar ruta
    if (!this.pages[path]) {
      console.warn(`Router: route ${path} not found, fallback to /`);
      path = '/';
    }

    // Evitar navegación redundante
    if (path === this.currentPage) return;

    try {
      this.debug(`[Router] Navigating to ${path}`);

      // Actualizar URL
      window.history.pushState({ path }, '', window.location.pathname + (path === '/' ? '' : `#${path}`));

      // Actualizar estado de navbar
      this.updateNavBar(path);

      // Limpiar contenedor
      this.contentContainer.innerHTML = '';

      // Cargar módulo
      const moduleLoader = this.pages[path];
      this.debug(`[Router] Module loader type: ${typeof moduleLoader}`);

      const module = typeof moduleLoader === 'function' ? await moduleLoader() : moduleLoader;
      this.debug(`[Router] Module loaded: ${module ? 'OK' : 'NULL'}`);

      // Renderizar
      if (module && module.render) {
        this.debug(`[Router] Calling render()`);
        const html = await module.render();
        this.debug(`[Router] Render returned ${html ? html.length : 0} characters`);
        if (html) {
          this.contentContainer.innerHTML = html;
          this.debug(`[Router] HTML injected into container`);
        } else {
          this.debug(`[Router] ERROR: render() returned null/empty`);
        }
      } else {
        this.debug(`[Router] ERROR: Module missing render method`);
      }

      // Ejecutar init si existe
      if (module && module.init) {
        this.debug(`[Router] Calling init()`);
        await module.init();
        this.debug(`[Router] Init completed`);
      }

      this.currentPage = path;

      // Scroll al top
      window.scrollTo(0, 0);
    } catch (error) {
      console.error('Router error:', error);
      const errorMsg = `<div style="position: fixed; top: 100px; right: 20px; background: #ff0000; color: white; padding: 20px; border-radius: 8px; max-width: 400px; z-index: 10000;"><h3>Router Error</h3><p>${error.message}</p><pre style="overflow: auto; max-height: 200px; background: #000; padding: 10px; color: #0f0; font-size: 10px;">${error.stack}</pre></div>`;
      document.body.insertAdjacentHTML('beforeend', errorMsg);
      this.contentContainer.innerHTML = `<div class="error-page"><h1>Error</h1><p>${error.message}</p></div>`;
    }
  }

  // Actualizar navbar activos
  updateNavBar(path) {
    this.navBar.querySelectorAll('[data-route]').forEach(link => {
      const linkPath = link.getAttribute('data-route');
      link.classList.toggle('active', linkPath === path);
    });
  }

  // Get current page
  getCurrentPage() {
    return this.currentPage;
  }
}

// Global router instance
const router = new Router();
