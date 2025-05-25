
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
import MeetingPage from './pages/Meetingpage';
import React from "react"; // Remove unused imports
import ErrorBoundaryWrapper from './pages/ErrorBoundary';

import Calendar from './pages/Maintenacecalendar';

import ProfilePage from './pages/ProfilePage';

import Apprenantcalendar from './pages/Apprenantcalendar';
import HomePage from './pages/HomePage';
import CoursesAndExpertsPage from './pages/CoursesAndExpertsPage';
import ChatApp from './pages/chatboat';

import CourseRoom from './pages/CourseRoom';

import ChatComponent from './pages/ChatComponent';
import ChatRoom from './pages/ChatRoom';
import CreateRoom from './pages/RoomGenerator';
import Recommendations from './pages/Recommendations';
import CourseDetailsList from './pages/CourseDetailsList';




const stripePromise = loadStripe('pk_test_51R0PabHGa0qYa3Mxv7Tf3cf2SNBVFAaf2H4IuXlsTDAZ9jFO4NTvj699fmbTSAEzjpugpWID9eaPv2IoqjKMEzAe00xug8QopQ');

function App() {
  return (

    <RoleProvider>
      <div className="font-Poppins bg-Solitude">
        {/* Remove the <Router> component here */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['ADMIN']}><Dashboard /></ProtectedRoute>} />
          <Route path="/Ajoutercour" element={<ProtectedRoute allowedRoles={['ADMIN', 'INSTRUCTEUR']}><Addcourseform /></ProtectedRoute>} />
          <Route path="/getcours" element={<ProtectedRoute allowedRoles={['ADMIN', 'APPRENANT' , 'INSTRUCTEUR']}><CourseList /></ProtectedRoute>} />
          <Route path="/cours/:id" element={<ProtectedRoute allowedRoles={['ADMIN', 'INSTRUCTEUR']}><Coursedetails /></ProtectedRoute>} />
          <Route path="/learn" element={<CoursesAndExpertsPage />} />
          <Route path="/cours" element={<CourseDetailsList />} />
          <Route path="/course/:roomId" element={<CourseRoom />} />
          <Route
            path="/payment"
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'INSTRUCTEUR','APPRENANT']}>
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
  
  <Route path="/calendar" element={<ProtectedRoute allowedRoles={['ADMIN', 'EXPERT' , 'INSTRUCTEUR']}><Calendar /></ProtectedRoute>} />
  <Route path="/studentcalendar" element={<ProtectedRoute allowedRoles={['ADMIN', 'APPRENANT']}><Apprenantcalendar /></ProtectedRoute>} />
  <Route path="/chatboat" element={<ProtectedRoute allowedRoles={['ADMIN',  'INSTRUCTEUR']}><ChatApp /></ProtectedRoute>} />

  
 
   

 

  <Route 
  path="/room" 
  element={
    <ProtectedRoute allowedRoles={['ADMIN', 'INSTRUCTEUR']}>
      <CreateRoom />
    </ProtectedRoute>
  } 
/>


{/*chatroom*/}
<Route 
  path="/chat" 
  element={
    <ProtectedRoute allowedRoles={['ADMIN', 'INSTRUCTEUR' , 'APPRENANT']}>
      <ChatRoom />
    </ProtectedRoute>
  } 
/>
  <Route
            path="/recommendations" element={Recommendations}
            
          />
     </Routes>
      </div>
    </RoleProvider>
  );  
}

export default App;