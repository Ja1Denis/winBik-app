const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Generičke send metode
  send: (channel, data) => {
    const validChannels = [
      'app:minimize', 
      'app:maximize', 
      'app:close',
      'database:query', 
      'file:save', 
      'file:open'
    ];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },

  // Generičke invoke metode (za povratne vrijednosti)
  invoke: async (channel, data) => {
    const validChannels = [
      'database:fetch', 
      'file:read', 
      'system:info'
    ];
    if (validChannels.includes(channel)) {
      return await ipcRenderer.invoke(channel, data);
    }
  },

  // Metode za praćenje eventos
  on: (channel, callback) => {
    const validChannels = [
      'app:status', 
      'database:update', 
      'error:occurred'
    ];
    if (validChannels.includes(channel)) {
      const subscription = (event, ...args) => callback(...args);
      ipcRenderer.on(channel, subscription);
      return () => ipcRenderer.removeListener(channel, subscription);
    }
  },

  // Metoda za uklanjanje listenera
  removeListener: (channel, callback) => {
    ipcRenderer.removeListener(channel, callback);
  }
});
