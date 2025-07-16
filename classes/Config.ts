import chalk from "chalk";
import prompts from "prompts";

export interface IConfigData {
    clientID: string;
    clientSecret: string;
    token: string;
    tokenExpiration: number;
}
export class Config {
    private static instance: Config;

    private config: IConfigData = {
        clientID: "",
        clientSecret: "",
        token: "",
        tokenExpiration: 0,
    };

    private constructor() {}

    public static getInstance(): Config {
        if (!Config.instance) {
            Config.instance = new Config();
        }
        return Config.instance;
    }

    /**
     * Checks if the config.cfg file exists.
     * @returns A boolean indicating whether the file exists or not.
     */
    private async checkIfConfigExists() {
        return await Bun.file("config.cfg").exists();
    }

    /**
     * Creates the config.cfg file if it doesn't exist, and prompts the user to enter the client ID and client secret.
     * @returns Nothing.
     */
    private async createConfig(): Promise<void> {
        console.log(chalk.red("config.cfg not found."));
        console.log(chalk.blue("Please go to https://osu.ppy.sh/home/account/edit"));
        console.log(
            chalk.blue(
                "Then on section 'OAuth', click on 'New OAuth Application' and fill the following fields:",
            ),
        );

        const response = await this.askUserForInfo();

        this.config = {
            clientID: response.Client_ID,
            clientSecret: response.Client_Secret,
            token: this.config.token,
            tokenExpiration: this.config.tokenExpiration,
        };

        await this.writeConfig();

        return;
    }

    /**
     * Prompts the user to enter the Client ID and Client Secret via the console.
     * @returns A promise that resolves to an object containing the Client ID and Client Secret.
     */
    private async askUserForInfo() {
        const response = await prompts([
            {
                type: "text",
                name: "Client_ID",
                message: "Client ID:",
                validate: (value: string) => {
                    if (!value.trim()) {
                        return "Client ID cannot be empty";
                    }
                    const regex = /\b\d{5}\b/;
                    if (!regex.test(value.trim())) {
                        return "Client ID must be 5 digits long";
                    }
                    return true;
                },
            },
            {
                type: "text",
                name: "Client_Secret",
                message: "Client Secret:",
                validate: (value: string) => {
                    if (!value.trim()) {
                        return "Client Secret cannot be empty";
                    }
                    return true;
                },
            },
        ]);

        return response;
    }

    /**
     * Reads the `config.cfg` file and updates the configuration object.
     */
    private async readConfig() {
        console.log(chalk.grey("Reading config..."));
        const config = await Bun.file("config.cfg").json();
        this.config = {
            clientID: config.clientID,
            clientSecret: config.clientSecret,
            token: config.token,
            tokenExpiration: config.tokenExpiration,
        };
    }

    public async getConfig(): Promise<IConfigData> {
        const configExist = await this.checkIfConfigExists();

        if (!configExist) {
            await this.createConfig();
            console.log(chalk.green("Config created & loaded."));
            return this.config;
        }

        await this.readConfig();

        return this.config;
    }

    public async updateToken(token: string, expiration: number) {
        const expiratesAt = Date.now() + expiration * 1000;

        this.config.token = token;
        this.config.tokenExpiration = expiratesAt;
        await this.writeConfig();
    }

    private async writeConfig() {
        await Bun.write("config.cfg", JSON.stringify(this.config, null, 2));
    }
}
