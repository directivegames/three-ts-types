// WITH_GENESYS
import type Renderer from "../renderers/common/Renderer.js";
import type { WebGLRenderer } from "../renderers/WebGLRenderer.js";

export interface ProfilerStats {
    label: string;
    samples: number;
    avg: number;
    min: number;
    max: number;
    p95: number;
    /** Percentage of a 60 fps frame budget (16.67 ms) */
    frameBudget: number;
    /** Total (uncapped) call count since last reset, for calls-per-frame computation. */
    totalInvocations: number;
    /** Exclusive (self) avg ms — inclusive time minus child scope time. */
    selfAvg?: number;
    selfMin?: number;
    selfMax?: number;
    selfP95?: number;
    /** Exclusive time as percentage of a 60 fps frame budget. */
    selfFrameBudget?: number;
}

export interface GpuProfilerStats {
    label: string;
    samples: number;
    avg: number;
    min: number;
    max: number;
    p95: number;
    /** Percentage of a 60 fps frame budget (16.67 ms) */
    frameBudget: number;
    totalInvocations: number;
}

export interface SpanHandle {
    label: string;
    t0: number;
    _seq: number;
    _startMark?: string | undefined;
}

export interface EndSpanOptions {
    asyncTimeline?: boolean | undefined;
}

export type GpuProfilerRenderer = Renderer | WebGLRenderer;

export interface GpuSpanHandle {
    label: string;
    renderer: GpuProfilerRenderer | null;
    t0: number;
    _seq: number;
    _generation: number;
}

/** Chrome Trace Event Format — compatible with Speedscope and Perfetto. */
export interface ChromeTraceEvent {
    name: string;
    ph: "X";
    ts: number;
    dur: number;
    pid: 1;
    tid: 1 | 2 | 3;
    cat: "gnsx" | "gnsx-gpu";
}

export interface ChromeTraceMetadataEvent {
    cat: "__metadata";
    name: "process_name" | "thread_name";
    ph: "M";
    pid: 1;
    tid?: number | undefined;
    ts: 0;
    args: { name: string };
}

export interface ChromeTrace {
    displayTimeUnit: "ms";
    traceEvents: Array<ChromeTraceEvent | ChromeTraceMetadataEvent>;
}

/**
 * `'full'`  — ring-buffer stats + trace event accumulation (downloadable via downloadTrace()).
 * `'stats'` — ring-buffer stats only; trace events are not accumulated (lower memory overhead).
 */
export type ProfilingProfile = "full" | "stats";

declare class ProfilerServiceClass {
    begin: (label: string) => void;
    end: (label: string) => void;
    beginSpan: (label: string) => SpanHandle;
    endSpan: (handle: SpanHandle, options?: EndSpanOptions) => void;
    beginGpu: (label: string, renderer: GpuProfilerRenderer) => GpuSpanHandle;
    endGpu: (handle: GpuSpanHandle) => void;

    setProfile(profile: ProfilingProfile): void;
    getProfile(): ProfilingProfile;
    enable(): void;
    disable(): void;
    isEnabled(): boolean;
    attachGpuRenderer(renderer: GpuProfilerRenderer): Promise<boolean>;
    flushGpu(renderer: GpuProfilerRenderer): Promise<void>;
    getStats(label: string): ProfilerStats | null;
    getAllStats(): ProfilerStats[];
    getGpuStats(label: string): GpuProfilerStats | null;
    getAllGpuStats(): GpuProfilerStats[];
    report(): void;
    /**
     * @param minDurationMs Omit complete spans shorter than this duration (ms). Capture is unaffected.
     */
    exportChromeTrace(minDurationMs?: number): ChromeTrace;
    /**
     * @param minDurationMs Omit complete spans shorter than this duration (ms).
     */
    downloadTrace(filename?: string, minDurationMs?: number): void;
    exportJSON(): ProfilerStats[];
    exportGpuJSON(): GpuProfilerStats[];
    reset(): void;
}

export declare const ProfilerService: ProfilerServiceClass;

export declare function profile(
    target: object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
): PropertyDescriptor;

export declare function profile(
    customTag: string,
): (
    target: object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
) => PropertyDescriptor;

export declare function profile(): (
    target: object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
) => PropertyDescriptor;

export declare function profileClass<T extends abstract new(...args: unknown[]) => object>(
    constructor: T,
): T;
// !WITH_GENESYS
