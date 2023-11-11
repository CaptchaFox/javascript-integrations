import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CaptchaFoxModule } from '@captchafox/angular/dist'; // dist for local testing

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BaseLayoutComponent } from './components/base-layout/base-layout.component';
import { FormComponent } from './routes/form/form.component';
import { HomeComponent } from './routes/home/home.component';
import { ReactiveFormComponent } from './routes/reactive-form/reactive-form.component';
import { ServiceComponent } from './routes/service/service.component';
import { TemplateFormComponent } from './routes/template-form/template-form.component';

@NgModule({
  declarations: [
    AppComponent,
    BaseLayoutComponent,
    HomeComponent,
    FormComponent,
    ServiceComponent,
    ReactiveFormComponent,
    TemplateFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CaptchaFoxModule.forRoot({
      siteKey: 'sk_11111111000000001111111100000000'
    }),
    ReactiveFormsModule,
    FormsModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
