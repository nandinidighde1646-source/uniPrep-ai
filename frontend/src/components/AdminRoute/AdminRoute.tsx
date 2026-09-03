import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
console.error("🔥🔥🔥 ADMINROUTE FILE LOADED 🔥🔥🔥");
type AdminRouteProps = {
  children: React.ReactNode;
};

const AdminRoute = ({ children }: AdminRouteProps) => {
  const { user, loading } = useAuth();
  console.error("🔥 ADMIN ROUTE USER:", user);
console.error("🔥 ADMIN ROUTE ROLE:", user?.role);
console.error("🔥 ADMIN ROUTE LOADING:", loading);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "ADMIN") {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;