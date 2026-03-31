import { Component, Input, Output, EventEmitter } from "@angular/core";
import { FormGroup } from "@angular/forms";


@Component({
  selector: 'app-order-edit-stub',
  standalone: true,
  template: `
  <div data-test="post-form-stub">
      label: {{ submitLabel }}
      <button type="button" data-test="emit-submit" (click)="submitForm.emit()">
        Emit Submit
      </button>
    </div>
  `
})

export class OrderEditStubComponent {
@Input({ required: true }) form!: FormGroup;
  @Input() isSubmitting = false;
  @Input() submitLabel = 'Update';
  @Input() requireDirty = false;

  @Output() submitForm = new EventEmitter<void>();
}

