import { Application } from "spectron"
import * as path from "path"

const electronPath = require("electron")
const ks = require("node-keys-simulator")

describe("isRegisteredGlobal", () => {

  let app: Application

  beforeAll(
    async () => {
      app = new Application({
        path: electronPath,
        args: [path.join(__dirname, "../../dist/e2e/isRegisteredGlobal/isRegisteredGlobal.js")]
      })

      return await app.start()
    }
  )

  afterAll(
    async () => {
      if (app && app.isRunning()) {
        return await app.client.execute(
          () => window.close()
        )
      } else {
        return
      }
    }
  )

  it("should start the example app", async () => {
    const winCount = await app.client.getWindowCount()

    expect(winCount).toEqual(1)
  }, 10000)

  it("should return false for a non-registered global shortcut", async () => {
    await ks.sendCombination(["shift", "a"]);

    const title = await app.client.getTitle()

    expect(title).toEqual("start")
  }, 10000)

  it("should return false for a registered local shortcut", async () => {
    await ks.sendCombination(["shift", "b"]);

    const title = await app.client.getTitle()

    expect(title).toEqual("start")
  }, 10000)

  it("should return true for a registered global shortcut", async () => {
    await ks.sendCombination(["shift", "c"]);

    const title = await app.client.getTitle()

    expect(title).toEqual("isRegisteredGlobal_2")
  }, 10000)

  it("should return false for a registered then unregistered global shortcut", async () => {
    await ks.sendCombination(["shift", "d"]);

    const title = await app.client.getTitle()

    expect(title).toEqual("isRegisteredGlobal_2")
  }, 10000)


})