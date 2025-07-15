export interface CollectionItem {
    name: string;
    beatmapsCount: number;
    beatmapsMd5: string[];
}

export interface Collections {
    osuver: number;
    collectionscount: number;
    collection: CollectionItem[];
}