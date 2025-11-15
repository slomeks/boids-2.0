import { Boid } from './Boid';

export class Simulation {
  boids: Boid[] = [];
  width: number;
  height: number;
  separation_force: number = 1.5;
  alignment_force: number = 1.0;
  cohesion_force: number = 1.0;
  perception_radius: number = 100;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  /**
   * Add a boid to the simulation
   */
  addBoid(boid: Boid): void {
    this.boids.push(boid);
  }

  /**
   * Remove a boid from the simulation
   */
  removeBoid(boid: Boid): void {
    const index = this.boids.indexOf(boid);
    if (index > -1) {
      this.boids.splice(index, 1);
    }
  }

  /**
   * Update all boids: apply forces, update positions, wrap screen
   */
  update(): void {
    for (const boid of this.boids) {
      // Calculate all three forces
      const sep = boid.separation(this.boids, this.perception_radius, this.separation_force);
      const align = boid.alignment(this.boids, this.perception_radius, this.alignment_force);
      const cohesion = boid.cohesion(this.boids, this.perception_radius, this.cohesion_force);

      // Apply forces
      boid.applyForce(sep);
      boid.applyForce(align);
      boid.applyForce(cohesion);

      // Update physics
      boid.update();

      // Handle screen wrapping
      boid.wrapAround(this.width, this.height);
    }
  }

  /**
   * Get all boids (for rendering)
   */
  getBoids(): Boid[] {
    return this.boids;
  }

  /**
   * Clear all boids
   */
  clear(): void {
    this.boids = [];
  }

  /**
   * Get number of boids
   */
  getCount(): number {
    return this.boids.length;
  }
}
