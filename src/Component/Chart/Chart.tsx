// Import React Framework
import React, { ReactNode } from "react";

// Import Interface & Types & Classes
import { CardNode, ChartRenderData } from "../../OrgChart/OrgChart";

// Import Customized Component
import Line from "../Line";

// Import CSS
import ChartStyle from "./Chart.module.css";

// Interface
interface ChartPropsInterface {
  data: ChartRenderData;
  card_template: (card: CardNode) => ReactNode;
  children?: ReactNode | ReactNode[];
}

function Chart(props: ChartPropsInterface) {
  const { data, card_template } = props;

  return (
    <div className={ChartStyle.chart}>
      {data.card_list.map((card) => card_template(card))}
      {data.line_list.map((line) => (
        <Line
          width={line.width}
          height={line.height}
          pos_x={line.pos_x}
          pos_y={line.pos_y}
        />
      ))}
    </div>
  );
}

Chart.defaultProps = {
  card_list: [],
};

export default Chart;
