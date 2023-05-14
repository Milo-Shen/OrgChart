// Import React Framework
import React, { useEffect, useRef, useState } from "react";

// Import Types
import { ChartRenderData } from "./OrgChart/OrgChart";

// Import Customized Component
import Chart from "./Component/Chart/Chart";
import SimpleOrgChart from "./Component/SimpleOrgChart";

// Import Utils
import {
  CardNode,
  OrgChart,
  chartRenderDefaultData,
} from "./OrgChart/OrgChart";
import { mock_org_chart_data } from "./Utils/mock_org_chart_data";

function App() {
  let is_fetch = useRef(false);

  let [card_list, set_card_list] = useState<ChartRenderData>(
    chartRenderDefaultData
  );

  useEffect(() => {
    if (is_fetch.current) {
      return;
    }

    // todo: test it
    let now = performance.now();
    // let data = mock_org_chart_data(
    //   ~~(Math.random() * 20) + 1,
    //   ~~(Math.random() * 5) + 1,
    //   true
    // );
    let data = mock_org_chart_data(10, 2, false);
    // data[7].children.push("id=11");
    // data.push({ children: ["id=12"], id: "id=11", name: "id=11" });
    // data.push({ children: [], id: "id=12", name: "id=12" });
    let chart = new OrgChart(data, true, 200, 100, 10, 41, 2);
    let render_data = chart.get_render_data();
    set_card_list(render_data);
    console.log(`${performance.now() - now} ms`);
    console.log(chart);
    console.log(render_data);

    return () => {
      is_fetch.current = true;
    };
  }, []);

  return (
    <div className="App">
      <Chart
        data={card_list}
        card_template={(card: CardNode) => (
          <SimpleOrgChart
            key={card.id}
            name={card.name}
            parent_id={card.parent?.id}
            ratio_pos_x={card.ratio_pos_x}
            ratio_pos_y={card.ratio_pos_y}
            width={card.width}
            height={card.height}
            pos_x={card.pos_x}
            pos_y={card.pos_y}
          />
        )}
      />
    </div>
  );
}

export default App;
