import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StaticPage } from './static.page';

const routes: Routes = [
  {
    path: '',
    component: StaticPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StaticPageRoutingModule {}
