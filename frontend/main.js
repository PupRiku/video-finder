const { app, BrowserWindow, shell, ipcMain } = require('electron/main');
const path = require('path');
const url = require('url');
const { spawn } = require('child_process');
const kill = require('tree-kill');

let mainWindow;
let backendProcess;
let isBackendReady = false;
let isQuitting = false; // Flag to manage the shutdown sequence

function startBackend() {
  const backendPath = !app.isPackaged
    ? path.join(__dirname, '../backend/dist/app.exe')
    : path.join(process.resourcesPath, 'backend/app.exe');

  console.log(`Starting backend at: ${backendPath}`);
  backendProcess = spawn(backendPath);

  backendProcess.stdout.on('data', (data) => {
    const message = data.toString();
    console.log(`Backend: ${message}`);
    if (message.includes('Model loaded successfully.')) {
      isBackendReady = true;
      if (mainWindow) {
        mainWindow.webContents.send('backend-ready');
      }
    }
  });
  backendProcess.stderr.on('data', (data) => {
    console.error(`Backend Error: ${data}`);
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: !app.isPackaged ? true : false,
    },
  });

  const startUrl = !app.isPackaged
    ? 'http://localhost:3000'
    : url.format({
        pathname: path.join(__dirname, 'out/index.html'),
        protocol: 'file:',
        slashes: true,
      });

  mainWindow.loadURL(startUrl);

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.on('close', (event) => {
    // If we are already in the process of quitting, let the window close
    if (isQuitting) {
      return;
    }

    // Otherwise, start our graceful shutdown
    event.preventDefault();

    const shutdownWindow = new BrowserWindow({
      width: 400,
      height: 150,
      frame: false,
      transparent: true,
      alwaysOnTop: true,
      center: true,
    });
    const shutdownHtml = `
      <body style="font-family: monospace; text-align: center; color: black; background: #f7ff58; border: 3px solid black; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0;">
        <h1>Shutting down backend...</h1>
      </body>
    `;
    shutdownWindow.loadURL(`data:text/html,${shutdownHtml}`);

    if (backendProcess && backendProcess.pid) {
      kill(backendProcess.pid, 'SIGKILL', (err) => {
        if (err) console.error('Failed to kill backend process:', err);
        else console.log('Backend process tree killed successfully.');

        isQuitting = true; // Set the flag
        app.quit(); // Now, quit for real
      });
    } else {
      isQuitting = true;
      app.quit();
    }
  });
}

app.whenReady().then(() => {
  ipcMain.handle('check-backend-status', () => isBackendReady);

  startBackend();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
