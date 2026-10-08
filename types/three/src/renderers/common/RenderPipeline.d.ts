import { Node } from "../../nodes/Nodes.js";
import Renderer from "./Renderer.js";

declare class RenderPipeline {
    readonly isRenderPipeline: true;

    renderer: Renderer;
    outputNode: Node;

    outputColorTransform: boolean;

    needsUpdate: boolean;

    // WITH_GENESYS
    /**
     * Extra root nodes released by `dispose()` together with the graph under `outputNode`.
     * Add nodes built for this pipeline that are not reachable from the output node. Nodes updated by the
     * pipeline's quads while rendering, including ones created during the shader build, are added automatically.
     */
    ownedNodes: Set<Node>;
    // !WITH_GENESYS

    constructor(renderer: Renderer, outputNode?: Node);

    render(): void;

    dispose(): void;

    /**
     * @deprecated "renderAsync()" has been deprecated. Use "render()" and "await renderer.init();" when creating the renderer.
     */
    renderAsync(): Promise<void>;
}

export default RenderPipeline;
