// Import Classes, Interfaces, Type
import { LineNode, LineType } from "./Line";

// Import Utils
import {
  is_even,
  is_leaf,
  traverse_tree_by_dfs,
  traverse_tree_by_level,
  is_most_left_leaf_of_a_sub_tree,
} from "./utils";
import { DoublyLinkedList } from "./DoublyLinkedList";

// Export Classes, Interfaces, Type
export type ChartRenderData<T> = {
  card_list: CardNode<T>[] | DoublyLinkedList<CardNode<T>>;
  // todo: may convert line_list to linked list later
  line_list: LineNode[];
};

export enum CardNodeType {
  NORMAL = 0,
  LITE = 1 << 0,
  BATCH = 1 << 1,
  EXTEND = 1 << 2,
}

export enum OrgChartDirection {
  Horizontal = "Horizontal",
  Vertical = "Vertical",
}

export enum OrgChartMode {
  "OrgChart" = "OrgChart",
  "Flexible" = "Flexible",
}

// Export Constants
export const chartRenderDefaultData = { card_list: [], line_list: [] };

// todo: only for test, remove it later
let readjust_horizon_pos_count = 0;
let readjust_horizon_pos_count_v1 = 0;

class CardNode<T> {
  id: string;
  name: string;
  content?: T;
  children: Array<CardNode<T>>;
  parent?: CardNode<T>;
  previous?: CardNode<T>;
  level?: number;
  level_previous?: CardNode<T>;
  level_first?: CardNode<T>;
  width: number;
  height: number;
  pos_x: number;
  pos_y: number;
  most_right_pos_x: number;
  mode: CardNodeType;

  constructor(
    id: string,
    name: string,
    w: number = 0,
    h: number = 0,
    mode: CardNodeType = CardNodeType.NORMAL,
    content: T = undefined as T
  ) {
    this.id = id;
    this.name = name;
    this.children = [];
    this.parent = undefined;
    this.previous = undefined;
    this.level_previous = undefined;
    this.level_first = undefined;
    this.level = -Infinity;
    this.width = w;
    this.height = h;
    this.pos_x = -Infinity;
    this.pos_y = 0;
    this.most_right_pos_x = -Infinity;
    this.content = content;
    this.mode = mode;
  }
}

class OrgChart<T> {
  root?: CardNode<T>;
  previous_card?: CardNode<T>;
  card_map: Map<string, CardNode<T>>;
  most_right_map: Map<string, number>;
  card_list: Array<CardNode<T>>;
  card_linked_list: DoublyLinkedList<CardNode<T>>;
  line_list: Array<LineNode>;
  line_width: number;
  line_color: string;
  line_radius: number;
  fixed_size: boolean;
  fixed_width?: number;
  fixed_height?: number;
  lite_width?: number;
  lite_height?: number;
  horizon_gap: number;
  vertical_gap: number;
  batch_column_capacity: number;
  direction?: OrgChartDirection;
  mode?: OrgChartMode;

  constructor(
    direction: OrgChartDirection = OrgChartDirection.Vertical,
    mode: OrgChartMode = OrgChartMode.Flexible,
    card_raw_list: Array<any>,
    // todo: typescript enhancement
    fixed_size: boolean = true,
    fixed_width?: number,
    fixed_height?: number,
    lite_width?: number,
    lite_height?: number,
    horizon_gap: number = 10,
    vertical_gap: number = 40,
    line_width: number = 1,
    line_color: string = "#6A6D70",
    line_radius: number = 0,
    batch_column_capacity: number = 6
  ) {
    // initialization
    this.card_list = [];
    this.line_list = [];
    this.card_map = new Map();
    this.most_right_map = new Map();
    this.line_width = line_width;
    this.line_color = line_color;
    this.line_radius = line_radius;
    this.fixed_size = fixed_size;
    this.fixed_width = fixed_width;
    this.fixed_height = fixed_height;
    this.lite_width = lite_width;
    this.lite_height = lite_height;
    this.horizon_gap = horizon_gap;
    this.vertical_gap = vertical_gap;
    this.card_linked_list = new DoublyLinkedList();
    this.previous_card = undefined;
    this.batch_column_capacity = batch_column_capacity;
    this.direction = direction;
    this.mode = mode;

    // process exception
    if (!card_raw_list || !card_raw_list.length) {
      return;
    }

    // create the root node
    let root_data = card_raw_list[0];
    let { id, name, width, height } = root_data;
    this.root = new CardNode<T>(id, name, width, height);
    this.root.pos_y = 0;

    this.initialize_fixed_width_height_of_a_node(this.root);

    // initial the card map
    this.card_map.set(this.root.id, this.root);

    // generate card node from raw data
    this.initialize_tree_from_raw_data(card_raw_list);

    // build the level previous relationship
    this.link_level_prev_card_and_build_card_list();

    // generate the horizon x position and lines
    this.generate_horizon_pos_and_lines();
  }

  generate_horizon_pos_and_lines() {
    if (!this.root) {
      return;
    }

    // update the horizon space for each node
    this.update_node_horizon_space(this.root);

    // todo: update the vertical space for each node ( not necessary ? )

    // calculate the line pos
    this.calculate_line_pos(this.root);
  }

  initialize_fixed_width_height_of_a_node(node: CardNode<T>) {
    // process the fixed size type
    if (this.fixed_size && this.fixed_width && this.fixed_height) {
      node.width = this.fixed_width;
      node.height = this.fixed_height;
    }
  }

  initialize_tree_from_raw_data(card_raw_list: Array<any>) {
    let card_list_len = card_raw_list.length;

    // build card node map
    for (let i = 1; i < card_list_len; i++) {
      let { id, name, width, height } = card_raw_list[i];
      let new_card = new CardNode<T>(id, name, width, height);

      // process the fixed size type
      this.initialize_fixed_width_height_of_a_node(new_card);

      this.card_map!.set(id, new_card);
    }

    // establish relationship between nodes
    for (let i = 0; i < card_list_len; i++) {
      let { id, children } = card_raw_list[i];
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
    let queue = DoublyLinkedList.from_array<CardNode<T>>([this.root]);

    // the current level of card node
    let level = 0;

    while (!queue.is_empty()) {
      let len = queue.get_length();
      let pre_level_card = undefined;
      level++;

      let level_first = queue.first();
      for (let i = 0; i < len; i++) {
        let card = queue.shift()!;

        if (card.parent) {
          card.pos_y = card.parent.pos_y + card.parent.height + this.vertical_gap;
        } else {
          card.pos_y = 0;
        }

        // link the level previous card node to the current node
        card!.level_previous = pre_level_card;
        card!.level = level;
        card!.level_first = level_first;

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

  update_node_horizon_space(root: CardNode<T>) {
    this.previous_card = undefined;

    traverse_tree_by_dfs(root, (node) => {
      console.log(`node.id: ${node.id}`);

      // most left node of each subtree
      this.update_node_horizon_space_most_left_leaf(node);

      // sibling node
      this.update_node_horizon_space_sibling_nodes(node);

      // go to the parent node
      this.update_node_horizon_space_parent_node(node);
    });
  }

  readjust_by_the_most_right_pos_x_of_a_subtree(left_node: CardNode<T> | undefined, root: CardNode<T>) {
    if (!left_node) {
      return;
    }

    let most_right_pos = this.most_right_map.get(left_node.id) || -Infinity;

    if (most_right_pos === -Infinity) {
      traverse_tree_by_level(left_node, (node) => {
        let new_pos = node.pos_x + node.width + this.horizon_gap;
        if (most_right_pos < new_pos) {
          most_right_pos = new_pos;
        }
      });
    }

    this.most_right_map.set(left_node.id, most_right_pos);

    if (root.pos_x > most_right_pos) {
      return;
    }

    root.pos_x = most_right_pos;
  }

  update_node_horizon_space_most_left_leaf(node: CardNode<T>) {
    // most left node of each subtree
    if (!is_most_left_leaf_of_a_sub_tree(node)) {
      return;
    }

    console.log(`most_left_leaf: ${node.id}`);

    if (node.level_previous?.pos_x !== undefined) {
      // todo: the below code can be ignored
      // todo: because we already have "readjust by the_most right pos x of a subtree: function
      node.pos_x = node.level_previous.pos_x + node.level_previous.width + this.horizon_gap;
    } else {
      node.pos_x = 0;
    }

    this.readjust_by_the_most_right_pos_x_of_a_subtree(this.previous_card, node);

    this.previous_card = node;
  }

  update_node_horizon_space_sibling_nodes(node: CardNode<T>) {
    // sibling node
    if (node.previous !== this.previous_card) {
      return;
    }

    console.log(`sibling_nodes: ${node.id}`);

    this.readjust_by_the_most_right_pos_x_of_a_subtree(node.level_previous, node);

    this.previous_card = node;
  }

  update_node_horizon_space_parent_node(node: CardNode<T>) {
    if (this.previous_card?.parent !== node) {
      return;
    }

    console.log(`parent node: ${node.id}`);

    if (node.children.length === 1) {
      // if the parent only has one child, the pos_x of the parent node will as same as the child
      let diff = (node.children[0].width - node.width) / 2;
      node.pos_x = this.previous_card.pos_x + diff;
      // odd number case
    } else if (!is_even(node.children.length)) {
      let mid_pos = ~~(node.children.length / 2);
      let mid_node = node.children[mid_pos];
      let diff = (mid_node.width - node.width) / 2;
      node.pos_x = mid_node.pos_x + diff;
    } else {
      let first_node = node.children[0];
      let last_node = node.children[node.children.length - 1];
      node.pos_x = (first_node.pos_x + last_node.pos_x - node.width) / 2 + (first_node.width + last_node.width) / 4;
    }

    // todo: performance optimization -> readjust_horizon_pos_of_subtree ?
    this.readjust_horizon_pos_of_subtree(node);

    this.readjust_by_the_most_right_pos_x_of_a_subtree(node.previous, node);

    this.previous_card = node;
  }

  // todo: whether the readjust_horizon_pos_of_subtree is necessary now ?
  readjust_horizon_pos_of_subtree(node: CardNode<T>) {
    if (!node.level_previous) {
      return;
    }

    let min_pos = node.level_previous.pos_x + node.level_previous.width + this.horizon_gap;
    if (min_pos < node.pos_x) {
      return;
    }

    // todo: only for test, remove it later
    readjust_horizon_pos_count++;

    let diff = min_pos - node.pos_x;
    let queue = DoublyLinkedList.from_array<CardNode<T>>([node]);

    while (!queue.is_empty()) {
      readjust_horizon_pos_count_v1++;
      let node = queue.shift();
      node!.pos_x = node!.pos_x + diff;
      let children = node!.children;
      for (let i = 0; i < children.length; i++) {
        queue.push(children[i]);
      }
    }
  }

  calculate_line_pos(root: CardNode<T>) {
    traverse_tree_by_level(root, (node) => {
      if (is_leaf(node)) {
        return;
      }

      // create line node
      let children_len = node.children.length;

      // case one: one parent has one child
      if (children_len === 1) {
        let x = node.pos_x + (node.width - this.line_width) / 2;
        let y = node.pos_y + node.height;
        let w = this.line_width;
        let h = this.vertical_gap;
        let line_node = this.create_line_node(LineType.Line, x, y, w, h);
        this.line_list.push(line_node);
      } else {
        // case two: one parent has multi children
        let first = node.children[0];
        let last = node.children[node.children.length - 1];

        // get the mid pos of a card
        let start = first.pos_x + (first.width - this.line_width) / 2;
        let end = last.pos_x + (last.width - this.line_width) / 2;

        // update line info
        let x = start;
        let h = (this.vertical_gap + this.line_width) / 2;
        let y = first.pos_y - h;
        let w = end - start;
        let square_node = this.create_line_node(LineType.Square, x, y, w, h);
        this.line_list.push(square_node);

        // case three: parent to category line
        x = node.pos_x + (node.width - this.line_width) / 2;
        y = node.pos_y + node.height;
        w = this.line_width;
        h = (this.vertical_gap - this.line_width) / 2;
        let p_to_c_line = this.create_line_node(LineType.Line, x, y, w, h);
        this.line_list.push(p_to_c_line);

        // case four: parent to node line
        for (let i = 1; i < node.children.length - 1; i++) {
          let child = node.children[i];
          let x = child.pos_x + (child.width - this.line_width) / 2;
          let y = child.pos_y - (this.vertical_gap + this.line_width) / 2;
          let w = this.line_width;
          let h = (this.vertical_gap + this.line_width) / 2;
          let p_to_n_line = this.create_line_node(LineType.Line, x, y, w, h);
          this.line_list.push(p_to_n_line);
        }
      }
    });
  }

  create_line_node(type: LineType, x: number, y: number, w: number, h: number) {
    let line_node = new LineNode();
    line_node.mode = type;
    line_node.color = this.line_color;
    line_node.border_width = this.line_width;
    line_node.border_radius = this.line_radius;
    line_node.pos_x = x;
    line_node.pos_y = y;
    line_node.width = w;
    line_node.height = h;
    return line_node;
  }

  get_render_data(): ChartRenderData<T> {
    // return this.card_list;
    // todo: only for test, remove it later
    console.log(readjust_horizon_pos_count);
    console.log(readjust_horizon_pos_count_v1);
    return {
      card_list: this.card_linked_list,
      line_list: this.line_list,
    };
  }
}

export { CardNode, OrgChart };
