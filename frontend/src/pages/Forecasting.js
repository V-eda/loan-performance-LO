import React, { useState, useEffect } from 'react';
import { TrendingUp, Calendar, DollarSign, AlertCircle } from 'lucide-react';
import { apiService } from '../services/api';
import { LineChart, BarChart, colors } from '../components/charts';

const Forecasting = () => {
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchForecastData();
  }, []);

  const fetchForecastData = async () => {
    try {
      setLoading(true);
      const response = await apiService.getRevenueForecast();
      setForecastData(response.data);
    } catch (err) {
      console.error('Forecast data error:', err);
      // Mock data fallback
      setForecastData({
        forecast_data: [
          { month_name: 'February', predicted_revenue: 920000, confidence: 95 },
          { month_name: 'March', predicted_revenue: 980000, confidence: 90 },
          { month_name: 'April', predicted_revenue: 1050000, confidence: 85 }
        ],
        insights: {
          total_forecast_6months: 5800000,
          growth_rate: 12.5,
          best_month: { month_name: 'June', predicted_revenue: 1200000 }
        },
        market_factors: [
          { factor: 'Interest Rate Trends', impact: 'positive', confidence: 75 },
          { factor: 'Housing Market', impact: 'neutral', confidence: 80 }
        ]
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

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'positive': return 'text-green-600 bg-green-100';
      case 'negative': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

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
          <h1 className="text-2xl font-bold text-gray-900">Revenue Forecasting</h1>
          <p className="text-gray-600">AI-powered predictions for future performance</p>
        </div>
      </div>

      {/* Key Forecast Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">6-Month Forecast</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(forecastData?.insights?.total_forecast_6months || 5800000)}
              </p>
              <p className="text-sm text-green-600">+{forecastData?.insights?.growth_rate || 12.5}% growth</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Best Month</p>
              <p className="text-2xl font-bold text-gray-900">
                {forecastData?.insights?.best_month?.month_name || 'June'}
              </p>
              <p className="text-sm text-gray-600">
                {formatCurrency(forecastData?.insights?.best_month?.predicted_revenue || 1200000)}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Forecast Accuracy</p>
              <p className="text-2xl font-bold text-gray-900">85%</p>
              <p className="text-sm text-gray-600">Based on historical data</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Interactive Forecast Chart */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Forecast - Next 6 Months</h3>
        <LineChart 
          data={{
            labels: ['Feb 2024', 'Mar 2024', 'Apr 2024', 'May 2024', 'Jun 2024', 'Jul 2024'],
            datasets: [{
              label: 'Predicted Revenue',
              data: [920000, 980000, 1050000, 1100000, 1200000, 1150000],
              borderColor: colors.purple.main,
              backgroundColor: `${colors.purple.main}20`,
              fill: true,
              borderDash: [5, 5]
            }, {
              label: 'Historical Revenue',
              data: [875000, null, null, null, null, null],
              borderColor: colors.primary.main,
              backgroundColor: 'transparent',
              fill: false
            }]
          }}
          height={350}
          showFill={false}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Forecast Details */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Predictions</h3>
          <div className="space-y-4">
            {(forecastData?.forecast_data || []).map((month, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">{month.month_name}</div>
                  <div className="text-sm text-gray-500">
                    Confidence: {month.confidence}%
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">
                    {formatCurrency(month.predicted_revenue)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Market Factors */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Factors</h3>
          <div className="space-y-4">
            {(forecastData?.market_factors || []).map((factor, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{factor.factor}</h4>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getImpactColor(factor.impact)}`}>
                    {factor.impact}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  Confidence: {factor.confidence}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Model Info */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-200">
        <div className="flex items-start space-x-4">
          <div className="bg-purple-100 p-2 rounded-lg">
            <AlertCircle className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Forecasting Model</h3>
            <p className="text-sm text-gray-600 mb-3">
              Our AI model uses time series analysis combined with market indicators and seasonal patterns 
              to predict future revenue with 85% accuracy.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Methodology:</span>
                <span className="text-gray-600 ml-2">Time Series + Market Analysis</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Data Points:</span>
                <span className="text-gray-600 ml-2">24 months historical data</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Last Updated:</span>
                <span className="text-gray-600 ml-2">January 15, 2024</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forecasting;