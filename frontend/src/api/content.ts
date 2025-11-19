import { apiClient } from './client';
import type {
  MediaContent,
  CreateMediaDto,
  SpeedCategory,
  CreateSpeedCategoryDto,
  CreateSpeedItemDto,
  SpeedItem,
  ActionItem,
  CreateActionDto,
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
  create: async (data: CreateMediaDto): Promise<MediaContent> => {
    const response = await apiClient.post<MediaContent>('/media', data);
    return response.data;
  },
  update: async (id: number, data: Partial<CreateMediaDto>): Promise<MediaContent> => {
    const response = await apiClient.patch<MediaContent>(`/media/${id}`, data);
    return response.data;
  },
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/media/${id}`);
  },
};

// Speed API
export const speedApi = {
  // 카테고리
  getAllCategories: async (): Promise<SpeedCategory[]> => {
    const response = await apiClient.get<SpeedCategory[]>('/speed/categories');
    return response.data;
  },
  getCategory: async (id: number): Promise<SpeedCategory> => {
    const response = await apiClient.get<SpeedCategory>(`/speed/categories/${id}`);
    return response.data;
  },
  getShuffled: async (id: number): Promise<SpeedItem[]> => {
    const response = await apiClient.get<SpeedItem[]>(`/speed/categories/${id}/shuffled`);
    return response.data;
  },
  createCategory: async (data: CreateSpeedCategoryDto): Promise<SpeedCategory> => {
    const response = await apiClient.post<SpeedCategory>('/speed/categories', data);
    return response.data;
  },
  deleteCategory: async (id: number): Promise<void> => {
    await apiClient.delete(`/speed/categories/${id}`);
  },
  // 아이템
  createItem: async (data: CreateSpeedItemDto): Promise<SpeedItem> => {
    const response = await apiClient.post<SpeedItem>('/speed/items', data);
    return response.data;
  },
  deleteItem: async (id: number): Promise<void> => {
    await apiClient.delete(`/speed/items/${id}`);
  },
};

// Actions API
export const actionsApi = {
  getAll: async (): Promise<ActionItem[]> => {
    const response = await apiClient.get<ActionItem[]>('/actions');
    return response.data;
  },
  getRandom: async (count: number = 5): Promise<ActionItem[]> => {
    const response = await apiClient.get<ActionItem[]>('/actions', {
      params: { random: count },
    });
    return response.data;
  },
  getOne: async (id: number): Promise<ActionItem> => {
    const response = await apiClient.get<ActionItem>(`/actions/${id}`);
    return response.data;
  },
  create: async (data: CreateActionDto): Promise<ActionItem> => {
    const response = await apiClient.post<ActionItem>('/actions', data);
    return response.data;
  },
  update: async (id: number, data: Partial<CreateActionDto>): Promise<ActionItem> => {
    const response = await apiClient.patch<ActionItem>(`/actions/${id}`, data);
    return response.data;
  },
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/actions/${id}`);
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
