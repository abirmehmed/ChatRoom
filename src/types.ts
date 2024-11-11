export interface User {
  id: string;
  name: string;
  avatar: string;
  messageColor?: string;
}

export interface Message {
  id: string;
  userId: string;
  content: string;
  timestamp: number;
  type: 'text' | 'image';
}

export interface ChatGroup {
  id: string;
  name: string;
  members: string[];
  avatar: string;
}

export interface ChatState {
  users: { [groupId: string]: User[] };
  groups: ChatGroup[];
  currentGroup: string | null;
  currentUser: string | null;
}