import { Component, OnInit } from '@angular/core';
import { CaptchaFoxService } from '@captchafox/angular/dist'; // dist for local testing
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: [],
  standalone: false
})
export class ServiceComponent implements OnInit {
  private captchaId!: string;

  constructor(
    private captchaFoxService: CaptchaFoxService,
    private notifications: NotificationService
  ) {}

  ngOnInit(): void {
    this.captchaFoxService
      .load({
        siteKey: 'sk_11111111000000001111111100000000'
      })
      .subscribe((id: string) => {
        this.captchaId = id;
      });
  }

  onSubmit(event: SubmitEvent) {
    event.preventDefault();

    this.captchaFoxService.verify(this.captchaId).subscribe({
      next: (token: string) => {
        this.notifications.success(`Token: ${token}`);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }
}
