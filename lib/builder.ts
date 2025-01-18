import { type Node, NodeType } from "./parser.ts"
import { log } from "./utils.ts"

export function buildObject(node: Node) {
  log("@syntaticAnalytics - type:", node.type, "value:", node.value)

  switch (node.type) {
    case NodeType.Root:
      const child = node.children[0]

      // if (child.type !== NodeType.Array && child.type !== NodeType.Object) {
      //   throw new Error("Only arrays or objects are allowed as root")
      // }

      return buildObject(child)
    case NodeType.Array:
      const arr: any[] = []
      node.children.forEach((c) => {
        arr.push(buildObject(c))
      })

      return arr
    case NodeType.Object:
      const newObject: any = {}
      node.children.forEach((objectField) => {
        newObject[objectField.value] = buildObject(objectField.children[0])
      })

      return newObject
    case NodeType.StringLiteral:
      return node.value
    case NodeType.NumberLiteral:
      return node.value
    case NodeType.NullLiteral:
      return node.value
    case NodeType.BooleanLiteral:
      return node.value
    default:
      throw new Error("Node type unsupported: " + node.type)
  }
}
