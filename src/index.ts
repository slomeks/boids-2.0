import p5 from 'p5';
import { Simulation } from './boids/Simulation';
import { CanvasRenderer } from './renderer/CanvasRenderer';
import { Boid } from './boids/Boid';
import { ControlPanel } from './ui/ControlPanel';
import { AboutPanel } from './ui/AboutPanel';

// Canvas dimensions (800x800 square canvas for side-by-side layout)
const WIDTH = 800;
const HEIGHT = 800;

// Initial simulation parameters
const INITIAL_BOID_COUNT = 50;
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

    // Move canvas into the canvas container div
    const canvasContainer = document.getElementById('canvas-container');
    const canvas = (p as any).canvas;
    if (canvasContainer && canvas) {
      canvasContainer.appendChild(canvas);
    }

    // Add initial boids
    for (let i = 0; i < INITIAL_BOID_COUNT; i++) {
      const x = p.random(WIDTH);
      const y = p.random(HEIGHT);
      simulation.addBoid(new Boid(x, y));
    }

    // Create control panel for real-time parameter adjustment
    new ControlPanel(simulation, p);

    // Create about panel with collapsible toggle
    new AboutPanel();
  };

  p.draw = function () {
    // Update simulation (apply forces, update positions)
    simulation.update();

    // Render the frame
    renderer.draw(simulation);
  };

  /**
   * Disable window resizing - let CSS handle responsive sizing
   * (Returning false prevents p5 from handling resize)
   */
  p.windowResized = function () {
    return false;
  };
};

// Create p5 instance
new p5(sketch);
