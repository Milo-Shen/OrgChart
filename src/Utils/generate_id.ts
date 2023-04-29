let id = 0;

export function generate_id(): string {
  return `id=${id++}`;
}

export function range(max: number) {
  return Math.ceil(Math.random() * max);
}
