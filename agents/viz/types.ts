import { Theme } from "@mariozechner/pi-coding-agent";

export type Point3D = { x: number; y: number; z: number };
export type Point2D = { x: number; y: number };

export interface Shape {
  name: string;
  tick(isWorking: boolean): void;
  getVertices(): Point3D[];
  getEdges(): [number, number][];
}

export interface VizConfig {
  shape: string;
  speedMultiplier: number;
}
