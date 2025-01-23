import os from "node:os"

export function stringify(value: any, indent?: number, multiplier: number = 0) {
  let str = ""

  if (Array.isArray(value)) {
    str += "["

    if (indent) {
      str += os.EOL
      multiplier += 1
    }

    value.forEach((item, i) => {
      str += leSpaces(indent, multiplier)

      str += stringify(item, indent, multiplier)

      if (value.length - 1 !== i) {
        str += ","

        if (indent) {
          str += os.EOL
        }
      }
    })

    if (indent) {
      str += os.EOL
    }

    str += leSpaces(indent, multiplier - 1) + "]"

    return str
  }

  if (value === null) {
    str += "null"

    return str
  }

  if (typeof value === "object") {
    str += "{"

    if (indent) {
      str += os.EOL
      multiplier += 1
    }

    let i = 0
    for (const key in value) {
      str += leSpaces(indent, multiplier) + `"${key}":`
      if (indent) {
        str += spaces(1)
      }

      str += stringify(value[key], indent, multiplier)

      if (Object.keys(value).length - 1 !== i) {
        str += ","

        if (indent) {
          str += os.EOL
        }
      }

      i++
    }

    if (indent) {
      str += os.EOL
    }

    str += leSpaces(indent, multiplier - 1) + "}"

    return str
  }

  if (typeof value === "string") {
    str += `"${value}"`
  }
  if (typeof value === "boolean") {
    str += value ? "true" : "false"
  }
  if (typeof value === "number") {
    str += String(value)
  }

  return str
}

function leSpaces(indent?: number, multiplier: number = 0) {
  if (!indent) {
    return ""
  }

  return spaces(indent * multiplier)
}

function spaces(n: number) {
  let str = ""

  for (let i = 0; i < n; i++) {
    str += " "
  }

  return str
}
