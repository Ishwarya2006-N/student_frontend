import { createContext, useEffect, useState } from "react";
import axios from "../lib/axios";

export const AppContent = createContext();

const AppContextProvider = ({ children }) => {
  const [userData, setUserData] = useState(JSON.parse(localStorage.getItem("user")) || null);
  const [isLoggedIn, setIsLoggedin] = useState(!!localStorage.getItem("token"));
  const [loadingProfile, setLoadingProfile] = useState(true);

  const fetchProfile = async () => {
    try {
      const res = await axios.get("/auth/profile");
      if (res.data?.success) {
        setUserData(res.data.user);
        setIsLoggedin(true);
      } else {
        setUserData(null);
        setIsLoggedin(false);
      }
    } catch {
      setUserData(null);
      setIsLoggedin(false);
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const logout = async () => {
    try {
      await axios.post("/auth/logout");
    } catch {}
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUserData(null);
    setIsLoggedin(false);
    window.location.href = "/login";
  };

  return (
    <AppContent.Provider
      value={{
        axios,
        userData,
        setUserData,
        isLoggedIn,
        setIsLoggedin,
        loadingProfile,
        logout,
      }}
    >
      {children}
    </AppContent.Provider>
  );
};

export default AppContextProvider;
