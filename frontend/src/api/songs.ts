import { apiClient } from './client';
import type { Song, CreateSongDto } from '../types';

export const songsApi = {
  // 노래 목록
  getAll: async (): Promise<Song[]> => {
    const response = await apiClient.get<Song[]>('/songs');
    return response.data;
  },

  // 랜덤 노래
  getRandom: async (count: number = 5, year?: number): Promise<Song[]> => {
    const params: any = { random: count };
    if (year) {
      params.year = year;
    }
    const response = await apiClient.get<Song[]>('/songs', { params });
    return response.data;
  },

  // 사용 가능한 연도 목록
  getAvailableYears: async (): Promise<string[]> => {
    const response = await apiClient.get<string[]>('/songs/years/available');
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