import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { roundsApi, scoresApi, speedApi } from '../../api';
import type { SessionGame, Session, GameRound, SpeedItem } from '../../types';

interface Props {
  game: SessionGame;
  session?: Session;
}

export default function SpeedGame({ game, session }: Props) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [currentRound, setCurrentRound] = useState<GameRound | null>(null);
  const [shuffledItems, setShuffledItems] = useState<SpeedItem[]>([]);
  const [timeLeft, setTimeLeft] = useState(120); // 2분
  const [isRunning, setIsRunning] = useState(false);
  const [scoreInputs, setScoreInputs] = useState<{ [teamId: number]: { score: number; count: number } }>({});

  const { data: rounds } = useQuery<GameRound[]>({
    queryKey: ['rounds', game.id],
    queryFn: () => roundsApi.getByGame(game.id),
  });

  useEffect(() => {
    if (rounds && rounds.length > 0) {
      const nextRound = rounds.find((r) => !r.isAnswerRevealed) || rounds[rounds.length - 1];
      setCurrentRound(nextRound);
    }
  }, [rounds]);

  // 셔플된 항목 가져오기
  useEffect(() => {
    if (currentRound?.contentId) {
      speedApi.getShuffled(currentRound.contentId).then((items) => {
        setShuffledItems(items);
      });
    }
  }, [currentRound]);

  // 타이머
  useEffect(() => {
    let interval: number;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    if (timeLeft === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const scoreMutation = useMutation({
    mutationFn: scoresApi.assignScore,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions', session?.id] });
    },
  });

  const handleScoreSubmit = (teamId: number) => {
    if (!currentRound || !scoreInputs[teamId]) return;
    scoreMutation.mutate({
      roundId: currentRound.id,
      teamId,
      score: scoreInputs[teamId].score,
      correctCount: scoreInputs[teamId].count,
    });
  };

  const handleCompareScores = async () => {
    if (!currentRound) return;
    const result = await scoresApi.compareScores(currentRound.id);
    const winner = result.winner;
    if (winner) {
      alert(`승자: ${winner.teamName}!`);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!currentRound) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        <div className="text-center">
          <p className="text-2xl mb-4">라운드 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      {/* 헤더 */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">⚡ 스피드 게임</h1>
            <p className="text-gray-400">
              유형: {currentRound.content?.categoryName}
            </p>
          </div>
          <button
            onClick={() => navigate(`/sessions/${session?.id}`)}
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg"
          >
            ← 세션으로
          </button>
        </div>

        {/* 팀 점수판 */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {session?.teams?.map((team) => (
            <div
              key={team.id}
              className={`p-6 rounded-lg ${
                team.teamName === 'A팀' ? 'bg-blue-900' : 'bg-pink-900'
              }`}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold">{team.teamName}</h3>
                <div className="text-4xl font-bold">{team.totalScore}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="max-w-4xl mx-auto">
        {/* 타이머 */}
        <div className="bg-black rounded-lg p-12 mb-8 text-center">
          <div className={`text-8xl font-bold ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-green-400'}`}>
            {formatTime(timeLeft)}
          </div>
          {timeLeft === 0 && (
            <div className="text-4xl font-bold text-red-500 mt-4 animate-bounce">
              끝!
            </div>
          )}
        </div>

        {/* 타이머 컨트롤 */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => {
              setIsRunning(!isRunning);
            }}
            className={`flex-1 py-4 rounded-lg font-bold text-lg ${
              isRunning ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {isRunning ? '⏸ 일시정지' : '▶ 시작'}
          </button>
          <button
            onClick={() => {
              setTimeLeft(120);
              setIsRunning(false);
            }}
            className="px-8 py-4 bg-gray-700 hover:bg-gray-600 rounded-lg font-bold text-lg"
          >
            🔄 리셋
          </button>
        </div>

        {/* 항목 표시 */}
        {!isRunning && timeLeft === 120 && (
          <div className="bg-gray-800 p-6 rounded-lg mb-8">
            <h3 className="text-xl font-bold mb-4">항목 목록 ({shuffledItems.length}개)</h3>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
              {shuffledItems.map((item, index) => (
                <div key={item.id} className="bg-gray-700 p-3 rounded-lg text-center">
                  <span className="text-sm text-gray-400">{index + 1}.</span>
                  <p className="font-semibold">{item.itemName}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 점수 입력 */}
        {timeLeft === 0 && (
          <div className="bg-gray-800 p-6 rounded-lg space-y-4">
            <h3 className="text-xl font-bold mb-4">점수 입력</h3>
            {session?.teams?.map((team) => (
              <div key={team.id} className="space-y-2">
                <div className="flex items-center space-x-4">
                  <span className="w-24 font-semibold">{team.teamName}</span>
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={scoreInputs[team.id]?.count || ''}
                      onChange={(e) =>
                        setScoreInputs({
                          ...scoreInputs,
                          [team.id]: {
                            ...scoreInputs[team.id],
                            count: parseInt(e.target.value) || 0,
                            score: parseInt(e.target.value) || 0,
                          },
                        })
                      }
                      className="px-4 py-2 bg-gray-700 rounded-lg text-white"
                      placeholder="맞춘 개수"
                      min="0"
                    />
                    <input
                      type="number"
                      value={scoreInputs[team.id]?.score || ''}
                      onChange={(e) =>
                        setScoreInputs({
                          ...scoreInputs,
                          [team.id]: {
                            ...scoreInputs[team.id],
                            score: parseInt(e.target.value) || 0,
                          },
                        })
                      }
                      className="px-4 py-2 bg-gray-700 rounded-lg text-white"
                      placeholder="점수"
                      min="0"
                    />
                  </div>
                  <button
                    onClick={() => handleScoreSubmit(team.id)}
                    disabled={!scoreInputs[team.id]?.score}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    부여
                  </button>
                </div>
              </div>
            ))}
            <button
              onClick={handleCompareScores}
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-bold"
            >
              승자 확인
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
