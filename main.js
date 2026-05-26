const { app, BrowserWindow, shell, Menu } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    title: 'Bricket Finanzas',
    icon: path.join(__dirname, 'img', 'bricket-logo.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true
    },
    backgroundColor: '#07111f',
    show: false
  });

  mainWindow.loadFile('index.html');

  // Show window once loaded (avoid white flash)
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Open external links in system browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// App menu
function createMenu() {
  const template = [
    {
      label: 'Archivo',
      submenu: [
        { label: 'Recargar', accelerator: 'F5', click: () => mainWindow?.reload() },
        { type: 'separator' },
        { label: 'Salir', accelerator: 'Alt+F4', click: () => app.quit() }
      ]
    },
    {
      label: 'Ver',
      submenu: [
        { label: 'Pantalla completa', accelerator: 'F11', click: () => mainWindow?.setFullScreen(!mainWindow.isFullScreen()) },
        { label: 'Zoom +', accelerator: 'CmdOrCtrl+=', click: () => { const z = mainWindow?.webContents.getZoomFactor(); mainWindow?.webContents.setZoomFactor(Math.min(z + 0.1, 2)); } },
        { label: 'Zoom -', accelerator: 'CmdOrCtrl+-', click: () => { const z = mainWindow?.webContents.getZoomFactor(); mainWindow?.webContents.setZoomFactor(Math.max(z - 0.1, 0.5)); } },
        { label: 'Tamaño original', accelerator: 'CmdOrCtrl+0', click: () => mainWindow?.webContents.setZoomFactor(1) }
      ]
    },
    {
      label: 'Ayuda',
      submenu: [
        { label: 'Acerca de Bricket Finanzas', click: () => {
          const { dialog } = require('electron');
          dialog.showMessageBox(mainWindow, {
            title: 'Bricket Finanzas',
            message: 'Bricket Finanzas v1.0.0',
            detail: 'Plataforma financiera para gestión de proyectos de construcción.\n\n© 2026 Bricket',
            buttons: ['Cerrar'],
            icon: path.join(__dirname, 'img', 'bricket-logo.png')
          });
        }}
      ]
    }
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

app.whenReady().then(() => {
  createWindow();
  createMenu();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
