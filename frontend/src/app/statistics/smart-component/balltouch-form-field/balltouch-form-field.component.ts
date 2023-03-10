import { Component, Input, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { BallTouch } from "../../entity/ballTouch";
import { BallTouchType } from "../../value/ballTouchType";
import { StatisticsService } from "../../service/statistics.service";

@Component({
  selector: "vpms-balltouch-form-field",
  templateUrl: "./balltouch-form-field.component.html",
  styleUrls: ["./balltouch-form-field.component.scss"],
})
export class BalltouchFormFieldComponent implements OnInit {
  @Input() formGroup: FormGroup;

  balltouches: BallTouch[] = [];

  constructor(private statisticsService: StatisticsService) {}

  ngOnInit(): void {
    this.balltouches = this.statisticsService.previousBallTouches.reverse();
  }

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

    return `${(balltouch.addedAt as Date).getHours()}:${(balltouch.addedAt as Date).getMinutes()}:${(
      balltouch.addedAt as Date
    ).getSeconds()} ${(balltouch.addedAt as Date).getDate()}:${(balltouch.addedAt as Date).getMonth() + 1}:${(
      balltouch.addedAt as Date
    ).getFullYear()}: ${prefix} - ${
      this.statisticsService.getPlayer(balltouch.playerUuid).name
    } - ${this.statisticsService.getMetadata(balltouch.metaDataUuid).labels.join(", ")}`;
  }
}
