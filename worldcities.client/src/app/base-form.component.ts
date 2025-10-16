import { Component } from '@angular/core';
import {AbstractControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-base-form',
  standalone: false,
  template: ``,
  styles: ``
})
export abstract class BaseFormComponent {
  form!: FormGroup;
  customMessages?: { [key: string] : { [key: string] : string } } | null = null;

  getErrors(
    controlKey: string,
    displayName: string
  ): string[] {
    const control: AbstractControl<any, any> = this.form.get(controlKey)!;
    let errors: string[] = [];
    Object.keys(control.errors || {}).forEach((key) => {
      let message = this.customMessages?.[controlKey]?.[key];
      switch (key) {
        case 'required':
          message ||= "is required.";
          break;
        case 'pattern':
          message ||= "contains invalid characters.";
          break;
        case 'isDupeField':
          message ||= "already exists: please choose another.";
          break;
        default:
          message ||= "is invalid.";
          break;
      }
      errors.push(`${displayName} ${message}`);
    });
    return errors;
  }
}
