import chalk from "chalk";
import prompts from "prompts";

interface IConfigData {
    clientID: string;
    clientSecret: string;
}
export class Config {
    private config: IConfigData = {
        clientID: "",
        clientSecret: "",
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
            `DON'T SHARE THIS FILE\nclientID=${response.Client_ID}\nclientSecret=${response.Client_Secret}`,
        );

        this.config = {
            clientID: response.Client_ID,
            clientSecret: response.Client_Secret,
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

    /**
     * Reads the `config.cfg` file and updates the configuration object.
     */
    private async readConfig() {
        const config = await Bun.file("config.cfg").text();
        const lines = config.split("\n");
        const id = lines[1]?.split("=")[1] ?? "";
        const secret = lines[2]?.split("=")[1] ?? "";
        this.config = {
            clientID: id,
            clientSecret: secret,
        };
    }

    public async getConfig(): Promise<IConfigData> {
        const configExist = await this.checkIfConfigExists();
        if (!configExist) {
            await this.createConfig();
            console.log(chalk.green("config created & loaded"));
            return this.config;
        }

        await this.readConfig();

        console.log(chalk.green("config loaded"));
        return this.config;
    }
}
