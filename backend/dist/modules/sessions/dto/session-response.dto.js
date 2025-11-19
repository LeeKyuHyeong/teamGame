"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamSummaryDto = exports.SessionResponseDto = void 0;
class SessionResponseDto {
    id;
    sessionName;
    sessionDate;
    mcName;
    status;
    totalParticipants;
    createdAt;
    updatedAt;
    teams;
}
exports.SessionResponseDto = SessionResponseDto;
class TeamSummaryDto {
    id;
    teamName;
    teamType;
    totalScore;
    participantCount;
}
exports.TeamSummaryDto = TeamSummaryDto;
//# sourceMappingURL=session-response.dto.js.map