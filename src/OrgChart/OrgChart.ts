// Import Utils
import { is_even, is_leaf } from "./utils";
import { DoublyLinkedList } from "./DoublyLinkedList";

class CardNode {
  id: string;
  name: string;
  children: Array<CardNode>;
  parent?: CardNode;
  previous?: CardNode;
  level_previous?: CardNode;
  width?: number;
  height?: number;
  ratio_pos_x: number;
  ratio_pos_y: number;
  pos_x: number;
  pos_y: number;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
    this.children = [];
    this.parent = undefined;
    this.previous = undefined;
    this.level_previous = undefined;
    this.width = 0;
    this.height = 0;
    this.ratio_pos_x = -Infinity;
    this.ratio_pos_y = 0;
    this.pos_x = -Infinity;
    this.pos_y = 0;
  }
}

class OrgChart {
  root?: CardNode;
  previous_card?: CardNode;
  card_map?: Map<string, CardNode>;
  card_list: Array<CardNode>;
  card_linked_list: DoublyLinkedList;
  fixed_size: boolean;
  fixed_width?: number;
  fixed_height?: number;
  fixed_overall_width?: number;
  fixed_overall_height?: number;
  horizon_gap: number;
  vertical_gap: number;

  constructor(
    card_list: Array<any>,
    // todo: typescript enhancement
    fixed_size: boolean = true,
    fixed_width?: number,
    fixed_height?: number,
    horizon_gap = 10,
    vertical_gap = 40
  ) {
    // initialization
    this.card_list = [];
    this.fixed_size = fixed_size;
    this.fixed_width = fixed_width;
    this.fixed_height = fixed_height;
    this.horizon_gap = horizon_gap;
    this.vertical_gap = vertical_gap;
    this.card_linked_list = new DoublyLinkedList();

    if (fixed_size && fixed_width && fixed_height) {
      this.fixed_overall_width = fixed_width + horizon_gap;
      this.fixed_overall_height = fixed_height + vertical_gap;
    }

    // process exception
    if (!card_list || !card_list.length) {
      return;
    }

    // create the root node
    let root_data = card_list[0];
    this.root = new CardNode(root_data.id, root_data.name);
    this.card_map = new Map();
    this.card_map.set(this.root.id, this.root);

    // generate card node from raw data
    this.initialize_tree_from_raw_data(card_list);

    // build the level previous relationship
    this.link_level_prev_card_and_build_card_list();

    // update the space for each node
    this.update_node_horizon_space(this.root);
  }

  initialize_tree_from_raw_data(card_list: Array<any>) {
    let card_list_len = card_list.length;

    // build card node map
    for (let i = 1; i < card_list_len; i++) {
      let { id, name } = card_list[i];
      this.card_map!.set(id, new CardNode(id, name));
    }

    // establish relationship between nodes
    for (let i = 0; i < card_list_len; i++) {
      let { id, children } = card_list[i];
      let card = this.card_map!.get(id)!;
      let previous_card = undefined;

      for (let j = 0; j < children.length; j++) {
        let child = this.card_map!.get(children[j])!;
        child.parent = card;
        child.previous = previous_card;
        previous_card = child;
        card.children.push(child!);
      }
    }
  }

  link_level_prev_card_and_build_card_list() {
    let level = -1;
    let queue = DoublyLinkedList.from_array([this.root]);

    while (!queue.is_empty()) {
      level++;

      let len = queue.get_length();
      let pre_level_card = undefined;

      for (let i = 0; i < len; i++) {
        let card = queue.shift();
        card!.ratio_pos_y = level;
        card!.level_previous = pre_level_card;
        pre_level_card = card;

        // build card_list
        this.card_list.push(card!);
        this.card_linked_list!.push(card!);

        // loop the next level of nodes
        let children = card!.children;
        for (let j = 0; j < children.length; j++) {
          queue.push(children[j]);
        }
      }
    }
  }

  update_node_horizon_space(node: CardNode) {
    for (let i = 0; i < node.children.length; i++) {
      this.update_node_horizon_space(node.children[i]);
    }

    // todo: for test only
    // console.log(`node id: ${node.id}`);

    // most left node of each subtree
    this.update_node_horizon_space_most_left_leaf(node);

    // sibling node
    this.update_node_horizon_space_sibling_nodes(node);

    // go to the parent node
    this.update_node_horizon_space_parent_node(node);

    // convert coordinate ratio to detailed coordinate value
    this.convert_ratio_coordinate_to_detail_val(node);
  }

  update_node_horizon_space_most_left_leaf(node: CardNode) {
    // most left node of each subtree
    if (is_leaf(node) && node.previous === undefined) {
      node.ratio_pos_x = 0;
      this.readjust_horizon_pos_of_subtree(node);
      this.previous_card = node;
      return;
    }
  }

  update_node_horizon_space_sibling_nodes(node: CardNode) {
    // sibling node
    if (node.previous === this.previous_card) {
      node.ratio_pos_x = node.previous!.ratio_pos_x + 1;
      this.previous_card = node;
      return;
    }
  }

  update_node_horizon_space_parent_node(node: CardNode) {
    if (this.previous_card?.parent === node) {
      if (node.children.length === 1) {
        // todo: performance optimization -> readjust_horizon_pos_of_subtree ?
        // if the parent only has one child, the ratio_pos_x of the parent node will as same as the child
        node.ratio_pos_x = this.previous_card.ratio_pos_x;
        // odd number case
      } else if (!is_even(node.children.length)) {
        let mid_pos = ~~(node.children.length / 2);
        node.ratio_pos_x = node.children[mid_pos].ratio_pos_x;
      } else {
        let start = node.children[0].ratio_pos_x;
        let end = node.children[node.children.length - 1].ratio_pos_x;
        node.ratio_pos_x = (start + end) / 2;
      }

      this.readjust_horizon_pos_of_subtree(node);
      this.previous_card = node;
      return;
    }
  }

  convert_ratio_coordinate_to_detail_val(node: CardNode) {
    // convert coordinate ratio to detailed coordinate value
    if (this.fixed_overall_width) {
      node.pos_x = node.ratio_pos_x * this.fixed_overall_width;
    }

    if (this.fixed_overall_height) {
      node.pos_y = node.ratio_pos_y * this.fixed_overall_height;
    }
  }

  readjust_horizon_pos_of_subtree(node: CardNode) {
    if (node.level_previous) {
      let min_pos = node.level_previous.ratio_pos_x + 1;
      if (min_pos < node.ratio_pos_x) {
        return;
      }

      let diff = min_pos - node.ratio_pos_x;
      let queue = DoublyLinkedList.from_array([node]);

      while (!queue.is_empty()) {
        let node = queue.shift();
        node!.ratio_pos_x = node!.ratio_pos_x + diff;
        let children = node!.children;
        for (let i = 0; i < children.length; i++) {
          queue.push(children[i]);
        }
      }
    }
  }

  get_render_data() {
    // return this.card_list;
    return this.card_linked_list;
  }
}

export { CardNode, OrgChart };
