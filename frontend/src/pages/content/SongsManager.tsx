import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { songsApi } from '../../api';
import type { Song, CreateSongDto } from '../../types';

export default function SongsManager() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingSong, setEditingSong] = useState<Song | null>(null);
  const [formData, setFormData] = useState<CreateSongDto>({
    youtubeUrl: '',
    title: '',
    artist: '',
    startTime: 0,
  });

  const { data: songs, isLoading } = useQuery<Song[]>({
    queryKey: ['songs'],
    queryFn: songsApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: songsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['songs'] });
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateSongDto> }) =>
      songsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['songs'] });
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: songsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['songs'] });
    },
  });

  const resetForm = () => {
    setFormData({ youtubeUrl: '', title: '', artist: '', startTime: 0 });
    setEditingSong(null);
    setShowForm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSong) {
      updateMutation.mutate({ id: editingSong.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (song: Song) => {
    setEditingSong(song);
    setFormData({
      youtubeUrl: song.youtubeUrl,
      title: song.title,
      artist: song.artist,
      startTime: song.startTime || 0,
    });
    setShowForm(true);
  };

  if (isLoading) return <div className="text-center py-4">로딩 중...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          노래 목록 ({songs?.length || 0}개)
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          {showForm ? '취소' : '+ 노래 추가'}
        </button>
      </div>

      {/* 추가/수정 폼 */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                YouTube URL *
              </label>
              <input
                type="text"
                value={formData.youtubeUrl}
                onChange={(e) =>
                  setFormData({ ...formData, youtubeUrl: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="https://www.youtube.com/watch?v=..."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                노래 제목 *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                가수명 *
              </label>
              <input
                type="text"
                value={formData.artist}
                onChange={(e) =>
                  setFormData({ ...formData, artist: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                시작 시간 (초)
              </label>
              <input
                type="number"
                value={formData.startTime}
                onChange={(e) =>
                  setFormData({ ...formData, startTime: parseInt(e.target.value) })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                min="0"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {editingSong ? '수정' : '추가'}
            </button>
          </div>
        </form>
      )}

      {/* 노래 목록 */}
      <div className="space-y-2">
        {songs?.map((song) => (
          <div
            key={song.id}
            className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition"
          >
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{song.title}</h3>
              <p className="text-sm text-gray-600">{song.artist}</p>
              <a
                href={song.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:underline"
              >
                YouTube 링크 →
              </a>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleEdit(song)}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
              >
                수정
              </button>
              <button
                onClick={() => {
                  if (confirm('정말 삭제하시겠습니까?')) {
                    deleteMutation.mutate(song.id);
                  }
                }}
                className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
              >
                삭제
              </button>
            </div>
          </div>
        ))}
        {songs?.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            등록된 노래가 없습니다. 노래를 추가해보세요!
          </div>
        )}
      </div>
    </div>
  );
}
