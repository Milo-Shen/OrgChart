// Import Interface
import { LevelChartInterface } from "./OrgChartType";

// Import Utils
import { is_even } from "../Utils/even";

class CardNode {
  id: string;
  name: string;
  children: Array<CardNode>;
  parent?: CardNode;
  previous?: CardNode;
  width: number;
  height: number;
  pos_x: number;
  pos_y: number;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
    this.children = [];
    // todo: width, height, parent maybe useless
    this.parent = undefined;
    this.previous = undefined;
    this.width = 200;
    this.height = 100;
    this.pos_x = 0;
    this.pos_y = 0;
  }
}

class OrgChart {
  root?: CardNode;
  first_visited: boolean;
  previous_card?: CardNode;
  card_map?: Map<string, CardNode>;

  constructor(card_list: Array<any>) {
    this.first_visited = true;

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

    // update the space for each node
    this.update_node_space(this.root);
  }

  update_node_space(node: CardNode) {
    for (let i = 0; i < node.children.length; i++) {
      this.update_node_space(node.children[i]);
    }

    // todo: for test only
    console.log(node.id);

    // the first left node
    if (this.first_visited && node.previous === undefined) {
      node.pos_x = 1;
      this.first_visited = false;
      this.previous_card = node;
      return;
    }

    // nodes belongs to a same parent node
    if (node.previous === this.previous_card) {
      node.pos_x = node.previous!.pos_x + 1;
      this.previous_card = node;
      return;
    }

    // go to the father node
    if (this.previous_card?.parent === node) {
      if (node.children.length === 1) {
        // if the parent only has one child, the pos_x of the parent node will as same as the child
        node.pos_x = this.previous_card.pos_x;
      } else if (!is_even(node.children.length)) {
        let start = node.children[0].pos_x;
        let end = node.children[node.children.length - 1].pos_x;
        node.pos_x = start + ~~((end - start) / 2);
      } else {
        let start = node.children[0].pos_x;
        let end = node.children[node.children.length - 1].pos_x;
        node.pos_x = (start + end) / 2;
      }

      this.previous_card = node;
      return;
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
