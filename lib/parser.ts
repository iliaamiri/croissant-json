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
): any {
  log("@parse: token", tokens[pointer])

  const token = tokens[pointer]

  if (token === undefined) {
    return node
  }
  if (token.value === "}") {
    if (
      node.parent &&
      node.parent.parent &&
      node.parent.type === NodeType.ObjectField
    ) {
      parse(tokens, pointer + 1, node.parent.parent)
    }

    return node
  }
  if (token.value === "]") {
    if (
      node.parent &&
      node.parent.parent &&
      node.parent.type === NodeType.ObjectField
    ) {
      parse(tokens, pointer + 1, node.parent.parent)
    }

    return node
  }
  if (token.value === ",") {
    parse(tokens, pointer + 1, node)

    return node
  }

  if (node.type === NodeType.Object) {
    console.log(token)
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

    parse(tokens, pointer + 1, n)

    return node
  }

  if (token.name === TokenName.NumberLiteral) {
    node.children.push({
      type: NodeType.NumberLiteral,
      value: Number(token.value),
      parent: node,
      children: []
    })

    if (node.type !== NodeType.ObjectField) {
      parse(tokens, pointer + 1, node)
    }
    if (node.type === NodeType.ObjectField && node.parent) {
      parse(tokens, pointer + 1, node.parent)
    }

    return node
  }
  if (token.name === TokenName.StringLiteral) {
    node.children.push({
      type: NodeType.StringLiteral,
      value: token.value,
      parent: node,
      children: []
    })

    if (node.type !== NodeType.ObjectField) {
      parse(tokens, pointer + 1, node)
    }
    if (node.type === NodeType.ObjectField && node.parent) {
      parse(tokens, pointer + 1, node.parent)
    }

    return node
  }
  if (token.name === TokenName.NullLiteral) {
    node.children.push({
      type: NodeType.NullLiteral,
      value: null,
      parent: node,
      children: []
    })

    if (node.type !== NodeType.ObjectField) {
      parse(tokens, pointer + 1, node)
    }
    if (node.type === NodeType.ObjectField && node.parent) {
      parse(tokens, pointer + 1, node.parent)
    }

    return node
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
      parse(tokens, pointer + 1, node)
    }
    if (node.type === NodeType.ObjectField && node.parent) {
      parse(tokens, pointer + 1, node.parent)
    }

    return node
  }

  if (token.value === "[") {
    const n = {
      type: NodeType.Array,
      value: undefined,
      parent: node,
      children: []
    }
    node.children.push(n)

    parse(tokens, pointer + 1, n)

    return node
  }

  if (token.value === "{") {
    const n = {
      type: NodeType.Object,
      value: undefined,
      parent: node,
      children: []
    }
    node.children.push(n)

    parse(tokens, pointer + 1, n)

    return node
  }
}
