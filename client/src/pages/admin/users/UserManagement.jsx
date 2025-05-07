import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../services/api';
import { useAuth } from '../../../hooks/useAuth';

const UserManagement = () => {
  const { isAdmin, currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [roleChangeModal, setRoleChangeModal] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [usersResponse, rolesResponse] = await Promise.all([
          api.get('/users'),
          api.get('/roles')
        ]);
        
        setUsers(Array.isArray(usersResponse.data) ? usersResponse.data : []);
        setRoles(Array.isArray(rolesResponse.data) ? rolesResponse.data : []);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load users. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDeleteClick = (user) => {
    // Don't allow deleting admin users or the current user
    if (user.role?.name === 'admin' || user.id === currentUser?.id) {
      return;
    }
    setDeleteConfirmation(user);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmation) return;

    try {
      await api.delete(`/users/${deleteConfirmation.id}`);
      setUsers(users.filter(user => user.id !== deleteConfirmation.id));
      setDeleteConfirmation(null);
      // Clear error message when successful
      setError(null);
    } catch (err) {
      console.error('Error deleting user:', err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to delete user. Please try again later.');
      }
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmation(null);
  };

  const handleRoleChangeClick = (user) => {
    // Don't allow changing role for current user
    if (user.id === currentUser?.id) {
      return;
    }
    setRoleChangeModal(user);
  };

  const confirmRoleChange = async (newRoleId) => {
    if (!roleChangeModal) return;

    try {
      const response = await api.put(`/users/${roleChangeModal.id}/role`, { role_id: newRoleId });
      
      // Update the user in the users array
      setUsers(users.map(user => 
        user.id === roleChangeModal.id ? response.data.user : user
      ));
      
      setRoleChangeModal(null);
      setError(null);
    } catch (err) {
      console.error('Error changing user role:', err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to change user role. Please try again later.');
      }
    }
  };

  const cancelRoleChange = () => {
    setRoleChangeModal(null);
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
        <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
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
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.length > 0 ? (
              users.map(user => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role?.name === 'admin' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                        {user.role?.name || 'No role'}
                      </span>
                      {user.id !== currentUser?.id && (
                        <button 
                          onClick={() => handleRoleChangeClick(user)}
                          className="ml-2 text-indigo-600 hover:text-indigo-900 text-sm"
                        >
                          Change
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => handleDeleteClick(user)}
                      className="text-red-600 hover:text-red-900"
                      disabled={user.role?.name === 'admin' || user.id === currentUser?.id}
                    >
                      {user.role?.name === 'admin' || user.id === currentUser?.id ? 'Cannot Delete' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-full">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Delete User</h3>
            <p className="mb-6">
              Are you sure you want to delete user "{deleteConfirmation.name}"? This action cannot be undone.
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

      {/* Role Change Modal */}
      {roleChangeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-full">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Change User Role</h3>
            <p className="mb-4">
              Change role for user <span className="font-semibold">{roleChangeModal.name}</span> ({roleChangeModal.email}):
            </p>
            <div className="mb-6">
              {roles.map(role => (
                <div key={role.id} className="mb-2">
                  <button
                    className={`w-full text-left px-4 py-2 rounded-md ${roleChangeModal.role_id === role.id ? 'bg-blue-100 border border-blue-500' : 'bg-gray-100 hover:bg-gray-200'}`}
                    onClick={() => confirmRoleChange(role.id)}
                  >
                    <span className={`font-medium ${role.name === 'admin' ? 'text-red-600' : 'text-green-600'}`}>
                      {role.name.charAt(0).toUpperCase() + role.name.slice(1)}
                    </span>
                    {roleChangeModal.role_id === role.id && ' (Current)'}
                  </button>
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              <button
                onClick={cancelRoleChange}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;