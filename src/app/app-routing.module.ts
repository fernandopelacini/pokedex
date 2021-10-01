import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './pokemon/list/list.component';
import { DetailsComponent } from './pokemon/details/details.component';


const routes: Routes = [
  { path: '', component: ListComponent },
  { path: 'view/:name', component: DetailsComponent },
  { path: '**', component: ListComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'top'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
