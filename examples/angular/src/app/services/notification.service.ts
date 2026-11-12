import { Injectable, signal } from '@angular/core';

export type Notification = {
  type: 'success' | 'error';
  message: string;
};

@Injectable({ providedIn: 'root' })
export class NotificationService {
  readonly current = signal<Notification | null>(null);

  private timeout?: ReturnType<typeof setTimeout>;

  success(message: string) {
    this.show({ type: 'success', message });
  }

  error(message: string) {
    this.show({ type: 'error', message });
  }

  dismiss() {
    clearTimeout(this.timeout);
    this.current.set(null);
  }

  private show(notification: Notification) {
    clearTimeout(this.timeout);
    this.current.set(notification);
    this.timeout = setTimeout(() => this.current.set(null), 5000);
  }
}
