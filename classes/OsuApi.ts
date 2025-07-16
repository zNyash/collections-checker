import chalk from "chalk";
import { Config, type IConfigData } from "./Config";
import type { BeatmapExtended } from "../types/BeatmapExtended";

interface ITokenResponse {
    access_token: string;
    expires_in: number;
    token_type: string;
}
export class OsuApi {
    private clientID: string = "";
    private clientSecret: string = "";
    private accessToken: string = "";
    private API_URL = "https://osu.ppy.sh/api/v2";

    constructor(config: IConfigData) {
        this.clientID = config.clientID;
        this.clientSecret = config.clientSecret;
        this.accessToken = config.token;
    }

    private async getAccessToken() {
        console.log(chalk.grey("Getting new token..."));
        const response = await fetch("https://osu.ppy.sh/oauth/token", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                client_id: this.clientID,
                client_secret: this.clientSecret,
                grant_type: "client_credentials",
                scope: "public",
            }),
        });

        if (!response.ok) {
            throw new Error(chalk.red("Failed to get access token. Check your config file."));
        }

        console.log(chalk.green("Token obtained."));
        const data = (await response.json()) as ITokenResponse;

        await Config.getInstance().updateToken(data.access_token, data.expires_in);
        this.accessToken = data.access_token;

        return data;
    }

    private async validateToken() {
        const config = await Config.getInstance().getConfig();

        if (config.tokenExpiration < Date.now()) {
            console.log(chalk.red("Token expired."));
            await this.getAccessToken();
            return;
        }

        return;
    }

    public async lookupBeatmap(
        parameter: string,
        MODE: "checksum" | "filename" | "id" = "checksum",
    ): Promise<BeatmapExtended | null> {
        await this.validateToken();

        console.log(chalk.grey(`Looking for beatmap with ${MODE}: ${parameter}`));
        try {
            const url = `${this.API_URL}/beatmaps/lookup?${MODE}=${parameter}`;
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${this.accessToken}`,
                },
            });

            const data = (await response.json()) as BeatmapExtended;

            return data;
        } catch {
            console.log(chalk.red(`Failed to get beatmap with ${MODE}: ${parameter}.`));
            return null;
        }
    }

    public async downloadBeatmapSet(beatmapID: number): Promise<Buffer | null> {
        await this.validateToken();

        console.log(chalk.grey(`Downloading beatmap with ID: ${beatmapID}`));
        try {
            const url = `https://osu.ppy.sh/beatmapsets/${beatmapID}/download?noVideo=1`;
            const response = await fetch(url, { redirect: "follow" });

            const buffer = Buffer.from(await response.arrayBuffer());
            return buffer;
        } catch (error) {
            console.log(chalk.red(`Failed to download beatmapset with ID: ${beatmapID}: ${error}`));
            return null;
        }
    }
}
