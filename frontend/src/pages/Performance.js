import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Calendar, Download } from 'lucide-react';
import { apiService } from '../services/api';
import { LineChart, BarChart, colors } from '../components/charts';

const Performance = () => {
  const [performanceData, setPerformanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  useEffect(() => {
    fetchPerformanceData();
  }, []);

  const fetchPerformanceData = async () => {
    try {
      setLoading(true);
      const response = await apiService.getPerformanceTrends();
      setPerformanceData(response.data);
    } catch (err) {
      console.error('Performance data error:', err);
      // Mock data fallback
      setPerformanceData({
        monthly_trends: [
          { month_name: 'January 2024', leads_generated: 42, leads_converted: 12, conversion_rate: 28.6, revenue: 864000 },
          { month_name: 'February 2024', leads_generated: 38, leads_converted: 11, conversion_rate: 28.9, revenue: 792000 },
        ],
        key_metrics: {
          avg_monthly_leads: 45,
          avg_conversion_rate: 28.5,
          avg_monthly_revenue: 875000,
          total_revenue_ytd: 5250000
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Generate chart data for performance analytics
  const generateChartsData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
    
    return {
      revenue: {
        labels: months,
        datasets: [{
          label: 'Revenue',
          data: [650000, 720000, 680000, 780000, 820000, 750000, 890000, 920000, 875000],
          backgroundColor: `${colors.success.main}80`,
          borderColor: colors.success.main,
          borderWidth: 2
        }]
      },
      conversion: {
        labels: months,
        datasets: [{
          label: 'Conversion Rate (%)',
          data: [25.2, 26.8, 24.5, 27.1, 28.3, 26.9, 29.2, 30.1, 28.5],
          borderColor: colors.primary.main,
          backgroundColor: `${colors.primary.main}20`,
          fill: true
        }]
      }
    };
  };

  const chartData = generateChartsData();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Performance Analytics</h1>
          <p className="text-gray-600">Track your sales trends and performance metrics</p>
        </div>
        <div className="flex space-x-3">
          <select 
            value={selectedPeriod} 
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
          </select>
          <button className="btn-secondary flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">YTD Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(performanceData?.key_metrics?.total_revenue_ytd || 5250000)}
              </p>
            </div>
            <BarChart3 className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Conversion Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {performanceData?.key_metrics?.avg_conversion_rate || 28.5}%
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Leads</p>
              <p className="text-2xl font-bold text-gray-900">
                {performanceData?.key_metrics?.avg_monthly_leads || 45}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Monthly Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(performanceData?.key_metrics?.avg_monthly_revenue || 875000)}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Real Interactive Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue Trends</h3>
          <BarChart 
            data={chartData.revenue} 
            height={300}
            color={colors.success.main}
          />
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversion Rate Performance</h3>
          <LineChart 
            data={chartData.conversion} 
            height={300}
            showFill={true}
            color={colors.primary.main}
          />
        </div>
      </div>

      {/* Performance Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Monthly Performance</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Period</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Leads</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Converted</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Conv. Rate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {(performanceData?.monthly_trends || []).map((month, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {month.month_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {month.leads_generated}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {month.leads_converted}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {month.conversion_rate}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(month.revenue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Performance;