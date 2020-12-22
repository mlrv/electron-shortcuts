import { Application } from "spectron"
import * as path from "path"
const electronPath = require('electron')

describe("main", () => {

  let app: Application

  beforeEach(
    async () => {
      app = new Application({
        path: electronPath,
        args: [path.join(__dirname, '../../dist/example/main.js')]
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

  it("", async () => {
    const a = await app.client.getWindowCount()
    expect(a).toEqual(1)
  })

})