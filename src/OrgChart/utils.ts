// Import Types, Classes and Interfaces
import { CardNode } from "./OrgChart";

export function is_even(num: number): boolean {
  return num % 2 === 0;
}

export function is_leaf(node: CardNode) {
  return !node.children.length;
}

export function traverse_tree(
  node: CardNode,
  callback: (node: CardNode) => void
) {
  let queue = [node];

  while (queue.length) {
    let card = queue.shift()!;
    callback(card);

    let children = card!.children;
    for (let j = 0; j < children.length; j++) {
      queue.push(children[j]);
    }
  }
}
