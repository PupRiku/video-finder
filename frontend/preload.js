const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  onBackendReady: (callback) => ipcRenderer.on('backend-ready', callback),
  checkBackendStatus: () => ipcRenderer.invoke('check-backend-status'),
});
