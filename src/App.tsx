// Import React Framework
import React, { useEffect, useRef, useState } from "react";

// Import Types & Interfaces
import { ChartRenderData, OrgChartDirection } from "./OrgChart/OrgChart";
import { UI5CardInterface } from "./Component/UI5Card/UI5Card";

// Import Customized Component
import Chart from "./Component/Chart/Chart";
import SimpleOrgChart from "./Component/SimpleOrgChart";

// Import Utils
import { CardNode, OrgChart, chartRenderDefaultData } from "./OrgChart/OrgChart";

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
      { id: "id=0", name: "id=0", children: ["id=1"], width: 183, height: 159 },
      { id: "id=1", name: "id=1", children: ["id=2", "id=3", "id=4"], width: 210, height: 66 },
      { id: "id=2", name: "id=2", children: ["id=5", "id=6"], width: 201, height: 92 },
      { id: "id=3", name: "id=3", children: ["id=7"], width: 234, height: 177 },
      { id: "id=4", name: "id=4", children: [], width: 214, height: 71 },
      { id: "id=5", name: "id=5", children: [], width: 212, height: 201 },
      { id: "id=6", name: "id=6", children: ["id=8"], width: 100, height: 237 },
      { id: "id=7", name: "id=7", children: [], width: 144, height: 300 },
      { id: "id=8", name: "id=8", children: [], width: 400, height: 80 },
    ];
    // console.log(JSON.stringify(data));
    // let data_new = mock_org_chart_data(~~(Math.random() * 30) + 1, ~~(Math.random() * 5) + 1, true);
    // let data = mock_org_chart_data(300000, 20, false);
    console.log(`build mock data time: ${performance.now() - now} ms`);
    now = performance.now();
    let chart = new OrgChart<UI5CardInterface>(
      OrgChartDirection.Horizontal,
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
