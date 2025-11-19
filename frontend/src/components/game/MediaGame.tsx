import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { roundsApi, scoresApi } from '../../api';
import type { SessionGame, Session, GameRound } from '../../types';

interface Props {
  game: SessionGame;
  session?: Session;
}

export default function MediaGame({ game, session }: Props) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [currentRound, setCurrentRound] = useState<GameRound | null>(null);
  const [scoreInputs, setScoreInputs] = useState<{ [teamId: number]: number }>({});

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

  const revealMutation = useMutation({
    mutationFn: (reveal: boolean) => roundsApi.revealAnswer(currentRound!.id, reveal),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rounds', game.id] });
    },
  });

  const scoreMutation = useMutation({
    mutationFn: scoresApi.assignScore,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions', session?.id] });
      setScoreInputs({});
    },
  });

  const handleScoreSubmit = (teamId: number) => {
    if (!currentRound || !scoreInputs[teamId]) return;
    scoreMutation.mutate({
      roundId: currentRound.id,
      teamId,
      score: scoreInputs[teamId],
    });
  };

  if (!currentRound || !currentRound.content) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        <div className="text-center">
          <p className="text-2xl mb-4">라운드 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  const media = currentRound.content;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      {/* 헤더 */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">🎬 드라마/영화 맞추기</h1>
            <p className="text-gray-400">
              라운드 {currentRound.roundNumber} / {rounds?.length}
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
        {/* 이미지 표시 */}
        <div className="bg-black rounded-lg overflow-hidden mb-8">
          <div className="aspect-video flex items-center justify-center bg-gray-800">
            <div className="text-6xl">🖼️</div>
            <p className="text-gray-400 ml-4">이미지: {media.imagePath}</p>
          </div>
        </div>

        {/* 정답 표시 */}
        {currentRound.isAnswerRevealed ? (
          <div className="bg-green-900 p-8 rounded-lg mb-8 text-center">
            <p className="text-3xl font-bold mb-2">{media.title}</p>
            <p className="text-xl text-green-300">{media.mediaType}</p>
            {media.description && (
              <p className="text-gray-300 mt-4">{media.description}</p>
            )}
          </div>
        ) : (
          <div className="bg-gray-800 p-8 rounded-lg mb-8 text-center">
            <p className="text-2xl text-gray-400">정답이 숨겨져 있습니다</p>
          </div>
        )}

        {/* 컨트롤 */}
        <div className="space-y-4">
          <button
            onClick={() => revealMutation.mutate(!currentRound.isAnswerRevealed)}
            className={`w-full py-4 rounded-lg font-bold text-lg ${
              currentRound.isAnswerRevealed
                ? 'bg-gray-700 hover:bg-gray-600'
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {currentRound.isAnswerRevealed ? '정답 숨기기' : '정답 공개'}
          </button>

          {/* 점수 입력 */}
          {currentRound.isAnswerRevealed && (
            <div className="bg-gray-800 p-6 rounded-lg space-y-4">
              <h3 className="text-xl font-bold mb-4">점수 부여</h3>
              {session?.teams?.map((team) => (
                <div key={team.id} className="flex items-center space-x-4">
                  <span className="w-24 font-semibold">{team.teamName}</span>
                  <input
                    type="number"
                    value={scoreInputs[team.id] || ''}
                    onChange={(e) =>
                      setScoreInputs({
                        ...scoreInputs,
                        [team.id]: parseInt(e.target.value) || 0,
                      })
                    }
                    className="flex-1 px-4 py-2 bg-gray-700 rounded-lg text-white"
                    placeholder="점수 입력"
                    min="0"
                  />
                  <button
                    onClick={() => handleScoreSubmit(team.id)}
                    disabled={!scoreInputs[team.id]}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    부여
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* 다음 라운드 */}
          {currentRound.isAnswerRevealed && (
            <button
              onClick={() => {
                const currentIndex = rounds?.findIndex((r) => r.id === currentRound.id) || 0;
                if (rounds && currentIndex < rounds.length - 1) {
                  setCurrentRound(rounds[currentIndex + 1]);
                  setScoreInputs({});
                } else {
                  alert('마지막 라운드입니다!');
                }
              }}
              className="w-full py-4 bg-purple-600 hover:bg-purple-700 rounded-lg font-bold text-lg"
            >
              다음 라운드 →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
