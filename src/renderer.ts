const NAMESPACE_URI = "http://www.w3.org/2000/svg";

export class Renderer {
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
    this.#container = this.add(document.body, "svg", {
      id,
      width,
      height
    });
  }

  add(parent: HTMLElement | SVGElement | null, type: string, attrs = {}): SVGElement {
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
