import os from "node:os"

function spaces(n: number) {
  let str = ""

  for (let i = 0; i < n; i++) {
    str += " "
  }

  return str
}

export function jsonStringify(value: any, indent?: number): string {
  let str = ""

  if (Array.isArray(value)) {
    str += "["

    if (indent) {
      str += os.EOL
    }

    value.forEach((item, i) => {
      if (indent) {
        str += spaces(indent)
      }

      str += jsonStringify(item, indent ? indent * 2 : undefined)

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

    str += "]"

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
    }

    let i = 0
    for (const key in value) {
      if (indent) {
        str += spaces(indent)
      }

      str += `"${key}":`

      if (indent) {
        str += spaces(1)
      }

      str += jsonStringify(value[key], indent ? indent * 2 : undefined)

      if (Object.keys(value).length - 1 !== i) {
        str += ","

        if (indent) {
          str += os.EOL + spaces(1)
        }
      }

      i++
    }

    if (indent) {
      str += os.EOL
    }

    str += "}"

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
