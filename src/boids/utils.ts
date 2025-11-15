/**
 * Calculate the distance between two points
 */
export const distance = (x1: number, y1: number, x2: number, y2: number): number => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Calculate the magnitude (length) of a vector
 */
export const magnitude = (x: number, y: number): number => {
  return Math.sqrt(x * x + y * y);
};

/**
 * Normalize a vector to unit length (magnitude = 1)
 */
export const normalize = (x: number, y: number): [number, number] => {
  const mag = magnitude(x, y);
  if (mag === 0) {
    return [0, 0];
  }
  return [x / mag, y / mag];
};

/**
 * Limit a vector's magnitude to a maximum value
 */
export const limit = (x: number, y: number, max: number): [number, number] => {
  const mag = magnitude(x, y);
  if (mag > max) {
    const [nx, ny] = normalize(x, y);
    return [nx * max, ny * max];
  }
  return [x, y];
};

/**
 * Get the angle (heading) of a vector in radians
 */
export const heading = (x: number, y: number): number => {
  return Math.atan2(y, x);
};
