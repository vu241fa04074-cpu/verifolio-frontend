import { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Loader from "../components/Loader";

export default function ProtectedRoute() {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><Loader size={40} /></div>;

  if (!user) return <Navigate to="/login" replace />;

  // If user is admin and trying to access user routes, redirect to admin dashboard
  if (user.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
}
