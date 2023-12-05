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
    // let data = [
    //   { id: "id=0", name: "id=0", children: ["id=1", "id=2", "id=3", "id=4"], width: 165, height: 169 },
    //   { id: "id=1", name: "id=1", children: ["id=5", "id=6"], width: 182, height: 66 },
    //   { id: "id=2", name: "id=2", children: ["id=7", "id=8"], width: 98, height: 76 },
    //   { id: "id=3", name: "id=3", children: ["id=9", "id=10"], width: 148, height: 178 },
    //   { id: "id=4", name: "id=4", children: ["id=11"], width: 59, height: 174 },
    //   { id: "id=5", name: "id=5", children: [], width: 156, height: 164 },
    //   { id: "id=6", name: "id=6", children: [], width: 156, height: 138 },
    //   { id: "id=7", name: "id=7", children: [], width: 72, height: 112 },
    //   { id: "id=8", name: "id=8", children: [], width: 64, height: 187 },
    //   { id: "id=9", name: "id=9", children: [], width: 113, height: 166 },
    //   { id: "id=10", name: "id=10", children: [], width: 122, height: 141 },
    //   { id: "id=11", name: "id=11", children: [], width: 100, height: 107 },
    // ] as any;
    let data = mock_org_chart_data(~~(Math.random() * 30) + 1, ~~(Math.random() * 5) + 1, true);
    // console.log(JSON.stringify(data));
    // let data = mock_org_chart_data(500000, 20, false);
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
