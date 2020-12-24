import { app, BrowserWindow } from "electron"
import { isRegisteredLocal, register, registerGlobal, registerOnAll, unregister } from "../../src/main/main"
import * as path from "path"

function createWindow() {
  const mainWindow = new BrowserWindow()

  mainWindow.loadFile(path.join(__dirname, "../../../examples/start.html"))

  register('Shift+a', () => {
    if (isRegisteredLocal("Cmd+a", mainWindow)) {
      mainWindow.loadFile(path.join(__dirname, "../../../examples/isRegisteredLocal/isRegisteredLocal_1.html"))
    }
  }, mainWindow)

  register('Shift+b', () => {
    register("Cmd+b", () => {}, mainWindow)

    if (isRegisteredLocal("Cmd+b", mainWindow)) {
      mainWindow.loadFile(path.join(__dirname, "../../../examples/isRegisteredLocal/isRegisteredLocal_1.html"))
    }
  }, mainWindow)

  register('Shift+c', () => {
    register("Cmd+c", () => {}, mainWindow)
    unregister("Cmd+c", mainWindow)

    if (isRegisteredLocal("Cmd+c", mainWindow)) {
      mainWindow.loadFile(path.join(__dirname, "../../../examples/isRegisteredLocal/isRegisteredLocal_2.html"))
    }
  }, mainWindow)

  register('Shift+d', () => {
    registerOnAll("Cmd+d", () => {})

    if (isRegisteredLocal("Cmd+d", mainWindow)) {
      mainWindow.loadFile(path.join(__dirname, "../../../examples/isRegisteredLocal/isRegisteredLocal_3.html"))
    }
  }, mainWindow)

  register('Shift+e', () => {
    registerGlobal("Cmd+e", () => {})

    if (isRegisteredLocal("Cmd+e", mainWindow)) {
      mainWindow.loadFile(path.join(__dirname, "../../../examples/isRegisteredLocal/isRegisteredLocal_4.html"))
    }
  }, mainWindow)

}

app.on("ready", () => {
  createWindow()
})

