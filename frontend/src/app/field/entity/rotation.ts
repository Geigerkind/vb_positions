import { generate_uuid } from "../../shared/util/generate_uuid";
import { Position } from "../value/position";
import { RotationDto } from "../dto/rotation-dto";
import { Line } from "../shapes/line";

export class Rotation {
  private _UUID: string;
  private _lines: Line[];

  get UUID(): string {
    return this._UUID;
  }

  constructor(public rotation: Position, public name?: string, UUID?: string, lines?: Line[]) {
    this._UUID = UUID ?? generate_uuid();
    this._lines = lines ?? [];
  }

  public static fromDto(rotationDto: RotationDto): Rotation {
    const rotationOffset = new Position(rotationDto.r);
    return new Rotation(rotationOffset, rotationDto.n === "NULL" ? undefined : rotationDto.n, rotationDto.u);
  }

  public toDto(): RotationDto {
    return {
      n: this.name ?? "NULL",
      r: this.rotation.value,
      u: this.UUID,
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

  public draw(): void {
    this._lines.forEach(line => line.draw());
  }

  public removeIfHitLine(x: number, y: number): void {
    const index = this._lines.findIndex(line => line.isHit(x, y));
    if (index < 0) {
      return;
    }
    this._lines.splice(index, 1);
  }
}
