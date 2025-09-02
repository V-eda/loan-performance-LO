import React from 'react';
import { Bell, Search, RefreshCw } from 'lucide-react';

const Header = () => {
  const [currentTime, setCurrentTime] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left side - Search */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search leads, clients, or insights..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-80"
            />
          </div>
        </div>

        {/* Right side - Actions and Info */}
        <div className="flex items-center space-x-4">
          {/* Last Updated */}
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <RefreshCw className="h-4 w-4" />
            <span>Updated: {formatTime(currentTime)}</span>
          </div>

          {/* Notifications */}
          <button className="relative p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
          </button>

          {/* Quick Stats */}
          <div className="hidden md:flex items-center space-x-6 pl-6 border-l border-gray-200">
            <div className="text-center">
              <div className="text-lg font-semibold text-primary-600">85%</div>
              <div className="text-xs text-gray-500">Pipeline Health</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-success-600">12</div>
              <div className="text-xs text-gray-500">This Month</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-warning-600">$2.1M</div>
              <div className="text-xs text-gray-500">Pipeline Value</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;