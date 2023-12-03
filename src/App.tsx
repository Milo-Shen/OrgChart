// Import React Framework
import React, { useEffect, useRef, useState } from "react";

// Import Types & Interfaces
// Import Utils
import {
  CardNode,
  ChartRenderData,
  chartRenderDefaultData,
  OrgChart,
  OrgChartDirection,
  OrgChartMode,
} from "./OrgChart/OrgChart";
import { UI5CardInterface } from "./Component/UI5Card/UI5Card";

// Import Customized Component
import Chart from "./Component/Chart/Chart";
import SimpleOrgChart from "./Component/SimpleOrgChart";

// import { mock_org_chart_data } from "./Utils/mock_org_chart_data";

function App() {
  let is_fetch = useRef(false);

  let [card_list, set_card_list] = useState<ChartRenderData<UI5CardInterface>>(chartRenderDefaultData);

  useEffect(() => {
    if (is_fetch.current) {
      return;
    }

    // todo: test it
    let now = performance.now();
    let data = [
      { id: "id=0", name: "id=0", children: ["id=1", "id=2"], width: 127, height: 154 },
      { id: "id=1", name: "id=1", children: ["id=3", "id=4"], width: 105, height: 69 },
      { id: "id=2", name: "id=2", children: ["id=5", "id=6"], width: 53, height: 127 },
      { id: "id=3", name: "id=3", children: ["id=7", "id=8"], width: 226, height: 94 },
      { id: "id=4", name: "id=4", children: ["id=9"], width: 179, height: 189 },
      { id: "id=5", name: "id=5", children: ["id=10", "id=11", "id=12"], width: 149, height: 68 },
      { id: "id=6", name: "id=6", children: [], width: 66, height: 216 },
      { id: "id=7", name: "id=7", children: [], width: 239, height: 119 },
      { id: "id=8", name: "id=8", children: ["id=13"], width: 187, height: 77 },
      { id: "id=9", name: "id=9", children: [], width: 68, height: 158 },
      { id: "id=10", name: "id=10", children: [], width: 54, height: 127 },
      { id: "id=11", name: "id=11", children: [], width: 109, height: 220 },
      { id: "id=12", name: "id=12", children: [], width: 109, height: 147 },
      { id: "id=13", name: "id=13", children: [], width: 109, height: 147 },
    ];
    // console.log(JSON.stringify(data));
    // let data = mock_org_chart_data(~~(Math.random() * 30) + 1, ~~(Math.random() * 5) + 1, true);
    // let data = mock_org_chart_data(300000, 20, false);
    console.log(`build mock data time: ${performance.now() - now} ms`);
    now = performance.now();
    let chart = new OrgChart<UI5CardInterface>(
      OrgChartDirection.Horizontal,
      OrgChartMode.Flexible,
      data,
      false,
      200,
      100,
      100,
      50,
      10,
      41,
      2,
      "#6A6D70",
      12,
      2
    );
    let render_data = chart.get_render_data();
    console.log(`build org chart time: ${performance.now() - now} ms`);
    set_card_list(render_data);
    console.log(chart);
    console.log(render_data);

    return () => {
      is_fetch.current = true;
    };
  }, []);

  return (
    <div className="App">
      <Chart<UI5CardInterface>
        data={card_list}
        card_template={(card: CardNode<UI5CardInterface>) => (
          <SimpleOrgChart
            onClick={(a: any) => console.log(a)}
            key={card.id}
            id={card.id}
            name={card.name}
            parent_id={card.parent?.id}
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
