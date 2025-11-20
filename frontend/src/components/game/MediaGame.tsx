import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { roundsApi, scoresApi, gamesApi, sessionsApi } from '../../api';
import type { SessionGame, Session, GameRound, Participant } from '../../types';

interface Props {
  game: SessionGame;
  session?: Session;
}

export default function MediaGame({ game, session: sessionProp }: Props) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [winner, setWinner] = useState<Participant | null>(null);

  const { data: sessionFromQuery } = useQuery<Session>({
    queryKey: ['sessions', game.sessionId],
    queryFn: () => sessionsApi.getOne(game.sessionId),
    enabled: !!game.sessionId,
  });

  const session = sessionProp || sessionFromQuery;

  const { data: rounds, isLoading, error } = useQuery<GameRound[]>({
    queryKey: ['rounds', game.id],
    queryFn: () => roundsApi.getByGame(game.id),
  });

  useEffect(() => {
    console.log('=== MediaGame 초기 데이터 ===');
    console.log('game:', game);
    console.log('game.id:', game.id);
    console.log('game.gameType:', game.gameType);
    console.log('isLoading:', isLoading);
    console.log('error:', error);
  }, [game, isLoading, error]);

  useEffect(() => {
    console.log('=== Rounds 데이터 상세 ===');
    console.log('Rounds 데이터:', rounds);
    console.log('Rounds 타입:', Array.isArray(rounds));
    console.log('Rounds 길이:', rounds?.length);
    console.log('현재 라운드 인덱스:', currentRoundIndex);
    
    if (rounds && rounds.length > 0) {
      console.log('전체 rounds:', rounds);
      console.log('현재 라운드:', rounds[currentRoundIndex]);
      console.log('현재 라운드 content:', rounds[currentRoundIndex]?.content);
      
      const currentRound = rounds[currentRoundIndex];
      if (currentRound) {
        console.log('currentRound.id:', currentRound.id);
        console.log('currentRound.contentId:', currentRound.contentId);
        console.log('currentRound.contentType:', currentRound.contentType);
        console.log('currentRound.content:', currentRound.content);
        
        if (currentRound.content) {
          console.log('content.id:', currentRound.content.id);
          console.log('content.imageUrl:', currentRound.content.imageUrl);
          console.log('content.title:', currentRound.content.title);
        }
      }
    }
  }, [rounds, currentRoundIndex]);

  const scoreMutation = useMutation({
    mutationFn: scoresApi.assignScore,
    onMutate: async (newScore) => {
      await queryClient.cancelQueries({ queryKey: ['sessions', game.sessionId] });
      
      const previousSession = queryClient.getQueryData(['sessions', game.sessionId]);
      
      queryClient.setQueryData(['sessions', game.sessionId], (old: Session | undefined) => {
        if (!old) return old;
        
        return {
          ...old,
          teams: old.teams?.map(team => ({
            ...team,
            participants: team.participants?.map(p => 
              p.id === newScore.participantId 
                ? { ...p, totalScore: (p.totalScore || 0) + newScore.score }
                : p
            ),
          })),
        };
      });
      
      return { previousSession };
    },
    onError: (_err, _newScore, context) => {
      if (context?.previousSession) {
        queryClient.setQueryData(['sessions', game.sessionId], context.previousSession);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions', game.sessionId] });
    },
  });

  const completeGameMutation = useMutation({
    mutationFn: () => gamesApi.complete(game.id),
    onSuccess: () => {
      alert('게임이 종료되었습니다!');
      navigate(`/sessions/${session?.id}`);
    },
  });

  const currentRound = rounds?.[currentRoundIndex];
  const media = currentRound?.content;

  const handleParticipantClick = (participant: Participant) => {
    if (answered || !currentRound) return;

    scoreMutation.mutate({
      roundId: Number(currentRound.id),
      teamId: Number(participant.teamId),
      participantId: Number(participant.id),
      score: 10,
    });

    setAnswered(true);
    setWinner(participant);
  };

  const handleNextRound = () => {
    if (!rounds) return;

    if (currentRoundIndex < rounds.length - 1) {
      setCurrentRoundIndex(currentRoundIndex + 1);
      setAnswered(false);
      setWinner(null);
    } else {
      completeGameMutation.mutate();
    }
  };

  const handleEndGame = () => {
    if (confirm('정말 게임을 종료하시겠습니까?')) {
      completeGameMutation.mutate();
    }
  };

  const allParticipants = [
    ...(session?.teams?.[0]?.participants || []),
    ...(session?.teams?.[1]?.participants || []),
  ].filter((p) => !p.isMc);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="text-center">
          <p className="text-2xl mb-4">라운드 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!rounds || rounds.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="text-center">
          <p className="text-2xl mb-4 text-red-500">라운드가 생성되지 않았습니다.</p>
          <button
            onClick={() => navigate(`/sessions/${session?.id}`)}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg"
          >
            ← 세션으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  if (!media) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="text-center">
          <p className="text-2xl mb-4 text-red-500">콘텐츠를 불러올 수 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-4xl font-bold mb-2">🎬 드라마/영화 맞추기</h2>
            <p className="text-xl text-gray-300">
              라운드 {currentRoundIndex + 1} / {rounds.length}
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleEndGame}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold"
            >
              종료
            </button>
            <button
              onClick={() => navigate(`/sessions/${session?.id}`)}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg"
            >
              ← 세션으로
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          {session?.teams?.map((team) => {
            const teamScore = team.participants
              ?.filter(p => !p.isMc)
              .reduce((sum, p) => sum + (p.totalScore || 0), 0) || 0;
            
            return (
              <div
                key={team.id}
                className={`p-6 rounded-lg ${
                  team.teamName === 'A팀' ? 'bg-blue-900' : 'bg-pink-900'
                }`}
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold">{team.teamName}</h3>
                  <div className="text-4xl font-bold">{teamScore}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="max-w-5xl mx-auto">
        <div className="bg-gray-800 rounded-lg p-8 mb-8">
          <div className="flex justify-center mb-6">
            <img
              src={`http://localhost:3000${media.imageUrl}`}
              alt="장면"
              className="max-w-full max-h-96 rounded-lg shadow-lg"
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/800x450?text=Image+Not+Found';
              }}
            />
          </div>

          {answered && winner ? (
            <div className="bg-green-900 p-8 rounded-lg text-center animate-pulse">
              <p className="text-5xl font-bold mb-4">정답!</p>
              <p className="text-3xl mb-4">{media.title}</p>
              <p className="text-xl">
                🎉 <span className="font-bold">{winner.participantName}</span>님이 맞췄습니다!
              </p>
            </div>
          ) : (
            <div className="bg-gray-700 p-8 rounded-lg text-center">
              <p className="text-3xl text-gray-300">이 장면은 어떤 드라마/영화일까요?</p>
            </div>
          )}
        </div>

        <div className="bg-gray-800 p-6 rounded-lg mb-8">
          <h3 className="text-2xl font-bold mb-4">참가자를 선택하세요</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {allParticipants.map((participant) => (
              <button
                key={participant.id}
                onClick={() => handleParticipantClick(participant)}
                disabled={answered}
                className={`p-4 rounded-lg font-semibold text-lg transition ${
                  winner?.id === participant.id
                    ? 'bg-green-600 text-white ring-4 ring-green-400'
                    : answered
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg'
                }`}
              >
                {participant.participantName}
              </button>
            ))}
          </div>
          {allParticipants.length === 0 && (
            <p className="text-center text-gray-400 py-4">참가자가 없습니다.</p>
          )}
        </div>

        {answered && (
          <button
            onClick={handleNextRound}
            className="w-full py-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg font-bold text-2xl shadow-lg transition"
          >
            {currentRoundIndex < rounds.length - 1 ? '다음 라운드 →' : '🎉 게임 완료'}
          </button>
        )}
      </div>
    </div>
  );
}
