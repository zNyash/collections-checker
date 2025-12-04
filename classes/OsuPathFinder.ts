import prompts from "prompts";
import { join } from "path";
import { homedir } from "os";
import { Logger } from "./Logger";
import { Config } from "./Config";

const logger = Logger.getInstance();
const config = Config.getInstance();

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
        const cfg = await config.getConfig();

        // First Checking - Saved Path from Config
        if (cfg.osuPath) {
            logger.info(`Checking osu! path from config: ${cfg.osuPath}`);
            if (await this.isValidPath(cfg.osuPath)) {
                logger.success(`Found osu! installation at: ${cfg.osuPath}`);
                return cfg.osuPath;
            }
        }

        // Second Checking - Default Paths
        for (const path of this.defaultPaths) {
            logger.info(`Checking default path: ${path}`);

            if (await this.isValidPath(path)) {
                logger.success(`Found osu! installation at: ${path}`);
                return path;
            }
        }

        logger.info("osu! installation not found in default paths.");
        logger.warn("Please enter the path to the osu! installation manually.");
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
        logger.info("Attempting to find osu! installation...");

        let osuPath = await this.findOsuPath();

        if (!osuPath) {
            osuPath = await this.askForCustomPath();
            await config.updateOsuPath(osuPath);
            logger.success(`osu! installation path set to: ${osuPath}`);
        }

        return osuPath;
    }
}
