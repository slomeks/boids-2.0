import p5 from 'p5';

// This is a simple sketch to verify everything is set up correctly
const sketch = (p: p5) => {
  p.setup = () => {
    // Create a canvas that fills the window
    p.createCanvas(p.windowWidth, p.windowHeight);
  };

  p.draw = () => {
    // Light blue background
    p.background(135, 206, 235);

    // Draw some text to verify it's working
    p.fill(0);
    p.textSize(32);
    p.textAlign(p.CENTER, p.CENTER);
    p.text('Boids Simulation', p.width / 2, p.height / 2 - 40);

    p.textSize(16);
    p.text('Setup complete! Ready to build the simulation.', p.width / 2, p.height / 2 + 20);
  };

  // Handle window resizing
  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
};

// Create the p5 instance
new p5(sketch);
