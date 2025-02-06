import { useState, useEffect } from 'react';

export function useElectron() {
  const [isElectron, setIsElectron] = useState(false);

  useEffect(() => {
    setIsElectron(window.electronAPI !== undefined);
  }, []);

  const sendMessage = (channel, data) => {
    if (isElectron && window.electronAPI) {
      window.electronAPI.send(channel, data);
    }
  };

  const invokeMessage = async (channel, data) => {
    if (isElectron && window.electronAPI) {
      return await window.electronAPI.invoke(channel, data);
    }
    return null;
  };

  const onMessage = (channel, callback) => {
    if (isElectron && window.electronAPI) {
      return window.electronAPI.on(channel, callback);
    }
  };

  return {
    isElectron,
    sendMessage,
    invokeMessage,
    onMessage
  };
}
