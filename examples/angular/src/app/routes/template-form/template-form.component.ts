import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-template-form',
  templateUrl: './template-form.component.html',
  styleUrls: []
})
export class TemplateFormComponent {
  constructor(private toastr: ToastrService) {}

  public onSubmit(form: NgForm) {
    this.toastr.success(`Token: ${form.value.captchaToken}`);

    form.reset();
  }
}
