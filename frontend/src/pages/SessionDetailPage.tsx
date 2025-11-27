import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { sessionsApi, gamesApi, songsApi, mediaApi, speedApi } from '../api';
import type { Session, Song, MediaContent, SpeedCategory, TeamSpeedConfig } from '../types';

export default function SessionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const sessionId = parseInt(id || '0');
  const navigate = useNavigate();

  const [showGameSelect, setShowGameSelect] = useState(false);
  const [selectedGameType, setSelectedGameType] = useState<string>('');
  const [roundCount, setRoundCount] = useState<number>(5);

  // 스피드 게임 팀별 설정
  const [teamACategory, setTeamACategory] = useState<number>(0);
  const [teamARounds, setTeamARounds] = useState<number>(5);
  const [teamBCategory, setTeamBCategory] = useState<number>(0);
  const [teamBRounds, setTeamBRounds] = useState<number>(5);

  const { data: session, isLoading, error } = useQuery<Session>({
    queryKey: ['sessions', sessionId],
    queryFn: () => sessionsApi.getOne(sessionId),
  });

  // 노래 전체 개수 조회
  const { data: songs } = useQuery<Song[]>({
    queryKey: ['songs'],
    queryFn: songsApi.getAll,
    enabled: selectedGameType === 'SONG',
  });

  // 드라마/영화 전체 개수 조회
  const { data: mediaList } = useQuery<MediaContent[]>({
    queryKey: ['media'],
    queryFn: mediaApi.getAll,
    enabled: selectedGameType === 'MEDIA',
  });

  // 스피드 카테고리 조회
  const { data: speedCategories } = useQuery<SpeedCategory[]>({
    queryKey: ['speed-categories'],
    queryFn: speedApi.getAllCategories,
    enabled: selectedGameType === 'SPEED',
  });

  // 최대 라운드 수 설정
  useEffect(() => {
    if (selectedGameType === 'SONG' && songs) {
      setRoundCount(Math.min(5, songs.length));
    } else if (selectedGameType === 'MEDIA' && mediaList) {
      setRoundCount(Math.min(5, mediaList.length));
    }
  }, [selectedGameType, songs, mediaList]);

  const handleGameSelect = (gameCode: string) => {
    setSelectedGameType(gameCode);
    setShowGameSelect(true);
  };

  const handleStartGame = async () => {
    if (!selectedGameType) {
      alert('게임 타입을 선택해주세요.');
      return;
    }

    if (selectedGameType === 'SONG') {
      if (!songs || songs.length === 0) {
        alert('등록된 노래가 없습니다.');
        return;
      }

      if (roundCount <= 0 || roundCount > songs.length) {
        alert(`라운드 수는 1~${songs.length} 사이여야 합니다.`);
        return;
      }
    } else if (selectedGameType === 'MEDIA') {
      if (!mediaList || mediaList.length === 0) {
        alert('등록된 드라마/영화가 없습니다.');
        return;
      }

      if (roundCount <= 0 || roundCount > mediaList.length) {
        alert(`라운드 수는 1~${mediaList.length} 사이여야 합니다.`);
        return;
      }
    } else if (selectedGameType === 'SPEED') {
      if (!speedCategories || speedCategories.length === 0) {
        alert('등록된 스피드 게임 유형이 없습니다.');
        return;
      }

      if (teamACategory === 0 || teamBCategory === 0) {
        alert('양 팀의 게임 유형을 모두 선택해주세요.');
        return;
      }

      if (!session?.teams || session.teams.length < 2) {
        alert('팀 정보를 찾을 수 없습니다.');
        return;
      }
    }

    try {
      const game = await gamesApi.create({
        sessionId,
        gameCode: selectedGameType,
        gameOrder: (session?.sessionGames?.length || 0) + 1,
      });

      if (selectedGameType === 'SPEED') {
        const teamConfigs: TeamSpeedConfig[] = [
          {
            teamId: Number(session!.teams![0].id),
            categoryId: Number(teamACategory),
            roundCount: teamARounds,
          },
          {
            teamId: Number(session!.teams![1].id),
            categoryId: Number(teamBCategory),
            roundCount: teamBRounds,
          },
        ];

        await gamesApi.start(game.id, { teamConfigs });
      } else {
        await gamesApi.start(game.id, { roundCount });
      }

      navigate(`/sessions/${sessionId}/games/${game.id}`);
    } catch (error) {
      console.error('게임 시작 오류:', error);
      alert('게임 시작에 실패했습니다.');
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

  // 실제 참가자 수 계산 (MC 제외)
  const totalParticipants = session.teams?.reduce((total, team) => {
    const nonMcParticipants = team.participants?.filter(p => !p.isMc).length || 0;
    return total + nonMcParticipants;
  }, 0) || 0;

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
              <span>참가자: {totalParticipants}명</span>
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
        {session.teams?.map((team) => {
          const teamScore = team.participants
            ?.filter(p => !p.isMc)
            .reduce((sum, p) => sum + (p.totalScore || 0), 0) || 0;
          
          return (
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
                    {teamScore}
                  </div>
                  <div className="text-sm text-gray-600">점</div>
                </div>
              </div>

              <div className="mb-2 text-sm text-gray-600">
                {team.teamName} • {team.participants?.filter(p => !p.isMc).length || 0}명
              </div>

              <div className="space-y-2">
                {team.participants?.map((participant) => (
                  <div
                    key={participant.id}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-700 font-medium">{participant.participantName}</span>
                      {participant.isMc && (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
                          MC
                        </span>
                      )}
                    </div>
                    {!participant.isMc && (
                      <span className="text-sm font-semibold text-gray-900">
                        {participant.totalScore || 0}점
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
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
                  className="p-6 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition"
                >
                  <div className="text-4xl mb-2">🎬</div>
                  <div className="font-semibold">드라마/영화</div>
                </button>
                <button
                  onClick={() => handleGameSelect('SPEED')}
                  className="p-6 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition"
                >
                  <div className="text-4xl mb-2">⚡</div>
                  <div className="font-semibold">스피드 게임</div>
                </button>
                <button
                  disabled
                  className="p-6 border-2 border-gray-200 rounded-lg opacity-50 cursor-not-allowed"
                >
                  <div className="text-4xl mb-2">🤸</div>
                  <div className="font-semibold">동작 게임</div>
                  <div className="text-xs text-gray-500">(준비 중)</div>
                </button>
              </div>
            ) : (
              <div>
                <div className="mb-4">
                  <button
                    onClick={() => {
                      setShowGameSelect(false);
                      setSelectedGameType('');
                    }}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    ← 게임 선택으로 돌아가기
                  </button>
                </div>

                {selectedGameType === 'SONG' && (
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">
                      🎵 노래 맞추기 설정
                    </h3>

                    <div className="mb-6">
                      <p className="text-gray-600 mb-2">
                        등록된 노래: <span className="font-bold text-blue-600">{songs?.length || 0}곡</span>
                      </p>
                      <p className="text-sm text-gray-500">
                        랜덤으로 선곡됩니다
                      </p>
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        진행할 라운드 수
                      </label>
                      <input
                        type="number"
                        value={roundCount}
                        onChange={(e) => setRoundCount(parseInt(e.target.value) || 1)}
                        min={1}
                        max={songs?.length || 1}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        1 ~ {songs?.length || 0} 사이의 숫자를 입력하세요
                      </p>
                    </div>

                    {(!songs || songs.length === 0) && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                        <p className="text-yellow-800">
                          등록된 노래가 없습니다.
                          <Link to="/content" className="underline ml-2">
                            콘텐츠 관리로 이동 →
                          </Link>
                        </p>
                      </div>
                    )}

                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => {
                          setShowGameSelect(false);
                          setSelectedGameType('');
                        }}
                        className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        취소
                      </button>
                      <button
                        onClick={handleStartGame}
                        disabled={!songs || songs.length === 0}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        게임 시작
                      </button>
                    </div>
                  </div>
                )}

                {selectedGameType === 'MEDIA' && (
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">
                      🎬 드라마/영화 맞추기 설정
                    </h3>

                    <div className="mb-6">
                      <p className="text-gray-600 mb-2">
                        등록된 콘텐츠: <span className="font-bold text-purple-600">{mediaList?.length || 0}개</span>
                      </p>
                      <p className="text-sm text-gray-500">
                        랜덤으로 선택됩니다
                      </p>
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        진행할 라운드 수
                      </label>
                      <input
                        type="number"
                        value={roundCount}
                        onChange={(e) => setRoundCount(parseInt(e.target.value) || 1)}
                        min={1}
                        max={mediaList?.length || 1}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        1 ~ {mediaList?.length || 0} 사이의 숫자를 입력하세요
                      </p>
                    </div>

                    {(!mediaList || mediaList.length === 0) && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                        <p className="text-yellow-800">
                          등록된 드라마/영화가 없습니다.
                          <Link to="/content" className="underline ml-2">
                            콘텐츠 관리로 이동 →
                          </Link>
                        </p>
                      </div>
                    )}

                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => {
                          setShowGameSelect(false);
                          setSelectedGameType('');
                        }}
                        className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        취소
                      </button>
                      <button
                        onClick={handleStartGame}
                        disabled={!mediaList || mediaList.length === 0}
                        className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        게임 시작
                      </button>
                    </div>
                  </div>
                )}

                {selectedGameType === 'SPEED' && (
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">
                      ⚡ 스피드 게임 설정
                    </h3>

                    <p className="text-sm text-gray-600 mb-6">
                      각 팀이 다른 유형의 게임을 진행합니다. 2분 안에 최대한 많은 정답을 맞추세요!
                    </p>

                    {(!speedCategories || speedCategories.length === 0) && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                        <p className="text-yellow-800">
                          등록된 스피드 게임 유형이 없습니다.
                          <Link to="/content" className="underline ml-2">
                            콘텐츠 관리로 이동 →
                          </Link>
                        </p>
                      </div>
                    )}

                    {/* 팀별 설정 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      {/* A팀 설정 */}
                      <div className="bg-white p-4 rounded-lg border-2 border-blue-200">
                        <h4 className="font-semibold text-blue-600 mb-3">
                          {session?.teams?.[0]?.teamName || 'A팀'}
                        </h4>
                        
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              게임 유형
                            </label>
                            <select
                              value={teamACategory}
                              onChange={(e) => setTeamACategory(parseInt(e.target.value))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            >
                              <option value={0}>선택하세요</option>
                              {speedCategories?.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                  {cat.categoryName} ({cat.items?.length || 0}개)
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              라운드 수
                            </label>
                            <input
                              type="number"
                              value={teamARounds}
                              onChange={(e) => setTeamARounds(parseInt(e.target.value) || 1)}
                              min={1}
                              max={speedCategories?.find(c => c.id === teamACategory)?.items?.length || 50}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              2분 동안 진행됩니다
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* B팀 설정 */}
                      <div className="bg-white p-4 rounded-lg border-2 border-pink-200">
                        <h4 className="font-semibold text-pink-600 mb-3">
                          {session?.teams?.[1]?.teamName || 'B팀'}
                        </h4>
                        
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              게임 유형
                            </label>
                            <select
                              value={teamBCategory}
                              onChange={(e) => setTeamBCategory(parseInt(e.target.value))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            >
                              <option value={0}>선택하세요</option>
                              {speedCategories?.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                  {cat.categoryName} ({cat.items?.length || 0}개)
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              라운드 수
                            </label>
                            <input
                              type="number"
                              value={teamBRounds}
                              onChange={(e) => setTeamBRounds(parseInt(e.target.value) || 1)}
                              min={1}
                              max={speedCategories?.find(c => c.id === teamBCategory)?.items?.length || 50}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              2분 동안 진행됩니다
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => {
                          setShowGameSelect(false);
                          setSelectedGameType('');
                        }}
                        className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        취소
                      </button>
                      <button
                        onClick={handleStartGame}
                        disabled={
                          !speedCategories || 
                          speedCategories.length === 0 || 
                          teamACategory === 0 || 
                          teamBCategory === 0
                        }
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        게임 시작
                      </button>
                    </div>
                  </div>
                )}
                
                
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