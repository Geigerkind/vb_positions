import { generate_uuid } from "../../shared/util/generate_uuid";
import { Position } from "../value/position";
import { RotationDto } from "../dto/rotation-dto";
import { Line } from "../shapes/line";
import { ShapeFactory } from "../shapes/shape-factory";
import { Actor } from "./actor";

export class Rotation {
  private _UUID: string;
  private _lines: Line[];
  private _actors: Actor[];

  get UUID(): string {
    return this._UUID;
  }

  get lines(): Line[] {
    return this._lines;
  }

  get actors(): Actor[] {
    return this._actors;
  }

  constructor(public rotation?: Position, public name?: string, actors?: Actor[], UUID?: string, lines?: Line[]) {
    this._UUID = UUID ?? generate_uuid();
    this._lines = lines ?? [];
    this._actors = actors ?? [];
  }

  public static fromDto(rotationDto: RotationDto, context: CanvasRenderingContext2D): Rotation {
    const rotationOffset = rotationDto.r === "NULL" ? undefined : new Position(rotationDto.r as number);
    const lines = rotationDto.l.map(dto => ShapeFactory.fromLineDto(dto, context));
    const actors = rotationDto.a.map(dto => Actor.fromDto(dto, context));
    return new Rotation(
      rotationOffset,
      rotationDto.n === "NULL" ? undefined : rotationDto.n,
      actors,
      rotationDto.u,
      lines
    );
  }

  public draw(): void {
    this._actors.forEach(actor => actor.draw());
  }

  public toDto(): RotationDto {
    return {
      n: this.name ?? "NULL",
      r: this.rotation?.value ?? "NULL",
      u: this.UUID,
      l: this._lines.map(line => line.toDto()),
      a: this.actors.map(actor => actor.toDto()),
    };
  }

  public toString(): string {
    if (this.name) {
      if (this.rotation) {
        return `${this.name} (${this.rotation.value})`;
      }
      return `${this.name}`;
    } else if (this.rotation) {
      return `Unknown rotation (${this.rotation.value})`;
    }
    return "Unknown rotation";
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

  public addActor(actor: Actor): void {
    this._actors.push(actor);
  }

  public removeActor(uuid: string): void {
    const index = this._actors.findIndex(a => a.UUID === uuid);
    if (index < 0) {
      return;
    }
    this._actors.splice(index, 1);
  }
}
