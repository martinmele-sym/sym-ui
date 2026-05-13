declare module 'bootstrap/js/dist/tooltip.js' {
  export default class Tooltip {
    static getOrCreateInstance(
      element: HTMLElement,
      options?: Record<string, unknown>,
    ): Tooltip
    dispose(): void
  }
}
