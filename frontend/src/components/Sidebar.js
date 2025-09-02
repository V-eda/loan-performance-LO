import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  Target, 
  TrendingUp, 
  Brain, 
  Home,
  PieChart
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: Home,
      description: 'Overview & Key Metrics'
    },
    {
      name: 'Lead Scoring',
      path: '/lead-scoring',
      icon: Target,
      description: 'AI-Powered Lead Intelligence'
    },
    {
      name: 'Performance',
      path: '/performance',
      icon: BarChart3,
      description: 'Trends & Analytics'
    },
    {
      name: 'Forecasting',
      path: '/forecasting',
      icon: TrendingUp,
      description: 'Revenue Predictions'
    },
    {
      name: 'AI Insights',
      path: '/insights',
      icon: Brain,
      description: 'Smart Recommendations'
    }
  ];

  const isActive = (path) => {
    return location.pathname === path || (path === '/dashboard' && location.pathname === '/');
  };

  return (
    <div className="bg-white w-64 min-h-screen shadow-sm border-r border-gray-200">
      {/* Logo / Brand */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="bg-primary-600 rounded-lg p-2">
            <PieChart className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">LoanSense AI</h1>
            <p className="text-sm text-gray-500">Performance Intelligence</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-8">
        <div className="px-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className={`
                      group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors
                      ${active 
                        ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-700' 
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }
                    `}
                  >
                    <Icon 
                      className={`
                        mr-3 h-5 w-5 transition-colors
                        ${active ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-500'}
                      `}
                    />
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className={`text-xs ${active ? 'text-primary-600' : 'text-gray-500'}`}>
                        {item.description}
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* Bottom Section */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-3">
          <div className="bg-gray-300 rounded-full p-2">
            <div className="h-6 w-6 bg-gray-400 rounded-full"></div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Demo User</p>
            <p className="text-xs text-gray-500">Loan Officer</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;