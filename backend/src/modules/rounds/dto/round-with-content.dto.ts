export class RoundWithContentDto {
  id: number;
  sessionGameId: number;
  roundNumber: number;
  contentId: number;
  contentType: string;
  isAnswerRevealed: boolean;
  content?: any; // Song | MediaContent | SpeedCategory | ActionItem
  scores?: {
    teamId: number;
    teamName: string;
    score: number;
    correctCount?: number;
  }[];
}
