import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import api from '../../../services/api';

const TagManagement = () => {
  const { isAdmin } = useAuth();
  const [tags, setTags] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [newTag, setNewTag] = useState({ name: '' });
  const [editingTag, setEditingTag] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/admin-tags');
        setTags(Array.isArray(response.data.data) ? response.data.data : []);
      } catch (err) {
        console.error('Error fetching tags:', err);
        setError('Failed to load tags. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTags();
  }, []);

  const handleDeleteClick = (tag) => {
    setDeleteConfirmation(tag);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmation) return;

    try {
      await api.delete(`/tags/${deleteConfirmation.id}`);
      setTags(tags.filter(tag => tag.id !== deleteConfirmation.id));
      setDeleteConfirmation(null);
    } catch (err) {
      console.error('Error deleting tag:', err);
      setError('Failed to delete tag. Please try again later.');
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmation(null);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await api.post('/tags', newTag);
      if (response.data && response.data.data) {
        setTags([...tags, response.data.data]);
        setNewTag({ name: '' });
      } else {
        throw new Error('Invalid server response format');
      }
    } catch (err) {
   
      if (err.response && err.response.data && err.response.data.errors) {
        const errorMessages = Object.values(err.response.data.errors).flat().join(', ');
        setError(errorMessages || 'Failed to create tag. Please try again later.');
      } else {
        setError('Failed to create tag. Please try again later.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (tag) => {
    setEditingTag({ ...tag });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await api.put(`/tags/${editingTag.id}`, editingTag);
      if (response.data && response.data.data) {
        setTags(tags.map(t => 
          t.id === editingTag.id ? response.data.data : t
        ));
        setEditingTag(null);
      } else {
        throw new Error('Invalid server response format');
      }
    } catch (err) {
      console.error('Error updating tag:', err);
      // Show validation errors if available
      if (err.response && err.response.data && err.response.data.errors) {
        const errorMessages = Object.values(err.response.data.errors).flat().join(', ');
        setError(errorMessages || 'Failed to update tag. Please try again later.');
      } else {
        setError('Failed to update tag. Please try again later.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const cancelEdit = () => {
    setEditingTag(null);
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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Tag Management</h1>
        <Link to="/admin" className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md">
          Back to Dashboard
        </Link>
      </div>

      {/* Create Tag Form */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Create New Tag</h2>
        <form onSubmit={handleCreateSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              placeholder="Tag name"
              value={newTag.name}
              onChange={(e) => setNewTag({ ...newTag, name: e.target.value })}
              required
            />
          </div>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Tag'}
          </button>
        </form>
      </div>

      {/* Tags List */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tags.length > 0 ? (
              tags.map(tag => (
                <tr key={tag.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {tag.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {tag.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditClick(tag)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(tag)}
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
                <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">
                  No tags found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Tag Modal */}
      {editingTag && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-full">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Edit Tag</h3>
            <form onSubmit={handleUpdateSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-name">
                  Name
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="edit-name"
                  type="text"
                  value={editingTag.name}
                  onChange={(e) => setEditingTag({ ...editingTag, name: e.target.value })}
                  required
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-full">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Delete Tag</h3>
            <p className="mb-6">
              Are you sure you want to delete tag "{deleteConfirmation.name}"? This action cannot be undone.
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

export default TagManagement;
