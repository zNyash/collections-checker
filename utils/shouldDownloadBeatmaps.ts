import prompts from "prompts";

export async function shouldDownloadBeatmaps() {
    let downloadEverything = false;
    const response = await prompts({
        type: "text",
        name: "download",
        message: "Do you want to download all the beatmaps? (Y/n):",
        validate: (value) => {
            switch (value.toLowerCase().trim()) {
                case "":
                    downloadEverything = true;
                    return true;
                case "y":
                case "yes":
                    downloadEverything = true;
                    return true;
                case "n":
                case "no":
                    return true;
                default:
                    return "Invalid input";
            }
        },
    });

    return downloadEverything;
}
