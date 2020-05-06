function degreesToRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

function radiansToDegrees(radians) {
  return Math.round(radians * (180 / Math.PI));
}

function normalizeAngle(angle) {
  let tempAngle = angle; // % (2 * Math.PI);

  if (angle < 0) {
    tempAngle += 2 * Math.PI;
  }

  return tempAngle;
}

function constrain(num, low, high) {
  return Math.max(Math.min(num, high), low);
}

function map(num, start1, stop1, start2, stop2, withinBounds) {
  let newValue =
    ((num - start1) / (stop1 - start1)) * (stop2 - start2) + start2;

  if (!withinBounds) return newValue;

  if (start2 < stop2) {
    return this.constrain(newValue, start2, stop2);
  } else {
    return this.constrain(newValue, stop2, start2);
  }
}
