import { Light } from "../../lights/Light.js";
import { LightsNode, MaterialLightsNode } from "../../nodes/Nodes.js";
// WITH_GENESYS
import LightingNode from "../../nodes/lighting/LightingNode.js";
// !WITH_GENESYS
import { Scene } from "../../scenes/Scene.js";

/**
 * This renderer module manages the lights nodes which are unique
 * per scene + camera + lighting combination.
 *
 * The lights node itself is later configured in the render list
 * with the actual lights from the scene.
 *
 * @private
 */
declare class Lighting {
    /**
     * Whether this lighting manager is enabled or not.
     *
     * @type {boolean}
     * @default true
     */
    enabled: boolean;
    /**
     * Creates a new lights node for the given array of lights.
     *
     * @param {Array<Light>} lights - The render object.
     * @return {LightsNode} The lights node.
     */
    createNode(lights?: Array<Light>): LightsNode;
    /**
     * Creates a lights node that composes live scene lighting with material-local
     * lighting nodes such as environment, AO and light map lighting.
     *
     * @param {LightsNode} lightsNode - The live scene lights node.
     * @param {Array<LightingNode>} materialLights - Material-local lighting nodes.
     * @return {MaterialLightsNode} The material lights node.
     */
    createMaterialNode(lightsNode: LightsNode, materialLights?: Array<LightingNode>): MaterialLightsNode;
    /**
     * Returns a lights node for the given scene.
     *
     * @param {Scene} scene - The scene.
     * @return {LightsNode} The lights node.
     */
    getNode(scene: Scene): LightsNode;
    /**
     * Saves the current lights of the scene's lights node so they can be restored
     * in {@link Lighting#finishRender}. Must be paired with a `finishRender()` call
     * to avoid memory leaks.
     *
     * Nested render calls might mutate the lights array so a save/restore is required
     * for each render call.
     *
     * @param {Scene} scene - The scene.
     */
    beginRender(scene: Scene): void;
    /**
     * Restores the lights saved by the matching {@link Lighting#beginRender} call.
     *
     * @param {Scene} scene - The scene.
     */
    finishRender(scene: Scene): void;
}

export default Lighting;
