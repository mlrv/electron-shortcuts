import { Application } from "spectron"
import * as path from "path"

const electronPath = require('electron')
const ks = require('node-keys-simulator')

describe("main", () => {

  let app: Application

  beforeEach(
    async () => {
      app = new Application({
        path: electronPath,
        args: [path.join(__dirname, '../../dist/examples/register/register.js')]
      })

      return await app.start()
    }
  )

  afterEach(
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
  })

  it("should execute a registed shortcut", async () => {
    const title1 = await app.client.getTitle()

    await ks.sendCombination(['shift', 'x']);

    const title2 = await app.client.getTitle()

    expect(title1).toEqual("Start")
    expect(title2).toEqual("Register")
  })

})