import chalk from "chalk";
import { type IConfigData } from "./Config";

export class OsuApi {
    private clientID: string = "";
    private clientSecret: string = "";

    constructor(config: IConfigData) {
        this.clientID = config.clientID;
        this.clientSecret = config.clientSecret;
    }

    // validate expiration time
    // get access token
    private async getAccessToken() {
        const response = await fetch("https://osu.ppy.sh/oauth/token", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/x-www-form-urlencoded",
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

        return response;
    }
    // lookup beatmap
}
