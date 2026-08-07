import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/Admin/AdminSidebar";

function AdminLayout() {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;