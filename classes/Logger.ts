import chalk from "chalk";

export type LogLevel = "debug" | "info" | "success" | "warn" | "error" | "fatal" | "ask";

const levelColors = {
    debug: chalk.magenta,
    info: chalk.bgBlue,
    success: chalk.bgGreen,
    warn: chalk.bgYellow,
    error: chalk.bgRed,
    fatal: chalk.bgRed.white.bold,
    ask: chalk.bgGray,
};

export class Logger {
    private static instance: Logger;

    private constructor() {}

    static getInstance() {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }

    private getTime() {
        const now = new Date();
        return now.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
        });
    }

    private log(level: LogLevel, ...msg: any[]) {
        const time = chalk.gray(this.getTime());
        const tag = levelColors[level](`[${level.toUpperCase()}]`);
        console.log(`${time} | ${tag} -`, ...msg);
    }

    debug(...msg: any[]) {
        this.log("debug", ...msg);
    }

    info(...msg: any[]) {
        this.log("info", ...msg);
    }

    success(...msg: any[]) {
        this.log("success", ...msg);
    }

    warn(...msg: any[]) {
        this.log("warn", ...msg);
    }

    error(...msg: any[]) {
        this.log("error", ...msg);
    }

    fatal(...msg: any[]) {
        this.log("fatal", ...msg);
    }

    ask(...msg: any[]) {
        this.log("ask", ...msg);
    }
}
