import React from 'react';
import { Link } from 'react-router-dom';
import userService from '../services/userService';

const UserCard = ({ user }) => {
  const handleAddFriend = async (e) => {
    e.preventDefault();
    try {
      await userService.addFriend(user.id);
      alert('Friend request functionality will be implemented in the future!');
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };

  // Get initials from name for avatar
  const getInitials = (firstName, lastName) => {
    if (!firstName && !lastName) return 'U';
    return `${firstName ? firstName[0] : ''}${lastName ? lastName[0] : ''}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
      <div className="relative mb-4">
        {user.profileImage ? (
          <img 
            src={`http://127.0.0.1:8000/storage/${user.profileImage.file_path}`}
            alt={`${user.first_name} ${user.last_name}`}
            className="w-24 h-24 rounded-full object-cover border-4 border-blue-100"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold border-4 border-blue-100">
            {getInitials(user.first_name, user.last_name)}
          </div>
        )}
      </div>
      
      <h3 className="text-xl font-semibold text-gray-800 mb-4">{user.first_name} {user.last_name}</h3>
      
      <div className="flex space-x-2 w-full">
        <Link 
          to={`/profile/${user.id}`}
          className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 text-center rounded-md hover:bg-blue-100 transition-colors"
        >
          View Profile
        </Link>
        <button
          onClick={handleAddFriend}
          className="flex-1 px-3 py-2 bg-blue-600 text-white text-center rounded-md hover:bg-blue-700 transition-colors"
        >
          Add Friend
        </button>
      </div>
    </div>
  );
};

export default UserCard;