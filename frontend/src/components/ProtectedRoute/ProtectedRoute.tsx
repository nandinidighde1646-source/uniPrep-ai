import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

import { useAuth } from "../../context/AuthContext";

type ProtectedRouteProps = {
  children: ReactNode;
};

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user } = useAuth();

    console.log("ProtectedRoute user:", user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;