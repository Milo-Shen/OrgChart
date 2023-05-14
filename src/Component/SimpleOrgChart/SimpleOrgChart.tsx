// Import React Framework
import React from "react";

// Import CSS
import OrgChartStyle from "./SimpleOrgChart.module.css";

function OrgChart(props: any) {
  const {
    name,
    parent_id,
    width,
    height,
    pos_x,
    pos_y,
    ratio_pos_x,
    ratio_pos_y,
  } = props;
  return (
    <div
      style={{
        width: `${width}px`,
        height: `${height}px`,
        left: `${pos_x}px`,
        top: `${pos_y}px`,
      }}
      className={OrgChartStyle.simple_org_chart}
    >
      id: {name}
      <br />
      parent: {parent_id}
      <br />
      ratio_pos_x: {ratio_pos_x}
      <br />
      ratio_pos_y: {ratio_pos_y}
    </div>
  );
}

export default OrgChart;
