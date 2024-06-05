import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GeneralInfoPage } from './general-info.page';

const routes: Routes = [
  {
    path: '',
    component: GeneralInfoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GeneralInfoPageRoutingModule {}
