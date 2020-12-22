export type KeyCodes =
  | Modifier
  | LowerAlpha
  | UpperAlpha
  | FunctionKey
  | Punctuation
  | Misc // name?

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

type NormalizedModifier =
  | "Cmd"
  | "Ctrl"
  | "AltGr"
  | "Alt"
  | "Shift"
  | "Super"

export type NonModifier = Exclude<KeyCodes, Modifier> 

export type LowerAlpha = "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h" | "i" | "j" | "k" | "l" | "m" | "n" | "o" | "p" | "q" | "r" | "s" | "t" | "u" | "v" | "w" | "x" | "y" | "z"
export type UpperAlpha = `${Uppercase<LowerAlpha>}`
export type Digit = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "0"
export type FunctionKey = "F1" | "F2" | "F3" | "F4" | "F5" | "F6" | "F7" | "F8" | "F9" | "F10" | "F11" | "F12" | "F13" | "F14" | "F15" | "F16" | "F17" | "F18" | "F19" | "F20" | "F21" | "F22" | "F23" | "F24"
export type Punctuation = "!" | "@" | "#" | "$" | "%" | "^" | "&" | "*" | "(" | ":" | "+" | "<" | "_" | ">" | "?" | "~" | "{" | "|" | "}" | "\""| ";" | "=" | "," | "\\" | "-" | "." | "/" | "\`" | "[" |"]" | "\'"
export type Misc = "Plus" | "Space" | "Tab" | "Backspace" | "Delete" | "Insert" | "Return" | "Enter" | "Up" | "Down" | "Left" | "Right" | "Home" | "End" | "PageUp" | "PageDown" | "Escape" | "Esc" | "VolumeUp" | "VolumeDown" | "VolumeMute" | "MediaNextTrack" | "MediaPreviousTrack" | "MediaStop" | "MediaPlayPause" | "PrintScreen"

export type Separator = "+"

export type InputProperty =
  | "shift"
  | "control"
  | "alt"
  | "meta"