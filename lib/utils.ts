export const memory = {
  logEnabled: false
}

export function log(...args: any) {
  if (memory.logEnabled) {
    console.log(...args)
  }
}
