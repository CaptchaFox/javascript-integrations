import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-reactive-form',
  templateUrl: './reactive-form.component.html',
  styleUrls: [],
  standalone: false
})
export class ReactiveFormComponent {
  constructor(private notifications: NotificationService) {}

  public loginForm = new FormGroup({
    login: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    remember: new FormControl(false),
    captchaToken: new FormControl(null, Validators.required)
  });

  public onSubmit() {
    this.notifications.success(`Token: ${this.loginForm.value.captchaToken}`);
    this.loginForm.reset();
  }
}
