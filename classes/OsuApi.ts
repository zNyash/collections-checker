import chalk from "chalk";
import { Config, type IConfigData } from "./Config";
import type { BeatmapExtended } from "../types/BeatmapExtended";
import { Logger } from "./Logger";

interface ITokenResponse {
    access_token: string;
    expires_in: number;
    token_type: string;
}

const config = await Config.getInstance().getConfig();

const logger = Logger.getInstance();
export class OsuApi {
    private clientID: string = "";
    private clientSecret: string = "";
    private accessToken: string = "";
    private API_URL = "https://osu.ppy.sh/api/v2";
    private expiresIn: number = 0;

    constructor(config: IConfigData) {
        this.clientID = config.clientID;
        this.clientSecret = config.clientSecret;
        this.accessToken = config.token;
        this.expiresIn = config.tokenExpiration;
    }

    private async getAccessToken() {
        logger.info("Getting new token");
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

        logger.success("Token obtained.");
        const data = (await response.json()) as ITokenResponse;

        this.expiresIn = await Config.getInstance().updateToken(data.access_token, data.expires_in);
        this.accessToken = data.access_token;

        return data;
    }

    private async validateToken() {
        if (this.expiresIn < Date.now()) {
            logger.warn("Token expired");
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

        logger.info(`Looking for beatmap with ${MODE}: ${parameter}`);
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
            logger.error(`Failed to get beatmap with ${MODE}: ${parameter}.`);
            return null;
        }
    }

    public async downloadBeatmapSet(beatmapID: number): Promise<Buffer | null> {
        await this.validateToken();

        logger.info(`Downloading beatmapset with ID: ${beatmapID}`);
        try {
            const url = `${this.API_URL}/beatmapsets/${beatmapID}/download`;

            const response = await fetch(url, {
                redirect: "follow",
                headers: {
                    Authorization: `Bearer ${this.accessToken}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            });

            const buffer = Buffer.from(await response.arrayBuffer());
            return buffer;
        } catch (error) {
            logger.warn(`Failed to download beatmapset with ID: ${beatmapID}. Error: ${error}`);
            return null;
        }
    }

    public async login() {
        const res = fetch("https://osu.ppy.sh/session", {
            headers: {
                accept: "*/*;q=0.5, text/javascript, application/javascript, application/ecmascript, application/x-ecmascript",
                "accept-language": "en-US,en;q=0.9",
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                priority: "u=1, i",
                "sec-ch-ua": '"Not)A;Brand";v="8", "Chromium";v="138", "Google Chrome";v="138"',
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": '"Windows"',
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "x-requested-with": "XMLHttpRequest",
                Referer: "https://osu.ppy.sh/users/12976255",
            },
            body: "_token=&username=Nyash&password=OS*M8BN4sh*&cf-turnstile-response=0.aT9Lm6jaaegcfcSQ-zY65IOU7aGLJpGyZBjNdF0A2UvGVsasw2h_pOR9zyU-kEgcWvEmn60nTOBIO8YsROObxXKPXu8r405cTKb979xIbFuj6R0hIyItZw84Tnf5SPGt-BqjCZkoMRhDrz8f6l3wCK8t7_L94nps6OmpWMfBPXoLjoVt0lrt58Y9YIzUN-Zjy9yPyjuAaPLlHRMyKarhthkQ0Ps6M5KQ9PuspP0XGX0wyEZmnDAIcCcwqXDEnwj-Woz1uVVtavwsDFIvyyOfVf1c-5Q8EXpw05YHMfmCiKLHoODugvoiBtodUCy0xx6eH0J_WYAgRX5zt0SOW6WDq9vE2KlOfSCTQetJ3Pz6Lg5lqS2ThzQfvh7eJHkNF9VmtEIiRqe41NMAUNavtoaVj_7mkO8ab_9raAo2DXAAse03TF843JjwLw9NI4P3RgHuoVFmk-JVQKHXb6ig66Hct23dnh6mVjzy9dDS5HivvciNZao8zM68KM2R8hQys35dCV87xviYlYyRgepqp27_l9hd4RkmsY12ablZiB6LFBtXGpwd7GWSUkfbNHe1iUAzxJnSonZWohRmd656W8ULcU_TR63FkGdHFh999IqyybCcIFWfSVyO5JgON-JIxJY3Zv0lx28KQB8dgo_z-dkcyU8KbG5RdyTeC6muveNEbglYdxIJAJN0WEEt5o51WIKNSh8LhNKbVRoiXFVvv_d_OBTPL0J4QDIAbbYfSAIG1qnA32n1lqs4K1vvkAuiljUeVItgbsSzZV3acae2frzrKD1UzGiUkR0Z_igRIvi6flSswTN7GtTarlTHU0GTGWe7bVMWWCtxOe92fmcH0Mt0a1wk5KPXtbsIoVGls6R6mhSJ8q7T1p4rNNhEBmenUQjwNIvawXMfcO8K2zkpDSoskQ.fj2xIgetTmPo-qH8D2bZ1w.f85c3bb4defd66b9631ce4acb19f41249f9ed9132e5e6e996603f9af1bcdaf80",
            method: "POST",
        });
        console.log(res);
    }
}
