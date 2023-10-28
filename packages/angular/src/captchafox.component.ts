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
import { isApiReady, loadCaptchaScript } from '@captchafox/internal';
import type { WidgetDisplayMode } from '@captchafox/types';
import { Subscription, defer } from 'rxjs';
import { CAPTCHA_CONFIG, CaptchaConfig } from './config';

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

const loadScriptObservable = defer(() => loadCaptchaScript());

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

  @Output() load: EventEmitter<void> = new EventEmitter<void>();
  @Output() verify: EventEmitter<string> = new EventEmitter<string>();
  @Output() expire: EventEmitter<void> = new EventEmitter<void>();
  @Output() error: EventEmitter<unknown> = new EventEmitter<unknown>();
  @Output() fail: EventEmitter<void> = new EventEmitter<void>();
  @Output() close: EventEmitter<void> = new EventEmitter<void>();

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
      !changes.lang?.isFirstChange()
    ) {
      window.captchafox?.remove(this.widgetId);
      await this.renderCaptcha();
    }
  }

  ngOnInit(): void {
    if (isPlatformServer(this.platformId)) {
      return;
    }

    this.scriptLoader$ = loadScriptObservable.subscribe({
      next: async () => {
        this.load.emit();
        try {
          await this.renderCaptcha();
        } catch (error) {
          this.error.emit(error);
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
