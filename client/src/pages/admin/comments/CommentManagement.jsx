import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import adminService from '../../../services/adminService';


const CommentManagement = () => {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setIsLoading(true);
        const data = await adminService.getAllComments();
        setComments(Array.isArray(data) ? data : []);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, []);


  const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const handleDeleteClick = (comment) => {
    setDeleteConfirmation(comment);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmation) return;
      await adminService.deleteComment(deleteConfirmation.id);
      setComments(comments.filter(comment => comment.id !== deleteConfirmation.id));
      setDeleteConfirmation(null);
    
  };

  const cancelDelete = () => {
    setDeleteConfirmation(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg font-medium text-white">Loading...</p>
      </div>
    );
  }


  

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Comment Management</h1>
        <Link to="/admin" className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md">
          Back to Dashboard
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Content
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Author
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Question
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {comments.length > 0 ? (
              comments.map(comment => (
                <tr key={comment.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {comment.id}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {truncateText(comment.content)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {comment.user?.name || 'Unknown user'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {comment.question ? (
                      <Link to={`/questions/${comment.question.id}`} className="text-blue-600 hover:text-blue-900">
                        {truncateText(comment.question.title, 30)}
                      </Link>
                    ) : (
                      'Unknown question'
                    )}
                  </td>
                
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => handleDeleteClick(comment)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                  No comments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {deleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-full">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Delete Comment</h3>
            <p className="mb-2">Are you sure you want to delete this comment?</p>
            <div className="bg-gray-100 p-3 rounded mb-4">
              <p className="text-sm text-gray-800">{deleteConfirmation.content}</p>
            </div>
            <p className="mb-6 text-sm">This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
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

export default CommentManagement;
