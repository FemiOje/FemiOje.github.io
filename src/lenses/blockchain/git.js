// The commit the site was built from, for the colophon. Plain JS: the project carries no Node typings.
import { execSync } from 'node:child_process';

/** @returns {string} */
export function gitSha() {
  try {
    return execSync('git rev-parse --short HEAD', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
  } catch {
    return '[git sha]';
  }
}
