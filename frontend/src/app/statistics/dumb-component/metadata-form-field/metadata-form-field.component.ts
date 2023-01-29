import { Component, Input } from "@angular/core";
import { Metadata } from "../../entity/metadata";
import { FormGroup } from "@angular/forms";

@Component({
  selector: "vpms-metadata-form-field",
  templateUrl: "./metadata-form-field.component.html",
  styleUrls: ["./metadata-form-field.component.scss"],
})
export class MetadataFormFieldComponent {
  @Input() metadatas: Metadata[];
  @Input() formGroup: FormGroup;

  constructor() {}
}
