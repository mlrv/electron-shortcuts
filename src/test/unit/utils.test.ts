import { Modifier, NonModifier } from "../../main/keys"
import { split, normalizeModifiers, normalizedModifierToInputProperty, isModifier, normalizeModifier, normalizeNonModifier } from "../../main/utils"

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
      expect(normalizeModifiers(["Cmd", "Shift", "Cmd", "Super", "Alt"])).toEqual(["Cmd", "Shift", "Super", "Alt"])
    })

    it("should normalize modifiers", () => {
      expect(normalizeModifiers(["Cmd", "Shift", "Command", "Super", "Control"])).toEqual(["Cmd", "Shift", "Super", "Ctrl"])
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
    })

    it("should normalize CmdOrCtrl-like Modifiers", () => {
      expect(normalizeModifier("CmdOrCtrl")).toEqual("CmdOrCtrl")
      expect(normalizeModifier("CommandOrControl")).toEqual("CmdOrCtrl")
    })

    it("should normalize Ctrl-like Modifiers", () => {
      expect(normalizeModifier("Control")).toEqual("Ctrl")
      expect(normalizeModifier("Control")).toEqual("Ctrl")
    })

    it("should normalize other Modifiers", () => {
      expect(normalizeModifier("Alt")).toEqual("Alt")
      expect(normalizeModifier("Shift")).toEqual("Shift")
      expect(normalizeModifier("AltGr")).toEqual("AltGr")
      expect(normalizeModifier("Super")).toEqual("Super")
    })

  })

  describe("normalizeNonModifier", () => {

    it("should normalize Return", () => {
      expect(normalizeNonModifier("Return")).toEqual("Enter")
    })

    it("should normalize Esc", () => {
      expect(normalizeNonModifier("Esc")).toEqual("Escape")
    })

    it("should normalize Arrow keys", () => {
      expect(normalizeNonModifier("Up")).toEqual("ArrowUp")
      expect(normalizeNonModifier("Down")).toEqual("ArrowDown")
      expect(normalizeNonModifier("Left")).toEqual("ArrowLeft")
      expect(normalizeNonModifier("Right")).toEqual("ArrowRight")
    })

    it("should keep everything else untouched", () => {
      [
        "a",
        "A",
        "1",
        "F1",
        ";",
        ":",
        "Plus",
        "Space",
        "Enter",
        "Escape",
      ].forEach(
        n => expect(normalizeNonModifier(n as NonModifier)).toEqual(n)
      )
    })

  })

})