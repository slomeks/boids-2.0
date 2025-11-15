# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Boids-2.0** is a web-based, interactive simulation of the boids flocking algorithm. It's a learning-focused project designed to visualize how complex emergent behavior (like bird flocking) arises from simple vector-based rules applied individually to each boid.

**Stack:**
- TypeScript for type-safe simulation logic
- p5.js for 2D canvas rendering and vector math
- Tweakpane for real-time parameter adjustment UI
- Browser-based, no backend/database

## Development Commands

The project uses npm for package management and build tooling. Add these to `package.json` scripts once setup is complete:

```bash
# Installation & Setup
npm install                  # Install dependencies

# Development
npm run dev                  # Start dev server with hot reload
npm run build                # Compile TypeScript to JavaScript
npm run watch                # Watch for changes and rebuild

# Code Quality
npm run lint                 # Run ESLint
npm run format               # Format code with Prettier
npm test                     # Run test suite
npm run test:watch           # Run tests in watch mode
npm run type-check           # Run TypeScript type checking

# Single Test Execution
npm test -- <test-file-path> # Run a specific test file
npm test -- --testNamePattern="<pattern>"  # Run tests matching pattern
```

## Architecture & Core Concepts

### Simulation Engine
The heart of the project is the **boids algorithm**, which applies three rules to each boid independently:

1. **Separation**: Avoid crowding neighbors
2. **Alignment**: Steer towards average heading of neighbors
3. **Cohesion**: Steer towards center of mass of neighbors

Each rule produces a force vector that is weighted and combined to produce the boid's acceleration.

### Key Technical Components

**Vector Mathematics:**
- All boid behavior relies on vector operations (addition, subtraction, normalization, limiting)
- p5.js provides a `p5.Vector` class that should be used for all vector calculations
- Forces are typically accumulated in an acceleration vector, then applied to velocity

**Neighbor Detection:**
- Current implementation: O(n²) brute force comparison of all boid pairs
- Use `perception_radius` to limit which neighbors are considered
- P2 enhancement: Implement quadtree for O(n log n) performance at scale

**Animation Loop:**
- Use p5.js's `draw()` function for the animation loop (60 FPS by default)
- Each frame: update all boid velocities and positions, then render
- Screen wrapping: When boid goes off-screen, reposition it on opposite edge

**UI Integration:**
- Tweakpane binds parameters directly to simulation variables
- All controls should trigger real-time updates without page refresh
- Parameter ranges: define reasonable min/max values in control panel setup

### Expected Project Structure

```
src/
├── index.ts                    # Entry point, p5.js sketch setup
├── boids/
│   ├── Boid.ts                 # Individual boid class
│   ├── Simulation.ts           # Core simulation engine
│   └── utils.ts                # Vector math utilities
├── renderer/
│   └── CanvasRenderer.ts        # p5.js rendering logic
└── ui/
    └── ControlPanel.ts         # Tweakpane UI setup
```

## Feature Priorities

**P0 (Must-Have for v1.0):**
- Canvas rendering with configurable boid count
- All three flocking rules implemented correctly
- 60 FPS animation
- Screen wrapping
- Tweakpane UI with sliders for all forces and parameters

**P1 (Should-Have for v1.0):**
- Real-time parameter adjustment (separation_force, alignment_force, cohesion_force, perception_radius, boid_count, max_speed)
- Reset button to restore defaults
- Non-intrusive, always-visible control panel

**P2 (Future Enhancements):**
- Mouse interaction (predator/goal following)
- Quadtree optimization for thousands of boids
- Static obstacles
- 3D implementation using Three.js

## Common Development Patterns

**Working with Forces:**
Forces in this simulation are typically applied in sequence:
1. Calculate separation force
2. Calculate alignment force
3. Calculate cohesion force
4. Weight each force and add to acceleration vector
5. Limit acceleration to max_speed
6. Update velocity: `velocity += acceleration`
7. Update position: `position += velocity`

**Perception Radius:**
When determining neighbors, only consider boids within `perception_radius`. This:
- Improves performance
- Makes behavior more realistic (boids can't "see" far away neighbors)
- Is a parameter users can adjust in real-time

**p5.js Integration:**
- Create a global p5.Sketch instance to handle rendering
- Use `p5.Vector` for all position, velocity, and force calculations
- Use `translate()`, `rotate()`, and `fill()` for boid rendering
- Reset `fill()` and drawing styles before each boid to avoid state issues

## Testing Strategy

- Unit tests for vector math utilities
- Integration tests for individual boid behavior
- Visual regression testing (compare canvas output) is optional but helpful
- Manual testing is important: adjust sliders and verify behavior matches expectations
