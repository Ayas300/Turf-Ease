import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';
import logo from '../assets/LOGO-1.png';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isOwner, isAdmin } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    closeMenu();
  };

  return (
    <header className="navbar">
      <div className="navbar-logo">
        <Link to="/" onClick={closeMenu}>
          <img src={logo} alt="Logo" />
        </Link>
      </div>

      <button
        className={`hamburger ${isMenuOpen ? 'active' : ''}`}
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
        <nav className="navbar-links">
          <Link
            to="/"
            className={location.pathname === '/' ? 'active' : ''}
            onClick={closeMenu}
          >
            Home
          </Link>
          <Link
            to="/turfs"
            className={location.pathname === '/turfs' ? 'active' : ''}
            onClick={closeMenu}
          >
            Turfs
          </Link>
          <Link
            to="/blogs"
            className={location.pathname === '/blogs' ? 'active' : ''}
            onClick={closeMenu}
          >
            Blogs
          </Link>
          <Link
            to="/about"
            className={location.pathname === '/about' ? 'active' : ''}
            onClick={closeMenu}
          >
            About Us
          </Link>
          <Link
            to="/contact"
            className={location.pathname === '/contact' ? 'active' : ''}
            onClick={closeMenu}
          >
            Contact Us
          </Link>
        </nav>
        <div className="navbar-divider"></div>
        <div className="navbar-auth">
          {user ? (
            <>
              <Link 
                to={isAdmin ? "/admin-dashboard" : isOwner ? "/owner-dashboard" : "/dashboard"} 
                className="dashboard-link"
                onClick={closeMenu}
              >
                 Dashboard
              </Link>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="login" onClick={closeMenu}>Login</Link>
              <Link to="/signup" className="signup" onClick={closeMenu}>Signup</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;