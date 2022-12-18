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
