import { useState } from 'react';
import { Link } from 'react-router-dom';
import SongsManager from './SongsManager';
import MediaManager from './MediaManager';

type TabType = 'songs' | 'media' | 'speed' | 'actions';

export default function ContentManagementPage() {
  const [activeTab, setActiveTab] = useState<TabType>('songs');

  const tabs = [
    { id: 'songs' as TabType, name: '노래 맞추기', icon: '🎵', enabled: true },
    { id: 'media' as TabType, name: '드라마/영화', icon: '🎬', enabled: true },
    { id: 'speed' as TabType, name: '스피드 게임', icon: '⚡', enabled: false },
    { id: 'actions' as TabType, name: '동작 게임', icon: '🤸', enabled: false },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">콘텐츠 관리</h1>
        <Link
          to="/sessions"
          className="text-blue-600 hover:text-blue-700 font-semibold"
        >
          ← 세션 목록으로
        </Link>
      </div>

      {/* 탭 */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => tab.enabled && setActiveTab(tab.id)}
                disabled={!tab.enabled}
                className={`flex-1 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : tab.enabled
                    ? 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    : 'border-transparent text-gray-400 cursor-not-allowed'
                }`}
              >
                <span className="text-2xl mr-2">{tab.icon}</span>
                {tab.name}
                {!tab.enabled && <span className="text-xs ml-1">(개발 중)</span>}
              </button>
            ))}
          </nav>
        </div>

        {/* 콘텐츠 */}
        <div className="p-6">
          {activeTab === 'songs' && <SongsManager />}
          {activeTab === 'media' && <MediaManager />}
          {activeTab === 'speed' && (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                스피드 게임 콘텐츠 관리
              </h3>
              <p className="text-gray-600">현재 개발 중입니다.</p>
            </div>
          )}
          {activeTab === 'actions' && (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">🤸</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                동작 게임 콘텐츠 관리
              </h3>
              <p className="text-gray-600">현재 개발 중입니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
