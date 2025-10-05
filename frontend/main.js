const { app, BrowserWindow, shell } = require('electron/main');
const path = require('path');
const url = require('url');
const { spawn } = require('child_process');
const kill = require('tree-kill');

let mainWindow;
let backendProcess;

function startBackend() {
  const backendPath = !app.isPackaged
    ? path.join(__dirname, '../backend/dist/app.exe')
    : path.join(process.resourcesPath, 'backend/app.exe');

  console.log(`Starting backend at: ${backendPath}`);
  backendProcess = spawn(backendPath);

  backendProcess.stdout.on('data', (data) => {
    const message = data.toString();
    console.log(`Backend: ${message}`);
    if (mainWindow && message.includes('Model loaded successfully.')) {
      const windows = BrowserWindow.getAllWindows();
      if (windows.length > 0) {
        windows[0].webContents.send('backend-ready');
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
        pathname: path.join(__dirname, './out/index.html'),
        protocol: 'file:',
        slashes: true,
      });

  mainWindow.loadURL(startUrl);

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.on('close', (event) => {
    event.preventDefault();

    const shutdownHtml = `
      <body style="font-family: monospace; text-align: center; color: black; background: #f7ff58; border: 3px solid black; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0;">
        <h1>Shutting down backend...</h1>
      </body>
    `;
    mainWindow.loadURL(`data:text/html,${shutdownHtml}`);

    mainWindow.webContents.once('did-finish-load', () => {
      if (backendProcess && backendProcess.pid) {
        kill(backendProcess.pid, 'SIGKILL', (err) => {
          if (err) console.error('Failed to kill backend process:', err);
          else console.log('Backend process tree killed successfully.');

          mainWindow.destroy();
          app.quit();
        });
      } else {
        mainWindow.destroy();
        app.quit();
      }
    });
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
