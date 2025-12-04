export interface RateLimitResponse {
    message: string;
    ip: string;
    types: {
        download: number;
        osu: number;
        search: number;
        beatmaps: number;
    };
    remaining: {
        download: number;
        osu: number;
        search: number;
        beatmaps: number;
    };
    count: {
        requests: number;
        downloads: number;
        limited: number;
        blocked: number;
    };
    daily: {
        limit: {
            requests: number;
            downloads: number;
            limited: number;
            blocked: number;
        };
        remaining: {
            requests: number;
            downloads: number;
            limited: number;
            blocked: number;
        };
    };
    "/d": string;
    "/osu": string;
    "/api/s": string;
    "/api/beatmapsets": string;
    "/api/b": string;
    "/api/beatmaps": string;
    "/api/md5": string;
    "/api/search": string;
}
