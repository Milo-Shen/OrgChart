// Import React Framework
import React from "react";

// Import CSS
import OrgChartStyle from "./SimpleOrgChart.module.css";

function OrgChart(props: any) {
  const { name, pos_x, pos_y } = props;
  return <div className={OrgChartStyle.simple_org_chart}>{name}</div>;
}

export default OrgChart;
