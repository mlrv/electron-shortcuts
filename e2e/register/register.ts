import { app, BrowserWindow } from "electron"
import { register } from "../../src/main/main"
import * as path from "path"

function createWindow() {
  const mainWindow = new BrowserWindow()

  mainWindow.loadFile(path.join(__dirname, "../../../e2e/start.html"))

  register('Shift+a', () => {
    mainWindow.loadFile(path.join(__dirname, "../../../e2e/register/register_1.html"))
  }, mainWindow)

  register('Cmd+Shift+a', () => {
    mainWindow.loadFile(path.join(__dirname, "../../../e2e/register/register_2.html"))
  }, mainWindow)

  register('Cmd+Shift+Control+a', () => {
    mainWindow.loadFile(path.join(__dirname, "../../../e2e/register/register_3.html"))
  }, mainWindow)

  register('Shift+b', () => {
    mainWindow.loadFile(path.join(__dirname, "../../../e2e/register/register_4.html"))
  }, mainWindow, { strict: true })

  register('Cmd+;', () => {
    mainWindow.loadFile(path.join(__dirname, "../../../e2e/register/register_5.html"))
  }, mainWindow)

  register('Cmd+;', () => {
    
  }, mainWindow)
}

app.on("ready", () => {
  createWindow()
})

