// Import React Framework
import React from "react";

// Import CSS
import LineStyle from "./Line.module.css";

// Interface
export interface LinePropsInterface {
  width: number;
  height: number;
  pos_x: number;
  pos_y: number;
}

function Line(props: LinePropsInterface) {
  const { width, height, pos_x, pos_y } = props;

  return (
    <div
      className={LineStyle.line}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        top: `${pos_y}px`,
        left: `${pos_x}px`,
      }}
    ></div>
  );
}

export default Line;
