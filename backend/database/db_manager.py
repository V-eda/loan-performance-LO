import sqlite3
import json
from datetime import datetime
from typing import List, Dict, Optional

class DatabaseManager:
    def __init__(self, db_path="loan_performance.db"):
        self.db_path = db_path
        self.init_database()
    
    def init_database(self):
        """Initialize the database with required tables"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Create leads table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS leads (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                phone TEXT,
                loan_amount REAL,
                credit_score INTEGER,
                income REAL,
                debt_to_income REAL,
                loan_type TEXT,
                stage TEXT,
                probability_score REAL,
                created_date TEXT,
                last_contact TEXT,
                converted BOOLEAN DEFAULT FALSE,
                conversion_date TEXT,
                loan_officer_id INTEGER DEFAULT 1
            )
        ''')
        
        # Create performance_metrics table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS performance_metrics (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                loan_officer_id INTEGER,
                period TEXT,
                leads_generated INTEGER,
                leads_converted INTEGER,
                revenue_generated REAL,
                avg_deal_size REAL,
                conversion_rate REAL,
                created_date TEXT
            )
        ''')
        
        # Create loan_officers table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS loan_officers (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                phone TEXT,
                territory TEXT,
                hire_date TEXT,
                active BOOLEAN DEFAULT TRUE
            )
        ''')
        
        conn.commit()
        conn.close()
        
        # Insert sample loan officer if none exists
        self.ensure_sample_data()
    
    def ensure_sample_data(self):
        """Ensure we have at least one loan officer for demo purposes"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('SELECT COUNT(*) FROM loan_officers')
        count = cursor.fetchone()[0]
        
        if count == 0:
            cursor.execute('''
                INSERT INTO loan_officers (name, email, phone, territory, hire_date, active)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (
                'Demo Loan Officer',
                'demo@loansense.ai',
                '(555) 123-4567',
                'Metro Area',
                datetime.now().isoformat(),
                True
            ))
            conn.commit()
        
        conn.close()
    
    def create_lead(self, lead_data: Dict) -> int:
        """Create a new lead and return its ID"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO leads (
                name, email, phone, loan_amount, credit_score, income,
                debt_to_income, loan_type, stage, probability_score,
                created_date, last_contact, loan_officer_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            lead_data.get('name'),
            lead_data.get('email'),
            lead_data.get('phone'),
            lead_data.get('loan_amount'),
            lead_data.get('credit_score'),
            lead_data.get('income'),
            lead_data.get('debt_to_income'),
            lead_data.get('loan_type'),
            lead_data.get('stage', 'New Lead'),
            lead_data.get('probability_score'),
            lead_data.get('created_date', datetime.now().isoformat()),
            lead_data.get('last_contact', datetime.now().isoformat()),
            lead_data.get('loan_officer_id', 1)
        ))
        
        lead_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        return lead_id
    
    def get_leads(self, loan_officer_id: int = 1, limit: int = 50) -> List[Dict]:
        """Get leads for a loan officer"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT * FROM leads 
            WHERE loan_officer_id = ? 
            ORDER BY probability_score DESC, created_date DESC
            LIMIT ?
        ''', (loan_officer_id, limit))
        
        columns = [description[0] for description in cursor.description]
        leads = []
        
        for row in cursor.fetchall():
            lead = dict(zip(columns, row))
            leads.append(lead)
        
        conn.close()
        return leads
    
    def update_lead_stage(self, lead_id: int, new_stage: str) -> bool:
        """Update lead stage"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            UPDATE leads 
            SET stage = ?, last_contact = ?
            WHERE id = ?
        ''', (new_stage, datetime.now().isoformat(), lead_id))
        
        success = cursor.rowcount > 0
        conn.commit()
        conn.close()
        
        return success
    
    def convert_lead(self, lead_id: int, deal_size: float) -> bool:
        """Mark lead as converted"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            UPDATE leads 
            SET converted = TRUE, conversion_date = ?, stage = 'Closed'
            WHERE id = ?
        ''', (datetime.now().isoformat(), lead_id))
        
        success = cursor.rowcount > 0
        conn.commit()
        conn.close()
        
        return success
    
    def get_performance_metrics(self, loan_officer_id: int = 1, period: str = None) -> Dict:
        """Get performance metrics for a loan officer"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Get lead counts and conversion data
        cursor.execute('''
            SELECT 
                COUNT(*) as total_leads,
                COUNT(CASE WHEN converted = 1 THEN 1 END) as converted_leads,
                AVG(probability_score) as avg_lead_score,
                COUNT(CASE WHEN stage = 'New Lead' THEN 1 END) as new_leads,
                COUNT(CASE WHEN stage IN ('Processing', 'Underwriting', 'Clear to Close') THEN 1 END) as active_pipeline
            FROM leads 
            WHERE loan_officer_id = ?
        ''', (loan_officer_id,))
        
        metrics = cursor.fetchone()
        
        if metrics:
            total_leads, converted_leads, avg_lead_score, new_leads, active_pipeline = metrics
            conversion_rate = (converted_leads / total_leads * 100) if total_leads > 0 else 0
            
            result = {
                'total_leads': total_leads,
                'converted_leads': converted_leads,
                'conversion_rate': round(conversion_rate, 2),
                'avg_lead_score': round(avg_lead_score or 0, 1),
                'new_leads': new_leads,
                'active_pipeline': active_pipeline,
                'pipeline_health': 'Good' if active_pipeline > 10 else 'Needs Attention'
            }
        else:
            result = {
                'total_leads': 0,
                'converted_leads': 0,
                'conversion_rate': 0,
                'avg_lead_score': 0,
                'new_leads': 0,
                'active_pipeline': 0,
                'pipeline_health': 'No Data'
            }
        
        conn.close()
        return result
    
    def save_performance_snapshot(self, loan_officer_id: int, metrics: Dict):
        """Save performance metrics snapshot"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO performance_metrics (
                loan_officer_id, period, leads_generated, leads_converted,
                revenue_generated, avg_deal_size, conversion_rate, created_date
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            loan_officer_id,
            metrics.get('period', 'monthly'),
            metrics.get('leads_generated', 0),
            metrics.get('leads_converted', 0),
            metrics.get('revenue_generated', 0),
            metrics.get('avg_deal_size', 0),
            metrics.get('conversion_rate', 0),
            datetime.now().isoformat()
        ))
        
        conn.commit()
        conn.close()
    
    def get_pipeline_breakdown(self, loan_officer_id: int = 1) -> Dict:
        """Get pipeline breakdown by stage"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT 
                stage,
                COUNT(*) as count,
                SUM(loan_amount) as total_value,
                AVG(probability_score) as avg_score
            FROM leads 
            WHERE loan_officer_id = ? AND converted = FALSE
            GROUP BY stage
            ORDER BY 
                CASE stage
                    WHEN 'New Lead' THEN 1
                    WHEN 'Qualified' THEN 2
                    WHEN 'Application' THEN 3
                    WHEN 'Processing' THEN 4
                    WHEN 'Underwriting' THEN 5
                    WHEN 'Clear to Close' THEN 6
                    ELSE 7
                END
        ''', (loan_officer_id,))
        
        stages = []
        total_pipeline_value = 0
        
        for row in cursor.fetchall():
            stage, count, total_value, avg_score = row
            total_value = total_value or 0
            total_pipeline_value += total_value
            
            stages.append({
                'stage': stage,
                'count': count,
                'total_value': int(total_value),
                'avg_score': round(avg_score or 0, 1)
            })
        
        conn.close()
        
        return {
            'stages': stages,
            'total_pipeline_value': int(total_pipeline_value),
            'total_active_leads': sum(stage['count'] for stage in stages)
        }