// src/components/admin/Sidebar.jsx
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const linkClass = `
    px-4 py-2 rounded-lg transition-all duration-300
    hover:bg-white/20 hover:scale-105
    text-white font-medium
  `;
  const activeClass = `
    bg-white/25 shadow-lg
  `;

  return (
    <aside className="w-64 bg-gradient-to-b from-purple-900 via-indigo-900 to-blue-900 text-white h-screen p-6 sticky top-0">
      <h2 className="text-2xl font-bold mb-8 text-white drop-shadow-lg">Dashboard</h2>
      <nav className="flex flex-col gap-3">
        <NavLink 
          to="/admin/users" 
          className={({ isActive }) => `${linkClass} ${isActive ? activeClass : ""}`}
        >
          Home
        </NavLink>

        <NavLink 
          to="/admin/students" 
          className={({ isActive }) => `${linkClass} ${isActive ? activeClass : ""}`}
        >
          Students
        </NavLink>

        <NavLink 
          to="/admin/marks" 
          className={({ isActive }) => `${linkClass} ${isActive ? activeClass : ""}`}
        >
          Marks
        </NavLink>

        <NavLink 
          to="/admin/attendance" 
          className={({ isActive }) => `${linkClass} ${isActive ? activeClass : ""}`}
        >
          Attendance
        </NavLink>

        <NavLink 
          to="/admin/analytics" 
          className={({ isActive }) => `${linkClass} ${isActive ? activeClass : ""}`}
        >
          Analytics
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
