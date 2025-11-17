import { getAboutContent } from './aboutContent';

/**
 * AboutPanel - Collapsible about section for the boids simulation
 * Handles toggle functionality and smooth expand/collapse animations
 * Injects content from a separate aboutContent.ts file
 */
export class AboutPanel {
  private toggleButton: HTMLButtonElement | null;
  private contentPanel: HTMLElement | null;
  private isExpanded: boolean = false;

  constructor() {
    this.toggleButton = document.querySelector('.about-toggle');
    this.contentPanel = document.querySelector('.about-content');

    // Inject the about content into the panel
    if (this.contentPanel) {
      this.contentPanel.innerHTML = getAboutContent();
    }

    this.setupEventListeners();
  }

  /**
   * Set up click and keyboard event listeners for the toggle button
   */
  private setupEventListeners(): void {
    if (!this.toggleButton) return;

    // Click to toggle
    this.toggleButton.addEventListener('click', () => {
      this.toggle();
    });

    // Keyboard support (Enter or Space to toggle)
    this.toggleButton.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.toggle();
      }
    });
  }

  /**
   * Toggle the expanded/collapsed state of the about panel
   */
  private toggle(): void {
    this.isExpanded ? this.collapse() : this.expand();
  }

  /**
   * Expand the about panel with animation
   */
  private expand(): void {
    if (!this.contentPanel || !this.toggleButton) return;

    this.isExpanded = true;

    // Remove collapsed class to trigger CSS animation
    this.contentPanel.classList.remove('collapsed');

    // Update ARIA attributes for accessibility
    this.toggleButton.setAttribute('aria-expanded', 'true');
    this.toggleButton.classList.remove('collapsed');
  }

  /**
   * Collapse the about panel with animation
   */
  private collapse(): void {
    if (!this.contentPanel || !this.toggleButton) return;

    this.isExpanded = false;

    // Add collapsed class to trigger CSS animation
    this.contentPanel.classList.add('collapsed');

    // Update ARIA attributes for accessibility
    this.toggleButton.setAttribute('aria-expanded', 'false');
    this.toggleButton.classList.add('collapsed');
  }
}
