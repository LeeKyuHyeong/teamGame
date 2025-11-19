// Session Types
export enum SessionStatus {
  READY = '준비중',
  IN_PROGRESS = '진행중',
  COMPLETED = '완료',
}

export interface Session {
  id: number;
  sessionName: string;
  sessionDate: string;
  mcName: string;
  status: SessionStatus;
  totalParticipants: number;
  createdAt: string;
  updatedAt: string;
  teams?: Team[];
  sessionGames?: SessionGame[];
}

export interface CreateSessionDto {
  sessionName: string;
  sessionDate?: string;
  mcName?: string;
  totalParticipants?: number;
}

export interface UpdateSessionDto {
  sessionName?: string;
  sessionDate?: string;
  mcName?: string;
  status?: SessionStatus;
  totalParticipants?: number;
}

// Team Types
export enum TeamType {
  MALE = '남성',
  FEMALE = '여성',
}

export interface Team {
  id: number;
  sessionId: number;
  teamName: string;
  teamType: TeamType;
  totalScore: number;
  createdAt: string;
  participants?: Participant[];
}

export interface CreateTeamDto {
  sessionId: number;
  teamName: string;
  teamType: TeamType;
}

// Participant Types
export interface Participant {
  id: number;
  teamId: number;
  participantName: string;
  isMc: boolean;
  createdAt: string;
  team?: Team;
}

export interface CreateParticipantDto {
  teamId: number;
  participantName: string;
  isMc?: boolean;
}

// Game Types
export enum GameStatus {
  WAITING = '대기',
  IN_PROGRESS = '진행중',
  COMPLETED = '완료',
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
  status: GameStatus;
  createdAt: string;
  gameType?: GameType;
  gameRounds?: GameRound[];
}

export interface CreateSessionGameDto {
  sessionId: number;
  gameCode: string;
  gameOrder: number;
}

export interface StartGameDto {
  contentIds?: number[];
}

// Round Types
export interface GameRound {
  id: number;
  sessionGameId: number;
  roundNumber: number;
  contentId: number;
  contentType: string;
  isAnswerRevealed: boolean;
  createdAt: string;
  roundScores?: RoundScore[];
  content?: any;
}

export interface RoundScore {
  id: number;
  roundId: number;
  teamId: number;
  score: number;
  correctCount?: number;
  createdAt: string;
  team?: Team;
}

export interface AssignScoreDto {
  roundId: number;
  teamId: number;
  score: number;
  correctCount?: number;
}

// Content Types
export interface Song {
  id: number;
  youtubeUrl: string;
  title: string;
  artist: string;
  startTime?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSongDto {
  youtubeUrl: string;
  title: string;
  artist: string;
  startTime?: number;
}

export enum MediaType {
  DRAMA = '드라마',
  MOVIE = '영화',
}

export interface MediaContent {
  id: number;
  imagePath: string;
  title: string;
  mediaType: MediaType;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateMediaDto {
  imagePath: string;
  title: string;
  mediaType: MediaType;
  description?: string;
}

export interface SpeedCategory {
  id: number;
  categoryName: string;
  description?: string;
  items?: SpeedItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface SpeedItem {
  id: number;
  categoryId: number;
  itemName: string;
  displayOrder?: number;
  createdAt?: string;
}

export interface CreateSpeedCategoryDto {
  categoryName: string;
  description?: string;
}

export interface CreateSpeedItemDto {
  categoryId: number;
  itemName: string;
}

export interface ActionItem {
  id: number;
  actionName: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateActionDto {
  actionName: string;
  description?: string;
}
