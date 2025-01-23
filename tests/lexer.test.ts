import { expect, it } from "vitest"
import { lex, TokenName } from "../lib/lexer.ts"

it("should lex the empty string", () => {
  const [tokens] = lex("")

  expect(tokens).toMatchObject([])
})

it("should lex the string", () => {
  const [tokens] = lex(`"string"`)

  expect(tokens).toMatchObject([
    { name: TokenName.StringLiteral, value: "string", line: 1 }
  ])
})

it("should lex the number", () => {
  const [tokens] = lex(`123`)

  expect(tokens).toMatchObject([{ name: TokenName.NumberLiteral, value: "123", line: 1 }])
})

it("should lex the true", () => {
  const [tokens] = lex(`true`)

  expect(tokens).toMatchObject([{ name: TokenName.TrueLiteral, value: "true", line: 1 }])
})

it("should lex the false", () => {
  const [tokens] = lex(`false`)

  expect(tokens).toMatchObject([
    { name: TokenName.FalseLiteral, value: "false", line: 1 }
  ])
})

it("should lex the null", () => {
  const [tokens] = lex(`null`)

  expect(tokens).toMatchObject([{ name: TokenName.NullLiteral, value: "null", line: 1 }])
})

it("should lex the object", () => {
  const [tokens] = lex(`{}`)

  expect(tokens).toMatchObject([
    { name: TokenName.ObjectDelimiter, value: "{", line: 1 },
    { name: TokenName.ObjectDelimiter, value: "}", line: 1 }
  ])
})

it("should lex the array", () => {
  const [tokens] = lex(`[]`)

  expect(tokens).toMatchObject([
    { name: TokenName.ArrayDelimiter, value: "[", line: 1 },
    { name: TokenName.ArrayDelimiter, value: "]", line: 1 }
  ])
})

it("should lex an array with different values in it", () => {
  const [tokens] = lex(`[1, 2, 3]`)

  expect(tokens).toMatchObject([
    { name: TokenName.ArrayDelimiter, value: "[", line: 1 },
    { name: TokenName.NumberLiteral, value: "1", line: 1 },
    { name: TokenName.FieldSeparator, value: ",", line: 1 },
    { name: TokenName.NumberLiteral, value: "2", line: 1 },
    { name: TokenName.FieldSeparator, value: ",", line: 1 },
    { name: TokenName.NumberLiteral, value: "3", line: 1 },
    { name: TokenName.ArrayDelimiter, value: "]", line: 1 }
  ])
})

it("should respect the lines", () => {
  const [tokens] = lex(`
    {
        "foo": "bar",
        "dog": [1, 2, "cat", true, false, 13.3, -1],
        "nested": {
            "foo": "bar",
            "dog": false,
            "something": true
        }
    }
    `)

  expect(tokens).toMatchObject([
    { name: TokenName.ObjectDelimiter, value: "{", line: 2 },
    { name: TokenName.StringLiteral, value: "foo", line: 3 },
    { name: TokenName.Operator, value: ":", line: 3 },
    { name: TokenName.StringLiteral, value: "bar", line: 3 },
    { name: TokenName.FieldSeparator, value: ",", line: 3 },
    { name: TokenName.StringLiteral, value: "dog", line: 4 },
    { name: TokenName.Operator, value: ":", line: 4 },
    { name: TokenName.ArrayDelimiter, value: "[", line: 4 },
    { name: TokenName.NumberLiteral, value: "1", line: 4 },
    { name: TokenName.FieldSeparator, value: ",", line: 4 },
    { name: TokenName.NumberLiteral, value: "2", line: 4 },
    { name: TokenName.FieldSeparator, value: ",", line: 4 },
    { name: TokenName.StringLiteral, value: "cat", line: 4 },
    { name: TokenName.FieldSeparator, value: ",", line: 4 },
    { name: TokenName.TrueLiteral, value: "true", line: 4 },
    { name: TokenName.FieldSeparator, value: ",", line: 4 },
    { name: TokenName.FalseLiteral, value: "false", line: 4 },
    { name: TokenName.FieldSeparator, value: ",", line: 4 },
    { name: TokenName.NumberLiteral, value: "13.3", line: 4 },
    { name: TokenName.FieldSeparator, value: ",", line: 4 },
    { name: TokenName.NumberLiteral, value: "-1", line: 4 },
    { name: TokenName.ArrayDelimiter, value: "]", line: 4 },
    { name: TokenName.FieldSeparator, value: ",", line: 4 },
    { name: TokenName.StringLiteral, value: "nested", line: 5 },
    { name: TokenName.Operator, value: ":", line: 5 },
    { name: TokenName.ObjectDelimiter, value: "{", line: 5 },
    { name: TokenName.StringLiteral, value: "foo", line: 6 },
    { name: TokenName.Operator, value: ":", line: 6 },
    { name: TokenName.StringLiteral, value: "bar", line: 6 },
    { name: TokenName.FieldSeparator, value: ",", line: 6 },
    { name: TokenName.StringLiteral, value: "dog", line: 7 },
    { name: TokenName.Operator, value: ":", line: 7 },
    { name: TokenName.FalseLiteral, value: "false", line: 7 },
    { name: TokenName.FieldSeparator, value: ",", line: 7 },
    { name: TokenName.StringLiteral, value: "something", line: 8 },
    { name: TokenName.Operator, value: ":", line: 8 },
    { name: TokenName.TrueLiteral, value: "true", line: 8 },
    { name: TokenName.ObjectDelimiter, value: "}", line: 9 },
    { name: TokenName.ObjectDelimiter, value: "}", line: 10 }
  ])
})
