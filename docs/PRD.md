# **Boids Flocking Simulation: Project Requirements**

Author: (Your Name)  
Status: Draft  
Last Updated: November 15, 2025

## **1\. Overview & Vision**

What is this?  
This project is a web-based, interactive simulation of the "boids" flocking algorithm. It's a "digital toy" that visualizes how complex, lifelike, emergent behavior (like a flock of birds) can arise from a few simple rules.  
The Vision:  
To create a visually satisfying, real-time simulation where users can not only observe the flocking behavior but also actively control the parameters that govern it, leading to a deeper "playful" understanding of the algorithm.  
Primary Goal (Learning):  
This is a learning-focused project to gain hands-on experience with:

* Real-time animation loops (e.g., requestAnimationFrame or a p5.js draw() loop).  
* Vector mathematics in a practical application.  
* Integrating a 2D graphics library (p5.js).  
* Implementing a UI control panel (Tweakpane) to modify live code.  
* Writing modular, clean code using TypeScript.

## **2\. Target Audience**

1. **The Developer (You):** A developer looking for a visually rewarding project to master canvas animation, TypeScript, and client-side libraries.  
2. **The End-User:** Anyone interested in simulations, emergent behavior, or generative art. The experience should be intuitive, requiring no prior knowledge.

## **3\. Core Features & Requirements (Prioritized)**

Features are broken down into what's essential (P0), what makes the product "complete" (P1), and what's a future goal (P2).

### **P0: The Core Simulation (Must-Haves)**

* **Canvas:** A 2D canvas that fills a large portion of the viewport.  
* **Boids:** The simulation must render a configurable number of "boids" (e.g., as simple triangles or circles).  
* **Animation Loop:** Boids must move smoothly in a continuous 60fps loop.  
* **Screen Wrap:** Boids that fly off one edge of the screen must reappear on the opposite edge.  
* **Boid Algorithm (The 3 Rules):**  
  1. **Separation:** Boids must steer to avoid colliding with their immediate neighbors.  
  2. **Alignment:** Boids must steer towards the average heading (direction) of their neighbors.  
  3. **Cohesion:** Boids must steer towards the average position (center of mass) of their neighbors.

### **P1: Core Interactivity (Should-Haves)**

* **UI Control Panel:** An always-visible, non-intrusive control panel (e.g., using Tweakpane) must be present.  
* **Real-time Sliders:** All controls must update the simulation in real-time without a page refresh.  
* **Required Controls:**  
  * separation\_force (Slider): Adjust the strength of the separation rule.  
  * alignment\_force (Slider): Adjust the strength of the alignment rule.  
* cohesion\_force (Slider): Adjust the strength of the cohesion rule.  
  * perception\_radius (Slider): Adjust how far a boid can "see" its neighbors.  
  * boid\_count (Slider/Input): Adjust the total number of boids in the simulation.  
  * max\_speed (Slider): Control the maximum speed of the boids.  
* **Reset Button:** A button in the UI panel to reset the simulation to its default values.

### **P2: Future Enhancements (Nice-to-Haves)**

* **Mouse Interaction:** Boids react to the user's mouse (e.g., as a "predator" to flee from or a "goal" to move towards).  
* **Performance Optimization:** Implement a quadtree to speed up neighbor-finding, allowing for thousands of boids.  
* **Obstacles:** Add static obstacles (e.g., circles) that boids must avoid.  
* **3D Migration:** Re-implement the core logic (which is vector-based) in a 3D environment using a library like Three.js.

## **4\. Out of Scope (For Version 1.0)**

* **No Server:** This is a 100% client-side application. No backend, database, or user accounts are needed.  
* **No Mobile Optimization:** The primary target is desktop. Mobile responsiveness is not a P0/P1 goal.  
* **No 3D:** The initial product is exclusively 2D.