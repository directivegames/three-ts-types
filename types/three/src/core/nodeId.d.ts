// WITH_GENESYS
/**
 * Sibling-local 16-bit node identities.
 *
 * `null` / `undefined` mean unset. `0` is a valid {@link NodeId}.
 */

import type { XorShift32 } from "../math/XorShift32.js";
import type { Object3D } from "./Object3D.js";

/** 16-bit sibling-local node identity. */
export type NodeId = number;

/** True when `id` is a finite integer in the uint16 range (including 0). */
export function isValidNodeId(id: unknown): id is NodeId;

/** Canonical display form: 4 lowercase hex characters. */
export function nodeIdToString(id: NodeId): string;

/**
 * Parses a hex node-id segment (1–4 hex digits).
 * @returns The id, or `null` when the string is not a valid hex uint16.
 */
export function nodeIdFromString(value: string): NodeId | null;

/**
 * Seeds the process-wide {@link NodeId} RNG for deterministic construction.
 * Pass `undefined` to restore a non-deterministic stream.
 */
export function configureNodeIdSeed(seed?: string): void;

/** Generates a random {@link NodeId} from the process-wide default RNG. */
export function generateNodeId(rng?: XorShift32): NodeId;

/**
 * Allocates a {@link NodeId} not present in `existing`.
 * Uses `rng` (default process RNG) and retries until unique.
 */
export function allocateNodeId(
    existing: Iterable<NodeId> | ReadonlySet<NodeId>,
    rng?: XorShift32,
): NodeId;

/**
 * Deterministic {@link NodeId} from a stable key (first-try candidate for remints).
 * Still run through {@link allocateNodeId} when a parent’s sibling set is known.
 */
export function nodeIdFromKey(key: string): NodeId;

/** Collects nodeId values from a sibling set. */
export function collectSiblingNodeIds(
    nodes: Iterable<{ nodeId?: NodeId | null }>,
    except?: object,
): Set<NodeId>;

/** Ensures `object.nodeId` is unique among `parent.children`. */
export function ensureUniqueNodeIdAmongParentChildren(object: Object3D, parent: Object3D): void;
// !WITH_GENESYS
