export function intOrStrToInt(x: string | number) {
  return typeof x === 'number' ? x : parseInt(x, 10);
}
