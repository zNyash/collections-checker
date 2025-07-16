import chalk from "chalk";
import type { Collections } from "../types/Collections";

export function displayCollectionsInfo(collections: Collections) {
    let totalBeatmaps: number = 0;
    let MD5Hashes: string[] = [];

    console.log(chalk.grey("=".repeat(50)));
    console.log("");
    collections.collection.forEach((collection) => {
        console.log(chalk.yellow(`Collection: ${collection.name}`));
        console.log(chalk.yellow(`Beatmaps: ${collection.beatmapsCount}`));
        console.log("");
        totalBeatmaps += collection.beatmapsCount;
        MD5Hashes.push(...collection.beatmapsMd5);
    });
    console.log(chalk.grey("=".repeat(50)));
    console.log(chalk.green(`Total Beatmaps: ${totalBeatmaps}`));
}
