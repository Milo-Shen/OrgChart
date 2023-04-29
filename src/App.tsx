// Import React Framework
import React, { useEffect, useState } from "react";

// Import Customized Component
import SimpleOrgChart from "./Component/SimpleOrgChart/SimpleOrgChart";

// Import CSS
import "./App.css";

// Import Utils
import { CardNode, OrgChart } from "./OrgChart/OrgChart";
import { mock_org_chart_data } from "./Utils/mock_org_chart_data";

function App() {
  let [card_list, set_card_list] = useState<Array<Array<CardNode>>>([]);

  useEffect(() => {
    let now = performance.now();
    let data = mock_org_chart_data(100, 5);
    let chart = new OrgChart(data);
    let render_data = chart.get_render_data();
    set_card_list(render_data.render_list);
    console.log(`${performance.now() - now} ms`);
    console.log(chart, render_data);
  }, []);

  return (
    <div className="App">
      {card_list.map((level) => level.map((card) => <SimpleOrgChart />))}
    </div>
  );
}

export default App;
