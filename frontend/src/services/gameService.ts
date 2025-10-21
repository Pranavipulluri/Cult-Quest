import api from './api';

export const gameService = {
  async awardXP(gameName: string, xpEarned: number, score?: number) {
    const response = await api.post('/game/award-xp', {
      gameName,
      xpEarned,
      score
    });
    return response.data;
  },

  async getLeaderboard(region?: string) {
    const response = await api.get('/game/leaderboard', {
      params: { region }
    });
    return response.data;
  },

  async saveProgress(gameName: string, progress: any, completed: boolean) {
    const response = await api.post('/game/save-progress', {
      gameName,
      progress,
      completed
    });
    return response.data;
  }
};
