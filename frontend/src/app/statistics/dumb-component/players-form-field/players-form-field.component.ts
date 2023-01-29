import { Component, Input } from "@angular/core";
import { Player } from "../../entity/player";
import { FormGroup } from "@angular/forms";

@Component({
  selector: "vpms-players-form-field",
  templateUrl: "./players-form-field.component.html",
  styleUrls: ["./players-form-field.component.scss"],
})
export class PlayersFormFieldComponent {
  @Input() players: Player[];
  @Input() formGroup: FormGroup;

  constructor() {}
}
