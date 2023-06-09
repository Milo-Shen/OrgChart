// Import Utils
import { generate_id, range } from "./generate_id";
import { DoublyLinkedList } from "../OrgChart/DoublyLinkedList";

function build_card(): { id: string; name: string; children: any[] } {
  let id = generate_id();
  return {
    id: id,
    name: id,
    children: [],
  };
}

export function mock_org_chart_data(count: number = 1, max_child?: number, is_range = false) {
  max_child = max_child || Math.sqrt(count);
  let result = [];
  let queue = new DoublyLinkedList<any>();

  // generated leaf count
  let remain_count = count - 1;

  // build the root leaf
  let root = build_card();

  result.push(root);
  queue.push(root);

  while (!queue.is_empty()) {
    let node = queue.shift();
    let children: any[] = [];
    let children_count = Math.min(max_child, remain_count);
    if (is_range) {
      children_count = range(Math.min(max_child, remain_count));
    }

    for (let i = 0; i < children_count; i++) {
      remain_count--;
      let card = build_card();
      children.push(card.id);
      queue.push(card);
      result.push(card);
    }

    node!.children = children;

    if (remain_count <= 0) {
      return result;
    }
  }

  return result;
}
