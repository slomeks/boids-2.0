import { distance, magnitude, normalize, limit, heading } from '../../src/boids/utils';

describe('Vector Utilities', () => {
  describe('distance', () => {
    it('should calculate distance between two points', () => {
      const result = distance(0, 0, 3, 4);
      expect(result).toBeCloseTo(5, 5); // 3-4-5 triangle
    });

    it('should return 0 for same point', () => {
      const result = distance(5, 5, 5, 5);
      expect(result).toBe(0);
    });

    it('should calculate distance with negative coordinates', () => {
      const result = distance(-1, -1, 2, 3);
      expect(result).toBeCloseTo(5, 5); // sqrt(9 + 16) = 5
    });

    it('should be commutative', () => {
      const d1 = distance(0, 0, 10, 10);
      const d2 = distance(10, 10, 0, 0);
      expect(d1).toBe(d2);
    });

    it('should work with floating point coordinates', () => {
      const result = distance(0.5, 0.5, 0.5, 1.5);
      expect(result).toBeCloseTo(1, 5);
    });
  });

  describe('magnitude', () => {
    it('should calculate magnitude of a vector', () => {
      const result = magnitude(3, 4);
      expect(result).toBeCloseTo(5, 5); // 3-4-5 triangle
    });

    it('should return 0 for zero vector', () => {
      const result = magnitude(0, 0);
      expect(result).toBe(0);
    });

    it('should handle negative components', () => {
      const result = magnitude(-3, -4);
      expect(result).toBeCloseTo(5, 5);
    });

    it('should handle unit vectors', () => {
      const result = magnitude(1, 0);
      expect(result).toBe(1);
    });

    it('should handle floating point vectors', () => {
      const result = magnitude(0.3, 0.4);
      expect(result).toBeCloseTo(0.5, 5);
    });
  });

  describe('normalize', () => {
    it('should normalize a vector to unit length', () => {
      const [x, y] = normalize(3, 4);
      const mag = magnitude(x, y);
      expect(mag).toBeCloseTo(1, 5);
    });

    it('should normalize correctly', () => {
      const [x, y] = normalize(3, 4);
      expect(x).toBeCloseTo(0.6, 5);
      expect(y).toBeCloseTo(0.8, 5);
    });

    it('should handle zero vector safely', () => {
      const [x, y] = normalize(0, 0);
      expect(x).toBe(0);
      expect(y).toBe(0);
    });

    it('should preserve direction', () => {
      const [x1, y1] = normalize(10, 0);
      expect(x1).toBeCloseTo(1, 5);
      expect(y1).toBeCloseTo(0, 5);

      const [x2, y2] = normalize(0, 10);
      expect(x2).toBeCloseTo(0, 5);
      expect(y2).toBeCloseTo(1, 5);
    });

    it('should normalize negative vectors', () => {
      const [x, y] = normalize(-3, -4);
      const mag = magnitude(x, y);
      expect(mag).toBeCloseTo(1, 5);
    });
  });

  describe('limit', () => {
    it('should not change vector if under max', () => {
      const [x, y] = limit(2, 2, 5);
      expect(x).toBe(2);
      expect(y).toBe(2);
    });

    it('should limit vector to max magnitude', () => {
      const [x, y] = limit(30, 40, 5);
      const mag = magnitude(x, y);
      expect(mag).toBeCloseTo(5, 5);
    });

    it('should preserve direction when limiting', () => {
      const [x, y] = limit(30, 40, 5);
      // Should be proportional to original
      expect(x / y).toBeCloseTo(30 / 40, 5);
    });

    it('should handle zero vector', () => {
      const [x, y] = limit(0, 0, 5);
      expect(x).toBe(0);
      expect(y).toBe(0);
    });

    it('should work with vector exactly at max', () => {
      const [x, y] = limit(3, 4, 5);
      expect(magnitude(x, y)).toBeCloseTo(5, 5);
    });

    it('should handle max = 0', () => {
      const [x, y] = limit(5, 5, 0);
      expect(x).toBe(0);
      expect(y).toBe(0);
    });
  });

  describe('heading', () => {
    it('should return angle for standard directions', () => {
      // Right: 0 radians
      expect(heading(1, 0)).toBeCloseTo(0, 5);

      // Up: π/2 radians
      expect(heading(0, 1)).toBeCloseTo(Math.PI / 2, 5);

      // Left: π radians or -π
      expect(Math.abs(heading(-1, 0))).toBeCloseTo(Math.PI, 5);

      // Down: -π/2 radians
      expect(heading(0, -1)).toBeCloseTo(-Math.PI / 2, 5);
    });

    it('should handle diagonal directions', () => {
      // 45 degrees up-right
      expect(heading(1, 1)).toBeCloseTo(Math.PI / 4, 5);

      // 45 degrees up-left
      expect(heading(-1, 1)).toBeCloseTo((3 * Math.PI) / 4, 5);
    });

    it('should handle zero vector', () => {
      const result = heading(0, 0);
      expect(result).toBeCloseTo(0, 5);
    });
  });

  describe('Integration Tests', () => {
    it('should chain operations correctly', () => {
      // Start with vector (30, 40)
      // 1. Normalize to unit length
      const [nx, ny] = normalize(30, 40);
      expect(magnitude(nx, ny)).toBeCloseTo(1, 5);

      // 2. Scale by limiting to 5
      const [lx, ly] = limit(nx * 20, ny * 20, 5);
      expect(magnitude(lx, ly)).toBeCloseTo(5, 5);

      // 3. Calculate distance from origin
      const dist = distance(0, 0, lx, ly);
      expect(dist).toBeCloseTo(5, 5);
    });

    it('should correctly calculate distance between two points using individual operations', () => {
      const x1 = 0,
        y1 = 0;
      const x2 = 3,
        y2 = 4;

      // distance(0,0,3,4) should equal magnitude of (3,4)
      const d = distance(x1, y1, x2, y2);
      const m = magnitude(x2 - x1, y2 - y1);
      expect(d).toBeCloseTo(m, 5);
    });
  });
});
