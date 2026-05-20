import { InstancedMesh, ShaderMaterial, SphereGeometry } from "three";
import { NodeMaterial } from "three/webgpu";
import { LightProbeGrid } from "../lighting/LightProbeGrid.js";

export interface LightProbeGridHelperOptions {
    webgpu?: boolean | undefined;
}

declare class LightProbeGridHelper extends InstancedMesh<SphereGeometry, ShaderMaterial | NodeMaterial> {
    probes: LightProbeGrid;

    constructor(probes: LightProbeGrid, sphereSize?: number, options?: LightProbeGridHelperOptions);

    update(): void;
}

export { LightProbeGridHelper };
