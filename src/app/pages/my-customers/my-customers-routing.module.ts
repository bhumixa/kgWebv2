import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyCustomersPage } from './my-customers.page';

const routes: Routes = [
  {
    path: '',
    component: MyCustomersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyCustomersPageRoutingModule {}
