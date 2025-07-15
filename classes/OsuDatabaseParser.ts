import { OsuDBParser } from "osu-db-parser";
import { join } from "path";
import { type IParsedCollections, ParsedCollections } from "./ParsedCollections";

export class OsuDatabaseParser {
    private osuPath: string;

    constructor(osuPath: string) {
        this.osuPath = osuPath;
    }

    /**
     * Parses the `collection.db` file and returns its contents as a stringified JSON object.
     * @returns a stringified JSON object representing the collection.db file
     */
    public async parseCollectionDb(): Promise<IParsedCollections> {
        const collectionPath = join(this.osuPath, "collection.db");

        const collectionsBuffer = Buffer.from(await Bun.file(collectionPath).arrayBuffer());
        const collectionData = new OsuDBParser(null, collectionsBuffer).getCollectionData();

        return new ParsedCollections(collectionData)
    }

    /**
     * Parses the `osu!.db` file and returns its contents as a stringified JSON object.
     * @returns a stringified JSON object representing the osu!.db file
     */
    public async parseOsuDb() {
        const osuDbPath = join(this.osuPath, "osu!.db");

        const osuDbBuffer = await Bun.file(osuDbPath).arrayBuffer();
        const osuDb = new OsuDBParser(Buffer.from(osuDbBuffer));

        const osuDbData = await osuDb.getOsuDBData();

        const replacer = (key: string, value: any) => {
            return typeof value === "bigint" ? value.toString() : value;
        };

        return JSON.stringify(osuDbData, replacer, 2);
    }
}
