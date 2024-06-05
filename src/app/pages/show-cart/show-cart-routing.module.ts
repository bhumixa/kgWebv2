import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShowCartPage } from './show-cart.page';

const routes: Routes = [
  {
    path: '',
    component: ShowCartPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShowCartPageRoutingModule {}
