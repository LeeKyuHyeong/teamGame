import { Repository } from 'typeorm';
import { GameRound } from '../../database/entities/game-round.entity';
import { Song } from '../../database/entities/song.entity';
import { MediaContent } from '../../database/entities/media-content.entity';
import { CreateRoundDto } from './dto/create-round.dto';
import { RoundWithContentDto } from './dto/round-with-content.dto';
export declare class RoundsService {
    private readonly roundRepository;
    private readonly songRepository;
    private readonly mediaRepository;
    constructor(roundRepository: Repository<GameRound>, songRepository: Repository<Song>, mediaRepository: Repository<MediaContent>);
    create(createRoundDto: CreateRoundDto): Promise<GameRound>;
    findByGame(sessionGameId: number): Promise<any[]>;
    findOneWithContent(id: number): Promise<RoundWithContentDto>;
    revealAnswer(id: number, reveal: boolean): Promise<GameRound>;
    remove(id: number): Promise<void>;
    getNextRound(sessionGameId: number): Promise<GameRound | null>;
}
