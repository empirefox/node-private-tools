import { pwd } from 'shelljs'

const reqFrom = require('req-from');

export function reqCwd(moduleId) {
  return reqFrom(pwd().toString(), moduleId);
}

export function reqCwdSilent(moduleId): any | null {
  return reqFrom.silent(pwd().toString(), moduleId);
}
