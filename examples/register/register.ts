import { app, BrowserWindow } from "electron"
import { register } from "../../src/main/main"
import * as path from "path"

function createWindow() {
  const mainWindow = new BrowserWindow()

  mainWindow.loadFile(path.join(__dirname, "../../../examples/register/start.html"))

  register('Shift+x', () => {
    mainWindow.loadFile(path.join(__dirname, "../../../examples/register/end.html"))
  }, mainWindow)
}

app.on("ready", () => {
  createWindow()
})

