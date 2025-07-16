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
    private API_URL = "https://osu.ppy.sh/api/v2/";

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
    ): Promise<BeatmapExtended> {
        await this.validateToken();

        console.log(chalk.grey(`Looking for beatmap with ${MODE}: ${parameter}`));
        const response = await fetch(`${this.API_URL}beatmaps/lookup?${MODE}=${parameter}`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${this.accessToken}`,
            },
        });

        if (!response.ok) {
            throw new Error(chalk.red(`Failed to get beatmap.`));
        }

        const data = (await response.json()) as BeatmapExtended;

        return data;
    }
}
