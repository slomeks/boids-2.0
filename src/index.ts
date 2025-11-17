import p5 from 'p5';
import { Simulation } from './boids/Simulation';
import { CanvasRenderer } from './renderer/CanvasRenderer';
import { Boid } from './boids/Boid';
import { ControlPanel } from './ui/ControlPanel';

// Canvas dimensions
const WIDTH = 950;
const HEIGHT = 1500;

// Initial simulation parameters
const INITIAL_BOID_COUNT = 20;
const PERCEPTION_RADIUS = 100;

// Initialize simulation and renderer
let simulation: Simulation;
let renderer: CanvasRenderer;

/**
 * p5.js sketch definition
 * This is the main entry point that sets up the animation loop
 */
const sketch = (p: p5) => {
  p.setup = function () {
    // Create simulation
    simulation = new Simulation(WIDTH, HEIGHT);
    simulation.perception_radius = PERCEPTION_RADIUS;

    // Create renderer
    renderer = new CanvasRenderer(p);
    renderer.setup(WIDTH, HEIGHT);

    // Add initial boids
    for (let i = 0; i < INITIAL_BOID_COUNT; i++) {
      const x = p.random(WIDTH);
      const y = p.random(HEIGHT);
      simulation.addBoid(new Boid(x, y));
    }

    // Create control panel for real-time parameter adjustment
    new ControlPanel(simulation, p);
  };

  p.draw = function () {
    // Update simulation (apply forces, update positions)
    simulation.update();

    // Render the frame
    renderer.draw(simulation);
  };

  /**
   * Disable window resizing - keep canvas fixed at 1000x600
   * (Returning false prevents p5 from handling resize)
   */
  p.windowResized = function () {
    return false;
  };
};

// Create p5 instance
new p5(sketch);
