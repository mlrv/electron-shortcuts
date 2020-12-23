import { app, BrowserWindow } from "electron"
import { register, unregister } from "../../src/main/main"
import * as path from "path"

function createWindow() {
  const mainWindow = new BrowserWindow()

  mainWindow.loadFile(path.join(__dirname, "../../../examples/start.html"))

  unregister('Shift+a', mainWindow)

  register('Cmd+a', () => {
    mainWindow.loadFile(path.join(__dirname, "../../../examples/unregister/unregister_1.html"))
  }, mainWindow)

  unregister('Cmd+a', mainWindow)

}

app.on("ready", () => {
  createWindow()
})

