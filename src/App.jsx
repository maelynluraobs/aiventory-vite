import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Suppliers from './pages/Suppliers';
import Scan from './pages/Scan';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Analysis from './pages/Analysis';
import Orders from './pages/Orders';
import Prediction from './pages/Prediction';
import './App.css'

import PrivateRoute from "../routes/PrivateRoute"; 

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/inventory"
          element={
            <PrivateRoute allowedRoles={["Admin", "Staff"]}>
              <Inventory />
            </PrivateRoute>
          }
        />
        <Route
          path="/suppliers"
          element={
            <PrivateRoute allowedRoles={["Admin", "Staff"]}>
              <Suppliers />
            </PrivateRoute>
          }
        />
        <Route
          path="/scan"
          element={
            <PrivateRoute>
              <Scan />
            </PrivateRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <PrivateRoute allowedRoles={["Admin"]}>
              <Reports />
            </PrivateRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <Settings />
            </PrivateRoute>
          }
        />
        <Route
          path="/analysis"
          element={
            <PrivateRoute>
              <Analysis />
            </PrivateRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <PrivateRoute allowedRoles={["Admin", "Staff"]}>
              <Orders />
            </PrivateRoute>
          }
        />
        <Route
          path="/prediction"
          element={
            <PrivateRoute>
              <Prediction />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}


export default App;
