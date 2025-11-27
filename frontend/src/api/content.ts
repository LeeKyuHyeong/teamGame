import { apiClient } from './client';
import type {
  MediaContent,
  CreateMediaContentDto,
  GameRound,
  RoundScore,
  AssignScoreDto,
} from '../types';

// Media API
export const mediaApi = {
  getAll: async (): Promise<MediaContent[]> => {
    const response = await apiClient.get<MediaContent[]>('/media');
    return response.data;
  },
  getRandom: async (count: number = 5): Promise<MediaContent[]> => {
    const response = await apiClient.get<MediaContent[]>('/media', {
      params: { random: count },
    });
    return response.data;
  },
  getOne: async (id: number): Promise<MediaContent> => {
    const response = await apiClient.get<MediaContent>(`/media/${id}`);
    return response.data;
  },
  create: async (data: CreateMediaContentDto): Promise<MediaContent> => {
    const response = await apiClient.post<MediaContent>('/media', data);
    return response.data;
  },
  uploadImage: async (file: File, title: string): Promise<MediaContent> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    
    const response = await apiClient.post<MediaContent>('/media/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  update: async (id: number, data: Partial<CreateMediaContentDto>): Promise<MediaContent> => {
    const response = await apiClient.patch<MediaContent>(`/media/${id}`, data);
    return response.data;
  },
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/media/${id}`);
  },
};

// Rounds API
export const roundsApi = {
  getByGame: async (sessionGameId: number): Promise<GameRound[]> => {
    const response = await apiClient.get<GameRound[]>('/rounds', {
      params: { sessionGameId },
    });
    return response.data;
  },
  getOne: async (id: number): Promise<GameRound> => {
    const response = await apiClient.get<GameRound>(`/rounds/${id}`);
    return response.data;
  },
  getNext: async (sessionGameId: number): Promise<GameRound | null> => {
    const response = await apiClient.get<GameRound>(`/rounds/game/${sessionGameId}/next`);
    return response.data;
  },
  revealAnswer: async (id: number, reveal: boolean): Promise<GameRound> => {
    const response = await apiClient.patch<GameRound>(`/rounds/${id}/reveal`, {
      reveal,
    });
    return response.data;
  },
};

// Scores API
export const scoresApi = {
  getByRound: async (roundId: number): Promise<RoundScore[]> => {
    const response = await apiClient.get<RoundScore[]>('/scores', {
      params: { roundId },
    });
    return response.data;
  },
  assignScore: async (data: AssignScoreDto): Promise<RoundScore> => {
    const response = await apiClient.post<RoundScore>('/scores', data);
    return response.data;
  },
  compareScores: async (roundId: number): Promise<any> => {
    const response = await apiClient.get(`/scores/round/${roundId}/compare`);
    return response.data;
  },
};
