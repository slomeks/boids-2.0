# Boids-2.0: Interactive Flocking Simulation

A web-based, interactive simulation of **boids flocking behavior** built with TypeScript, p5.js, and Tweakpane. This project demonstrates how complex emergent behavior (like bird flocking) arises from simple vector-based rules applied individually to each boid.

## Features

- **Real-time flocking simulation** with 100+ boids
- **Interactive parameters**: Adjust forces, perception radius, and boid count in real-time
- **Smooth 60 FPS animation** with canvas rendering
- **Type-safe** implementation using TypeScript strict mode
- **Comprehensive unit tests** for core simulation logic
- **Clean architecture** separating simulation, rendering, and UI concerns

## Quick Start

### Prerequisites
- Node.js 20.x or higher
- npm

### Installation & Running

```bash
# Install dependencies
npm install

# Start development server (with hot reload)
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Run tests in watch mode
npm test:watch
```

## The Boids Algorithm

Boids (bird-oid objects) simulate flocking behavior through three simple rules applied to each agent:

### 1. **Separation** (Avoid Crowding)

Boids steer to avoid crowding local flockmates.

**Formula:**
$$
\vec{s}_{sep} = w_{sep} \cdot \text{limit}\left(\text{limit}\left(\text{normalize}\left(\frac{1}{|N|}\sum_{j \in N} \text{normalize}(\vec{p}_i - \vec{p}_j) \cdot \frac{1}{d_{ij}}\right) \cdot v_{max} - \vec{v}_i, a_{max}\right), f_{max}\right)
$$

**Explanation:**
- For each neighbor within perception radius, calculate a vector pointing **away from** them
- Weight by **distance** (closer neighbors have more influence)
- Normalize and scale to **max speed**
- Calculate desired steering force (difference from current velocity)
- Limit to **max force** to prevent unrealistic accelerations

**Key Insight:** The farther away a neighbor, the less they repel you. This prevents boids from bunching up while maintaining natural spacing.

---

### 2. **Alignment** (Steer Towards Average Heading)

Boids steer towards the average heading of local flockmates.

**Formula:**
$$\vec{s}_{align} = w_{align} \cdot \text{limit}\left(\text{normalize}\left(\frac{1}{|N|}\sum_{j \in N} \vec{v}_j\right) \cdot v_{max} - \vec{v}_i, a_{max}\right)$$

**Explanation:**
- Calculate the **average velocity** of all neighbors
- Normalize and scale to **max speed**
- Calculate desired steering force (difference from current velocity)
- Limit to **max force**

**Key Insight:** Boids naturally align their movement with nearby neighbors, creating the synchronized swimming effect seen in flocks.

---

### 3. **Cohesion** (Steer Towards Center of Mass)

Boids steer to move toward the average location of local flockmates.

**Formula:**
$$\vec{s}_{cohesion} = w_{cohesion} \cdot \text{limit}\left(\text{normalize}\left(\frac{1}{|N|}\sum_{j \in N} \vec{p}_j - \vec{p}_i\right) \cdot v_{max} - \vec{v}_i, a_{max}\right)$$

**Explanation:**
- Calculate the **center of mass** of all neighbors
- Calculate direction toward that center
- Normalize and scale to **max speed**
- Calculate desired steering force
- Limit to **max force**

**Key Insight:** Cohesion keeps the flock together while separation prevents collisions. The balance between these creates natural-looking grouping.

---

## Physics Integration

Each frame, boid state is updated using **Euler integration**:

$$\vec{a} = \text{limit}(s_{sep} + s_{align} + s_{cohesion}, a_{max})$$

$$\vec{v}_{new} = \text{limit}(\vec{v} + \vec{a}, v_{max})$$

$$\vec{p}_{new} = \vec{p} + \vec{v}_{new}$$

**Then acceleration resets to zero** for the next frame.

---

## Parameter Reference

| Parameter | Default | Range | Description |
|-----------|---------|-------|-------------|
| `separation_force` | 1.5 | 0-5 | Weight of separation rule |
| `alignment_force` | 1.0 | 0-5 | Weight of alignment rule |
| `cohesion_force` | 1.0 | 0-5 | Weight of cohesion rule |
| `perception_radius` | 100 | 10-200 | Distance at which boids detect neighbors |
| `max_speed` | 4 | 1-10 | Maximum velocity magnitude |
| `boid_count` | 20 | 10-500 | Number of boids in simulation |

---

## Architecture

```
src/
├── index.ts                 # Entry point: p5.js sketch setup
├── boids/
│   ├── Boid.ts             # Individual boid: position, velocity, forces
│   └── Simulation.ts        # Orchestrates all boids each frame
└── renderer/
    └── CanvasRenderer.ts    # p5.js rendering abstraction
```

### Data Flow

```
p5.js Draw Loop (60 FPS)
    ↓
Simulation.update()           ← Apply forces, update physics
    ↓
    For each boid:
      - separation() → force vector
      - alignment() → force vector
      - cohesion() → force vector
      - applyForce() × 3 → accumulate forces
      - update() → integrate physics
      - wrapAround() → handle screen edges
    ↓
CanvasRenderer.draw()        ← Render all boids
    ↓
Canvas Display
```

### Key Architectural Decisions

- **Simulation is framework-agnostic**: Uses only vectors, not p5-specific code
- **CanvasRenderer receives p5 instance**: Dependency injection, not creation
- **Boid.display() handles its own rendering**: Encapsulation
- **Simulation passes all boids to force methods**: Each boid considers full neighborhood

---

## Mathematical Concepts

### Vector Normalization
Reduces a vector to unit length (magnitude = 1) while preserving direction:
$$\hat{v} = \frac{\vec{v}}{|\vec{v}|}$$

### Vector Limiting
Caps maximum magnitude:
$$\text{limit}(\vec{v}, max) = \begin{cases} \vec{v} & \text{if } |\vec{v}| \leq max \\ \hat{v} \cdot max & \text{otherwise} \end{cases}$$

### Distance Formula
Euclidean distance between two points:
$$d = \sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$$

---

## Testing

The project uses **Jest** with **mocking strategy**:

- **Simulation tests**: Mock Boid class to verify orchestration logic
- **Vector utilities**: Comprehensive edge case testing
- **Boid rendering**: Visual testing in the live simulation (no unit tests)

Rationale: Boid is tightly coupled to p5.Vector, making isolation testing impractical. Integration/visual testing validates the flocking behavior more effectively.

```bash
npm test                          # Run all tests
npm test:watch                    # Watch mode
npm test -- --coverage           # Coverage report
```

---

## Development Workflow

### Pre-commit Checks
Husky automatically runs before each commit:
- TypeScript type checking (`npm run type-check`)
- ESLint linting and auto-fixing
- Prettier code formatting

### Quality Commands
```bash
npm run type-check              # TypeScript strict mode
npm run lint                    # ESLint with TypeScript support
npm run format                  # Prettier formatting
npm run build                   # Vite production build
```

---

## References & Further Reading

- **Original Boids Paper**: [Flocks, Herds, and Schools: A Distributed Behavioral Model](https://www.cs.toronto.edu/~dt/siggraph97-course/cwr67/) by Craig Reynolds (1987)
- **p5.js Documentation**: https://p5js.org/
- **Vector Math**: Understanding how vector operations create emergent behavior
- **Perception Radius**: The key parameter that determines "how far a boid can see"

---

## Future Enhancements (Phase 4+)

- **Quadtree Optimization**: For 1000+ boids, O(n log n) neighbor detection
- **Mouse Interaction**: Boids follow/avoid cursor (predator/goal)
- **Static Obstacles**: Boids pathfind around barriers
- **3D Implementation**: Using Three.js for 3D flocking
- **Performance Metrics**: Real-time FPS and boid count display

---

## Project Structure

This is a **learning-focused project** demonstrating:

✅ Clean TypeScript architecture
✅ Separation of concerns (simulation, rendering, UI)
✅ Test-driven development with mocking
✅ Vector mathematics in practice
✅ Emergent behavior from simple rules
✅ Web-based interactive visualization

---

## License

MIT

---

**Author's Note**: This project is designed as an educational tool. The boids algorithm is simple yet powerful—a perfect example of how complexity emerges from simplicity. Experiment with the parameters and watch the emergent behavior change!
