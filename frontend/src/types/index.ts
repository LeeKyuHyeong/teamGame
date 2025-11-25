import type { ReactNode } from "react";

export interface Session {
  id: number;
  sessionName: string;
  sessionDate: string;
  mcName: string;
  status: string;
  totalParticipants: number;
  createdAt: string;
  updatedAt: string;
  teams?: Team[];
  sessionGames?: SessionGame[];
}

export interface Team {
  id: number;
  sessionId: number;
  teamName: string;
  teamType: string;
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
  content?: Song | MediaContent | SpeedCategory;
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
  startTime: number;
  title: string;
  artist: string;
  createdAt: string;
}

export interface MediaContent {
  id: number;
  imageUrl: string;
  title: string;
  createdAt: string;
}

export interface SpeedCategory {
  id: number;
  categoryName: string;
  createdAt: string;
  items?: SpeedItem[];
}

export interface SpeedItem {
  [x: string]: ReactNode;
  id: number;
  categoryId: number;
  itemName: string;
  createdAt: string;
}

export interface ActionItem {
  id: number;
  actionName: string;
  createdAt: string;
}

export interface CreateSessionDto {
  sessionName: string;
  mcName: string;
  sessionDate?: string;
  totalParticipants?: number;
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
  teamType: string;
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

export interface TeamSpeedConfig {
  teamId: number;
  categoryId: number;
  roundCount: number;
}

export interface StartGameDto {
  contentIds?: number[];
  roundCount?: number;
  teamConfigs?: TeamSpeedConfig[];
}