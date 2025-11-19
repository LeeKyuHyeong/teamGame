import { apiClient } from './client';
import type { Team, CreateTeamDto } from '../types';

export const teamsApi = {
  // 팀 목록 조회
  getAll: async (sessionId?: number): Promise<Team[]> => {
    const params = sessionId ? { sessionId } : {};
    const response = await apiClient.get<Team[]>('/teams', { params });
    return response.data;
  },

  // 팀 상세 조회
  getOne: async (id: number): Promise<Team> => {
    const response = await apiClient.get<Team>(`/teams/${id}`);
    return response.data;
  },

  // 팀 생성
  create: async (data: CreateTeamDto): Promise<Team> => {
    const response = await apiClient.post<Team>('/teams', data);
    return response.data;
  },

  // 팀 총점 업데이트
  updateScore: async (id: number): Promise<Team> => {
    const response = await apiClient.patch<Team>(`/teams/${id}/score`);
    return response.data;
  },

  // 팀 삭제
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/teams/${id}`);
  },
};
