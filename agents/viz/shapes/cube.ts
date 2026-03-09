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

  private vertices: Point3D[] = [
    { x: -1, y: -1, z: -1 }, { x: 1, y: -1, z: -1 },
    { x: 1, y: 1, z: -1 }, { x: -1, y: 1, z: -1 },
    { x: -1, y: -1, z: 1 }, { x: 1, y: -1, z: 1 },
    { x: 1, y: 1, z: 1 }, { x: -1, y: 1, z: 1 },
  ];
  private edges: [number, number][] = [
    [0, 1], [1, 2], [2, 3], [3, 0],
    [4, 5], [5, 6], [6, 7], [7, 4],
    [0, 4], [1, 5], [2, 6], [3, 7],
  ];

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
