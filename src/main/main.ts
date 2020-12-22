import { Accelerator, RegisterOptions } from "./keys"
import { BrowserWindow, Input, Event, app } from "electron"
import { constVoid, split, normalizeModifiers, normalizedModifierToInputProperty } from "./utils"
import { inputProperties } from "./input"
import { getGlobalShortcut, getLocalShortcut, setGlobalShortcut, setLocalShortcut } from "./cache"

export const isRegistered = <S extends string>(
  accelerator: Accelerator<S>,
  window: BrowserWindow,
): boolean => { // return something else? Maybe the windows?
  return !!getLocalShortcut(accelerator, window)
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
    setLocalShortcut(accelerator, w, handler)

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
  setGlobalShortcut(accelerator, handler)

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
  const handler = getLocalShortcut(accelerator, window)?.[0]
  const webContents = getLocalShortcut(accelerator, window)?.[1]

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
  const globalHandler = getGlobalShortcut(accelerator)
  globalHandler
    ? app.removeListener("browser-window-created", globalHandler)
    : constVoid()

  //
  return windows.forEach(
    win => unregister(accelerator, win)
  )
}
