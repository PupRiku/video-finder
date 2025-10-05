const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  // One-way channel from main to renderer
  onBackendReady: (callback) => ipcRenderer.on('backend-ready', callback),

  // Two-way channel for status check
  checkBackendStatus: () => ipcRenderer.invoke('check-backend-status'),

  // Theme persistence methods removed for v1.1.0
});
