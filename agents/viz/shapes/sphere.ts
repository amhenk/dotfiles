import { Point3D, Shape } from "../types";

export class Sphere implements Shape {
  name = "sphere";
  private angleX = 0;
  private angleY = 0;
  private vertices: Point3D[] = [];
  private edges: [number, number][] = [];
  private octants: number[] = []; // Maps vertex index to octant index (0-7)
  private expansion = 0;
  
  // Core vertices/edges
  private coreVertices: Point3D[] = [];
  private coreEdges: [number, number][] = [];

  constructor() {
    const radius = 1.2;
    const latLines = 12;
    const lonLines = 18;

    // Generate Sphere
    for (let i = 0; i <= latLines; i++) {
      const lat = (i / latLines) * Math.PI;
      for (let j = 0; j < lonLines; j++) {
        const lon = (j / lonLines) * Math.PI * 2;
        const x = radius * Math.sin(lat) * Math.cos(lon);
        const y = radius * Math.sin(lat) * Math.sin(lon);
        const z = radius * Math.cos(lat);
        
        this.vertices.push({ x, y, z });
        
        // Determine octant (0-7)
        let octant = 0;
        if (x < 0) octant |= 1;
        if (y < 0) octant |= 2;
        if (z < 0) octant |= 4;
        this.octants.push(octant);

        const current = i * lonLines + j;
        // Edge to next longitude point
        this.edges.push([current, i * lonLines + ((j + 1) % lonLines)]);
        // Edge to next latitude point
        if (i < latLines) {
          this.edges.push([current, (i + 1) * lonLines + j]);
        }
      }
    }

    // Generate Core (Small Octahedron)
    const coreSize = 0.3;
    this.coreVertices = [
      { x: coreSize, y: 0, z: 0 }, { x: -coreSize, y: 0, z: 0 },
      { x: 0, y: coreSize, z: 0 }, { x: 0, y: -coreSize, z: 0 },
      { x: 0, y: 0, z: coreSize }, { x: 0, y: 0, z: -coreSize },
    ];
    this.coreEdges = [
      [0, 2], [0, 3], [0, 4], [0, 5],
      [1, 2], [1, 3], [1, 4], [1, 5],
      [2, 4], [4, 3], [3, 5], [5, 2],
    ];
  }

  tick(isWorking: boolean) {
    const spinSpeed = isWorking ? 0.1 : 0.03;
    this.angleX += spinSpeed;
    this.angleY += spinSpeed * 0.7;

    const targetExpansion = isWorking ? 0.6 : 0;
    this.expansion += (targetExpansion - this.expansion) * 0.1;
  }

  getVertices(): Point3D[] {
    const allVertices: Point3D[] = [];

    // Transform shell octants
    this.vertices.forEach((v, i) => {
      let { x, y, z } = v;
      const oct = this.octants[i];
      
      // Calculate octant offset vector
      const offsetX = (oct & 1 ? -1 : 1) * this.expansion;
      const offsetY = (oct & 2 ? -1 : 1) * this.expansion;
      const offsetZ = (oct & 4 ? -1 : 1) * this.expansion;

      x += offsetX; y += offsetY; z += offsetZ;
      allVertices.push(this.rotate({ x, y, z }));
    });

    // Transform core
    this.coreVertices.forEach(v => {
      // Core spins faster and opposite
      const coreRot = this.rotate({ x: v.x, y: v.y, z: v.z }, true);
      allVertices.push(coreRot);
    });

    return allVertices;
  }

  private rotate(p: Point3D, fast = false): Point3D {
    let { x, y, z } = p;
    const ax = fast ? this.angleX * 1.5 : this.angleX;
    const ay = fast ? -this.angleY * 2 : this.angleY;

    // Rotate X
    let ny = y * Math.cos(ax) - z * Math.sin(ax);
    let nz = y * Math.sin(ax) + z * Math.cos(ax);
    y = ny; z = nz;
    // Rotate Y
    let nx = x * Math.cos(ay) + z * Math.sin(ay);
    nz = -x * Math.sin(ay) + z * Math.cos(ay);
    x = nx; z = nz;
    
    return { x, y, z };
  }

  getEdges(): [number, number][] {
    const coreOffset = this.vertices.length;
    const allEdges = [...this.edges];
    
    // Add core edges with index offset
    this.coreEdges.forEach(([i, j]) => {
      allEdges.push([i + coreOffset, j + coreOffset]);
    });

    return allEdges;
  }
}
