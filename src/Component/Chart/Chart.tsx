// Import React Framework
import React, { ReactNode } from "react";

// Import Customized Component
import SimpleOrgChart from "../SimpleOrgChart";

// Import Interface
import { CardNode } from "../../OrgChart/OrgChart";

// Import CSS
import ChartStyle from "./Chart.module.css";
import { DoubleLinkedList } from "../../OrgChart/DoubleLinkedList";

// Interface
interface ChartPropsInterface {
  list: CardNode[] | DoubleLinkedList;
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
