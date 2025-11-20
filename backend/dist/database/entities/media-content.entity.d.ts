export declare enum MediaType {
    DRAMA = "\uB4DC\uB77C\uB9C8",
    MOVIE = "\uC601\uD654"
}
export declare class MediaContent {
    id: number;
    imageUrl: string;
    title: string;
    mediaType: MediaType;
    description: string;
    createdAt: Date;
    updatedAt: Date;
}
