import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Settings } from "lucide-react";
import Sidebar from "./sidebar";
import "../../css/header.css";
import logo from "../../assets/logo.png";
import API from "../../api"; // ✅ make sure path is correct

function Header() {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [username, setUsername] = useState(localStorage.getItem("username") || "");

  useEffect(() => {
    // Fetch the logged-in user info only if token exists
    if (token) {
      API.get("/auth/me")
        .then((res) => {
          const name = res.data.name || res.data.user_id;
          setUsername(name);
          localStorage.setItem("username", name); // ✅ store for reuse
        })
        .catch(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("username");
          navigate("/");
        });
    }

    const handleStorage = () => {
      setToken(localStorage.getItem("token"));
      setUsername(localStorage.getItem("username") || "");
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [token, navigate]);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);
  const handleDashboardNavigation = () => navigate("/dashboard");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setToken(null);
    setUsername("");
    navigate("/");
  };

  return (
    <>
      <header className="header">
        <div className="header-1st-row">
          {/* LEFT: Menu + Logo + Username */}
          <div className="header-left">
            <button className="menu-btn" onClick={toggleSidebar}>
              <Menu size={22} />
            </button>

            <div className="logo-container" onClick={handleDashboardNavigation}>
              <img src={logo} alt="Logo" className="logo" />
            </div>
          </div>

          {token && (
            <div className="header-right">
              <div className="custom-dropdown">
                <button className="custom-dropbtn">☰ Manage</button>
                <div className="custom-dropdown-content">
                  <div onClick={() => navigate("/keyword")}>Keyword</div>
   
                  <div onClick={() => navigate("/Amazon-keyword-checker")}>
                    Duplicate Word Remover
                  </div>
                </div>
              </div>

              <div className="settings-dropdown">
                <Settings size={22} className="settings-icon" />
                <div className="settings-menu">
                  <div onClick={() => navigate("/profile")}>Profile</div>
                  <div onClick={() => navigate("/change-password")}>
                    Change Password
                  </div>
                  <div onClick={() => navigate("/preferences")}>
                    Preferences
                  </div>
                  <div onClick={handleLogout} className="logout-item">
                    Logout
                  </div>
                </div>
              </div>
                 {username && <h2 className="user-name">{username}</h2>}
            </div>
          )}
        </div>
      </header>

      <Sidebar show={sidebarOpen} onClose={closeSidebar} />
    </>
  );
}

export default Header;
