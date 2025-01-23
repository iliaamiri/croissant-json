import { lex } from "./lexer.ts"
import { parseTokens } from "./parser.ts"
import { buildObject } from "./builder.ts"
import { stringify } from "./stringifier.ts"

export function jsonParse<T>(value: string): T {
  const [tokens] = lex(value)

  const [, parsed] = parseTokens(tokens)

  return buildObject(parsed) as T
}

export function jsonStringify(value: any, indent?: number): string {
  return stringify(value, indent)
}
