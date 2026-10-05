// WITH_GENESYS
/** Detail levels for GPU timestamps written inside passes. */
export declare const PassTimestampLevel: {
    readonly OFF: 0;
    readonly STAGE: 1;
    readonly DRAW: 2;
};

export type PassTimestampLevel = (typeof PassTimestampLevel)[keyof typeof PassTimestampLevel];
// !WITH_GENESYS
