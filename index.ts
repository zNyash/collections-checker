// Classes
import { OsuPathFinder } from "./classes/OsuPathFinder";
import { OsuDatabaseParser } from "./classes/OsuDatabaseParser";
import { Config } from "./classes/Config";

// Utility functions
import { displayCollectionsInfo } from "./utils/displayCollectionsInfo";
import { shouldDownloadBeatmaps } from "./utils/shouldDownloadBeatmaps";

async function main() {
    // Find osu! installation path
    const osuPathFinder = new OsuPathFinder();
    const osuPath = await osuPathFinder.getOsuPath();

    // Parse osu! collection.db file
    const collectionParser = new OsuDatabaseParser(osuPath);
    const collectionData = await collectionParser.parseCollectionDb();

    const config = await Config.getInstance().getConfig();
    // await Bun.write("collection-db.json", collectionData.toJson()); // Save collection data to a JSON file

    displayCollectionsInfo(collectionData);
    const downloadEverything = await shouldDownloadBeatmaps();
    if (!downloadEverything) return;
}

main();
