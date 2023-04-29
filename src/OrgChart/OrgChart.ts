class CardNode {
  name: string;
  children: Array<CardNode>;

  constructor(name: string) {
    this.name = name;
    this.children = [];
  }
}

class OrgChart {
  root?: CardNode;

  constructor(card_list: Array<any>) {
    console.log(card_list);
    this.root = undefined;
  }
}

export { CardNode, OrgChart };
