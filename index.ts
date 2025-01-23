import { jsonParse } from "./lib/index.ts"
export { jsonParse } from "./lib/index.ts"

const jsonable = `{
    "name": "Ilia",
    "favoriteNumber": 68,
    "favoriteIceCreamFlavor": "Chocolate Chip Cookie",
    "favoriteOs": "Ubuntu",
    "osUsingBecauseYouHaveTo": "Windows",
    "likesGaming": false,
    "comments": "I love icecreams.",
    "mixedArray": ["string", 12, true, [], 1]
}`

const parsed = jsonParse(jsonable)

console.log(parsed)
