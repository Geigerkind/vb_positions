import { Component, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";

@Component({
  selector: "vpms-position-form-field",
  templateUrl: "./position-form-field.component.html",
  styleUrls: ["./position-form-field.component.scss"],
})
export class PositionFormFieldComponent {
  @Input() formGroup: FormGroup;

  constructor() {}
}
