import chalk from "chalk";
import type { IConfigData } from "../classes/Config";
import { OsuApi } from "../classes/OsuApi";
import { existsSync, mkdirSync } from "fs";
import { Constant } from "./Constants";
import { Logger } from "../classes/Logger";

const logger = Logger.getInstance();

/**
 * Downloads the beatmap sets given a list of beatmap IDs
 * @param beatmapIDs - List of beatmapset IDs to download
 * @param config - Config object containing the osu! API token
 */
export async function downloadBeatmapSets(beatmapIDs: number[], config: IConfigData) {
    const downloadDir = "./beatmaps";

    if (!existsSync(downloadDir)) {
        mkdirSync(downloadDir);
        logger.success(`Directory created at ${downloadDir}`);
    }

    logger.info(`Initiating donwload of ${beatmapIDs.length} beatmap sets.`);
    let mapsRemaining = beatmapIDs.length;
    let mapsFailed = 0;
    for (const id of beatmapIDs) {
        const start = Date.now();

        const response = await fetch(`${Constant.OsuMirrorApiUrl}${id}`);
        if (!response.ok) {
            logger.error(`Failed to download beatmapset ID: ${id}. Status: ${response.status}`);
            mapsFailed++;
            mapsRemaining--;
            continue;
        }

        const beatmapBlob = await response.arrayBuffer();
        Bun.write(`${downloadDir}/${id}.osz`, beatmapBlob!);
        mapsRemaining--;

        const end = Date.now();
        const timeTaken = ((end - start) / 1000).toFixed(2);
        logger.success(`Downloaded beatmapset ID: ${id} - ${timeTaken}s.`);
        logger.info(`${mapsRemaining} beatmap sets remaining. ${mapsFailed} failed.`);

        Bun.sleep(60);
    }
    logger.success("All beatmap sets downloaded.");
}
