// Import Third Party Lib
import classNames from "classnames";

// Import React Framework
import React from "react";

// Import CSS
import LineStyle from "./Line.module.css";

// Interface & Enums
import { LineType } from "../../OrgChart/Line";

// Interface
export interface LinePropsInterface {
  width: number;
  height: number;
  pos_x: number;
  pos_y: number;
  type: LineType;
  color: string;
  border_width: number;
}

function Line(props: LinePropsInterface) {
  const { width, height, pos_x, pos_y, type, color, border_width } = props;

  let style: any = {
    width: `${width}px`,
    height: `${height}px`,
    top: `${pos_y}px`,
    left: `${pos_x}px`,
  };

  if (type === LineType.Line) {
    style.background = color;
  } else {
    style.borderColor = color;
    style.borderWidth = border_width;
  }

  return (
    <div
      className={classNames(
        LineStyle.basic,
        type === LineType.Line ? LineStyle.line_type : LineStyle.square_type
      )}
      style={style}
    ></div>
  );
}

export default Line;
