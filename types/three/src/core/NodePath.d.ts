// WITH_GENESYS
/**
 * Path of sibling-local {@link NodeId}s identifying a node in the scene tree.
 * String form: `"a1b2/c3d4"` (4-hex segments separated by `/`).
 */

import type { NodeId } from "./nodeId.js";

export class NodePath {
    static readonly empty: NodePath;

    readonly ids: readonly NodeId[];

    constructor(ids?: readonly NodeId[]);

    static fromIds(...ids: NodeId[]): NodePath;

    /**
     * Parses `"a1b2/c3d4"`. Empty / whitespace-only string yields {@link NodePath.empty}.
     * @throws If any segment is not valid hex uint16.
     */
    static fromString(path: string): NodePath;

    /** Coerces a path-like value. Strings are parsed; {@link NodePath} is returned as-is. */
    static coerce(path: NodePath | string): NodePath;

    get length(): number;
    get isEmpty(): boolean;
    toString(): string;
    equals(other: NodePath): boolean;
    startsWith(prefix: NodePath): boolean;
    slice(start: number, end?: number): NodePath;
    concat(relative: NodePath): NodePath;

    /**
     * If this path starts with `ancestor`, returns the remainder; otherwise `null`.
     * When equal to `ancestor`, returns {@link NodePath.empty}.
     */
    relativeFrom(ancestor: NodePath): NodePath | null;
}
// !WITH_GENESYS
