// Import React Framework
import React from "react";

// Import CSS
import SimpleOrgChartStyle from "./SimpleOrgChart.module.css";

function SimpleOrgChart(props: any) {
  const { name, parent_id, width, height, pos_x, pos_y } = props;
  return (
    <div
      style={{
        width: `${width}px`,
        height: `${height}px`,
        left: `${pos_x}px`,
        top: `${pos_y}px`,
      }}
      className={SimpleOrgChartStyle.simple_org_chart}
    >
      id: {name}
      <br />
      parent: {parent_id}
      <br />
    </div>
  );
}

export default SimpleOrgChart;
