import {ShapeDto} from "../dto/shape-dto";
import {Shape} from "./shape";
import {ShapeType} from "../value/shape-type";
import {Circle} from "./circle";
import {Actor} from "../entity/actor";
import {HalfCircle} from "./half-circle";
import {Triangle} from "./triangle";

export class ShapeFactory {

  public static fromDto(shapeDto: ShapeDto, context: CanvasRenderingContext2D): Shape {
    const actor = Actor.fromDto(shapeDto.actor);
    const x = context.canvas.width * shapeDto.x_percent;
    // TODO: Constant
    const y = (context.canvas.height - 60) * shapeDto.y_percent;

    switch (shapeDto.shape_type) {
      case ShapeType.Circle:
        return new Circle(actor, context, x, y, shapeDto.dashed!);
      case ShapeType.HalfCircle:
        return new HalfCircle(actor, context, x, y);
      case ShapeType.Triangle:
        return new Triangle(actor, context, x, y, shapeDto.dashed!);
    }
  }

}
