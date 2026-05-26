// Dashboard Data and Chart Configurations
export const dashboardData = {
  getDefaultData() {
    return {
      budgetKpi: 3429,
      committed: 825,
      paid: 604,
      available: 50.7,
      work: 11.59,
      workPlan: 11.07,
      units: { total: 462, active1: 133, active2: 64, desist: 39, available: 226, reserved: 236, active: 197, linked: 142 },
      collection: { signed: 144, ok: 85, pending: 37, overdue: 22, overdueAmount: 69147.67 },
      balance: { assets: 676.552, liabilities: 346.318, equity: 330.234, result: 0.286 },
      cash: {
        months: ['May 26', 'Jun 26', 'Jul 26', 'Ago 26', 'Sep 26'],
        income: [19, 20, 20, 21, 21],
        payments: [87.1, 128.5, 76.3, 101.4, 103.5],
        available: [2.9, 4.4, 113.1, 32.7, 60.2]
      },
      budget: [
        {
          g: 'Costos de construcción',
          items: [
            ['Terreno', 106933000, 264445081, 264445081],
            ['Costo urbanismo', 469173667, 56213102, 40006582],
            ['Costo vivienda', 1517166651, 137066624, 37037023],
            ['Gerencia construcción', 198634032, 47077469, 35577231],
            ['Inspección técnica', 19264643, 8618393, 3548750],
            ['Indirectos de obra', 47672168, 26336863, 5702003],
            ['Fondo contingencia', 39726806, 0, 0]
          ]
        },
        {
          g: 'Gastos operativos',
          items: [
            ['Gerencia de la promotora', 187510526, 39101176, 23234234],
            ['Gerencia de ventas', 327746152, 122048063, 98228957],
            ['Administración fiducia', 81458723, 21447733, 5143751],
            ['Publicidad', 69521911, 32305917, 29569547],
            ['Post ventas', 19863403, 0, 0]
          ]
        },
        {
          g: 'Otros gastos',
          items: [
            ['Permisos legales y preliminares', 30500000, 27110368, 24386295],
            ['Diseño y proyecto', 25000000, 24431389, 24426290],
            ['Gastos financieros', 232739209, 18617144, 12878255],
            ['Imprevistos', 19863403, 0, 0]
          ]
        }
      ],
      monthly: {
        m: ['Ene 25', 'Feb 25', 'Mar 25', 'Abr 25', 'May 25', 'Jun 25', 'Jul 25', 'Ago 25', 'Sep 25', 'Oct 25', 'Nov 25', 'Dic 25', 'Ene 26', 'Feb 26', 'Mar 26', 'Abr 26'],
        construction: [1.77, 0, 0.89, 2.81, 2.45, 3.37, 5.83, 5.36, 2.79, 3.67, 5.24, 18.77, 5.33, 15.28, 30.26, 23.61],
        sales: [0, 0.65, 0.60, 1.55, 1.42, 1.73, 7.89, 16.17, 11.89, 12.66, 15.20, 5.62, 5.33, 3.56, 9.53, 5.81],
        promoter: [0, 0, 0, 1.77, 1.77, 1.77, 1.77, 1.77, 1.77, 1.77, 1.77, 1.77, 1.77, 1.77, 1.77, 1.83],
        other: [0.96, 1.97, 1.14, 0.86, 0.87, 1.62, 3.69, 0.41, 1.38, 1.39, 1.06, 1.19, 1.04, 2.31, 1.89, 1.97]
      },
      channels: [
        'Punta Cana Solutions — Mayor vendedor Abr',
        'Remax Ariel Grasso — Activo',
        'Remax Cumbre — Activo',
        'Plusval — Feria Abr',
        'Equipo ARAYA — Activo',
        'Lacig by Keller Williams — Activo',
        'Mundo Inmobiliario Caribe — Activo',
        'Remax Paradise — Activo',
        'Acervo — Nueva · 4 reservas'
      ],
      delays: [
        ['Encofrado aptos', 0],
        ['Cerámica', 9],
        ['Rev. escaleras', 9],
        ['Escaleras', 12],
        ['Pend. techo', 12],
        ['Platea', 16],
        ['Tablilla ext.', 24],
        ['Resane ext.', 24]
      ]
    };
  },

  getChartConfigs(data) {
    const colors = {
      blue: '#4aa3ff',
      green: '#25d39b',
      amber: '#f0b35a',
      red: '#ff6b6b',
      purple: '#9b8cff',
      teal: '#41d6cf',
      gray: 'rgba(170,180,195,.6)'
    };

    const baseOptions = {
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: { top: 36, right: 34, bottom: 12, left: 16 } },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(7,17,31,.92)',
          padding: 12,
          cornerRadius: 12
        },
        arayaValueLabels: {}
      },
      scales: {
        x: { grid: { color: 'rgba(255,255,255,.06)' }, ticks: { color: '#aeb8c7' } },
        y: { grid: { color: 'rgba(255,255,255,.06)' }, ticks: { color: '#aeb8c7' } }
      }
    };

    return {
      budgetDonut: {
        type: 'doughnut',
        data: {
          labels: ['Pagado', 'Comprometido adicional', 'Por ejecutar'],
          datasets: [{
            data: [604, 221, 2604],
            backgroundColor: [colors.blue, colors.amber, colors.gray],
            borderWidth: 0,
            cutout: '68%'
          }]
        },
        options: {
          ...baseOptions,
          scales: {},
          plugins: { ...baseOptions.plugins, legend: { display: true, position: 'bottom', labels: { color: '#aeb8c7' } } }
        }
      },

      unitsDonut: {
        type: 'doughnut',
        data: {
          labels: ['Activas F.I', 'Activas F.II', 'Desistidas', 'Disponibles'],
          datasets: [{
            data: [133, 64, 39, 226],
            backgroundColor: [colors.green, colors.purple, colors.red, colors.gray],
            borderWidth: 0,
            cutout: '64%'
          }]
        },
        options: {
          ...baseOptions,
          scales: {},
          plugins: { ...baseOptions.plugins, legend: { display: true, position: 'bottom', labels: { color: '#aeb8c7' } } }
        }
      },

      categoryBar: {
        type: 'bar',
        data: {
          labels: ['Terreno', 'Urbanismo', 'Vivienda', 'G.Constr.', 'Insp.Téc.', 'Indirectos', 'Conting.', 'G.Prom.', 'G.Ventas', 'Admin', 'Publicidad', 'Post', 'Permisos', 'Diseño', 'Financ.', 'Imprev.'],
          datasets: [
            {
              label: 'Presupuesto',
              data: [106.9, 469.2, 1517.2, 198.6, 19.3, 47.7, 39.7, 187.5, 327.7, 81.5, 69.5, 19.9, 30.5, 25, 232.7, 19.9],
              backgroundColor: 'rgba(74,163,255,.22)',
              borderColor: colors.blue,
              borderWidth: 1
            },
            {
              label: 'Pagado',
              data: [264.4, 40, 37, 35.6, 3.5, 5.7, 0, 23.2, 98.2, 5.1, 29.6, 0, 24.4, 24.4, 12.9, 0],
              backgroundColor: 'rgba(37,211,155,.75)'
            }
          ]
        },
        options: {
          ...baseOptions,
          plugins: { ...baseOptions.plugins, legend: { display: true, position: 'bottom', labels: { color: '#aeb8c7' } } },
          scales: {
            x: { ticks: { color: '#aeb8c7', maxRotation: 55, font: { size: 10 } }, grid: { display: false } },
            y: { ticks: { color: '#aeb8c7', callback: v => v + 'M' }, grid: { color: 'rgba(255,255,255,.06)' } }
          }
        }
      },

      balanceChart: {
        type: 'bar',
        data: {
          labels: ['Bancos', 'Anticipos', 'Construcción', 'Créd. fin.', 'CxP', 'Dep. clientes', 'Retenciones', 'Capital'],
          datasets: [{
            data: [50.7, 4.7, 621.2, -140, -19.2, -184.9, -2.2, 330.2],
            backgroundColor: [colors.blue, colors.blue, colors.blue, colors.red, colors.red, colors.red, colors.red, colors.green],
            borderRadius: 8
          }]
        },
        options: {
          ...baseOptions,
          indexAxis: 'y',
          scales: {
            x: { ticks: { color: '#aeb8c7', callback: v => Math.abs(v) + 'M' }, grid: { color: 'rgba(255,255,255,.06)' } },
            y: { ticks: { color: '#aeb8c7' }, grid: { display: false } }
          }
        }
      },

      cashChart: {
        type: 'bar',
        data: {
          labels: data.cash.months,
          datasets: [
            {
              label: 'Ingresos',
              data: data.cash.income,
              backgroundColor: 'rgba(37,211,155,.75)',
              borderRadius: 8
            },
            {
              label: 'Pagos',
              data: data.cash.payments,
              backgroundColor: 'rgba(255,107,107,.65)',
              borderRadius: 8
            },
            {
              type: 'line',
              label: 'Disponible',
              data: data.cash.available,
              borderColor: colors.blue,
              pointBackgroundColor: colors.blue,
              pointRadius: 5,
              tension: 0.35,
              yAxisID: 'y'
            }
          ]
        },
        options: {
          ...baseOptions,
          plugins: { ...baseOptions.plugins, legend: { display: true, position: 'bottom', labels: { color: '#aeb8c7' } } },
          scales: {
            x: { ticks: { color: '#aeb8c7' }, grid: { display: false } },
            y: { ticks: { color: '#aeb8c7', callback: v => 'RD$' + v + 'M' }, grid: { color: 'rgba(255,255,255,.06)' } }
          }
        }
      },

      fundingChart: {
        type: 'bar',
        data: {
          labels: ['Aporte AFI', 'Créd. AFI', 'Créd. BAK', 'Créd. ALAVER', 'Interino constr.', 'Ingresos ventas'],
          datasets: [{
            data: [330, 100, 49.2, 55, 490, 187.5],
            backgroundColor: [colors.purple, colors.purple, colors.purple, colors.teal, colors.blue, colors.green],
            borderRadius: 8
          }]
        },
        options: {
          ...baseOptions,
          indexAxis: 'y',
          scales: {
            x: { ticks: { color: '#aeb8c7', callback: v => 'RD$' + v + 'M' }, grid: { color: 'rgba(255,255,255,.06)' } },
            y: { ticks: { color: '#aeb8c7' }, grid: { display: false } }
          }
        }
      },

      costsChart: {
        type: 'bar',
        data: {
          labels: data.monthly.m,
          datasets: [
            { label: 'Construcción', data: data.monthly.construction, backgroundColor: 'rgba(74,163,255,.75)' },
            { label: 'Ger. ventas', data: data.monthly.sales, backgroundColor: 'rgba(37,211,155,.75)' },
            { label: 'Ger. promotora', data: data.monthly.promoter, backgroundColor: 'rgba(155,140,255,.75)' },
            { label: 'Otros', data: data.monthly.other, backgroundColor: 'rgba(240,179,90,.78)' }
          ]
        },
        options: {
          ...baseOptions,
          plugins: { ...baseOptions.plugins, legend: { display: true, position: 'bottom', labels: { color: '#aeb8c7' } } },
          scales: {
            x: { stacked: true, ticks: { color: '#aeb8c7', maxRotation: 55, font: { size: 10 } }, grid: { display: false } },
            y: { stacked: true, ticks: { color: '#aeb8c7', callback: v => 'RD$' + v + 'M' }, grid: { color: 'rgba(255,255,255,.06)' } }
          }
        }
      },

      salesProjection: {
        type: 'bar',
        data: {
          labels: data.cash.months,
          datasets: [
            { label: 'Proyección', data: [19.99, 21.56, 22.14, 21.63, 22.43], backgroundColor: 'rgba(74,163,255,.72)', borderRadius: 8 },
            { type: 'line', label: 'Meta', data: [19, 20, 21, 21, 21], borderColor: colors.green, borderDash: [6, 6], tension: 0.3, pointRadius: 4 }
          ]
        },
        options: {
          ...baseOptions,
          plugins: { ...baseOptions.plugins, legend: { display: true, position: 'bottom', labels: { color: '#aeb8c7' } } },
          scales: {
            x: { ticks: { color: '#aeb8c7' }, grid: { display: false } },
            y: { ticks: { color: '#aeb8c7', callback: v => 'RD$' + v + 'M' }, grid: { color: 'rgba(255,255,255,.06)' } }
          }
        }
      },

      modelsChart: {
        type: 'bar',
        data: {
          labels: ['Balcony', 'Garden', 'Sunset', 'Balcony Flex'],
          datasets: [{ data: [6.3, 6.0, 4.9, 3.3], backgroundColor: [colors.blue, colors.green, colors.amber, colors.purple], borderRadius: 8 }]
        },
        options: baseOptions
      },

      collectionDonut: {
        type: 'doughnut',
        data: {
          labels: ['Al día', 'Pendientes', 'Vencidos'],
          datasets: [{
            data: [85, 37, 22],
            backgroundColor: [colors.green, colors.amber, colors.red],
            borderWidth: 0,
            cutout: '64%'
          }]
        },
        options: {
          ...baseOptions,
          scales: {},
          plugins: { ...baseOptions.plugins, legend: { display: true, position: 'bottom', labels: { color: '#aeb8c7' } } }
        }
      },

      workProgress: {
        type: 'bar',
        data: {
          labels: ['Programado', 'Ejecutado'],
          datasets: [{ data: [11.07, 11.59], backgroundColor: [colors.amber, colors.green], borderRadius: 12 }]
        },
        options: {
          ...baseOptions,
          indexAxis: 'y',
          scales: {
            x: { min: 0, max: 15, ticks: { color: '#aeb8c7', callback: v => v + '%' }, grid: { color: 'rgba(255,255,255,.06)' } },
            y: { ticks: { color: '#aeb8c7' }, grid: { display: false } }
          }
        }
      },

      delayChart: {
        type: 'bar',
        data: {
          labels: data.delays.map(x => x[0]),
          datasets: [{
            data: data.delays.map(x => x[1]),
            backgroundColor: data.delays.map(x => x[1] >= 20 ? colors.red : x[1] >= 9 ? colors.amber : colors.green),
            borderRadius: 8
          }]
        },
        options: {
          ...baseOptions,
          indexAxis: 'y',
          scales: {
            x: { ticks: { color: '#aeb8c7', callback: v => v + 'd' }, grid: { color: 'rgba(255,255,255,.06)' } },
            y: { ticks: { color: '#aeb8c7' }, grid: { display: false } }
          }
        }
      }
    };
  }
};
