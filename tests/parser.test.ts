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
    } catch (e) {}
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

it("all the possibilities", () => {
  const jsonable = `{
    "name": "Ilia",
    "favoriteNumber": 68, // Oh hey look. A better JSON parser.
    "favoriteIceCreamFlavor": "Chocolate Chip Cookie",
    "favoriteOs": "Ubuntu",
    "osUsingBecauseYouHaveTo": "Windows", // Another comment. And this causes no problems!
    "likesGaming": false,
    "comments": "I love icecreams.", // My comments can include emojis too 😍
    "mixedArray": ["string", 12, true, [], 1],
    "nestedObject": {
        "nestedString": "string", // WOW LOOK AT THIS COMMENT GOING!!!!!!! 🗿 Not me abusing the comments.
        "nestedNumber": 12,
        "nestedBoolean": true,
        "nestedArray": [1, 2, true, [], {}, "string", -2],
        "nestedObject": {
            "float": 1.23, // I can even have comments here too ✅ (totally not being cringe)
            "int": 12,
            "boolean": true,
            "string": "string",
            "null": null,
            "array": [1, 2, true, [], {}, "string", -2]
        }
    },
    "anotherArray": [1, 2, 3, 4, 5, 3, [], [], [], {}, -3.14],
    "string": "string",
    "boolean_snake_case": [
        true,
        false,
        true,
      // NOTICE THE TRAILING COMMA BY THE WAY 💘💘💘💘💘💘💘💘
    ], // <---
}`

  const parsed = jsonParse(jsonable)

  expect(parsed).toMatchObject({
    name: "Ilia",
    favoriteNumber: 68,
    favoriteIceCreamFlavor: "Chocolate Chip Cookie",
    favoriteOs: "Ubuntu",
    osUsingBecauseYouHaveTo: "Windows",
    likesGaming: false,
    comments: "I love icecreams.",
    mixedArray: ["string", 12, true, [], 1],
    nestedObject: {
      nestedString: "string",
      nestedNumber: 12,
      nestedBoolean: true,
      nestedArray: [1, 2, true, [], {}, "string", -2],
      nestedObject: {
        float: 1.23,
        int: 12,
        boolean: true,
        string: "string",
        null: null,
        array: [1, 2, true, [], {}, "string", -2]
      }
    },
    anotherArray: [1, 2, 3, 4, 5, 3, [], [], [], {}, -3.14],
    string: "string",
    boolean_snake_case: [true, false, true]
  })
})

it("trailing commas in objects", () => {
  const jsonable = `{
    "name": "Ilia", // masterpiece art 
  }`

  const parsed = jsonParse(jsonable)

  expect(parsed).toMatchObject({
    name: "Ilia"
  })
})

it("trailing commas in arrays", () => {
  const jsonable = `[1, 2, 3,]` // LOOK AT THAT TRAILING COMMA!

  const parsed = jsonParse(jsonable)

  expect(parsed).toMatchObject([1])
})

it("primitive values", () => {
  const jsonables: [string, any][] = [
    ["true", true],
    ["false", false],
    ["null", null],
    ["1", 1],
    ["-1", -1],
    ["+1", 1],
    ["+11", 11],
    ["+11.1", 11.1],
    ["+11e10", 11e10],
    ['"string"', "string"],
    ['"string with \\"escaped\\" quotes"', 'string with "escaped" quotes']
  ]

  jsonables.forEach(([c, expected]) => {
    const parsed = jsonParse(c)

    expect(parsed).toMatchObject(expected)
  })
})
