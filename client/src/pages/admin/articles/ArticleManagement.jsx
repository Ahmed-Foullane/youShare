import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../services/api';

const ArticleManagement = () => {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/all-articles');
        setArticles(Array.isArray(response.data) ? response.data : []);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const handleDeleteClick = (article) => {
    setDeleteConfirmation(article);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmation) return;

      await api.delete(`/all-articles/${deleteConfirmation.id}`);
      setArticles(articles.filter(article => article.id !== deleteConfirmation.id));
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
        <h1 className="text-2xl font-bold text-gray-800">Article Management</h1>
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
                Title
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Author
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
             
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {articles.length > 0 ? (
              articles.map(article => (
                <tr key={article.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {article.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <Link to={`/articles/${article.id}`} className="text-blue-600 hover:text-blue-900">
                      {article.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {article.user?.name || 'Unknown user'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {article.category?.name || 'Uncategorized'}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleDeleteClick(article)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                  No articles found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {deleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-full">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Delete Article</h3>
            <p className="mb-6">
              Are you sure you want to delete article "{deleteConfirmation.title}"? This action cannot be undone.
            </p>
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

export default ArticleManagement;
