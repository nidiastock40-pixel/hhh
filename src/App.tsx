/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Loans from './pages/Loans';
import GovtSchemes from './pages/GovtSchemes';
import Accounts from './pages/Accounts';
import Investments from './pages/Investments';
import Insurance from './pages/Insurance';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import { AuthProvider, useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }: { children: React.ReactNode, adminOnly?: boolean }) => {
  const { user, role, loading } = useAuth();
  
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && role !== 'admin') return <Navigate to="/" />;
  
  return <>{children}</>;
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-center" richColors />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
          <Route path="/loans" element={<ProtectedRoute><Layout><Loans /></Layout></ProtectedRoute>} />
          <Route path="/schemes" element={<ProtectedRoute><Layout><GovtSchemes /></Layout></ProtectedRoute>} />
          <Route path="/accounts" element={<ProtectedRoute><Layout><Accounts /></Layout></ProtectedRoute>} />
          <Route path="/investments" element={<ProtectedRoute><Layout><Investments /></Layout></ProtectedRoute>} />
          <Route path="/insurance" element={<ProtectedRoute><Layout><Insurance /></Layout></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute adminOnly><Layout><AdminDashboard /></Layout></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
