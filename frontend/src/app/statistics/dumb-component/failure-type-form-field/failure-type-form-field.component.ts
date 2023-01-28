import { Component, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { FailureType } from "../../value/failureType";

@Component({
  selector: "vpms-failure-type-form-field",
  templateUrl: "./failure-type-form-field.component.html",
  styleUrls: ["./failure-type-form-field.component.scss"],
})
export class FailureTypeFormFieldComponent {
  @Input() formGroup: FormGroup;
  @Input() showBlocked: boolean = false;

  FailureType: typeof FailureType = FailureType;

  constructor() {}
}
