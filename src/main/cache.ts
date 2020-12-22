import { Accelerator } from "./keys"
import { BrowserWindow, Input, Event, WebContents } from "electron"

const localShortcutMap: Record<string, [
  (_: Event, i: Input) => void,
  WebContents,
]> = {}

const globalShortcutMap: Record<string, (_: Event, w: BrowserWindow) => void> = {}

export const getLocalShortcut = <S extends string>(
  accelerator: Accelerator<S>,
  window: BrowserWindow,
): [(_: Event, i: Input) => void, WebContents] =>
  localShortcutMap[`${accelerator}-${window.id}`]

export const setLocalShortcut = <S extends string>(
  accelerator: Accelerator<S>,
  window: BrowserWindow,
  handler: (_: Event, i: Input) => void,
): void => {
  localShortcutMap[`${accelerator}-${window.id}`] = [
    handler,
    window.webContents
  ]
}

export const deleteLocalShortcut = <S extends string>(
  accelerator: Accelerator<S>,
  window: BrowserWindow,
): void => {
  delete localShortcutMap[`${accelerator}-${window.id}`]
}

export const getGlobalShortcut = <S extends string>(
  accelerator: Accelerator<S>,
): (_: Event, w: BrowserWindow) => void =>
  globalShortcutMap[accelerator]

export const setGlobalShortcut = <S extends string>(
  accelerator: Accelerator<S>,
  handler: (_: Event, w: BrowserWindow) => void,
): void => {
  globalShortcutMap[accelerator] = handler
}

export const deleteGlobalShortcut = <S extends string>(
  accelerator: Accelerator<S>,
): void => {
  delete globalShortcutMap[accelerator]
}
