import { CAPTCHA_CONFIG, CaptchaConfig } from './config';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { CaptchaFoxComponent } from './captchafox.component';
import { CaptchaFoxService } from './captchafox.service';

@NgModule({
  declarations: [CaptchaFoxComponent],
  imports: [],
  exports: [CaptchaFoxComponent]
})
export class CaptchaFoxModule {
  static forRoot(config?: CaptchaConfig): ModuleWithProviders<CaptchaFoxModule> {
    return {
      ngModule: CaptchaFoxModule,
      providers: [
        CaptchaFoxService,
        {
          provide: CAPTCHA_CONFIG,
          useValue: config || {}
        }
      ]
    };
  }
}
