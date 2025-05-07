import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import authService from '../../services/authService';
import articleService from '../../services/articleService';
import questionService from '../../services/questionService';
import ArticleCard from '../../components/ArticleCard';
import QuestionCard from '../../components/QuestionCard';

const ProfilePage = () => {
  const { currentUser, updateUser } = useAuth();
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [activeTab, setActiveTab] = useState('articles');
  const [userArticles, setUserArticles] = useState([]);
  const [userQuestions, setUserQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    promotion_year: '',
    password: '',
    password_confirmation: ''
  });
  const [profileUpdateSuccess, setProfileUpdateSuccess] = useState(false);
  const [profileErrors, setProfileErrors] = useState({});
  
  useEffect(() => {
    const fetchUserContent = async () => {
      if (!currentUser) return;
      
      try {
        setIsLoading(true);
        const [articlesRes, questionsRes] = await Promise.all([
          articleService.getArticlesByUser(currentUser.id),
          questionService.getQuestionsByUser(currentUser.id)
        ]);
        
        setUserArticles(articlesRes.data || []);
        setUserQuestions(questionsRes.data || []);
      } catch (err) {
        console.error('Error fetching user content:', err);
        setError('Failed to load your content. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserContent();
    
    if (currentUser?.profile_image) {
      setPreviewImage(`http://127.0.0.1:8000/storage/${currentUser.profile_image.file_path}`);
    }
    
    if (currentUser) {
      setProfileData({
        first_name: currentUser.first_name || '',
        last_name: currentUser.last_name || '',
        email: currentUser.email || '',
        promotion_year: currentUser.promotion_year || '',
        password: '',
        password_confirmation: ''
      });
    }
  }, [currentUser]);
  
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileErrors({});
    setProfileUpdateSuccess(false);
    
    try {
      const dataToSend = {};
      if (profileData.first_name) dataToSend.first_name = profileData.first_name;
      if (profileData.last_name) dataToSend.last_name = profileData.last_name;
      if (profileData.email) dataToSend.email = profileData.email;
      if (profileData.promotion_year) dataToSend.promotion_year = profileData.promotion_year;
      
      if (profileData.password && profileData.password === profileData.password_confirmation) {
        dataToSend.password = profileData.password;
        dataToSend.password_confirmation = profileData.password_confirmation;
      } else if (profileData.password || profileData.password_confirmation) {
        setProfileErrors({
          password: ['Passwords do not match']
        });
        return;
      }
      
      const response = await authService.updateProfile(dataToSend);
      
      if (response.success) {
        updateUser(response.user);
        setProfileUpdateSuccess(true);
        
        setProfileData(prev => ({
          ...prev,
          password: '',
          password_confirmation: ''
        }));
        
        setTimeout(() => {
          setShowProfileForm(false);
          setProfileUpdateSuccess(false);
        }, 2000);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      if (error.response?.data?.errors) {
        setProfileErrors(error.response.data.errors);
      } else {
        setProfileErrors({
          general: [error.response?.data?.message || 'An error occurred. Please try again later.']
        });
      }
    }
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleImageUpload = async () => {
    if (!profileImage) return;
    
    setIsUploading(true);
    setUploadError(null);
    
    try {
      const formData = new FormData();
      formData.append('profile_image', profileImage);
      
      const response = await authService.updateProfileImage(formData);
      
      if (response.success) {
        updateUser(response.user);
        setProfileImage(null);
      } else {
        setUploadError(response.message || 'Failed to update profile image');
      }
    } catch (error) {
      console.error('Error uploading profile image:', error);
      setUploadError(error.response?.data?.message || 'An error occurred. Please try again later.');
    } finally {
      setIsUploading(false);
    }
  };
  
  if (!currentUser) {
    return (
      <div className="text-center py-10">
        <p className="text-lg mb-4">You need to be logged in to view your profile.</p>
        <Link 
          to="/login" 
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Login
        </Link>
      </div>
    );
  }
  
  return (
    <div>
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start">
          <div className="mb-6 md:mb-0 md:mr-8 text-center">
            <div className="relative w-32 h-32 mx-auto">
              {previewImage ? (
                <img 
                  src={previewImage} 
                  alt={`${currentUser.first_name} ${currentUser.last_name}`} 
                  className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-blue-500 flex items-center justify-center text-white text-4xl">
                  {currentUser.first_name ? currentUser.first_name.charAt(0).toUpperCase() : '?'}
                </div>
              )}
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Change Profile Image
              </label>
              <input
                type="file"
                onChange={handleImageChange}
                className="hidden"
                id="profile-image"
                accept="image/*"
              />
              <label
                htmlFor="profile-image"
                className="cursor-pointer px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 inline-block"
              >
                Choose File
              </label>
              
              {profileImage && (
                <button
                  onClick={handleImageUpload}
                  className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  disabled={isUploading}
                >
                  {isUploading ? 'Uploading...' : 'Upload'}
                </button>
              )}
              
              {uploadError && (
                <div className="text-red-500 text-sm mt-2">{uploadError}</div>
              )}
            </div>
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{currentUser.first_name} {currentUser.last_name}</h1>
            <p className="text-gray-600 mb-4">{currentUser.email}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-gray-100 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{userArticles.length}</div>
                <div className="text-gray-600">Articles</div>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{userQuestions.length}</div>
                <div className="text-gray-600">Questions</div>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{currentUser.score || 0}</div>
                <div className="text-gray-600">Score</div>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
              <Link 
                to="/articles/create" 
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-center"
              >
                Create Article
              </Link>
              <Link 
                to="/questions/create" 
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-center"
              >
                Ask Question
              </Link>
              <button 
                onClick={() => setShowProfileForm(!showProfileForm)}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-center"
              >
                {showProfileForm ? 'Cancel Edit' : 'Edit Profile'}
              </button>
            </div>
            
            {showProfileForm && (
              <div className="bg-white rounded-lg shadow-sm border p-4 mt-4">
                <h2 className="text-lg font-semibold mb-4">Edit Profile Information</h2>
                
                {profileUpdateSuccess && (
                  <div className="bg-green-100 text-green-700 p-2 rounded mb-4">
                    Profile updated successfully!
                  </div>
                )}
                
                {profileErrors.general && (
                  <div className="bg-red-100 text-red-700 p-2 rounded mb-4">
                    {profileErrors.general}
                  </div>
                )}
                
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="first_name"
                      name="first_name"
                      value={profileData.first_name}
                      onChange={handleProfileChange}
                      className={`mt-1 block w-full rounded-md border ${profileErrors.first_name ? 'border-red-500' : 'border-gray-300'} shadow-sm px-3 py-2`}
                    />
                    {profileErrors.first_name && (
                      <p className="text-red-500 text-sm mt-1">{profileErrors.first_name[0]}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="last_name"
                      name="last_name"
                      value={profileData.last_name}
                      onChange={handleProfileChange}
                      className={`mt-1 block w-full rounded-md border ${profileErrors.last_name ? 'border-red-500' : 'border-gray-300'} shadow-sm px-3 py-2`}
                    />
                    {profileErrors.last_name && (
                      <p className="text-red-500 text-sm mt-1">{profileErrors.last_name[0]}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      className={`mt-1 block w-full rounded-md border ${profileErrors.email ? 'border-red-500' : 'border-gray-300'} shadow-sm px-3 py-2`}
                    />
                    {profileErrors.email && (
                      <p className="text-red-500 text-sm mt-1">{profileErrors.email[0]}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="promotion_year" className="block text-sm font-medium text-gray-700">
                      Promotion Year
                    </label>
                    <select
                      id="promotion_year"
                      name="promotion_year"
                      value={profileData.promotion_year}
                      onChange={handleProfileChange}
                      className={`mt-1 block w-full rounded-md border ${profileErrors.promotion_year ? 'border-red-500' : 'border-gray-300'} shadow-sm px-3 py-2`}
                    >
                      {Array.from({ length: new Date().getFullYear() - 2018 + 1 }, (_, i) => 2018 + i).map(year => (
                        <option key={year} value={year.toString()}>{year}</option>
                      ))}
                    </select>
                    {profileErrors.promotion_year && (
                      <p className="text-red-500 text-sm mt-1">{profileErrors.promotion_year[0]}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      New Password (leave blank to keep current)
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={profileData.password}
                      onChange={handleProfileChange}
                      className={`mt-1 block w-full rounded-md border ${profileErrors.password ? 'border-red-500' : 'border-gray-300'} shadow-sm px-3 py-2`}
                    />
                    {profileErrors.password && (
                      <p className="text-red-500 text-sm mt-1">{profileErrors.password[0]}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      id="password_confirmation"
                      name="password_confirmation"
                      value={profileData.password_confirmation}
                      onChange={handleProfileChange}
                      className={`mt-1 block w-full rounded-md border ${profileErrors.password_confirmation ? 'border-red-500' : 'border-gray-300'} shadow-sm px-3 py-2`}
                    />
                    {profileErrors.password_confirmation && (
                      <p className="text-red-500 text-sm mt-1">{profileErrors.password_confirmation[0]}</p>
                    )}
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex border-b border-gray-200">
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'articles' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('articles')}
          >
            Articles
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'questions' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('questions')}
          >
            Questions
          </button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-lg font-medium text-white">Loading...</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      ) : activeTab === 'articles' ? (
        userArticles.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-8 rounded-lg text-center">
            <h3 className="text-lg font-medium mb-2">No articles yet</h3>
            <p className="text-yellow-600 mb-4">Share your knowledge by creating your first article!</p>
            <Link 
              to="/articles/create" 
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Create Article
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userArticles.map(article => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )
      ) : (
        userQuestions.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-8 rounded-lg text-center">
            <h3 className="text-lg font-medium mb-2">No questions yet</h3>
            <p className="text-yellow-600 mb-4">Got something to ask? Post your first question!</p>
            <Link 
              to="/questions/create" 
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Ask Question
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {userQuestions.map(question => (
              <QuestionCard key={question.id} question={question} />
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default ProfilePage;
