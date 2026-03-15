import { Point3D, Shape } from "../types";

export class Torus implements Shape {
  name = "torus";
  private angleX = 0;
  private angleY = 0;
  private angleZ = 0;
  private vertices: Point3D[] = [];
  private edges: [number, number][] = [];
  private pulse = 0;

  constructor() {
    const R = 1.2; // Major radius
    const r = 0.5; // Minor radius
    const rings = 24;
    const pointsPerRing = 12;

    for (let i = 0; i < rings; i++) {
      const phi = (i / rings) * Math.PI * 2;
      for (let j = 0; j < pointsPerRing; j++) {
        const theta = (j / pointsPerRing) * Math.PI * 2;
        const x = (R + r * Math.cos(theta)) * Math.cos(phi);
        const y = (R + r * Math.cos(theta)) * Math.sin(phi);
        const z = r * Math.sin(theta);
        this.vertices.push({ x, y, z });

        // Edge to next point in same ring
        const nextInRing = i * pointsPerRing + ((j + 1) % pointsPerRing);
        this.edges.push([i * pointsPerRing + j, nextInRing]);

        // Edge to corresponding point in next ring
        const nextRingPoint = ((i + 1) % rings) * pointsPerRing + j;
        this.edges.push([i * pointsPerRing + j, nextRingPoint]);
      }
    }
  }

  tick(isWorking: boolean) {
    const speed = isWorking ? 0.08 : 0.02;
    this.angleX += speed;
    this.angleY += speed * 0.6;
    this.angleZ += speed * 0.3;

    if (isWorking) {
      this.pulse += 0.1;
    } else {
      this.pulse *= 0.95; // Shrink back
    }
  }

  getVertices(): Point3D[] {
    const scale = 1 + Math.sin(this.pulse) * 0.1;
    return this.vertices.map((v) => {
      let { x, y, z } = v;
      x *= scale; y *= scale; z *= scale;

      // Rotate
      let ny = y * Math.cos(this.angleX) - z * Math.sin(this.angleX);
      let nz = y * Math.sin(this.angleX) + z * Math.cos(this.angleX);
      y = ny; z = nz;
      let nx = x * Math.cos(this.angleY) + z * Math.sin(this.angleY);
      nz = -x * Math.sin(this.angleY) + z * Math.cos(this.angleY);
      x = nx; z = nz;
      nx = x * Math.cos(this.angleZ) - y * Math.sin(this.angleZ);
      ny = x * Math.sin(this.angleZ) + y * Math.cos(this.angleZ);
      x = nx; y = ny;
      return { x, y, z };
    });
  }

  getEdges(): [number, number][] {
    return this.edges;
  }
}
