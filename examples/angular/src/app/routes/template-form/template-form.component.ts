import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-template-form',
  templateUrl: './template-form.component.html',
  styleUrls: [],
  standalone: false
})
export class TemplateFormComponent {
  constructor(private notifications: NotificationService) {}

  public onSubmit(form: NgForm) {
    this.notifications.success(`Token: ${form.value.captchaToken}`);

    form.reset();
  }
}
