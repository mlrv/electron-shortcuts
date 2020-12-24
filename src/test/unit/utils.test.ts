import { Modifier } from "../../main/keys"
import { split, normalizeModifiers, normalizedModifierToInputProperty, isModifier, normalizeModifier } from "../../main/utils"

describe("utils", () => {

  describe("split", () => {

   it("should split a valid accelerator into Modifiers and NonModifiers", () => {
    expect(split("Cmd+Shift+a")).toEqual([["Cmd", "Shift"], ["a"]])
   }) 

   it("should work with a single Modifier", () => {
    expect(split("Cmd+a")).toEqual([["Cmd"], ["a"]])
   }) 

   it("should work with multiple Modifiers", () => {
    expect(split("Cmd+Shift+Alt+a")).toEqual([["Cmd", "Shift", "Alt"], ["a"]])
   }) 

   it("should work with non-normalized Modifiers", () => {
    expect(split("Cmd+Shift+Command+a")).toEqual([["Cmd", "Shift", "Command"], ["a"]])
   }) 

   it("should work regardless of the order", () => {
    expect(split("Cmd+a+Shift")).toEqual([["Cmd", "Shift"], ["a"]])
   }) 

  })

  describe("normalizeModifiers", () => {

    it("should return an empty list given an empty list", () => {
      expect(normalizeModifiers([])).toEqual([])
    })

    it("should return the given input if there are no denormilized entries", () => {
      const modifiers: Modifier[] = ["Cmd", "Alt", "Shift"]
      expect(normalizeModifiers(modifiers)).toEqual(modifiers)
    })

    it("should remove duplicates", () => {
      expect(normalizeModifiers(["Cmd", "Shift", "Cmd", "Super", "Alt" ])).toEqual(["Cmd", "Shift", "Super", "Alt" ])
    })

    it("should normalize modifiers", () => {
      expect(normalizeModifiers(["Cmd", "Shift", "Command", "Super", "Option", "Control" ])).toEqual(["Cmd", "Shift", "Super", "Alt", "Ctrl" ])
    })

  })

  describe("normalizedModifierToInputProperty", () => {

    it("should map normalized modifiers to input properties", () => {
      expect(normalizedModifierToInputProperty("Cmd")).toEqual("meta")
      expect(normalizedModifierToInputProperty("Super")).toEqual("meta")

      expect(normalizedModifierToInputProperty("Ctrl")).toEqual("control")
      expect(normalizedModifierToInputProperty("AltGr")).toEqual("control")

      expect(normalizedModifierToInputProperty("Shift")).toEqual("shift")

      expect(normalizedModifierToInputProperty("Alt")).toEqual("alt")
    })

  })

  describe("isModifier", () => {

    it("should return false for non-Modifiers", () => {
      expect(
        isModifier(Math.random().toString())
      ).toEqual(false)
    })

    it("should classify Modifiers", () => {
      [
        "Command",
        "Cmd",
        "Control",
        "Ctrl",
        "CommandOrControl",
        "CmdOrCtrl",
        "Alt",
        "Option",
        "AltGr",
        "Shift",
        "Super"
      ].forEach(
        m => expect(isModifier(m)).toEqual(true)
      )
    })

  })

  describe("normalizeModifier", () => {

    it("should normalize Cmd-like Modifiers", () => {
      expect(normalizeModifier("Cmd")).toEqual("Cmd")
      expect(normalizeModifier("Command")).toEqual("Cmd")
      expect(normalizeModifier("CmdOrCtrl")).toEqual("Cmd")
      expect(normalizeModifier("CommandOrControl")).toEqual("Cmd")
    })

    it("should normalize Alt-like Modifiers", () => {
      expect(normalizeModifier("Alt")).toEqual("Alt")
      expect(normalizeModifier("Option")).toEqual("Alt")
    })

    it("should normalize Ctrl-like Modifiers", () => {
      expect(normalizeModifier("Control")).toEqual("Ctrl")
      expect(normalizeModifier("Control")).toEqual("Ctrl")
    })

    it("should normalize other Modifiers", () => {
      expect(normalizeModifier("Shift")).toEqual("Shift")
      expect(normalizeModifier("AltGr")).toEqual("AltGr")
      expect(normalizeModifier("Super")).toEqual("Super")
    })

  })

})