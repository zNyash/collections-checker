import chalk from "chalk";
import type { IConfigData } from "../classes/Config";
import { OsuApi } from "../classes/OsuApi";
import { existsSync, mkdirSync } from "fs";

export async function downloadBeatmapSets(beatmapIDs: number[], config: IConfigData) {
    const osuApi = new OsuApi(config);
    const downloadDir = "./beatmaps";

    console.log(chalk.grey("Downloading beatmapsets..."));
    for (const id of beatmapIDs) {
        const beatmapBlob = await osuApi.downloadBeatmapSet(id);
        if (!existsSync(downloadDir)) mkdirSync(downloadDir);
        Bun.write(`${downloadDir}/beatmapset.zip`, beatmapBlob!);
        Bun.sleep(60);
    }
    console.log(chalk.green("All beatmap sets downloaded."));
}
