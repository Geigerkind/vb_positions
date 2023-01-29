import { ActorShape } from "./actor-shape";
import {environment} from "../../../environments/environment";

export class Volleyball extends ActorShape {
  drawPosition(): void {}

  drawActorName(): void {}

  constructor(context: CanvasRenderingContext2D) {
    // @ts-ignore
    super(undefined, context);
  }

  private size: number = 64;
  private _img?: HTMLImageElement;

  drawShape(): void {
    if (!this._img) {
      this._img = document.createElement("img");
      if (environment.production) {
        this._img.src = "/vb_positions/assets/icons/icon-192x192.png";
      } else {
        this._img.src = "/assets/icons/icon-192x192.png";
      }
      this._img.onload = () => this.draw();
    }

    this.context.drawImage(this._img, this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
  }

  isHit(clickX: number, clickY: number): boolean {
    return (
      clickX >= this.x - this.size / 2 &&
      clickX <= this.x + this.size / 2 &&
      clickY >= this.y - this.size / 2 &&
      clickY <= this.y + this.size / 2
    );
  }
}
