
import {
  LayoutDashboard,
  FileText,
  BookOpen,
  Users,
  LogOut,
  ClipboardList,
} from "lucide-react";
import { NavLink } from "react-router-dom";

function AdminSidebar() {
  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: <LayoutDashboard size={20} />,
    },
    {
      name: "Manage Notes",
      path: "/admin/notes",
      icon: <BookOpen size={20} />,
    },
    {
      name: "Manage PYQs",
      path: "/admin/pyqs",
      icon: <FileText size={20} />,
    },
    {
      name: "Manage Mock Tests",
      path: "/admin/mock-tests",
      icon: <ClipboardList size={20} />,
    },
    {
      name: "Manage Users",
      path: "/admin/users",
      icon: <Users size={20} />,
    },
  ];

  return (
    <aside className="flex w-64 flex-col bg-gray-900 text-white">
      <div className="border-b border-gray-700 p-6">
        <h1 className="text-2xl font-bold">UniPrep AI</h1>
        <p className="text-sm text-gray-400">Admin Panel</p>
      </div>

      <nav className="mt-6 flex-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/admin"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 transition ${
                isActive
                  ? "bg-green-600 text-white"
                  : "text-gray-300 hover:bg-gray-800"
              }`
            }
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-gray-700 p-4">
        <button
          type="button"
          className="flex items-center gap-3 text-red-400 hover:text-red-300"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;
