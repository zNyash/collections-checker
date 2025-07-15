import chalk from "chalk";
import prompts from "prompts";

interface IConfigData {
    apiKey: string;
    apiSecret: string;
}
export class Config {
    private config: IConfigData = {
        apiKey: "",
        apiSecret: "",
    };

    /**
     * Checks if the config.cfg file exists.
     * @returns A boolean indicating whether the file exists or not.
     */
    private async checkIfConfigExists() {
        console.log(chalk.grey("Checking if config.cfg exists..."));
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

        await Bun.write(
            "config.cfg",
            `DON'T SHARE THIS FILE\napiKey=${response.Client_ID}\napiSecret=${response.Client_Secret}`,
        );

        this.config = {
            apiKey: response.Client_ID,
            apiSecret: response.Client_Secret,
        };

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

    public getConfig(): IConfigData {
        const configExist = this.checkIfConfigExists();
        if (!configExist) {
            this.createConfig();
        }

        return this.config;
    }
}
