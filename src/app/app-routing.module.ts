import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GpsComponent } from './gps/gps.component';

const routes: Routes = [
  { path: '', component: GpsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
