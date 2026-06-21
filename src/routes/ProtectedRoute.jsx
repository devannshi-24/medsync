import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function ProtectedRoute({ children }) {

  const {
    isAuthenticated,
    loading
  } = useContext(AuthContext);

  if (loading) {
    return <h1>Loading...</h1>;
  }
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return children;
}
export default ProtectedRoute;