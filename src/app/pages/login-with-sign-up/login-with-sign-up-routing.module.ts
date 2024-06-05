import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginWithSignUpPage } from './login-with-sign-up.page';

const routes: Routes = [
  {
    path: '',
    component: LoginWithSignUpPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginWithSignUpPageRoutingModule {}
