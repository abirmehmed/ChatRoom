import React from 'react';
import { User } from '../types';
import { Image } from 'lucide-react';

interface UserProfileProps {
  user: User;
  isCurrentUser: boolean;
  onSelect: () => void;
  onUpdateAvatar: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, isCurrentUser, onSelect, onUpdateAvatar }) => {
  return (
    <div
      className={`flex items-center p-2 rounded-lg cursor-pointer ${
        isCurrentUser ? 'bg-gray-700' : 'hover:bg-gray-700'
      }`}
      onClick={onSelect}
    >
      <div className="relative">
        <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full mr-3" />
        <button
          className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-1 hover:bg-blue-700"
          onClick={(e) => {
            e.stopPropagation();
            onUpdateAvatar();
          }}
        >
          <Image size={12} />
        </button>
      </div>
      <span className="font-medium">{user.name}</span>
    </div>
  );
};

export default UserProfile;