import React, { useEffect, useState } from 'react';

export const NetworkStatus: React.FC = () => {
  const [online, setOnline] = useState<boolean>(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="flex items-center" title={online ? 'Online' : 'Offline'}>
      <span className={`inline-block w-2 h-2 rounded-full mr-1.5 ${online ? 'bg-green-500' : 'bg-red-500'}`}></span>
      <span className="text-xs text-gray-600 hidden sm:inline">{online ? 'Online' : 'Offline'}</span>
    </div>
  );
};
