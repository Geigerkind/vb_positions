import { Component, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { PlayerRole } from "../../value/player-role";

@Component({
  selector: "vpms-player-role-form-field",
  templateUrl: "./player-role-form-field.component.html",
  styleUrls: ["./player-role-form-field.component.scss"],
})
export class PlayerRoleFormFieldComponent {
  @Input() formGroup: FormGroup;
  PlayerRole: typeof PlayerRole = PlayerRole;

  constructor() {}
}
