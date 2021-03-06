const NAMESPACE_URI = "http://www.w3.org/2000/svg";

class Renderer {
  static TYPES = {
    GROUP: "g",
    RECTANGLE: "rect",
    CIRCLE: "circle",
    LINE: "line",
  };

  static removeElement(id) {
    let el = document.querySelector(`#${id}`);

    if (!el) return;

    el.parentNode.removeChild(el);
  }

  constructor() {
    this._width = null;
    this._height = null;
    this._container = null;
  }

  get width() {
    return this._width;
  }

  get height() {
    return this._height;
  }

  setBackgroundColor(color) {
    this._container.setAttribute("style", `background-color: ${color};`);
  }

  init(width, height, id) {
    this._width = width;
    this._height = height;
    this._container = this.createElement(document.body, "svg", {
      id,
      width,
      height,
    });
  }

  createElement(parent, type, attrs = {}) {
    let el = document.createElementNS(NAMESPACE_URI, type);

    for (let key in attrs) {
      el.setAttribute(key, attrs[key]);
    }

    if (parent) parent.appendChild(el);
    else this._container.appendChild(el);

    return el;
  }
}
