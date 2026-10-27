import { applyPalette, GIFEncoder, quantize } from "gifenc";
import { GifReader } from "omggif";
import type { ResolvedOutfitLayer } from "./resolveOutfitLayers";

const MAX_LOOP_DURATION_MS = 12_000;
const MAX_DECODED_FRAME_BYTES = 256 * 1024 * 1024;

export type GifExportStage = "loading" | "compositing" | "encoding";

export interface GifExportProgress {
  stage: GifExportStage;
  completed: number;
  total: number;
}

export interface GifExportResult {
  blob: Blob;
  width: number;
  height: number;
  frameCount: number;
  durationMs: number;
  loopWasCapped: boolean;
}

interface DecodedLayer {
  item: ResolvedOutfitLayer;
  frames: ImageData[];
  delays: number[];
  totalCycleMs: number;
  width: number;
  height: number;
  objectFit: string;
  objectPosition: string;
  zIndex: number;
  domOrder: number;
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
}

interface ComposedFrame {
  pixels: Uint8Array;
  delayMs: number;
}

function gcd(a: number, b: number): number {
  while (b !== 0) {
    [a, b] = [b, a % b];
  }
  return a;
}

function getBoundedLoopDuration(cycles: number[]): {
  durationMs: number;
  loopWasCapped: boolean;
} {
  if (cycles.length === 0) {
    return { durationMs: 1000, loopWasCapped: false };
  }

  let durationMs = 1;
  for (const cycle of cycles) {
    const next = (durationMs / gcd(durationMs, cycle)) * cycle;
    if (next > MAX_LOOP_DURATION_MS) {
      return { durationMs: MAX_LOOP_DURATION_MS, loopWasCapped: true };
    }
    durationMs = next;
  }
  return { durationMs, loopWasCapped: false };
}

function isGif(bytes: Uint8Array): boolean {
  return (
    bytes.length >= 6 &&
    bytes[0] === 0x47 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    (bytes[3] === 0x38 && (bytes[4] === 0x37 || bytes[4] === 0x39)) &&
    bytes[5] === 0x61
  );
}

function decodeGif(bytes: Uint8Array, name: string): {
  frames: ImageData[];
  delays: number[];
  width: number;
  height: number;
} {
  const reader = new GifReader(bytes);
  const { width, height } = reader;
  const frameCount = reader.numFrames();
  if (frameCount === 0) throw new Error(`${name}: GIF 没有可导出的帧`);
  if (width <= 0 || height <= 0) throw new Error(`${name}: GIF 尺寸无效`);

  const estimatedBytes = width * height * frameCount * 4;
  if (estimatedBytes > MAX_DECODED_FRAME_BYTES) {
    throw new Error(`${name}: 动画帧过多，无法在浏览器中稳定导出`);
  }

  const frames: ImageData[] = [];
  const delays: number[] = [];
  let composedPixels = new Uint8ClampedArray(width * height * 4);

  for (let frameIndex = 0; frameIndex < frameCount; frameIndex += 1) {
    const info = reader.frameInfo(frameIndex);
    const previousPixels = info.disposal === 3
      ? new Uint8ClampedArray(composedPixels)
      : null;

    reader.decodeAndBlitFrameRGBA(frameIndex, composedPixels);
    frames.push(new ImageData(new Uint8ClampedArray(composedPixels), width, height));
    delays.push(Math.max((info.delay || 10) * 10, 20));

    if (info.disposal === 2) {
      const left = Math.max(0, info.x);
      const top = Math.max(0, info.y);
      const right = Math.min(width, info.x + info.width);
      const bottom = Math.min(height, info.y + info.height);
      for (let y = top; y < bottom; y += 1) {
        const start = (y * width + left) * 4;
        const end = (y * width + right) * 4;
        composedPixels.fill(0, start, end);
      }
    } else if (info.disposal === 3 && previousPixels) {
      composedPixels = previousPixels;
    }
  }

  return { frames, delays, width, height };
}

async function decodeStaticImage(buffer: ArrayBuffer, name: string): Promise<{
  frames: ImageData[];
  delays: number[];
  width: number;
  height: number;
}> {
  const bitmap = await createImageBitmap(new Blob([buffer]));
  try {
    if (bitmap.width <= 0 || bitmap.height <= 0) {
      throw new Error(`${name}: 图片尺寸无效`);
    }
    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) throw new Error("浏览器无法创建图片解码画布");
    context.drawImage(bitmap, 0, 0);
    return {
      frames: [context.getImageData(0, 0, bitmap.width, bitmap.height)],
      delays: [1000],
      width: bitmap.width,
      height: bitmap.height,
    };
  } finally {
    bitmap.close();
  }
}

async function decodeLayer(
  item: ResolvedOutfitLayer,
  imageElement: HTMLImageElement,
  domOrder: number,
): Promise<DecodedLayer> {
  const assetUrl = new URL(item.image, window.location.href);
  const response = await fetch(assetUrl.href);
  if (!response.ok) {
    throw new Error(`${item.name}: 素材加载失败（${response.status}）`);
  }

  const buffer = await response.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  const decoded = isGif(bytes)
    ? decodeGif(bytes, item.name)
    : await decodeStaticImage(buffer, item.name);

  const wrapper = imageElement.closest<HTMLElement>(
    ".qq-show-layer, .share-display-layer",
  );
  const wrapperStyle = getComputedStyle(wrapper ?? imageElement);
  const imageStyle = getComputedStyle(imageElement);
  const zIndex = Number.parseInt(wrapperStyle.zIndex, 10);
  const canvas = document.createElement("canvas");
  canvas.width = decoded.width;
  canvas.height = decoded.height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("浏览器无法创建图层合成画布");

  return {
    item,
    ...decoded,
    totalCycleMs: decoded.delays.reduce((sum, delay) => sum + delay, 0),
    objectFit: imageStyle.objectFit,
    objectPosition: imageStyle.objectPosition,
    zIndex: Number.isFinite(zIndex) ? zIndex : 0,
    domOrder,
    canvas,
    context,
  };
}

function getPositionOffset(position: string, freeSpace: number): number {
  const normalized = position.toLowerCase();
  if (normalized.endsWith("%")) {
    return (freeSpace * Number.parseFloat(normalized)) / 100;
  }
  if (normalized.endsWith("px")) return Number.parseFloat(normalized);
  if (normalized === "center") return freeSpace / 2;
  if (normalized === "right" || normalized === "bottom") return freeSpace;
  if (normalized === "left" || normalized === "top") return 0;
  return 0;
}

function getPositionTokens(value: string): [string, string] {
  const parts = value.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return ["0%", "0%"];
  if (parts.length === 1) {
    if (parts[0] === "center") return ["center", "center"];
    if (parts[0] === "top" || parts[0] === "bottom") return ["center", parts[0]];
    return [parts[0], "center"];
  }
  return [parts[0], parts[1]];
}

function getDrawRect(layer: DecodedLayer, width: number, height: number) {
  const sourceWidth = layer.width;
  const sourceHeight = layer.height;
  let drawWidth = width;
  let drawHeight = height;

  if (layer.objectFit === "contain" || layer.objectFit === "scale-down") {
    const scale = Math.min(width / sourceWidth, height / sourceHeight);
    drawWidth = sourceWidth * scale;
    drawHeight = sourceHeight * scale;
  } else if (layer.objectFit === "cover") {
    const scale = Math.max(width / sourceWidth, height / sourceHeight);
    drawWidth = sourceWidth * scale;
    drawHeight = sourceHeight * scale;
  } else if (layer.objectFit === "none") {
    drawWidth = sourceWidth;
    drawHeight = sourceHeight;
  }

  const [horizontalPosition, verticalPosition] = getPositionTokens(layer.objectPosition);
  const x = getPositionOffset(horizontalPosition, width - drawWidth);
  const y = getPositionOffset(verticalPosition, height - drawHeight);
  return { x, y, width: drawWidth, height: drawHeight };
}

function drawRoundedRectanglePath(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  const r = Math.max(0, Math.min(radius, width / 2, height / 2));
  context.beginPath();
  context.moveTo(x + r, y);
  context.lineTo(x + width - r, y);
  context.quadraticCurveTo(x + width, y, x + width, y + r);
  context.lineTo(x + width, y + height - r);
  context.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  context.lineTo(x + r, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - r);
  context.lineTo(x, y + r);
  context.quadraticCurveTo(x, y, x + r, y);
  context.closePath();
}

function getFrameIndex(layer: DecodedLayer, timeMs: number): number {
  if (layer.frames.length === 1 || layer.totalCycleMs <= 0) return 0;
  const timeInCycle = timeMs % layer.totalCycleMs;
  let elapsed = 0;
  for (let index = 0; index < layer.delays.length; index += 1) {
    if (elapsed + layer.delays[index] > timeInCycle) return index;
    elapsed += layer.delays[index];
  }
  return 0;
}

function getAnimationIntervals(layers: DecodedLayer[], durationMs: number) {
  const timestamps = new Set<number>([0]);
  for (const layer of layers) {
    if (layer.frames.length <= 1) continue;
    let time = 0;
    let delayIndex = 0;
    while (time < durationMs) {
      time += layer.delays[delayIndex];
      delayIndex = (delayIndex + 1) % layer.delays.length;
      if (time < durationMs) timestamps.add(time);
    }
  }

  const ordered = Array.from(timestamps).sort((a, b) => a - b);
  return ordered.flatMap((start, index) => {
    const end = ordered[index + 1] ?? durationMs;
    return end > start ? [{ start, delayMs: end - start }] : [];
  });
}

function renderCompositeFrame(
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
  layers: DecodedLayer[],
  timeMs: number,
  backgroundColor: string,
  borderWidth: number,
  borderColor: string,
  borderRadius: number,
): Uint8Array {
  const { width, height } = canvas;
  context.clearRect(0, 0, width, height);
  context.fillStyle = backgroundColor === "rgba(0, 0, 0, 0)"
    ? "#f8f8f8"
    : backgroundColor;
  context.fillRect(0, 0, width, height);

  context.save();
  if (borderRadius > 0) {
    drawRoundedRectanglePath(context, 0, 0, width, height, borderRadius);
    context.clip();
  }

  for (const layer of layers) {
    const frame = layer.frames[getFrameIndex(layer, timeMs)];
    layer.context.putImageData(frame, 0, 0);
    const drawRect = getDrawRect(layer, width, height);
    context.drawImage(
      layer.canvas,
      drawRect.x,
      drawRect.y,
      drawRect.width,
      drawRect.height,
    );
  }
  context.restore();

  if (borderWidth > 0) {
    context.save();
    context.strokeStyle = borderColor;
    context.lineWidth = borderWidth;
    drawRoundedRectanglePath(
      context,
      borderWidth / 2,
      borderWidth / 2,
      width - borderWidth,
      height - borderWidth,
      borderRadius,
    );
    context.stroke();
    context.restore();
  }

  return new Uint8Array(context.getImageData(0, 0, width, height).data);
}

function framesEqual(left: Uint8Array, right: Uint8Array): boolean {
  if (left.length !== right.length) return false;
  for (let index = 0; index < left.length; index += 1) {
    if (left[index] !== right[index]) return false;
  }
  return true;
}

function yieldToBrowser(): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, 0));
}

/** Decodes and recomposites the current preview layers into one looping GIF. */
export async function createOutfitGif(
  displayElement: HTMLElement,
  items: ResolvedOutfitLayer[],
  onProgress?: (progress: GifExportProgress) => void,
): Promise<GifExportResult> {
  const imageElements = Array.from(
    displayElement.querySelectorAll<HTMLImageElement>(
      "img.qq-show-item-image, img.share-display-image",
    ),
  );
  if (items.length === 0 || imageElements.length !== items.length) {
    throw new Error("预览图层尚未准备好，请稍后再试");
  }

  const layers: DecodedLayer[] = [];
  let decodedBytes = 0;
  for (let index = 0; index < items.length; index += 1) {
    const layer = await decodeLayer(items[index], imageElements[index], index);
    decodedBytes += layer.frames.length * layer.width * layer.height * 4;
    if (decodedBytes > MAX_DECODED_FRAME_BYTES) {
      throw new Error("当前装扮的动画素材过多，浏览器内存不足以导出 GIF");
    }
    layers.push(layer);
    onProgress?.({ stage: "loading", completed: index + 1, total: items.length });
    await yieldToBrowser();
  }

  layers.sort((a, b) => a.zIndex - b.zIndex || a.domOrder - b.domOrder);

  const rect = displayElement.getBoundingClientRect();
  const width = Math.round(rect.width);
  const height = Math.round(rect.height);
  if (width <= 0 || height <= 0) throw new Error("预览尺寸无效");

  const previewStyle = getComputedStyle(displayElement);
  const pseudoStyle = getComputedStyle(displayElement, "::after");
  const borderWidth = Number.parseFloat(pseudoStyle.borderTopWidth) || 0;
  const borderColor = pseudoStyle.borderTopColor || "#c0c0c0";
  const borderRadius = Number.parseFloat(previewStyle.borderTopLeftRadius) || 0;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) throw new Error("浏览器无法创建最终合成画布");
  context.imageSmoothingEnabled = false;

  const animatedCycles = layers
    .filter((layer) => layer.frames.length > 1)
    .map((layer) => layer.totalCycleMs);
  const loop = getBoundedLoopDuration(animatedCycles);
  const intervals = getAnimationIntervals(layers, loop.durationMs);
  const backgroundColor = previewStyle.backgroundColor || "#f8f8f8";
  const composedFrames: ComposedFrame[] = [];

  for (let index = 0; index < intervals.length; index += 1) {
    const interval = intervals[index];
    const pixels = renderCompositeFrame(
      canvas,
      context,
      layers,
      interval.start,
      backgroundColor,
      borderWidth,
      borderColor,
      borderRadius,
    );
    const previous = composedFrames[composedFrames.length - 1];
    if (previous && framesEqual(previous.pixels, pixels)) {
      previous.delayMs += interval.delayMs;
    } else {
      composedFrames.push({ pixels, delayMs: interval.delayMs });
    }
    if ((index + 1) % 8 === 0 || index === intervals.length - 1) {
      onProgress?.({
        stage: "compositing",
        completed: index + 1,
        total: intervals.length,
      });
      await yieldToBrowser();
    }
  }

  const encoder = GIFEncoder();
  for (let index = 0; index < composedFrames.length; index += 1) {
    const frame = composedFrames[index];
    const palette = quantize(frame.pixels, 256, { format: "rgb565" });
    const colorIndexes = applyPalette(frame.pixels, palette, "rgb565");
    encoder.writeFrame(colorIndexes, width, height, {
      palette,
      delay: frame.delayMs,
      dispose: 1,
      ...(index === 0 ? { repeat: 0 } : {}),
    });
    if ((index + 1) % 4 === 0 || index === composedFrames.length - 1) {
      onProgress?.({
        stage: "encoding",
        completed: index + 1,
        total: composedFrames.length,
      });
      await yieldToBrowser();
    }
  }
  encoder.finish();

  return {
    blob: new Blob([encoder.bytes()], { type: "image/gif" }),
    width,
    height,
    frameCount: composedFrames.length,
    durationMs: loop.durationMs,
    loopWasCapped: loop.loopWasCapped,
  };
}
