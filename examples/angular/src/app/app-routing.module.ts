import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './routes/home/home.component';
import { ServiceComponent } from './routes/service/service.component';
import { FormComponent } from './routes/form/form.component';
import { ReactiveFormComponent } from './routes/reactive-form/reactive-form.component';
import { TemplateFormComponent } from './routes/template-form/template-form.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'basic', component: FormComponent },
  { path: 'reactive', component: ReactiveFormComponent },
  { path: 'template', component: TemplateFormComponent },
  { path: 'service', component: ServiceComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
