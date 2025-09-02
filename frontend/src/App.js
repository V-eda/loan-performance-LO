import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';

// Components
import Sidebar from './components/Sidebar';
import Header from './components/Header';

// Pages
import Dashboard from './pages/Dashboard';
import LeadScoring from './pages/LeadScoring';
import Performance from './pages/Performance';
import Forecasting from './pages/Forecasting';
import Insights from './pages/Insights';

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/lead-scoring" element={<LeadScoring />} />
              <Route path="/performance" element={<Performance />} />
              <Route path="/forecasting" element={<Forecasting />} />
              <Route path="/insights" element={<Insights />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;