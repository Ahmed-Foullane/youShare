import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const NAME_REGEX = /^[a-zA-Z\s-]{2,30}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const Register = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    password_confirmation: '',
    promotion_year: '2018',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();
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
    
    if (!formData.first_name) {
      newErrors.first_name = ['First name is required'];
    } else if (!NAME_REGEX.test(formData.first_name)) {
      newErrors.first_name = ['First name must contain only letters, spaces, or hyphens (2-30 characters)'];
    }
    if (!formData.last_name) {
      newErrors.last_name = ['Last name is required'];
    } else if (!NAME_REGEX.test(formData.last_name)) {
      newErrors.last_name = ['Last name must contain only letters, spaces, or hyphens (2-30 characters)'];
    }
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
    
    if (formData.password && formData.password_confirmation !== formData.password) {
      newErrors.password_confirmation = ['Passwords do not match'];
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
      const result = await register(formData);
      if (result.success) {
        navigate('/');
      } else if (result.errors) {
        setErrors(result.errors);
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errors) {
        setErrors(err.response.data.errors);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Register for YouShare</h1>
      
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="first_name">
            First Name
          </label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              errors.first_name ? 'border-red-500' : ''
            }`}
            placeholder="Enter your first name"
          />
          {errors.first_name && (
            <p className="text-red-500 text-xs italic mt-1">{errors.first_name[0]}</p>
          )}
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="last_name">
            Last Name
          </label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              errors.last_name ? 'border-red-500' : ''
            }`}
            placeholder="Enter your last name"
          />
          {errors.last_name && (
            <p className="text-red-500 text-xs italic mt-1">{errors.last_name[0]}</p>
          )}
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            type="text"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              errors.email ? 'border-red-500' : ''
            }`}
            placeholder="Enter your email"
          />
          {errors.email && (
            <p className="text-red-500 text-xs italic mt-1">{errors.email[0]}</p>
          )}
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="promotion_year">
            Promotion Year
          </label>
          <select
            id="promotion_year"
            name="promotion_year"
            value={formData.promotion_year}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            {Array.from({ length: new Date().getFullYear() - 2018 + 1 }, (_, i) => 2018 + i).map(year => (
              <option key={year} value={year.toString()}>{year}</option>
            ))}
          </select>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              errors.password ? 'border-red-500' : ''
            }`}
            placeholder="Enter your password"
          />
          {errors.password && (
            <p className="text-red-500 text-xs italic mt-1">{errors.password[0]}</p>
          )}
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password_confirmation">
            Confirm Password
          </label>
          <input
            type="password"
            id="password_confirmation"
            name="password_confirmation"
            value={formData.password_confirmation}
            onChange={handleChange}
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.password_confirmation ? 'border-red-500' : ''}`}
            placeholder="Confirm your password"
          />
          {errors.password_confirmation && (
            <p className="text-red-500 text-xs italic mt-1">{errors.password_confirmation[0]}</p>
          )}
        </div>
        
        <div className="flex items-center justify-center">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Registering...' : 'Register'}
          </button>
        </div>
      </form>
      
      <div className="text-center">
        <span className="text-gray-600">Already have an account? </span>
        <Link to="/login" className="text-blue-600 hover:text-blue-800 font-bold">
          Login
        </Link>
      </div>
    </div>
  );
};

export default Register;