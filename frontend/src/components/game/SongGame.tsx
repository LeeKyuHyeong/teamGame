import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { roundsApi, scoresApi, gamesApi, sessionsApi } from '../../api';
import type { SessionGame, Session, GameRound, Participant } from '../../types';
import { isSong } from '../../types';

interface Props {
  game: SessionGame;
  session?: Session;
}

export default function SongGame({ game, session: sessionProp }: Props) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const playerRef = useRef<any>(null);
  
  // 받은 props 확인
  console.log('=== SongGame Props ===');
  console.log('game prop:', game);
  console.log('session prop:', sessionProp);
  console.log('session prop 타입:', typeof sessionProp);
  console.log('session prop이 있는가:', !!sessionProp);
  
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [winner, setWinner] = useState<Participant | null>(null);
  const [youtubeReady, setYoutubeReady] = useState(false);
  const [teamScores, setTeamScores] = useState<{ [teamId: number]: number }>({});

  // session을 직접 다시 조회
  const { data: sessionFromQuery } = useQuery<Session>({
    queryKey: ['sessions', game.sessionId],
    queryFn: () => sessionsApi.getOne(game.sessionId),
    enabled: !!game.sessionId,
  });

  // session prop이 있으면 그걸 쓰고, 없으면 직접 조회한 것 사용
  const session = sessionProp || sessionFromQuery;

  // 세션 최초 로드 시에만 초기 팀 점수 계산
  useEffect(() => {
    if (session?.teams && Object.keys(teamScores).length === 0) {
      const scores: { [teamId: number]: number } = {};
      session.teams.forEach(team => {
        const teamScore = team.participants
          ?.filter(p => !p.isMc)
          .reduce((sum, p) => sum + (p.totalScore || 0), 0) || 0;
        scores[team.id] = teamScore;
      });
      console.log('초기 팀 점수 설정:', scores);
      setTeamScores(scores);
    }
  }, [session, teamScores]);

  console.log('=== 최종 사용할 session ===');
  console.log('session:', session);
  console.log('session.teams:', session?.teams);

  const { data: rounds, isLoading } = useQuery<GameRound[]>({
    queryKey: ['rounds', game.id],
    queryFn: () => roundsApi.getByGame(game.id),
  });

  // 디버깅
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
        
        if (currentRound.content && isSong(currentRound.content)) {
          const song = currentRound.content;
          console.log('content.id:', song.id);
          console.log('content.youtubeUrl:', song.youtubeUrl);
          console.log('content.title:', song.title);
          console.log('content.artist:', song.artist);
        }
      }
    }
  }, [rounds, currentRoundIndex]);

  const scoreMutation = useMutation({
    mutationFn: scoresApi.assignScore,
    onSuccess: () => {
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

  // YouTube API 로드 - 개선된 버전
  useEffect(() => {
    // 이미 로드되었는지 확인
    if ((window as any).YT && (window as any).YT.Player) {
      console.log('✅ YouTube API 이미 로드됨');
      setYoutubeReady(true);
      return;
    }

    // 이미 스크립트가 추가되었는지 확인
    const existingScript = document.querySelector('script[src*="youtube.com/iframe_api"]');
    if (existingScript) {
      console.log('YouTube API 스크립트 이미 존재, 로딩 대기 중...');
      // 이미 있다면 콜백만 다시 설정
      (window as any).onYouTubeIframeAPIReady = () => {
        console.log('✅ YouTube API Ready (재설정)');
        setYoutubeReady(true);
      };
      return;
    }

    console.log('YouTube API 스크립트 추가');
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);

    (window as any).onYouTubeIframeAPIReady = () => {
      console.log('✅ YouTube API Ready');
      setYoutubeReady(true);
    };
  }, []);

  // 현재 라운드
  const currentRound = rounds?.[currentRoundIndex];
  const song = (currentRound?.content && isSong(currentRound.content)) 
    ? currentRound.content 
    : undefined;

  // YouTube 비디오 ID 추출
  const getVideoId = (url: string) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
    return match?.[1] || '';
  };

  // 플레이어 생성
  useEffect(() => {
    console.log('=== 플레이어 생성 시도 ===');
    
    // DOM 요소 확인
    const playerElement = document.getElementById('youtube-player');
    console.log('DOM 요소 youtube-player:', playerElement);
    console.log('DOM 요소가 존재하는가:', !!playerElement);
    
    console.log('song:', song);
    console.log('song이 존재하는가:', !!song);
    console.log('YouTube API 로드됨 (youtubeReady):', youtubeReady);
    console.log('YouTube API 로드됨 (window.YT):', !!(window as any).YT);
    console.log('YT 객체:', (window as any).YT);
    console.log('playerRef.current:', playerRef.current);
    console.log('playerRef.current가 null인가:', playerRef.current === null);
    console.log('모든 조건 충족:', song && youtubeReady && !playerRef.current);
    
    if (song && youtubeReady && !playerRef.current) {
      console.log('✅ 플레이어 생성 조건 충족');
      
      if (!playerElement) {
        console.error('❌ youtube-player DOM 요소를 찾을 수 없음!');
        return;
      }
      
      const videoId = getVideoId(song.youtubeUrl);
      console.log('비디오 ID:', videoId);
      console.log('YouTube URL:', song.youtubeUrl);
      
      if (!videoId) {
        console.error('❌ 비디오 ID를 추출할 수 없음:', song.youtubeUrl);
        return;
      }
      
      try {
        console.log('플레이어 생성 중...');
        playerRef.current = new (window as any).YT.Player('youtube-player', {
          height: '1',
          width: '1',
          videoId: videoId,
          playerVars: {
            start: song.startTime || 0,
            controls: 0,
            autoplay: 0,
          },
          events: {
            onReady: (_event: any) => {
              console.log('✅ 플레이어 준비 완료, 시작시간:', song.startTime || 0);
            },
            onStateChange: (event: any) => {
              console.log('플레이어 상태 변경:', event.data);
            },
            onError: (event: any) => {
              console.error('❌ 플레이어 에러:', event.data);
            },
          },
        });
        console.log('✅ 플레이어 객체 생성 완료:', playerRef.current);
      } catch (error) {
        console.error('❌ 플레이어 생성 실패:', error);
      }
    } else {
      console.log('❌ 플레이어 생성 조건 미충족');
      if (!song) console.log('  - song이 없음');
      if (!youtubeReady) console.log('  - YouTube API가 아직 준비되지 않음');
      if (playerRef.current) console.log('  - 플레이어가 이미 존재함:', playerRef.current);
    }
  }, [song, youtubeReady]);

  const handlePlay = () => {
    console.log('재생 버튼 클릭');
    console.log('플레이어:', playerRef.current);
    if (playerRef.current && playerRef.current.playVideo) {
      console.log('✅ 재생 시작');
      playerRef.current.playVideo();
      setIsPlaying(true);
    } else {
      console.error('❌ 플레이어가 준비되지 않음');
    }
  };

  const handlePause = () => {
    console.log('멈춤 버튼 클릭');
    if (playerRef.current && playerRef.current.pauseVideo) {
      console.log('✅ 일시정지');
      playerRef.current.pauseVideo();
      setIsPlaying(false);
    } else {
      console.error('❌ 플레이어가 준비되지 않음');
    }
  };

  const handleParticipantClick = (participant: Participant) => {
    if (answered || !currentRound) return;

    // 즉시 팀 점수 업데이트 (새 객체 생성하여 리렌더링 보장)
    setTeamScores(prev => {
      const newScores = { ...prev };
      newScores[participant.teamId] = (newScores[participant.teamId] || 0) + 10;
      console.log('팀 점수 업데이트:', newScores);
      return newScores;
    });

    // 정답 상태 먼저 업데이트
    setAnswered(true);
    setWinner(participant);
    handlePause();

    // DB 업데이트는 비동기로
    scoreMutation.mutate({
      roundId: currentRound.id,
      teamId: participant.teamId,
      participantId: participant.id,
      score: 10,
    });
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

  // 디버깅 - 세션과 참가자 데이터 확인
  useEffect(() => {
    console.log('=== 세션 데이터 ===');
    console.log('Session:', session);
    console.log('Teams:', session?.teams);
    if (session?.teams) {
      session.teams.forEach((team, index) => {
        console.log(`Team ${index}:`, team);
        console.log(`  - teamName:`, team.teamName);
        console.log(`  - totalScore:`, team.totalScore);
        console.log(`  - participants:`, team.participants);
      });
    }
    console.log('All Participants:', allParticipants);
  }, [session, allParticipants]);

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
          {session?.teams?.map((team) => {
            const score = teamScores[team.id] || 0;
            console.log(`팀 ${team.teamName} 렌더링: ${score}점`);
            return (
              <div
                key={team.id}
                className={`p-6 rounded-lg ${
                  team.teamName === 'A팀' ? 'bg-blue-900' : 'bg-pink-900'
                }`}
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold">{team.teamName}</h3>
                  <div className="text-4xl font-bold">{score}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="max-w-5xl mx-auto">
        {/* YouTube 플레이어 (화면 밖 - 오디오만) */}
        <div className="fixed -left-[9999px] -top-[9999px]">
          <div id="youtube-player" style={{ width: '1px', height: '1px' }}></div>
        </div>

        {/* 오디오 표시 영역 */}
        <div className="bg-gradient-to-br from-purple-900 to-blue-900 rounded-lg p-12 mb-8 text-center">
          <div className="text-8xl mb-6">🎵</div>
          <p className="text-3xl font-bold mb-4">음악이 재생됩니다</p>
          {isPlaying ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-3 h-8 bg-green-400 animate-pulse rounded"></div>
              <div className="w-3 h-12 bg-green-400 animate-pulse rounded" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-3 h-10 bg-green-400 animate-pulse rounded" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-3 h-14 bg-green-400 animate-pulse rounded" style={{ animationDelay: '0.3s' }}></div>
              <div className="w-3 h-8 bg-green-400 animate-pulse rounded" style={{ animationDelay: '0.4s' }}></div>
            </div>
          ) : (
            <p className="text-gray-400">재생 버튼을 눌러 시작하세요</p>
          )}
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
          <div className="grid grid-cols-2 gap-4 mb-8">
            <button
              onClick={handlePlay}
              disabled={isPlaying}
              className="py-6 bg-green-600 hover:bg-green-700 rounded-lg font-bold text-2xl disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              ▶ 재생
            </button>
            <button
              onClick={handlePause}
              disabled={!isPlaying}
              className="py-6 bg-red-600 hover:bg-red-700 rounded-lg font-bold text-2xl disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              ⏸ 멈춤
            </button>
          </div>
        )}

        {/* 참가자 목록 */}
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
                    : 'bg-gradient-to-br from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg'
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

        {/* 다음 라운드 버튼 */}
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
