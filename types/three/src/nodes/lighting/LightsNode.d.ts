import { Object3D } from "../../core/Object3D.js";
import { Light } from "../../lights/Light.js";
import Node from "../core/Node.js";
import { NodeBuilder } from "../Nodes.js";
import LightingNode from "./LightingNode.js";

export interface DirectLightData {
    lightDirection: Node;
    lightColor: Node;
}

export interface DirectRectAreaLightData {
    lightColor: Node;
    lightPosition: Node;
    halfWidth: Node;
    halfHeight: Node;
    ltc_1: Node;
    ltc_2: Node;
}

declare class LightsNode extends Node {
    totalDiffuseNode: Node<"vec3">;
    totalSpecularNode: Node<"vec3">;
    outgoingLightNode: Node<"vec3">;

    constructor();

    setupLightsNode(builder: NodeBuilder): LightingNode[];

    setupDirectLight(builder: NodeBuilder, lightNode: Node, lightData: DirectLightData): void;

    setupDirectRectAreaLight(builder: NodeBuilder, lightNode: Node, lightData: DirectRectAreaLightData): void;

    setupLights(builder: NodeBuilder, lightNodes: LightingNode[]): void;

    getLightNodes(): LightingNode[];

    setLights(lights: Light[]): this;

    // WITH_GENESYS
    setLightProbeGrids(lightProbeGrids: Object3D[]): this;
    // !WITH_GENESYS

    getLights(): Light[];

    getBuiltinLights(): Light[];

    get hasLights(): boolean;
}

export default LightsNode;

// WITH_GENESYS
export class MaterialLightsNode extends LightsNode {
    lightsNode: LightsNode | null;
    materialLights: LightingNode[] | null;

    constructor(lightsNode: LightsNode, materialLights?: LightingNode[]);

    dispose(): void;
}
// !WITH_GENESYS

export const lights: (lights?: Light[]) => LightsNode;
