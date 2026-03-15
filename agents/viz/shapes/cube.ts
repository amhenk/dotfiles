import { Point3D, Shape } from "../types";

export class Cube implements Shape {
  name = "cube";
  private angleX = 0.5;
  private angleY = 0.5;
  private angleZ = 0.1;
  private velocityX = 0.05;
  private velocityY = 0.03;
  private velocityZ = 0.02;
  private targetVelocityX = 0.05;
  private targetVelocityY = 0.03;
  private targetVelocityZ = 0.02;

  private vertices: Point3D[] = [];
  private edges: [number, number][] = [];

  constructor() {
    // Generate a subdivided cube for better noise displacement
    const subdivisions = 4;
    for (let face = 0; face < 6; face++) {
      for (let i = 0; i <= subdivisions; i++) {
        for (let j = 0; j <= subdivisions; j++) {
          const u = (i / subdivisions) * 2 - 1;
          const v = (j / subdivisions) * 2 - 1;
          let x, y, z;
          if (face === 0) { x = u; y = v; z = 1; }
          else if (face === 1) { x = u; y = v; z = -1; }
          else if (face === 2) { x = u; y = 1; z = v; }
          else if (face === 3) { x = u; y = -1; z = v; }
          else if (face === 4) { x = 1; y = u; z = v; }
          else { x = -1; y = u; z = v; }
          
          const vIdx = this.vertices.length;
          this.vertices.push({ x, y, z });

          if (i < subdivisions) {
            this.edges.push([vIdx, vIdx + (subdivisions + 1)]);
          }
          if (j < subdivisions) {
            this.edges.push([vIdx, vIdx + 1]);
          }
        }
      }
    }
  }

  tick(isWorking: boolean) {
    if (Math.random() < 0.02) {
      const baseSpeed = isWorking ? 0.15 : 0.03;
      const variance = isWorking ? 0.1 : 0.02;
      this.targetVelocityX = (Math.random() - 0.5) * variance + (Math.random() > 0.5 ? baseSpeed : -baseSpeed);
      this.targetVelocityY = (Math.random() - 0.5) * variance + (Math.random() > 0.5 ? baseSpeed : -baseSpeed);
      this.targetVelocityZ = (Math.random() - 0.5) * variance + (Math.random() > 0.5 ? baseSpeed : -baseSpeed);
    }

    const lerp = 0.05;
    this.velocityX += (this.targetVelocityX - this.velocityX) * lerp;
    this.velocityY += (this.targetVelocityY - this.velocityY) * lerp;
    this.velocityZ += (this.targetVelocityZ - this.velocityZ) * lerp;

    this.angleX += this.velocityX;
    this.angleY += this.velocityY;
    this.angleZ += this.velocityZ;
  }

  getVertices(): Point3D[] {
    return this.vertices.map((v) => {
      let { x, y, z } = v;
      // Apply rotations
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
