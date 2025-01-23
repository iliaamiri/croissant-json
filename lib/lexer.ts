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
  isRoot: boolean = true,
  nextClosingDelimiter: ClosingDelimiter | null = null,
  lineNumber: number = 1
): [Token[], number] {
  const character = text[caret]

  log(
    "@lex -> isRoot:",
    `'${isRoot}'`,
    "nextClosingDelimiter:",
    `'${nextClosingDelimiter}'`
  )
  log(" caret =", caret, "character", text[caret])

  // skip comments
  if (character === "/" && text[caret + 1] === "/") {
    caret += 2
    while (
      text[caret] !== os.EOL &&
      text[caret] !== "\n" &&
      text[caret] !== "\r" &&
      text[caret] !== "\r\n"
    ) {
      caret += 1
    }

    return lex(
      text,
      caret,
      tokens,
      isRoot,
      nextClosingDelimiter,
      lineNumber + 1
    )
  }
  if (
    character === os.EOL ||
    character === "\r" ||
    character === "\n" ||
    character === "\r\n"
  ) {
    return lex(
      text,
      caret + 1,
      tokens,
      isRoot,
      nextClosingDelimiter,
      lineNumber + 1
    )
  }
  if (character === undefined) {
    return [tokens, caret]
  }
  if (character === " ") {
    return lex(
      text,
      caret + 1,
      tokens,
      isRoot,
      nextClosingDelimiter,
      lineNumber
    )
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
      line: lineNumber
    })

    return lex(
      text,
      caret + 1,
      tokens,
      isRoot,
      nextClosingDelimiter,
      lineNumber
    )
  }
  if (character === operator) {
    tokens.push({ name: TokenName.Operator, value: operator, line: lineNumber })

    return lex(
      text,
      caret + 1,
      tokens,
      isRoot,
      nextClosingDelimiter,
      lineNumber
    )
  }
  if (character === "[" || character === "{") {
    const tokenName =
      character === "{" ? TokenName.ObjectDelimiter : TokenName.ArrayDelimiter

    const openingDelimiter = character as OpeningDelimiter
    const closingDelimiter = delimiterPairs[openingDelimiter]

    tokens.push({ name: tokenName, value: openingDelimiter, line: lineNumber })
    let [, caretAtClosing] = lex(
      text,
      caret + 1,
      tokens,
      false,
      closingDelimiter,
      lineNumber
    )
    tokens.push({ name: tokenName, value: closingDelimiter, line: lineNumber })

    if (isRoot) {
      return [tokens, caretAtClosing]
    }

    return lex(
      text,
      caretAtClosing + 1,
      tokens,
      false,
      nextClosingDelimiter,
      lineNumber
    )
  }

  // Handle string
  if (character === '"') {
    tokens.push({ name: TokenName.StringLiteral, value: "", line: lineNumber })

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
        tokens[tokens.length - 1].value += '"'

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
    tokens.push({
      name: TokenName.NumberLiteral,
      value: character,
      line: lineNumber
    })

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

    return lex(text, caret, tokens, isRoot, nextClosingDelimiter, lineNumber)
  }

  // Handle true
  if (character === "t") {
    const word = text.slice(caret, caret + 4)

    if (word !== "true") {
      throw new Error(
        `Invalid token. expected \`true\` at (caret ${caret}): ${word}`
      )
    }

    tokens.push({ name: TokenName.TrueLiteral, value: word, line: lineNumber })
  }

  // Handle false
  if (character === "f") {
    const word = text.slice(caret, caret + 5)

    if (word !== "false") {
      throw new Error(
        `Invalid token. expected \`false\` at (caret ${caret}): ${word}`
      )
    }

    tokens.push({ name: TokenName.FalseLiteral, value: word, line: lineNumber })
  }

  // Handle null
  if (character === "n") {
    const word = text.slice(caret, caret + 4)

    if (word !== "null") {
      throw new Error(
        `Invalid token. expected \`null\` at (caret ${caret}): ${word}`
      )
    }

    tokens.push({ name: TokenName.NullLiteral, value: word, line: lineNumber })
  }

  return lex(text, caret + 1, tokens, isRoot, nextClosingDelimiter, lineNumber)
}
