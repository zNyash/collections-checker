// import chalk from "chalk";
import { OsuPathFinder } from "./classes/OsuPathFinder";
import { OsuDatabaseParser } from "./classes/OsuDatabaseParser";
import chalk from "chalk";
import prompts from "prompts";
import { Config } from "./classes/Config";

class OsuApi {
    // TODO: Add osu! api
}

async function main() {
    // Find osu! installation path
    const osuPathFinder = new OsuPathFinder();
    const osuPath = await osuPathFinder.getOsuPath();

    // Parse osu! collection.db file
    const collectionParser = new OsuDatabaseParser(osuPath);
    const collectionData = await collectionParser.parseCollectionDb();

    const config = new Config().getConfig();
    // await Bun.write("collection-db.json", collectionData.toJson()); // Save collection data to a JSON file

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

    const response = await prompts({
        type: "text",
        name: "download",
        message: "Do you want to download all the beatmaps? (Y/n):",
        validate: (value) => {
            switch (value.toLowerCase().trim()) {
                case "":
                    return true;
                case "y":
                case "yes":
                    return true;
                case "n":
                case "no":
                    return true;
                default:
                    return "Invalid input";
            }
        },
    });
}

main();
