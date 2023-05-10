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

export default class Comparator {
  compare: Function;

  constructor(compareFunction: Function) {
    this.compare = compareFunction || Comparator.defaultCompareFunction;
  }

  static defaultCompareFunction(a: number, b: number) {
    if (a === b) {
      return 0;
    }

    return a < b ? -1 : 1;
  }

  equal(a: number, b: number) {
    return this.compare(a, b) === 0;
  }

  lessThan(a: number, b: number) {
    return this.compare(a, b) < 0;
  }

  greaterThan(a: number, b: number) {
    return this.compare(a, b) > 0;
  }

  lessThanOrEqual(a: number, b: number) {
    return this.lessThan(a, b) || this.equal(a, b);
  }

  greaterThanOrEqual(a: number, b: number) {
    return this.greaterThan(a, b) || this.equal(a, b);
  }

  reverse() {
    const compareOriginal = this.compare;
    this.compare = (a: number, b: number) => compareOriginal(b, a);
  }
}
