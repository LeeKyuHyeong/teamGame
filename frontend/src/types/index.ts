export interface Session {
  id: number;
  sessionName: string;
  sessionDate: string;
  mcName: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  teams?: Team[];
  sessionGames?: SessionGame[];
}

export interface Team {
  id: number;
  sessionId: number;
  teamName: string;
  totalScore: number;
  createdAt: string;
  participants?: Participant[];
}

export interface Participant {
  id: number;
  teamId: number;
  participantName: string;
  isMc: boolean;
  totalScore: number;
  createdAt: string;
}

export interface GameType {
  id: number;
  gameCode: string;
  gameName: string;
  description: string;
}

export interface SessionGame {
  id: number;
  sessionId: number;
  gameTypeId: number;
  gameOrder: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  gameType?: GameType;
  gameRounds?: GameRound[];
}

export interface GameRound {
  id: number;
  sessionGameId: number;
  roundNumber: number;
  contentId: number;
  contentType: string;
  teamId?: number;
  isAnswerRevealed: boolean;
  createdAt: string;
  content?: Song | MediaContent;
  roundScores?: RoundScore[];
}

export interface RoundScore {
  id: number;
  roundId: number;
  teamId: number;
  participantId?: number;
  score: number;
  correctCount?: number;
  createdAt: string;
  team?: Team;
  participant?: Participant;
}

export interface Song {
  id: number;
  youtubeUrl: string;
  title: string;
  artist: string;
  releaseYear?: number;
  createdAt: string;
}

export interface CreateSongDto {
  youtubeUrl: string;
  title: string;
  artist: string;
  releaseYear?: number;
}

export interface MediaContent {
  id: number;
  imageUrl: string;
  title: string;
  createdAt: string;
}

export interface CreateMediaContentDto {
  imageUrl: string;
  title: string;
}

export interface CreateSessionDto {
  sessionName: string;
  mcName: string;
  sessionDate?: string;
  teamAName?: string;
  teamBName?: string;
}

export interface UpdateSessionDto {
  sessionName?: string;
  mcName?: string;
  status?: string;
}

export interface CreateTeamDto {
  sessionId: number;
  teamName: string;
}

export interface CreateParticipantDto {
  teamId: number;
  participantName: string;
  isMc?: boolean;
}

export interface CreateSessionGameDto {
  sessionId: number;
  gameCode: string;
  gameOrder: number;
}

export interface StartGameDto {
  contentIds?: number[];
  roundCount?: number;
  decade?: string; // '1990s' | '2000s' | '2010s' | '2020s'
}

export interface DecadeOption {
  decade: string;
  label: string;
  count: number;
}

// 타입 가드 헬퍼 함수
export function isSong(content: Song | MediaContent): content is Song {
  return 'youtubeUrl' in content;
}

export function isMediaContent(content: Song | MediaContent): content is MediaContent {
  return 'imageUrl' in content;
}

export interface AssignScoreDto {
  roundId: number;
  teamId: number;
  participantId?: number;
  score: number;
  correctCount?: number;
}