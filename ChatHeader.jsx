import React, { useEffect, useState } from 'react';
import { Menu, Info, Database, AlertCircle } from 'lucide-react';
import { getHealthcareMeta } from '../utils/healthcareDataset';

export default function ChatHeader({ onOpenSidebar }) {
  const [dbStatus, setDbStatus] = useState({ loaded: false, error: null, rowCount: 0 });

  useEffect(() => {
    // Check database status every 2 seconds until loaded
    const checkStatus = () => {
      const meta = getHealthcareMeta();
      setDbStatus({
        loaded: meta.loaded,
        error: meta.error,
        rowCount: meta.rowCount
      });
    };

    checkStatus();
    const interval = setInterval(checkStatus, 2000);
    
    // Stop checking once loaded
    if (dbStatus.loaded) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [dbStatus.loaded]);

  return (
    <header className="bg-white border-b border-gray-200 p-4 flex items-center justify-between shadow-sm z-10">
      <div className="flex items-center space-x-3">
        <button onClick={onOpenSidebar} className="md:hidden text-gray-600">
          <Menu className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-gray-800">Public Health Assistant</h1>
          <p className="text-xs text-green-600 flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></span>
            Online
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        {/* Database Status Indicator */}
        <div className={`hidden md:flex items-center text-xs px-2 py-1 rounded-full border ${
          dbStatus.loaded 
            ? 'bg-green-50 text-green-700 border-green-200' 
            : dbStatus.error 
            ? 'bg-red-50 text-red-700 border-red-200'
            : 'bg-yellow-50 text-yellow-700 border-yellow-200'
        }`}>
          {dbStatus.loaded ? (
            <>
              <Database className="w-3 h-3 mr-1" />
              <span>DB: {dbStatus.rowCount} rows</span>
            </>
          ) : dbStatus.error ? (
            <>
              <AlertCircle className="w-3 h-3 mr-1" />
              <span>DB: Error</span>
            </>
          ) : (
            <>
              <Database className="w-3 h-3 mr-1 animate-pulse" />
              <span>DB: Loading...</span>
            </>
          )}
        </div>
        <div className="hidden sm:flex items-center text-xs text-gray-500 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
          <Info className="w-3 h-3 mr-1" />
          AI Bot - Not a Doctor
        </div>
      </div>
    </header>
  );
}