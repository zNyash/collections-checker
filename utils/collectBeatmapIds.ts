import chalk from "chalk";
import type { IConfigData } from "../classes/Config";
import type { Collections } from "../types/Collections";
import { OsuApi } from "../classes/OsuApi";

/**
 * Collect all beatmap IDs from a given collection
 * @param collections The collection to be processed
 * @param config The config object containing the osu! API token
 * @returns An array of beatmap IDs
 */
export async function collectBeatmapIds(collections: Collections, config: IConfigData) {
    const uniqueHashes = new Set<string>();
    for (const col of collections.collection) {
        for (const hash of col.beatmapsMd5) {
            uniqueHashes.add(hash);
        }
    }

    const beatmapIDs = new Set<number>();
    const RATE_LIMIT = 1150;
    let requests = 0;

    for (const hash of uniqueHashes) {
        if (requests >= RATE_LIMIT) {
            console.log(chalk.yellow("Rate limit reached. Waiting 60 seconds..."));
            await Bun.sleep(60000);
            requests = 0;
        }

        const beatmap = await new OsuApi(config).lookupBeatmap(hash, "checksum");
        if (!beatmap) continue;
        requests++;

        beatmapIDs.add(beatmap.beatmapset_id);
    }

    return Array.from(beatmapIDs);
}
