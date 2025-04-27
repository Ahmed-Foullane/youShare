import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import articleService from '../services/articleService';
import { useAuth } from '../hooks/useAuth';

const ArticleCard = ({ article }) => {
  const { isAuthenticated } = useAuth();
  const [likesCount, setLikesCount] = useState(article.likes_count);
  const [hasLiked, setHasLiked] = useState(article.has_liked);

useEffect(() => {
    if (isAuthenticated) {
      const checkLikeStatus = async () => {
        try {
          const response = await articleService.checkUserLiked(article.id);
          setHasLiked(response.liked);
          setLikesCount(response.count);
        } catch (error) {
          console.error('Error checking like status:', error);
        }
      };
      checkLikeStatus();
    }

}, [article.id, isAuthenticated]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      return;
    }

    try {
      const response = await articleService.toggleLike(article.id);
      if (!response.error) {
        setHasLiked(response.liked);
        setLikesCount(response.count);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {article.image && (
        <Link to={`/articles/${article.id}`}>
          <img
            src={`http://127.0.0.1:8000/storage/${article.image.file_path}`}
            alt={article.title}
            className="w-full h-48 object-cover"
          />
        </Link>
      )}
      <div className="p-4">
        <Link to={`/articles/${article.id}`}>
          <h2 className="text-xl font-semibold text-gray-800 mb-2 hover:text-blue-600">
            {article.title}
          </h2>
        </Link>
        <div className="flex items-center text-sm text-gray-600 mb-3">
          <span>By {article.user ? article.user.name : 'Unknown Author'}</span>
          <span className="mx-2">•</span>
          <span>{formatDate(article.created_at)}</span>
        </div>
        <div className="mb-3">
          {article.category ? (
            <Link 
              to={`/categories/${article.category.id}`}
              className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
            >
              {article.category.name}
            </Link>
          ) : (
            <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
              Uncategorized
            </span>
          )}
        </div>
        <div className="flex flex-wrap mb-3">
          {article.tags && article.tags.map(tag => (
            <Link 
              key={tag.id}
              to={`/tags/${tag.id}`}
              className="text-xs text-gray-600 bg-gray-100 rounded-full px-2 py-1 mr-2 mb-1"
            >
              #{tag.name}
            </Link>
          ))}
        </div>
        <div className="flex justify-between items-center mt-4">
          <button 
            onClick={handleLike}
            className={`flex items-center text-sm ${hasLiked ? 'text-blue-600' : 'text-gray-600'}`}
            disabled={!isAuthenticated}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 mr-1" 
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
          <Link 
            to={`/articles/${article.id}`}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Read more →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
