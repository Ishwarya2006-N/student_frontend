// src/routes/ProtectedAdminRoute.jsx
import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AppContent } from "../context/AppContext";

const ProtectedAdminRoute = () => {
  const { isLoggedIn, userData, loadingProfile } = useContext(AppContent);

  if (loadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-gray-600">Loading...</span>
      </div>
    );
  }

  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (userData?.role !== "admin") return <Navigate to="/dashboard" replace />;

  return <Outlet />;
};

export default ProtectedAdminRoute;
