/**
 * global type declarations in this project
 * should not expose to userland
 */
import 'reflect-metadata'

declare global {
  const process: {
    env: {
      NODE_ENV: string
    }
  }
}