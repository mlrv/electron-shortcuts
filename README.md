# Electron Shortcuts

Type Safe Electron shortcuts

## Overview

`electron-shortcuts` is a tiny, dependency-free library for writing type-safe Electron shortcuts.

Under the hood, [Template Literal Types](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html) are used to ensure that the shortcuts you write are valid [Electron Accelerators](https://github.com/electron/electron/blob/master/docs/api/accelerator.md#accelerator), and event listeners are used to act on shortcuts at runtime.

The main focus of the library is to provide a small set of APIs that are expressive, orthogonal, and safe to use at compile time.

**Note that Typescript 4.1.0 or greater is required for Template Literal Types.**

## Usage

```typescript
import { BrowserWindow } from "electron"
import { register } from "electron-shortcuts"

const mainWindow = new BrowserWindow()

register("Command+a",    () => {}, mainWindow) // OK
register("Cmd+Shift+a",  () => {}, mainWindow) // OK
register("CmdOrCtrl+Up", () => {}, mainWindow) // OK
register("Alt+;",        () => {}, mainWindow) // OK
register("Alt",          () => {}, mainWindow) // Not OK, key code missing
register("F10",          () => {}, mainWindow) // Not OK, modifier missing
register("Comand+F1",    () => {}, mainWindow) // Not OK, "Command" is mispelled
register("Shift+a+b",    () => {}, mainWindow) // Not OK, you can't use two key codes ("a" and "b")
register("CmdOrCtrl+aa", () => {}, mainWindow) // Not OK, "aa" is not a valid key code
```

### Validation rules

The same [validation rules](https://github.com/electron/electron/blob/master/docs/api/accelerator.md#accelerator) used for Electron Accelerators are used here. In essence, for a string to be a valid Accelerator it needs:
- At least one [Modifier](https://github.com/electron/electron/blob/master/docs/api/accelerator.md#available-modifiers)
- Exactly one [Key Code](https://github.com/electron/electron/blob/master/docs/api/accelerator.md#available-key-codes)

### Platform specific behavior

From the official [Electron Accelerator docs](https://github.com/electron/electron/blob/master/docs/api/accelerator.md#platform-notice)

> On Linux and Windows, the Command key does not have any effect so use CommandOrControl which represents Command on macOS and Control on Linux and Windows to define some accelerators.

> Use Alt instead of Option. The Option key only exists on macOS, whereas the Alt key is available on all platforms.

> The Super key is mapped to the Windows key on Windows and Linux and Cmd on macOS.

Because of the second point, we decided to remove `Option` as a valid `Modifier`. Just use `Alt` and avoid any unwanted behaviour on different platforms.

## APIs

The library exposed the following APIs

```typescript
export declare const isRegisteredLocal: <S extends string>(accelerator: Accelerator<S>, window: BrowserWindow) => boolean
export declare const isRegisteredOnAll: <S extends string>(accelerator: Accelerator<S>) => boolean
export declare const isRegisteredGlobal: <S extends string>(accelerator: Accelerator<S>) => boolean

export declare const register: <S extends string>(accelerator: Accelerator<S>, f: () => void, window: BrowserWindow, options?: RegisterOptions) => void
export declare const unregister: <S extends string>(accelerator: Accelerator<S>, window: BrowserWindow) => void

export declare const registerOnAll: <S extends string>(accelerator: Accelerator<S>, f: () => void, options?: RegisterOptions) => void
export declare const unregisterOnAll: <S extends string>(accelerator: Accelerator<S>) => void

export declare const registerGlobal: <S extends string>(accelerator: Accelerator<S>, f: () => void) => void
export declare const unregisterGlobal: <S extends string>(accelerator: Accelerator<S>) => void
```

### Usage

- Local Shortcuts. In this case, _local_ means that the shortcut will only be executed when the relevant key presses are made when the window is focused

```typescript
const mainWindow = new BrowserWindow()
const anotherWindow = new BrowserWindow()

isRegisteredLocal("Cmd+a", mainWindow) // false

register("Cmd+a", () => console.log("a"), mainWindow)

isRegisteredLocal("Cmd+a", mainWindow) // true
isRegisteredLocal("Cmd+a", anotherWindow) // false

register("Cmd+a", () => console.log("b"), mainWindow) // override the previous one

unregister("Cmd+a", mainWindow) // remove shortcut from mainWindow
```

- Local Shortcuts on all windows (current and future ones)

```typescript
const mainWindow = new BrowserWindow()

isRegisteredOnAll("Cmd+a") // false

registerOnAll("Cmd+a", () => console.log("a"))

isRegisteredOnAll("Cmd+a") // true

const anotherWindow = new BrowserWindow() // this window will also have the shortcut enabled

registerOnAll("Cmd+a", () => console.log("b")) // override the previous one on all current and future windows

unregisterOnAll("Cmd+a") // remove shortcut from all current and future windows
```

- Global Shortcuts. These functions are simply type-safe wrappers around the standard `globalShortcut` object exposed by Electron, note that shortcuts defined like this will be executed even when the application is not focused by the user

```typescript
isRegisteredGlobal("Cmd+a") // false

registerGlobal("Cmd+a", () => console.log("a"))

isRegisteredGlobal("Cmd+a") // true

const anotherWindow = new BrowserWindow() // this window will also have the shortcut enabled

registerGlobal("Cmd+a", () => console.log("b")) // override the previous one
```

- RegisterOptions

  - `strict` (default to `false`)

```typescript
const mainWindow = new BrowserWindow()

register("Cmd+a", () => console.log("a"), mainWindow, { strict: false }) // will execute for Cmd+Shift+a
register("Cmd+a", () => console.log("b"), mainWindow, { strict: true }) // will not execute for Cmd+Shift+a
```

## Contributing

Contributions of any kind are much appreciated!

### Tests

Unit tests
```
npm run test:unit
```

End to end tests
```
npm run test:e2e
```
