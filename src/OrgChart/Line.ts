export enum LineType {
  Line = "Line",
  Square = "Square",
}

export class LineNode {
  pos_x: number;
  pos_y: number;
  width: number;
  height: number;
  border_width: number;
  color: string;
  type: LineType;

  constructor(
    x: number = -Infinity,
    y: number = Infinity,
    w: number = 0,
    h: number = 0,
    type: LineType = LineType.Line,
    color: string = "#6A6D70",
    border_width: number = 0
  ) {
    this.pos_x = x;
    this.pos_y = y;
    this.width = w;
    this.height = h;
    this.type = type;
    this.color = color;
    this.border_width = border_width;
  }
}
