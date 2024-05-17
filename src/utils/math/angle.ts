export function degreeToRadian(degrees: number) {
  // Store the value of pi.
  const pi = Math.PI;
  // Multiply degrees by pi divided by 180 to convert to radians.
  return degrees * (pi / 180);
}

export function radianToDegree(radian: number) {
  return radian * (180 / Math.PI);
}
