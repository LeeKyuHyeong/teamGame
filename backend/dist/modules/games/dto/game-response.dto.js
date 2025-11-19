"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoundSummaryDto = exports.GameResponseDto = void 0;
class GameResponseDto {
    id;
    sessionId;
    gameTypeId;
    gameOrder;
    status;
    gameType;
    rounds;
}
exports.GameResponseDto = GameResponseDto;
class RoundSummaryDto {
    id;
    roundNumber;
    isAnswerRevealed;
    scores;
}
exports.RoundSummaryDto = RoundSummaryDto;
//# sourceMappingURL=game-response.dto.js.map