import axios, { AxiosInstance } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthResponse, User, Chat, Message } from '../types/type';
import { mockApiService } from './mock';

const API_URL = 'http://localhost:3000/api';
const USE_MOCK = true; // Toggle this

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.api.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          await AsyncStorage.removeItem('token');
          await AsyncStorage.removeItem('user');
        }
        return Promise.reject(error);
      }
    );
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    if (USE_MOCK) return mockApiService.login(email, password);
    const response = await this.api.post<AuthResponse>('/auth/login', { email, password });
    return response.data;
  }

  async register(name: string, email: string, password: string): Promise<AuthResponse> {
    if (USE_MOCK) return mockApiService.register(name, email, password);
    const response = await this.api.post<AuthResponse>('/auth/register', { name, email, password });
    return response.data;
  }

  async logout(): Promise<void> {
    if (USE_MOCK) return;
    await this.api.post('/auth/logout');
  }

  async searchUsers(email: string): Promise<User[]> {
    if (USE_MOCK) return mockApiService.searchUsers(email);
    const response = await this.api.get<User[]>('/users/search', { params: { email } });
    return response.data;
  }

  async getProfile(): Promise<User> {
    if (USE_MOCK) return mockApiService.getProfile();
    const response = await this.api.get<User>('/users/profile');
    return response.data;
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    if (USE_MOCK) return mockApiService.getProfile();
    const response = await this.api.put<User>('/users/profile', data);
    return response.data;
  }

  async getChats(): Promise<Chat[]> {
    if (USE_MOCK) return mockApiService.getChats();
    const response = await this.api.get<Chat[]>('/chats');
    return response.data;
  }

  async getChatById(chatId: string): Promise<Chat> {
    if (USE_MOCK) return mockApiService.getChatById(chatId);
    const response = await this.api.get<Chat>(`/chats/${chatId}`);
    return response.data;
  }

  async getChatMessages(chatId: string, page: number = 1, limit: number = 50): Promise<Message[]> {
    if (USE_MOCK) return mockApiService.getChatMessages(chatId);
    const response = await this.api.get<Message[]>(`/chats/${chatId}/messages`, { params: { page, limit } });
    return response.data;
  }

  async sendMessage(chatId: string, content: string, aiMode: boolean = false): Promise<Message> {
    if (USE_MOCK) return mockApiService.sendMessage(chatId, content, aiMode);
    const response = await this.api.post<Message>(`/chats/${chatId}/messages`, { content, aiMode });
    return response.data;
  }

  async createChat(participantId: string): Promise<Chat> {
    if (USE_MOCK) return mockApiService.createChat(participantId);
    const response = await this.api.post<Chat>('/chats', { participantId });
    return response.data;
  }

  async toggleAIMode(chatId: string, enabled: boolean): Promise<Chat> {
    if (USE_MOCK) return mockApiService.toggleAIMode(chatId, enabled);
    const response = await this.api.patch<Chat>(`/chats/${chatId}/ai-mode`, { enabled });
    return response.data;
  }

  async markAsRead(chatId: string): Promise<void> {
    if (USE_MOCK) return;
    await this.api.patch(`/chats/${chatId}/read`);
  }
}

export const apiService = new ApiService();