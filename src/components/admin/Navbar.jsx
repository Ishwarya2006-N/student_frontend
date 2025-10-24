// src/components/admin/Navbar.jsx
import { useContext } from "react";
import { AppContent } from "../../context/AppContext";

const Navbar = () => {
  const { userData, logout } = useContext(AppContent);

  return (
    <header className="w-full bg-white border-b shadow-sm p-4 flex justify-between items-center">
      <h1 className="text-lg font-semibold"></h1>
      <div className="flex items-center gap-4">
        {/* {userData && (
          <span className="text-sm text-gray-600">
            {userData.name} ({userData.role})
          </span>
        )} */}
        <button
          onClick={logout}
          className="px-3 py-2 rounded bg-gray-900 text-white hover:opacity-90"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
