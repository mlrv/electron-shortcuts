import { app, BrowserWindow } from "electron"
import { isRegisteredOnAll, register, registerGlobal, registerOnAll, unregisterOnAll } from "../../src/main/main"
import * as path from "path"

function createWindow() {
  const mainWindow = new BrowserWindow()

  mainWindow.loadFile(path.join(__dirname, "../../../e2e/start.html"))

  register('Shift+a', () => {
    if (isRegisteredOnAll("Cmd+a")) {
      mainWindow.loadFile(path.join(__dirname, "../../../e2e/isRegisteredOnAll/isRegisteredOnAll_1.html"))
    }
  }, mainWindow)

  register('Shift+b', () => {
    registerOnAll("Cmd+b", () => {})

    if (isRegisteredOnAll("Cmd+b")) {
      mainWindow.loadFile(path.join(__dirname, "../../../e2e/isRegisteredOnAll/isRegisteredOnAll_1.html"))
    }
  }, mainWindow)

  register('Shift+c', () => {
    registerGlobal("Cmd+c", () => {})

    if (isRegisteredOnAll("Cmd+c")) {
      mainWindow.loadFile(path.join(__dirname, "../../../e2e/isRegisteredOnAll/isRegisteredOnAll_2.html"))
    }
  }, mainWindow)

  register('Shift+d', () => {
    registerOnAll("Cmd+d", () => {})
    unregisterOnAll("Cmd+d")

    if (isRegisteredOnAll("Cmd+d")) {
      mainWindow.loadFile(path.join(__dirname, "../../../e2e/isRegisteredOnAll/isRegisteredOnAll_3.html"))
    }
  }, mainWindow)

}

app.on("ready", () => {
  createWindow()
})

