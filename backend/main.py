from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import json
from models.lead_scoring import LeadScoringModel
from models.performance_analytics import PerformanceAnalytics
from database.db_manager import DatabaseManager

app = FastAPI(
    title="Loan Officer Performance Intelligence API",
    description="AI-powered analytics and insights for loan officers",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize components
db_manager = DatabaseManager()
lead_scorer = LeadScoringModel()
performance_analytics = PerformanceAnalytics()

# Pydantic models
class Lead(BaseModel):
    id: Optional[int] = None
    name: str
    email: str
    phone: str
    loan_amount: float
    credit_score: int
    income: float
    debt_to_income: float
    loan_type: str
    stage: str
    created_date: datetime
    last_contact: datetime
    probability_score: Optional[float] = None

class Performance(BaseModel):
    loan_officer_id: int
    period: str
    leads_generated: int
    leads_converted: int
    revenue_generated: float
    avg_deal_size: float
    conversion_rate: float

@app.get("/")
async def root():
    return {
        "message": "Loan Officer Performance Intelligence API",
        "status": "active",
        "version": "1.0.0"
    }

@app.get("/api/dashboard/overview")
async def get_dashboard_overview():
    """Get main dashboard overview metrics"""
    try:
        # Generate sample data for demo
        overview_data = {
            "total_leads": 150,
            "active_pipeline": 45,
            "closed_this_month": 12,
            "revenue_this_month": 875000,
            "conversion_rate": 28.5,
            "avg_deal_size": 72916,
            "pipeline_value": 3250000,
            "goal_progress": 82.3,
            "performance_trend": "up",
            "last_updated": datetime.now().isoformat()
        }
        
        return {"success": True, "data": overview_data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/leads/scoring")
async def get_lead_scoring():
    """Get AI-powered lead scoring predictions"""
    try:
        # Generate sample lead scoring data
        leads_data = lead_scorer.generate_sample_leads(20)
        
        return {
            "success": True,
            "data": leads_data,
            "model_info": {
                "accuracy": 0.85,
                "last_trained": "2024-01-15",
                "features_used": ["credit_score", "income", "debt_to_income", "loan_type", "contact_frequency"]
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/performance/trends")
async def get_performance_trends():
    """Get performance trends and analytics"""
    try:
        trends_data = performance_analytics.generate_trends_data()
        
        return {"success": True, "data": trends_data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/forecasting/revenue")
async def get_revenue_forecast():
    """Get AI-powered revenue forecasting"""
    try:
        forecast_data = performance_analytics.generate_revenue_forecast()
        
        return {"success": True, "data": forecast_data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/insights/recommendations")
async def get_ai_recommendations():
    """Get AI-generated performance recommendations"""
    try:
        recommendations = [
            {
                "id": 1,
                "type": "conversion",
                "title": "Focus on High-Score Leads",
                "description": "Prioritize 8 leads with 85%+ conversion probability this week",
                "impact": "high",
                "estimated_revenue": 180000,
                "action_items": [
                    "Schedule follow-up calls with Sarah Johnson (92% score)",
                    "Send updated rate quote to Mike Chen (89% score)",
                    "Schedule property viewing with Lisa Brown (87% score)"
                ]
            },
            {
                "id": 2,
                "type": "pipeline",
                "title": "Optimize Pipeline Flow",
                "description": "Reduce time in 'Document Review' stage by 2.3 days",
                "impact": "medium",
                "estimated_revenue": 95000,
                "action_items": [
                    "Create document checklist template",
                    "Set up automated reminder system",
                    "Partner with processing team for faster turnaround"
                ]
            },
            {
                "id": 3,
                "type": "market",
                "title": "Capitalize on Rate Drop",
                "description": "Reach out to previous prospects - rates dropped 0.25%",
                "impact": "high",
                "estimated_revenue": 240000,
                "action_items": [
                    "Send rate update email to 23 warm prospects",
                    "Schedule refinance consultations",
                    "Update marketing materials with new rates"
                ]
            }
        ]
        
        return {"success": True, "data": recommendations}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/leads")
async def create_lead(lead: Lead):
    """Create a new lead"""
    try:
        # Score the lead using AI model
        lead_score = lead_scorer.predict_conversion_probability(lead.dict())
        lead.probability_score = lead_score
        
        # In a real app, save to database
        # lead_id = db_manager.create_lead(lead)
        
        return {
            "success": True,
            "message": "Lead created successfully",
            "data": lead,
            "lead_score": lead_score
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/pipeline/stages")
async def get_pipeline_stages():
    """Get pipeline stage breakdown"""
    try:
        pipeline_data = {
            "stages": [
                {"name": "New Lead", "count": 28, "value": 2100000, "avg_days": 2},
                {"name": "Qualified", "count": 22, "value": 1650000, "avg_days": 5},
                {"name": "Application", "count": 18, "value": 1350000, "avg_days": 7},
                {"name": "Processing", "count": 15, "value": 1125000, "avg_days": 12},
                {"name": "Underwriting", "count": 12, "value": 900000, "avg_days": 8},
                {"name": "Clear to Close", "count": 8, "value": 600000, "avg_days": 3},
                {"name": "Closed", "count": 5, "value": 375000, "avg_days": 1}
            ],
            "conversion_rates": {
                "lead_to_qualified": 78.6,
                "qualified_to_application": 81.8,
                "application_to_processing": 83.3,
                "processing_to_underwriting": 80.0,
                "underwriting_to_close": 66.7,
                "overall_conversion": 28.5
            },
            "bottlenecks": ["Processing", "Underwriting"],
            "total_pipeline_value": 2100000
        }
        
        return {"success": True, "data": pipeline_data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)