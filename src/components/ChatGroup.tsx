import React from 'react';
import { ChatGroup } from '../types';
import { Image } from 'lucide-react';

interface ChatGroupItemProps {
  group: ChatGroup;
  isActive: boolean;
  onSelect: () => void;
  onUpdateAvatar: () => void;
}

const ChatGroupItem: React.FC<ChatGroupItemProps> = ({ group, isActive, onSelect, onUpdateAvatar }) => {
  return (
    <div
      className={`inline-flex items-center p-2 rounded-lg cursor-pointer mr-2 ${
        isActive ? 'bg-gray-700' : 'hover:bg-gray-700'
      }`}
      onClick={onSelect}
    >
      <div className="relative">
        <img src={group.avatar} alt={group.name} className="w-10 h-10 rounded-full mr-3" />
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
      <span className="font-medium">{group.name}</span>
    </div>
  );
};

export default ChatGroupItem;