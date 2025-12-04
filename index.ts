// Classes
import { OsuPathFinder } from "./classes/OsuPathFinder";
import { OsuDatabaseParser } from "./classes/OsuDatabaseParser";
import { Config } from "./classes/Config";

// Utility functions
import { displayCollectionsInfo } from "./utils/displayCollectionsInfo";
import { shouldDownloadBeatmaps } from "./utils/shouldDownloadBeatmaps";
import { collectBeatmapIds } from "./utils/collectBeatmapIds";
import { downloadBeatmapSets } from "./utils/downloadBeatmapSets";
import { getMissingBeatmapSetIDs } from "./utils/getMissingBeatmapSetIds";

async function main() {
    const osuPath = await new OsuPathFinder().getOsuPath();

    const collections = await new OsuDatabaseParser(osuPath).parseCollectionDb();

    const config = await Config.getInstance().getConfig();
    // await Bun.write("collection-db.json", JSON.stringify(collections, null, 2)); // Save collection data to a JSON file

    displayCollectionsInfo(collections);
    if (!(await shouldDownloadBeatmaps())) return;

    const { beatmapIDs: allBeatmapSetIDs } = await collectBeatmapIds(collections, config);
    const beatmapIDs = await getMissingBeatmapSetIDs(allBeatmapSetIDs, osuPath);
    downloadBeatmapSets(beatmapIDs, config);
}

main();
