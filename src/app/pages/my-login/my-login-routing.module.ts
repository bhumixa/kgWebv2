import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyLoginPage } from './my-login.page';

const routes: Routes = [
  {
    path: '',
    component: MyLoginPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyLoginPageRoutingModule {}
