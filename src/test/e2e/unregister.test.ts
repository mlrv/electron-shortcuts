import { Application } from "spectron"
import * as path from "path"

const electronPath = require("electron")
const ks = require("node-keys-simulator")

describe("unregister", () => {

  let app: Application

  beforeAll(
    async () => {
      app = new Application({
        path: electronPath,
        args: [path.join(__dirname, "../../../dist/e2e/unregister/unregister.js")]
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

  it("should do nothing when unregistering a non existing shortcut", async () => {
    await ks.sendCombination(["shift", "a"]);

    const title = await app.client.getTitle()

    expect(title).toEqual("start")
  }, 10000)

  it("should unregister an existing shortcut", async () => {
    await ks.sendCombination(["cmd", "a"]);

    const title = await app.client.getTitle()

    expect(title).toEqual("start")
  }, 10000)

})