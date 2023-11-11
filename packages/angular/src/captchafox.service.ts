import { isPlatformServer } from '@angular/common';
import { Inject, Injectable, NgZone, OnDestroy, PLATFORM_ID } from '@angular/core';
import { Observable, Subscriber, Subscription, defer, from } from 'rxjs';
import { CAPTCHA_CONFIG, CaptchaConfig } from './config';
import { isApiReady, loadCaptchaScript } from './loader';

const loadScriptObservable = defer(() => loadCaptchaScript());

@Injectable({
  providedIn: 'root'
})
export class CaptchaFoxService implements OnDestroy {
  constructor(
    @Inject(CAPTCHA_CONFIG) private config: CaptchaConfig,
    @Inject(PLATFORM_ID) private platformId: object,
    private zone: NgZone
  ) {}

  private scriptLoader$?: Subscription;
  private containerEl?: HTMLElement;

  ngOnDestroy(): void {
    if (isPlatformServer(this.platformId)) {
      return;
    }

    this.scriptLoader$?.unsubscribe();
  }

  public verify(captchaId: string) {
    return new Observable((subscriber: Subscriber<string>) => {
      if (!isApiReady) {
        subscriber.error('[CaptchaFox] window.captchafox is not available');
      }

      from(window.captchafox!.execute(captchaId)).subscribe({
        next(value) {
          subscriber.next(value);
          subscriber.complete();
        },
        error(error) {
          subscriber.error(error);
        }
      });
    });
  }

  public load(config?: Omit<CaptchaConfig, 'mode'>) {
    return new Observable((subscriber: Subscriber<string>) => {
      if (isPlatformServer(this.platformId)) {
        return;
      }

      if (!this.containerEl) {
        this.containerEl = document.createElement('div');
        document.body.appendChild(this.containerEl);
      }

      this.scriptLoader$ = loadScriptObservable.subscribe({
        next: async () => {
          try {
            await this.renderCaptcha(subscriber, config);
          } catch (error) {
            subscriber.error(error);
          }
        },
        error: (error) => {
          subscriber.error(error);
          console.error('[CaptchaFox] Could not load script:', error);
        }
      });
    });
  }

  private async renderCaptcha(subscriber: Subscriber<unknown>, config?: CaptchaConfig) {
    if (!isApiReady() || !this.containerEl) {
      return;
    }

    await window.captchafox?.render(this.containerEl, {
      lang: config?.language ?? this.config.language,
      sitekey: config?.siteKey ?? this.config.siteKey ?? '',
      mode: 'hidden',
      onError: (error) => {
        this.zone.run(() => subscriber.error(error));
      }
    });
  }
}
