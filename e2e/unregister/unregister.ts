import { app, BrowserWindow } from "electron"
import { register, unregister } from "../../src/main/main"
import * as path from "path"

function createWindow() {
  const mainWindow = new BrowserWindow()

  mainWindow.loadFile(path.join(__dirname, "../../../e2e/start.html"))

  unregister('Shift+a', mainWindow)

  register('Cmd+a', () => {
    mainWindow.loadFile(path.join(__dirname, "../../../e2e/unregister/unregister_1.html"))
  }, mainWindow)

  unregister('Cmd+a', mainWindow)

}

app.on("ready", () => {
  createWindow()
})

