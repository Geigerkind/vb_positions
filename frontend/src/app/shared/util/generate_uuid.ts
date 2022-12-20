export function generate_uuid(length: number = 5): string {
  let randomString = "";
  while (randomString.length < length) {
    randomString += Math.random().toString(36).substring(2, 7);
  }
  return randomString.substring(0, length);
}
