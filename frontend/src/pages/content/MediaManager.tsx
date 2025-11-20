import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mediaApi } from '../../api';
import type { MediaContent } from '../../types';

export default function MediaManager() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { data: mediaList, isLoading } = useQuery<MediaContent[]>({
    queryKey: ['media'],
    queryFn: mediaApi.getAll,
  });

  const uploadMutation = useMutation({
    mutationFn: ({ file, title }: { file: File; title: string }) =>
      mediaApi.uploadImage(file, title),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
      setTitle('');
      setSelectedFile(null);
      setPreviewUrl(null);
      setShowForm(false);
      alert('이미지가 업로드되었습니다!');
    },
    onError: (error: any) => {
      alert(`업로드 실패: ${error.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: mediaApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !title) {
      alert('제목과 이미지를 모두 입력해주세요.');
      return;
    }
    uploadMutation.mutate({ file: selectedFile, title });
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
          {showForm ? '취소' : '+ 이미지 업로드'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg mb-4 border-2 border-dashed border-gray-300">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                제목 *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="드라마/영화 제목"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이미지 파일 * (JPG, PNG, GIF, WebP - 최대 5MB)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            {previewUrl && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">미리보기:</p>
                <img
                  src={previewUrl}
                  alt="미리보기"
                  className="max-w-md max-h-64 rounded-lg border border-gray-300"
                />
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setTitle('');
                  setSelectedFile(null);
                  setPreviewUrl(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={uploadMutation.isPending}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {uploadMutation.isPending ? '업로드 중...' : '업로드'}
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mediaList?.map((media) => (
          <div key={media.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
            <div className="relative h-48 bg-gray-100">
              <img
                src={`http://localhost:3000${media.imageUrl}`}
                alt={media.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                }}
              />
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg">{media.title}</h3>
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
              <p className="text-xs text-gray-500">{media.imageUrl}</p>
            </div>
          </div>
        ))}
        {mediaList?.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500 bg-gray-50 rounded-lg">
            <p className="text-lg mb-2">등록된 드라마/영화가 없습니다.</p>
            <p className="text-sm">위의 '+ 이미지 업로드' 버튼을 클릭하여 추가해보세요.</p>
          </div>
        )}
      </div>
    </div>
  );
}
