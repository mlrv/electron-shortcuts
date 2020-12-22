import { split } from "../main/utils"

test("split", () => {
  expect(split("Cmd+a")).toEqual([["Cmd"], ["a"]])
})