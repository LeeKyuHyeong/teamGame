import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mediaApi } from '../../api';
import { type MediaContent, type CreateMediaDto, MediaType } from '../../types';

export default function MediaManager() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<CreateMediaDto>({
    imagePath: '',
    title: '',
    mediaType: MediaType.DRAMA,
    description: '',
  });

  const { data: mediaList, isLoading } = useQuery<MediaContent[]>({
    queryKey: ['media'],
    queryFn: mediaApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: mediaApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
      setFormData({ imagePath: '', title: '', mediaType: MediaType.DRAMA, description: '' });
      setShowForm(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: mediaApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  if (isLoading) return <div className="text-center py-4">로딩 중...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          드라마/영화 목록 ({mediaList?.length || 0}개)
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          {showForm ? '취소' : '+ 추가'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                제목 *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                타입 *
              </label>
              <select
                value={formData.mediaType}
                onChange={(e) =>
                  setFormData({ ...formData, mediaType: e.target.value as MediaType })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value={MediaType.DRAMA}>드라마</option>
                <option value={MediaType.MOVIE}>영화</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                이미지 경로 *
              </label>
              <input
                type="text"
                value={formData.imagePath}
                onChange={(e) =>
                  setFormData({ ...formData, imagePath: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="/uploads/image.jpg"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                설명
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                rows={2}
              />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              추가
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mediaList?.map((media) => (
          <div key={media.id} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {media.mediaType}
              </span>
              <button
                onClick={() => {
                  if (confirm('정말 삭제하시겠습니까?')) {
                    deleteMutation.mutate(media.id);
                  }
                }}
                className="text-red-600 hover:text-red-700 text-sm"
              >
                삭제
              </button>
            </div>
            <h3 className="font-semibold text-lg mb-1">{media.title}</h3>
            <p className="text-xs text-gray-500">{media.imagePath}</p>
            {media.description && (
              <p className="text-sm text-gray-600 mt-2">{media.description}</p>
            )}
          </div>
        ))}
        {mediaList?.length === 0 && (
          <div className="col-span-full text-center py-8 text-gray-500">
            등록된 드라마/영화가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
