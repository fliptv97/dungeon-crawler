export function degreesToRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export function radiansToDegrees(radians: number): number {
  return Math.round(radians * (180 / Math.PI));
}

export function normalizeAngle(angle: number): number {
  const tempAngle = angle % (2 * Math.PI);

  if (angle >= 0) {
    return tempAngle;
  }

  return tempAngle + 2 * Math.PI;
}

export function constrain(num: number, low: number, high: number): number {
  return Math.max(Math.min(num, high), low);
}

export function map(
  num: number,
  start1: number, stop1: number, start2: number, stop2: number, withinBounds = false): number {
  const newValue =
    ((num - start1) / (stop1 - start1)) * (stop2 - start2) + start2;

  if (!withinBounds) {
    return newValue;
  }

  if (start2 < stop2) {
    return constrain(newValue, start2, stop2);
  } else {
    return constrain(newValue, stop2, start2);
  }
}
