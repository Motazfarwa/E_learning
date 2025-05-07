
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

import Calendar from './pages/Maintenacecalendar';
import ProfilePage from './pages/ProfilePage';



const stripePromise = loadStripe('pk_test_51R0PabHGa0qYa3Mxv7Tf3cf2SNBVFAaf2H4IuXlsTDAZ9jFO4NTvj699fmbTSAEzjpugpWID9eaPv2IoqjKMEzAe00xug8QopQ');

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


      
        <Route path="/profile" element={<ProfilePage />} />
      

  <Route path="/cours/:id" element={<ProtectedRoute allowedRoles={['ADMIN', 'INSTRUCTEUR']}><Coursedetails /></ProtectedRoute>} />
  
  <Route path="/calendar" element={<ProtectedRoute allowedRoles={['ADMIN', 'INSTRUCTEUR']}><Calendar /></ProtectedRoute>} />
  
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
      </div>
    </RoleProvider>
  );  

 

}

export default App;
