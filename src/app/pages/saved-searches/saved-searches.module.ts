import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";

import { PipesModule } from "../../pipes/pipes.module";
import { HeaderFooterComponentsModule } from "../../components/header-footer.components.module";

import { SavedSearchesPageRoutingModule } from './saved-searches-routing.module';

import { SavedSearchesPage } from './saved-searches.page';

const routes: Routes = [
  {
    path: "",
    component: SavedSearchesPage
  }
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SavedSearchesPageRoutingModule,
    RouterModule.forChild(routes), PipesModule, HeaderFooterComponentsModule
  ],
  declarations: [SavedSearchesPage]
})
export class SavedSearchesPageModule { }
