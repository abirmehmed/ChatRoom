import React, { useState, useEffect, useRef } from 'react';
import { Message, User, ChatGroup } from '../types';
import { loadMessages, addMessage, updateMessage, deleteMessage } from '../utils/storage';
import ChatMessage from './ChatMessage';
import { Image, Smile } from 'lucide-react';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';

interface ChatRoomProps {
  currentGroup: ChatGroup;
  users: User[];
  currentUser: User | null;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ currentGroup, users, currentUser }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const emojiButtonRef = useRef<HTMLButtonElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setMessages(loadMessages(currentGroup.id));
  }, [currentGroup.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiButtonRef.current && !emojiButtonRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && currentUser) {
      const message: Message = {
        id: Date.now().toString(),
        userId: currentUser.id,
        content: newMessage.trim(),
        timestamp: Date.now(),
        type: 'text',
      };
      addMessage(currentGroup.id, message);
      setMessages([...messages, message]);
      setNewMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && currentUser) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageDataUrl = e.target?.result as string;
        const message: Message = {
          id: Date.now().toString(),
          userId: currentUser.id,
          content: imageDataUrl,
          timestamp: Date.now(),
          type: 'image',
        };
        addMessage(currentGroup.id, message);
        setMessages([...messages, message]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      const newText = newMessage.substring(0, start) + emojiData.emoji + newMessage.substring(end);
      setNewMessage(newText);
      // Set cursor position after emoji
      setTimeout(() => {
        textareaRef.current?.setSelectionRange(start + emojiData.emoji.length, start + emojiData.emoji.length);
        textareaRef.current?.focus();
      }, 0);
    } else {
      setNewMessage(prev => prev + emojiData.emoji);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const adjustTextareaHeight = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  };

  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { [key: string]: Message[] } = {};
    messages.forEach(message => {
      const date = new Date(message.timestamp).toLocaleDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    return groups;
  };

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-xl text-gray-500">Please select a user to start chatting.</p>
      </div>
    );
  }

  const messagesByDate = groupMessagesByDate(messages);

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="bg-gray-700 p-4 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img src={currentGroup.avatar} alt={currentGroup.name} className="w-10 h-10 rounded-full mr-3" />
            <h2 className="text-xl font-semibold">{currentGroup.name}</h2>
          </div>
          <div className="flex items-center">
            <img src={currentUser.avatar} alt={currentUser.name} className="w-8 h-8 rounded-full mr-2" />
            <span>{currentUser.name}</span>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="p-4">
          {Object.entries(messagesByDate).map(([date, dateMessages]) => (
            <div key={date}>
              <div className="flex items-center justify-center my-4">
                <div className="bg-gray-700 px-4 py-1 rounded-full text-sm">
                  {new Date(dateMessages[0].timestamp).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
              {dateMessages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  user={users.find((u) => u.id === message.userId) || currentUser}
                  isCurrentUser={message.userId === currentUser.id}
                  onEdit={(messageId, newContent) => {
                    const updatedMessages = messages.map(msg => 
                      msg.id === messageId ? { ...msg, content: newContent } : msg
                    );
                    setMessages(updatedMessages);
                    updateMessage(currentGroup.id, updatedMessages.find(m => m.id === messageId)!);
                  }}
                  onDelete={(messageId) => {
                    const updatedMessages = messages.filter(msg => msg.id !== messageId);
                    setMessages(updatedMessages);
                    deleteMessage(currentGroup.id, messageId);
                  }}
                />
              ))}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input Area */}
      <div className="border-t border-gray-700 bg-gray-800 p-4">
        <div className="flex items-start gap-2">
          <div className="relative flex-1">
            <button
              ref={emojiButtonRef}
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="absolute left-2 top-3 text-gray-400 hover:text-gray-300 focus:outline-none"
            >
              <Smile size={20} />
            </button>
            {showEmojiPicker && (
              <div className="absolute bottom-full left-0 mb-2">
                <EmojiPicker onEmojiClick={handleEmojiClick} />
              </div>
            )}
            <textarea
              ref={textareaRef}
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value);
                adjustTextareaHeight(e);
              }}
              onKeyPress={handleKeyPress}
              className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg pl-10 pr-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[40px] max-h-[120px] resize-y"
              placeholder="Type a message... (Shift + Enter for new line)"
              rows={1}
            />
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-gray-400 hover:text-gray-300 focus:outline-none p-2"
          >
            <Image size={20} />
          </button>
          <button
            onClick={handleSendMessage}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Send
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;