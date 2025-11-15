import p5 from 'p5';
import { Simulation } from '../boids/Simulation';

/**
 * CanvasRenderer handles all p5.js rendering for the boids simulation.
 * It provides a clean abstraction layer between the simulation logic
 * and the p5.js canvas rendering.
 */
export class CanvasRenderer {
  constructor(private p: p5) {}

  /**
   * Set up the canvas with specified dimensions
   */
  setup(width: number, height: number): void {
    this.p.createCanvas(width, height);
  }

  /**
   * Draw the current state of the simulation
   * This should be called once per frame (in p5's draw loop)
   */
  draw(simulation: Simulation): void {
    // Clear the canvas with dark background for contrast
    this.p.background(20);

    // Draw each boid
    for (const boid of simulation.getBoids()) {
      boid.display(this.p);
    }
  }
}
