import React, { useState } from 'react';
import { Message, User } from '../types';
import { Trash2, Edit2, Check, X } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
  user: User;
  isCurrentUser: boolean;
  onEdit: (messageId: string, newContent: string) => void;
  onDelete: (messageId: string) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, user, isCurrentUser, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(message.content);
  const [isHovered, setIsHovered] = useState(false);

  const handleEdit = () => {
    onEdit(message.id, editedContent);
    setIsEditing(false);
  };

  const messageColor = user.messageColor || '#3B82F6';

  return (
    <div
      className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`flex ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'} items-end`}>
        <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
        <div
          className={`mx-2 py-2 px-4 rounded-lg text-white`}
          style={{ backgroundColor: messageColor }}
        >
          {isEditing ? (
            <div>
              <input
                type="text"
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="bg-gray-800 text-white px-2 py-1 rounded"
              />
              <button onClick={handleEdit} className="ml-2 text-green-400 hover:text-green-300">
                <Check size={16} />
              </button>
              <button onClick={() => setIsEditing(false)} className="ml-2 text-red-400 hover:text-red-300">
                <X size={16} />
              </button>
            </div>
          ) : message.type === 'text' ? (
            <p>{message.content}</p>
          ) : (
            <img src={message.content} alt="Uploaded" className="max-w-xs max-h-64 rounded-lg" />
          )}
          <span className="text-xs opacity-75 mt-1 block">
            {new Date(message.timestamp).toLocaleTimeString()}
          </span>
        </div>
        {isCurrentUser && !isEditing && isHovered && (
          <div className="flex flex-col ml-2">
            <button
              onClick={() => setIsEditing(true)}
              className="text-gray-400 hover:text-gray-300 mb-1"
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={() => onDelete(message.id)}
              className="text-gray-400 hover:text-gray-300"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;