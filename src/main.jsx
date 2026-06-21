import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import { Toaster } from "react-hot-toast";
import App from './App.jsx'
import {BrowserRouter} from 'react-router-dom'
import AuthProvider from "./context/AuthContext";

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <BrowserRouter>
      <Toaster position="top-right" />
      <App />
   </BrowserRouter>
  </AuthProvider>
)
