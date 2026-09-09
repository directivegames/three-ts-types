import { Object3D } from "three";
import { LightProbeGrid } from "../lighting/LightProbeGrid.js";
import { LightProbeGridWebGL } from "../lighting/LightProbeGridWebGL.js";

export interface LightProbeGridCubeMapHelperOptions {
    webgpu?: boolean | undefined;
}

declare class LightProbeGridCubeMapHelper extends Object3D {
    probes: LightProbeGrid | LightProbeGridWebGL;
    cubeSize: number;

    constructor(
        probes: LightProbeGrid | LightProbeGridWebGL,
        cubeSize?: number,
        options?: LightProbeGridCubeMapHelperOptions,
    );

    update(): void;
    dispose(): void;
}

export { LightProbeGridCubeMapHelper };
