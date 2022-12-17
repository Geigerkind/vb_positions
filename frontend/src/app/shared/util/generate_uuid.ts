export function generate_uuid(): string {
  return Math.random().toString(36).substring(2, 7);
}
