import { readFileSync } from 'fs';

export function load(path: string) {
  return JSON.parse(readFileSync(path, 'utf8'));
}
