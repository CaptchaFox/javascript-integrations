import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reactive-form',
  templateUrl: './reactive-form.component.html',
  styleUrls: []
})
export class ReactiveFormComponent {
  constructor(private toastr: ToastrService) {}

  public loginForm = new FormGroup({
    login: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    remember: new FormControl(false),
    captchaToken: new FormControl(null, Validators.required)
  });

  public onSubmit() {
    this.toastr.success(`Token: ${this.loginForm.value.captchaToken}`);
    this.loginForm.reset();
  }
}
