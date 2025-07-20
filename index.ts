import { existsSync, mkdirSync } from "fs";

// Classes
import { OsuPathFinder } from "./classes/OsuPathFinder";
import { OsuDatabaseParser } from "./classes/OsuDatabaseParser";
import { Config } from "./classes/Config";
import { OsuApi } from "./classes/OsuApi";

// Utility functions
import { displayCollectionsInfo } from "./utils/displayCollectionsInfo";
import { shouldDownloadBeatmaps } from "./utils/shouldDownloadBeatmaps";
import { collectBeatmapIds } from "./utils/collectBeatmapIds";
import { downloadBeatmapSets } from "./utils/downloadBeatmapSets";

async function main() {
    const osuPath = await new OsuPathFinder().getOsuPath();

    const collections = await new OsuDatabaseParser(osuPath).parseCollectionDb();

    const config = await Config.getInstance().getConfig();
    // await Bun.write("collection-db.json", JSON.stringify(collections, null, 2)); // Save collection data to a JSON file

    displayCollectionsInfo(collections);
    if (!(await shouldDownloadBeatmaps())) return;

    // const { beatmapIDs } = await collectBeatmapIds(collections, config);
    downloadBeatmapSets([2071283], config);
}

main();

