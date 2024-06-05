import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DiamondSearchPage } from './diamond-search.page';

const routes: Routes = [
  {
    path: '',
    component: DiamondSearchPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DiamondSearchPageRoutingModule {}
