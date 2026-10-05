// WITH_GENESYS
import type Renderer from "../renderers/common/Renderer.js";
import type { WebGLRenderer } from "../renderers/WebGLRenderer.js";

export interface ProfilerStats {
    label: string;
    /** Inclusive samples; recursive calls only contribute their outermost call. */
    samples: number;
    avg: number;
    min: number;
    max: number;
    /** Nearest-rank 95th percentile. */
    p95: number;
    /** Average as a percentage of `frameBudgetMs` (one 60 fps frame by default). */
    frameBudget: number;
    /** Total (uncapped) call count since last reset, recursive calls included. */
    totalInvocations: number;
    /** Exclusive (self) avg ms — inclusive time minus child scope time. */
    selfAvg?: number;
    selfMin?: number;
    selfMax?: number;
    selfP95?: number;
    /** Exclusive average as a percentage of `frameBudgetMs`. */
    selfFrameBudget?: number;
}

export interface GpuProfilerStats {
    label: string;
    samples: number;
    avg: number;
    min: number;
    max: number;
    /** Nearest-rank 95th percentile. */
    p95: number;
    /** Average as a percentage of `frameBudgetMs` (one 60 fps frame by default). */
    frameBudget: number;
    totalInvocations: number;
}

export interface SpanHandle {
    label: string;
    t0: number;
    /** `0` for a no-op handle and once the span has ended; `endSpan()` then does nothing. */
    _seq: number;
    /** Session the span started in; handles from before `reset()` / `enable()` are ignored. */
    _generation: number;
}

export interface BeginSpanOptions {
    /** The span ends from an async continuation and does not take part in self-time nesting. */
    asyncTimeline?: boolean | undefined;
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
    /** 1 main thread, 2 async promise lifetimes (overlapping ones on 101+ in exports), 3 GPU. */
    tid: number;
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

/** Uncapped session totals — unaffected by the stats ring buffer. */
export interface SessionDurationStats {
    count: number;
    totalMs: number;
    min: number;
    max: number;
}

export interface SessionStats extends SessionDurationStats {
    label: string;
    /** Exclusive (self) session totals — inclusive time minus child scope time. */
    selfCount?: number | undefined;
    selfTotalMs?: number | undefined;
    selfMin?: number | undefined;
    selfMax?: number | undefined;
}

export interface GpuSessionStats extends SessionDurationStats {
    label: string;
}

/**
 * Receives complete trace slices instead of the trace buffer retaining them.
 * `close` runs from {@link ProfilerServiceClass.disable} and when the sink is replaced.
 */
export interface TraceSink {
    write(event: ChromeTraceEvent): void;
    close?: (() => void) | undefined;
}

/**
 * `'full'`  — ring-buffer stats + trace event accumulation (downloadable via downloadTrace()).
 * `'stats'` — ring-buffer stats. Trace events are emitted only while {@link ProfilerServiceClass.beginTraceCapture} is active.
 */
export type ProfilingProfile = "full" | "stats";

/**
 * GPU timing inside render passes. `'pass'` times whole passes; `'stage'` adds opaque,
 * transparent and bundle spans; `'draw'` also adds a span per draw. `'stage'` and `'draw'`
 * need timestamps inside passes (see {@link ProfilerServiceClass.hasPassTimestamps}).
 */
export type GpuProfilingDetail = "pass" | "stage" | "draw";

declare class ProfilerServiceClass {
    /**
     * @param label Stats key; keep it stable so samples aggregate.
     * @param traceName Trace slice name, defaulting to `label`. Can carry per-call
     * context such as object names; build it only when {@link isTracing} is true.
     */
    begin: (label: string, traceName?: string) => void;
    end: (label: string) => void;
    beginSpan: (label: string, options?: BeginSpanOptions) => SpanHandle;
    endSpan: (handle: SpanHandle, options?: EndSpanOptions) => void;
    beginGpu: (label: string, renderer: GpuProfilerRenderer) => GpuSpanHandle;
    endGpu: (handle: GpuSpanHandle) => void;
    /** Trace events kept per session in the `'full'` profile. */
    maxTraceEvents: number;
    /** Budget that `frameBudget` percentages are computed against (ms). Defaults to 1000 / 60. */
    frameBudgetMs: number;

    setProfile(profile: ProfilingProfile): void;
    getProfile(): ProfilingProfile;
    /**
     * Route complete trace slices to `sink` instead of retaining them.
     * May be called before or after {@link enable} / {@link beginTraceCapture}. {@link disable} closes the sink; {@link enable} and {@link reset} do not.
     */
    setTraceSink(sink: TraceSink | null): void;
    /**
     * Drop complete spans shorter than this from the trace. Discarded spans are not recoverable.
     * `0` keeps every span. Stats and session totals still record them.
     */
    setTraceMinDurationMs(minDurationMs: number): void;
    getTraceMinDurationMs(): number;
    /** Start a fresh trace session without clearing bounded stats rings. Enables profiling if needed. */
    beginTraceCapture(): void;
    /** Stop trace emission while preserving bounded stats collection and completed trace data. */
    endTraceCapture(): void;
    isTraceCaptureEnabled(): boolean;
    enable(): void;
    disable(): void;
    isEnabled(): boolean;
    /** Whether a trace is being recorded (`'full'` profile, or trace capture on any profile). */
    isTracing(): boolean;
    /** Per-draw timing adds GPU overhead; use it to locate cost, not to measure frame time. */
    setGpuDetail(detail: GpuProfilingDetail): void;
    getGpuDetail(): GpuProfilingDetail;
    /**
     * Whether a renderer can time stages and draws inside passes. In Chrome this needs
     * chrome://flags/#enable-unsafe-webgpu (or `--enable-unsafe-webgpu`). False until
     * `renderer.init()` resolves.
     */
    hasPassTimestamps(renderer: GpuProfilerRenderer): boolean;
    attachGpuRenderer(renderer: GpuProfilerRenderer): Promise<boolean>;
    flushGpu(renderer: GpuProfilerRenderer): Promise<void>;
    getStats(label: string): ProfilerStats | null;
    getAllStats(): ProfilerStats[];
    getGpuStats(label: string): GpuProfilerStats | null;
    getAllGpuStats(): GpuProfilerStats[];
    getSessionStats(label: string): SessionStats | null;
    getAllSessionStats(): SessionStats[];
    getGpuSessionStats(label: string): GpuSessionStats | null;
    getAllGpuSessionStats(): GpuSessionStats[];
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
