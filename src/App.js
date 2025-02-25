
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import { RoleProvider } from './pages/RoleContext';
import ProtectedRoute from './pages/ProtectedRoute';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Template from './pages/template';

function App() {
  return (
  <RoleProvider>
 
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
  
  </Routes>
  </Router>
  </div>
  </RoleProvider>
  );   
}

export default App;
