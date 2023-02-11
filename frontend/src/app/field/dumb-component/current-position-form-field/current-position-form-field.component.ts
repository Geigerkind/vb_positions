import { Component, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";

@Component({
  selector: "vpms-current-position-form-field",
  templateUrl: "./current-position-form-field.component.html",
  styleUrls: ["./current-position-form-field.component.scss"],
})
export class CurrentPositionFormFieldComponent {
  @Input() formGroup: FormGroup;

  constructor() {}
}
