import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import questionService from '../../services/questionService';
import commentService from '../../services/commentService';
import Comment from '../../components/Comment';
import { useAuth } from '../../hooks/useAuth';

const QuestionDetail = () => {
  const { id } = useParams();
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [question, setQuestion] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [votesCount, setVotesCount] = useState(0);
  const [hasVoted, setHasVoted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  
  
  
  useEffect(() => {
    const fetchQuestionData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch question details and comments separately to handle errors independently
        try {
          const questionRes = await questionService.getQuestionById(id);
          setQuestion(questionRes.data);
          setVotesCount(questionRes.data.votes);
          setHasVoted(questionRes.data.has_voted);
          
          // Double-check vote status if user is authenticated
          if (isAuthenticated) {
            try {
              const voteStatusResponse = await questionService.checkUserVoted(id);
              setHasVoted(voteStatusResponse.liked);
              setVotesCount(voteStatusResponse.count);
            } catch (voteError) {
              console.error('Error checking vote status:', voteError);
            }
          }
        } catch (questionErr) {
          console.error('Error fetching question details:', questionErr);
          setError('Failed to load the question details. Please try again later.');
        }
        
        try {
          const commentsRes = await questionService.getComments(id);
          setComments(Array.isArray(commentsRes.data) ? commentsRes.data : []);
        } catch (commentsErr) {
          console.error('Error fetching comments:', commentsErr);
          setComments([]);
        }
      } catch (err) {
        console.error('Error in fetchQuestionData:', err);
        setError('Failed to load content. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchQuestionData();
  }, [id, isAuthenticated]);
  
  const handleVote = async () => {
    if (!isAuthenticated) return;
    
    // Optimistically update UI first
    const newVotedState = !hasVoted;
    const newVotesCount = newVotedState ? votesCount + 1 : votesCount - 1;
    
    setHasVoted(newVotedState);
    setVotesCount(newVotesCount);
    
    try {
      const response = await questionService.toggleVote(id);
      if (!response.error) {
        // Update with actual server response
        setHasVoted(response.liked);
        setVotesCount(response.count);
      }
    } catch (error) {
      console.error('Error toggling vote:', error);
      // Revert to previous state if there was an error
      setHasVoted(!newVotedState);
      setVotesCount(newVotedState ? newVotesCount - 1 : newVotesCount + 1);
    }
  };
  
  const handleDelete = async () => {
    try {
      await questionService.deleteQuestion(id);
      navigate('/questions');
    } catch (error) {
      console.error('Error deleting question:', error);
      setError('Failed to delete the question. Please try again later.');
    }
  };
  
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    
    if (!newComment.trim() || !isAuthenticated) {
      return;
    }
    
    try {
      setIsSubmittingComment(true);
      const response = await questionService.addComment(id, newComment);
      setComments(prevComments => [...prevComments, response.data]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
      setError('Failed to add your comment. Please try again later.');
    } finally {
      setIsSubmittingComment(false);
    }
  };
  
  const handleUpdateComment = (updatedComment) => {    
    if (updatedComment.is_accepted) {
      setComments(prevComments => 
        prevComments.map(comment => 
          comment.id === updatedComment.id 
            ? updatedComment 
            : { ...comment, is_accepted: false }
        )
      );
    } else {
      setComments(prevComments => 
        prevComments.map(comment => 
          comment.id === updatedComment.id ? updatedComment : comment
        )
      );
    }
  };
  
  const handleDeleteComment = (commentId) => {
    setComments(prevComments => 
      prevComments.filter(comment => comment.id !== commentId)
    );
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
  
  if (!question) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded mb-4">
        Question not found.
      </div>
    );
  }
  
  const isOwner = currentUser?.id === question?.user?.id;
  const isAdmin = currentUser?.role?.name === 'admin';
  const canEdit = isOwner || isAdmin;

  
  return (
    <div>
      <div className="mb-6">
        <Link to="/questions" className="text-blue-600 hover:text-blue-800 flex items-center">
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
          Back to Questions
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
        {question.image && (
          <div className="w-full h-96 bg-gray-200">
            <img 
              src={`http://127.0.0.1:8000/storage/${question.image.file_path}`}
              alt={question.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                console.error('Question image failed to load:', e);
                e.target.src = 'https://via.placeholder.com/800x400?text=Image+Not+Available';
              }}
            />
          </div>
        )}
        <div className="p-6">
          <div className="flex">
            <div className="mr-6 flex flex-col items-center">
              <button 
                onClick={handleVote}
                className={`p-2 rounded-lg ${hasVoted ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
                disabled={!isAuthenticated}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-8 w-8" 
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
              </button>
              <span className="text-xl font-semibold my-2">{votesCount}</span>
              <div className="text-sm text-gray-500">
                {comments.length} {comments.length === 1 ? 'answer' : 'answers'}
              </div>
            </div>
            
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">{question.title}</h1>
              
              <div 
                className="prose max-w-none mb-6"
                dangerouslySetInnerHTML={{ __html: question.description }}
              />
              
              <div className="flex flex-wrap mb-4">
                {question?.tags && Array.isArray(question.tags) && question.tags.map(tag => (
                  <Link 
                    key={tag.id} 
                    to={`/questions?tag=${tag.id}`}
                    className="text-sm text-gray-600 bg-gray-100 rounded-full px-3 py-1 mr-2 mb-2"
                  >
                    #{tag.name}
                  </Link>
                ))}
              </div>
              
                <div className="flex items-center justify-between text-sm text-gray-600 border-t border-gray-200 pt-4">
                  <div className="flex items-center">
                    {question?.user && (
                      <>
                        <Link to={`/users/${question.user.id}`} className="flex items-center text-blue-600 hover:text-blue-800">
                          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white mr-2">
                            {question.user.name?.charAt(0) || 'U'}
                          </div>
                          <span>{question.user.name || 'Unknown User'}</span>
                        </Link>
                        <span className="mx-2">•</span>
                      </>
                    )}
                    <span>Asked on {question.created_at ? formatDate(question.created_at) : 'Unknown date'}</span>
                  </div>
                  
                  {canEdit && (
                    <div className="flex space-x-2">
                      <Link 
                        to={`/questions/edit/${question.id}`}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
                      >
                        Edit
                      </Link>
                      <button 
                        onClick={() => setShowDeleteModal(true)}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            {comments.length} {comments.length === 1 ? 'Answer' : 'Answers'}
          </h2>
          
          {comments.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <p className="text-lg mb-2">No answers yet</p>
              <p className="mb-4">Be the first to answer this question!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {comments.map(comment => {
  
                
                return (
                  <Comment 
                    key={comment.id} 
                    comment={comment} 
                    questionOwnerId={question.user_id} 
                    onCommentUpdate={handleUpdateComment}
                    onCommentDelete={handleDeleteComment}
                  />
                );
              })}
              

            </div>
          )}
        </div>
      </div>
      
      {isAuthenticated ? (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Your Answer</h2>
            
            <form onSubmit={handleSubmitComment}>
              <div className="mb-4">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={6}
                  placeholder="Write your answer here..."
                  
                />
              </div>
              
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                disabled={isSubmittingComment}
              >
                {isSubmittingComment ? 'Posting...' : 'Post Your Answer'}
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 p-4 rounded-lg text-center">
          <p className="mb-2">You need to be logged in to answer this question.</p>
          <div className="flex justify-center space-x-2">
            <Link 
              to="/login" 
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Login
            </Link>
            <Link 
              to="/register" 
              className="px-4 py-2 bg-white border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50"
            >
              Register
            </Link>
          </div>
        </div>
      )}
      
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-full">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Delete Question</h3>
            <p className="mb-6 text-gray-700">Are you sure you want to delete this question? This action cannot be undone and will remove all associated answers.</p>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 font-medium"
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium"
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

export default QuestionDetail;