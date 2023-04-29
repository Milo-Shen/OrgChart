class CardNode {
  id: string;
  name: string;
  children: Array<CardNode>;
  width: number;
  height: number;
  pos_x: number;
  pos_y: number;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
    this.children = [];
    this.width = 200;
    this.height = 100;
    this.pos_x = 0;
    this.pos_y = 0;
  }
}

class OrgChart {
  static horizon_gap = 10;

  root?: CardNode;
  max_width: number;
  max_height: number;
  card_map?: Map<string, CardNode>;

  constructor(card_list: Array<any>) {
    this.max_width = 0;
    this.max_height = 0;

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

      for (let j = 0; j < children.length; j++) {
        let child = this.card_map.get(children[j]);
        card!.children.push(child!);
      }
    }
  }

  get_render_data() {
    let render_list: Array<Array<CardNode>> = [];
    let queue = [this.root];
    let max_horizon_count = -1;
    let level = 0;

    while (queue.length) {
      level++;

      // todo
      console.log(level);
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

      render_list.push(level_card_list);
      max_horizon_count = Math.max(max_horizon_count, level_card_list.length);
    }

    return { render_list, max_horizon_count };
  }
}

export { CardNode, OrgChart };
