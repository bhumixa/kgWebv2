import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";
import { PipesModule } from "../../pipes/pipes.module";
import { HeaderFooterComponentsModule } from "../../components/header-footer.components.module";
import { IonicModule } from "@ionic/angular";
import { SchemesPage } from "./schemes.page";

const routes: Routes = [
  {
    path: "",
    component: SchemesPage
  }
];

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, RouterModule.forChild(routes), PipesModule, HeaderFooterComponentsModule],
  declarations: [SchemesPage]
})
export class SchemesPageModule { }
