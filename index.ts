// Classes
import { OsuPathFinder } from "./classes/OsuPathFinder";
import { OsuDatabaseParser } from "./classes/OsuDatabaseParser";
import { Config } from "./classes/Config";

// Utility functions
import { displayCollectionsInfo } from "./utils/displayCollectionsInfo";
import { shouldDownloadBeatmaps } from "./utils/shouldDownloadBeatmaps";
import { OsuApi } from "./classes/OsuApi";

async function main() {
    // Find osu! installation path
    const osuPathFinder = new OsuPathFinder();
    const osuPath = await osuPathFinder.getOsuPath();

    // Parse osu! collection.db file
    const collectionParser = new OsuDatabaseParser(osuPath);
    const collections = await collectionParser.parseCollectionDb();

    const config = await Config.getInstance().getConfig();
    // await Bun.write("collection-db.json", JSON.stringify(collections, null, 2)); // Save collection data to a JSON file

    displayCollectionsInfo(collections);
    const downloadEverything = await shouldDownloadBeatmaps();
    if (!downloadEverything) return;

    let beatmapsIds = [];
    // for (const collection of collections.collection) {
    //     for (const hash of collection.beatmapsMd5) {
    //         const beatmap = await new OsuApi(config).lookupBeatmap(hash, "checksum");
    //         beatmap.beatmapset_id
    //     }
    // }
    const response = await new OsuApi(config).lookupBeatmap(
        "fbd1aa9f5cf579c82a9ee7150f5868da",
        "checksum",
    );
    await Bun.write("beatmap.json", JSON.stringify(response, null, 2));
}

main();
