import { Theme, truncateToWidth } from "@mariozechner/pi-coding-agent";
import { Point3D, Point2D, Shape, VizConfig } from "./types";
import { perlin } from "./noise";

export class BrailleCanvas {
  private pixels: Uint8Array;
  constructor(public cellWidth: number, public cellHeight: number) {
    this.pixels = new Uint8Array(cellWidth * 2 * cellHeight * 4);
  }

  set(x: number, y: number) {
    const px = Math.floor(x);
    const py = Math.floor(y);
    if (px < 0 || px >= this.cellWidth * 2 || py < 0 || py >= this.cellHeight * 4) return;
    this.pixels[py * this.cellWidth * 2 + px] = 1;
  }

  getLine(y: number): string {
    let line = "";
    for (let x = 0; x < this.cellWidth; x++) {
      let charCode = 0x2800;
      if (this.getPixel(x * 2, y * 4)) charCode |= (1 << 0);
      if (this.getPixel(x * 2, y * 4 + 1)) charCode |= (1 << 1);
      if (this.getPixel(x * 2, y * 4 + 2)) charCode |= (1 << 2);
      if (this.getPixel(x * 2 + 1, y * 4)) charCode |= (1 << 3);
      if (this.getPixel(x * 2 + 1, y * 4 + 1)) charCode |= (1 << 4);
      if (this.getPixel(x * 2 + 1, y * 4 + 2)) charCode |= (1 << 5);
      if (this.getPixel(x * 2, y * 4 + 3)) charCode |= (1 << 6);
      if (this.getPixel(x * 2 + 1, y * 4 + 3)) charCode |= (1 << 7);
      line += String.fromCharCode(charCode);
    }
    return line;
  }

  private getPixel(x: number, y: number) {
    return this.pixels[y * this.cellWidth * 2 + x];
  }
}

export class Engine {
  private noiseOffset = 0;
  private noiseIntensity = 0;

  render(shape: Shape, theme: Theme, color: any, isWorking: boolean, config: VizConfig): string[] {
    const { vizWidth: width, vizHeight: height, noiseStrength } = config;
    const canvas = new BrailleCanvas(width, height);
    const pixelWidth = width * 2;
    const pixelHeight = height * 4;

    // Update global noise state
    const targetIntensity = isWorking ? 1.0 : 0.0;
    this.noiseIntensity += (targetIntensity - this.noiseIntensity) * 0.05;
    this.noiseOffset += isWorking ? 0.08 : 0.01;

    const vertices = shape.getVertices();
    const edges = shape.getEdges();

    const projectedVertices = vertices.map((v) => {
      let { x, y, z } = v;
      
      // Global Noise Filter
      if (this.noiseIntensity > 0.001) {
        const noiseVal = perlin.noise(
          x + this.noiseOffset, 
          y + this.noiseOffset, 
          z + this.noiseOffset
        );
        const disp = 1 + (noiseVal * noiseStrength * this.noiseIntensity);
        x *= disp; y *= disp; z *= disp;
      }

      // Project
      const perspective = 4;
      const scale = Math.min(pixelWidth, pixelHeight) * 0.8;
      const factor = scale / (z + perspective);
      return { 
        x: x * factor + pixelWidth / 2, 
        y: y * factor + pixelHeight / 2 
      };
    });

    for (const [i, j] of edges) {
      if (projectedVertices[i] && projectedVertices[j]) {
        this.drawLine(canvas, projectedVertices[i], projectedVertices[j]);
      }
    }

    const lines: string[] = [];
    for (let y = 0; y < height; y++) {
      lines.push(theme.fg(color, canvas.getLine(y)));
    }
    return lines;
  }

  private drawLine(canvas: BrailleCanvas, p1: Point2D, p2: Point2D): void {
    let x1 = Math.floor(p1.x), y1 = Math.floor(p1.y);
    let x2 = Math.floor(p2.x), y2 = Math.floor(p2.y);
    const dx = Math.abs(x2 - x1), dy = Math.abs(y2 - y1);
    const sx = x1 < x2 ? 1 : -1, sy = y1 < y2 ? 1 : -1;
    let err = dx - dy;
    while (true) {
      canvas.set(x1, y1);
      if (x1 === x2 && y1 === y2) break;
      const e2 = 2 * err;
      if (e2 > -dy) { err -= dy; x1 += sx; }
      if (e2 < dx) { err += dx; y1 += sy; }
    }
  }
}
