import { Component, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { TouchCount } from "../../value/touchCount";

@Component({
  selector: "vpms-touch-count-form-field",
  templateUrl: "./touch-count-form-field.component.html",
  styleUrls: ["./touch-count-form-field.component.scss"],
})
export class TouchCountFormFieldComponent {
  @Input() formGroup: FormGroup;

  TouchCount: typeof TouchCount = TouchCount;

  constructor() {}
}
