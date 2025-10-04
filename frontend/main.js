const { app, BrowserWindow, shell } = require('electron/main');
const path = require('path');
const url = require('url');
const isDev = require('electron-is-dev');
const { spawn } = require('child_process');

let backendProcess;

function startBackend() {
  const backendPath = isDev
    ? path.join(__dirname, '../backend/dist/app.exe')
    : path.join(process.resourcesPath, 'backend/app.exe');

  console.log(`Starting backend at: ${backendPath}`);

  backendProcess = spawn(backendPath);

  backendProcess.stdout.on('data', (data) => {
    const message = data.toString();
    console.log(`Backend: ${message}`);
    if (message.includes('Model loaded successfully.')) {
      BrowserWindow.getAllWindows()[0].webContents.send('backend-ready');
    }
  });
  backendProcess.stderr.on('data', (data) => {
    console.error(`Backend Error: ${data}`);
  });
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  const startUrl = isDev
    ? 'http://localhost:3000'
    : url.format({
        pathname: path.join(__dirname, './out/index.html'),
        protocol: 'file:',
        slashes: true,
      });

  mainWindow.loadURL(startUrl);

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

app.whenReady().then(() => {
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

app.on('quit', () => {
  console.log('Killing backend process...');
  if (backendProcess) {
    backendProcess.kill();
  }
});
