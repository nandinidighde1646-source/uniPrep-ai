import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import Notes from "../pages/Notes/Notes";
import PYQs from "../pages/PYQs/PYQs";
import Dashboard from "../pages/Dashboard/Dashboard";
import NotFound from "../pages/NotFound/NotFound";

import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";
import AIChat from "../pages/AIChat/AIChat";
import Profile from "../pages/Profile/Profile";
import Settings from "../pages/Settings/Settings";
import AddNote from "../pages/AddNote/AddNote";
import UploadPYQ from "../pages/UploadPYQ/UploadPYQ";

import AdminLayout from "../layouts/AdminLayout";

import AdminDashboard from "../pages/Admin/AdminDashboard";
import ManageNotes from "../pages/Admin/ManageNotes";
import ManagePYQs from "../pages/Admin/ManagePYQs";
import ManageUsers from "../pages/Admin/ManageUsers";

function AppRouter() {
  return (
    <Routes>

      {/* Pages that use Navbar + Footer */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="notes" element={<Notes />} />
        <Route path="pyqs" element={<PYQs />} />
        <Route path="ai-chat" element={<AIChat />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
        <Route path="/add-note" element={<AddNote />} />
        <Route path="/upload-pyq" element={<UploadPYQ />} />
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Pages without Navbar/Footer */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />


{/* Admin Routes */}
<Route path="/admin" element={<AdminLayout />}>
  <Route index element={<AdminDashboard />} />
  <Route path="notes" element={<ManageNotes />} />
  <Route path="pyqs" element={<ManagePYQs />} />
  <Route path="users" element={<ManageUsers />} />
</Route>


      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRouter;