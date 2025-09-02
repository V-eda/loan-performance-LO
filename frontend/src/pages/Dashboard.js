import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Target, 
  Users, 
  Clock,
  AlertCircle,
  CheckCircle,
  ArrowUpRight
} from 'lucide-react';
import { apiService } from '../services/api';
import { LineChart, BarChart, DoughnutChart, colors } from '../components/charts';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await apiService.getDashboardOverview();
      setDashboardData(response.data);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard error:', err);
      
      // Fallback mock data for demo
      setDashboardData({
        total_leads: 150,
        active_pipeline: 45,
        closed_this_month: 12,
        revenue_this_month: 875000,
        conversion_rate: 28.5,
        avg_deal_size: 72916,
        pipeline_value: 3250000,
        goal_progress: 82.3,
        performance_trend: "up"
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Generate chart data
  const generatePerformanceTrendData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const revenueData = [650000, 720000, 680000, 780000, 820000, 750000, 890000, 920000, 875000, 950000, 980000, 1020000];
    const conversionData = [25.2, 26.8, 24.5, 27.1, 28.3, 26.9, 29.2, 30.1, 28.5, 31.2, 29.8, 32.1];
    
    return {
      revenue: {
        labels: months.slice(0, 9), // Last 9 months
        datasets: [{
          label: 'Monthly Revenue',
          data: revenueData.slice(0, 9),
          borderColor: colors.primary.main,
          backgroundColor: `${colors.primary.main}20`,
          fill: true
        }]
      },
      conversion: {
        labels: months.slice(0, 9),
        datasets: [{
          label: 'Conversion Rate (%)',
          data: conversionData.slice(0, 9),
          borderColor: colors.success.main,
          backgroundColor: `${colors.success.main}20`,
          fill: true
        }]
      }
    };
  };

  const generatePipelineBreakdownData = () => {
    return {
      labels: ['New Leads', 'Qualified', 'Application', 'Processing', 'Underwriting', 'Clear to Close'],
      datasets: [{
        label: 'Pipeline Stages',
        data: [28, 22, 18, 15, 12, 8],
        backgroundColor: [
          colors.primary.main,
          colors.success.main,
          colors.warning.main,
          '#FF6B6B',
          colors.purple.main,
          '#4ECDC4'
        ]
      }]
    };
  };

  const chartData = generatePerformanceTrendData();
  const pipelineData = generatePipelineBreakdownData();

  const StatCard = ({ title, value, change, icon: Icon, trend, description }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          {change && (
            <div className={`flex items-center mt-2 text-sm ${
              trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {trend === 'up' ? (
                <TrendingUp className="h-4 w-4 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 mr-1" />
              )}
              <span>{change}</span>
            </div>
          )}
          {description && (
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          )}
        </div>
        <div className={`p-3 rounded-full ${
          trend === 'up' ? 'bg-green-100' : 'bg-blue-100'
        }`}>
          <Icon className={`h-6 w-6 ${
            trend === 'up' ? 'text-green-600' : 'text-blue-600'
          }`} />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Performance Dashboard</h1>
          <p className="text-gray-600">AI-powered insights for your loan pipeline</p>
        </div>
        <div className="flex space-x-3">
          <button className="btn-secondary">Export Report</button>
          <button className="btn-primary">Add New Lead</button>
        </div>
      </div>

      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-yellow-600 mr-3" />
            <div className="text-sm text-yellow-800">
              {error} - Showing demo data for preview
            </div>
          </div>
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(dashboardData?.revenue_this_month || 875000)}
          change="+12.5%"
          trend="up"
          icon={DollarSign}
          description="This month"
        />
        <StatCard
          title="Conversion Rate"
          value={`${dashboardData?.conversion_rate || 28.5}%`}
          change="+2.1%"
          trend="up"
          icon={Target}
          description="Lead to close ratio"
        />
        <StatCard
          title="Active Pipeline"
          value={dashboardData?.active_pipeline || 45}
          change="+8 leads"
          trend="up"
          icon={Users}
          description="Currently in process"
        />
        <StatCard
          title="Pipeline Value"
          value={formatCurrency(dashboardData?.pipeline_value || 3250000)}
          change="+15.2%"
          trend="up"
          icon={TrendingUp}
          description="Total potential revenue"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Trends Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Revenue Performance Trends</h3>
            <div className="flex space-x-2">
              <button className="text-sm text-gray-500 hover:text-gray-700">7D</button>
              <button className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded">30D</button>
              <button className="text-sm text-gray-500 hover:text-gray-700">90D</button>
            </div>
          </div>
          <LineChart 
            data={chartData.revenue} 
            height={280}
            showFill={true}
            color={colors.primary.main}
          />
        </div>

        {/* Pipeline Breakdown */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Pipeline Breakdown</h3>
            <ArrowUpRight className="h-5 w-5 text-gray-400" />
          </div>
          <DoughnutChart 
            data={pipelineData} 
            height={280}
            showLabels={true}
          />
        </div>
      </div>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Goal Progress */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Goal</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm">
                <span>Revenue Target</span>
                <span>{dashboardData?.goal_progress || 82.3}%</span>
              </div>
              <div className="progress-bar mt-2">
                <div 
                  className="progress-fill bg-primary-600" 
                  style={{ width: `${dashboardData?.goal_progress || 82.3}%` }}
                ></div>
              </div>
            </div>
            <div className="pt-2">
              <p className="text-sm text-gray-600">
                {formatCurrency(875000)} of {formatCurrency(1065000)} target
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {formatCurrency(190000)} remaining to reach goal
              </p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {[
              { action: 'Lead converted', client: 'Sarah Johnson', time: '2 hours ago', status: 'success' },
              { action: 'New application', client: 'Mike Chen', time: '4 hours ago', status: 'info' },
              { action: 'Document received', client: 'Lisa Brown', time: '6 hours ago', status: 'info' },
              { action: 'Lead scored high', client: 'David Wilson', time: '8 hours ago', status: 'warning' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-3">
                {activity.status === 'success' ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <Clock className="h-4 w-4 text-gray-400" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.client} • {activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="font-medium text-sm text-gray-900">Add New Lead</div>
              <div className="text-xs text-gray-500">Start tracking a new prospect</div>
            </button>
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="font-medium text-sm text-gray-900">Update Pipeline</div>
              <div className="text-xs text-gray-500">Move leads to next stage</div>
            </button>
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="font-medium text-sm text-gray-900">Generate Report</div>
              <div className="text-xs text-gray-500">Export monthly summary</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;