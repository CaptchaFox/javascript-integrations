import { Component } from '@angular/core';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: [],
  standalone: false
})
export class FormComponent {
  constructor(private notifications: NotificationService) {}

  public isVerified = false;
  public lang = 'ja';

  onVerify(response: string) {
    console.log('Verified', response);
    this.isVerified = true;
  }

  onError(error?: Error | string) {
    this.notifications.error(error?.toString() ?? 'Captcha Error');
  }

  changeLang() {
    this.lang = 'de';
  }
}
