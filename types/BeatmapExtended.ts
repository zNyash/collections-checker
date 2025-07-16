/**
 * Full response for a single osu! beatmap, including nested beatmapset info,
 * failtimes statistics and owners.
 */
export interface BeatmapExtended {
    /** Unique ID of the beatmap set this beatmap belongs to */
    beatmapset_id: number;

    /** Difficulty rating (star difficulty) */
    difficulty_rating: number;

    /** Unique ID of this beatmap */
    id: number;

    /** Game mode: `"osu"`, `"taiko"`, `"fruits"` or `"mania"` */
    mode: string;

    /** Ranked status: `"graveyard" | "wip" | "pending" | "ranked" | "approved" |
     * "qualified" | "loved"` */
    status: string;

    /** Total length of the track in seconds */
    total_length: number;

    /** ID of the user who submitted this beatmap */
    user_id: number;

    /** Difficulty name, e.g. `"Nyash's Expert"` */
    version: string;

    /** Overall hit circle accuracy (AR) in the beatmap data */
    accuracy: number;

    /** Approach rate */
    ar: number;

    /** Beats per minute */
    bpm: number;

    /** Whether the beatmap was converted from another ruleset */
    convert: boolean;

    /** Number of hit circles */
    count_circles: number;

    /** Number of sliders */
    count_sliders: number;

    /** Number of spinners */
    count_spinners: number;

    /** Circle size */
    cs: number;

    /** Checksum (md5) hash of the .osu file */
    checksum: string;

    /** Deletion timestamp in ISO 8601 if deleted, otherwise null */
    deleted_at: string | null;

    /** HP drain rate */
    drain: number;

    /** Hit length (play duration excluding breaks) in seconds */
    hit_length: number;

    /** Whether the beatmap is scoreable */
    is_scoreable: boolean;

    /** Last updated timestamp in ISO 8601 format */
    last_updated: string;

    /** Numeric mode (0 = osu!, 1 = taiko, 2 = catch, 3 = mania) */
    mode_int: number;

    /** Number of users who have passed this beatmap */
    passcount: number;

    /** Total play count on this beatmap */
    playcount: number;

    /** Numeric ranked status (see API docs for mapping) */
    ranked: number;

    /** Public URL to view the beatmap */
    url: string;

    /** Number of maximum combo achievable */
    max_combo: number;

    /** How many times the current user has played this beatmap */
    current_user_playcount: number;

    /** Per-second fail and exit statistics */
    failtimes: FailTimes;

    /** Metadata of the parent beatmap set */
    beatmapset: BeatmapSet;

    /** List of users who own this beatmap (usually the creator) */
    owners: Owner[];
}

/** Fail and exit counts per second of the track */
interface FailTimes {
    /** Array of counts of failures at each second of playback */
    fail: number[];
    /** Array of counts of exits (quit before fail) at each second */
    exit: number[];
}

/** Metadata for the beatmap set that this beatmap belongs to */
interface BeatmapSet {
    artist: string;
    artist_unicode: string;
    covers: {
        cover: string;
        "cover@2x": string;
        card: string;
        "card@2x": string;
        list: string;
        "list@2x": string;
        slimcover: string;
        "slimcover@2x": string;
    };
    creator: string;
    favourite_count: number;
    genre_id: number;
    hype: number | null;
    id: number;
    language_id: number;
    nsfw: boolean;
    offset: number;
    play_count: number;
    preview_url: string;
    source: string;
    spotlight: boolean;
    status: string;
    title: string;
    title_unicode: string;
    track_id: number | null;
    user_id: number;
    video: boolean;
    bpm: number;
    can_be_hyped: boolean;
    deleted_at: string | null;
    discussion_enabled: boolean;
    discussion_locked: boolean;
    is_scoreable: boolean;
    last_updated: string;
    legacy_thread_url: string;
    nominations_summary: {
        current: number;
        eligible_main_rulesets: string[];
        required_meta: {
            main_ruleset: number;
            non_main_ruleset: number;
        };
    };
    ranked: number;
    ranked_date: string;
    rating: number;
    storyboard: boolean;
    submitted_date: string;
    tags: string;
    availability: {
        download_disabled: boolean;
        more_information: string | null;
    };
    ratings: number[];
}

/** Minimal owner info for users associated with a beatmap */
interface Owner {
    /** User ID */
    id: number;
    /** Username */
    username: string;
}
