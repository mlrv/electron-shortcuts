export const inputProperties = [
  "shift",
  "control",
  "alt",
  "meta"
] as const

export type InputProperty = typeof inputProperties[number]