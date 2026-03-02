import { User, AuthResponse, Chat, Message } from '../types/type';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock user database
const mockUsers: User[] = [
  {
    _id: '1',
    name: 'Test User',
    email: 'test@drivona.com',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '2',
    name: 'John Doe',
    email: 'john@drivona.com',
    avatar: 'https://i.pravatar.cc/150?img=1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '3',
    name: 'Jane Smith',
    email: 'jane@drivona.com',
    avatar: 'https://i.pravatar.cc/150?img=2',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '4',
    name: 'Mike Johnson',
    email: 'mike@drivona.com',
    avatar: 'https://i.pravatar.cc/150?img=3',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Mock chats
let mockChats: Chat[] = [
  {
    _id: 'chat1',
    participants: [mockUsers[0], mockUsers[1]],
    lastMessage: {
      _id: 'msg1',
      chatId: 'chat1',
      senderId: mockUsers[1]._id,
      content: 'Hey! How are you doing?',
      isAI: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    },
    aiModeEnabled: false,
    unreadCount: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'chat2',
    participants: [mockUsers[0], mockUsers[2]],
    lastMessage: {
      _id: 'msg2',
      chatId: 'chat2',
      senderId: mockUsers[0]._id,
      content: 'Thanks for your help!',
      isAI: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    },
    aiModeEnabled: true,
    unreadCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'chat3',
    participants: [mockUsers[0], mockUsers[3]],
    lastMessage: {
      _id: 'msg3',
      chatId: 'chat3',
      senderId: mockUsers[3]._id,
      content: 'See you tomorrow!',
      isAI: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    },
    aiModeEnabled: false,
    unreadCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Mock messages
const mockMessages: { [chatId: string]: Message[] } = {
  chat1: [
    {
      _id: 'msg1-1',
      chatId: 'chat1',
      senderId: mockUsers[1]._id,
      content: 'Hi there!',
      isAI: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    },
    {
      _id: 'msg1-2',
      chatId: 'chat1',
      senderId: mockUsers[0]._id,
      content: 'Hello! How can I help you?',
      isAI: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
    },
    {
      _id: 'msg1-3',
      chatId: 'chat1',
      senderId: mockUsers[1]._id,
      content: 'Hey! How are you doing?',
      isAI: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    },
  ],
  chat2: [
    {
      _id: 'msg2-1',
      chatId: 'chat2',
      senderId: mockUsers[2]._id,
      content: 'Need any help with the project?',
      isAI: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    },
    {
      _id: 'msg2-2',
      chatId: 'chat2',
      senderId: mockUsers[0]._id,
      content: 'Thanks for your help!',
      isAI: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    },
  ],
  chat3: [
    {
      _id: 'msg3-1',
      chatId: 'chat3',
      senderId: mockUsers[3]._id,
      content: 'See you tomorrow!',
      isAI: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    },
  ],
};

export const mockApiService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    await delay(1000);
    const user = mockUsers.find(u => u.email === email);
    
    if (user && password === 'password') {
      return {
        token: 'mock-token-' + Date.now(),
        user: user
      };
    }
    
    throw new Error('Invalid credentials');
  },

  register: async (name: string, email: string, password: string): Promise<AuthResponse> => {
    await delay(1000);
    
    if (mockUsers.find(u => u.email === email)) {
      throw new Error('Email already exists');
    }
    
    const newUser: User = {
      _id: String(mockUsers.length + 1),
      name,
      email,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    mockUsers.push(newUser);
    
    return {
      token: 'mock-token-' + Date.now(),
      user: newUser
    };
  },

  getChats: async (): Promise<Chat[]> => {
    await delay(500);
    return mockChats;
  },

  getChatById: async (chatId: string): Promise<Chat> => {
    await delay(300);
    const chat = mockChats.find(c => c._id === chatId);
    if (!chat) throw new Error('Chat not found');
    return chat;
  },

  getChatMessages: async (chatId: string): Promise<Message[]> => {
    await delay(500);
    return mockMessages[chatId] || [];
  },

  sendMessage: async (chatId: string, content: string, aiMode: boolean): Promise<Message> => {
    await delay(500);
    
    const newMessage: Message = {
      _id: 'msg-' + Date.now(),
      chatId,
      senderId: mockUsers[0]._id,
      content,
      isAI: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (!mockMessages[chatId]) {
      mockMessages[chatId] = [];
    }
    mockMessages[chatId].push(newMessage);

    // Update last message in chat
    const chatIndex = mockChats.findIndex(c => c._id === chatId);
    if (chatIndex !== -1) {
      mockChats[chatIndex].lastMessage = newMessage;
    }

    // Simulate AI response if AI mode is enabled
    if (aiMode) {
      await delay(1000);
      const aiMessage: Message = {
        _id: 'msg-ai-' + Date.now(),
        chatId,
        senderId: mockChats[chatIndex].participants[1]._id,
        content: `AI Response: I understand you said "${content}". This is a mock AI response that mimics the conversation style.`,
        isAI: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockMessages[chatId].push(aiMessage);
      mockChats[chatIndex].lastMessage = aiMessage;
    }

    return newMessage;
  },

  createChat: async (participantId: string): Promise<Chat> => {
    await delay(500);
    
    const participant = mockUsers.find(u => u._id === participantId);
    if (!participant) throw new Error('User not found');

    const newChat: Chat = {
      _id: 'chat-' + Date.now(),
      participants: [mockUsers[0], participant],
      aiModeEnabled: false,
      unreadCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockChats.unshift(newChat);
    mockMessages[newChat._id] = [];
    
    return newChat;
  },

  toggleAIMode: async (chatId: string, enabled: boolean): Promise<Chat> => {
    await delay(300);
    
    const chatIndex = mockChats.findIndex(c => c._id === chatId);
    if (chatIndex === -1) throw new Error('Chat not found');
    
    mockChats[chatIndex].aiModeEnabled = enabled;
    return mockChats[chatIndex];
  },

  searchUsers: async (email: string): Promise<User[]> => {
    await delay(500);
    return mockUsers.filter(u => 
      u.email.toLowerCase().includes(email.toLowerCase()) && 
      u._id !== mockUsers[0]._id
    );
  },

  getProfile: async (): Promise<User> => {
    await delay(300);
    return mockUsers[0];
  },
};