import { generate_uuid } from "../../shared/util/generate_uuid";
import { Position } from "../value/position";
import { RotationDto } from "../dto/rotation-dto";
import { Line } from "../shapes/line";
import { ShapeFactory } from "../shapes/shape-factory";

export class Rotation {
  private _UUID: string;
  private _lines: Line[];

  get UUID(): string {
    return this._UUID;
  }

  get lines(): Line[] {
    return this._lines;
  }

  constructor(public rotation: Position, public name?: string, UUID?: string, lines?: Line[]) {
    this._UUID = UUID ?? generate_uuid();
    this._lines = lines ?? [];
  }

  public static fromDto(rotationDto: RotationDto, context: CanvasRenderingContext2D): Rotation {
    const rotationOffset = new Position(rotationDto.r);
    const lines = rotationDto.l.map(dto => ShapeFactory.fromLineDto(dto, context));
    return new Rotation(rotationOffset, rotationDto.n === "NULL" ? undefined : rotationDto.n, rotationDto.u, lines);
  }

  public toDto(): RotationDto {
    return {
      n: this.name ?? "NULL",
      r: this.rotation.value,
      u: this.UUID,
      l: this._lines.map(line => line.toDto()),
    };
  }

  public toString(): string {
    if (this.name) {
      return `${this.name} (${this.rotation.value})`;
    }
    return `Unknown rotation (${this.rotation.value})`;
  }

  public addLine(line: Line): void {
    this._lines.push(line);
  }

  public removeLine(line: Line): void {
    const index = this._lines.findIndex(l => l === line);
    if (index < 0) {
      return;
    }
    this._lines.splice(index, 1);
  }
}
