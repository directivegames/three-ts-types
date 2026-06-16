// WITH_GENESYS
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

/** Chrome Trace Event Format — compatible with Speedscope and Perfetto. */
export interface ChromeTraceEvent {
    name: string;
    ph: "X";
    ts: number;
    dur: number;
    pid: 1;
    tid: 1;
    cat: "gnsx";
}

export interface ChromeTrace {
    traceEvents: ChromeTraceEvent[];
    /** Metadata visible in Perfetto */
    metadata?: { "clock-offset-since-epoch-ns"?: number };
}

/**
 * `'full'`  — ring-buffer stats + trace event accumulation (downloadable via downloadTrace()).
 * `'stats'` — ring-buffer stats only; trace events are not accumulated (lower memory overhead).
 */
export type ProfilingProfile = "full" | "stats";

declare class ProfilerServiceClass {
    begin: (label: string) => void;
    end: (label: string) => void;

    setProfile(profile: ProfilingProfile): void;
    getProfile(): ProfilingProfile;
    enable(): void;
    disable(): void;
    isEnabled(): boolean;
    getStats(label: string): ProfilerStats | null;
    getAllStats(): ProfilerStats[];
    report(): void;
    exportChromeTrace(): ChromeTrace;
    downloadTrace(filename?: string): void;
    exportJSON(): ProfilerStats[];
    reset(): void;
}

export declare const ProfilerService: ProfilerServiceClass;

export declare function profile(
    target: object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
): PropertyDescriptor;

export declare function profileClass<T extends abstract new (...args: unknown[]) => object>(
    constructor: T,
): T;
// !WITH_GENESYS
