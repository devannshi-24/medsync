import { createContext, useState,useEffect } from "react";
import api from "../services/api";

export const AuthContext = createContext();

function AuthProvider({ children }) {
  
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAuth = async()=>{
    try{
        const response = await api.get("/profile");
        setUser(response.data.profile);
        setIsAuthenticated(true);
    }
    catch(error){
        setUser(null);
        setIsAuthenticated(false);
    }
    finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{user,setUser,isAuthenticated,setIsAuthenticated,loading,setLoading,checkAuth}}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;