function degreesToRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

function normalizeAngle(angle) {
  let tempAngle = angle % (2 * Math.PI);

  if (angle < 0) {
    tempAngle = 2 * Math.PI + angle;
  }

  return tempAngle;
}
