import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";
import { HeaderFooterComponentsModule } from "../../components/header-footer.components.module";

import { IonicModule } from "@ionic/angular";

import { PageContentsPage } from "./page-contents.page";

const routes: Routes = [
  {
    path: "",
    component: PageContentsPage
  }
];

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, CommonModule, HeaderFooterComponentsModule, RouterModule.forChild(routes)],
  declarations: [PageContentsPage]
})
export class PageContentsPageModule { }
