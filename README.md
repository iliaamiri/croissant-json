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
    "comments": "I love icecreams."
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
