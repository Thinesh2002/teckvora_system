import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../css/sidebar.css";

const Sidebar = ({ show, onClose }) => {
  const [showKpiSubmenu, setShowKpiSubmenu] = useState(false);

  if (!show) return null;

  return (
    <>
      <div className="overlay" onClick={onClose} />

      <div className="sidebar">
        <button className="close-btn" onClick={onClose}>&times;</button>
        <p className="sidebar-title">Menu</p>

        <ul className="sidebar-links">
         
          <li
            className="has-submenu"
            onMouseEnter={() => setShowKpiSubmenu(true)}
            onMouseLeave={() => setShowKpiSubmenu(false)}
          >
            <span className="submenu-toggle">
              Products
            </span>

            {showKpiSubmenu && (
              <ul className="floating-submenu">
                <li><Link to="/product-dashboard" onClick={onClose}>Manage Product</Link></li>
                <li><Link to="/add-product" onClick={onClose}>Add Details</Link></li>
              </ul>
            )}
          </li>

        <li><Link to="/keyword" onClick={onClose}>Title Generate</Link></li>
          <li><Link to="/sales-compare" onClick={onClose}>Sales Comparison</Link></li>
          <li><Link to="/sales-data-upload" onClick={onClose}>Sales Data Upload</Link></li>
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
