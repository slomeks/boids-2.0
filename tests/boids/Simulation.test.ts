/* eslint-env jest */
import { Simulation } from '../../src/boids/Simulation';
import { Boid } from '../../src/boids/Boid';

/**
 * Mock Boid class - tracks method calls without requiring p5
 * We use 'as any' for return values because Simulation never inspects
 * the vector properties; it only passes them through to applyForce()
 */
class MockBoid {
  separation = jest.fn().mockReturnValue({ x: 0.1, y: 0.1 } as any);
  alignment = jest.fn().mockReturnValue({ x: 0.2, y: 0.2 } as any);
  cohesion = jest.fn().mockReturnValue({ x: 0.3, y: 0.3 } as any);
  applyForce = jest.fn();
  update = jest.fn();
  wrapAround = jest.fn();
}

/**
 * Helper to create a mock boid
 */
const createMockBoid = (): MockBoid => new MockBoid();

describe('Simulation', () => {
  let simulation: Simulation;

  beforeEach(() => {
    simulation = new Simulation(800, 600);
  });

  describe('Constructor', () => {
    it('should initialize with correct dimensions', () => {
      expect(simulation.width).toBe(800);
      expect(simulation.height).toBe(600);
    });

    it('should initialize with default force parameters', () => {
      expect(simulation.separation_force).toBe(1.5);
      expect(simulation.alignment_force).toBe(1.0);
      expect(simulation.cohesion_force).toBe(1.0);
    });

    it('should initialize with default perception radius', () => {
      expect(simulation.perception_radius).toBe(100);
    });

    it('should start with empty boid array', () => {
      expect(simulation.getBoids().length).toBe(0);
    });
  });

  describe('addBoid', () => {
    it('should add a boid to the simulation', () => {
      const mockBoid = createMockBoid() as unknown as Boid;
      simulation.addBoid(mockBoid);

      expect(simulation.getCount()).toBe(1);
      expect(simulation.getBoids()[0]).toBe(mockBoid);
    });

    it('should add multiple boids', () => {
      const boid1 = createMockBoid() as unknown as Boid;
      const boid2 = createMockBoid() as unknown as Boid;
      const boid3 = createMockBoid() as unknown as Boid;

      simulation.addBoid(boid1);
      simulation.addBoid(boid2);
      simulation.addBoid(boid3);

      expect(simulation.getCount()).toBe(3);
    });
  });

  describe('removeBoid', () => {
    it('should remove a boid from the simulation', () => {
      const mockBoid = createMockBoid() as unknown as Boid;
      simulation.addBoid(mockBoid);

      expect(simulation.getCount()).toBe(1);

      simulation.removeBoid(mockBoid);

      expect(simulation.getCount()).toBe(0);
    });

    it('should remove only the specified boid', () => {
      const boid1 = createMockBoid() as unknown as Boid;
      const boid2 = createMockBoid() as unknown as Boid;
      const boid3 = createMockBoid() as unknown as Boid;

      simulation.addBoid(boid1);
      simulation.addBoid(boid2);
      simulation.addBoid(boid3);

      simulation.removeBoid(boid2);

      expect(simulation.getCount()).toBe(2);
      expect(simulation.getBoids()).toContain(boid1);
      expect(simulation.getBoids()).toContain(boid3);
      expect(simulation.getBoids()).not.toContain(boid2);
    });

    it('should not crash if boid does not exist', () => {
      const mockBoid = createMockBoid() as unknown as Boid;
      const otherBoid = createMockBoid() as unknown as Boid;

      simulation.addBoid(mockBoid);

      expect(() => simulation.removeBoid(otherBoid)).not.toThrow();
      expect(simulation.getCount()).toBe(1);
    });
  });

  describe('clear', () => {
    it('should remove all boids', () => {
      const boid1 = createMockBoid() as unknown as Boid;
      const boid2 = createMockBoid() as unknown as Boid;

      simulation.addBoid(boid1);
      simulation.addBoid(boid2);

      expect(simulation.getCount()).toBe(2);

      simulation.clear();

      expect(simulation.getCount()).toBe(0);
      expect(simulation.getBoids().length).toBe(0);
    });
  });

  describe('getCount', () => {
    it('should return 0 for empty simulation', () => {
      expect(simulation.getCount()).toBe(0);
    });

    it('should return correct count of boids', () => {
      for (let i = 0; i < 5; i++) {
        simulation.addBoid(createMockBoid() as unknown as Boid);
      }

      expect(simulation.getCount()).toBe(5);
    });
  });

  describe('getBoids', () => {
    it('should return empty array initially', () => {
      expect(simulation.getBoids()).toEqual([]);
    });

    it('should return array of all boids', () => {
      const boid1 = createMockBoid() as unknown as Boid;
      const boid2 = createMockBoid() as unknown as Boid;

      simulation.addBoid(boid1);
      simulation.addBoid(boid2);

      const boids = simulation.getBoids();
      expect(boids).toHaveLength(2);
      expect(boids[0]).toBe(boid1);
      expect(boids[1]).toBe(boid2);
    });
  });

  describe('update', () => {
    it('should not crash with empty simulation', () => {
      expect(() => simulation.update()).not.toThrow();
    });

    it('should call separation on each boid with correct parameters', () => {
      const mockBoid = createMockBoid() as unknown as Boid;
      simulation.addBoid(mockBoid);

      simulation.update();

      expect(mockBoid.separation).toHaveBeenCalledWith(
        [mockBoid],
        simulation.perception_radius,
        simulation.separation_force
      );
    });

    it('should call alignment on each boid with correct parameters', () => {
      const mockBoid = createMockBoid() as unknown as Boid;
      simulation.addBoid(mockBoid);

      simulation.update();

      expect(mockBoid.alignment).toHaveBeenCalledWith(
        [mockBoid],
        simulation.perception_radius,
        simulation.alignment_force
      );
    });

    it('should call cohesion on each boid with correct parameters', () => {
      const mockBoid = createMockBoid() as unknown as Boid;
      simulation.addBoid(mockBoid);

      simulation.update();

      expect(mockBoid.cohesion).toHaveBeenCalledWith(
        [mockBoid],
        simulation.perception_radius,
        simulation.cohesion_force
      );
    });

    it('should apply forces in correct order: separation, alignment, cohesion', () => {
      const mockBoid = createMockBoid() as unknown as Boid;
      const callOrder: string[] = [];

      mockBoid.applyForce = jest.fn(() => {
        callOrder.push('applyForce');
      });
      mockBoid.separation = jest.fn(() => {
        callOrder.push('separation');
        return { x: 0.1, y: 0.1 } as any;
      });
      mockBoid.alignment = jest.fn(() => {
        callOrder.push('alignment');
        return { x: 0.2, y: 0.2 } as any;
      });
      mockBoid.cohesion = jest.fn(() => {
        callOrder.push('cohesion');
        return { x: 0.3, y: 0.3 } as any;
      });

      simulation.addBoid(mockBoid);
      simulation.update();

      // Verify order: calculate all forces first, then apply all, then update
      expect(callOrder.slice(0, 3)).toEqual(['separation', 'alignment', 'cohesion']);
      // Then applyForce called 3 times
      expect(callOrder.slice(3, 6)).toEqual(['applyForce', 'applyForce', 'applyForce']);
    });

    it('should call applyForce three times per boid (sep, align, cohesion)', () => {
      const mockBoid = createMockBoid() as unknown as Boid;
      simulation.addBoid(mockBoid);

      simulation.update();

      expect(mockBoid.applyForce).toHaveBeenCalledTimes(3);
    });

    it('should call update on each boid after forces applied', () => {
      const mockBoid = createMockBoid() as unknown as Boid;
      const callOrder: string[] = [];

      mockBoid.applyForce = jest.fn(() => {
        callOrder.push('applyForce');
      });
      mockBoid.update = jest.fn(() => {
        callOrder.push('update');
      });

      simulation.addBoid(mockBoid);
      simulation.update();

      // Verify update is called after applyForce
      const applyForceIndex = callOrder.lastIndexOf('applyForce');
      const updateIndex = callOrder.indexOf('update');
      expect(updateIndex).toBeGreaterThan(applyForceIndex);
    });

    it('should call wrapAround with canvas dimensions', () => {
      const mockBoid = createMockBoid() as unknown as Boid;
      simulation.addBoid(mockBoid);

      simulation.update();

      expect(mockBoid.wrapAround).toHaveBeenCalledWith(simulation.width, simulation.height);
    });

    it('should update all boids when multiple boids present', () => {
      const boid1 = createMockBoid() as unknown as Boid;
      const boid2 = createMockBoid() as unknown as Boid;
      const boid3 = createMockBoid() as unknown as Boid;

      simulation.addBoid(boid1);
      simulation.addBoid(boid2);
      simulation.addBoid(boid3);

      simulation.update();

      expect(boid1.separation).toHaveBeenCalled();
      expect(boid2.separation).toHaveBeenCalled();
      expect(boid3.separation).toHaveBeenCalled();

      expect(boid1.update).toHaveBeenCalled();
      expect(boid2.update).toHaveBeenCalled();
      expect(boid3.update).toHaveBeenCalled();

      expect(boid1.wrapAround).toHaveBeenCalled();
      expect(boid2.wrapAround).toHaveBeenCalled();
      expect(boid3.wrapAround).toHaveBeenCalled();
    });

    it('should pass all boids to force calculation methods', () => {
      const boid1 = createMockBoid() as unknown as Boid;
      const boid2 = createMockBoid() as unknown as Boid;

      simulation.addBoid(boid1);
      simulation.addBoid(boid2);

      simulation.update();

      // Each boid should receive the full array of all boids
      expect(boid1.separation).toHaveBeenCalledWith(
        [boid1, boid2],
        expect.any(Number),
        expect.any(Number)
      );
      expect(boid2.separation).toHaveBeenCalledWith(
        [boid1, boid2],
        expect.any(Number),
        expect.any(Number)
      );
    });
  });

  describe('Force parameters', () => {
    it('should allow modifying separation_force', () => {
      simulation.separation_force = 2.5;
      const mockBoid = createMockBoid() as unknown as Boid;
      simulation.addBoid(mockBoid);

      simulation.update();

      expect(mockBoid.separation).toHaveBeenCalledWith(expect.any(Array), expect.any(Number), 2.5);
    });

    it('should allow modifying alignment_force', () => {
      simulation.alignment_force = 0.5;
      const mockBoid = createMockBoid() as unknown as Boid;
      simulation.addBoid(mockBoid);

      simulation.update();

      expect(mockBoid.alignment).toHaveBeenCalledWith(expect.any(Array), expect.any(Number), 0.5);
    });

    it('should allow modifying cohesion_force', () => {
      simulation.cohesion_force = 2.0;
      const mockBoid = createMockBoid() as unknown as Boid;
      simulation.addBoid(mockBoid);

      simulation.update();

      expect(mockBoid.cohesion).toHaveBeenCalledWith(expect.any(Array), expect.any(Number), 2.0);
    });

    it('should allow modifying perception_radius', () => {
      simulation.perception_radius = 150;
      const mockBoid = createMockBoid() as unknown as Boid;
      simulation.addBoid(mockBoid);

      simulation.update();

      expect(mockBoid.separation).toHaveBeenCalledWith(expect.any(Array), 150, expect.any(Number));
      expect(mockBoid.alignment).toHaveBeenCalledWith(expect.any(Array), 150, expect.any(Number));
      expect(mockBoid.cohesion).toHaveBeenCalledWith(expect.any(Array), 150, expect.any(Number));
    });
  });

  describe('Edge cases', () => {
    it('should handle negative perception_radius gracefully', () => {
      simulation.perception_radius = -50;
      const mockBoid = createMockBoid() as unknown as Boid;
      simulation.addBoid(mockBoid);

      expect(() => simulation.update()).not.toThrow();
    });

    it('should handle zero forces', () => {
      simulation.separation_force = 0;
      simulation.alignment_force = 0;
      simulation.cohesion_force = 0;

      const mockBoid = createMockBoid() as unknown as Boid;
      simulation.addBoid(mockBoid);

      expect(() => simulation.update()).not.toThrow();
    });

    it('should handle large force values', () => {
      simulation.separation_force = 1000;
      simulation.alignment_force = 1000;
      simulation.cohesion_force = 1000;

      const mockBoid = createMockBoid() as unknown as Boid;
      simulation.addBoid(mockBoid);

      expect(() => simulation.update()).not.toThrow();
    });

    it('should handle very large boid counts', () => {
      for (let i = 0; i < 100; i++) {
        simulation.addBoid(createMockBoid() as unknown as Boid);
      }

      expect(() => simulation.update()).not.toThrow();
      expect(simulation.getCount()).toBe(100);
    });
  });
});
