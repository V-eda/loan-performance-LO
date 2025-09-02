import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from datetime import datetime, timedelta
import random
import json

class LeadScoringModel:
    def __init__(self):
        self.model = RandomForestClassifier(
            n_estimators=100, 
            random_state=42,
            max_depth=10
        )
        self.scaler = StandardScaler()
        self.label_encoders = {}
        self.is_trained = False
        
        # Initialize with sample training data
        self.train_model()
    
    def generate_sample_training_data(self, n_samples=1000):
        """Generate synthetic training data for the model"""
        np.random.seed(42)
        
        data = []
        loan_types = ['conventional', 'fha', 'va', 'jumbo', 'refinance']
        
        for i in range(n_samples):
            credit_score = np.random.normal(720, 80)
            credit_score = max(300, min(850, credit_score))
            
            income = np.random.lognormal(11.5, 0.6)  # Average around $100k
            loan_amount = income * np.random.uniform(2.5, 5.0)
            debt_to_income = np.random.uniform(0.15, 0.45)
            
            loan_type = np.random.choice(loan_types)
            days_since_contact = np.random.randint(1, 30)
            contact_frequency = np.random.randint(1, 10)
            
            # Create probability based on features (higher credit score, income = higher probability)
            base_prob = 0.3
            
            # Credit score impact
            if credit_score > 750:
                base_prob += 0.25
            elif credit_score > 680:
                base_prob += 0.15
            elif credit_score < 600:
                base_prob -= 0.2
            
            # Income impact
            if income > 150000:
                base_prob += 0.2
            elif income > 100000:
                base_prob += 0.1
            elif income < 50000:
                base_prob -= 0.15
            
            # Debt to income impact
            if debt_to_income < 0.25:
                base_prob += 0.15
            elif debt_to_income > 0.4:
                base_prob -= 0.2
            
            # Contact recency impact
            if days_since_contact <= 3:
                base_prob += 0.1
            elif days_since_contact > 14:
                base_prob -= 0.15
            
            # Random noise
            base_prob += np.random.uniform(-0.1, 0.1)
            base_prob = max(0.05, min(0.95, base_prob))
            
            converted = np.random.random() < base_prob
            
            data.append({
                'credit_score': credit_score,
                'income': income,
                'loan_amount': loan_amount,
                'debt_to_income': debt_to_income,
                'loan_type': loan_type,
                'days_since_contact': days_since_contact,
                'contact_frequency': contact_frequency,
                'converted': converted
            })
        
        return pd.DataFrame(data)
    
    def train_model(self):
        """Train the lead scoring model"""
        # Generate training data
        df = self.generate_sample_training_data()
        
        # Prepare features
        categorical_columns = ['loan_type']
        numerical_columns = ['credit_score', 'income', 'loan_amount', 'debt_to_income', 
                           'days_since_contact', 'contact_frequency']
        
        # Encode categorical variables
        for col in categorical_columns:
            le = LabelEncoder()
            df[col + '_encoded'] = le.fit_transform(df[col])
            self.label_encoders[col] = le
        
        # Prepare feature matrix
        feature_columns = numerical_columns + [col + '_encoded' for col in categorical_columns]
        X = df[feature_columns]
        y = df['converted']
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )
        
        # Scale features
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        # Train model
        self.model.fit(X_train_scaled, y_train)
        
        # Evaluate
        train_score = self.model.score(X_train_scaled, y_train)
        test_score = self.model.score(X_test_scaled, y_test)
        
        print(f"Model trained - Train accuracy: {train_score:.3f}, Test accuracy: {test_score:.3f}")
        self.is_trained = True
    
    def predict_conversion_probability(self, lead_data):
        """Predict conversion probability for a single lead"""
        if not self.is_trained:
            self.train_model()
        
        # Create DataFrame from lead data
        df = pd.DataFrame([lead_data])
        
        # Handle missing loan_type encoding
        if 'loan_type' in df.columns:
            if 'loan_type' in self.label_encoders:
                try:
                    df['loan_type_encoded'] = self.label_encoders['loan_type'].transform([df['loan_type'].iloc[0]])[0]
                except ValueError:
                    # Handle unseen loan types
                    df['loan_type_encoded'] = 0
            else:
                df['loan_type_encoded'] = 0
        else:
            df['loan_type_encoded'] = 0
        
        # Add missing features with defaults
        if 'days_since_contact' not in df.columns:
            df['days_since_contact'] = 1
        if 'contact_frequency' not in df.columns:
            df['contact_frequency'] = 1
        
        # Prepare features
        feature_columns = ['credit_score', 'income', 'loan_amount', 'debt_to_income',
                          'days_since_contact', 'contact_frequency', 'loan_type_encoded']
        
        # Fill missing values with defaults
        for col in feature_columns:
            if col not in df.columns:
                df[col] = 0
        
        X = df[feature_columns]
        
        # Scale features
        X_scaled = self.scaler.transform(X)
        
        # Predict probability
        probability = self.model.predict_proba(X_scaled)[0][1]
        
        return round(probability * 100, 1)
    
    def generate_sample_leads(self, n_leads=10):
        """Generate sample leads with scoring for demo purposes"""
        leads = []
        names = ["Sarah Johnson", "Mike Chen", "Lisa Brown", "David Wilson", "Amy Davis",
                "John Smith", "Maria Garcia", "Robert Taylor", "Jennifer Lee", "Michael Zhang",
                "Laura Thompson", "James Anderson", "Emily Rodriguez", "William Martinez",
                "Ashley Johnson", "Christopher Lee", "Jessica White", "Daniel Brown", "Nicole Clark", "Ryan Miller"]
        
        loan_types = ['Conventional', 'FHA', 'VA', 'Jumbo', 'Refinance']
        stages = ['New Lead', 'Qualified', 'Application', 'Processing']
        
        for i in range(n_leads):
            # Generate realistic lead data
            credit_score = random.randint(580, 820)
            income = random.randint(45000, 200000)
            loan_amount = random.randint(200000, 800000)
            debt_to_income = round(random.uniform(0.15, 0.45), 2)
            
            lead_data = {
                'id': i + 1,
                'name': names[i % len(names)],
                'email': f"{names[i % len(names)].replace(' ', '.').lower()}@email.com",
                'phone': f"({random.randint(200,999)}) {random.randint(200,999)}-{random.randint(1000,9999)}",
                'credit_score': credit_score,
                'income': income,
                'loan_amount': loan_amount,
                'debt_to_income': debt_to_income,
                'loan_type': random.choice(loan_types),
                'stage': random.choice(stages),
                'days_since_contact': random.randint(1, 15),
                'contact_frequency': random.randint(1, 8),
                'created_date': (datetime.now() - timedelta(days=random.randint(1, 30))).isoformat(),
                'last_contact': (datetime.now() - timedelta(days=random.randint(0, 7))).isoformat()
            }
            
            # Calculate probability score
            probability_score = self.predict_conversion_probability(lead_data)
            lead_data['probability_score'] = probability_score
            
            # Add urgency level based on score
            if probability_score >= 80:
                lead_data['urgency'] = 'High'
            elif probability_score >= 60:
                lead_data['urgency'] = 'Medium'
            else:
                lead_data['urgency'] = 'Low'
            
            leads.append(lead_data)
        
        # Sort by probability score descending
        leads.sort(key=lambda x: x['probability_score'], reverse=True)
        
        return leads