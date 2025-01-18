import os from "node:os"
import { lex } from "./lib/lexer.ts"
import { parse } from "./lib/parser.ts"
import { buildObject } from "./lib/builder.ts"
import { memory } from "./lib/utils.ts"

export function jsonParse<T>(value: string): T {
  const [tokens] = lex(value)

  const parsed = parse(tokens)

  return buildObject(parsed) as T
}

const testCases = [
  { input: `lol`, runTest: true, log: false },
  { input: `"lol"`, runTest: true, log: false },
  { input: `1`, runTest: true, log: false },
  { input: `-1`, runTest: true, log: false },
  { input: `+1`, runTest: true, log: false },
  { input: `+11`, runTest: true, log: false },
  { input: `+11.1`, runTest: true, log: false },
  { input: `+11e10`, runTest: true, log: false },
  { input: `true`, runTest: true, log: false },
  { input: `trux`, runTest: true, log: false },
  { input: `false`, runTest: true, log: false },
  { input: `falsx`, runTest: true, log: false },
  { input: `null`, runTest: true, log: false },
  { input: `[]`, runTest: true, log: false },
  { input: `[1, 2]`, runTest: true, log: false },
  { input: `[][]`, runTest: true, log: false },
  { input: `[], []`, runTest: true, log: false },
  { input: `[[], []]`, runTest: true, log: false },
  { input: `[[1, 2]]`, runTest: true, log: false },
  { input: `[[1, 2], 1, 30]`, runTest: true, log: false },
  { input: `{}`, runTest: true, log: false },
  {
    input: `{"foo": {"bar": "choco", "lol": "lmao"}, 

        "goo": false,
        "sal": null,
        "wow": [1, 2, "str", true]}`,
    runTest: true,
    log: false
  },
  { input: `{{""}}`, runTest: true, log: false },
  { input: `{"foo":{}}`, runTest: true, log: false },
  { input: `{[1, 2], 1, 30}`, runTest: true, log: false },

  { input: `{ "foo": "bar" }`, runTest: true, log: false },
  { input: `{"foo":"bar"}`, runTest: true, log: false },
  { input: `{ " foo\\"":1}`, runTest: true, log: false },

  { input: `{"foo":"bar","choco": "dog"}`, runTest: true, log: false },
  { input: `{"foo": false,"choco": 1}`, runTest: true, log: false },

  { input: `{"foo":1}`, runTest: true, log: false },

  { input: `{ " foo:1}`, runTest: true, log: false },
  { input: `{ " foo":1,,}`, runTest: true, log: false },

  { input: `{ " foo":1,}`, runTest: true, log: false },
  { input: `{ " foo"1,}`, runTest: true, log: false }
]

function runCases() {
  testCases
    .filter((t) => t.runTest)
    .forEach((c) => {
      try {
        memory.logEnabled = c.log

        if (memory.logEnabled) {
          console.log("---")
        }
        const [tokens, caret] = lex(c.input)

        if (memory.logEnabled) {
          console.debug(`---`)
        }

        const parsed = parse(tokens)

        if (memory.logEnabled) {
          console.debug(`---`)
        }

        const built = buildObject(parsed)

        console.log("built", built, "from: ", c.input, os.EOL)
      } catch (e) {
        console.error(`${c.input} ->`, (e as unknown as Error).message, os.EOL)
      } finally {
        if (memory.logEnabled) {
          console.log("---")
        }
      }
    })
}

// runCases()
