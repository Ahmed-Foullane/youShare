import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import commentService from '../services/commentService';
import { useAuth } from '../hooks/useAuth';

const Comment = ({ comment, questionOwnerId, onCommentUpdate, onCommentDelete }) => {
  const { currentUser, isAuthenticated } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(comment?.content || '');
  const [votes, setVotes] = useState(comment?.votes || 0);
  const [hasVoted, setHasVoted] = useState(comment?.has_voted || false);
  
  useEffect(() => {
    if (isAuthenticated && comment?.id) {
      const checkVoteStatus = async () => {
        try {
          const response = await commentService.checkUserVoted(comment.id);
          setHasVoted(response.liked);
          setVotes(response.count);
        } catch (error) {
          console.error('Error checking vote status:', error);
        }
      };
      
      checkVoteStatus();
    }
  }, [comment?.id, isAuthenticated]);
  
  const isOwner = currentUser?.id === comment?.user?.id;
  const canAccept = parseInt(currentUser?.id) === parseInt(questionOwnerId);
  const isAccepted = comment?.is_accepted || false;
  

  
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    try {
      const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (e) {
      return 'Invalid date';
    }
  };
  
  const handleVote = async () => {
    if (!isAuthenticated || !comment?.id) return;
    
    const newVotedState = !hasVoted;
    const newVotesCount = newVotedState ? votes + 1 : votes - 1;
    
    setHasVoted(newVotedState);
    setVotes(newVotesCount);
    
    try {
      const response = await commentService.toggleVote(comment.id);
      if (!response.error) {
        setHasVoted(response.liked);
        setVotes(response.count);
      }
    } catch (error) {
      console.error('Error toggling vote:', error);
      setHasVoted(!newVotedState);
      setVotes(newVotedState ? newVotesCount - 1 : newVotesCount + 1);
    }
  };
  
  const handleAccept = async () => {
    if (!comment?.id) return;
    
    const newAcceptedState = !isAccepted;
    
    try {
      onCommentUpdate({ ...comment, is_accepted: newAcceptedState });
      
      const response = await commentService.markAsAccepted(comment.id);
      
      if (response && response.data) {
        onCommentUpdate(response.data);
      }
    } catch (error) {
      console.error('Error toggling accepted status:', error);
      onCommentUpdate({ ...comment, is_accepted: isAccepted });
    }
  };
  
  const handleEdit = () => {
    setIsEditing(true);
  };
  
  const handleCancel = () => {
    setContent(comment?.content || '');
    setIsEditing(false);
  };
  
  const handleSave = async () => {
    if (!comment?.id) return;
    
    try {
      await commentService.updateComment(comment.id, content);
      setIsEditing(false);
      onCommentUpdate({ ...comment, content: content });
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };
  
  const handleDelete = async () => {
    if (!comment?.id) return;
    
    try {
      await commentService.deleteComment(comment.id);
      onCommentDelete(comment.id);
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };
  
  if (!comment) {
    return null;
  }
  
  return (
    <div className={`border-b border-gray-200 py-4 ${isAccepted ? 'bg-green-50' : ''}`}>

      
      <div className="flex">
        <div className="flex flex-col items-center mr-4">
          <button
            onClick={handleVote}
            className={`p-1 rounded ${hasVoted ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
            disabled={!isAuthenticated}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
          <span className="text-sm font-semibold">{votes}</span>
          {isAccepted && (
            <div className="mt-2 text-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
        </div>
        <div className="flex-1">
          {isEditing ? (
            <div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
              />
              <div className="mt-2 flex space-x-2">
                <button
                  onClick={handleSave}
                  className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="text-gray-800 mb-2">{content}</div>
              <div className="flex flex-wrap items-center text-sm text-gray-600">
                {comment?.user && (
                  <div className="mr-4">
                    <Link to={`/users/${comment.user.id}`} className="text-blue-600 hover:text-blue-800">
                      {comment.user.first_name && comment.user.last_name ? 
                        `${comment.user.first_name} ${comment.user.last_name}` : 'Unknown User'}
                    </Link>
                  </div>
                )}
                <div className="mr-4">{formatDate(comment.created_at)}</div>
                {isOwner && (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleEdit}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={handleDelete}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                )}
                {canAccept && (
                  <button
                    onClick={handleAccept}
                    className={`ml-auto px-3 py-1 ${isAccepted ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-green-100 text-green-700 hover:bg-green-200'} rounded-md flex items-center font-medium`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      {isAccepted ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      )}
                    </svg>
                    {isAccepted ? 'Unmark as Answer' : 'Mark as Answer'}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Comment;