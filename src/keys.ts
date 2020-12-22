type KeyCodes =
  | Modifier
  | LowerAlpha
  | UpperAlpha
  | Digit
  | FunctionKey
  | Punctuation
  | Misc // name??

export type Modifier =
  | "Command"
  | "Cmd"
  | "Control"
  | "Ctrl"
  | "CommandOrControl"
  | "CmdOrCtrl"
  | "Alt"
  | "Option"
  | "AltGr"
  | "Shift"
  | "Super"

export type NormalizedModifier =
  | "Cmd"
  | "Ctrl"
  | "AltGr"
  | "Alt"
  | "Shift"
  | "Super"

export type NonModifier = Exclude<KeyCodes, Modifier> 

type LowerAlpha = "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h" | "i" | "j" | "k" | "l" | "m" | "n" | "o" | "p" | "q" | "r" | "s" | "t" | "u" | "v" | "w" | "x" | "y" | "z"
type UpperAlpha = `${Uppercase<LowerAlpha>}`
type Digit = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "0"
type FunctionKey = "F1" | "F2" | "F3" | "F4" | "F5" | "F6" | "F7" | "F8" | "F9" | "F10" | "F11" | "F12" | "F13" | "F14" | "F15" | "F16" | "F17" | "F18" | "F19" | "F20" | "F21" | "F22" | "F23" | "F24"
type Punctuation = "!" | "@" | "#" | "$" | "%" | "^" | "&" | "*" | "(" | ":" | "<" | "_" | ">" | "?" | "~" | "{" | "|" | "}" | "\""| ";" | "=" | "," | "\\" | "-" | "." | "/" | "\`" | "[" |"]" | "\'"
type Misc = "Plus" | "Space" | "Tab" | "Backspace" | "Delete" | "Insert" | "Return" | "Enter" | "Up" | "Down" | "Left" | "Right" | "Home" | "End" | "PageUp" | "PageDown" | "Escape" | "Esc" | "VolumeUp" | "VolumeDown" | "VolumeMute" | "MediaNextTrack" | "MediaPreviousTrack" | "MediaStop" | "MediaPlayPause" | "PrintScreen"

type Separator = "+"

// Split a string given a separator, I.e.
// SplitOnSeparator<"a,b,c", ","> -> ["a", "b", "c"]
// SplitOnSeparator<"a,b,c", "."> -> ["abc"]
type SplitOnSeparator<S extends string, T extends string> =
  S extends `${infer A}${T}${infer Rest}`
    ? [A, ...SplitOnSeparator<Rest, T>]
    : [S]

// Split on "+" 
type SplitOnPlus<S extends string> = SplitOnSeparator<S, Separator>

// Given a list of Keycodes, split it into `Modifier`s and `NonModifier`s
type Separate<S extends string[], T extends { mod: Modifier[], nonMod: NonModifier[] } = { mod: [], nonMod: [] }> =
  S["length"] extends 0
    ? T
    : S extends [infer H, ...infer Rest]
      ? Rest extends string[]
        ? H extends Modifier
          ? T extends { mod: [...infer Mods], nonMod: [...infer NonMods] }
            ? Mods extends Modifier[]
              ? NonMods extends NonModifier[]
                ? Separate<Rest, { mod: [H, ...Mods], nonMod: NonMods }>
                : never
              : never
            : never
          : H extends NonModifier
            ? T extends { mod: [...infer Mods], nonMod: [...infer NonMods] }
              ? Mods extends Modifier[]
                ? NonMods extends NonModifier[]
                  ? Separate<Rest, { mod: Mods, nonMod: [H, ...NonMods] }>
                  : never
                : never
              : never
            : never
        : never
      : never
    
// Validate whether a combination of `Modifier`s and `NonModifier`s is valid
// according to the following rules:
// - At least one `Modifier`s
// - Exactly one `NonModifier`
type IsValidCombination<T extends { mod: Modifier[], nonMod: NonModifier[] }> =
  T["mod"]["length"] extends 0
    ? false
    : T["nonMod"]["length"] extends 0
      ? false
      : T["nonMod"]["length"] extends 1
        ? true
        : false

// Constrain a string to be a valid accelerator
export type Accelerator<S extends string> =
  IsValidCombination<Separate<SplitOnPlus<S>>> extends true
    ? S
    : never