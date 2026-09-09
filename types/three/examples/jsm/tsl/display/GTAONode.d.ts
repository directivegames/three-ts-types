import { Camera, Node, TempNode, TextureNode, UniformNode } from "three/webgpu";

declare class GTAONode extends TempNode<"float"> {
    depthNode: Node;
    normalNode: Node;
    // WITH_GENESYS
    /** Optional center-pixel validity node, sampled once before GTAO ray marching. */
    validityNode: Node | null;
    // !WITH_GENESYS

    resolutionScale: number;

    radius: UniformNode<"float", number>;
    // WITH_GENESYS
    /** Max projected AO radius in pixels; clamps near-camera sample stride. */
    maxScreenRadius: UniformNode<"float", number>;
    // !WITH_GENESYS
    thickness: UniformNode<"float", number>;
    /**
     * @deprecated since r186. The new distance model "Quadratic Ray Stepping" does not need it anymore.
     */
    distanceExponent: UniformNode<"float", number>;
    /**
     * @deprecated since r186. The new distance model "Quadratic Ray Stepping" does not need it anymore.
     */
    distanceFallOff: UniformNode<"float", number>;
    scale: UniformNode<"float", number>;
    samples: UniformNode<"float", number>;

    useTemporalFiltering: boolean;

    constructor(depthNode: Node, normalNode: Node, camera: Camera);

    getTextureNode(): TextureNode;

    setSize(width: number, height: number): void;
}

export default GTAONode;

export const ao: (
    depthNode: Node,
    normalNode: Node,
    camera: Camera,
) => GTAONode;
