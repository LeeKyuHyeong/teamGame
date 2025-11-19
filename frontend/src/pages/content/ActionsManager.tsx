import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { actionsApi } from '../../api';
import type { ActionItem, CreateActionDto } from '../../types';

export default function ActionsManager() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<CreateActionDto>({
    actionName: '',
    description: '',
  });

  const { data: actions, isLoading } = useQuery<ActionItem[]>({
    queryKey: ['actions'],
    queryFn: actionsApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: actionsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['actions'] });
      setFormData({ actionName: '', description: '' });
      setShowForm(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: actionsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['actions'] });
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
          동작 목록 ({actions?.length || 0}개)
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          {showForm ? '취소' : '+ 동작 추가'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                동작 이름 *
              </label>
              <input
                type="text"
                value={formData.actionName}
                onChange={(e) =>
                  setFormData({ ...formData, actionName: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="예: 박수치기"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                설명
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="예: 양손으로 박수를 친다"
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
        {actions?.map((action) => (
          <div
            key={action.id}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-lg">{action.actionName}</h3>
              <button
                onClick={() => {
                  if (confirm('정말 삭제하시겠습니까?')) {
                    deleteMutation.mutate(action.id);
                  }
                }}
                className="text-red-600 hover:text-red-700 text-sm"
              >
                삭제
              </button>
            </div>
            {action.description && (
              <p className="text-sm text-gray-600">{action.description}</p>
            )}
          </div>
        ))}
        {actions?.length === 0 && (
          <div className="col-span-full text-center py-8 text-gray-500">
            등록된 동작이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
