// Import React Framework
import React, { useEffect, useRef, useState } from "react";

// Import Types & Interfaces
import { CardNode, ChartRenderData, chartRenderDefaultData, OrgChart, OrgChartDirection } from "./OrgChart/OrgChart";
import { UI5CardInterface } from "./Component/UI5Card/UI5Card";

// Import Customized Component
import Chart from "./Component/Chart/Chart";
import SimpleOrgChart from "./Component/SimpleOrgChart";

// Import Utils
import { mock_org_chart_data } from "./Utils/mock_org_chart_data";

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
      { id: "id=0", name: "id=0", children: ["id=1"], width: 132, height: 94 },
      { id: "id=1", name: "id=1", children: ["id=2", "id=3", "id=4"], width: 61, height: 186 },
      { id: "id=2", name: "id=2", children: ["id=5"], width: 88, height: 200 },
      { id: "id=3", name: "id=3", children: ["id=6", "id=7"], width: 125, height: 91 },
      { id: "id=4", name: "id=4", children: ["id=8"], width: 69, height: 78 },
      { id: "id=5", name: "id=5", children: ["id=9", "id=10"], width: 128, height: 128 },
      { id: "id=6", name: "id=6", children: ["id=11", "id=12"], width: 124, height: 167 },
      { id: "id=7", name: "id=7", children: ["id=13"], width: 142, height: 139 },
      { id: "id=8", name: "id=8", children: ["id=14", "id=15", "id=16", "id=17"], width: 86, height: 75 },
      { id: "id=9", name: "id=9", children: ["id=18", "id=19", "id=20"], width: 136, height: 74 },
      { id: "id=10", name: "id=10", children: ["id=21", "id=22", "id=23", "id=24"], width: 73, height: 177 },
      { id: "id=11", name: "id=11", children: ["id=25"], width: 200, height: 54 },
      { id: "id=12", name: "id=12", children: ["id=26", "id=27", "id=28", "id=29"], width: 85, height: 157 },
      { id: "id=13", name: "id=13", children: [], width: 146, height: 132 },
      { id: "id=14", name: "id=14", children: [], width: 194, height: 165 },
      { id: "id=15", name: "id=15", children: [], width: 155, height: 199 },
      { id: "id=16", name: "id=16", children: [], width: 134, height: 156 },
      { id: "id=17", name: "id=17", children: [], width: 84, height: 173 },
      { id: "id=18", name: "id=18", children: [], width: 116, height: 114 },
      { id: "id=19", name: "id=19", children: [], width: 197, height: 99 },
      { id: "id=20", name: "id=20", children: [], width: 88, height: 138 },
      { id: "id=21", name: "id=21", children: [], width: 58, height: 104 },
      { id: "id=22", name: "id=22", children: [], width: 96, height: 186 },
      { id: "id=23", name: "id=23", children: [], width: 186, height: 143 },
      { id: "id=24", name: "id=24", children: [], width: 181, height: 154 },
      { id: "id=25", name: "id=25", children: [], width: 168, height: 84 },
      { id: "id=26", name: "id=26", children: [], width: 157, height: 58 },
      { id: "id=27", name: "id=27", children: [], width: 113, height: 197 },
      { id: "id=28", name: "id=28", children: [], width: 85, height: 93 },
      { id: "id=29", name: "id=29", children: [], width: 141, height: 198 },
    ];

    // let data = mock_org_chart_data(~~(Math.random() * 30) + 1, ~~(Math.random() * 5) + 1, true);
    // console.log(JSON.stringify(data));
    // let data = mock_org_chart_data(3000, 20, false);
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
            child_count={card.total_child_count}
          />
        )}
      />
    </div>
  );
}

export default App;
