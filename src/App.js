
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import { RoleProvider } from './pages/RoleContext';
import ProtectedRoute from './pages/ProtectedRoute';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Template from './pages/template';
import Addcourseform from './pages/Addcourseform';
import CourseList from './pages/CourseList';
import Coursedetails from './pages/Coursedetails';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from './pages/Paiement';
import React, { useState } from "react";
import Meeting from './components/Meeting';



// Your Stripe publishable key (replace with your own key)
const stripePromise = loadStripe('pk_test_51R0PabHGa0qYa3Mxv7Tf3cf2SNBVFAaf2H4IuXlsTDAZ9jFO4NTvj699fmbTSAEzjpugpWID9eaPv2IoqjKMEzAe00xug8QopQ');

function App() {
  
  return (
    
    
  <RoleProvider>
  <div className="App">
      <Meeting />
  </div>
  <div className=" font-Poppins bg-Solitude">
  <Router>
  <Routes>
  {/* Redirect to login */}
  <Route path="/" element={<Navigate to="/register" replace />} />

  {/* Public Routes */}
   <Route path="/login" element={<Login />} />
   <Route path="/register" element={<Register />} />

  {/* Protected Routes - Role Based Access */}
  <Route path="/home" element={<ProtectedRoute allowedRoles={['INSTRUCTEUR']}><Template /></ProtectedRoute>} />
  <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['ADMIN']}><Dashboard /></ProtectedRoute>} />
  <Route path="/Ajoutercour" element={<ProtectedRoute allowedRoles={['ADMIN']}><Addcourseform /></ProtectedRoute>} />
  <Route path="/getcours" element={<ProtectedRoute allowedRoles={['ADMIN', 'INSTRUCTEUR']}><CourseList /></ProtectedRoute>} />
  <Route path="/cours/:id" element={<ProtectedRoute allowedRoles={['ADMIN', 'INSTRUCTEUR']}><Coursedetails /></ProtectedRoute>} />
  <Route
  path="/payment"
  element={
    <ProtectedRoute allowedRoles={['ADMIN', 'INSTRUCTEUR']}>
      <Elements stripe={stripePromise}>
        <PaymentForm />
      </Elements>
    </ProtectedRoute>
  }
/>

  </Routes>
  </Router>
  </div>
  </RoleProvider>
  );   
}

export default App;
