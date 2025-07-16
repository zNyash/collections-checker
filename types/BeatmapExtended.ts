/**
 * Represents the attributes of a single beatmap.
 */
export interface BeatmapExtended {
    /** `float` Hit accuracy */
    accuracy: number;

    /** `float` Approach rate */
    ar: number;

    /** ID of the beatmapset */
    beatmapset_id: number;

    /** `float` Beats per minute. May be missing. */
    bpm?: number;

    /** Was this beatmap converted from another mode? */
    convert: boolean;

    /** Number of hit circles */
    count_circles: number;

    /** Number of sliders */
    count_sliders: number;

    /** Number of spinners */
    count_spinners: number;

    /** `float` Circle size */
    cs: number;

    /** Deletion timestamp, if deleted (ISO 8601), otherwise null */
    deleted_at: string | null;

    /** `float` Drain rate (HP drain) */
    drain: number;

    /** Play duration in seconds */
    hit_length: number;

    /** Is this beatmap scoreable? */
    is_scoreable: boolean;

    /** Last update timestamp (ISO 8601) */
    last_updated: string;

    /** Game mode as integer (0=osu!, 1=Taiko, 2=Catch, 3=Mania) */
    mode_int: number;

    /** Number of players who passed this map */
    passcount: number;

    /** Total play count */
    playcount: number;

    /**
     * Ranked status. See osu! API docs for possible values:
     * https://osu.ppy.sh/docs/index.html#beatmapset-rank-status
     */
    ranked: number;

    /** URL where this beatmap can be found */
    url: string;
}
