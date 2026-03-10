import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";
import { UserRole } from "../types";

export default function ProtectedRoute({ children, role }: { children: ReactNode; role?: UserRole }) {
  const { user, loading } = useAuth();

  if (loading) return <p className="status-card">Checking session...</p>;
  if (!user) return <Navigate to="/auth" replace />;
  if (role && user.role !== role) return <Navigate to="/shop" replace />;
  return <>{children}</>;
}
