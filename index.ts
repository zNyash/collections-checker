import chalk from "chalk";
import { OsuPathFinder } from "./classes/OsuPathFinder";



async function main() {
  const osuPath = new OsuPathFinder().getOsuPath();
}

main();
