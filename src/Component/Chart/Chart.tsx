// Import React Framework
import React, { ReactNode } from "react";

// Import Customized Component
import SimpleOrgChart from "../SimpleOrgChart";

// Import Interface
import { LevelChartInterface } from "../../OrgChart/OrgChartType";

// Import CSS
import ChartStyle from "./Chart.module.css";

// Interface
interface ChartPropsInterface {
  list: Array<LevelChartInterface>;
  children?: ReactNode | ReactNode[];
}

function Chart(props: ChartPropsInterface) {
  const { list } = props;
  return (
    <div className={ChartStyle.chart}>
      {list.map((level) =>
        level.list.map((card) => (
          <SimpleOrgChart
            key={card.id}
            name={card.name}
            parent_id={card.parent?.id}
            ratio_pos_x={card.ratio_pos_x}
            ratio_pos_y={card.ratio_pos_y}
            pos_x={card.pos_x}
            pos_y={card.pos_y}
          />
        ))
      )}
    </div>
  );
}

Chart.defaultProps = {
  card_list: [],
};

export default Chart;
