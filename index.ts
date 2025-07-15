// import chalk from "chalk";
import { OsuPathFinder } from "./classes/OsuPathFinder";
import { OsuDatabaseParser } from "./classes/OsuDatabaseParser";
import chalk from "chalk";

async function main() {
    // Find osu! installation path
    const osuPathFinder = new OsuPathFinder();
    const osuPath = await osuPathFinder.getOsuPath();

    // Parse osu! collection.db file
    const collectionParser = new OsuDatabaseParser(osuPath);
    const collectionData = await collectionParser.parseCollectionDb();

    await Bun.write("collection-db.json", collectionData.toJson()); // Save collection data to a JSON file

    let totalBeatmaps: number = 0;
    let MD5Hashes: string[] = [];

    console.log(chalk.grey("=".repeat(50)));
    console.log("");
    collectionData.data.collection.forEach((collection) => {
        console.log(chalk.yellow(`Collection: ${collection.name}`));
        console.log(chalk.yellow(`Beatmaps: ${collection.beatmapsCount}`));
        console.log("");
        totalBeatmaps += collection.beatmapsCount;
        MD5Hashes.push(...collection.beatmapsMd5);
    });
    console.log(chalk.grey("=".repeat(50)));
    console.log(chalk.green(`Total Beatmaps: ${totalBeatmaps}`));
}

main();
