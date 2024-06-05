import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CartAddedPopupPage } from './cart-added-popup.page';

const routes: Routes = [
  {
    path: '',
    component: CartAddedPopupPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CartAddedPopupPageRoutingModule {}
