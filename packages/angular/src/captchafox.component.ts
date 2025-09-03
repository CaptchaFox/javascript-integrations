import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  PLATFORM_ID,
  ViewChild,
  forwardRef
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import type { Theme, WidgetDisplayMode, WidgetI18nConfig } from '@captchafox/types';
import { Subscription, from } from 'rxjs';
import { CAPTCHA_CONFIG, CaptchaConfig } from './config';
import { isApiReady, loadCaptchaScript } from './loader';

type MarkFunctionProperties<Component> = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [Key in keyof Component]: Component[Key] extends Function ? never : Key;
};
type ExcludeFunctionPropertyNames<T> = MarkFunctionProperties<T>[keyof T];
type ExcludeFunctions<T> = Pick<T, ExcludeFunctionPropertyNames<T>>;
type NgChanges<Component, Props = ExcludeFunctions<Component>> = {
  [Key in keyof Props]: {
    previousValue: Props[Key];
    currentValue: Props[Key];
    firstChange: boolean;
    isFirstChange(): boolean;
  };
};

@Component({
  selector: 'ngx-captchafox',
  template: `<div #container class="ngx-captchafox-container"></div>`,
  styles: [],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CaptchaFoxComponent),
      multi: true
    }
  ]
})
export class CaptchaFoxComponent implements OnInit, OnDestroy, OnChanges, ControlValueAccessor {
  @Input() siteKey?: string;
  @Input() lang?: string;
  @Input() mode?: WidgetDisplayMode;
  @Input() theme?: Theme;
  @Input() nonce?: string;
  @Input() i18n?: WidgetI18nConfig;

  @Output() load: EventEmitter<void> = new EventEmitter<void>();
  @Output() verify: EventEmitter<string> = new EventEmitter<string>();
  @Output() expire: EventEmitter<void> = new EventEmitter<void>();
  @Output() error: EventEmitter<Error | string | undefined> = new EventEmitter<
    Error | string | undefined
  >();
  @Output() fail: EventEmitter<void> = new EventEmitter<void>();
  @Output() close: EventEmitter<void> = new EventEmitter<void>();
  @Output() challengeOpen: EventEmitter<void> = new EventEmitter<void>();
  @Output() challengeChange: EventEmitter<void> = new EventEmitter<void>();

  @ViewChild('container', { static: true }) containerEl?: ElementRef;

  private widgetId?: string;
  private scriptLoader$?: Subscription;

  private _onChange?: (token: string | null) => void;
  private _onTouched?: () => void;
  private _responseToken: string | null = null;

  constructor(
    @Inject(CAPTCHA_CONFIG) private config: CaptchaConfig,
    @Inject(PLATFORM_ID) private platformId: object,
    private zone: NgZone
  ) {}

  async ngOnChanges(changes: NgChanges<CaptchaFoxComponent>) {
    if (
      !changes.siteKey?.isFirstChange() &&
      !changes.mode?.isFirstChange() &&
      !changes.lang?.isFirstChange() &&
      !changes.theme?.isFirstChange()
    ) {
      window.captchafox?.remove(this.widgetId);
      await this.renderCaptcha();
    }
  }

  ngOnInit(): void {
    if (isPlatformServer(this.platformId)) {
      return;
    }

    this.scriptLoader$ = from(loadCaptchaScript({ nonce: this.nonce })).subscribe({
      next: async () => {
        this.load.emit();
        try {
          await this.renderCaptcha();
        } catch (error) {
          this.error.emit(error as Error);
        }
      },
      error: (error) => {
        this.error.emit(error);
        console.error('[CaptchaFox] Could not load script:', error);
      }
    });
  }

  ngOnDestroy(): void {
    if (isPlatformServer(this.platformId)) {
      return;
    }

    this.scriptLoader$?.unsubscribe();
  }

  private async renderCaptcha() {
    if (!isApiReady() || !this.containerEl) {
      return;
    }

    const newWidgetId = await window.captchafox?.render(this.containerEl.nativeElement, {
      lang: this.lang ?? this.config.language,
      sitekey: this.siteKey ?? this.config.siteKey ?? '',
      mode: this.mode ?? this.config.mode,
      theme: this.theme ?? this.config.theme,
      i18n: this.i18n ?? this.config.i18n,
      onError: (error) => {
        this.zone.run(() => this.error.emit(error));
      },
      onFail: () => {
        this.zone.run(() => this.fail.emit());
      },
      onClose: () => {
        this.zone.run(() => this.close.emit());
      },
      onVerify: (token: string) => {
        this.zone.run(() => {
          this.writeValue(token);
          this.verify.emit(token);
        });
      },
      onExpire: () => {
        this.zone.run(() => this.expire.emit());
      },
      onChallengeChange: () => {
        this.zone.run(() => this.challengeChange.emit());
      },
      onChallengeOpen: () => {
        this.zone.run(() => this.challengeOpen.emit());
      }
    });

    this.widgetId = newWidgetId;
  }

  get value(): string | null {
    return this._responseToken;
  }

  writeValue(value: string | null): void {
    this._responseToken = value;
    this._onChange?.(value);
    this._onTouched?.();

    // handle form reset
    if (!value && isPlatformBrowser(this.platformId)) {
      window.captchafox?.reset(this.widgetId);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }
}
