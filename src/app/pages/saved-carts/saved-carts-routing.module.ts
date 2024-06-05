import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SavedCartsPage } from './saved-carts.page';

const routes: Routes = [
  {
    path: '',
    component: SavedCartsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SavedCartsPageRoutingModule {}
