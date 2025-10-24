import { Navigate, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

// ✅ Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import Users from "./pages/admin/Users";
import Students from "./pages/admin/Students";
import Marks from "./pages/admin/Marks";
import Analytics from "./pages/admin/Analytics";
import Attendance from "./pages/admin/Attendance";

function App() {
  return (
    <>
      <Routes>
        {/* Default route */}
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Admin Dashboard Routes */}
        <Route path="/admin" element={<AdminDashboard />}>
          <Route path="users" element={<Users />} />
          <Route path="students" element={<Students />} />
          <Route path="marks" element={<Marks />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="attendance" element={<Attendance />} />
        </Route>
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
