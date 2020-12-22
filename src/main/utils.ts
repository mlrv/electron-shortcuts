import { Accelerator, Modifier, NonModifier, NormalizedModifier } from "./keys"
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
    (c): c is NonModifier => !isModifier(c) // something better?
  )

  return [modifiers, rest]
}

// Given a list of `Modifier`s, return its normalised subset
export const normalizeModifiers = (
  modifiers: Modifier[]
): NormalizedModifier[] => [
  ...new Set(modifiers.map(normalizeModifier)) // see if I want to keep this
]

// Given a `NormalizedModifier`, map it to the corresponding
// input property of an Electron Input event
export const normalizedModifierToInputProperty = (
  normalizedModifier: NormalizedModifier
): InputProperty => {
  switch (normalizedModifier) {
    case "Super": // could do this earlier
    case "Cmd":
      return "meta"
    case "Ctrl":
    case "AltGr":
      return "control"
    case "Shift":
      return "shift"
    case "Alt":
      return "alt"
  }
}

export const constVoid = (): void => {}

// `Modifier` type guard
const isModifier = (
  str: string
): str is Modifier => [
  "Command",
  "Cmd",
  "Control",
  "Ctrl",
  "CommandOrControl",
  "CmdOrCtrl",
  "Alt",
  "Option",
  "AltGr",
  "Shift",
  "Super"
].includes(str)

// Normalize a `Modifier` key to a common subset
const normalizeModifier = (
  modifier: Modifier
): NormalizedModifier => {
  switch (modifier) { // Verify
    case "Cmd":
    case "Command":
    case "CmdOrCtrl":
    case "CommandOrControl":
      return "Cmd"

    case "Alt":
    case "Option":
      return "Alt"

    case "Control":
    case "Ctrl":
      return "Ctrl"

    default:
      return modifier
  }
}
