import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SavedSearchesPage } from './saved-searches.page';

const routes: Routes = [
  {
    path: '',
    component: SavedSearchesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SavedSearchesPageRoutingModule {}
