declare module "gifenc" {
  export type Palette = Array<Array<number>>;

  export interface GIFEncoderInstance {
    writeFrame(
      index: Uint8Array,
      width: number,
      height: number,
      options?: {
        palette?: Palette;
        delay?: number;
        repeat?: number;
        dispose?: number;
        transparent?: boolean;
        transparentIndex?: number;
      },
    ): void;
    finish(): void;
    bytes(): Uint8Array;
  }

  export function GIFEncoder(options?: { auto?: boolean }): GIFEncoderInstance;
  export function quantize(
    rgba: Uint8Array | Uint8ClampedArray,
    maxColors: number,
    options?: { format?: "rgb565" | "rgb444" | "rgba4444" },
  ): Palette;
  export function applyPalette(
    rgba: Uint8Array | Uint8ClampedArray,
    palette: Palette,
    format?: "rgb565" | "rgb444" | "rgba4444",
  ): Uint8Array;
}

declare module "omggif" {
  export interface GifFrameInfo {
    x: number;
    y: number;
    width: number;
    height: number;
    delay: number;
    disposal: number;
  }

  export class GifReader {
    constructor(buffer: Uint8Array);
    readonly width: number;
    readonly height: number;
    numFrames(): number;
    frameInfo(frameIndex: number): GifFrameInfo;
    decodeAndBlitFrameRGBA(
      frameIndex: number,
      pixels: Uint8Array | Uint8ClampedArray,
    ): void;
  }
}
