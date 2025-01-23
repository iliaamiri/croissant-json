import { expect, it } from "vitest"
import { jsonStringify } from "../lib"

function helper(obj: any) {
  const string = jsonStringify(obj)

  expect(string).toBe(JSON.stringify(obj))
}

it("should generally work", () => {
  helper({
    foo: "bar",
    dog: [1, 2, "cat", true, false, 13.3, -1]
  })
})

it("primitive value of true", () => {
  helper(true)
})

it("primitive value of false", () => {
  helper(false)
})

it("primitive value of null", () => {
  helper(null)
})

it("primitive value of string", () => {
  helper("foo")
})

it("primitive value of number", () => {
  helper(123)
})

it("beautiful", () => {
  const obj = {
    foo: "bar",
    dog: [1, 2, "cat", true, false, 13.3, -1],
    nested: {
      foo: "bar",
      dog: false,
      something: true
    }
  }

  const str = jsonStringify(obj, 2)

  console.log(str)
})
