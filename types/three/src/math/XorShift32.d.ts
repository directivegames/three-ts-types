// WITH_GENESYS
/**
 * Shared deterministic PRNG helpers (FNV-1a seed hash + xorshift32).
 */

/** Lightweight FNV-1a hash for converting strings into a deterministic 32-bit seed. */
export function hashStringToUint32(input: string): number;

/** Xorshift32 step; deterministic and fast for ID generation. Never returns 0. */
export function xorshift32(state: number): number;

/** Random non-zero uint32 seed for non-deterministic streams. */
export function randomSeedUint32(): number;

/**
 * Deterministic xorshift32 stream. Internal state is never 0.
 */
export class XorShift32 {
    constructor(seed?: number | string);
    nextUint32(): number;
    nextUint16(): number;
    getState(): number;
    setState(state: number): void;
    clone(): XorShift32;
}
// !WITH_GENESYS
