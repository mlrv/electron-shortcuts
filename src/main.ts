import { Accelerator, Modifier, NonModifier, NormalizedModifier, RegisterOptions } from "./keys"
import { BrowserWindow, Input, Event, app, WebContents } from "electron"
import { constVoid } from "./utils"
import { InputProperty, inputProperties } from "./input"

// Given a valid accelerator string, split it into
// its `Modifier`s and `NonModifier`s components
const split = <S extends string>(
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

// Given a list of `Modifier`s, return its normalised subset
const normalizeModifiers = (
  modifiers: Modifier[]
): NormalizedModifier[] => [
  ...new Set(modifiers.map(normalizeModifier)) // see if I want to keep this
]

// Given a `NormalizedModifier`, map it to the corresponding
// input property of an Electron Input event
const normalizedModifierToInputProperty = (
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

const localShortcutMap: Record<string, [ // lifecycle?
  (_: Event, i: Input) => void,
  WebContents,
]> = {}

const globalShortcutMap: Record<string, (_: Event, w: BrowserWindow) => void> = {}

export const isRegistered = <S extends string>(
  accelerator: Accelerator<S>,
  window: BrowserWindow,
): boolean => { // return something else? Maybe the windows?
  return !!localShortcutMap[`${accelerator}-${window.id}`]
}

// Register a shortcut for the given accelerator string
// on the given window
export const register = <S extends string>(
  accelerator: Accelerator<S>,
  f: () => void,
  window: BrowserWindow,
  options?: RegisterOptions,
): void => {
  // `strict` is false if not specified
  const strict = options?.strict || false

  // Break down the accelerator into modifiers and non-modifiers,
  // then, find the associated input properties
  const [modifiers, [nonModifier]] = split(accelerator)
  const inputModifiers = normalizeModifiers(modifiers).map(
    normalizedModifierToInputProperty
  )

  // The modifiers check to perform when `strict` is enabled
  const modifiersCheckStrict = (i: Input): boolean => {
    const excessInputProperties = inputProperties.filter(
      p => !inputModifiers.includes(p)
    )

    return modifiersCheckNonStrict(i) && excessInputProperties.every(
      mod => !i[mod]
    )
  }

  // The modifiers check to perform when `strict` is not enabled
  const modifiersCheckNonStrict = (i: Input): boolean =>
    inputModifiers.every(
      mod => i[mod]
    )

  const modifiersCheck: (i: Input) => boolean = strict
    ? modifiersCheckStrict
    : modifiersCheckNonStrict
  
  // Ignore key up events, and perform the relevant checks
  // on key down events
  const onKeyUp = (): void => constVoid()
  const onKeyDown = (input: Input): void => {
    return input.key.toLowerCase() === nonModifier.toLowerCase() && modifiersCheck(
      input
    ) ? f() : constVoid()
  }

  // Actual handler to attach to the webContents
  const handler = (_: Event, i: Input): void =>
    i.type === 'keyUp'
      ? onKeyUp()
      : onKeyDown(i)

  // If there was a previous shortcut registed with the same accelerator
  // on the same window, override it 
  const unregisterPreviousIfNeeded = (w: BrowserWindow) => isRegistered(accelerator, w)
    ? unregister(accelerator, w)
    : constVoid()

  // Actual registration process
  const register = (w: BrowserWindow): void => {
    unregisterPreviousIfNeeded(w)

    // Keep reference to local shortcut in case we need to
    // unregister it later
    localShortcutMap[`${accelerator}-${w.id}`] = [handler, w.webContents]

    // Attach listener to webContents of the window
    w.webContents.on(
      'before-input-event',
      handler 
    )
  }

  return register(
    window
  )
}

// Register a shortcut for the given accelerator on all current
// and future windows
export const registerOnAll = <S extends string>(
  accelerator: Accelerator<S>,
  f: () => void,
  options?: RegisterOptions,
): void => {
  const windows = BrowserWindow.getAllWindows()

  // Handler to register the shortcut for new windows
  const handler = (_: Event, w: BrowserWindow): void =>
    register(accelerator, f, w, options)

  // Register shortcut for new windows
  app.on('browser-window-created', handler)

  // Keep reference to global shortcut in case
  // we need to unregister it later
  globalShortcutMap[accelerator] = handler

  return windows.forEach(
    win => register(accelerator, f, win, options)
  )
}

// Unregister the given accelerator from the given
// window
export const unregister = <S extends string>(
  accelerator: Accelerator<S>,
  window: BrowserWindow,
): void => {
  const webContents = localShortcutMap[`${accelerator}-${window.id}`]?.[1] // Abstract this pattern
  const handler = localShortcutMap[`${accelerator}-${window.id}`]?.[0]

  webContents
    ? webContents.removeListener("before-input-event", handler)
    : constVoid()
}

// Unregister the given accelerator from all current
// and future windows
export const unregisterOnAll = <S extends string>(
  accelerator: Accelerator<S>,
): void => {
  const windows = BrowserWindow.getAllWindows()

  //
  const globalHandler = globalShortcutMap[accelerator]
  globalHandler
    ? app.removeListener("browser-window-created", globalHandler)
    : constVoid()

  //
  return windows.forEach(
    win => unregister(accelerator, win)
  )
}
