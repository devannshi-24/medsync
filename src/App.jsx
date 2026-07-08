import React from 'react'
import {Routes, Route} from 'react-router-dom'
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Assistant from "./pages/Assistant";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Medicines from "./pages/Medicines";
import Schedules from "./pages/Schedules";
import Doselogs from "./pages/Doselogs";
import Symptoms from "./pages/Symptoms";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ProtectedRoute from './routes/ProtectedRoute';

function App() {

  return (
      <Routes>

        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/assistant" element={ <ProtectedRoute><Assistant /></ProtectedRoute>}/>
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/medicines" element={<ProtectedRoute><Medicines /></ProtectedRoute>} />
        <Route path="/schedules" element={<ProtectedRoute><Schedules /></ProtectedRoute>} />
        <Route path="/symptoms"element={<ProtectedRoute><Symptoms /></ProtectedRoute>}/>
        <Route path="/doselogs" element={<ProtectedRoute><Doselogs /></ProtectedRoute>} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
  );
} 

export default App
