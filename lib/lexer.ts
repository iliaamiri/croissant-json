import os from "node:os"
import { log } from "./utils.ts"

const delimiterPairs = {
  "{": "}",
  "[": "]"
} as const
type OpeningDelimiter = keyof typeof delimiterPairs
type ClosingDelimiter = (typeof delimiterPairs)[OpeningDelimiter]
const fieldSeparator = ","
const operator = ":"

export enum TokenName {
  ObjectDelimiter = "ObjectDelimiter",
  ArrayDelimiter = "ArrayDelimiter",
  FieldSeparator = "FieldSeparator",
  Operator = "Operator",
  StringLiteral = "StringLiteral",
  TrueLiteral = "TrueLiteral",
  FalseLiteral = "FalseLiteral",
  NumberLiteral = "NumberLiteral",
  NullLiteral = "NullLiteral"
}

export type Token = { name: TokenName; value: string; line: number }

export function lex(
  text: string,
  caret: number = 0,
  tokens: Token[] = [],
  openingDelimiter: OpeningDelimiter | null = null,
  nextClosingDelimiter: ClosingDelimiter | null = null
): [Token[], number] {
  const character = text[caret]

  log(
    "@lex -> openingSeparator:",
    `'${openingDelimiter}'`,
    "nextClosingDelimiter:",
    `'${nextClosingDelimiter}'`
  )
  log(" caret =", caret, "character", text[caret])

  if (character === os.EOL) {
    return lex(text, caret + 1, tokens, openingDelimiter, nextClosingDelimiter)
  }
  if (character === undefined) {
    return [tokens, caret]
  }
  if (character === " ") {
    return lex(text, caret + 1, tokens, openingDelimiter, nextClosingDelimiter)
  }
  if (character === nextClosingDelimiter) {
    return [tokens, caret]
  }
  if (character === fieldSeparator) {
    if (tokens[tokens.length - 1].value === fieldSeparator) {
      throw new Error(
        `Expected a field or literal token. Received field separator at (caret ${caret}): ${text.slice(caret - 1, caret + 3)}`
      )
    }

    tokens.push({
      name: TokenName.FieldSeparator,
      value: fieldSeparator,
      line: 1
    })

    return lex(text, caret + 1, tokens, openingDelimiter, nextClosingDelimiter)
  }
  if (character === operator) {
    tokens.push({ name: TokenName.Operator, value: operator, line: 1 })

    return lex(text, caret + 1, tokens, openingDelimiter, nextClosingDelimiter)
  }
  if (Object.keys(delimiterPairs).find((s) => s === character)) {
    const tokenName =
      character === "{" ? TokenName.ObjectDelimiter : TokenName.ArrayDelimiter
    tokens.push({ name: tokenName, value: character, line: 1 })

    const closingSeparator = delimiterPairs[character as OpeningDelimiter]

    let [, caretAtClosing] = lex(
      text,
      caret + 1,
      tokens,
      character as OpeningDelimiter,
      closingSeparator
    )

    tokens.push({ name: tokenName, value: closingSeparator, line: 1 })

    log("---->", text[caretAtClosing])

    const rootLevelObject = caret === 0

    caret = caretAtClosing + 1
    while (
      text[caret] !== undefined &&
      (text[caret].trim().length === 0 || text[caret].trim() === os.EOL)
    ) {
      caret += 1
    }

    log("--->", text[caret], rootLevelObject)

    if (!rootLevelObject) {
      if (text[caret] === undefined) {
        throw new Error(
          `Missing an ending at (caret ${caret}): ${text.slice(caret - 1)}`
        )
      }

      if (Object.values(delimiterPairs).includes(text[caret] as any)) {
        return [tokens, caret]
      }

      if (text[caret] === fieldSeparator) {
        tokens.push({
          name: TokenName.FieldSeparator,
          value: text[caret],
          line: 1
        })
        return lex(text, caret + 1, tokens, null, null)
      }
    }

    if (rootLevelObject) {
      if (text[caret] !== undefined) {
        throw new Error(
          `Unexpected character at the end of object at (caret ${caret}): ${text.slice(caretAtClosing, caretAtClosing + 5)}`
        )
      }
    }

    return [tokens, caretAtClosing]
  }

  // Handle string
  if (character === '"') {
    tokens.push({ name: TokenName.StringLiteral, value: "", line: 1 })

    caret += 1

    while (text[caret] !== '"') {
      log("text[caret] =", text[caret])

      if (text[caret] === undefined) {
        throw new Error(
          `Expected an ending double-quotation at (caret ${caret}): ${text.slice(0, 5)}...`
        )
      }

      if (text[caret] === "\\") {
        // todo: handle the escaped stuff

        caret += 2
        continue
      }

      tokens[tokens.length - 1].value += text[caret]
      caret += 1
    }
  }

  // Handle number
  if (
    !isNaN(parseInt(character)) ||
    character === "." ||
    character === "-" ||
    character === "+"
  ) {
    tokens.push({ name: TokenName.NumberLiteral, value: character, line: 1 })

    caret += 1

    while (
      !isNaN(parseInt(text[caret])) ||
      text[caret] === "e" ||
      text[caret] === "E"
    ) {
      tokens[tokens.length - 1].value += text[caret]
      caret += 1
    }

    if (text[caret] === ".") {
      tokens[tokens.length - 1].value += text[caret]
      caret += 1

      while (!isNaN(parseInt(text[caret]))) {
        tokens[tokens.length - 1].value += text[caret]
        caret += 1
      }
    }

    return lex(text, caret, tokens, openingDelimiter, nextClosingDelimiter)
  }

  // Handle true
  if (character === "t") {
    const word = text.slice(caret, caret + 4)

    if (word !== "true") {
      throw new Error(
        `Invalid token. expected \`true\` at (caret ${caret}): ${word}`
      )
    }

    tokens.push({ name: TokenName.TrueLiteral, value: word, line: 1 })
  }

  // Handle false
  if (character === "f") {
    const word = text.slice(caret, caret + 5)

    if (word !== "false") {
      throw new Error(
        `Invalid token. expected \`false\` at (caret ${caret}): ${word}`
      )
    }

    tokens.push({ name: TokenName.FalseLiteral, value: word, line: 1 })
  }

  // Handle null
  if (character === "n") {
    const word = text.slice(caret, caret + 4)

    if (word !== "null") {
      throw new Error(
        `Invalid token. expected \`null\` at (caret ${caret}): ${word}`
      )
    }

    tokens.push({ name: TokenName.NullLiteral, value: word, line: 1 })
  }

  return lex(text, caret + 1, tokens, openingDelimiter, nextClosingDelimiter)
}
