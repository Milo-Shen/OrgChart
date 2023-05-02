// Import React Framework
import React from "react";

// Import CSS
import OrgChartStyle from "./SimpleOrgChart.module.css";

function OrgChart(props: any) {
  const { name, parent_id, pos_x, pos_y } = props;
  return (
    <div className={OrgChartStyle.simple_org_chart}>
      {name}
      <br />
      {parent_id}
      <br />
      {pos_x}
    </div>
  );
}

export default OrgChart;
