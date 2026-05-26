// Dashboard Module - Financial Dashboard with Chart.js
import { ARAYA_VALUE_LABELS } from '../utils/charts.js';
import { dashboardData } from '../utils/dashboard-data.js';

export const dashboardModule = {
  charts: [],

  async render() {
    try {
      const project = await app.getActiveProject();
      console.log('Dashboard render: project loaded', project?.name);
      return `
      <div class="dashboard-page">
        <div class="page-header">
          <h1>📊 Dashboard Financiero</h1>
          <p class="subtitle">Proyecto: <strong>${project.name}</strong> | Moneda: <strong>${project.currency || 'CLP'}</strong></p>
          <div class="header-actions">
            <button id="btnExportPDF" class="btn">📄 Descargar PDF</button>
            <button id="btnRefresh" class="btn">🔄 Actualizar</button>
          </div>
        </div>

        <!-- Tabs Navigation -->
        <div class="tabs">
          <button class="tab active" data-tab="resumen">📊 Resumen</button>
          <button class="tab" data-tab="presupuesto">💰 Presupuesto</button>
          <button class="tab" data-tab="balance">🏦 Balance</button>
          <button class="tab" data-tab="flujo">📈 Flujo caja</button>
          <button class="tab" data-tab="costos">📉 Costos</button>
          <button class="tab" data-tab="ventas">🏠 Ventas</button>
          <button class="tab" data-tab="cobranza">💳 Cobranza</button>
          <button class="tab" data-tab="obra">🏗️ Obra</button>
        </div>

        <!-- KPI Row -->
        <div class="grid grid-4" id="kpisResumen"></div>

        <!-- Tab Panels -->
        <div class="tab-content">
          <div class="tab-panel active" data-panel="resumen">
            <div class="layout-2col">
              <div class="card">
                <h2>Ejecución presupuestal</h2>
                <p class="hint">Pagado, comprometido adicional y saldo pendiente sobre presupuesto ejecutivo.</p>
                <div class="chart"><canvas id="budgetDonut"></canvas></div>
              </div>
              <div class="card">
                <h2>Estado de unidades</h2>
                <div class="chart sm"><canvas id="unitsDonut"></canvas></div>
              </div>
            </div>
            <div class="card">
              <h2>Resumen ejecutivo</h2>
              <div id="execSummary"></div>
            </div>
          </div>

          <div class="tab-panel" data-panel="presupuesto">
            <div class="grid grid-4" id="kpisPresupuesto"></div>
            <div class="card">
              <h2>Ejecución por categoría</h2>
              <div class="chart"><canvas id="categoryBar"></canvas></div>
            </div>
            <div class="card">
              <h2>Presupuesto detallado</h2>
              <div style="overflow-x: auto;">
                <table class="table">
                  <thead>
                    <tr><th>Partida</th><th class="num">Presupuesto</th><th class="num">Comprometido</th><th class="num">Pagado</th><th>% Ejecución</th><th class="num">Por ejecutar</th></tr>
                  </thead>
                  <tbody id="budgetBody"></tbody>
                </table>
              </div>
            </div>
          </div>

          <div class="tab-panel" data-panel="balance">
            <div class="grid grid-4" id="kpisBalance"></div>
            <div class="layout-2col">
              <div class="card">
                <h2>Composición del balance</h2>
                <div class="chart"><canvas id="balanceChart"></canvas></div>
              </div>
              <div class="card">
                <h2>Balance ejecutivo</h2>
                <div id="balanceRows"></div>
              </div>
            </div>
          </div>

          <div class="tab-panel" data-panel="flujo">
            <div class="grid grid-4" id="kpisFlujo"></div>
            <div class="layout-2col">
              <div class="card">
                <h2>Ingresos, pagos y caja disponible</h2>
                <div class="chart"><canvas id="cashChart"></canvas></div>
              </div>
              <div class="card">
                <h2>Fuentes de financiación</h2>
                <div class="chart"><canvas id="fundingChart"></canvas></div>
              </div>
            </div>
          </div>

          <div class="tab-panel" data-panel="costos">
            <div class="grid grid-4" id="kpisCostos"></div>
            <div class="card">
              <h2>Costes mensuales acumulados por bloque</h2>
              <div class="chart"><canvas id="costsChart"></canvas></div>
            </div>
          </div>

          <div class="tab-panel" data-panel="ventas">
            <div class="grid grid-4" id="kpisVentas"></div>
            <div class="layout-2col">
              <div class="card">
                <h2>Ventas y proyección de ingresos</h2>
                <div class="chart"><canvas id="salesProjection"></canvas></div>
              </div>
              <div class="card">
                <h2>Reservas por modelo</h2>
                <div class="chart sm"><canvas id="modelsChart"></canvas></div>
              </div>
            </div>
            <div class="card">
              <h2>Canales activos</h2>
              <div id="channels"></div>
            </div>
          </div>

          <div class="tab-panel" data-panel="cobranza">
            <div class="grid grid-4" id="kpisCobranza"></div>
            <div class="layout-2col">
              <div class="card">
                <h2>Estado de cartera</h2>
                <div class="chart"><canvas id="collectionDonut"></canvas></div>
              </div>
              <div class="card">
                <h2>Proceso de gestión</h2>
                <div class="timeline" id="collectionFlow"></div>
              </div>
            </div>
          </div>

          <div class="tab-panel" data-panel="obra">
            <div class="grid grid-4" id="kpisObra"></div>
            <div class="layout-2col">
              <div class="card">
                <h2>Avance físico</h2>
                <div class="chart"><canvas id="workProgress"></canvas></div>
              </div>
              <div class="card">
                <h2>Retrasos por actividad (días)</h2>
                <div class="chart"><canvas id="delayChart"></canvas></div>
              </div>
            </div>
            <div class="card">
              <h2>Estado físico en obra</h2>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px;" id="buildingGrid"></div>
            </div>
            <div class="card">
              <h2>Decisiones críticas</h2>
              <div id="urgentDecisions"></div>
            </div>
          </div>
        </div>
      </div>
    `;
    } catch (e) {
      console.error('Dashboard render error:', e);
      return `<div style="padding: 20px; background: rgba(255,0,0,0.1); border: 2px solid #FF0000; border-radius: 8px; margin: 20px;"><h2 style="color: #FF0000;">❌ Error in Dashboard</h2><p>${e.message}</p></div>`;
    }
  },

  async init() {
    console.log('Dashboard module initialized');

    // Registrar plugin de etiquetas
    Chart.register(ARAYA_VALUE_LABELS);

    // Cargar datos del proyecto actual
    const project = await app.getActiveProject();
    const data = await this.loadProjectData(project.id);

    // Renderizar KPIs
    this.renderKPIs(data);

    // Renderizar tabla presupuestal
    this.renderBudgetTable(data);

    // Renderizar otros elementos
    this.renderExecutiveSummary(data);
    this.renderBalanceRows(data);
    this.renderChannels(data);
    this.renderCollectionFlow(data);
    this.renderBuildingStatus(data);
    this.renderUrgentDecisions(data);

    // Crear gráficos
    this.buildCharts(data);

    // Event listeners
    this.setupEventListeners();
  },

  async loadProjectData(projectId) {
    try {
      // Get project to access currency setting
      const project = await db.read('projects', projectId);

      // Load budget data
      const budgetRecords = await db.getByIndex('budgetData', 'projectId', projectId) || [];
      const expenseRecords = await db.getByIndex('expenseData', 'projectId', projectId) || [];
      const incomeRecords = await db.getByIndex('salesData', 'projectId', projectId) || [];

      // Calculate totals (multiply by 1,000,000 as values are in millions of pesos)
      const MILLION = 1000000;
      const totalBudget = budgetRecords.reduce((sum, b) => sum + ((b.budgeted || 0) * MILLION), 0);
      const totalCommitted = budgetRecords.reduce((sum, b) => sum + ((b.committed || 0) * MILLION), 0);
      const totalPaid = budgetRecords.reduce((sum, b) => sum + ((b.paid || 0) * MILLION), 0);
      const totalExpenses = expenseRecords.reduce((sum, e) => sum + ((e.amount || 0) * MILLION), 0);
      const totalIncome = incomeRecords.reduce((sum, i) => sum + ((i.amount || 0) * MILLION), 0);
      const balance = totalIncome - totalExpenses;

      // Define formatVal early so it's available for all return paths
      const currency = project.currency || 'CLP';
      const formatVal = (v) => app.formatCurrency(v, currency);

      // Show data even without budget items (can have expenses/income)
      // Only use defaults if truly no data exists
      if (totalBudget === 0 && totalExpenses === 0 && totalIncome === 0) {
        const defaultData = dashboardData.getDefaultData();

        // Calculate default budget by category
        const defaultBudgetByCategory = {};
        (defaultData.budget || []).forEach(g => {
          if (g.items) {
            g.items.forEach(([name, value]) => {
              defaultBudgetByCategory[g.group] = (defaultBudgetByCategory[g.group] || 0) + value;
            });
          }
        });

        // Return with proper structure, using defaults for charts AND KPIs (values already in millions)
        const defaultBudgetTotal = (defaultData.budgetKpi || 1000) * MILLION;
        const defaultCommitted = (defaultData.committed || 600) * MILLION;
        const defaultPaid = (defaultData.paid || 400) * MILLION;
        const defaultExpenses = (defaultData.totalExpenses || 500) * MILLION;
        const defaultIncome = (defaultData.totalIncome || 1200) * MILLION;

        return {
          project: { name: (await db.read('projects', projectId)).name },
          budget: defaultData.budget || [], // Use array format for backward compatibility with renderBudgetTable
          budgetObj: { // Also provide object format for KPIs
            total: defaultBudgetTotal,
            committed: defaultCommitted,
            paid: defaultPaid,
            byCategory: defaultBudgetByCategory,
            items: []
          },
          expenses: {
            total: defaultExpenses,
            byCategory: defaultData.expensesByCategory || { 'Construcción': 300 * MILLION, 'Administración': 200 * MILLION },
            items: []
          },
          income: {
            total: defaultIncome,
            bySource: defaultData.incomeBySource || { 'Ventas': 1000 * MILLION, 'Préstamos': 200 * MILLION },
            items: []
          },
          balance: defaultIncome - defaultExpenses,
          formatVal,
          currency,
          channels: defaultData.channels || [],
          monthly: defaultData.monthly || { m: [], construction: [], sales: [], promoter: [], other: [] },
          cash: defaultData.cash || { months: [], income: [], payments: [], available: [] },
          delays: defaultData.delays || [],
          units: defaultData.units || {},
          collection: defaultData.collection || {}
        };
      }

      // Group by category
      const budgetByCategory = {};
      budgetRecords.forEach(b => {
        const cat = b.category || 'General';
        if (!budgetByCategory[cat]) {
          budgetByCategory[cat] = { budget: 0, committed: 0, paid: 0, items: [] };
        }
        budgetByCategory[cat].budget += b.budgeted || 0;
        budgetByCategory[cat].committed += b.committed || 0;
        budgetByCategory[cat].paid += b.paid || 0;
        budgetByCategory[cat].items.push(b);
      });

      const expenseByCategory = {};
      expenseRecords.forEach(e => {
        const cat = e.category || 'Otros';
        if (!expenseByCategory[cat]) expenseByCategory[cat] = 0;
        expenseByCategory[cat] += e.amount || 0;
      });

      const incomeBySource = {};
      incomeRecords.forEach(i => {
        const src = i.source || 'Otros';
        if (!incomeBySource[src]) incomeBySource[src] = 0;
        incomeBySource[src] += i.amount || 0;
      });

      // Get default data for charts that need it
      const defaultData = dashboardData.getDefaultData();

      return {
        project: { name: (await db.read('projects', projectId)).name },
        budget: [], // Empty array for renderBudgetTable (uses imported data differently)
        budgetObj: { // Object format for KPIs
          total: totalBudget,
          committed: totalCommitted,
          paid: totalPaid,
          byCategory: budgetByCategory,
          items: budgetRecords
        },
        expenses: {
          total: totalExpenses,
          byCategory: expenseByCategory,
          items: expenseRecords
        },
        income: {
          total: totalIncome,
          bySource: incomeBySource,
          items: incomeRecords
        },
        balance,
        formatVal,
        currency,
        // Include default data for charts
        channels: defaultData.channels || [],
        monthly: defaultData.monthly || { m: [], construction: [], sales: [], promoter: [], other: [] },
        cash: defaultData.cash || { months: [], income: [], payments: [], available: [] },
        delays: defaultData.delays || [],
        units: defaultData.units || {},
        collection: defaultData.collection || {}
      };
    } catch (error) {
      console.error('Error loading project data:', error);
      const currency = project?.currency || 'CLP';
      const formatVal = (v) => app.formatCurrency(v, currency);
      const defaultData = dashboardData.getDefaultData();
      return {
        project: { name: 'Araya Punta Cana', currency },
        budget: defaultData.budget || [],
        budgetObj: {
          total: defaultData.budgetKpi || 0,
          committed: defaultData.committed || 0,
          paid: defaultData.paid || 0,
          byCategory: {},
          items: []
        },
        expenses: {
          total: 0,
          byCategory: {},
          items: []
        },
        income: {
          total: 0,
          bySource: {},
          items: []
        },
        balance: 0,
        formatVal,
        currency,
        channels: defaultData.channels || [],
        monthly: defaultData.monthly || { m: [], construction: [], sales: [], promoter: [], other: [] },
        cash: defaultData.cash || { months: [], income: [], payments: [], available: [] },
        delays: defaultData.delays || [],
        units: defaultData.units || {},
        collection: defaultData.collection || {}
      };
    }
  },

  renderKPIs(data) {
    const percent = (part, total) => total > 0 ? Math.round((part / total) * 100) : 0;
    // Use budgetObj if available (for imported data), otherwise use budget array format
    const budgetInfo = data.budgetObj || data.budget;
    const budgetTotal = (budgetInfo && budgetInfo.total) || (Array.isArray(data.budget) ? data.budget.reduce((sum, g) => sum + (g.items ? g.items.reduce((s, [n, p]) => s + p, 0) : 0), 0) : 0);
    const budgetCommitted = (budgetInfo && budgetInfo.committed) || 0;
    const budgetPaid = (budgetInfo && budgetInfo.paid) || 0;
    const budgetItems = (budgetInfo && budgetInfo.items) || [];

    const committed = percent(budgetCommitted, budgetTotal);
    const paid = percent(budgetPaid, budgetTotal);
    const remaining = budgetTotal - budgetCommitted - budgetPaid;

    const kpiResumen = [
      {c:'blue',l:'Presupuesto total',v:data.formatVal(budgetTotal),s:'Presupuesto ejecutivo'},
      {c:'amber',l:'Comprometido',v:data.formatVal(budgetCommitted),s:`${committed}% del total`},
      {c:'green',l:'Total pagado',v:data.formatVal(budgetPaid),s:`${paid}% del total`},
      {c:'teal',l:'Balance',v:data.formatVal(data.balance),s:`Ingresos - Gastos`},
      {c:'green',l:'Ingresos',v:data.formatVal(data.income.total),s:`Total ingresos`},
      {c:'red',l:'Gastos',v:data.formatVal(data.expenses.total),s:`Total gastos`},
      {c:'purple',l:'Por ejecutar',v:data.formatVal(remaining),s:`${percent(remaining, budgetTotal)}% pendiente`},
      {c:'teal',l:'Items importados',v:`${budgetItems.length + data.expenses.items.length}`,s:'Registros cargados'}
    ];
    this.renderKPIGroup('kpisResumen', kpiResumen);

    const kpiPresupuesto = [
      {c:'blue',l:'Presupuesto total',v:data.formatVal(budgetTotal),s:'Presupuesto ejecutivo'},
      {c:'amber',l:'Suma items',v:data.formatVal(budgetItems.reduce((sum, b) => sum + (b.budgeted || 0), 0)),s:'Verificar totales'},
      {c:'green',l:'Pagado',v:data.formatVal(budgetPaid),s:`${paid}%`},
      {c:'red',l:'Por ejecutar',v:data.formatVal(remaining),s:`${percent(remaining, budgetTotal)}%`}
    ];
    this.renderKPIGroup('kpisPresupuesto', kpiPresupuesto);

    const kpiBalance = [
      {c:'blue',l:'Total ingresos',v:data.formatVal(data.income.total)},
      {c:'red',l:'Total gastos',v:data.formatVal(data.expenses.total)},
      {c:'green',l:'Balance neto',v:data.formatVal(data.balance)},
      {c:'amber',l:'Proyectos activos',v:'1'}
    ];
    this.renderKPIGroup('kpisBalance', kpiBalance);

    const kpiFlujo = [
      {c:'blue',l:'Ingresos acum.',v:data.formatVal(data.income.total)},
      {c:'red',l:'Gastos acum.',v:data.formatVal(data.expenses.total)},
      {c:'teal',l:'Balance disponible',v:data.formatVal(data.balance)},
      {c:'green',l:'Proyección',v:data.formatVal(data.balance * 0.9)}
    ];
    this.renderKPIGroup('kpisFlujo', kpiFlujo);

    const kpiCostos = [
      {c:'blue',l:'Total gastos',v:data.formatVal(data.expenses.total)},
      {c:'amber',l:'Categorías',v:Object.keys(data.expenses.byCategory).length,s:'Tipos de gasto'},
      {c:'teal',l:'Promedio por item',v:data.formatVal(data.expenses.total / (data.expenses.items.length || 1))},
      {c:'green',l:'Mayor gasto',v:Object.values(data.expenses.byCategory).length > 0 ? data.formatVal(Math.max(...Object.values(data.expenses.byCategory))) : '0'}
    ];
    this.renderKPIGroup('kpisCostos', kpiCostos);

    const kpiVentas = [
      {c:'blue',l:'Total ingresos',v:data.formatVal(data.income.total)},
      {c:'amber',l:'Fuentes',v:Object.keys(data.income.bySource).length,s:'Orígenes de ingreso'},
      {c:'green',l:'Promedio por ingreso',v:data.formatVal(data.income.total / (data.income.items.length || 1))},
      {c:'teal',l:'Mayor ingreso',v:Object.values(data.income.bySource).length > 0 ? data.formatVal(Math.max(...Object.values(data.income.bySource))) : '0'},
      {c:'red',l:'Items cargados',v:data.income.items.length,s:'Registros de ingreso'},
      {c:'purple',l:'En firma',v:'18'},
      {c:'green',l:'Abril 2026',v:'26 res.',s:'Meta superada'},
      {c:'amber',l:'Precio promedio',v:'US$150,5K'}
    ];
    this.renderKPIGroup('kpisVentas', kpiVentas);

    const kpiCobranza = [
      {c:'blue',l:'Contratos',v:'144'},
      {c:'green',l:'Al día',v:'85',s:'59%'},
      {c:'amber',l:'Pendientes',v:'37',s:'26%'},
      {c:'red',l:'Vencidos',v:'22',s:'US$69.148'}
    ];
    this.renderKPIGroup('kpisCobranza', kpiCobranza);

    const kpiObra = [
      {c:'blue',l:'Programado',v:'11,07%'},
      {c:'green',l:'Ejecutado',v:'11,59%'},
      {c:'green',l:'Desviación',v:'+0,52%'},
      {c:'amber',l:'Culminación',v:'Ago 2027'}
    ];
    this.renderKPIGroup('kpisObra', kpiObra);
  },

  renderKPIGroup(containerId, items) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = items.map(item => `
      <div class="kpi-card ${item.c}">
        <div class="kpi-label">${item.l}</div>
        <div class="kpi-value">${item.v}</div>
        <div class="kpi-sub">${item.s || ''}</div>
        <div class="kpi-trend">${item.t || 'Actualizado a abril 2026'}</div>
      </div>
    `).join('');
  },

  renderBudgetTable(data) {
    const tbody = document.getElementById('budgetBody');
    if (!tbody) return;

    let html = '';
    let tP = 0, tC = 0, tPa = 0;

    data.budget.forEach(group => {
      let gP = 0, gC = 0, gPa = 0;
      html += `<tr class="group"><td colspan="6"><strong>${group.g}</strong></td></tr>`;

      group.items.forEach(([name, p, c, pa]) => {
        gP += p; gC += c; gPa += pa;
        const pct = p ? (pa / p * 100) : 0;
        const barColor = pct > 50 ? '#25d39b' : pct > 20 ? '#f0b35a' : '#ff6b6b';
        html += `
          <tr>
            <td>${name}</td>
            <td class="num">RD$${(p/1000000).toFixed(1)}M</td>
            <td class="num">RD$${(c/1000000).toFixed(1)}M</td>
            <td class="num">RD$${(pa/1000000).toFixed(1)}M</td>
            <td><div style="background: #606060; height: 8px; border-radius: 4px; overflow: hidden; min-width: 60px;"><div style="background: ${barColor}; width: ${Math.min(100, pct)}%; height: 100%;"></div></div> ${pct.toFixed(0)}%</td>
            <td class="num">RD$${((p-pa)/1000000).toFixed(1)}M</td>
          </tr>
        `;
      });

      tP += gP; tC += gC; tPa += gPa;
      html += `<tr class="group"><td><strong>Subtotal</strong></td><td class="num">RD$${(gP/1000000).toFixed(1)}M</td><td class="num">RD$${(gC/1000000).toFixed(1)}M</td><td class="num">RD$${(gPa/1000000).toFixed(1)}M</td><td>${(gPa/gP*100).toFixed(1)}%</td><td class="num">RD$${((gP-gPa)/1000000).toFixed(1)}M</td></tr>`;
    });

    html += `<tr style="background: rgba(74,163,255,.15); font-weight: 900;"><td>TOTAL TABLA</td><td class="num">RD$${(tP/1000000).toFixed(1)}M</td><td class="num">RD$${(tC/1000000).toFixed(1)}M</td><td class="num">RD$${(tPa/1000000).toFixed(1)}M</td><td>${(tPa/tP*100).toFixed(1)}%</td><td class="num">RD$${((tP-tPa)/1000000).toFixed(1)}M</td></tr>`;

    tbody.innerHTML = html;
  },

  renderExecutiveSummary(data) {
    const container = document.getElementById('execSummary');
    if (!container) return;
    container.innerHTML = `
      <div class="alert green">
        <b>Obra adelantada</b>
        <div>Ejecutado 11,59% frente a programado 11,07%.</div>
      </div>
      <div class="alert amber">
        <b>Caja sensible</b>
        <div>Pagos proyectados fuertes entre mayo y septiembre.</div>
      </div>
      <div class="alert red">
        <b>Decisiones pendientes</b>
        <div>Ventanería, carpintería, cerámica y revestimiento escalera antes de junio.</div>
      </div>
    `;
  },

  renderBalanceRows(data) {
    const container = document.getElementById('balanceRows');
    if (!container) return;
    container.innerHTML = `
      <div class="alert green"><b>Activos</b>Bancos RD$50,7M · Construcción en proceso RD$621,2M</div>
      <div class="alert amber"><b>Pasivos</b>Créditos RD$140M · Depósitos clientes RD$184,9M</div>
      <div class="alert green"><b>Capital</b>Aporte fideicomitentes RD$329,9M</div>
    `;
  },

  renderChannels(data) {
    const container = document.getElementById('channels');
    if (!container) return;
    container.innerHTML = data.channels.map((channel, i) => `
      <div class="alert ok" style="border-left-color: #25d39b;">
        <b>${channel}</b>
        <div style="font-size: 12px;">${i === 0 ? 'Canal con mayor empuje comercial en abril.' : i === 8 ? 'Nuevo canal incorporado con tracción inicial.' : 'Canal activo en seguimiento.'}</div>
      </div>
    `).join('');
  },

  renderCollectionFlow(data) {
    const container = document.getElementById('collectionFlow');
    if (!container) return;
    const flow = [
      ['📄', 'Documentos', '−2 días'],
      ['📝', 'Contrato', 'En proceso'],
      ['🔍', 'Depuración', '8 en proceso'],
      ['📁', 'Expediente', '29 esperando'],
      ['✅', 'Vinculación', '−1 día']
    ];
    container.innerHTML = flow.map(([icon, title, desc]) => `
      <div class="timeline-item">
        <div class="timeline-bubble">${icon}</div>
        <div><strong>${title}</strong><div class="hint">${desc}</div></div>
        <span class="badge ok">track</span>
      </div>
    `).join('');
  },

  renderBuildingStatus(data) {
    const container = document.getElementById('buildingGrid');
    if (!container) return;
    const items = [
      ['8', 'Superestructura', 'Edificio #9 en curso'],
      ['10', 'Plateas', 'Platea #11 en curso'],
      ['4', 'Escaleras', 'Ejecución'],
      ['5', 'Estucado interno', 'Ejecución'],
      ['7', 'Resane interno', 'Ejecución'],
      ['2', 'Pend. techo', 'Ejecución']
    ];
    container.innerHTML = items.map(([num, label, desc]) => `
      <div class="card" style="text-align: center;">
        <div style="font-size: 32px; font-weight: 900; color: var(--blue);">${num}</div>
        <div style="font-weight: 700; margin: 8px 0;">${label}</div>
        <div class="hint">${desc}</div>
      </div>
    `).join('');
  },

  renderUrgentDecisions(data) {
    const container = document.getElementById('urgentDecisions');
    if (!container) return;
    container.innerHTML = `
      <div class="alert red"><b>Ventanería y carpintería</b>Cerrar contrataciones de inmediato.</div>
      <div class="alert red"><b>Tipo de cerámica</b>Definir y aprobar para garantizar disponibilidad.</div>
      <div class="alert amber"><b>Revestimiento escaleras</b>Definir tipo e impacto en planificación.</div>
    `;
  },

  buildCharts(data) {
    const chartConfig = dashboardData.getChartConfigs(data);

    Object.entries(chartConfig).forEach(([canvasId, config]) => {
      const canvas = document.getElementById(canvasId);
      if (canvas) {
        const chart = new Chart(canvas, config);
        this.charts.push(chart);
      }
    });
  },

  setupEventListeners() {
    // Tab switching
    document.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        const tabName = e.currentTarget.getAttribute('data-tab');
        document.querySelectorAll('.tab, .tab-panel').forEach(el => el.classList.remove('active'));
        e.currentTarget.classList.add('active');
        document.querySelector(`[data-panel="${tabName}"]`)?.classList.add('active');
        setTimeout(() => this.charts.forEach(c => c.resize()), 80);
      });
    });

    // Export PDF
    const btnExportPDF = document.getElementById('btnExportPDF');
    if (btnExportPDF) {
      btnExportPDF.addEventListener('click', () => window.print());
    }

    // Refresh
    const btnRefresh = document.getElementById('btnRefresh');
    if (btnRefresh) {
      btnRefresh.addEventListener('click', async () => {
        location.reload();
      });
    }
  }
};
