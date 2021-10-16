import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HomePageComponent } from './home-page/home-page.component';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';
import { MaterialModule } from '../material/material.module';
import { RouterModule } from '@angular/router';
import { LoaderComponent } from './shared/loader/loader.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { WorkPageComponent } from './work-page/work-page.component';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    HomePageComponent,
    NotFoundPageComponent,
    LoaderComponent,
    WorkPageComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatStepperModule,
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    HomePageComponent,
    NotFoundPageComponent,
    LoaderComponent,
  ],
})
export class UIModule {
}
