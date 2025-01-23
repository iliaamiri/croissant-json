import { lex } from "./lexer.ts"
import { parse } from "./parser.ts"
import { buildObject } from "./builder.ts"

export function jsonParse<T>(value: string): T {
  const [tokens] = lex(value)

  const [, parsed] = parse(tokens)

  return buildObject(parsed) as T
}
