import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelectSuppliersPage } from './select-suppliers.page';

const routes: Routes = [
  {
    path: '',
    component: SelectSuppliersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelectSuppliersPageRoutingModule {}
