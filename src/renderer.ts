const NAMESPACE_URI = "http://www.w3.org/2000/svg";

export type ElementType = typeof Renderer.ELEMENT_TYPES[keyof typeof Renderer.ELEMENT_TYPES];

export class Renderer {
  static ELEMENT_TYPES = {
    SVG: "svg",
    GROUP: "g",
    RECTANGLE: "rect",
    CIRCLE: "circle",
    LINE: "line",
  } as const;

  #width = 0;
  #height = 0;
  #container: SVGElement | null = null;

  static removeElement(id: string): void {
    const el = document.querySelector(`#${id}`);

    if (!el) return;
    if (!el.parentNode) return;

    el.parentNode.removeChild(el);
  }

  get width() {
    return this.#width;
  }

  get height() {
    return this.#height;
  }

  setBackgroundColor(color: string): void | never {
    if (!this.#container) {
      throw new Error("Renderer: There's no container");
    }

    this.#container.setAttribute("style", `background-color: ${color};`);
  }

  init(width: number, height: number, id: string): void {
    this.#width = width;
    this.#height = height;
    this.#container = this.createElement(document.body, "svg", {
      id,
      width,
      height,
    });
  }

  createElement(parent: HTMLElement | SVGElement | null, type: ElementType, attrs = {}): SVGElement {
    const el = document.createElementNS(NAMESPACE_URI, type);

    for (const key in attrs) {
      el.setAttribute(key, attrs[key as keyof typeof attrs]);
    }

    if (parent) {
      parent.appendChild(el);
    } else if (this.#container) {
      this.#container.appendChild(el);
    }

    return el;
  }
}
