# Croissant JSON

Croissant JSON (pronounced ʒeɪsɔn [🔉](https://youtu.be/uR-f4b0G9lo?si=p68YVjvRKJnR6JDw&t=45)), is a better JSON library
I made for recreational purposes that supports **tailing commas** and **comments**!

**DISCLAIMER**: This is a hobby project and I work on it whenever I have the mood to work on it. So, PLEASE do not use
this in your projects that you care about. Use it at your own discretion.

### Example (Parsing JSON string):

```ts
const jsonable = `{
    "name": "Ilia",
    "favoriteNumber": 68,
    "favoriteIceCreamFlavor": "Chocolate Chip Cookie", // It even supports comments!
    "favoriteOs": "Ubuntu",
    "osUsingBecauseYouHaveTo": "Windows",
    "likesGaming": false,
    "comments": "I love icecreams.",
    "mixedArray": ["string", 12, true, [], 1],
    "nestedObject": {
        "nestedString": "string",
        "nestedNumber": 12,
        "nestedBoolean": true,
        "nestedArray": [1, 2, true, [], {}, "string", -2],
        "nestedObject": {
            "float": 1.23,
            "int": 12,
            "boolean": true,
            "string": "string",
            "null": null,
            "array": [1, 2, true, [], {}, "string", -2]
        }
    }, // <--- notice the trailing comma is allowed. _Ungodly_ by the spec, I know, but I like it.
}`

const parsed = jsonParse(jsonable)

console.log(parsed)
/* output
    {
      name: "Ilia",
      favoriteNumber: 68,
      favoriteIceCreamFlavor: "Chocolate Chip Cookie",
      favoriteOs: "Ubuntu",
      osUsingBecauseYouHaveTo: "Windows",
      likesGaming: false,
      comments: "I love icecreams.",
      mixedArray: [ "string", 12, true, [], 1 ],
      nestedObject: {
        nestedString: "string",
        nestedNumber: 12,
        nestedBoolean: true,
        nestedArray: [ 1, 2, true, [], [Object ...], "string", -2 ],
        nestedObject: {
          float: 1.23,
          int: 12,
          boolean: true,
          string: "string",
          null: null,
          array: [ 1, 2, true, [], [Object ...], "string", -2 ],
        },
      },
    }
*/
```

### Example (Stringifying JSON object):

```ts
const obj = { foo: "bar", dog: [1, 2, "cat", true, false, 13.3, -1],
  nested: { foo: "bar", dog: false, something: true }
}

const str = jsonStringify(obj, 2) // indentation level is 2

console.log(str)

/* output
{
  "foo": "bar",
  "dog": [
    1,
    2,
    "cat",
    true,
    false,
    13.3,
    -1
  ],
  "nested": {
    "foo": "bar",
    "dog": false,
    "something": true
  }
}
*/
```

## How to try it

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```
