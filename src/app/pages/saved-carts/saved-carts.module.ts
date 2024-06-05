import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";

import { PipesModule } from "../../pipes/pipes.module";
import { HeaderFooterComponentsModule } from "../../components/header-footer.components.module";

import { SavedCartsPageRoutingModule } from './saved-carts-routing.module';

import { SavedCartsPage } from './saved-carts.page';

const routes: Routes = [
  {
    path: "",
    component: SavedCartsPage
  }
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SavedCartsPageRoutingModule,
    RouterModule.forChild(routes), PipesModule, HeaderFooterComponentsModule
  ],
  declarations: [SavedCartsPage]
})
export class SavedCartsPageModule { }
