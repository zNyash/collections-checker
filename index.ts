// import chalk from "chalk";
import { OsuPathFinder } from "./classes/OsuPathFinder";
import { OsuDatabaseParser } from "./classes/OsuDatabaseParser";




async function main() {
    const osuPathFinder = new OsuPathFinder();
    const osuPath = await osuPathFinder.getOsuPath();

    const collectionParser = new OsuDatabaseParser(osuPath);
    const collectionData = await collectionParser.parseCollectionDb();

    await Bun.write("collection-db.json", collectionData.toJson());
}

main();
