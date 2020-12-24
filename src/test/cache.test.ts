import { BrowserWindow } from "electron"
import { getShortcutLocal, setShortcutLocal, deleteShortcutLocal, getShortcutGlobal, setShortcutGlobal, deleteShortcutGlobal, setShortcutOnAll, getShortcutOnAll, deleteShortcutOnAll  } from "../main/cache"
import { constVoid } from "../main/utils"

const window = (id: number): BrowserWindow => ({
  id,
  webContents: {}
}) as BrowserWindow

describe("cache", () => {

  describe("local shortcuts", () => {

    it("should return undefined for an unset local shortcut", () => {
      expect(
        getShortcutLocal(
          "Cmd+a",
          window(Math.random())
        )
      ).toBeUndefined()
    })

    it("should return the correct value for a set local shortcut", () => {
      const accelerator = "Cmd+a"
      const win = window(Math.random())
      const handler = constVoid

      setShortcutLocal(accelerator, win, handler)

      expect(
        getShortcutLocal(
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

      setShortcutLocal(accelerator, win, handler)
      deleteShortcutLocal(accelerator, win)

      expect(
        getShortcutLocal(
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

      setShortcutLocal(accelerator, win, handler1)
      setShortcutLocal(accelerator, win, handler2)

      expect(
        getShortcutLocal(
          accelerator,
          win
        )
      ).toEqual([
        handler2,
        {}
      ])
    })

  })

  describe("shortcuts on all", () => {

    it("should return undefined for an unset shortcut on all pages", () => {
      expect(
        getShortcutGlobal(
          "Cmd+a"
        )
      ).toBeUndefined()
    })

    it("should return the correct value for a shortcut set on all pages", () => {
      const accelerator = "Cmd+a"
      const handler = constVoid

      setShortcutOnAll(accelerator, handler)

      expect(
        getShortcutOnAll(
          accelerator
        )
      ).toEqual(handler)
    })

    it("should return undefined for a set and deleted shortcut on all pages", () => {
      const accelerator = "Cmd+a"
      const handler = constVoid

      setShortcutOnAll(accelerator, handler)
      deleteShortcutOnAll(accelerator)

      expect(
        getShortcutGlobal(
          accelerator
        )
      ).toBeUndefined()
    })

    it("should return the most up to date value", () => {
      const accelerator = "Cmd+a"

      const handler1 = constVoid
      const handler2 = (_: any, b: any) => b

      setShortcutOnAll(accelerator, handler1)
      setShortcutOnAll(accelerator, handler2)

      expect(
        getShortcutOnAll(
          accelerator
        )
      ).toEqual(handler2)
    })

  })

})