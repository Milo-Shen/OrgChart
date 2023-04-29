class CardNode {
  id: string;
  name: string;
  children: Array<CardNode>;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
    this.children = [];
  }
}

class OrgChart {
  root?: CardNode;
  card_map?: Map<string, CardNode>;

  constructor(card_list: Array<any>) {
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
}

export { CardNode, OrgChart };
