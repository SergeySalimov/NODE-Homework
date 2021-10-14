import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePageComponent } from './ui/home-page/home-page.component';
import { VotePageComponent } from './ui/vote-page/vote-page.component';
import { StatisticPageComponent } from './ui/statistic-page/statistic-page.component';
import { NotFoundPageComponent } from './ui/not-found-page/not-found-page.component';

const routes: Routes = [
  {
    path: '', component: HomePageComponent,
  },
  {
    path: 'vote', component: VotePageComponent,
  },
  {
    path: 'statistic', component: StatisticPageComponent,
  },
  {
    path: '**', component: NotFoundPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
