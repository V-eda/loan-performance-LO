import numpy as np
import pandas as pd
from datetime import datetime, timedelta
import random

class PerformanceAnalytics:
    def __init__(self):
        self.base_conversion_rate = 0.285
        self.base_avg_deal_size = 72000
    
    def generate_trends_data(self):
        """Generate performance trends data"""
        # Generate last 12 months of data
        months_data = []
        base_date = datetime.now() - timedelta(days=365)
        
        for i in range(12):
            month_date = base_date + timedelta(days=i*30)
            
            # Add seasonal trends
            seasonal_factor = 1 + 0.15 * np.sin(2 * np.pi * i / 12)  # Peak in summer
            
            # Add growth trend
            growth_factor = 1 + (i * 0.02)  # 2% monthly growth
            
            # Add some randomness
            random_factor = np.random.uniform(0.9, 1.1)
            
            leads_generated = int(45 * seasonal_factor * random_factor)
            conversion_rate = self.base_conversion_rate * growth_factor * np.random.uniform(0.9, 1.1)
            leads_converted = int(leads_generated * conversion_rate)
            avg_deal_size = self.base_avg_deal_size * growth_factor * np.random.uniform(0.95, 1.05)
            revenue = leads_converted * avg_deal_size
            
            months_data.append({
                'month': month_date.strftime('%Y-%m'),
                'month_name': month_date.strftime('%B %Y'),
                'leads_generated': leads_generated,
                'leads_converted': leads_converted,
                'conversion_rate': round(conversion_rate * 100, 1),
                'revenue': int(revenue),
                'avg_deal_size': int(avg_deal_size),
                'pipeline_value': int(leads_generated * avg_deal_size * 0.6)  # 60% of potential
            })
        
        # Weekly data for last 8 weeks
        weeks_data = []
        base_date = datetime.now() - timedelta(days=56)
        
        for i in range(8):
            week_date = base_date + timedelta(days=i*7)
            
            # More variation in weekly data
            random_factor = np.random.uniform(0.7, 1.3)
            
            leads_generated = int(12 * random_factor)
            conversion_rate = self.base_conversion_rate * np.random.uniform(0.8, 1.2)
            leads_converted = int(leads_generated * conversion_rate)
            avg_deal_size = self.base_avg_deal_size * np.random.uniform(0.9, 1.1)
            revenue = leads_converted * avg_deal_size
            
            weeks_data.append({
                'week': f"Week {i+1}",
                'week_start': week_date.strftime('%Y-%m-%d'),
                'leads_generated': leads_generated,
                'leads_converted': leads_converted,
                'conversion_rate': round(conversion_rate * 100, 1),
                'revenue': int(revenue),
                'avg_deal_size': int(avg_deal_size)
            })
        
        # Performance metrics comparison
        current_month = months_data[-1]
        previous_month = months_data[-2]
        
        performance_comparison = {
            'leads_generated': {
                'current': current_month['leads_generated'],
                'previous': previous_month['leads_generated'],
                'change': round(((current_month['leads_generated'] - previous_month['leads_generated']) / previous_month['leads_generated']) * 100, 1)
            },
            'conversion_rate': {
                'current': current_month['conversion_rate'],
                'previous': previous_month['conversion_rate'],
                'change': round(current_month['conversion_rate'] - previous_month['conversion_rate'], 1)
            },
            'revenue': {
                'current': current_month['revenue'],
                'previous': previous_month['revenue'],
                'change': round(((current_month['revenue'] - previous_month['revenue']) / previous_month['revenue']) * 100, 1)
            },
            'avg_deal_size': {
                'current': current_month['avg_deal_size'],
                'previous': previous_month['avg_deal_size'],
                'change': round(((current_month['avg_deal_size'] - previous_month['avg_deal_size']) / previous_month['avg_deal_size']) * 100, 1)
            }
        }
        
        return {
            'monthly_trends': months_data,
            'weekly_trends': weeks_data,
            'performance_comparison': performance_comparison,
            'key_metrics': {
                'avg_monthly_leads': int(np.mean([m['leads_generated'] for m in months_data[-6:]])),
                'avg_conversion_rate': round(np.mean([m['conversion_rate'] for m in months_data[-6:]]), 1),
                'avg_monthly_revenue': int(np.mean([m['revenue'] for m in months_data[-6:]])),
                'total_revenue_ytd': sum([m['revenue'] for m in months_data]),
                'total_deals_ytd': sum([m['leads_converted'] for m in months_data])
            }
        }
    
    def generate_revenue_forecast(self):
        """Generate AI-powered revenue forecasting"""
        # Historical data for last 6 months
        historical_data = []
        base_date = datetime.now() - timedelta(days=180)
        
        for i in range(6):
            month_date = base_date + timedelta(days=i*30)
            revenue = int(self.base_avg_deal_size * random.randint(8, 15) * (1 + i * 0.03))  # Growth trend
            
            historical_data.append({
                'month': month_date.strftime('%Y-%m'),
                'month_name': month_date.strftime('%B'),
                'actual_revenue': revenue,
                'type': 'actual'
            })
        
        # Forecast for next 6 months
        forecast_data = []
        current_trend = 1.05  # 5% growth rate
        seasonal_factors = [1.0, 1.1, 1.15, 1.2, 1.1, 1.05]  # Spring/Summer boost
        
        last_revenue = historical_data[-1]['actual_revenue']
        
        for i in range(6):
            month_date = datetime.now() + timedelta(days=i*30)
            
            # Calculate forecast with trend and seasonality
            trend_factor = current_trend ** (i + 1)
            seasonal_factor = seasonal_factors[i]
            confidence_factor = max(0.8, 1 - i * 0.1)  # Decreasing confidence over time
            
            predicted_revenue = int(last_revenue * trend_factor * seasonal_factor)
            
            # Add confidence intervals
            confidence_range = int(predicted_revenue * (1 - confidence_factor) * 0.5)
            lower_bound = predicted_revenue - confidence_range
            upper_bound = predicted_revenue + confidence_range
            
            forecast_data.append({
                'month': month_date.strftime('%Y-%m'),
                'month_name': month_date.strftime('%B'),
                'predicted_revenue': predicted_revenue,
                'lower_bound': lower_bound,
                'upper_bound': upper_bound,
                'confidence': round(confidence_factor * 100),
                'type': 'forecast'
            })
        
        # Market factors affecting forecast
        market_factors = [
            {
                'factor': 'Interest Rate Trends',
                'impact': 'positive',
                'description': 'Expected rate stabilization may increase refinance demand',
                'confidence': 75
            },
            {
                'factor': 'Housing Market',
                'impact': 'neutral',
                'description': 'Stable home prices with moderate inventory levels',
                'confidence': 80
            },
            {
                'factor': 'Economic Indicators',
                'impact': 'positive',
                'description': 'Strong employment and wage growth supporting loan demand',
                'confidence': 85
            },
            {
                'factor': 'Seasonal Patterns',
                'impact': 'positive',
                'description': 'Spring/Summer buying season approaching',
                'confidence': 90
            }
        ]
        
        # Key forecast insights
        forecast_insights = {
            'total_forecast_6months': sum([f['predicted_revenue'] for f in forecast_data]),
            'avg_monthly_forecast': int(np.mean([f['predicted_revenue'] for f in forecast_data])),
            'growth_rate': round(((forecast_data[-1]['predicted_revenue'] / historical_data[-1]['actual_revenue']) - 1) * 100, 1),
            'best_month': max(forecast_data, key=lambda x: x['predicted_revenue']),
            'risk_factors': ['Interest rate volatility', 'Regulatory changes', 'Market competition'],
            'opportunities': ['Refinance wave potential', 'First-time buyer programs', 'Investment property demand']
        }
        
        return {
            'historical_data': historical_data,
            'forecast_data': forecast_data,
            'market_factors': market_factors,
            'insights': forecast_insights,
            'model_info': {
                'accuracy': 85,
                'last_updated': datetime.now().isoformat(),
                'methodology': 'Time series analysis with seasonal adjustment and market factors'
            }
        }
    
    def calculate_performance_score(self, metrics):
        """Calculate overall performance score based on key metrics"""
        # Weighted scoring system
        weights = {
            'conversion_rate': 0.3,
            'revenue_growth': 0.25,
            'pipeline_health': 0.2,
            'lead_quality': 0.15,
            'activity_level': 0.1
        }
        
        # Normalize metrics and calculate score
        scores = {}
        
        # Conversion rate score (baseline 20%, excellent 35%+)
        conversion_rate = metrics.get('conversion_rate', 28.5)
        scores['conversion_rate'] = min(100, max(0, (conversion_rate - 15) / 0.25))
        
        # Revenue growth score (baseline 0%, excellent 20%+)
        revenue_growth = metrics.get('revenue_growth', 8.2)
        scores['revenue_growth'] = min(100, max(0, revenue_growth * 5))
        
        # Pipeline health score (based on pipeline value vs. target)
        pipeline_ratio = metrics.get('pipeline_ratio', 1.2)
        scores['pipeline_health'] = min(100, pipeline_ratio * 75)
        
        # Lead quality score (based on average lead score)
        avg_lead_score = metrics.get('avg_lead_score', 72)
        scores['lead_quality'] = min(100, max(0, (avg_lead_score - 40) / 0.6))
        
        # Activity level score (based on contacts per lead)
        activity_level = metrics.get('activity_level', 4.5)
        scores['activity_level'] = min(100, activity_level * 20)
        
        # Calculate weighted overall score
        overall_score = sum(scores[metric] * weights[metric] for metric in scores)
        
        return {
            'overall_score': round(overall_score, 1),
            'component_scores': {k: round(v, 1) for k, v in scores.items()},
            'performance_level': self._get_performance_level(overall_score),
            'benchmark_comparison': {
                'industry_average': 72.5,
                'top_10_percent': 88.0,
                'company_average': 78.2
            }
        }
    
    def _get_performance_level(self, score):
        """Determine performance level based on score"""
        if score >= 90:
            return 'Exceptional'
        elif score >= 80:
            return 'Excellent'
        elif score >= 70:
            return 'Good'
        elif score >= 60:
            return 'Average'
        else:
            return 'Needs Improvement'