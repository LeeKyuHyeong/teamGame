import { apiClient } from './client';
import type { Participant, CreateParticipantDto } from '../types';

export const participantsApi = {
  // 참가자 목록 조회
  getAll: async (teamId?: number): Promise<Participant[]> => {
    const params = teamId ? { teamId } : {};
    const response = await apiClient.get<Participant[]>('/participants', { params });
    return response.data;
  },

  // 참가자 상세 조회
  getOne: async (id: number): Promise<Participant> => {
    const response = await apiClient.get<Participant>(`/participants/${id}`);
    return response.data;
  },

  // 참가자 생성
  create: async (data: CreateParticipantDto): Promise<Participant> => {
    const response = await apiClient.post<Participant>('/participants', data);
    return response.data;
  },

  // 참가자 일괄 생성
  createBatch: async (data: CreateParticipantDto[]): Promise<Participant[]> => {
    const response = await apiClient.post<Participant[]>('/participants/batch', data);
    return response.data;
  },

  // 참가자 삭제
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/participants/${id}`);
  },
};
