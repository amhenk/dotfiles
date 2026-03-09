import { Point3D, Shape } from "../types";

export class GameOfLife implements Shape {
  name = "game_of_life";
  private grid: boolean[][];
  private width = 30;
  private height = 30;
  private angleX = 0.4;
  private angleY = 0;
  private angleZ = 0;
  private generation = 0;
  private tickCounter = 0;

  constructor() {
    this.grid = Array.from({ length: this.height }, () =>
      Array.from({ length: this.width }, () => Math.random() > 0.8)
    );
  }

  tick(isWorking: boolean) {
    this.tickCounter++;
    
    // Rotate the "board"
    this.angleY += 0.01;
    this.angleZ += 0.005;

    // Simulation speed: faster when working
    const speed = isWorking ? 2 : 5;
    if (this.tickCounter % speed !== 0) return;

    const nextGrid = Array.from({ length: this.height }, () =>
      Array.from({ length: this.width }, () => false)
    );

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const neighbors = this.countNeighbors(x, y);
        const alive = this.grid[y][x];

        if (alive && (neighbors === 2 || neighbors === 3)) {
          nextGrid[y][x] = true;
        } else if (!alive && neighbors === 3) {
          nextGrid[y][x] = true;
        }
      }
    }

    // When working, occasionally spark new life
    if (isWorking && Math.random() > 0.7) {
      const rx = Math.floor(Math.random() * this.width);
      const ry = Math.floor(Math.random() * this.height);
      nextGrid[ry][rx] = true;
    }

    // Reset if it becomes too stagnant or empty
    let aliveCount = 0;
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) if (nextGrid[y][x]) aliveCount++;
    }

    if (aliveCount < 5 || (this.generation > 200 && Math.random() > 0.99)) {
      this.grid = Array.from({ length: this.height }, () =>
        Array.from({ length: this.width }, () => Math.random() > 0.8)
      );
      this.generation = 0;
    } else {
      this.grid = nextGrid;
      this.generation++;
    }
  }

  private countNeighbors(x: number, y: number): number {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue;
        const nx = (x + i + this.width) % this.width;
        const ny = (y + j + this.height) % this.height;
        if (this.grid[ny][nx]) count++;
      }
    }
    return count;
  }

  getVertices(): Point3D[] {
    const vertices: Point3D[] = [];
    const cellSize = 0.1;
    const offsetX = -(this.width * cellSize) / 2;
    const offsetY = -(this.height * cellSize) / 2;

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (this.grid[y][x]) {
          const vx = offsetX + x * cellSize;
          const vy = offsetY + y * cellSize;
          // Each alive cell is a small diamond/square
          vertices.push(this.rotate({ x: vx, y: vy, z: 0 }));
          vertices.push(this.rotate({ x: vx + cellSize * 0.8, y: vy, z: 0 }));
          vertices.push(this.rotate({ x: vx + cellSize * 0.8, y: vy + cellSize * 0.8, z: 0 }));
          vertices.push(this.rotate({ x: vx, y: vy + cellSize * 0.8, z: 0 }));
        }
      }
    }
    return vertices;
  }

  getEdges(): [number, number][] {
    const edges: [number, number][] = [];
    let vertexOffset = 0;
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (this.grid[y][x]) {
          edges.push([vertexOffset, vertexOffset + 1]);
          edges.push([vertexOffset + 1, vertexOffset + 2]);
          edges.push([vertexOffset + 2, vertexOffset + 3]);
          edges.push([vertexOffset + 3, vertexOffset]);
          vertexOffset += 4;
        }
      }
    }
    return edges;
  }

  private rotate(p: Point3D): Point3D {
    let { x, y, z } = p;
    // Rotate X
    let ny = y * Math.cos(this.angleX) - z * Math.sin(this.angleX);
    let nz = y * Math.sin(this.angleX) + z * Math.cos(this.angleX);
    y = ny; z = nz;
    // Rotate Y
    let nx = x * Math.cos(this.angleY) + z * Math.sin(this.angleY);
    nz = -x * Math.sin(this.angleY) + z * Math.cos(this.angleY);
    x = nx; z = nz;
    // Rotate Z
    nx = x * Math.cos(this.angleZ) - y * Math.sin(this.angleZ);
    ny = x * Math.sin(this.angleZ) + y * Math.cos(this.angleZ);
    x = nx; y = ny;
    return { x, y, z };
  }
}
