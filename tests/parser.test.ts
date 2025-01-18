import { expect, it } from "vitest"
import { jsonParse } from ".."

const invalidCases = []

const cases = [
  `lol`,
  `"lol"`,
  `1`,
  `-1`,
  `+1`,
  `+11`,
  `+11.1`,
  `+11e10`,
  `true`,
  `trux`,
  `false`,
  `falsx`,
  `null`,
  `[]`,
  `[1, 2]`,
  `[][]`,
  `[], []`,
  `[[], []]`,
  `[[1, 2]]`,
  `[[1, 2], 1, 30]`,
  `{}`,
  `{"foo": {"bar": "choco", "lol": "lmao"}, 

        "goo": false,
        "sal": null,
        "wow": [1, 2, "str", true]}`,
  `{{""}}`,
  `{"foo":{}}`,
  `{[1, 2], 1, 30}`,
  `{ "foo": "bar" }`,
  `{"foo":"bar"}`,
  `{ " foo\\"":1}`,
  `{"foo":"bar","choco": "dog"}`,
  `{"foo": false,"choco": 1}`,
  `{"foo":1}`,
  `{ " foo:1}`,
  `{ " foo":1,,}`,
  `{ " foo":1,}`,
  `{ " foo"1,} `
]

it("should work generally", () => {
  cases.forEach((c) => {
    try {
      const result = jsonParse(c)

      const deFacto = JSON.parse(c)

      expect(result).toMatchObject(deFacto)
    } catch (e) {
      console.error(e)

      throw e
    }
  })
})

it("should parse empty array", () => {
  const raw = "[]"

  const parsed = jsonParse(raw)

  expect(parsed).toMatchObject([])
})

it("should parse empty object", () => {
  const raw = "{}"

  const parsed = jsonParse(raw)

  expect(parsed).toMatchObject({})
})
