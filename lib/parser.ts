import { type Token, TokenName } from "./lexer.ts"
import { log } from "./utils.ts"

export enum NodeType {
  Root = "Root",
  Array = "Array",
  Object = "Object",
  ObjectField = "ObjectField",
  StringLiteral = "StringLiteral",
  BooleanLiteral = "BooleanLiteral",
  NumberLiteral = "NumberLiteral",
  NullLiteral = "NullLiteral"
}

export type Node = {
  type: NodeType
  value: any
  parent: Node | null
  children: Node[]
}

export function parse(
  tokens: Token[],
  pointer: number = 0,
  node: Node = {
    type: NodeType.Root,
    value: null,
    parent: null,
    children: []
  }
): [number, Node] {
  log(
    "@parse: token",
    tokens[pointer],
    "pointer:",
    pointer,
    "node.type:",
    node.type
  )

  const token = tokens[pointer]

  if (token === undefined) {
    return [pointer, node]
  }
  if (token.value === "]" || token.value === "}") {
    if (node.parent && node.parent.type === NodeType.Array) {
      return parse(tokens, pointer + 1, node.parent)
    } else if (
      node.parent &&
      node.parent.parent &&
      node.parent.type === NodeType.ObjectField
    ) {
      return parse(tokens, pointer + 1, node.parent.parent)
    }

    return [pointer, node]
  }
  if (token.value === ",") {
    return parse(tokens, pointer + 1, node)
  }

  if (node.type === NodeType.Object) {
    if (token.name !== TokenName.StringLiteral) {
      throw new Error("Object key must be a string")
    }

    const n = {
      type: NodeType.ObjectField,
      value: token.value,
      parent: node,
      children: []
    }

    node.children.push(n)

    pointer += 1

    if (tokens[pointer].name !== TokenName.Operator) {
      throw new Error(
        "Expected a colon to assign a literal to the object field"
      )
    }

    return parse(tokens, pointer + 1, n)
  }

  if (token.name === TokenName.NumberLiteral) {
    node.children.push({
      type: NodeType.NumberLiteral,
      value: Number(token.value),
      parent: node,
      children: []
    })

    if (node.type !== NodeType.ObjectField) {
      return parse(tokens, pointer + 1, node)
    }
    if (node.type === NodeType.ObjectField && node.parent) {
      return parse(tokens, pointer + 1, node.parent)
    }
  }
  if (token.name === TokenName.StringLiteral) {
    node.children.push({
      type: NodeType.StringLiteral,
      value: token.value,
      parent: node,
      children: []
    })

    if (node.type !== NodeType.ObjectField) {
      return parse(tokens, pointer + 1, node)
    }
    if (node.type === NodeType.ObjectField && node.parent) {
      return parse(tokens, pointer + 1, node.parent)
    }
  }
  if (token.name === TokenName.NullLiteral) {
    node.children.push({
      type: NodeType.NullLiteral,
      value: null,
      parent: node,
      children: []
    })

    if (node.type !== NodeType.ObjectField) {
      return parse(tokens, pointer + 1, node)
    }
    if (node.type === NodeType.ObjectField && node.parent) {
      return parse(tokens, pointer + 1, node.parent)
    }

    return [pointer, node]
  }

  if (
    token.name === TokenName.TrueLiteral ||
    token.name === TokenName.FalseLiteral
  ) {
    node.children.push({
      type: NodeType.BooleanLiteral,
      value: token.value === "true",
      parent: node,
      children: []
    })

    if (node.type !== NodeType.ObjectField) {
      return parse(tokens, pointer + 1, node)
    }
    if (node.type === NodeType.ObjectField && node.parent) {
      return parse(tokens, pointer + 1, node.parent)
    }
  }

  if (token.value === "[") {
    const n = {
      type: NodeType.Array,
      value: undefined,
      parent: node,
      children: []
    }
    node.children.push(n)

    const [lastPointer] = parse(tokens, pointer + 1, n)

    if (node.parent === null || node.parent.type === NodeType.Root) {
      return [lastPointer, node]
    }

    return parse(tokens, lastPointer + 1, node)
  }

  if (token.value === "{") {
    const n = {
      type: NodeType.Object,
      value: undefined,
      parent: node,
      children: []
    }
    node.children.push(n)

    const [lastPointer] = parse(tokens, pointer + 1, n)

    if (node.parent === null || node.parent.type === NodeType.Root) {
      return [lastPointer, node]
    }

    return parse(tokens, lastPointer + 1, node)
  }

  return [pointer, node]
}
