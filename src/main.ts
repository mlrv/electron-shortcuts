import { KeyCodes, Separator, Modifier, NonModifier } from './types'

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
type Accelerator<S extends string> =
  IsValidCombination<Separate<SplitOnPlus<S>>> extends true
    ? S
    : never