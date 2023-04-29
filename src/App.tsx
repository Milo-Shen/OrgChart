// Import React Framework
import React from "react";

// Import Customized Component
import SimpleOrgChart from "./Component/SimpleOrgChart/SimpleOrgChart";

// Import CSS
import "./App.css";

// Import Utils
import { mock_org_chart_data } from "./Utils/mock_org_chart_data";
import { OrgChart } from "./OrgChart/OrgChart";

let now = performance.now();
let data = mock_org_chart_data(100);
let chart = new OrgChart(data);
console.log(`${performance.now() - now} ms`);
console.log(chart);

function App() {
  return (
    <div className="App">
      <SimpleOrgChart />
    </div>
  );
}

export default App;
