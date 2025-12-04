import chalk from "chalk";
import type { IConfigData } from "../classes/Config";
import { OsuApi } from "../classes/OsuApi";
import { existsSync, mkdirSync } from "fs";
import { Logger } from "../classes/Logger";
import type { RateLimitResponse } from "../types/RateLimit";
import { Constant } from "./Constants";

const logger = Logger.getInstance();

/* ------------ */
/* Inside Types */
/* ------------ */
interface IStats {
    downloaded: number;
    failed: number;
    remaining: number;
    RATELIMIT: number;
}

/* ------------- */
/* Main Function */
/* ------------- */
/**
 * Downloads the beatmap sets given a list of beatmap IDs
 * @param beatmapIDs - List of beatmapset IDs to download
 * @param config - Config object containing the osu! API token
 */
export async function downloadBeatmapSets(beatmapIDs: number[], config: IConfigData) {
    prepareDownloadDirectory();

    logger.info(`Initiating donwload of ${beatmapIDs.length} beatmap sets.`);

    const stats: IStats = {
        downloaded: 0,
        failed: 0,
        remaining: beatmapIDs.length,
        RATELIMIT: await getRateLimitRemaining(),
    };

    for (const id of beatmapIDs) {
        ensureRateLimit(stats);
        downloadSingleBeatmapSet(id, stats);
    }

    logger.success("All beatmap sets downloaded.");
}

/* ---------------- */
/* Helper Functions */
/* ---------------- */

function prepareDownloadDirectory() {
    if (!existsSync(Constant.DownloadDir)) {
        mkdirSync(Constant.DownloadDir);
        logger.success(`Directory created at ${Constant.DownloadDir}`);
    }
}

async function downloadSingleBeatmapSet(beatmapSetID: number, stats: IStats) {
    const downloadStartTime = Date.now();

    const response = await fetch(`${Constant.OsuMirrorApiUrl}${beatmapSetID}`);
    if (!response.ok) {
        logger.error(
            `Failed to download beatmapset ID: ${beatmapSetID}. Status: ${response.status}`,
        );
        stats.failed++;
        stats.remaining--;
        return false;
    }

    const beatmapBlob = await response.arrayBuffer();
    Bun.write(`${Constant.DownloadDir}/${beatmapSetID}.osz`, beatmapBlob);

    const downloadTimeTaken = ((Date.now() - downloadStartTime) / 1000).toFixed(2);
    logger.success(`Downloaded beatmapset ID: ${beatmapSetID} - ${downloadTimeTaken}s.`);

    stats.downloaded++;
    stats.remaining--;
    stats.RATELIMIT--;

    return true;
}

async function getRateLimitRemaining() {
    const response = await fetch(Constant.OsuMirrorRateLimitUrl);
    const data = (await response.json()) as RateLimitResponse;

    return data.daily.remaining.downloads;
}

function ensureRateLimit(stats: IStats) {
    if (stats.remaining <= 10) {
        logger.warn(`Only ${stats.remaining} downloads remaining. Try again later.`);
        logger.info(`You may close the application now.`);
        Bun.sleep(60 * 60 * 24 * 1000); // Sleep for 24 hours
    }
}
