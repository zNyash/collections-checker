/** Represents an item in the `collection.db` file */
export interface CollectionItem {
    /** Name of the collection */
    name: string;

    /** Number of beatmaps in the collection */
    beatmapsCount: number;

    /** MD5 hashes of the beatmaps in the collection */
    beatmapsMd5: string[];
}

/** Represents the parsed structure of the `collection.db` file */
export interface Collections {
    /** don't know what this means yet. */
    osuver: number;

    /** Amout of total collections */
    collectionscount: number;

    /** Collection items */
    collection: CollectionItem[];
}
