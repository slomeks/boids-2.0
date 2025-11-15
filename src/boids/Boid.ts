import p5 from 'p5';

export class Boid {
  position: p5.Vector;
  velocity: p5.Vector;
  acceleration: p5.Vector;
  max_speed: number;
  max_force: number;

  constructor(x: number, y: number) {
    this.position = new p5.Vector(x, y);
    this.velocity = p5.Vector.random2D();
    this.acceleration = new p5.Vector(0, 0);
    this.max_speed = 4;
    this.max_force = 0.2;
  }

  /**
   * Apply a force to the boid's acceleration
   * F = ma, so a += F/m (assuming mass = 1)
   */
  applyForce(force: p5.Vector): void {
    this.acceleration.add(force);
  }

  /**
   * Update position and velocity based on acceleration
   * Velocity changes by acceleration, position changes by velocity
   */
  update(): void {
    // Limit acceleration
    this.acceleration.limit(this.max_force);

    // Update velocity
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.max_speed);

    // Update position
    this.position.add(this.velocity);

    // Reset acceleration to 0 each cycle
    this.acceleration.mult(0);
  }

  /**
   * Draw the boid on the canvas
   */
  display(p: p5): void {
    // Triangle pointing in direction of velocity
    const angle = this.velocity.heading();
    const size = 8;

    p.push();
    p.translate(this.position.x, this.position.y);
    p.rotate(angle);
    p.fill(0, 100, 200);
    p.stroke(0);
    p.triangle(size, 0, -size, -size / 2, -size, size / 2);
    p.pop();
  }

  /**
   * Separation: steer to avoid crowding local flockmates
   */
  separation(boids: Boid[], perception_radius: number, force_weight: number): p5.Vector {
    const steer = new p5.Vector(0, 0);
    let count = 0;

    for (const other of boids) {
      const d = p5.Vector.dist(this.position, other.position);

      // If the distance is within the perception radius and not the same boid
      if (d > 0 && d < perception_radius) {
        // Calculate vector pointing away from neighbor
        const diff = p5.Vector.sub(this.position, other.position);
        diff.normalize();
        diff.mult(1 / d); // Weight by distance
        steer.add(diff);
        count++;
      }
    }

    // Average
    if (count > 0) {
      steer.div(count);
      steer.normalize();
      steer.mult(this.max_speed);
      steer.sub(this.velocity);
      steer.limit(this.max_force);
    }

    return steer.mult(force_weight);
  }

  /**
   * Alignment: steer towards the average heading of local flockmates
   */
  alignment(boids: Boid[], perception_radius: number, force_weight: number): p5.Vector {
    const avg_velocity = new p5.Vector(0, 0);
    let count = 0;

    for (const other of boids) {
      const d = p5.Vector.dist(this.position, other.position);

      if (d > 0 && d < perception_radius) {
        avg_velocity.add(other.velocity);
        count++;
      }
    }

    if (count > 0) {
      avg_velocity.div(count);
      avg_velocity.normalize();
      avg_velocity.mult(this.max_speed);
      const steer = p5.Vector.sub(avg_velocity, this.velocity);
      steer.limit(this.max_force);
      return steer.mult(force_weight);
    }

    return new p5.Vector(0, 0);
  }

  /**
   * Cohesion: steer to move toward the average location of local flockmates
   */
  cohesion(boids: Boid[], perception_radius: number, force_weight: number): p5.Vector {
    const center_of_mass = new p5.Vector(0, 0);
    let count = 0;

    for (const other of boids) {
      const d = p5.Vector.dist(this.position, other.position);

      if (d > 0 && d < perception_radius) {
        center_of_mass.add(other.position);
        count++;
      }
    }

    if (count > 0) {
      center_of_mass.div(count);
      // Steer towards the location
      return this.seek(center_of_mass, force_weight);
    }

    return new p5.Vector(0, 0);
  }

  /**
   * A method that calculates a steering force towards a target
   */
  private seek(target: p5.Vector, force_weight: number): p5.Vector {
    const desired = p5.Vector.sub(target, this.position);
    desired.normalize();
    desired.mult(this.max_speed);
    const steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.max_force);
    return steer.mult(force_weight);
  }

  /**
   * Check if boid is off-screen and wrap to opposite side
   */
  wrapAround(width: number, height: number): void {
    if (this.position.x > width) this.position.x = 0;
    if (this.position.x < 0) this.position.x = width;
    if (this.position.y > height) this.position.y = 0;
    if (this.position.y < 0) this.position.y = height;
  }
}
