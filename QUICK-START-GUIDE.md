# 🚀 Quick Start Guide - Run LoanSense AI Dashboard

## **Prerequisites (Install these first):**

1. **Python 3.8+** with pip
2. **Node.js 16+** with npm  
3. **Git** (already have this)

## **🎯 Step-by-Step Instructions:**

### **1. Navigate to Project Directory**
```bash
cd /Claude-code-cmg/loan-performance-dashboard
```

### **2. Start Backend (Terminal 1)**
```bash
# Navigate to backend
cd backend

# Install Python dependencies
pip install fastapi==0.104.1 uvicorn==0.24.0 pandas==2.1.3 numpy==1.25.2 scikit-learn==1.3.2 sqlalchemy==2.0.23

# Start the API server
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

**Backend will run on:** `http://localhost:8000`

### **3. Start Frontend (New Terminal 2)**
```bash
# Navigate to frontend (open new terminal)
cd /Claude-code-cmg/loan-performance-dashboard/frontend

# Install Node dependencies
npm install

# Start React development server  
npm start
```

**Frontend will run on:** `http://localhost:3000`

### **4. View Dashboard**
Open your browser and go to: **`http://localhost:3000`**

## **🎉 What You'll See:**

1. **Dashboard Overview** - Key metrics, pipeline visualization
2. **Lead Scoring** - AI-powered lead intelligence with conversion probabilities
3. **Performance Analytics** - Trends, charts, historical data
4. **Revenue Forecasting** - AI predictions for future performance  
5. **AI Insights** - Smart recommendations and action items

## **⚡ Alternative: Docker (If you have Docker)**
```bash
cd /Claude-code-cmg/loan-performance-dashboard
docker-compose up
```

## **🔧 If You Get Errors:**

### **Backend Issues:**
- Make sure Python 3.8+ is installed
- Install packages individually if needed:
  ```bash
  pip install fastapi uvicorn pandas numpy scikit-learn
  ```

### **Frontend Issues:**
- Make sure Node.js 16+ is installed
- Clear npm cache: `npm cache clean --force`
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`

### **Port Conflicts:**
- Backend: Change port in `main.py` if 8000 is busy
- Frontend: Change port with `PORT=3001 npm start`

## **📱 Demo Features to Try:**

1. **View Lead Scores** - Check AI predictions for each lead
2. **Pipeline Analysis** - See where leads are in the process
3. **Performance Trends** - View monthly/weekly analytics
4. **AI Recommendations** - Get personalized improvement tips
5. **Revenue Forecasting** - See 6-month predictions

## **🎯 API Documentation:**
Once backend is running, visit: `http://localhost:8000/docs`

---

**Ready to see your AI-powered mortgage dashboard in action! 🏆**