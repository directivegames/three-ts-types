import { Box3, CubeTexture, Data3DTexture, Object3D, Scene, Vector3, WebGLRenderer } from "three";
import { WebGPURenderer } from "three/webgpu";

export interface LightProbeGridBakeOptions {
    cubemapSize?: number | undefined;
    near?: number | undefined;
    far?: number | undefined;
    retainCubemaps?: boolean | undefined;
}

declare class LightProbeGrid extends Object3D {
    readonly isLightProbeGrid: boolean;

    width: number;
    height: number;
    depth: number;
    resolution: Vector3;
    boundingBox: Box3;
    texture: Data3DTexture | null;
    cubeTextures: CubeTexture[] | null;

    constructor(
        width?: number,
        height?: number,
        depth?: number,
        widthProbes?: number,
        heightProbes?: number,
        depthProbes?: number,
    );

    getProbePosition(ix: number, iy: number, iz: number, target: Vector3): Vector3;
    updateBoundingBox(): void;
    bake(
        renderer: WebGLRenderer | WebGPURenderer,
        scene: Scene,
        options?: LightProbeGridBakeOptions,
    ): Promise<void>;
    disposeRetainedCubemaps(): void;
    dispose(): void;
}

export { LightProbeGrid };
