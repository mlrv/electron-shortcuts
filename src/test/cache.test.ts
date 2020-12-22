import { BrowserWindow } from "electron"
import { getLocalShortcut, setLocalShortcut, deleteGlobalShortcut, getGlobalShortcut, setGlobalShortcut, deleteLocalShortcut } from "../main/cache"
import { constVoid } from "../main/utils"

const window = (id: number): BrowserWindow => ({
  id,
  webContents: {}
}) as BrowserWindow

describe("cache", () => {

  describe("local shortcuts", () => {

    it("should return undefined for an unset local shortcut", () => {
      expect(
        getLocalShortcut(
          "Cmd+a",
          window(Math.random())
        )
      ).toBeUndefined()
    })

    it("should return the correct value for a set local shortcut", () => {
      const accelerator = "Cmd+a"
      const win = window(Math.random())
      const handler = constVoid

      setLocalShortcut(accelerator, win, handler)

      expect(
        getLocalShortcut(
          accelerator,
          win
        )
      ).toEqual([
        handler,
        {}
      ])
    })

    it("should return undefined for a set and deleted local shortcut", () => {
      const accelerator = "Cmd+a"
      const win = window(Math.random())
      const handler = constVoid

      setLocalShortcut(accelerator, win, handler)
      deleteLocalShortcut(accelerator, win)

      expect(
        getLocalShortcut(
          accelerator,
          win
        )
      ).toBeUndefined()
    })

    it("should return the most up to date value", () => {
      const accelerator = "Cmd+a"
      const win = window(Math.random())

      const handler1 = constVoid
      const handler2 = (_: any, b: any) => b

      setLocalShortcut(accelerator, win, handler1)
      setLocalShortcut(accelerator, win, handler2)

      expect(
        getLocalShortcut(
          accelerator,
          win
        )
      ).toEqual([
        handler2,
        {}
      ])
    })

  })

  describe("global shortcuts", () => {

    it("should return undefined for an unset global shortcut", () => {
      expect(
        getGlobalShortcut(
          "Cmd+a"
        )
      ).toBeUndefined()
    })

    it("should return the correct value for a set global shortcut", () => {
      const accelerator = "Cmd+a"
      const handler = constVoid

      setGlobalShortcut(accelerator, handler)

      expect(
        getGlobalShortcut(
          accelerator
        )
      ).toEqual(handler)
    })

    it("should return undefined for a set and deleted global shortcut", () => {
      const accelerator = "Cmd+a"
      const handler = constVoid

      setGlobalShortcut(accelerator, handler)
      deleteGlobalShortcut(accelerator)

      expect(
        getGlobalShortcut(
          accelerator
        )
      ).toBeUndefined()
    })

    it("should return the most up to date value", () => {
      const accelerator = "Cmd+a"

      const handler1 = constVoid
      const handler2 = (_: any, b: any) => b

      setGlobalShortcut(accelerator, handler1)
      setGlobalShortcut(accelerator, handler2)

      expect(
        getGlobalShortcut(
          accelerator
        )
      ).toEqual(handler2)
    })

  })

})