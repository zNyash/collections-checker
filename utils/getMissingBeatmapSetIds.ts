import { readdirSync } from "fs";
import { Logger } from "../classes/Logger";
import { join } from "path";

const logger = Logger.getInstance();

export async function getMissingBeatmapSetIDs(beatmapSetIDs: number[], osuPath: string) {
    const idsFromSongsFolder = new Set(filterFolderNamesToIDs(osuPath));
    logger.success(`Found ${idsFromSongsFolder.size} beatmap set IDs in Songs folder.`);

    const filteredBeatmapSetIDs = beatmapSetIDs.filter((id) => !idsFromSongsFolder.has(id));
    logger.info(`Missing beatmap set IDs to download: ${filteredBeatmapSetIDs.length}`);

    return filteredBeatmapSetIDs;
}

function filterFolderNamesToIDs(osuPath: string) {
    logger.info("Reading beatmap set IDs from Songs folder...");
    return readdirSync(join(osuPath, "Songs"), { withFileTypes: true })
        .filter((dir) => dir.isDirectory())
        .map((dir) => Number(dir.name))
        .filter((id) => !Number.isNaN(id));
}
