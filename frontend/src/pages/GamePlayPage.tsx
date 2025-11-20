import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { gamesApi, sessionsApi } from '../api';
import type { SessionGame, Session } from '../types';
import SongGame from '../components/game/SongGame';
import MediaGame from '../components/game/MediaGame';
import SpeedGame from '../components/game/SpeedGame';
import ActionGame from '../components/game/ActionGame';

export default function GamePlayPage() {
  const { sessionId, gameId } = useParams();
  const navigate = useNavigate();

  const { data: session, isLoading: sessionLoading } = useQuery<Session>({
    queryKey: ['sessions', parseInt(sessionId || '0')],
    queryFn: () => sessionsApi.getOne(parseInt(sessionId || '0')),
  });

  const { data: game, isLoading, error } = useQuery<SessionGame>({
    queryKey: ['games', parseInt(gameId || '0')],
    queryFn: () => gamesApi.getOne(parseInt(gameId || '0')),
  });
  
  if (isLoading || sessionLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="text-center">
          <div className="text-2xl mb-4">로딩 중...</div>
          <p className="text-gray-400">세션: {sessionLoading ? '로딩 중' : '완료'}</p>
          <p className="text-gray-400">게임: {isLoading ? '로딩 중' : '완료'}</p>
        </div>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="text-center py-12">
        <div className="text-xl text-red-600">게임을 불러오는데 실패했습니다.</div>
        <button
          onClick={() => navigate(`/sessions/${sessionId}`)}
          className="mt-4 text-blue-600 hover:text-blue-700"
        >
          ← 세션으로 돌아가기
        </button>
      </div>
    );
  }

  const renderGame = () => {
    const gameCode = game.gameType?.gameCode;

    switch (gameCode) {
      case 'SONG':
        return <SongGame game={game} session={session} />;
      case 'MEDIA':
        return <MediaGame game={game} session={session} />;
      case 'SPEED':
        return <SpeedGame game={game} session={session} />;
      case 'ACTION':
        return <ActionGame game={game} session={session} />;
      default:
        return <div>알 수 없는 게임 타입입니다.</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {renderGame()}
    </div>
  );
}
