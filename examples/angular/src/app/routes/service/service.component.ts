import { Component, OnInit } from '@angular/core';
import { CaptchaFoxService } from '@captchafox/angular/dist'; // dist for local testing
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: []
})
export class ServiceComponent implements OnInit {
  private captchaId!: string;

  constructor(private captchaFoxService: CaptchaFoxService, private toastr: ToastrService) {}

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
        this.toastr.success(`Token: ${token}`);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }
}
