import React from "react";
import { FiClock, FiTag, FiShoppingCart } from "react-icons/fi";
import { useNavigate, useLocation, NavLink } from "react-router-dom";

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    if (path === location.pathname) {
      return " active";
    } else {
      return "";
    }
  };

  return (
    <footer>
      <nav>
        <div className="btm-nav">
          <button
            className={
              "bg-primary text-primary-content border-r border-zinc-50 opacity-75 hover:opacity-90 duration-300 transition-opacity" +
              isActive("/")
            }
            onClick={() => navigate("/")}
          >
            <FiClock size={16} />
            <span className="btm-nav-label">Explore</span>
          </button>

          <button
            className={
              "bg-primary text-primary-content border-r border-zinc-50 opacity-75 hover:opacity-90 duration-300 transition-opacity" +
              isActive("/offers")
            }
            onClick={() => navigate("/offers")}
          >
            <FiTag size={16} />
            <span className="btm-nav-label">Offer</span>
          </button>
          <button
            className={
              "bg-primary text-primary-content opacity-75 hover:opacity-90 duration-300 transition-opacity" +
              isActive("/profile")
            }
            onClick={() => navigate("/profile")}
          >
            <FiShoppingCart size={16} />
            <span className="btm-nav-label">Profile</span>
          </button>
        </div>
      </nav>
    </footer>
  );
};
