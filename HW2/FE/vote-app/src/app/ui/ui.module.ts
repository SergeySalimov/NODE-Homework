import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HomePageComponent } from './home-page/home-page.component';
import { VotePageComponent } from './vote-page/vote-page.component';
import { StatisticPageComponent } from './statistic-page/statistic-page.component';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';
import { MaterialModule } from '../material/material.module';
import { RouterModule } from '@angular/router';
import { LoaderComponent } from './shared/loader/loader.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    HomePageComponent,
    VotePageComponent,
    StatisticPageComponent,
    NotFoundPageComponent,
    LoaderComponent,
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
    VotePageComponent,
    StatisticPageComponent,
    NotFoundPageComponent,
    LoaderComponent,
  ],
  providers: [
    { provide: STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false }, multi: true },
    { provide: STEPPER_GLOBAL_OPTIONS, useValue: { showError: true }, multi: true },
  ],
})
export class UIModule {
}
