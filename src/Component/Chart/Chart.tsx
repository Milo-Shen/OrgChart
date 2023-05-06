// Import React Framework
import React, { ReactNode } from "react";

// Import Customized Component
import SimpleOrgChart from "../SimpleOrgChart";
import LevelContainer from "../LevelContainer";

// Import Interface
import { LevelChartInterface } from "../../OrgChart/OrgChartType";

// Import CSS

// Interface
interface ChartPropsInterface {
  list: Array<LevelChartInterface>;
  children?: ReactNode | ReactNode[];
}

function Chart(props: ChartPropsInterface) {
  const { list, children } = props;
  return (
    <div>
      {list.map((level) => (
        <LevelContainer key={level.level}>
          {level.list.map((card) => (
            <SimpleOrgChart
              key={card.id}
              name={card.name}
              parent_id={card.parent?.id}
              pos_x={card.ratio_pos_x}
              pos_y={card.ratio_pos_y}
            />
          ))}
        </LevelContainer>
      ))}
    </div>
  );
}

Chart.defaultProps = {
  card_list: [],
};

export default Chart;
