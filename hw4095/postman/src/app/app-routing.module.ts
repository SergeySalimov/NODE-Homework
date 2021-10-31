import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './ui/home-page/home-page.component';
import { NotFoundPageComponent } from './ui/not-found-page/not-found-page.component';
import { WorkPageComponent } from './ui/work-page/work-page.component';

const routes: Routes = [
  {
    path: '', redirectTo: 'work', pathMatch: 'full',
  },
  {
    path: 'home', component: HomePageComponent,
  },
  {
    path: 'work/:id', component: WorkPageComponent,
  },
  {
    path: 'work', component: WorkPageComponent,
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
