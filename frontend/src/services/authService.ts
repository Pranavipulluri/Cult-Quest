import api from './api';

export interface User {
  id: string;
  username: string;
  role: string;
  region: string;
  avatar: string;
  level: number;
  xp: number;
  bio: string;
}

export interface SignUpData {
  username: string;
  password: string;
  region?: string;
}

export interface SignInData {
  username: string;
  password: string;
}

export const authService = {
  async signUp(data: SignUpData): Promise<{ user: User; message: string }> {
    const response = await api.post('/user/signup', data);
    return response.data;
  },

  async signIn(data: SignInData): Promise<{ user: User; message: string }> {
    const response = await api.post('/user/login', data);
    return response.data;
  },

  async verifyAuth(): Promise<{ user: User; message: string }> {
    const response = await api.get('/user/auth-status');
    return response.data;
  },

  async signOut(): Promise<{ message: string }> {
    const response = await api.get('/user/logout');
    return response.data;
  },
};
