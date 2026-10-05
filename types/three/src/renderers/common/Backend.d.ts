import { CoordinateSystem } from "../../constants.js";
import NodeBuilder from "../../nodes/core/NodeBuilder.js";
// WITH_GENESYS
import ComputeNode from "../../nodes/gpgpu/ComputeNode.js";
import { PassTimestampLevel } from "../../profiler/PassTimestampLevel.js";
// !WITH_GENESYS
import Renderer from "./Renderer.js";

declare module "../../core/Object3D.js" {
    interface Object3D {
        // See https://github.com/mrdoob/three.js/pull/28683
        count?: number | undefined;
        // See https://github.com/mrdoob/three.js/pull/26335
        occlusionTest?: boolean | undefined;
    }
}

export interface BackendParameters {
    canvas?: HTMLCanvasElement | OffscreenCanvas | undefined;
}

// WITH_GENESYS
/** `parentUid` is the pass or pass timestamp span the query is nested in, `null` for a pass. */
export type TimestampQueryListener = (
    type: string,
    uid: string,
    label: string | null,
    parentUid: string | null,
) => void;

/** Opaque handle from {@link Backend.beginPassTimestampSpan}. */
export interface PassTimestampSpan {
    readonly uid: string;
}
// !WITH_GENESYS

export default abstract class Backend {
    renderer: Renderer | null;
    domElement: HTMLCanvasElement | OffscreenCanvas | null;

    constructor(parameters?: BackendParameters);

    init(renderer: Renderer): void;

    abstract get coordinateSystem(): CoordinateSystem;

    getDomElement(): HTMLCanvasElement | OffscreenCanvas;

    // WITH_GENESYS
    /** Whether timestamps can be written inside passes (Chrome: chrome://flags/#enable-unsafe-webgpu). */
    supportsPassTimestamps: boolean;
    /** Finest {@link PassTimestampLevel} timed inside passes. */
    passTimestampLevel: PassTimestampLevel;
    addTimestampQueryListener(listener: TimestampQueryListener): void;
    getTimestampRange(uid: string): { start: bigint; end: bigint } | null;
    removeTimestampQueryListener(listener: TimestampQueryListener): void;
    notifyTimestampQuery(type: string, uid: string, label?: string | null, parentUid?: string | null): void;
    getComputeProfilerLabel(computeGroup: ComputeNode | ComputeNode[]): string;
    /**
     * Starts a timestamp span in the current pass of `renderContext`, nested in the innermost
     * open span. Returns `null` (and times nothing) below `level` or without support.
     */
    beginPassTimestampSpan(renderContext: object, label: string, level: PassTimestampLevel): PassTimestampSpan | null;
    /** Ends a span and any span still open inside it. */
    endPassTimestampSpan(span: PassTimestampSpan | null): void;
    // !WITH_GENESYS
}
