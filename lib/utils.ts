export const memory = {
  logEnabled: true
}

export function log(...args: any) {
  if (memory.logEnabled) {
    console.log(...args)
  }
}
