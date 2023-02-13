import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { ServerService } from '../service/server.service';
import { ServerFormValues } from '../utils/serverFormValues.type';

@Component({
  selector: 'app-add-server',
  templateUrl: './add-server.component.html',
})
export class AddServerComponent {
  @Output() emitCreateServerValues: EventEmitter<ServerFormValues> =
    new EventEmitter();

  createServerForm: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    protected readonly serverService: ServerService
  ) {
    this.createServerForm = this.fb.group(
      {
        ipAddress: ['', Validators.required],
        name: [''],
        memory: [''],
        type: [''],
        status: [''],
      },
      { updateOn: 'submit' }
    );
  }

  addServer(form: FormGroupDirective) {
    if (!form.invalid) {
      this.emitCreateServerValues.emit(this.createServerForm.getRawValue());
    }

    return;
  }

  closeModal() {
    this.serverService.toggleAddServerModal();
  }
}
