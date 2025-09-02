import React, { useState, useEffect } from 'react';
import { 
  Lightbulb, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  DollarSign,
  Target,
  ArrowRight
} from 'lucide-react';
import { apiService } from '../services/api';

const Insights = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAIRecommendations();
      setRecommendations(response.data || []);
    } catch (err) {
      console.error('Insights error:', err);
      // Mock data fallback
      setRecommendations([
        {
          id: 1,
          type: 'conversion',
          title: 'Focus on High-Score Leads',
          description: 'Prioritize 8 leads with 85%+ conversion probability this week',
          impact: 'high',
          estimated_revenue: 180000,
          action_items: [
            'Schedule follow-up calls with Sarah Johnson (92% score)',
            'Send updated rate quote to Mike Chen (89% score)',
            'Schedule property viewing with Lisa Brown (87% score)'
          ]
        },
        {
          id: 2,
          type: 'pipeline',
          title: 'Optimize Pipeline Flow',
          description: 'Reduce time in Document Review stage by 2.3 days',
          impact: 'medium',
          estimated_revenue: 95000,
          action_items: [
            'Create document checklist template',
            'Set up automated reminder system',
            'Partner with processing team for faster turnaround'
          ]
        },
        {
          id: 3,
          type: 'market',
          title: 'Capitalize on Rate Drop',
          description: 'Reach out to previous prospects - rates dropped 0.25%',
          impact: 'high',
          estimated_revenue: 240000,
          action_items: [
            'Send rate update email to 23 warm prospects',
            'Schedule refinance consultations',
            'Update marketing materials with new rates'
          ]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'conversion': return Target;
      case 'pipeline': return TrendingUp;
      case 'market': return DollarSign;
      default: return Lightbulb;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
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
          <h1 className="text-2xl font-bold text-gray-900">AI Insights & Recommendations</h1>
          <p className="text-gray-600">Personalized suggestions to optimize your performance</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Clock className="h-4 w-4" />
          <span>Last updated: Just now</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Lightbulb className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Active Recommendations</p>
              <p className="text-2xl font-bold text-gray-900">{recommendations.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Potential Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(recommendations.reduce((sum, rec) => sum + rec.estimated_revenue, 0))}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-red-100 p-2 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">High Priority</p>
              <p className="text-2xl font-bold text-gray-900">
                {recommendations.filter(r => r.impact === 'high').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="space-y-6">
        {recommendations.map((recommendation) => {
          const IconComponent = getTypeIcon(recommendation.type);
          
          return (
            <div key={recommendation.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <IconComponent className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {recommendation.title}
                        </h3>
                        <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getImpactColor(recommendation.impact)}`}>
                          {recommendation.impact.toUpperCase()} IMPACT
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3">
                        {recommendation.description}
                      </p>
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-1">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          <span className="font-medium text-green-600">
                            {formatCurrency(recommendation.estimated_revenue)} potential
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <CheckCircle className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-500">
                            {recommendation.action_items.length} action items
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <button className="btn-primary flex items-center space-x-2">
                    <span>Take Action</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>

                {/* Action Items */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Recommended Actions:</h4>
                  <div className="space-y-2">
                    {recommendation.action_items.map((item, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                          <span className="text-xs font-medium text-blue-600">{index + 1}</span>
                        </div>
                        <span className="text-sm text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Assistant Info */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 border border-indigo-200">
        <div className="flex items-start space-x-4">
          <div className="bg-indigo-100 p-2 rounded-lg">
            <Lightbulb className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Recommendation Engine</h3>
            <p className="text-sm text-gray-600 mb-3">
              Our AI analyzes your performance data, market trends, and best practices to provide 
              personalized recommendations that can increase your conversion rates and revenue.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Analysis Frequency:</span>
                <span className="text-gray-600 ml-2">Real-time updates</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Success Rate:</span>
                <span className="text-gray-600 ml-2">78% of recommendations followed show improvement</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Insights;