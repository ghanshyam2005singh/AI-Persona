export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  _id: string;
  chatId: string;
  senderId: string;
  content: string;
  isAI: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Chat {
  _id: string;
  participants: User[];
  lastMessage?: Message;
  aiModeEnabled: boolean;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiError {
  message: string;
  statusCode: number;
}