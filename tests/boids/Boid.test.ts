/* eslint-env jest */

/**
 * Mock p5 and p5.Vector before importing Boid
 * This allows us to test Boid's force calculations without a DOM
 */
jest.mock('p5', () => {
  /**
   * MockVector - Simplified p5.Vector for testing
   * Implements all vector operations needed by Boid
   */
  class MockVector {
    x: number;
    y: number;

    constructor(x: number = 0, y: number = 0) {
      this.x = x;
      this.y = y;
    }

    /**
     * Add another vector to this one
     */
    add(v: MockVector | { x: number; y: number }): MockVector {
      this.x += v.x;
      this.y += v.y;
      return this;
    }

    /**
     * Subtract another vector from this one
     */
    sub(v: MockVector | { x: number; y: number }): MockVector {
      this.x -= v.x;
      this.y -= v.y;
      return this;
    }

    /**
     * Multiply this vector by a scalar
     */
    mult(n: number): MockVector {
      this.x *= n;
      this.y *= n;
      return this;
    }

    /**
     * Divide this vector by a scalar
     */
    div(n: number): MockVector {
      if (n !== 0) {
        this.x /= n;
        this.y /= n;
      }
      return this;
    }

    /**
     * Normalize to unit vector (magnitude 1)
     */
    normalize(): MockVector {
      const mag = Math.sqrt(this.x * this.x + this.y * this.y);
      if (mag > 0) {
        this.x /= mag;
        this.y /= mag;
      }
      return this;
    }

    /**
     * Limit the magnitude of this vector
     */
    limit(max: number): MockVector {
      const mag = Math.sqrt(this.x * this.x + this.y * this.y);
      if (mag > max) {
        this.x = (this.x / mag) * max;
        this.y = (this.y / mag) * max;
      }
      return this;
    }

    /**
     * Get the heading angle in radians
     */
    heading(): number {
      return Math.atan2(this.y, this.x);
    }

    /**
     * Get the magnitude of this vector
     */
    mag(): number {
      return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    /**
     * Copy this vector
     */
    copy(): MockVector {
      return new MockVector(this.x, this.y);
    }

    /**
     * Static method: distance between two vectors
     */
    static dist(v1: MockVector, v2: MockVector): number {
      const dx = v2.x - v1.x;
      const dy = v2.y - v1.y;
      return Math.sqrt(dx * dx + dy * dy);
    }

    /**
     * Static method: subtract v2 from v1
     */
    static sub(v1: MockVector, v2: MockVector): MockVector {
      return new MockVector(v1.x - v2.x, v1.y - v2.y);
    }

    /**
     * Static method: create a random 2D unit vector
     */
    static random2D(): MockVector {
      const angle = Math.random() * Math.PI * 2;
      return new MockVector(Math.cos(angle), Math.sin(angle));
    }
  }

  return {
    default: class p5 {},
    Vector: MockVector,
  };
});

import { Boid } from '../../src/boids/Boid';
import p5 from 'p5';

describe('Boid', () => {
  describe('Constructor', () => {
    it('should initialize with position', () => {
      const boid = new Boid(100, 200);
      expect(boid.position.x).toBe(100);
      expect(boid.position.y).toBe(200);
    });

    it('should initialize with random velocity', () => {
      const boid = new Boid(50, 50);
      // Random2D should give a unit vector
      expect(Math.abs(boid.velocity.mag() - 1)).toBeLessThan(0.01);
    });

    it('should initialize with zero acceleration', () => {
      const boid = new Boid(100, 100);
      expect(boid.acceleration.x).toBe(0);
      expect(boid.acceleration.y).toBe(0);
    });

    it('should initialize with default max_speed of 4', () => {
      const boid = new Boid(50, 50);
      expect(boid.max_speed).toBe(4);
    });

    it('should initialize with default max_force of 0.2', () => {
      const boid = new Boid(50, 50);
      expect(boid.max_force).toBe(0.2);
    });
  });

  describe('applyForce', () => {
    it('should add force to acceleration', () => {
      const boid = new Boid(100, 100);
      const force = new p5.Vector(1, 1);

      boid.applyForce(force);

      expect(boid.acceleration.x).toBeCloseTo(1);
      expect(boid.acceleration.y).toBeCloseTo(1);
    });

    it('should accumulate multiple forces', () => {
      const boid = new Boid(100, 100);
      const force1 = new p5.Vector(0.5, 0.5);
      const force2 = new p5.Vector(0.3, 0.7);

      boid.applyForce(force1);
      boid.applyForce(force2);

      expect(boid.acceleration.x).toBeCloseTo(0.8);
      expect(boid.acceleration.y).toBeCloseTo(1.2);
    });
  });

  describe('update', () => {
    it('should limit acceleration to max_force', () => {
      const boid = new Boid(100, 100);
      // Apply very large force
      const largeForce = new p5.Vector(100, 100);
      boid.applyForce(largeForce);

      boid.update();

      // After limiting, acceleration should not exceed max_force magnitude
      const accMag = boid.acceleration.mag();
      expect(accMag).toBeLessThanOrEqual(boid.max_force + 0.01);
    });

    it('should update velocity based on acceleration', () => {
      const boid = new Boid(100, 100);
      const force = new p5.Vector(0.1, 0);

      boid.applyForce(force);
      const oldVelocity = boid.velocity.copy();
      boid.update();

      // Velocity should increase in x direction
      expect(boid.velocity.x).toBeGreaterThan(oldVelocity.x);
    });

    it('should limit velocity to max_speed', () => {
      const boid = new Boid(100, 100);
      boid.velocity = new p5.Vector(100, 100);

      boid.update();

      const velMag = boid.velocity.mag();
      expect(velMag).toBeLessThanOrEqual(boid.max_speed + 0.01);
    });

    it('should update position based on velocity', () => {
      const boid = new Boid(100, 100);
      boid.velocity = new p5.Vector(1, 0);

      const oldX = boid.position.x;
      boid.update();

      expect(boid.position.x).toBeGreaterThan(oldX);
    });

    it('should reset acceleration to zero after update', () => {
      const boid = new Boid(100, 100);
      boid.applyForce(new p5.Vector(1, 1));

      boid.update();

      expect(Math.abs(boid.acceleration.x)).toBeLessThan(0.01);
      expect(Math.abs(boid.acceleration.y)).toBeLessThan(0.01);
    });
  });

  describe('separation', () => {
    it('should return zero force when no neighbors', () => {
      const boid = new Boid(100, 100);
      const force = boid.separation([boid], 100, 1.5);

      expect(force.x).toBe(0);
      expect(force.y).toBe(0);
    });

    it('should return zero force when neighbor is outside perception radius', () => {
      const boid1 = new Boid(0, 0);
      const boid2 = new Boid(500, 500); // Far away
      const force = boid1.separation([boid1, boid2], 100, 1.5);

      expect(force.x).toBe(0);
      expect(force.y).toBe(0);
    });

    it('should return non-zero force when neighbor is close', () => {
      const boid1 = new Boid(100, 100);
      const boid2 = new Boid(110, 100); // 10 units away
      const force = boid1.separation([boid1, boid2], 100, 1.5);

      expect(Math.abs(force.x) + Math.abs(force.y)).toBeGreaterThan(0);
    });

    it('should push away from nearby neighbor', () => {
      const boid1 = new Boid(100, 100);
      const boid2 = new Boid(120, 100); // To the right
      const force = boid1.separation([boid1, boid2], 100, 1.5);

      // Should push left (negative x)
      expect(force.x).toBeLessThan(0);
    });

    it('should weight force correctly', () => {
      const boid1 = new Boid(100, 100);
      const boid2 = new Boid(110, 100);

      const force1 = boid1.separation([boid1, boid2], 100, 1.0);
      const force2 = boid1.separation([boid1, boid2], 100, 2.0);

      // Double weight should roughly double the force
      expect(Math.abs(force2.x)).toBeGreaterThan(Math.abs(force1.x));
    });

    it('should average forces from multiple neighbors', () => {
      const boid = new Boid(100, 100);
      const neighbor1 = new Boid(110, 100); // Right
      const neighbor2 = new Boid(100, 110); // Down
      const neighbor3 = new Boid(90, 100); // Left

      const force = boid.separation([boid, neighbor1, neighbor2, neighbor3], 100, 1.5);

      // Result should be roughly balanced (close to center)
      // but not zero since they're pushing away
      expect(force.mag()).toBeGreaterThan(0);
    });
  });

  describe('alignment', () => {
    it('should return zero force when no neighbors', () => {
      const boid = new Boid(100, 100);
      const force = boid.alignment([boid], 100, 1.0);

      expect(force.x).toBe(0);
      expect(force.y).toBe(0);
    });

    it('should return zero force when neighbor is outside perception radius', () => {
      const boid1 = new Boid(0, 0);
      const boid2 = new Boid(500, 500);
      const force = boid1.alignment([boid1, boid2], 100, 1.0);

      expect(force.x).toBe(0);
      expect(force.y).toBe(0);
    });

    it('should steer towards average heading of neighbors', () => {
      const boid = new Boid(100, 100);
      boid.velocity = new p5.Vector(1, 0); // Moving right

      const neighbor = new Boid(110, 100);
      neighbor.velocity = new p5.Vector(0, 1); // Moving down

      const force = boid.alignment([boid, neighbor], 100, 1.0);

      // Should be non-zero (trying to average headings)
      expect(force.mag()).toBeGreaterThan(0);
    });

    it('should weight force correctly', () => {
      const boid = new Boid(100, 100);
      const neighbor = new Boid(110, 100);

      const force1 = boid.alignment([boid, neighbor], 100, 1.0);
      const force2 = boid.alignment([boid, neighbor], 100, 2.0);

      // Double weight should increase the force
      expect(force2.mag()).toBeGreaterThan(force1.mag());
    });

    it('should average velocity of multiple neighbors', () => {
      const boid = new Boid(100, 100);
      boid.velocity = new p5.Vector(1, 0);

      const neighbor1 = new Boid(110, 100);
      neighbor1.velocity = new p5.Vector(0, 1);

      const neighbor2 = new Boid(100, 110);
      neighbor2.velocity = new p5.Vector(-1, 0);

      const force = boid.alignment([boid, neighbor1, neighbor2], 100, 1.0);

      // Should have some force to align with the average
      expect(force.mag()).toBeGreaterThan(0);
    });
  });

  describe('cohesion', () => {
    it('should return zero force when no neighbors', () => {
      const boid = new Boid(100, 100);
      const force = boid.cohesion([boid], 100, 1.0);

      expect(force.x).toBe(0);
      expect(force.y).toBe(0);
    });

    it('should return zero force when neighbor is outside perception radius', () => {
      const boid1 = new Boid(0, 0);
      const boid2 = new Boid(500, 500);
      const force = boid1.cohesion([boid1, boid2], 100, 1.0);

      expect(force.x).toBe(0);
      expect(force.y).toBe(0);
    });

    it('should steer towards center of mass of neighbors', () => {
      const boid = new Boid(100, 100);
      const neighbor = new Boid(120, 100); // To the right

      const force = boid.cohesion([boid, neighbor], 100, 1.0);

      // Should steer right towards the neighbor
      expect(force.x).toBeGreaterThan(0);
    });

    it('should weight force correctly', () => {
      const boid = new Boid(100, 100);
      const neighbor = new Boid(120, 100);

      const force1 = boid.cohesion([boid, neighbor], 100, 1.0);
      const force2 = boid.cohesion([boid, neighbor], 100, 2.0);

      // Double weight should increase the force
      expect(force2.mag()).toBeGreaterThan(force1.mag());
    });

    it('should seek towards center of multiple neighbors', () => {
      const boid = new Boid(0, 0);
      const neighbor1 = new Boid(100, 0);
      const neighbor2 = new Boid(100, 100);

      const force = boid.cohesion([boid, neighbor1, neighbor2], 200, 1.0);

      // Center of mass is around (66, 33), so force should be towards positive x and y
      expect(force.mag()).toBeGreaterThan(0);
    });
  });

  describe('wrapAround', () => {
    it('should wrap boid from right edge to left', () => {
      const boid = new Boid(951, 100); // Just beyond the boundary
      boid.wrapAround(950, 600);

      expect(boid.position.x).toBe(0);
    });

    it('should wrap boid from left edge to right', () => {
      const boid = new Boid(-10, 100);
      boid.wrapAround(950, 600);

      expect(boid.position.x).toBe(950);
    });

    it('should wrap boid from bottom edge to top', () => {
      const boid = new Boid(100, 610);
      boid.wrapAround(950, 600);

      expect(boid.position.y).toBe(0);
    });

    it('should wrap boid from top edge to bottom', () => {
      const boid = new Boid(100, -10);
      boid.wrapAround(950, 600);

      expect(boid.position.y).toBe(600);
    });

    it('should not wrap boids inside bounds', () => {
      const boid = new Boid(400, 300);
      boid.wrapAround(950, 600);

      expect(boid.position.x).toBe(400);
      expect(boid.position.y).toBe(300);
    });

    it('should handle corner wrapping (x and y)', () => {
      const boid = new Boid(960, -5);
      boid.wrapAround(950, 600);

      expect(boid.position.x).toBe(0); // Wrapped x
      expect(boid.position.y).toBe(600); // Wrapped y
    });
  });

  describe('Integration: Force calculations in sequence', () => {
    it('should apply all three forces to create emergent behavior', () => {
      const boid = new Boid(500, 300);
      boid.velocity = new p5.Vector(0, 0);

      const neighbors = [new Boid(510, 300), new Boid(520, 310), new Boid(500, 320)];

      const sep = boid.separation([boid, ...neighbors], 100, 1.5);
      const align = boid.alignment([boid, ...neighbors], 100, 1.0);
      const cohesion = boid.cohesion([boid, ...neighbors], 100, 1.0);

      // All should be non-zero in this scenario
      expect(sep.mag()).toBeGreaterThan(0);
      expect(align.mag()).toBeGreaterThan(0);
      expect(cohesion.mag()).toBeGreaterThan(0);
    });

    it('should allow tuning behavior through force weights', () => {
      const boid = new Boid(500, 300);
      const neighbors = [new Boid(510, 300), new Boid(520, 310)];

      // High separation weight
      const highSep = boid.separation([boid, ...neighbors], 100, 5.0);
      const lowSep = boid.separation([boid, ...neighbors], 100, 0.1);

      expect(highSep.mag()).toBeGreaterThan(lowSep.mag());
    });
  });

  describe('Edge cases', () => {
    it('should handle boid at same position as neighbor', () => {
      const boid = new Boid(100, 100);
      const neighbor = new Boid(100, 100); // Exact same position

      expect(() => {
        boid.separation([boid, neighbor], 100, 1.5);
      }).not.toThrow();
    });

    it('should handle very high perception radius', () => {
      const boid = new Boid(0, 0);
      const neighbor = new Boid(1000, 1000);

      const force = boid.separation([boid, neighbor], 10000, 1.5);

      // Should consider the far-away neighbor
      expect(force.mag()).toBeGreaterThan(0);
    });

    it('should handle zero force weight', () => {
      const boid = new Boid(100, 100);
      const neighbor = new Boid(110, 100);

      const force = boid.separation([boid, neighbor], 100, 0);

      expect(Math.abs(force.x)).toBeLessThan(0.0001);
      expect(Math.abs(force.y)).toBeLessThan(0.0001);
    });

    it('should handle negative force weight', () => {
      const boid = new Boid(100, 100);
      const neighbor = new Boid(110, 100);

      const forcePosWeight = boid.separation([boid, neighbor], 100, 1.5);
      const forceNegWeight = boid.separation([boid, neighbor], 100, -1.5);

      // Negative weight should reverse direction
      expect(forcePosWeight.x).toBeCloseTo(-forceNegWeight.x, 1);
    });

    it('should handle very large boid arrays without crashing', () => {
      const boid = new Boid(500, 300);
      const neighbors: Boid[] = [];

      for (let i = 0; i < 1000; i++) {
        neighbors.push(new Boid(Math.random() * 950, Math.random() * 600));
      }

      expect(() => {
        boid.separation([boid, ...neighbors], 100, 1.5);
        boid.alignment([boid, ...neighbors], 100, 1.0);
        boid.cohesion([boid, ...neighbors], 100, 1.0);
      }).not.toThrow();
    });
  });
});
