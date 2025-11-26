import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { speedApi } from '../../api';
import type { SpeedCategory, CreateSpeedCategoryDto } from '../../types';

export default function SpeedManager() {
  const queryClient = useQueryClient();
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [categoryFormData, setCategoryFormData] = useState<CreateSpeedCategoryDto>({
    categoryName: '',
    description: '',
  });
  const [itemName, setItemName] = useState('');

  const { data: categories, isLoading } = useQuery<SpeedCategory[]>({
    queryKey: ['speed-categories'],
    queryFn: speedApi.getAllCategories,
  });

  const createCategoryMutation = useMutation({
    mutationFn: speedApi.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['speed-categories'] });
      setCategoryFormData({ categoryName: '', description: '' });
      setShowCategoryForm(false);
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: speedApi.deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['speed-categories'] });
      setSelectedCategory(null);
    },
  });

  const createItemMutation = useMutation({
    mutationFn: speedApi.createItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['speed-categories'] });
      setItemName('');
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: speedApi.deleteItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['speed-categories'] });
    },
  });

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    createCategoryMutation.mutate(categoryFormData);
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory || !itemName.trim()) return;
    createItemMutation.mutate({
      categoryId: Number(selectedCategory),
      itemName: itemName.trim(),
    });
  };

  const selectedCategoryData = categories?.find((c) => c.id === selectedCategory);

  if (isLoading) return <div className="text-center py-4">로딩 중...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          스피드 게임 유형 ({categories?.length || 0}개)
        </h2>
        <button
          onClick={() => setShowCategoryForm(!showCategoryForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          {showCategoryForm ? '취소' : '+ 유형 추가'}
        </button>
      </div>

      {showCategoryForm && (
        <form onSubmit={handleCreateCategory} className="bg-gray-50 p-4 rounded-lg mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                유형 이름 *
              </label>
              <input
                type="text"
                value={categoryFormData.categoryName}
                onChange={(e) =>
                  setCategoryFormData({ ...categoryFormData, categoryName: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="예: 과일 이름"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                설명
              </label>
              <input
                type="text"
                value={categoryFormData.description}
                onChange={(e) =>
                  setCategoryFormData({ ...categoryFormData, description: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 유형 목록 */}
        <div className="space-y-2">
          {categories?.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`w-full text-left p-4 rounded-lg border-2 transition ${
                selectedCategory === category.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-blue-300'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold">{category.categoryName}</h3>
                  <p className="text-sm text-gray-600">
                    {category.items?.length || 0}개 항목
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm('유형과 모든 항목이 삭제됩니다. 계속하시겠습니까?')) {
                      deleteCategoryMutation.mutate(category.id);
                    }
                  }}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  삭제
                </button>
              </div>
            </button>
          ))}
          {categories?.length === 0 && (
            <div className="text-center py-8 text-gray-500">유형을 추가해보세요!</div>
          )}
        </div>

        {/* 항목 관리 */}
        <div className="md:col-span-2">
          {selectedCategoryData ? (
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4">
                {selectedCategoryData.categoryName} 항목 관리
              </h3>

              {/* 항목 추가 폼 */}
              <form onSubmit={handleAddItem} className="flex space-x-2 mb-4">
                <input
                  type="text"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="항목 이름 입력"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  추가
                </button>
              </form>

              {/* 항목 목록 */}
              <div className="space-y-2">
                {selectedCategoryData.items?.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                  >
                    <span>{item.itemName}</span>
                    <button
                      onClick={() => {
                        if (confirm('삭제하시겠습니까?')) {
                          deleteItemMutation.mutate(item.id);
                        }
                      }}
                      className="text-red-600 hover:text-red-700 text-sm"
                    >
                      삭제
                    </button>
                  </div>
                ))}
                {selectedCategoryData.items?.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    항목을 추가해보세요!
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-gray-100 border border-gray-200 rounded-lg p-8 text-center text-gray-500">
              왼쪽에서 유형을 선택하세요
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
