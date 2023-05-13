// Import Utils
import Comparator from "./utils";
import { CardNode } from "./OrgChart";
import { ReactNode } from "react";

export type NodeType = DoublyLinkedListNode | undefined;

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

  to_string(callback: Function) {
    return callback ? callback(this.value) : `${this.value}`;
  }
}

export class DoublyLinkedList {
  head?: DoublyLinkedListNode;
  tail?: DoublyLinkedListNode;
  compare: Comparator;
  length: number;

  constructor(comparatorFunction?: Function) {
    this.head = undefined;
    this.tail = undefined;
    this.length = 0;
    this.compare = new Comparator(comparatorFunction);
  }

  static from_array(values: any) {
    let linked_list = new DoublyLinkedList();
    values.forEach((value: any) => linked_list.push(value));
    return linked_list;
  }

  first() {
    return this.head?.value;
  }

  last() {
    return this.tail?.value;
  }

  is_empty() {
    return !this.tail;
  }

  get_length() {
    return this.length;
  }

  unshift(value: any) {
    // update the length of linked list
    this.length++;

    // Make new node to be a head.
    const new_node = new DoublyLinkedListNode(value, this.head);

    // If there is head, then it won't be head anymore.
    // Therefore, make its previous reference to be new node (new head).
    // Then mark the new node as head.
    if (this.head) {
      this.head.previous = new_node;
    }

    this.head = new_node;

    // If there is no tail yet let's make new node a tail.
    if (!this.tail) {
      this.tail = new_node;
    }

    return this;
  }

  push(value: any) {
    // update the length of linked list
    this.length++;

    const new_node = new DoublyLinkedListNode(value);

    // If there is no head yet let's make new node a head.
    if (!this.head) {
      this.head = new_node;
      this.tail = new_node;
      return this;
    }

    // Attach new node to the end of linked list.
    this.tail!.next = new_node;

    // Attach current tail to the new node's previous reference.
    new_node.previous = this.tail;

    // Set new node to be the tail of linked list.
    this.tail = new_node;

    return this;
  }

  delete(value: any) {
    if (!this.head) {
      return undefined;
    }

    let deleted_node = undefined;
    let current_node: NodeType = this.head;

    while (current_node) {
      if (this.compare.equal(current_node.value, value)) {
        deleted_node = current_node;

        if (deleted_node === this.head) {
          // If HEAD is going to be deleted...

          // Set head to second node, which will become new head.
          this.head = deleted_node.next;

          // Set new head's previous to undefined.
          if (this.head) {
            this.head.previous = undefined;
          }

          // If all the nodes in list has same value that is passed as argument
          // then all nodes will get deleted, therefore tail needs to be updated.
          if (deleted_node === this.tail) {
            this.tail = undefined;
          }
        } else if (deleted_node === this.tail) {
          // If TAIL is going to be deleted...
          // Set tail to second last node, which will become new tail.
          this.tail = deleted_node.previous;
          this.tail!.next = undefined;
        } else {
          // If MIDDLE node is going to be deleted...
          const previous_node = deleted_node.previous;
          const next_node = deleted_node.next;

          previous_node!.next = next_node;
          next_node!.previous = previous_node;
        }

        // update the length of linked list
        this.length--;
      }

      current_node = current_node.next;
    }

    return deleted_node?.value;
  }

  find(value = undefined, callback: Function) {
    if (!this.head) {
      return undefined;
    }

    let current_node: NodeType = this.head;

    while (current_node) {
      // If callback is specified then try to find node by callback.
      if (callback && callback(current_node.value)) {
        return current_node?.value;
      }

      // If value is specified then try to compare by value...
      if (
        value !== undefined &&
        this.compare.equal(current_node.value, value)
      ) {
        return current_node?.value;
      }

      current_node = current_node.next;
    }

    return undefined;
  }

  pop() {
    if (!this.tail) {
      // No tail to delete.
      return undefined;
    }

    if (this.head === this.tail) {
      // There is only one node in linked list.
      const deleted_tail = this.tail;
      this.head = undefined;
      this.tail = undefined;

      // update the length of linked list
      this.length--;
      return deleted_tail?.value;
    }

    // If there are many nodes in linked list...
    const deleted_tail = this.tail;

    this.tail = this.tail.previous;
    this.tail!.next = undefined;

    // update the length of linked list
    this.length--;
    return deleted_tail?.value;
  }

  shift() {
    if (!this.head) {
      return undefined;
    }

    const deleted_head = this.head;

    if (this.head.next) {
      this.head = this.head.next;
      this.head.previous = undefined;
    } else {
      this.head = undefined;
      this.tail = undefined;
    }

    // update the length of linked list
    this.length--;

    return deleted_head?.value;
  }

  to_array() {
    const nodes = [];

    let current_node = this.head;

    while (current_node) {
      nodes.push(current_node);
      current_node = current_node.next;
    }

    return nodes;
  }

  to_string(callback: Function) {
    return this.to_array()
      .map((node) => node.to_string(callback))
      .toString();
  }

  reverse() {
    let curr_node = this.head;
    let prev_node = undefined;
    let next_node = undefined;

    while (curr_node) {
      // Store next node.
      next_node = curr_node.next;
      prev_node = curr_node.previous;

      // Change next node of the current node, so it would link to previous node.
      curr_node.next = prev_node;
      curr_node.previous = next_node;

      // Move prev_node and curr_node nodes one step forward.
      prev_node = curr_node;
      curr_node = next_node;
    }

    // Reset head and tail.
    this.tail = this.head;
    this.head = prev_node;

    return this;
  }

  map(callback: (card: CardNode) => ReactNode): ReactNode {
    let result: ReactNode[] = [];

    let p = this.head;

    while (p && p.value) {
      result.push(callback(p.value));
      p = p.next;
    }

    return result;
  }
}
