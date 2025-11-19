import { apiClient } from './client';
import type { Session, CreateSessionDto, UpdateSessionDto } from '../types';

export const sessionsApi = {
  // 세션 목록 조회
  getAll: async (): Promise<Session[]> => {
    const response = await apiClient.get<Session[]>('/sessions');
    return response.data;
  },

  // 세션 상세 조회
  getOne: async (id: number): Promise<Session> => {
    const response = await apiClient.get<Session>(`/sessions/${id}`);
    return response.data;
  },

  // 세션 + 팀 상세 조회
  getDetail: async (id: number): Promise<Session> => {
    const response = await apiClient.get<Session>(`/sessions/${id}/detail`);
    return response.data;
  },

  // 세션 생성
  create: async (data: CreateSessionDto): Promise<Session> => {
    const response = await apiClient.post<Session>('/sessions', data);
    return response.data;
  },

  // 세션 수정
  update: async (id: number, data: UpdateSessionDto): Promise<Session> => {
    const response = await apiClient.patch<Session>(`/sessions/${id}`, data);
    return response.data;
  },

  // 세션 삭제
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/sessions/${id}`);
  },
};
