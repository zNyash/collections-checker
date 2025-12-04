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
    const api = new OsuApi(config);

    const uniqueHashes = extractUniqueHashes(collections);

    const beatmapIDs = new Set<number>();
    let requests = 0;

    for (const hash of uniqueHashes) {
        await Bun.sleep(60);

        const beatmap = await api.lookupBeatmap(hash, "checksum");
        if (!beatmap) continue;

        beatmapIDs.add(beatmap.beatmapset_id);
        requests++;
    }

    return {
        beatmapIDs: Array.from(beatmapIDs),
        requests,
    };
}

/* ---------------- */
/* Helper Functions */
/* ---------------- */
function extractUniqueHashes(collections: Collections): Set<string> {
    const hashes = new Set<string>();

    for (const col of collections.collection) {
        for (const hash of col.beatmapsMd5) {
            hashes.add(hash);
        }
    }

    return hashes;
}
