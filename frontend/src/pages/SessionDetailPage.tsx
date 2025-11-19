import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { sessionsApi, gamesApi, songsApi, mediaApi, speedApi, actionsApi } from '../api';
import type { Session, Song, MediaContent, SpeedCategory, ActionItem } from '../types';

export default function SessionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const sessionId = parseInt(id || '0');
  const navigate = useNavigate();

  const [showGameSelect, setShowGameSelect] = useState(false);
  const [selectedGameType, setSelectedGameType] = useState<string>('');
  const [selectedContent, setSelectedContent] = useState<number[]>([]);

  const { data: session, isLoading, error } = useQuery<Session>({
    queryKey: ['sessions', sessionId],
    queryFn: () => sessionsApi.getDetail(sessionId),
  });

  // 게임 타입별 콘텐츠 조회
  const { data: songs } = useQuery<Song[]>({
    queryKey: ['songs'],
    queryFn: songsApi.getAll,
    enabled: selectedGameType === 'SONG',
  });

  const { data: mediaList } = useQuery<MediaContent[]>({
    queryKey: ['media'],
    queryFn: mediaApi.getAll,
    enabled: selectedGameType === 'MEDIA',
  });

  const { data: speedCategories } = useQuery<SpeedCategory[]>({
    queryKey: ['speed-categories'],
    queryFn: speedApi.getAllCategories,
    enabled: selectedGameType === 'SPEED',
  });

  const { data: actions } = useQuery<ActionItem[]>({
    queryKey: ['actions'],
    queryFn: actionsApi.getAll,
    enabled: selectedGameType === 'ACTION',
  });

  const handleGameSelect = (gameCode: string) => {
    setSelectedGameType(gameCode);
    setSelectedContent([]);
    setShowGameSelect(true);
  };

  const toggleContentSelection = (id: number) => {
    setSelectedContent((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleStartGame = async () => {
    if (!selectedGameType) {
      alert('게임 타입을 선택해주세요.');
      return;
    }
    if (selectedContent.length === 0) {
      alert('콘텐츠를 선택해주세요.');
      return;
    }
    
    try {
      // contentIds를 랜덤으로 섞기
      const shuffledIds = [...selectedContent].sort(() => Math.random() - 0.5);
      console.log('게임 시작:', selectedGameType, '섞인 콘텐츠:', shuffledIds);
      
      // 1. 게임 추가
      const game = await gamesApi.create({
        sessionId,
        gameCode: selectedGameType,
        gameOrder: (session?.sessionGames?.length || 0) + 1,
      });

      // 2. 게임 시작 (섞인 contentIds 전달)
      const contentIds = shuffledIds.map((id) => Number(id));
      await gamesApi.start(game.id, { contentIds });

      // 3. 게임 진행 화면으로 이동
      navigate(`/sessions/${sessionId}/games/${game.id}`);
    } catch (error) {
      console.error('게임 시작 오류:', error);
      alert('게임 시작에 실패했습니다. 콘솔을 확인해주세요.');
    }
  };

  const getContentList = () => {
    switch (selectedGameType) {
      case 'SONG':
        return songs?.map((song) => ({
          id: song.id,
          name: `${song.title} - ${song.artist}`,
        }));
      case 'MEDIA':
        return mediaList?.map((media) => ({
          id: media.id,
          name: `${media.title} (${media.mediaType})`,
        }));
      case 'SPEED':
        return speedCategories?.map((cat) => ({
          id: cat.id,
          name: `${cat.categoryName} (${cat.items?.length || 0}개 항목)`,
        }));
      case 'ACTION':
        return actions?.map((action) => ({
          id: action.id,
          name: action.actionName,
        }));
      default:
        return [];
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="text-xl text-gray-600">로딩 중...</div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="text-center py-12">
        <div className="text-xl text-red-600">
          세션을 불러오는데 실패했습니다.
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* 헤더 */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {session.sessionName}
            </h1>
            <div className="flex items-center space-x-4 text-gray-600">
              <span>MC: {session.mcName}</span>
              <span>•</span>
              <span>참가자: {session.totalParticipants}명</span>
              <span>•</span>
              <span>
                {new Date(session.sessionDate).toLocaleDateString('ko-KR')}
              </span>
            </div>
          </div>
          <span
            className={`px-4 py-2 rounded-full font-semibold ${
              session.status === '준비중'
                ? 'bg-yellow-100 text-yellow-800'
                : session.status === '진행중'
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {session.status}
          </span>
        </div>
      </div>

      {/* 팀 정보 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {session.teams?.map((team) => (
          <div key={team.id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h2
                className={`text-2xl font-bold ${
                  team.teamName === 'A팀' ? 'text-blue-600' : 'text-pink-600'
                }`}
              >
                {team.teamName}
              </h2>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-900">
                  {team.totalScore}
                </div>
                <div className="text-sm text-gray-600">점</div>
              </div>
            </div>
            
            <div className="mb-2 text-sm text-gray-600">
              {team.teamType} • {team.participants?.length || 0}명
            </div>

            <div className="space-y-1">
              {team.participants?.map((participant) => (
                <div
                  key={participant.id}
                  className="flex items-center space-x-2 text-gray-700"
                >
                  <span className="text-gray-400">•</span>
                  <span>{participant.participantName}</span>
                  {participant.isMc && (
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
                      MC
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 게임 선택 */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">게임 선택</h2>
        
        {session.status === '준비중' || session.status === '진행중' ? (
          <div>
            {!showGameSelect ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button
                  onClick={() => handleGameSelect('SONG')}
                  className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition"
                >
                  <div className="text-4xl mb-2">🎵</div>
                  <div className="font-semibold">노래 맞추기</div>
                </button>
                <button
                  onClick={() => handleGameSelect('MEDIA')}
                  className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition"
                >
                  <div className="text-4xl mb-2">🎬</div>
                  <div className="font-semibold">드라마/영화</div>
                </button>
                <button
                  onClick={() => handleGameSelect('SPEED')}
                  className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition"
                >
                  <div className="text-4xl mb-2">⚡</div>
                  <div className="font-semibold">스피드 게임</div>
                </button>
                <button
                  onClick={() => handleGameSelect('ACTION')}
                  className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition"
                >
                  <div className="text-4xl mb-2">🤸</div>
                  <div className="font-semibold">동작 게임</div>
                </button>
              </div>
            ) : (
              <div>
                <div className="mb-4">
                  <button
                    onClick={() => {
                      setShowGameSelect(false);
                      setSelectedGameType('');
                      setSelectedContent([]);
                    }}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    ← 게임 선택으로 돌아가기
                  </button>
                </div>

                <h3 className="text-lg font-semibold mb-3">
                  콘텐츠 선택 ({selectedContent.length}개 선택) 
                  {selectedGameType === 'SONG' && ` / 전체 ${songs?.length || 0}개`}
                </h3>

                <div className="space-y-2 mb-4 max-h-96 overflow-y-auto">
                  {getContentList()?.map((content) => (
                    <label
                      key={content.id}
                      className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedContent.includes(content.id)}
                        onChange={() => toggleContentSelection(content.id)}
                        className="mr-3"
                      />
                      <span>{content.name}</span>
                    </label>
                  ))}
                  {getContentList()?.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      등록된 콘텐츠가 없습니다.
                      <Link to="/content" className="block mt-2 text-blue-600">
                        콘텐츠 관리로 이동 →
                      </Link>
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setShowGameSelect(false);
                      setSelectedGameType('');
                      setSelectedContent([]);
                    }}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleStartGame}
                    disabled={selectedContent.length === 0}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    게임 시작
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-600">
            세션이 완료되었습니다.
          </div>
        )}
      </div>

      {/* 뒤로 가기 */}
      <div className="mt-6">
        <Link
          to="/sessions"
          className="text-blue-600 hover:text-blue-700 font-semibold"
        >
          ← 세션 목록으로
        </Link>
      </div>
    </div>
  );
}