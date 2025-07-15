import prompts from "prompts";
import chalk from "chalk";
import { join } from "path";
import { homedir } from "os";

export class OsuPathFinder {
  private readonly defaultPaths = [
    join(process.env.LOCALAPPDATA || "", "osu!"),
    join(process.env.USERPROFILE || "", "AppData", "Local", "osu!"),
    join(homedir(), "AppData", "Local", "osu!"),
  ];

  /**
   * Checks if a directory is a valid osu! installation
   * @param path Directory path to check
   * @returns `True` if the directory is a valid osu! installation, false otherwise
   */
  private async isValidPath(path: string): Promise<boolean> {
    const pathCollectionDb = join(path, "collection.db");

    const collectionDbExists = await Bun.file(pathCollectionDb).exists();

    if (!collectionDbExists) return false;
    return collectionDbExists;
  }

  /**
   * Searches for the osu! installation in the default paths
   * @returns the path to the osu! installation if found, empty string otherwise
   */
  private async findOsuPath(): Promise<string> {
    for (const path of this.defaultPaths) {
      console.log(chalk.gray(`Checking: "${path}"`));

      if (await this.isValidPath(path)) {
        console.log(chalk.green(`osu! installation was found.`));
        return path;
      }
    }

    console.log(chalk.red("osu! installation not found in default paths."));
    console.log(chalk.yellow("Please enter the path to the osu! installation manually."));
    return "";
  }

  /**
   * Asks the user to enter the path to the osu! installation
   * @returns the path to the osu! installation if valid, empty string otherwise
   */
  private async askForCustomPath(): Promise<string> {
    const response = await prompts({
      type: "text",
      name: "path",
      message: "Enter osu! installation path:",
      validate: async (value: string) => {
        if (!value.trim()) {
          return "Path cannot be empty";
        }
        if (!(await this.isValidPath(value.trim()))) {
          return "Invalid osu! installation path";
        }

        return true;
      },
    });

    return response.path;
  }

  /**
   * Tries to find the osu! installation path automatically, and if that fails,
   * asks the user to enter the path manually.
   * @returns the path to the osu! installation if it could be found, empty string otherwise
   */
  public async getOsuPath() {
    console.log(chalk.blue("Attempting to find osu! installation..."));

    let osuPath = await this.findOsuPath();

    if (!osuPath) {
      osuPath = await this.askForCustomPath();
    }

    console.log(chalk.blue(`osu! installation path: "${osuPath}"`));
    return osuPath;
  }
}
