import { Object3D } from "../../core/Object3D.js";
import { Light } from "../../lights/Light.js";
// WITH_GENESYS
import LightingNode from "../../nodes/lighting/LightingNode.js";
import { MaterialLightsNode } from "../../nodes/lighting/LightsNode.js";
// !WITH_GENESYS
import LightsNode from "../../nodes/lighting/LightsNode.js";

declare class Lighting {
    createNode(lights?: Light[]): LightsNode;

    // WITH_GENESYS
    createMaterialNode(lightsNode: LightsNode, materialLights?: LightingNode[]): MaterialLightsNode;
    // !WITH_GENESYS

    getNode(scene: Object3D): LightsNode;
}

export default Lighting;
