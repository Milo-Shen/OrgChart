// Import Utils
import Comparator from "./utils";

type NodeType = DoublyLinkedListNode | undefined;

export class DoublyLinkedListNode {
  value: any;
  next?: DoublyLinkedListNode;
  previous?: DoublyLinkedListNode;

  constructor(
    value: any = undefined,
    next: NodeType = undefined,
    previous: NodeType = undefined
  ) {
    this.value = value;
    this.next = next;
    this.previous = previous;
  }

  toString(callback: Function) {
    return callback ? callback(this.value) : `${this.value}`;
  }
}

export default class DoublyLinkedList {
  head?: DoublyLinkedListNode;
  tail?: DoublyLinkedListNode;
  compare: Comparator;

  constructor(comparatorFunction: Function) {
    this.head = undefined;
    this.tail = undefined;
    this.compare = new Comparator(comparatorFunction);
  }

  prepend(value: any) {
    // Make new node to be a head.
    const newNode = new DoublyLinkedListNode(value, this.head);

    // If there is head, then it won't be head anymore.
    // Therefore, make its previous reference to be new node (new head).
    // Then mark the new node as head.
    if (this.head) {
      this.head.previous = newNode;
    }

    this.head = newNode;

    // If there is no tail yet let's make new node a tail.
    if (!this.tail) {
      this.tail = newNode;
    }

    return this;
  }

  append(value: any) {
    const newNode = new DoublyLinkedListNode(value);

    // If there is no head yet let's make new node a head.
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
      return this;
    }

    // Attach new node to the end of linked list.
    this.tail!.next = newNode;

    // Attach current tail to the new node's previous reference.
    newNode.previous = this.tail;

    // Set new node to be the tail of linked list.
    this.tail = newNode;

    return this;
  }

  delete(value: any) {
    if (!this.head) {
      return undefined;
    }

    let deletedNode = undefined;
    let currentNode: NodeType = this.head;

    while (currentNode) {
      if (this.compare.equal(currentNode.value, value)) {
        deletedNode = currentNode;

        if (deletedNode === this.head) {
          // If HEAD is going to be deleted...

          // Set head to second node, which will become new head.
          this.head = deletedNode.next;

          // Set new head's previous to undefined.
          if (this.head) {
            this.head.previous = undefined;
          }

          // If all the nodes in list has same value that is passed as argument
          // then all nodes will get deleted, therefore tail needs to be updated.
          if (deletedNode === this.tail) {
            this.tail = undefined;
          }
        } else if (deletedNode === this.tail) {
          // If TAIL is going to be deleted...
          // Set tail to second last node, which will become new tail.
          this.tail = deletedNode.previous;
          this.tail!.next = undefined;
        } else {
          // If MIDDLE node is going to be deleted...
          const previousNode = deletedNode.previous;
          const nextNode = deletedNode.next;

          previousNode!.next = nextNode;
          nextNode!.previous = previousNode;
        }
      }

      currentNode = currentNode.next;
    }

    return deletedNode;
  }

  find(value = undefined, callback: Function) {
    if (!this.head) {
      return undefined;
    }

    let currentNode: NodeType = this.head;

    while (currentNode) {
      // If callback is specified then try to find node by callback.
      if (callback && callback(currentNode.value)) {
        return currentNode;
      }

      // If value is specified then try to compare by value...
      if (value !== undefined && this.compare.equal(currentNode.value, value)) {
        return currentNode;
      }

      currentNode = currentNode.next;
    }

    return undefined;
  }

  deleteTail() {
    if (!this.tail) {
      // No tail to delete.
      return undefined;
    }

    if (this.head === this.tail) {
      // There is only one node in linked list.
      const deletedTail = this.tail;
      this.head = undefined;
      this.tail = undefined;

      return deletedTail;
    }

    // If there are many nodes in linked list...
    const deletedTail = this.tail;

    this.tail = this.tail.previous;
    this.tail!.next = undefined;

    return deletedTail;
  }

  deleteHead() {
    if (!this.head) {
      return undefined;
    }

    const deletedHead = this.head;

    if (this.head.next) {
      this.head = this.head.next;
      this.head.previous = undefined;
    } else {
      this.head = undefined;
      this.tail = undefined;
    }

    return deletedHead;
  }

  toArray() {
    const nodes = [];

    let currentNode = this.head;

    while (currentNode) {
      nodes.push(currentNode);
      currentNode = currentNode.next;
    }

    return nodes;
  }

  fromArray(values: any) {
    values.forEach((value: any) => this.append(value));
    return this;
  }

  toString(callback: Function) {
    return this.toArray()
      .map((node) => node.toString(callback))
      .toString();
  }

  reverse() {
    let currNode = this.head;
    let prevNode = undefined;
    let nextNode = undefined;

    while (currNode) {
      // Store next node.
      nextNode = currNode.next;
      prevNode = currNode.previous;

      // Change next node of the current node so it would link to previous node.
      currNode.next = prevNode;
      currNode.previous = nextNode;

      // Move prevNode and currNode nodes one step forward.
      prevNode = currNode;
      currNode = nextNode;
    }

    // Reset head and tail.
    this.tail = this.head;
    this.head = prevNode;

    return this;
  }
}
