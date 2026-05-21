import { Object3D } from "three";
import { LightProbeGrid } from "../lighting/LightProbeGrid.js";

export interface LightProbeGridCubeMapHelperOptions {
    webgpu?: boolean | undefined;
}

declare class LightProbeGridCubeMapHelper extends Object3D {
    probes: LightProbeGrid;
    cubeSize: number;

    constructor(probes: LightProbeGrid, cubeSize?: number, options?: LightProbeGridCubeMapHelperOptions);

    update(): void;
    dispose(): void;
}

export { LightProbeGridCubeMapHelper };
