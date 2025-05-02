import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import UserCard from '../components/UserCard';
import userService from '../services/userService';
import { useAuth } from '../hooks/useAuth';

const Home = () => {
  const { isAuthenticated, currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        try {
          const usersData = await userService.getAllUsers();
          const filteredUsers = Array.isArray(usersData) 
            ? usersData.filter(user => user.id !== currentUser?.id)
            : [];
          setUsers(filteredUsers);
        } catch (usersErr) {
          setUsers([]);
        }
      } catch (err) {
        setError('Failed to load content. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, currentUser?.id]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">Welcome to YouShare</h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl">
          A platform for students to share knowledge, ask questions, and connect with peers.
        </p>
        <div className="flex space-x-4">
          <Link 
            to="/login" 
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Login
          </Link>
          <Link 
            to="/register" 
            className="px-6 py-3 bg-white text-blue-600 font-medium rounded-lg border border-blue-600 hover:bg-blue-50 transition-colors"
          >
            Register
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg font-medium text-white">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className="bg-blue-600 text-white rounded-lg p-8 mb-8">
        <h1 className="text-3xl font-bold mb-4">Welcome back, {currentUser?.name}!</h1>
        <p className="text-lg mb-6">
          Connect with other users and build your network.
        </p>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <Link 
            to="/articles" 
            className="px-6 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-gray-100 transition-colors text-center"
          >
            View Articles
          </Link>
          <Link 
            to="/questions" 
            className="px-6 py-3 bg-blue-700 text-white font-medium rounded-lg hover:bg-blue-800 transition-colors text-center"
          >
            View Questions
          </Link>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Search Users</h2>
        <div className="w-full">
          <SearchBar type="users" placeholder="Search users by name..." />
        </div>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Connect with Users</h2>
        </div>
        {Array.isArray(users) && users.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {users.map(user => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 p-6 text-center text-gray-500 rounded-lg">
            No other users available to connect with
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;