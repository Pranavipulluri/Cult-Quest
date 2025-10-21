import api from './api';
import { User } from './authService';

export interface ProfileUpdateData {
  username?: string;
  region?: string;
  bio?: string;
  avatar?: string;
}

export interface LeaderboardUser extends User {
  rank: number;
}

export const profileService = {
  async getProfile(): Promise<{ profile: User }> {
    const response = await api.get('/profile/me');
    return response.data;
  },

  async updateProfile(data: ProfileUpdateData): Promise<{ profile: User; message: string }> {
    const response = await api.put('/profile/me', data);
    return response.data;
  },

  async getUsersByRegion(region: string): Promise<{ users: User[] }> {
    const response = await api.get(`/profile/region/${region}`);
    return response.data;
  },

  async getLeaderboard(): Promise<{ leaderboard: LeaderboardUser[] }> {
    const response = await api.get('/profile/leaderboard');
    return response.data;
  },
};
