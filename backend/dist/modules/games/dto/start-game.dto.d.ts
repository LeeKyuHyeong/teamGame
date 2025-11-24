export declare class TeamSpeedConfig {
    teamId: number;
    categoryId: number;
    roundCount: number;
}
export declare class StartGameDto {
    contentIds?: number[];
    roundCount?: number;
    teamConfigs?: TeamSpeedConfig[];
}
