// Registrar Service Worker para PWA
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/src/service-worker.js')
    .then(reg => console.log('✓ Service Worker registrado'))
    .catch(err => console.log('Service Worker error:', err));
}

// Theme Toggle
function toggleTheme() {
  const html = document.documentElement;
  const isDark = !html.hasAttribute('data-theme');
  if (isDark) {
    html.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light');
  } else {
    html.removeAttribute('data-theme');
    localStorage.setItem('theme', 'dark');
  }
}

// Restore theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
  document.documentElement.setAttribute('data-theme', 'light');
}

// Make toggleTheme globally available
(window as any).toggleTheme = toggleTheme;

// Initialize Charts
function initializeCharts() {
  // Check if Chart.js is loaded
  if (typeof (window as any).Chart === 'undefined') {
    console.log('Chart.js aún no está cargado');
    return;
  }

  const ctx1 = document.getElementById('incomeChart') as HTMLCanvasElement;
  const ctx2 = document.getElementById('pieChart') as HTMLCanvasElement;

  if (!ctx1 || !ctx2) {
    console.log('Canvas elements not found');
    return;
  }

  try {
    // Income Chart
    new (window as any).Chart(ctx1, {
      type: 'line',
      data: {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
        datasets: [
          {
            label: 'Ingresos',
            data: [1800, 1920, 2100, 2400, 2300, 2400],
            borderColor: '#4aa3ff',
            backgroundColor: 'rgba(74, 163, 255, 0.1)',
            tension: 0.4,
            fill: true
          },
          {
            label: 'Gastos',
            data: [800, 850, 900, 950, 890, 920],
            borderColor: '#ff6b6b',
            backgroundColor: 'rgba(255, 107, 107, 0.1)',
            tension: 0.4,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            labels: {
              color: '#aeb8c7',
              font: { size: 12 }
            }
          }
        },
        scales: {
          y: {
            ticks: { color: '#aeb8c7' },
            grid: { color: 'rgba(255, 255, 255, 0.1)' }
          },
          x: {
            ticks: { color: '#aeb8c7' },
            grid: { color: 'rgba(255, 255, 255, 0.1)' }
          }
        }
      }
    });

    // Pie Chart
    new (window as any).Chart(ctx2, {
      type: 'doughnut',
      data: {
        labels: ['Ventas', 'Servicios', 'Inversiones'],
        datasets: [
          {
            data: [300, 150, 100],
            backgroundColor: ['#4aa3ff', '#25d39b', '#f0b35a'],
            borderColor: '#07111f',
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              color: '#aeb8c7',
              font: { size: 11 }
            }
          }
        }
      }
    });

    console.log('✓ Gráficos inicializados');
  } catch (error) {
    console.error('Error inicializando gráficos:', error);
  }
}

// Initialize on load
window.addEventListener('load', () => {
  console.log('Page loaded');
  initializeCharts();
});

// Also try after DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM Content Loaded');
  initializeCharts();
});

console.log('✓ main.ts cargado');
