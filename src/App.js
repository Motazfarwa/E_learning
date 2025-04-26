
import { Routes, Route, Navigate } from 'react-router-dom'; // Remove Router import
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
import MeetingPage from './pages/MeetingPage';
import React from "react"; // Remove unused imports
import ErrorBoundaryWrapper from './pages/ErrorBoundary';


const stripePromise = loadStripe('pk_test_51PFIvmRsp6m9X8kfwMev0UG3kepv04iTwrVtDodndQOMD4YspYgN424hpZ8i36gwb0CMldjLvS8gtS2YeguA21Cb00twxbZdDL');

function App() {
  return (
    <RoleProvider>
      <div className="font-Poppins bg-Solitude">
        {/* Remove the <Router> component here */}
        <Routes>
          <Route path="/" element={<Navigate to="/register" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<ProtectedRoute allowedRoles={['INSTRUCTEUR']}><Template /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['ADMIN']}><Dashboard /></ProtectedRoute>} />
          <Route path="/Ajoutercour" element={<ProtectedRoute allowedRoles={['ADMIN', 'INSTRUCTEUR']}><Addcourseform /></ProtectedRoute>} />
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
          <Route 
                path="/meetings/:meetingId" 
                element={
                  <ProtectedRoute allowedRoles={['ADMIN', 'INSTRUCTEUR' ,'EXPERT']}>
                    <ErrorBoundaryWrapper> {/* Specific boundary for meeting page */}
                      <MeetingPage />
                    </ErrorBoundaryWrapper>
                  </ProtectedRoute>
                } 
              />
        </Routes>
      </div>
    </RoleProvider>
  );  
}

export default App;
