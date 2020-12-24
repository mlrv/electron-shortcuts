import { Application } from "spectron"
import * as path from "path"

const electronPath = require("electron")
const ks = require("node-keys-simulator")

describe("register", () => {

  let app: Application

  beforeAll(
    async () => {
      app = new Application({
        path: electronPath,
        args: [path.join(__dirname, "../../dist/e2e/register/register.js")]
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

  it("should execute a registed shortcut with one modifier", async () => {
    await ks.sendCombination(["shift", "a"]);

    const title = await app.client.getTitle()

    expect(title).toEqual("register_1")
  }, 10000)

  it("should execute a registed shortcut with two modifiers", async () => {
    await ks.sendCombination(["meta", "shift", "a"]);

    const title = await app.client.getTitle()

    expect(title).toEqual("register_2")
  }, 10000)

  it("should execute a registed shortcut with three modifiers", async () => {
    await ks.sendCombination(["meta", "shift", "control", "a"]);

    const title = await app.client.getTitle()

    expect(title).toEqual("register_3")
  }, 10000)

  it("should execute a registed strict shortcut", async () => {
    await ks.sendCombination(["shift", "b"]);

    const title = await app.client.getTitle()

    expect(title).toEqual("register_4")
  }, 10000)

  it("should not execute a registed strict shortcut if extra keys are pressed", async () => {
    await ks.sendCombination(["shift", "alt", "b"]);

    const title = await app.client.getTitle()

    expect(title).toEqual("register_4")
  }, 10000)

  it("should override shortcuts", async () => {
    await ks.sendCombination(["meta", ";"]);

    const title = await app.client.getTitle()

    expect(title).toEqual("register_4")
  }, 10000)

})