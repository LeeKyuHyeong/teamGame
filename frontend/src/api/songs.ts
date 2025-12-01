import { apiClient } from './client';
import type { Song, CreateSongDto, DecadeOption } from '../types';

export const songsApi = {
  // 노래 목록
  getAll: async (): Promise<Song[]> => {
    const response = await apiClient.get<Song[]>('/songs');
    return response.data;
  },

  // 랜덤 노래 (년대별)
  getRandom: async (count: number = 5, decade?: string): Promise<Song[]> => {
    const params: any = { random: count };
    if (decade) {
      params.decade = decade;
    }
    const response = await apiClient.get<Song[]>('/songs', { params });
    return response.data;
  },

  // 사용 가능한 년대 목록
  getAvailableDecades: async (): Promise<DecadeOption[]> => {
    const response = await apiClient.get<DecadeOption[]>('/songs/decades/available');
    return response.data;
  },

  // 노래 상세
  getOne: async (id: number): Promise<Song> => {
    const response = await apiClient.get<Song>(`/songs/${id}`);
    return response.data;
  },

  // 노래 추가
  create: async (data: CreateSongDto): Promise<Song> => {
    const response = await apiClient.post<Song>('/songs', data);
    return response.data;
  },

  // 노래 수정
  update: async (id: number, data: Partial<CreateSongDto>): Promise<Song> => {
    const response = await apiClient.patch<Song>(`/songs/${id}`, data);
    return response.data;
  },

  // 노래 삭제
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/songs/${id}`);
  },
};
