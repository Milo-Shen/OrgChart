// Import Types, Classes and Interfaces
import { CardNode } from "./OrgChart";

export function is_even(num: number): boolean {
  return num % 2 === 0;
}

export function is_leaf(node: CardNode) {
  return !node.children.length;
}
