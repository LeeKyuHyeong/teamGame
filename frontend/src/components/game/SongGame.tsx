import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { roundsApi, scoresApi, gamesApi } from '../../api';
import type { SessionGame, Session, GameRound, Participant } from '../../types';

interface Props {
  game: SessionGame;
  session?: Session;
}

export default function SongGame({ game, session }: Props) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const playerRef = useRef<any>(null);
  
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [winner, setWinner] = useState<Participant | null>(null);

  const { data: rounds, isLoading } = useQuery<GameRound[]>({
    queryKey: ['rounds', game.id],
    queryFn: () => roundsApi.getByGame(game.id),
  });

  // 디버깅
  useEffect(() => {
    console.log('Rounds 데이터:', rounds);
    console.log('현재 라운드 인덱스:', currentRoundIndex);
    if (rounds && rounds.length > 0) {
      console.log('현재 라운드:', rounds[currentRoundIndex]);
      console.log('노래 데이터:', rounds[currentRoundIndex]?.content);
    }
  }, [rounds, currentRoundIndex]);

  const scoreMutation = useMutation({
    mutationFn: scoresApi.assignScore,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions', session?.id] });
    },
  });

  const completeGameMutation = useMutation({
    mutationFn: () => gamesApi.complete(game.id),
    onSuccess: () => {
      alert('게임이 종료되었습니다!');
      navigate(`/sessions/${session?.id}`);
    },
  });

  // YouTube API 로드
  useEffect(() => {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);

    (window as any).onYouTubeIframeAPIReady = () => {
      console.log('YouTube API Ready');
    };
  }, []);

  // 현재 라운드
  const currentRound = rounds?.[currentRoundIndex];
  const song = currentRound?.content;

  // YouTube 비디오 ID 추출
  const getVideoId = (url: string) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
    return match?.[1] || '';
  };

  // 플레이어 생성
  useEffect(() => {
    if (song && (window as any).YT && !playerRef.current) {
      playerRef.current = new (window as any).YT.Player('youtube-player', {
        height: '100%',
        width: '100%',
        videoId: getVideoId(song.youtubeUrl),
        playerVars: {
          start: song.startTime || 0,
          controls: 0,
        },
        events: {
          onReady: (_event: any) => {
            console.log('플레이어 준비 완료');
          },
        },
      });
    }
  }, [song]);

  const handlePlay = () => {
    if (playerRef.current && playerRef.current.playVideo) {
      playerRef.current.playVideo();
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    if (playerRef.current && playerRef.current.pauseVideo) {
      playerRef.current.pauseVideo();
      setIsPlaying(false);
    }
  };

  const handleParticipantClick = (participant: Participant) => {
    if (answered || !currentRound) return;

    // 점수 부여 (예: 10점)
    scoreMutation.mutate({
      roundId: currentRound.id,
      teamId: participant.teamId,
      score: 10,
    });

    setAnswered(true);
    setWinner(participant);
    handlePause();
  };

  const handleNextRound = () => {
    if (!rounds) return;

    if (currentRoundIndex < rounds.length - 1) {
      setCurrentRoundIndex(currentRoundIndex + 1);
      setAnswered(false);
      setWinner(null);
      setIsPlaying(false);
      
      // 플레이어 리셋
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    } else {
      alert('모든 라운드가 완료되었습니다!');
      completeGameMutation.mutate();
    }
  };

  const handleEndGame = () => {
    if (confirm('정말 게임을 종료하시겠습니까?')) {
      completeGameMutation.mutate();
    }
  };

  // 모든 참가자 리스트
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
          <p className="text-gray-400 mb-4">게임 시작 시 문제가 발생했을 수 있습니다.</p>
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

  if (!currentRound) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="text-center">
          <p className="text-2xl mb-4">현재 라운드를 찾을 수 없습니다.</p>
          <p className="text-gray-400">라운드 인덱스: {currentRoundIndex}</p>
        </div>
      </div>
    );
  }

  if (!song) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="text-center">
          <p className="text-2xl mb-4 text-red-500">노래 정보를 찾을 수 없습니다.</p>
          <p className="text-gray-400 mb-2">라운드 ID: {currentRound.id}</p>
          <p className="text-gray-400 mb-4">Content ID: {currentRound.contentId}</p>
          <pre className="text-left bg-gray-800 p-4 rounded mb-4 text-sm">
            {JSON.stringify(currentRound, null, 2)}
          </pre>
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

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      {/* 헤더 */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">🎵 노래 맞추기</h1>
            <p className="text-gray-400">
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
      <div className="max-w-5xl mx-auto">
        {/* YouTube 플레이어 */}
        <div className="bg-black rounded-lg overflow-hidden mb-8">
          <div className="aspect-video">
            <div id="youtube-player"></div>
          </div>
        </div>

        {/* 정답 표시 */}
        {answered && winner ? (
          <div className="bg-green-900 p-8 rounded-lg mb-8 text-center animate-pulse">
            <p className="text-5xl font-bold mb-4">정답!</p>
            <p className="text-3xl mb-2">{song.title}</p>
            <p className="text-2xl text-green-300 mb-4">{song.artist}</p>
            <p className="text-xl">
              🎉 <span className="font-bold">{winner.participantName}</span>님이 맞췄습니다!
            </p>
          </div>
        ) : (
          <div className="bg-gray-800 p-8 rounded-lg mb-8 text-center">
            <p className="text-3xl text-gray-400">제목과 가수를 맞춰보세요!</p>
          </div>
        )}

        {/* 컨트롤 버튼 */}
        {!answered && (
          <div className="flex space-x-4 mb-8">
            <button
              onClick={handlePlay}
              disabled={isPlaying}
              className="flex-1 py-4 bg-green-600 hover:bg-green-700 rounded-lg font-bold text-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ▶ 재생
            </button>
            <button
              onClick={handlePause}
              disabled={!isPlaying}
              className="flex-1 py-4 bg-red-600 hover:bg-red-700 rounded-lg font-bold text-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ⏸ 멈춤
            </button>
          </div>
        )}

        {/* 참가자 목록 */}
        <div className="bg-gray-800 p-6 rounded-lg mb-8">
          <h3 className="text-2xl font-bold mb-4">참가자 선택</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {allParticipants.map((participant) => (
              <button
                key={participant.id}
                onClick={() => handleParticipantClick(participant)}
                disabled={answered}
                className={`p-4 rounded-lg font-semibold text-lg transition ${
                  winner?.id === participant.id
                    ? 'bg-green-600 text-white'
                    : answered
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-700 hover:bg-gray-600 text-white'
                }`}
              >
                {participant.participantName}
              </button>
            ))}
          </div>
        </div>

        {/* 다음 라운드 버튼 */}
        {answered && (
          <button
            onClick={handleNextRound}
            className="w-full py-6 bg-purple-600 hover:bg-purple-700 rounded-lg font-bold text-2xl"
          >
            {currentRoundIndex < rounds.length - 1 ? '다음 라운드 →' : '게임 완료'}
          </button>
        )}
      </div>
    </div>
  );
}