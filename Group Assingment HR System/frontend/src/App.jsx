import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import EmployeeManager from './Components/EmployeeManager';
import EmployeeList from './Components/EmployeeList';
import VehicleManager from './Components/VehicleManager';
import ErrorBoundary from './Components/ErrorBoundary';
import './styles/App.css';

const App = () => {
  return (
    <ErrorBoundary>
      <Router>
        <div className="app-container">
          <nav className="navigationWrapper">
            <div className="logoWrapper">
              <span className="stylish">AWY</span>
              <span className="logo">HR SYSTEM</span>
              <span className = "tagline">Sounds Of Sensation</span>
            </div>
            <ul className="navigation">
              <li className="parent">
                <Link className="link" to="/employees">Staff Information</Link>
              </li>
              <li className="parent">
                <Link className="link" to="/employee-manager">Adding New Recruits</Link>
              </li>
              <li className="parent">
                <Link className="link" to="/vehicles">Vehicle Procurement</Link>
              </li>
            </ul>
          </nav>

          <Routes>
            <Route path="/" element={<Navigate to="/employees" />} />
            <Route path="/employees" element={<EmployeeList />} />
            <Route path="/employee-manager" element={<EmployeeManager />} />
            <Route path="/vehicles" element={<VehicleManager />} />
          </Routes>
        </div>
      </Router>
    </ErrorBoundary>
  );
};

export default App;