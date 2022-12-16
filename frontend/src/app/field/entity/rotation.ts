import {Shape} from "../shapes/shape";
import {generate_uuid} from "../../shared/util/generate_uuid";
import {Position} from "../value/position";
import {RotationDto} from "../dto/rotation-dto";
import {ShapeFactory} from "../shapes/shape-factory";

export class Rotation {

  private _UUID: string;

  get UUID(): string {
    return this._UUID;
  }

  constructor(
    public shapes: Shape[],
    public rotation: Position,
    public name?: string,
    UUID?: string,
  ) {
    if (UUID) {
      this._UUID = UUID;
    } else {
      this._UUID = generate_uuid();
    }
  }

  public static fromDto(rotationDto: RotationDto, context: CanvasRenderingContext2D): Rotation {
    const shapes = rotationDto.shapes.map(shape => ShapeFactory.fromDto(shape, context));
    return new Rotation(shapes, new Position(rotationDto.rotation), rotationDto.name, rotationDto.UUID);
  }

  public toDto(): RotationDto {
    return {
      name: this.name,
      rotation: this.rotation.value,
      shapes: this.shapes.map(shape => shape.toDto()),
      UUID: this.UUID
    };
  }

  public addShape(shape: Shape): void {
    shape.setRotationOffset(this.rotation);
    this.shapes.push(shape);
  }

  public removeShapeByActorUUID(uuid: string): void {
    const index = this.shapes.findIndex(shape => shape.actor.UUID === uuid);
    if (index == null) {
      return;
    }
    this.shapes.splice(index, 1);
  }

  public toString(): string {
    if (this.name) {
      return `${this.name} (${this.rotation.value})`;
    }
    return `Unknown rotation (${this.rotation.value})`;
  }

}
