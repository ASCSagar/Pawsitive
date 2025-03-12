import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import logo from "../../images/logo.png"; // Import your logo
import BottomNavigation from "./BottomNavigation"; // Import the new component

const Header = () => {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user ? user : null);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    auth.signOut();
    navigate("/login");
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className="bg-lavender-900 text-lavender-100 shadow-lg">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center hover:opacity-90 transition-opacity">
              <img src={logo} alt="Pawsitive Logo" className="h-10 mr-5" />
              <span className="text-2xl font-bold text-white">Pawsitive</span>
            </Link>
            <nav className="hidden md:flex space-x-6">
              {user && (
                <>
                  <NavLink to="/">Home</NavLink>
                  <NavLink to="/dog-resources">Dog Resources</NavLink>
                  <NavLink to="/cat-resources">Cat Resources</NavLink>
                  <NavLink to="/profile">Profile</NavLink>
                  <button
                    onClick={handleLogout}
                    className="text-lavender-200 hover:text-white hover:bg-lavender-700 px-3 py-1 rounded transition-colors"
                  >
                    Logout
                  </button>
                </>
              )}
            </nav>
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-lavender-200 hover:text-white focus:outline-none focus:text-white"
                aria-label="Toggle menu"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
        {isMenuOpen && user && (
          <div className="md:hidden bg-lavender-800">
            <div className="container mx-auto px-4 py-2">
              <MobileNavLink to="/" onClick={() => setIsMenuOpen(false)}>Home</MobileNavLink>
              <MobileNavLink to="/dog-resources" onClick={() => setIsMenuOpen(false)}>Dog Resources</MobileNavLink>
              <MobileNavLink to="/cat-resources" onClick={() => setIsMenuOpen(false)}>Cat Resources</MobileNavLink>
              <MobileNavLink to="/profile" onClick={() => setIsMenuOpen(false)}>Profile</MobileNavLink>
              <button
                onClick={handleLogout}
                className="block w-full text-left py-2 px-4 text-lavender-200 hover:text-white hover:bg-lavender-700 rounded transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </header>
      
      {/* Add the bottom navigation component */}
      {user && <BottomNavigation />}
      
      {/* Add padding to the bottom of the page to account for fixed bottom navigation */}
      {user && <div className="md:hidden pb-16"></div>}
    </>
  );
};

const NavLink = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link
      to={to}
      className={`${
        isActive ? 'text-white bg-lavender-700' : 'text-lavender-200 hover:text-white hover:bg-lavender-700'
      } px-3 py-1 rounded transition-colors`}
    >
      {children}
    </Link>
  );
};

const MobileNavLink = ({ to, onClick, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`block py-2 px-4 ${
        isActive ? 'text-white bg-lavender-700' : 'text-lavender-200 hover:text-white hover:bg-lavender-700'
      } rounded transition-colors`}
    >
      {children}
    </Link>
  );
};

export default Header;