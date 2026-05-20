import Node from "../../core/Node.js";

export interface LightProbeGridIrradianceParameters {
    probesSH: Node;
    probesMin: Node;
    probesMax: Node;
    probesResolution: Node;
    worldPosition: Node;
    worldNormal: Node;
}

export interface LightProbeGridIrradianceAtUVParameters {
    probesSH: Node;
    probesResolution: Node;
    gridUVW: Node;
    worldNormal: Node;
}

export const getLightProbeGridIrradianceAtUV: (parameters: LightProbeGridIrradianceAtUVParameters) => Node;

declare const getLightProbeGridIrradiance: (parameters: LightProbeGridIrradianceParameters) => Node;

export default getLightProbeGridIrradiance;
