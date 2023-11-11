import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: []
})
export class FormComponent {
  constructor(private toastr: ToastrService) {}

  public isVerified = false;
  public lang = 'ja';

  onVerify(response: string) {
    console.log('Verified', response);
    this.isVerified = true;
  }

  onError(error?: Error | string) {
    this.toastr.error(error?.toString() ?? 'Captcha Error');
  }

  changeLang() {
    this.lang = 'de';
  }
}
