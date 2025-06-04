import "./Navbar.css"; // Import custom CSS
import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
// Add this to the top of your file
import { getAuth, deleteUser } from "firebase/auth";
import { FaBars, FaSignOutAlt, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Navbar.css";
import { EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
const Navbar = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavClick = () => {
    sessionStorage.removeItem("userPassion");
  };
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("currentUser"));
    if (storedUser) {
      setCurrentUser(storedUser);
    }
    setLoading(false);
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    // window.location.reload();
    navigate("/");
  };

  const reauthenticateUser = async (user, password) => {
    const credential = EmailAuthProvider.credential(user.email, password);
    return await reauthenticateWithCredential(user, credential);
  };

  const handleDeleteAccount = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      try {
        await deleteUser(user); // Try delete directly
        cleanupAndLogout(user.email);
      } catch (error) {
        if (error.code === "auth/requires-recent-login") {
          const password = prompt(
            "Please re-enter your password to confirm account deletion:"
          );
          if (password) {
            try {
              await reauthenticateUser(user, password);
              await deleteUser(user); // Retry deletion after re-auth
              cleanupAndLogout(user.email);
            } catch (reauthError) {
              toast.error("Re-authentication failed. Please try again.");
            }
          }
        } else {
          toast.error("Failed to delete account.");
        }
      }
    } else {
      toast.error("No user found.");
    }
  };

  // helper to clean up localStorage
  const cleanupAndLogout = (email) => {
    let users = JSON.parse(localStorage.getItem("users")) || [];
    users = users.filter((u) => u.email !== email);
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.removeItem("currentUser");
    toast.success("Account deleted successfully!");
    window.location.reload();
  };

  const handleProtectedNavigation = (event, path) => {
    if (!currentUser) {
      event.preventDefault();
      toast.error("You must be logged in to access this page!");
      navigate("/login");
    }
  };
  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <span className="logo">HORIZON</span>
      </div>
      <div className="hamburger" onClick={toggleMenu}>
        <FaBars />
      </div>
      <div className={`navbar-center ${menuOpen ? "active" : ""}`}>
        <ul>
          <Link to="/" onClick={handleNavClick} className="nav-links">
            <li>HOME</li>
          </Link>
          <Link
            to="/map"
            onClick={(e) => {
              handleNavClick();
              handleProtectedNavigation(e, "/map");
            }}
            className="nav-links"
          >
            <li>INTERACTIVE MAP</li>
          </Link>
          <Link
            to="/chat"
            onClick={(e) => {
              handleNavClick();
              handleProtectedNavigation(e, "/chat");
            }}
            className="nav-links"
          >
            <li>COMMUNITY CHAT</li>
          </Link>
          <Link
            to="/quiz"
            onClick={(e) => {
              handleNavClick();
              handleProtectedNavigation(e, "/quiz");
            }}
            className="nav-links"
          >
            <li>FIND YOUR PASSION</li>
          </Link>
        </ul>
      </div>

      <div className="navbar-right">
        {!loading &&
          (currentUser ? (
            <div className="user-section">
              <div className="user-details" onClick={toggleDropdown}>
                <div className="avatar">
                  {currentUser.name
                    ? currentUser.name.charAt(0).toUpperCase()
                    : currentUser.email?.charAt(0).toUpperCase() || "?"}
                </div>
                <div>
                  <span className="user-name">
                    {currentUser.name.replace(/^\w/, (c) => c.toUpperCase())}
                  </span>
                </div>
              </div>
              {dropdownOpen && (
                <div className="dropdown-menu">
                  <button className="dropdown-item" onClick={handleLogout}>
                    <FaSignOutAlt /> Logout
                  </button>
                  <button
                    className="dropdown-item"
                    onClick={handleDeleteAccount}
                  >
                    <FaTrash /> Delete Account
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login">
              <button className="membership-btn">SIGN IN</button>
            </Link>
          ))}
      </div>
    </nav>
  );
};

export default Navbar;
