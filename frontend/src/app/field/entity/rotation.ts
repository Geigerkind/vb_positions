import { generate_uuid } from "../../shared/util/generate_uuid";
import { Position } from "../value/position";
import { RotationDto } from "../dto/rotation-dto";

export class Rotation {
  private _UUID: string;

  get UUID(): string {
    return this._UUID;
  }

  constructor(public rotation: Position, public name?: string, UUID?: string) {
    if (UUID) {
      this._UUID = UUID;
    } else {
      this._UUID = generate_uuid();
    }
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
}
