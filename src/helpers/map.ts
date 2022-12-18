export function map(
  num: number,
  start1: number,
  stop1: number,
  start2: number,
  stop2: number,
  withinBounds = false
): number {
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

function constrain(num: number, low: number, high: number): number {
  return Math.max(Math.min(num, high), low);
}
