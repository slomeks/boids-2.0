import * as Tweakpane from 'tweakpane';
import { Simulation } from '../boids/Simulation';
import { Boid } from '../boids/Boid';
import p5 from 'p5';

export class ControlPanel {
  private pane: Tweakpane.Pane & any;
  private simulation: Simulation;
  private p: p5;

  // Store defaults for reset functionality
  private defaults = {
    separation_force: 1.5,
    alignment_force: 1.0,
    cohesion_force: 1.0,
    perception_radius: 100,
    max_speed: 4,
    boid_count: 50,
  };

  constructor(simulation: Simulation, p: p5) {
    this.simulation = simulation;
    this.p = p;

    // Create the Tweakpane instance embedded in the control panel container
    const container = document.getElementById('control-panel');
    this.pane = new Tweakpane.Pane({
      container: container || undefined,
      title: 'Simulation Controls',
    }) as any;

    this.setupControls();
  }

  /**
   * Set up all the UI controls
   */
  private setupControls(): void {
    // Create a folder for flocking forces
    const forcesFolder = this.pane.addFolder({
      title: 'Flocking Forces',
    });

    // Separation force slider
    forcesFolder.addBinding(this.simulation, 'separation_force', {
      min: 0,
      max: 5,
      step: 0.1,
      label: 'Separation',
    });

    // Alignment force slider
    forcesFolder.addBinding(this.simulation, 'alignment_force', {
      min: 0,
      max: 5,
      step: 0.1,
      label: 'Alignment',
    });

    // Cohesion force slider
    forcesFolder.addBinding(this.simulation, 'cohesion_force', {
      min: 0,
      max: 5,
      step: 0.1,
      label: 'Cohesion',
    });

    // Create a folder for simulation parameters
    const paramsFolder = this.pane.addFolder({
      title: 'Simulation Parameters',
    });

    // Perception radius slider
    paramsFolder.addBinding(this.simulation, 'perception_radius', {
      min: 10,
      max: 200,
      step: 5,
      label: 'Perception Radius',
    });

    // Max speed slider (this is trickier - we need to update all boids)
    paramsFolder.addBinding(this, 'maxSpeed', {
      min: 1,
      max: 10,
      step: 0.5,
      label: 'Max Speed',
    });

    // Boid count slider (with dynamic add/remove logic)
    paramsFolder.addBinding(this, 'boidCount', {
      min: 10,
      max: 500,
      step: 10,
      label: 'Boid Count',
    });

    // Reset button
    this.pane
      .addButton({
        title: 'Reset to Defaults',
      })
      .on('click', () => this.reset());
  }

  /**
   * Getter/setter for max_speed to update all boids
   */
  private get maxSpeed(): number {
    // All boids should have the same max_speed, so return the first one's
    return this.simulation.boids.length > 0
      ? this.simulation.boids[0].max_speed
      : this.defaults.max_speed;
  }

  private set maxSpeed(value: number) {
    // Update all boids with new max_speed
    for (const boid of this.simulation.boids) {
      boid.max_speed = value;
    }
  }

  /**
   * Getter/setter for boid count
   */
  private get boidCount(): number {
    return this.simulation.getCount();
  }

  private set boidCount(count: number) {
    const current = this.simulation.getCount();

    if (count > current) {
      // Add new boids
      for (let i = current; i < count; i++) {
        const x = this.p.random(this.simulation.width);
        const y = this.p.random(this.simulation.height);
        this.simulation.addBoid(new Boid(x, y));
      }
    } else if (count < current) {
      // Remove boids from the end
      for (let i = current; i > count; i--) {
        const boid = this.simulation.boids[this.simulation.boids.length - 1];
        this.simulation.removeBoid(boid);
      }
    }
  }

  /**
   * Reset all parameters to defaults
   */
  private reset(): void {
    this.simulation.separation_force = this.defaults.separation_force;
    this.simulation.alignment_force = this.defaults.alignment_force;
    this.simulation.cohesion_force = this.defaults.cohesion_force;
    this.simulation.perception_radius = this.defaults.perception_radius;
    this.maxSpeed = this.defaults.max_speed;
    this.boidCount = this.defaults.boid_count;

    // Refresh the pane to show updated values
    this.pane.refresh();
  }
}
