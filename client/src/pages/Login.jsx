import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = ['Email is required'];
    } else if (!EMAIL_REGEX.test(formData.email)) {
      newErrors.email = ['Please enter a valid email address'];
    }
    
    if (!formData.password) {
      newErrors.password = ['Password is required'];
    } else if (formData.password.length < 6) {
      newErrors.password = ['Password must be at least 6 characters'];
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await login(formData);
      if (result.success) {
        navigate('/');
      } else if (result.errors) {
        setErrors(result.errors);
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errors) {
        setErrors(err.response.data.errors);
      } else {
        setErrors({ email: ['Invalid credentials. Please try again.'] });
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-center text-white mb-6">Login to YouShare</h1>
      
      <form onSubmit={handleSubmit} className="bg-gray-800 shadow-md rounded-lg px-8 pt-6 pb-8 mb-4 border border-gray-700">
        <div className="mb-4">
          <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            type="text"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`shadow appearance-none border border-gray-600 bg-gray-700 rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 ${errors.email ? 'border-red-500' : ''}`}
            placeholder="Enter your email"
          />
          {errors.email && (
            <p className="text-red-500 text-xs italic mt-1">{errors.email[0]}</p>
          )}
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`shadow appearance-none border border-gray-600 bg-gray-700 rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 ${errors.password ? 'border-red-500' : ''}`}
            placeholder="Enter your password"
          />
          {errors.password && (
            <p className="text-red-500 text-xs italic mt-1">{errors.password[0]}</p>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
          <Link
            to="/forgot-password"
            className="inline-block align-baseline font-bold text-sm text-blue-400 hover:text-blue-300"
          >
            Forgot Password?
          </Link>
        </div>
      </form>
      
      <div className="text-center">
        <span className="text-gray-400">Don't have an account? </span>
        <Link to="/register" className="text-blue-400 hover:text-blue-300 font-bold">
          Register
        </Link>
      </div>
    </div>
  );
};

export default Login;