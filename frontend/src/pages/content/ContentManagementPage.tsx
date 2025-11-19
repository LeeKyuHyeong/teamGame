import { useState } from 'react';
import { Link } from 'react-router-dom';
import SongsManager from './SongsManager';
import MediaManager from './MediaManager';
import SpeedManager from './SpeedManager';
import ActionsManager from './ActionsManager';

type TabType = 'songs' | 'media' | 'speed' | 'actions';

export default function ContentManagementPage() {
  const [activeTab, setActiveTab] = useState<TabType>('songs');

  const tabs = [
    { id: 'songs' as TabType, name: '노래 맞추기', icon: '🎵' },
    { id: 'media' as TabType, name: '드라마/영화', icon: '🎬' },
    { id: 'speed' as TabType, name: '스피드 게임', icon: '⚡' },
    { id: 'actions' as TabType, name: '동작 게임', icon: '🤸' },
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
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="text-2xl mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* 콘텐츠 */}
        <div className="p-6">
          {activeTab === 'songs' && <SongsManager />}
          {activeTab === 'media' && <MediaManager />}
          {activeTab === 'speed' && <SpeedManager />}
          {activeTab === 'actions' && <ActionsManager />}
        </div>
      </div>
    </div>
  );
}
