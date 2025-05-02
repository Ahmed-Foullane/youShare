import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import articleService from '../../services/articleService';
import { useAuth } from '../../hooks/useAuth';

const ArticleDetail = () => {
  const { id } = useParams();
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likesCount, setLikesCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setIsLoading(true);
        const response = await articleService.getArticleById(id);
        setArticle(response.data);
        setLikesCount(response.data.likes_count);
        setHasLiked(response.data.has_liked);
        
        if (isAuthenticated) {
          try {
            const likeStatusResponse = await articleService.checkUserLiked(id);
            setHasLiked(likeStatusResponse.liked);
            setLikesCount(likeStatusResponse.count);
          } catch (likeError) {
            console.error('Error checking like status:', likeError);
          }
        }
      } catch (err) {
        console.error('Error fetching article:', err);
        setError('Failed to load the article. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchArticle();
  }, [id, isAuthenticated]);
  
  const handleLike = async () => {
    if (!isAuthenticated) return;
    const newLikedState = !hasLiked;
    const newLikesCount = newLikedState ? likesCount + 1 : likesCount - 1;
    
    
    setHasLiked(newLikedState);
    setLikesCount(newLikesCount);
    
    try {
      const response = await articleService.toggleLike(id);      
      if (!response.error) {
        setHasLiked(response.liked);
        setLikesCount(response.count);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      setHasLiked(!newLikedState);
      setLikesCount(newLikedState ? newLikesCount - 1 : newLikesCount + 1);
    }
  };
  
  const handleDelete = async () => {
    try {
      await articleService.deleteArticle(id);
      navigate('/articles');
    } catch (error) {
      console.error('Error deleting article:', error);
      setError('Failed to delete the article. Please try again later.');
    }
  };
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
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
  
  if (!article) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded mb-4">
        Article not found.
      </div>
    );
  }
  
  const isOwner = currentUser?.id === article.user.id;
  const isAdmin = currentUser?.role?.name === 'admin';
  const canEdit = isOwner || isAdmin;
  
  return (
    <div>
      <div className="mb-6">
        <Link to="/articles" className="text-blue-600 hover:text-blue-800 flex items-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 mr-1" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" 
              clipRule="evenodd" 
            />
          </svg>
          Back to Articles
        </Link>
      </div>
      
      <article className="bg-white rounded-lg shadow-lg overflow-hidden">
        {article.image && (
          <div className="w-full h-96 bg-gray-200">
            <img 
              src={`http://127.0.0.1:8000/storage/${article.image.file_path}`}
              alt={article.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                console.error('Image failed to load:', e);
                e.target.src = 'https://via.placeholder.com/800x400?text=Image+Not+Available';
              }}
            />
          </div>
        )}
        
        <div className="p-6">
          <header className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{article.title}</h1>
            
            <div className="flex flex-wrap items-center text-sm text-gray-600 mb-4">
              <Link to={`/users/${article.user.id}`} className="flex items-center mr-4">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white mr-2">
                  {article.user.first_name ? article.user.first_name.charAt(0) : '?'}
                </div>
                <span>{article.user.first_name} {article.user.last_name}</span>
              </Link>
              <span className="mr-4">{formatDate(article.created_at)}</span>
              <Link to={`/categories/${article.category.id}`} className="mr-4">
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  {article.category.name}
                </span>
              </Link>
            </div>
            
            <div className="flex flex-wrap space-x-1">
              {article.tags.map(tag => (
                <Link 
                  key={tag.id} 
                  to={`/articles?tag=${tag.id}`}
                  className="text-xs text-gray-600 bg-gray-100 rounded-full px-2 py-1 mb-1"
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          </header>
          
          <div 
            className="prose max-w-none mb-6"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
          
          <footer className="flex justify-between items-center pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleLike}
                className={`flex items-center space-x-1 ${hasLiked ? 'text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
                disabled={!isAuthenticated}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-6 w-6" 
                  fill={hasLiked ? "currentColor" : "none"} 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
                  />
                </svg>
                <span>{likesCount} {likesCount === 1 ? 'like' : 'likes'}</span>
              </button>
            </div>
            
            {canEdit && (
              <div className="flex space-x-2">
                <Link 
                  to={`/articles/edit/${article.id}`}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Edit
                </Link>
                <button 
                  onClick={() => setShowDeleteModal(true)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            )}
          </footer>
        </div>
      </article>
      
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-full">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Delete Article</h3>
            <p className="mb-6">Are you sure you want to delete this article? This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticleDetail;
