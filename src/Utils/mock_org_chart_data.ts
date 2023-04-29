// Import Utils
import { nanoid } from "nanoid";

function build_card(): { id: string; child: any[] } {
  return {
    id: nanoid(),
    child: [],
  };
}

export function mock_org_chart_data(count: number = 1, max_child?: number) {
  max_child = max_child || Math.sqrt(count);
  let result = [];
  let queue = [];

  // generated leaf count
  let generated_total = 1;

  // build the root leaf
  let root = build_card();

  queue.push(root);

  while (queue.length) {
    let node = queue.shift();
    let temp: any[] = [];

    for (let i = 0; i < max_child; i++) {
      generated_total++;
      let card = build_card();
      queue.push(card);
      result.push(card);
    }

    node!.child = temp;

    if (generated_total >= count) {
      return result;
    }
  }

  result.push(root);

  return result;
}
