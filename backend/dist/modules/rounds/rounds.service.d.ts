import { Repository } from 'typeorm';
import { GameRound } from '../../database/entities/game-round.entity';
import { Song } from '../../database/entities/song.entity';
import { MediaContent } from '../../database/entities/media-content.entity';
import { SpeedCategory } from '../../database/entities/speed-category.entity';
import { ActionItem } from '../../database/entities/action-item.entity';
import { CreateRoundDto } from './dto/create-round.dto';
import { RoundWithContentDto } from './dto/round-with-content.dto';
export declare class RoundsService {
    private readonly roundRepository;
    private readonly songRepository;
    private readonly mediaRepository;
    private readonly speedCategoryRepository;
    private readonly actionRepository;
    constructor(roundRepository: Repository<GameRound>, songRepository: Repository<Song>, mediaRepository: Repository<MediaContent>, speedCategoryRepository: Repository<SpeedCategory>, actionRepository: Repository<ActionItem>);
    create(createRoundDto: CreateRoundDto): Promise<GameRound>;
    findByGame(sessionGameId: number): Promise<any[]>;
    findOneWithContent(id: number): Promise<RoundWithContentDto>;
    revealAnswer(id: number, reveal: boolean): Promise<GameRound>;
    remove(id: number): Promise<void>;
    getNextRound(sessionGameId: number): Promise<GameRound | null>;
}
