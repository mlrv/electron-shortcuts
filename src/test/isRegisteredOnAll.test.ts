import { Application } from "spectron"
import * as path from "path"

const electronPath = require("electron")
const ks = require("node-keys-simulator")

describe("isRegisteredOnAll", () => {

  let app: Application

  beforeAll(
    async () => {
      app = new Application({
        path: electronPath,
        args: [path.join(__dirname, "../../dist/examples/isRegisteredOnAll/isRegisteredOnAll.js")]
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

  it("should return false for a non-registered shortcut on all pages", async () => {
    await ks.sendCombination(["shift", "a"]);

    const title = await app.client.getTitle()

    expect(title).toEqual("start")
  }, 10000)

  it("should return true for a shortcut registered on all pages", async () => {
    await ks.sendCombination(["shift", "b"]);

    const title = await app.client.getTitle()

    expect(title).toEqual("isRegisteredOnAll_1")
  }, 10000)

  it("should return false for a registered global shortcut", async () => {
    await ks.sendCombination(["shift", "c"]);

    const title = await app.client.getTitle()

    expect(title).toEqual("isRegisteredOnAll_1")
  }, 10000)

  it("should return false for a registered then unregistered shortcut on all pages", async () => {
    await ks.sendCombination(["shift", "d"]);

    const title = await app.client.getTitle()

    expect(title).toEqual("isRegisteredOnAll_1")
  }, 10000)


})