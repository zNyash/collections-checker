// import chalk from "chalk";
import { OsuPathFinder } from "./classes/OsuPathFinder";
import { OsuDatabaseParser } from "./classes/OsuDatabaseParser";
import chalk from "chalk";
import prompts from "prompts";
import { Config } from "./classes/Config";
import { displayCollectionsInfo } from "./utils/displayCollectionsInfo";

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

    const config = await new Config().getConfig();
    // await Bun.write("collection-db.json", collectionData.toJson()); // Save collection data to a JSON file

    displayCollectionsInfo(collectionData);

    let downloadEverything = false;
    const response = await prompts({
        type: "text",
        name: "download",
        message: "Do you want to download all the beatmaps? (Y/n):",
        validate: (value) => {
            switch (value.toLowerCase().trim()) {
                case "":
                    downloadEverything = true;
                    return true;
                case "y":
                case "yes":
                    downloadEverything = true;
                    return true;
                case "n":
                case "no":
                    return true;
                default:
                    return "Invalid input";
            }
        },
    });

    if (!downloadEverything) return;
}

main();
