/**
 * About Panel Content - Returns the HTML content for the About This Project section
 */

export function getAboutContent(): string {
  return `
    <h3>Boids Flocking Simulation</h3>
    <p>
      An interactive visualization of emergent flocking behavior using vector-based
      rules. Explore how simple local interactions create complex group dynamics.
    </p>

    <h3>The Three Rules</h3>
    <ul>
      <li><strong>Separation:</strong> Avoid crowding neighbors</li>
      <li><strong>Alignment:</strong> Steer towards average heading</li>
      <li><strong>Cohesion:</strong> Move toward center of mass</li>
    </ul>

    <h3>How to Use</h3>
    <p>Adjust the force sliders to change boid behavior:</p>
    <ul>
      <li>Higher separation → boids spread apart</li>
      <li>Higher alignment → coordinated movement</li>
      <li>Higher cohesion → tighter formations</li>
    </ul>
    <p>
      Change the perception radius to control how far boids can "see" their neighbors,
      and adjust max speed to control overall velocity.
    </p>

    <h3>Try These</h3>
    <ul>
      <li>Max out separation for explosive dispersal</li>
      <li>Balance all three forces for natural flocking</li>
      <li>Increase boid count to see emergent behavior scale</li>
      <li>Reduce perception radius for smaller, tighter groups</li>
    </ul>

    <h3>Technical Details</h3>
    <p>
      Built with TypeScript, p5.js, and Tweakpane. Forces are calculated using
      vector mathematics and accumulated each frame. Screen wrapping allows
      continuous motion in a bounded space.
    </p>
    <p>
      <a href="https://en.wikipedia.org/wiki/Boids" target="_blank">Learn more about boids →</a>
    </p>
    <p>
      <a href="https://github.com/slomeks/boids-2.0" target="_blank">View on GitHub →</a>
    </p>
  `;
}
