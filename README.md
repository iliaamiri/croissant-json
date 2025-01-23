# Croissant JSON
Croissant JSON (pronounced ʒeɪsɔn), is a JSON library I made for recreational
purposes.

**DISCLAIMER**: This is still work-in-progress, of course, and I work on it whenever 
I have the mood to work on it. So, PLEASE do not use this in your projects that
you care about.

```ts
const jsonable = `{
    "name": "Ilia",
    "favoriteNumber": 68,
    "favoriteIceCreamFlavor": "Chocolate Chip Cookie",
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
    }
}`;

const parsed = jsonParse(jsonable);

console.log(parsed);
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

## How to try it
To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```
