import { Object3D } from "../../core/Object3D.js";
import LightingNode from "./LightingNode.js";

declare class LightProbeGridNode extends LightingNode {
    lightProbeGrids: Object3D[];
    activeLightProbeGrid: Object3D | null;

    constructor(lightProbeGrids?: Object3D[]);
}

export default LightProbeGridNode;
