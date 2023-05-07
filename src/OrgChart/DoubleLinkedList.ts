// Import Classes, Interfaces
import { CardNode } from "./OrgChart";
import { ReactNode } from "react";

export class DoubleLinkedListNode {
  val?: CardNode;
  prev?: DoubleLinkedListNode;
  next?: DoubleLinkedListNode;

  constructor(val = undefined, prev = undefined, next = undefined) {
    this.val = val;
    this.prev = prev;
    this.next = next;
  }
}

export class DoubleLinkedList {
  root?: DoubleLinkedListNode;
  tail?: DoubleLinkedListNode;

  constructor() {
    this.root = new DoubleLinkedListNode();
    this.tail = this.root;
  }

  push(node: CardNode) {
    let linked_node = new DoubleLinkedListNode();
    linked_node.val = node;
    this.tail!.next = linked_node;
    linked_node.prev = this.tail;
    this.tail = this.tail!.next;
  }

  map(callback: (card: CardNode) => ReactNode): ReactNode {
    let result: ReactNode[] = [];

    let p = this.root?.next;

    while (p && p.val) {
      result.push(callback(p.val));
      p = p.next;
    }

    return result;
  }
}
