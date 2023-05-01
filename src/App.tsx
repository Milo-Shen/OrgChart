// Import React Framework
import React, { useEffect, useRef, useState } from "react";

// Import Customized Component
import SimpleOrgChart from "./Component/SimpleOrgChart/SimpleOrgChart";
import LevelContainer from "./Component/LevelContainer/LevelContainer";

// Import Interfaces
import { LevelChartInterface } from "./OrgChart/OrgChartType";

// Import Utils
import { OrgChart } from "./OrgChart/OrgChart";
import { mock_org_chart_data } from "./Utils/mock_org_chart_data";

function App() {
  let is_fetch = useRef(false);

  let [card_list, set_card_list] = useState<Array<LevelChartInterface>>([]);

  useEffect(() => {
    if (is_fetch.current) {
      return;
    }

    let now = performance.now();
    let data = mock_org_chart_data(100, 5);
    let chart = new OrgChart(data);
    let render_data = chart.get_render_data();
    set_card_list(render_data.render_list);
    console.log(`${performance.now() - now} ms`);
    console.log(chart, render_data);

    return () => {
      is_fetch.current = true;
    };
  }, []);

  return (
    <div className="App">
      {card_list.map((level) => (
        <LevelContainer key={level.level}>
          {level.list.map((card) => (
            <SimpleOrgChart
              key={card.id}
              name={card.name}
              pos_x={card.pos_x}
              pos_y={card.pos_y}
            />
          ))}
        </LevelContainer>
      ))}
    </div>
  );
}

export default App;
