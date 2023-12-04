export function toFraction(num: number = 0, tolerance = 0.0001): string {
  if (isNaN(num)) {
    throw new Error("Number must be an integer");
  }
  if (num === 0) return "0";
  if (num < 0) num = -num;
  let n = 1,
    den = 1;
  const iterate = () => {
    let r = n / den;
    if (Math.abs((r - num) / num) < tolerance) return;
    if (r < num) n++;
    else den++;
    iterate();
  };
  iterate();
  return `${n}/${den}`;
}
