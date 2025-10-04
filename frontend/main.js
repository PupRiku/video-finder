const { app, BrowserWindow, shell } = require('electron/main');
const path = require('path');
const url = require('url');
const isDev = require('electron-is-dev');
const { spawn } = require('child_process');

// Global reference to the backend process
let backendProcess;

function startBackend() {
  // Determine the path to the backend executable
  const backendPath = isDev
    ? path.join(__dirname, '../backend/dist/app.exe')
    : path.join(process.resourcesPath, 'app.exe');

  console.log(`Starting backend at: ${backendPath}`);

  // Launch the backend executable
  backendProcess = spawn(backendPath);

  // Log output from the backend process
  backendProcess.stdout.on('data', (data) => {
    console.log(`Backend: ${data}`);
  });
  backendProcess.stderr.on('data', (data) => {
    console.error(`Backend Error: ${data}`);
  });
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
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
