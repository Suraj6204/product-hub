import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { ReactNode } from "react";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { token, user } = useAuth();
  
  // Pehle localStorage se manually check karein agar state update nahi hui
  const savedToken = localStorage.getItem("token");

  if (!token && !savedToken) {
    console.log("No token found, redirecting to login...");
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
export default ProtectedRoute;
