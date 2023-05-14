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
      {/* todo: key of line should be identified */}
      {data.line_list.map((line, index) => (
        <Line
          key={index}
          width={line.width}
          height={line.height}
          pos_x={line.pos_x}
          pos_y={line.pos_y}
          type={line.type}
          color={line.color}
          border_width={line.border_width}
        />
      ))}
    </div>
  );
}

Chart.defaultProps = {
  card_list: [],
};

export default Chart;
