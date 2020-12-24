import { app, BrowserWindow } from "electron"
import { isRegisteredGlobal, register, registerGlobal, registerOnAll, unregister, unregisterGlobal } from "../../src/main/main"
import * as path from "path"

function createWindow() {
  const mainWindow = new BrowserWindow()

  mainWindow.loadFile(path.join(__dirname, "../../../examples/start.html"))

  register('Shift+a', () => {
    if (isRegisteredGlobal("Cmd+a")) {
      mainWindow.loadFile(path.join(__dirname, "../../../examples/isRegisteredGlobal/isRegisteredGlobal_1.html"))
    }
  }, mainWindow)

  register('Shift+b', () => {
    register("Cmd+b", () => {}, mainWindow)

    if (isRegisteredGlobal("Cmd+b")) {
      mainWindow.loadFile(path.join(__dirname, "../../../examples/isRegisteredGlobal/isRegisteredGlobal_1.html"))
    }
  }, mainWindow)

  register('Shift+c', () => {
    registerGlobal("Cmd+c", () => {})

    if (isRegisteredGlobal("Cmd+c")) {
      mainWindow.loadFile(path.join(__dirname, "../../../examples/isRegisteredGlobal/isRegisteredGlobal_2.html"))
    }
  }, mainWindow)

  register('Shift+d', () => {
    registerGlobal("Cmd+d", () => {})
    unregisterGlobal("Cmd+d")

    if (isRegisteredGlobal("Cmd+d")) {
      mainWindow.loadFile(path.join(__dirname, "../../../examples/isRegisteredGlobal/isRegisteredGlobal_3.html"))
    }
  }, mainWindow)

}

app.on("ready", () => {
  createWindow()
})

