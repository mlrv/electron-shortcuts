import { app, BrowserWindow, globalShortcut } from "electron"
import { isRegistered, register, registerOnAll, unregister, unregisterOnAll, registerGlobal, unregisterGlobal } from "../src/main/main"
import * as path from "path"


function createWindow() {
  const mainWindow = new BrowserWindow({
    webPreferences: {}
  })

  mainWindow.loadFile(path.join(__dirname, "../../example/index.html"))

  // register('Cmd+a', () => {console.log(9999999)}, mainWindow)
  // unregister('Cmd+a', mainWindow)
  // console.log(isRegistered('Cmd+a', mainWindow))
  // registerGlobal('Cmd+;', () => console.log(1))
  // unregisterGlobal('Cmd+;', () => console.log(1))
}

app.on("ready", () => {
  createWindow()

  // app.on("activate", function () {
  //   // On macOS it's common to re-create a window in the app when the
  //   // dock icon is clicked and there are no other windows open.
  //   if (BrowserWindow.getAllWindows().length === 0) createWindow()
  // })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
// app.on("window-all-closed", () => {
//   if (process.platform !== "darwin") {
//     app.quit()
//   }
// })
