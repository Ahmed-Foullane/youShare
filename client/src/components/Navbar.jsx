import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import authService from '../services/authService';

const Navbar = () => {
  const { currentUser, isAuthenticated, isAdmin, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [showAdminLink, setShowAdminLink] = useState(false);
  
  useEffect(() => {
    // Set from the Auth context
    setShowAdminLink(isAdmin);
    
    // Double-check from localStorage as a backup
    if (!isAdmin) {
      const localStorageAdmin = authService.isAdmin();
      if (localStorageAdmin) {
        setShowAdminLink(true);
      }
    }
  }, [isAdmin]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className="bg-gray-800 shadow-md border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-white font-bold text-xl">YouShare</span>
            </Link>
            <div className="hidden md:ml-6 md:flex md:space-x-4">
              <Link to="/" className="text-white hover:bg-blue-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                Home
              </Link>
              <Link to="/articles" className="text-white hover:bg-blue-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                Articles
              </Link>
              <Link to="/questions" className="text-white hover:bg-blue-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                Questions
              </Link>
             
              {showAdminLink && (
                <Link to="/admin" className="text-white hover:bg-blue-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  Admin
                </Link>
              )}
            </div>
          </div>
          <div className="hidden md:flex md:items-center">
            {isAuthenticated ? (
              <div className="ml-3 relative">
                <div>
                  <button
                    onClick={toggleProfileMenu}
                    className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
                  >
                    <div className="h-8 w-8 rounded-full bg-blue-400 flex items-center justify-center text-white">
                      {currentUser?.profile_image ? (
                        <img 
                          src={`http://127.0.0.1:8000/storage/${currentUser.profile_image.file_path}`} 
                          alt={`${currentUser.first_name} ${currentUser.last_name}`} 
                          className="h-8 w-8 rounded-full"
                        />
                      ) : (
                        <span>{currentUser?.first_name ? currentUser.first_name.charAt(0).toUpperCase() : '?'}</span>
                      )}
                    </div>
                  </button>
                </div>
                {isProfileMenuOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-gray-800 ring-1 ring-gray-700 ring-opacity-5">
                    <div className="px-4 py-2 text-sm text-gray-300 border-b border-gray-700">
                      {currentUser?.first_name} {currentUser?.last_name}
                    </div>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                    >
                      Your Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-gray-200 bg-gray-700 hover:bg-gray-600 rounded-md"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
          <div className="-mr-2 flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link
            to="/"
            className="text-white hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium"
          >
            Home
          </Link>
          <Link
            to="/articles"
            className="text-white hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium"
          >
            Articles
          </Link>
          <Link
            to="/questions"
            className="text-white hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium"
          >
            Questions
          </Link>
          {showAdminLink && (
            <Link
              to="/admin"
              className="text-white hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium"
            >
              Admin
            </Link>
          )}
        </div>
        <div className="pt-4 pb-3 border-t border-blue-700">
          {isAuthenticated ? (
            <>
              <div className="flex items-center px-5">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-blue-400 flex items-center justify-center text-white">
                    {currentUser?.profile_image ? (
                      <img 
                        src={`http://127.0.0.1:8000/storage/${currentUser.profile_image.file_path}`} 
                        alt={`${currentUser.first_name} ${currentUser.last_name}`} 
                        className="h-10 w-10 rounded-full"
                      />
                    ) : (
                      <span>{currentUser?.first_name ? currentUser.first_name.charAt(0).toUpperCase() : '?'}</span>
                    )}
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-white">
                    {currentUser?.first_name} {currentUser?.last_name}
                  </div>
                  <div className="text-sm font-medium text-blue-300">
                    {currentUser?.email}
                  </div>
                </div>
              </div>
              <div className="mt-3 px-2 space-y-1">
                <Link
                  to="/profile"
                  className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-blue-700"
                >
                  Your Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:bg-blue-700"
                >
                  Sign out
                </button>
              </div>
            </>
          ) : (
            <div className="mt-3 px-2 space-y-1">
              <Link
                to="/login"
                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-blue-700"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-blue-700"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
