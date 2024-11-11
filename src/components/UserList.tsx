import React from 'react';
import { User } from '../types';
import { Plus, Trash, Image, Edit2, Palette } from 'lucide-react';

interface UserListProps {
  users: User[];
  onAddUser: () => void;
  onDeleteUser: (userId: string) => void;
  onUpdateAvatar: (userId: string) => void;
  onUpdateName: (userId: string) => void;
  onUpdateColor: (userId: string) => void;
  onSelectUser: (userId: string) => void;
  selectedUserId: string | null;
}

const UserList: React.FC<UserListProps> = ({
  users,
  onAddUser,
  onDeleteUser,
  onUpdateAvatar,
  onUpdateName,
  onUpdateColor,
  onSelectUser,
  selectedUserId
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {users.map((user) => (
          <div
            key={user.id}
            className={`group flex items-center justify-between bg-gray-700 p-2 rounded-lg cursor-pointer ${
              selectedUserId === user.id ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => onSelectUser(user.id)}
          >
            <div className="flex items-center">
              <div className="relative">
                <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full mr-2" />
                <button
                  className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-1 hover:bg-blue-700 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpdateAvatar(user.id);
                  }}
                >
                  <Image size={8} />
                </button>
              </div>
              <span>{user.name}</span>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                className="text-blue-400 hover:text-blue-300"
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdateName(user.id);
                }}
              >
                <Edit2 size={16} />
              </button>
              <button
                className="text-purple-400 hover:text-purple-300"
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdateColor(user.id);
                }}
              >
                <Palette size={16} />
              </button>
              <button
                className="text-red-400 hover:text-red-300"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteUser(user.id);
                }}
              >
                <Trash size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
      <button
        className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center"
        onClick={onAddUser}
      >
        <Plus size={20} className="mr-1" /> Add Member
      </button>
    </div>
  );
};

export default UserList;