# Boids-2.0 Implementation Plan

Simple task checklist for boids flocking simulation project.

---

## PHASE 1: Project Setup

- ✓ Initialize npm project with package.json and TypeScript config
- ✓ Install core dependencies (p5, tweakpane, typescript, vite)
- ✓ Install dev dependencies (eslint, prettier, @types/p5, jest)
- ✓ Configure tsconfig.json (ES2020, strict mode, outDir)
- ✓ Set up Vite build configuration
- ✓ Create project folder structure (src/boids, src/renderer, src/ui)
- ✓ Create index.html with canvas container

---

## PHASE 2: Core Simulation

- ✓ Implement src/boids/Boid.ts (without unit tests; visual testing in Phase 2)
- ✓ Add separation, alignment, cohesion rules to Boid
- ✓ Implement src/boids/Simulation.ts with unit tests (tests/boids/Simulation.test.ts)
- ✓ Add screen wrapping logic to Simulation
- ✓ Implement src/renderer/CanvasRenderer.ts (setup, draw, drawBoid)
- ✓ Create src/index.ts entry point (p5.js sketch setup)
- ✓ Wire Simulation and CanvasRenderer together in index.ts
- ✓ Test P0: Visual verify boids render, move, and exhibit flocking behavior
- ✓ Test P0: Verify screen wrapping and 60fps animation
- ✓ Run npm run type-check and fix any TypeScript errors
- ✓ Run npm run lint and npm run format

---

## PHASE 3: Interactivity

- ✓ Implement src/ui/ControlPanel.ts (Tweakpane initialization and folders)
- ✓ Add separation_force slider (range: 0-5, default: 1.5)
- ✓ Add alignment_force slider (range: 0-5, default: 1.0)
- ✓ Add cohesion_force slider (range: 0-5, default: 1.0)
- ✓ Add perception_radius slider (range: 10-200, default: 100)
- ✓ Add max_speed slider (range: 1-10, default: 4)
- ✓ Add boid_count slider (range: 10-500, default: 100)
- ✓ Implement Reset button to restore defaults
- ✓ Test P1: Verify all sliders update simulation in real-time

---

## PHASE 4: Enhancements

- ☐ Implement mouse interaction (predator/goal following)
- ☐ Implement quadtree for neighbor detection optimization
- ☐ Add static obstacles and avoidance behavior

---

## PHASE 5: Deployment

- ☐ Create README.md with project overview, setup, and usage guide
- ☐ Manual testing (verify all features in browser)
- ☐ Performance testing (test with 100, 250, 500, 1000 boids)
- ☐ Production build: npm run build
- ☐ Deploy to GitHub Pages, Vercel, or Netlify

---
