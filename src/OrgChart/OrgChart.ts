// Import Interface
import { LevelChartInterface } from "./OrgChartType";

// Import Utils
import { is_even, is_leaf } from "./utils";

class CardNode {
  id: string;
  name: string;
  children: Array<CardNode>;
  parent?: CardNode;
  previous?: CardNode;
  level_previous?: CardNode;
  width?: number;
  height?: number;
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
    this.pos_x = -Infinity;
    this.pos_y = 0;
  }
}

class OrgChart {
  root?: CardNode;
  previous_card?: CardNode;
  card_map?: Map<string, CardNode>;
  fixed_size: boolean;
  fixed_width?: number;
  fixed_height?: number;
  min_gap: number;

  constructor(
    card_list: Array<any>,
    // todo: typescript enhancement
    fixed_size: boolean = true,
    fixed_width?: number,
    fixed_height?: number,
    min_gap = 10
  ) {
    // initialization
    this.fixed_size = fixed_size;
    this.fixed_width = fixed_width;
    this.fixed_height = fixed_height;
    this.min_gap = min_gap;

    // process exception
    let card_list_len = card_list.length;
    if (!card_list || !card_list_len) {
      return;
    }

    // create the root node
    let root_data = card_list[0];
    this.root = new CardNode(root_data.id, root_data.name);
    this.card_map = new Map();
    this.card_map.set(this.root.id, this.root);

    // build card node map
    for (let i = 1; i < card_list_len; i++) {
      let { id, name } = card_list[i];
      this.card_map.set(id, new CardNode(id, name));
    }

    // establish relationship between nodes
    for (let i = 0; i < card_list_len; i++) {
      let { id, children } = card_list[i];
      let card = this.card_map.get(id);
      let previous_card = undefined;

      for (let j = 0; j < children.length; j++) {
        let child = this.card_map.get(children[j]);
        child!.parent = card;
        child!.previous = previous_card;
        previous_card = child;
        card!.children.push(child!);
      }
    }

    // build the level previous relationship
    this.generate_level_prev_card_relationship();
    // update the space for each node
    this.update_node_space(this.root);
  }

  readjust_pos_of_subtree(node: CardNode) {
    if (node.level_previous) {
      let min_pos = node.level_previous.pos_x + 1;
      if (min_pos < node.pos_x) {
        return;
      }

      // todo: for test only
      console.log(
        `node: ${node.id}, level_previous: ${node.level_previous?.pos_x}`
      );

      let diff = min_pos - node.pos_x;
      let queue = [node];

      while (queue.length) {
        let node = queue.shift();
        node!.pos_x = node!.pos_x + diff;
        let children = node!.children;
        for (let i = 0; i < children.length; i++) {
          queue.push(children[i]);
        }
      }
    }
  }

  update_node_space(node: CardNode) {
    for (let i = 0; i < node.children.length; i++) {
      this.update_node_space(node.children[i]);
    }

    // todo: for test only
    console.log(`node id: ${node.id}`);

    // most left node of each subtree
    if (is_leaf(node) && node.previous === undefined) {
      node.pos_x = 1;
      this.readjust_pos_of_subtree(node);
      this.previous_card = node;
      return;
    }

    // sibling node
    if (node.previous === this.previous_card) {
      node.pos_x = node.previous!.pos_x + 1;
      this.previous_card = node;
      return;
    }

    // go to the father node
    if (this.previous_card?.parent === node) {
      if (node.children.length === 1) {
        // todo: performance optimization -> readjust_pos_of_subtree ?
        // if the parent only has one child, the pos_x of the parent node will as same as the child
        node.pos_x = this.previous_card.pos_x;
        // odd number case
      } else if (!is_even(node.children.length)) {
        let mid_pos = ~~(node.children.length / 2);
        node.pos_x = node.children[mid_pos].pos_x;
      } else {
        let start = node.children[0].pos_x;
        let end = node.children[node.children.length - 1].pos_x;
        node.pos_x = (start + end) / 2;
      }

      this.readjust_pos_of_subtree(node);
      this.previous_card = node;
      return;
    }
  }

  generate_level_prev_card_relationship() {
    let queue = [this.root];

    while (queue.length) {
      let len = queue.length;
      let pre_level_card = undefined;

      for (let i = 0; i < len; i++) {
        let card = queue.shift();
        card!.level_previous = pre_level_card;
        pre_level_card = card;

        let children = card!.children;
        for (let j = 0; j < children.length; j++) {
          queue.push(children[j]);
        }
      }
    }
  }

  get_render_data() {
    let level = 0;

    let render_list: Array<LevelChartInterface> = [];
    let queue = [this.root];

    while (queue.length) {
      level++;

      let level_card_list: Array<CardNode> = [];
      let len = queue.length;

      for (let i = 0; i < len; i++) {
        let card = queue.shift();
        level_card_list.push(card!);

        let children = card!.children;
        for (let j = 0; j < children.length; j++) {
          queue.push(children[j]);
        }
      }

      render_list.push({ list: level_card_list, level });
    }

    return render_list;
  }
}

export { CardNode, OrgChart };
