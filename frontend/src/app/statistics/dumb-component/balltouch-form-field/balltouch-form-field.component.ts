import { Component, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { BallTouch } from "../../entity/ballTouch";
import { BallTouchType } from "../../value/ballTouchType";

@Component({
  selector: "vpms-balltouch-form-field",
  templateUrl: "./balltouch-form-field.component.html",
  styleUrls: ["./balltouch-form-field.component.scss"],
})
export class BalltouchFormFieldComponent {
  @Input() balltouches: BallTouch[];
  @Input() formGroup: FormGroup;

  constructor() {}

  formatBallTouch(balltouch: BallTouch): string {
    let prefix = "?!?!";
    switch (balltouch.touchType) {
      case BallTouchType.Attack:
        prefix = "Attack";
        break;
      case BallTouchType.Block:
        prefix = "Block";
        break;
      case BallTouchType.Receive:
        prefix = "Receive";
        break;
      case BallTouchType.Serve:
        prefix = "Serve";
        break;
      case BallTouchType.Toss:
        prefix = "Toss";
        break;
    }

    return `${balltouch.addedAt.getHours()}:${balltouch.addedAt.getMinutes()}:${balltouch.addedAt.getSeconds()} ${balltouch.addedAt.getDay()}:${balltouch.addedAt.getMonth()}:${balltouch.addedAt.getFullYear()}: ${prefix} - ${
      balltouch.player.name
    } - ${balltouch.metaData.labels.join(", ")}`;
  }
}
