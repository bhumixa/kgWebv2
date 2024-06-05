import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QuickBuyPage } from './quick-buy.page';

const routes: Routes = [
  {
    path: '',
    component: QuickBuyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuickBuyPageRoutingModule {}
