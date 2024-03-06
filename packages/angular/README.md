# @captchafox/angular

[![NPM version](https://img.shields.io/npm/v/@captchafox/angular.svg)](https://www.npmjs.com/package/@captchafox/angular)

## Installation

Install the library using your prefered package manager

```sh
npm install @captchafox/angular
```

```sh
yarn add @captchafox/angular
```

```sh
pnpm add @captchafox/angular
```

```sh
bun add @captchafox/angular
```

## Usage

### Importing the Module

Add the `CaptchaFoxModule` to your app's `imports` and initialize it.

You can choose between using a global config for the whole app or specifing the config manually on each component.

```ts
import { CaptchaFoxModule } from '@captchafox/angular';

@NgModule({
  imports: [
    CaptchaFoxModule.forRoot({
      siteKey: '<YOUR_SITEKEY>'
    })
  ]
})
export class AppModule {}
```

#### Standalone

In an application that uses standalone components, the setup is different.

First, add `provideCaptchaFox` to `providers` in your `app.config.ts` and initialize it.

You can choose between using a global config for the whole app or specifing the config manually on each component.

```ts
import { provideCaptchaFox } from '@captchafox/angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideCaptchaFox({ siteKey: '<YOUR_SITEKEY>' }),
  ],
};
```

Then, import the CaptchaFoxModule in your component.

```ts
import { CaptchaFoxModule } from '@captchafox/angular';

@Component({
  selector: 'example',
  standalone: true,
  imports: [CommonModule, CaptchaFoxModule],
  ...
})
export class ExampleComponent {
}
```

### Using the component

After the setup, you can use the `ngx-captchafox` component inside your template:

```html
<ngx-captchafox
  (verify)="onVerify($event)"
  (error)="onError($event)"
  (expire)="onExpire($event)"
></ngx-captchafox>
```

### Inputs

| **Name** | **Type**                                                                                    | **Description**                                                                 |
| -------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| siteKey  | `string`                                                                                    | The site key for the widget                                                     |
| lang     | `string`                                                                                    | The language the widget should display. Defaults to automatically detecting it. |
| mode     | `inline\|popup\|hidden`                                                                     | The mode the widget should be displayed in .                                    |
| theme    | `light` \| `dark` \|  [`ThemeDefinition`](https://docs.captchafox.com/theming#custom-theme) | The theme of the widget. Defaults to light.                                     |

### Outputs

| **Name** | **Type**   | **Description**                                               |
| -------- | ---------- | ------------------------------------------------------------- |
| verify   | `function` | Called with the response token after successful verification. |
| fail     | `function` | Called after unsuccessful verification.                       |
| error    | `function` | Called when an error occured.                                 |
| expire   | `function` | Called when the challenge expires.                            |
| close    | `function` | Called when the challenge was closed.                         |
| load     | `function` | Called when the widget is ready                               |

### Using the verify event

```html
<ngx-captchafox (verify)="onVerify($event)"></ngx-captchafox>
```

```ts
@Component({...})
export class YourComponent {
  onVerify(token: string) {
    // verify the token on the server / submit your form with it
  }
}
```

### Using reactive forms

```html
<form [formGroup]="yourForm" (ngSubmit)="onSubmit()">
  <ngx-captchafox formControlName="captchaToken" />
  ...
</form>
```

```ts
@Component({...})
export class YourComponent {
    public yourForm = new FormGroup({
        captchaToken: new FormControl(null, Validators.required),
        ...
    });

    public onSubmit() {
        // send an API request to your server using the form values
        console.log(this.yourForm.value.captchaToken);
        this.loginForm.reset();
    }
}
```

You can find more detailed examples in the [GitHub repository](https://github.com/CaptchaFox/javascript-integrations/tree/main/examples/angular).
