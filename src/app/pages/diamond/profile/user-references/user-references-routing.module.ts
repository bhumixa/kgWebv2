import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserReferencesPage } from './user-references.page';
import { TranslateModule } from '@ngx-translate/core';

const routes: Routes = [
  {
    path: '',
    component: UserReferencesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), TranslateModule],
  exports: [RouterModule],
})
export class UserReferencesPageRoutingModule {}
