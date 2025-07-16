// Classes
import { OsuPathFinder } from "./classes/OsuPathFinder";
import { OsuDatabaseParser } from "./classes/OsuDatabaseParser";
import { Config } from "./classes/Config";
import { OsuApi } from "./classes/OsuApi";

// Utility functions
import { displayCollectionsInfo } from "./utils/displayCollectionsInfo";
import { shouldDownloadBeatmaps } from "./utils/shouldDownloadBeatmaps";
import { collectBeatmapIds } from "./utils/collectBeatmapIds";

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

    const beatmapIDs = await collectBeatmapIds(collections, config);
}

main();
