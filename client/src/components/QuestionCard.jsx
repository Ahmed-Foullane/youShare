import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import questionService from '../services/questionService';
import { useAuth } from '../hooks/useAuth';

const QuestionCard = ({ question }) => {
  const { isAuthenticated } = useAuth();
  const [votesCount, setVotesCount] = useState(question.votes);
  const [hasVoted, setHasVoted] = useState(question.has_voted);

  useEffect(() => {
    if (isAuthenticated) {
      const checkVoteStatus = async () => {
        try {
          const response = await questionService.checkUserVoted(question.id);
          setHasVoted(response.liked);
          setVotesCount(response.count);
        } catch (error) {
          console.error('Error checking vote status:', error);
        }
      };
      
      checkVoteStatus();
    }
  }, [question.id, isAuthenticated]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleVote = async () => {
    if (!isAuthenticated) {
      return;
    }

    try {
      const response = await questionService.toggleVote(question.id);
      if (!response.error) {
        setHasVoted(response.liked);
        setVotesCount(response.count);
      }
    } catch (error) {
      console.error('Error toggling vote:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4 hover:shadow-lg transition-shadow duration-300">
      {question.image && (
        <Link to={`/questions/${question.id}`}>
          <div className="w-full h-48 bg-gray-200">
            <img
              src={`http://127.0.0.1:8000/storage/${question.image.file_path}`}
              alt={question.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                console.error('Card image failed to load:', question.image);
                e.target.src = 'https://via.placeholder.com/800x400?text=No+Image';
              }}
            />
          </div>
        </Link>
      )}
      <div className="p-4">
        <div className="flex items-start">
        <div className="mr-4 flex flex-col items-center">
          <button 
            onClick={handleVote}
            className={`flex flex-col items-center p-2 rounded-lg ${hasVoted ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
            disabled={!isAuthenticated}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 15l7-7 7 7" 
              />
            </svg>
            <span className="text-sm font-medium">{votesCount}</span>
          </button>
          <div className="mt-2 text-xs text-gray-500">
            {question.comments_count} {question.comments_count === 1 ? 'answer' : 'answers'}
          </div>
        </div>
        <div className="flex-1">
          <Link to={`/questions/${question.id}`}>
            <h3 className="text-lg font-medium text-blue-600 hover:text-blue-800 mb-2">
              {question.title}
            </h3>
          </Link>
          <div className="text-sm text-gray-700 mb-3 line-clamp-2">
            {question.description}
          </div>
          <div className="flex flex-wrap mb-3">
            {question.tags && question.tags.map(tag => (
              <Link 
                key={tag.id}
                to={`/tags/${tag.id}`}
                className="text-xs text-gray-600 bg-gray-100 rounded-full px-2 py-1 mr-2 mb-1"
              >
                #{tag.name}
              </Link>
            ))}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Link to={`/users/${question.user.id}`} className="text-blue-600 hover:text-blue-800">
              {question.user.first_name} {question.user.last_name}
            </Link>
            <span className="mx-2">•</span>
            <span>{formatDate(question.created_at)}</span>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default QuestionCard;
