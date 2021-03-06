import { Accelerator, Modifier, NonModifier, NormalizedModifier, NormalizedNonModifier } from "./keys"
import { InputProperty } from "./input"

// Given a valid accelerator string, split it into
// its `Modifier`s and `NonModifier`s components
export const split = <S extends string>(
  accelerator: Accelerator<S>
): [Modifier[], NonModifier[]] => {
  const components = accelerator.split("+")

  const modifiers = components.filter(
    (c): c is Modifier => isModifier(c)
  )

  const rest = components.filter(
    (c): c is NonModifier => !isModifier(c)
  )

  return [modifiers, rest]
}

// Given a list of `Modifier`s, return its normalised subset
export const normalizeModifiers = (
  modifiers: Modifier[]
): NormalizedModifier[] => [
  ...new Set(modifiers.map(normalizeModifier))
]

// Given a `NormalizedModifier`, map it to the corresponding
// input property of an Electron Input event
export const normalizedModifierToInputProperty = (
  normalizedModifier: NormalizedModifier
): InputProperty => {
  switch (normalizedModifier) {
    case "Super":
    case "Cmd":
      return "meta"
    case "Ctrl":
    case "AltGr":
      return "control"
    case "Shift":
      return "shift"
    case "Alt":
      return "alt"
    case "CmdOrCtrl":
      // https://github.com/electron/electron/blob/master/docs/api/accelerator.md#platform-notice
      return process.platform === "darwin"
        ? "meta"
        : "control"
  }
}

export const constVoid = (): void => {}

// `Modifier` type guard
export const isModifier = (
  str: string
): str is Modifier => [
  "Command",
  "Cmd",
  "Control",
  "Ctrl",
  "CommandOrControl",
  "CmdOrCtrl",
  "Alt",
  "AltGr",
  "Shift",
  "Super"
].includes(str)

// Normalize a `Modifier` key to a common subset
export const normalizeModifier = (
  modifier: Modifier
): NormalizedModifier => {
  switch (modifier) {
    case "Cmd":
    case "Command":
      return "Cmd"

    case "CmdOrCtrl":
    case "CommandOrControl":
      return "CmdOrCtrl"

    case "Control":
    case "Ctrl":
      return "Ctrl"

    default:
      return modifier
  }
}

// Normalize a `NonModifier` key to a common subset
export const normalizeNonModifier = (
  nonMod: NonModifier,
): NormalizedNonModifier => {
  switch (nonMod) {
    case "Return":
      return "Enter"
    
    case "Esc":
      return "Escape"

    case "Up":
      return "ArrowUp"
    case "Down":
      return "ArrowDown"
    case "Left":
      return "ArrowLeft"
    case "Right":
      return "ArrowRight"

    default:
      return nonMod
  }
}