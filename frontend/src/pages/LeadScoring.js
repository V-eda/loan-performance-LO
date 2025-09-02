import React, { useState, useEffect } from 'react';
import { 
  Target, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Phone, 
  Mail,
  DollarSign,
  Calendar,
  Filter,
  Download
} from 'lucide-react';
import { apiService } from '../services/api';

const LeadScoring = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterBy, setFilterBy] = useState('all');
  const [sortBy, setSortBy] = useState('score');

  useEffect(() => {
    fetchLeadScoring();
  }, []);

  const fetchLeadScoring = async () => {
    try {
      setLoading(true);
      const response = await apiService.getLeadScoring();
      setLeads(response.data || []);
    } catch (err) {
      setError('Failed to load lead scoring data');
      console.error('Lead scoring error:', err);
      
      // Fallback mock data
      setLeads([
        {
          id: 1,
          name: "Sarah Johnson",
          email: "sarah.johnson@email.com",
          phone: "(555) 123-4567",
          credit_score: 785,
          income: 125000,
          loan_amount: 450000,
          debt_to_income: 0.23,
          loan_type: "Conventional",
          stage: "Qualified",
          probability_score: 92.3,
          urgency: "High",
          days_since_contact: 2,
          created_date: "2024-01-15T10:30:00Z"
        },
        {
          id: 2,
          name: "Mike Chen",
          email: "mike.chen@email.com",
          phone: "(555) 234-5678",
          credit_score: 720,
          income: 95000,
          loan_amount: 380000,
          debt_to_income: 0.31,
          loan_type: "FHA",
          stage: "Application",
          probability_score: 89.1,
          urgency: "High",
          days_since_contact: 1,
          created_date: "2024-01-14T14:20:00Z"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency?.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredAndSortedLeads = leads
    .filter(lead => {
      if (filterBy === 'all') return true;
      if (filterBy === 'high') return lead.urgency === 'High';
      if (filterBy === 'medium') return lead.urgency === 'Medium';
      if (filterBy === 'low') return lead.urgency === 'Low';
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'score') return b.probability_score - a.probability_score;
      if (sortBy === 'date') return new Date(b.created_date) - new Date(a.created_date);
      if (sortBy === 'amount') return b.loan_amount - a.loan_amount;
      return 0;
    });

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
          <h1 className="text-2xl font-bold text-gray-900">AI Lead Scoring</h1>
          <p className="text-gray-600">Machine learning powered conversion probability analysis</p>
        </div>
        <div className="flex space-x-3">
          <button className="btn-secondary flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
          <button className="btn-primary">Add New Lead</button>
        </div>
      </div>

      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mr-3" />
            <div className="text-sm text-yellow-800">
              {error} - Showing demo data for preview
            </div>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-red-100 p-2 rounded-lg">
              <Target className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">High Priority</p>
              <p className="text-2xl font-bold text-gray-900">
                {leads.filter(l => l.urgency === 'High').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Score</p>
              <p className="text-2xl font-bold text-gray-900">
                {leads.length > 0 ? 
                  Math.round(leads.reduce((sum, lead) => sum + lead.probability_score, 0) / leads.length) 
                  : 0}%
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <DollarSign className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Pipeline Value</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(leads.reduce((sum, lead) => sum + lead.loan_amount, 0))}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 p-2 rounded-lg">
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Model Accuracy</p>
              <p className="text-2xl font-bold text-gray-900">85%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filter by:</span>
            </div>
            <select 
              value={filterBy} 
              onChange={(e) => setFilterBy(e.target.value)}
              className="text-sm border-gray-300 rounded-md"
            >
              <option value="all">All Leads</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
            
            <div className="border-l border-gray-300 pl-4">
              <span className="text-sm font-medium text-gray-700 mr-2">Sort by:</span>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm border-gray-300 rounded-md"
              >
                <option value="score">Conversion Score</option>
                <option value="date">Date Added</option>
                <option value="amount">Loan Amount</option>
              </select>
            </div>
          </div>
          
          <div className="text-sm text-gray-500">
            Showing {filteredAndSortedLeads.length} of {leads.length} leads
          </div>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Lead Intelligence</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lead Information
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  AI Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Loan Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAndSortedLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {lead.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                        <div className="text-sm text-gray-500">{lead.email}</div>
                        <div className="text-xs text-gray-400">
                          Added {formatDate(lead.created_date)}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(lead.probability_score)}`}>
                        {lead.probability_score.toFixed(1)}%
                      </div>
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getUrgencyColor(lead.urgency)}`}>
                        {lead.urgency}
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatCurrency(lead.loan_amount)}</div>
                    <div className="text-sm text-gray-500">{lead.loan_type}</div>
                    <div className="text-xs text-gray-400">
                      Credit: {lead.credit_score} | DTI: {(lead.debt_to_income * 100).toFixed(1)}%
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {lead.stage}
                    </span>
                    <div className="text-xs text-gray-400 mt-1">
                      Last contact: {lead.days_since_contact} days ago
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button className="text-blue-600 hover:text-blue-900 p-1 rounded">
                      <Phone className="h-4 w-4" />
                    </button>
                    <button className="text-blue-600 hover:text-blue-900 p-1 rounded">
                      <Mail className="h-4 w-4" />
                    </button>
                    <button className="text-gray-600 hover:text-gray-900 p-1 rounded">
                      <Calendar className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Model Info */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
        <div className="flex items-start space-x-4">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Target className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Model Performance</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Model Accuracy:</span>
                <span className="text-gray-600 ml-2">85.3%</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Last Training:</span>
                <span className="text-gray-600 ml-2">Jan 15, 2024</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Features Used:</span>
                <span className="text-gray-600 ml-2">Credit Score, Income, DTI, Loan Type, Contact Frequency</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadScoring;