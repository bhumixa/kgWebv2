import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PdParametersPage } from './pd-parameters.page';

const routes: Routes = [
  {
    path: '',
    component: PdParametersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PdParametersPageRoutingModule {}
