// Import React Framework
import React, { ReactNode } from "react";

// Import Interface
import { CardNode } from "../../OrgChart/OrgChart";

// Import CSS
import ChartStyle from "./Chart.module.css";
import { DoublyLinkedList } from "../../OrgChart/DoublyLinkedList";

// Interface
interface ChartPropsInterface {
  list: CardNode[] | DoublyLinkedList;
  card_template: (card: CardNode) => ReactNode;
  children?: ReactNode | ReactNode[];
}

function Chart(props: ChartPropsInterface) {
  const { list, card_template } = props;

  return (
    <div className={ChartStyle.chart}>
      {list.map((card) => card_template(card))}
    </div>
  );
}

Chart.defaultProps = {
  card_list: [],
};

export default Chart;
