import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DeleteAccountFormPage } from './delete-account-form.page';

const routes: Routes = [
  {
    path: '',
    component: DeleteAccountFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeleteAccountFormPageRoutingModule {}
