import { ChatState, Message, User, ChatGroup } from '../types';

const CHAT_STATE_KEY = 'chatRoomState';

const getRandomColor = () => {
  const colors = [
    '#3B82F6', // blue
    '#10B981', // green
    '#F59E0B', // yellow
    '#EF4444', // red
    '#8B5CF6', // purple
    '#EC4899', // pink
    '#06B6D4', // cyan
    '#F97316', // orange
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

export const saveState = (state: ChatState): void => {
  localStorage.setItem(CHAT_STATE_KEY, JSON.stringify(state));
};

export const loadState = (): ChatState | null => {
  const savedState = localStorage.getItem(CHAT_STATE_KEY);
  if (savedState) {
    const parsedState = JSON.parse(savedState);
    // Ensure the users object is initialized
    if (!parsedState.users) {
      parsedState.users = {};
    }
    return parsedState;
  }
  return null;
};

export const saveMessages = (groupId: string, messages: Message[]): void => {
  localStorage.setItem(`messages_${groupId}`, JSON.stringify(messages));
};

export const loadMessages = (groupId: string): Message[] => {
  const savedMessages = localStorage.getItem(`messages_${groupId}`);
  return savedMessages ? JSON.parse(savedMessages) : [];
};

export const addGroup = (state: ChatState, group: ChatGroup): ChatState => {
  const newState = {
    ...state,
    groups: [...state.groups, group],
    users: {
      ...state.users,
      [group.id]: [] // Initialize an empty array for the new group's users
    }
  };
  return newState;
};

export const updateGroup = (state: ChatState, updatedGroup: ChatGroup): ChatState => {
  const newState = {
    ...state,
    groups: state.groups.map(group => group.id === updatedGroup.id ? updatedGroup : group)
  };
  return newState;
};

export const deleteGroup = (state: ChatState, groupId: string): ChatState => {
  const newState = {
    ...state,
    groups: state.groups.filter(group => group.id !== groupId),
    users: { ...state.users }
  };
  delete newState.users[groupId];
  if (state.currentGroup === groupId) {
    newState.currentGroup = null;
  }
  return newState;
};

export const addUser = (state: ChatState, groupId: string, user: User): ChatState => {
  const newUser = {
    ...user,
    messageColor: getRandomColor()
  };
  const newState = {
    ...state,
    users: {
      ...state.users,
      [groupId]: [...(state.users[groupId] || []), newUser]
    }
  };
  return newState;
};

export const updateUser = (state: ChatState, groupId: string, updatedUser: User): ChatState => {
  const newState = {
    ...state,
    users: {
      ...state.users,
      [groupId]: state.users[groupId].map(user => user.id === updatedUser.id ? updatedUser : user)
    }
  };
  return newState;
};

export const deleteUser = (state: ChatState, groupId: string, userId: string): ChatState => {
  const newState = {
    ...state,
    users: {
      ...state.users,
      [groupId]: state.users[groupId].filter(user => user.id !== userId)
    }
  };
  return newState;
};

export const addMessage = (groupId: string, message: Message): void => {
  const messages = loadMessages(groupId);
  messages.push(message);
  saveMessages(groupId, messages);
};

export const updateMessage = (groupId: string, updatedMessage: Message): void => {
  const messages = loadMessages(groupId);
  const updatedMessages = messages.map(message => 
    message.id === updatedMessage.id ? updatedMessage : message
  );
  saveMessages(groupId, updatedMessages);
};

export const deleteMessage = (groupId: string, messageId: string): void => {
  const messages = loadMessages(groupId);
  const updatedMessages = messages.filter(message => message.id !== messageId);
  saveMessages(groupId, updatedMessages);
};