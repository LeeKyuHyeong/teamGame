import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { sessionsApi, roundsApi, speedApi, gamesApi } from '../../api';
import type { SessionGame, Session, GameRound, SpeedItem, SpeedCategory } from '../../types';

interface SpeedGameProps {
  game: SessionGame;
  session?: Session;
}

export default function SpeedGame({ game, session: sessionProp }: SpeedGameProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [currentTeamIndex, setCurrentTeamIndex] = useState(0);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [shuffledItems, setShuffledItems] = useState<SpeedItem[]>([]);

  const { data: sessionFromQuery } = useQuery<Session>({
    queryKey: ['sessions', game.sessionId],
    queryFn: () => sessionsApi.getOne(game.sessionId),
    enabled: !sessionProp,
  });

  const session = sessionProp || sessionFromQuery;

  const { data: rounds } = useQuery<GameRound[]>({
    queryKey: ['rounds', game.id],
    queryFn: () => roundsApi.getByGame(game.id),
  });

  const currentTeam = session?.teams?.[currentTeamIndex];
  const teamRounds = rounds?.filter(r => r.teamId === currentTeam?.id) || [];
  const currentRound = teamRounds[0];

  useEffect(() => {
    const fetchItems = async () => {
      if (currentRound?.contentId) {
        try {
          const items = await speedApi.getShuffled(currentRound.contentId);
          setShuffledItems(items);
        } catch (error) {
          console.error('아이템 조회 실패:', error);
        }
      }
    };

    if (currentRound && !isRunning && !isFinished) {
      fetchItems();
      setCurrentItemIndex(0);
      setCorrectCount(0);
      setTimeLeft(120);
    }
  }, [currentRound, isRunning, isFinished]);

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsRunning(false);
          setIsFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const handleStart = () => {
    setIsRunning(true);
  };

  const handleCorrect = () => {
    setCorrectCount(prev => prev + 1);
    
    if (currentItemIndex < shuffledItems.length - 1) {
      setCurrentItemIndex(prev => prev + 1);
    } else {
      setIsRunning(false);
      setIsFinished(true);
    }
  };

  const handlePass = () => {
    if (currentItemIndex < shuffledItems.length - 1) {
      setCurrentItemIndex(prev => prev + 1);
    } else {
      setIsRunning(false);
      setIsFinished(true);
    }
  };

  const handleNextTeam = () => {
    if (currentTeamIndex < (session?.teams?.length || 0) - 1) {
      setCurrentTeamIndex(prev => prev + 1);
      setIsRunning(false);
      setIsFinished(false);
      setCurrentItemIndex(0);
      setCorrectCount(0);
      setTimeLeft(120);
    } else {
      handleGameEnd();
    }
  };

  const handleGameEnd = async () => {
    try {
      await gamesApi.complete(game.id);
      navigate(`/sessions/${game.sessionId}`);
    } catch (error) {
      console.error('게임 종료 실패:', error);
    }
  };

  if (!session || !rounds || rounds.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-2xl text-gray-600">로딩 중...</div>
      </div>
    );
  }

  if (!currentTeam || !currentRound) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-2xl text-red-600">팀 또는 라운드 정보를 찾을 수 없습니다.</div>
      </div>
    );
  }

  const currentItem = shuffledItems[currentItemIndex];
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">⚡ 스피드 게임</h1>
          <button
            onClick={() => navigate(`/sessions/${game.sessionId}`)}
            className="px-6 py-2 bg-white text-green-900 rounded-lg font-semibold hover:bg-gray-100"
          >
            세션으로 돌아가기
          </button>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8">
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-sm opacity-80 mb-1">현재 팀</div>
              <div className="text-3xl font-bold">
                {currentTeam.teamName}
              </div>
            </div>
            <div>
              <div className="text-sm opacity-80 mb-1">정답 수</div>
              <div className="text-3xl font-bold text-yellow-300">
                {correctCount} / {shuffledItems.length}
              </div>
            </div>
            <div>
              <div className="text-sm opacity-80 mb-1">남은 시간</div>
              <div className={`text-3xl font-bold ${timeLeft <= 30 ? 'text-red-400 animate-pulse' : 'text-blue-300'}`}>
                {minutes}:{seconds.toString().padStart(2, '0')}
              </div>
            </div>
          </div>
        </div>

        {!isRunning && !isFinished && (
          <div className="bg-white rounded-lg p-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {currentTeam.teamName} 준비!
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              {(currentRound.content as SpeedCategory)?.categoryName || '스피드 게임'}
            </p>
            <p className="text-gray-600 mb-8">
              2분 안에 최대한 많은 정답을 맞추세요!
            </p>
            <button
              onClick={handleStart}
              className="px-12 py-4 bg-green-600 text-white text-2xl rounded-lg font-bold hover:bg-green-700 transition"
            >
              시작하기
            </button>
          </div>
        )}

        {isRunning && currentItem && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-16 text-center">
              <div className="text-6xl font-bold text-gray-900 mb-4">
                {currentItem.itemContent}
              </div>
              <div className="text-2xl text-gray-500">
                {currentItemIndex + 1} / {shuffledItems.length}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <button
                onClick={handleCorrect}
                className="py-8 bg-blue-600 text-white text-3xl rounded-lg font-bold hover:bg-blue-700 transition"
              >
                ✓ 정답
              </button>
              <button
                onClick={handlePass}
                className="py-8 bg-gray-600 text-white text-3xl rounded-lg font-bold hover:bg-gray-700 transition"
              >
                → 패스
              </button>
            </div>
          </div>
        )}

        {isFinished && (
          <div className="bg-white rounded-lg p-12 text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {currentTeam.teamName} 종료!
            </h2>
            <div className="text-6xl font-bold text-green-600 mb-8">
              {correctCount}개 정답
            </div>
            <p className="text-xl text-gray-600 mb-8">
              총 {shuffledItems.length}개 중 {correctCount}개를 맞추셨습니다!
            </p>
            
            {currentTeamIndex < (session.teams?.length || 0) - 1 ? (
              <button
                onClick={handleNextTeam}
                className="px-12 py-4 bg-green-600 text-white text-2xl rounded-lg font-bold hover:bg-green-700 transition"
              >
                다음 팀으로
              </button>
            ) : (
              <button
                onClick={handleGameEnd}
                className="px-12 py-4 bg-gray-600 text-white text-2xl rounded-lg font-bold hover:bg-gray-700 transition"
              >
                게임 종료
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
