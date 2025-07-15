import type { Collections } from "../types/Collections";

export interface IParsedCollections {
    data: Collections;
    toJson: () => string;
    toBlob: () => Blob;
    toBytes: () => Uint8Array;
}

export class ParsedCollections implements IParsedCollections {
    constructor(public data: Collections) {}

    toJson(): string {
        return JSON.stringify(this.data, null, 2);
    }

    toBlob(): Blob {
        return new Blob([this.toJson()], { type: "application/json" });
    }

    toBytes(): Uint8Array {
        return new TextEncoder().encode(this.toJson());
    }
}
