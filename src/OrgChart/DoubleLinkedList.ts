// Import Classes, Interfaces
import { CardNode } from "./OrgChart";

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
    this.tail!.next = this.tail!.next.next;
  }

  map(callback: (card: CardNode) => any) {
    let p = this.root?.next;
    while (p && p.val) {
      callback(p.val);
      p = p.next;
    }
  }
}
