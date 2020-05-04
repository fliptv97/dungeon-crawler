class Player {
  constructor(renderer, x, y, fov = 60) {
    this._renderer = renderer;
    this._position = new Vector2D(x, y);
    this._fov = fov;

    this._fovHeading = 0;
    this._el = null;
    this._rays = [];

    for (let angle = -this._fov / 2; angle < this._fov / 2; angle += 1) {
      this._rays.push(
        new Ray(this._renderer, this._position, degreesToRadians(angle))
      );
    }
  }

  castRays() {
    let lines = [
      {
        startPoint: new Vector2D(0, 0),
        endPoint: new Vector2D(400, 0),
      },
      {
        startPoint: new Vector2D(0, 400),
        endPoint: new Vector2D(400, 400),
      },
      {
        startPoint: new Vector2D(0, 0),
        endPoint: new Vector2D(0, 400),
      },
      {
        startPoint: new Vector2D(400, 0),
        endPoint: new Vector2D(400, 400),
      },
    ];
    let scene = [];

    this._renderer.removeElement("rays");

    let raysGroup = this._renderer.createElement(null, Renderer.TYPES.GROUP, {
      id: "rays",
    });

    this._rays.forEach((ray, index) => {
      let closestPoint = null;
      let closestPointDistance = Infinity;

      lines.forEach((line) => {
        let intersectionPoint = ray.cast(line);

        if (intersectionPoint) {
          let distance = ray.position.distance(intersectionPoint);
          let angle = ray.direction.heading() - this._fovHeading;

          distance *= Math.cos(angle);

          if (distance < closestPointDistance) {
            closestPointDistance = distance;
            closestPoint = intersectionPoint;
          }
        }
      });

      if (closestPoint) {
        this._renderer.createElement(raysGroup, Renderer.TYPES.LINE, {
          x1: this._position.x,
          y1: this._position.y,
          x2: closestPoint.x,
          y2: closestPoint.y,
          style: "stroke-width: 1; stroke: #FFF;",
        });
      }

      scene.push(closestPointDistance);
    });

    return scene;
  }

  rotate(angle) {
    this._fovHeading += degreesToRadians(angle);

    for (
      let angle = -this._fov / 2, i = 0;
      angle < this._fov / 2;
      angle += 1, i++
    ) {
      this._rays[i].setAngle(degreesToRadians(angle) + this._fovHeading);
    }

    this.castRays();
  }

  move(length) {
    // Give a normal name
    let a = Vector2D.fromAngle(this._fovHeading);

    a.setMagnitude(length);
    this._position.add(a);

    this._el.setAttribute("cx", this._position.x);
    this._el.setAttribute("cy", this._position.y);

    this.castRays();
  }

  render() {
    this._el = this._renderer.createElement(null, Renderer.TYPES.CIRCLE, {
      cx: this._position.x,
      cy: this._position.y,
      r: 5,
      fill: "#FFF",
    });
  }
}
