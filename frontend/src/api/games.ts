import { apiClient } from './client';
import type { SessionGame, GameType, CreateSessionGameDto, StartGameDto } from '../types';

export const gamesApi = {
  // 게임 타입 목록
  getGameTypes: async (): Promise<GameType[]> => {
    const response = await apiClient.get<GameType[]>('/games/types');
    return response.data;
  },

  // 세션의 게임 목록
  getBySession: async (sessionId: number): Promise<SessionGame[]> => {
    const response = await apiClient.get<SessionGame[]>('/games', {
      params: { sessionId },
    });
    return response.data;
  },

  // 게임 상세
  getOne: async (id: number): Promise<SessionGame> => {
    const response = await apiClient.get<SessionGame>(`/games/${id}`);
    return response.data;
  },

  // 게임 추가
  create: async (data: CreateSessionGameDto): Promise<SessionGame> => {
    const response = await apiClient.post<SessionGame>('/games', data);
    return response.data;
  },

  // 게임 시작
  start: async (id: number, data: StartGameDto): Promise<SessionGame> => {
    const response = await apiClient.patch<SessionGame>(`/games/${id}/start`, data);
    return response.data;
  },

  // 게임 완료
  complete: async (id: number): Promise<SessionGame> => {
    const response = await apiClient.patch<SessionGame>(`/games/${id}/complete`);
    return response.data;
  },

  // 게임 삭제
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/games/${id}`);
  },
};
