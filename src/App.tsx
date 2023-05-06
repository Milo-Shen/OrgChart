// Import React Framework
import React, { useEffect, useRef, useState } from "react";

// Import Customized Component
import Chart from "./Component/Chart/Chart";

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

    // todo: test it
    let now = performance.now();
    let data = mock_org_chart_data(
      ~~(Math.random() * 20) + 1,
      ~~(Math.random() * 5) + 1,
      true
    );
    // data[7].children.push("id=11");
    // data.push({ children: ["id=12"], id: "id=11", name: "id=11" });
    // data.push({ children: [], id: "id=12", name: "id=12" });
    let chart = new OrgChart(data);
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
      <Chart list={card_list} />
    </div>
  );
}

export default App;
