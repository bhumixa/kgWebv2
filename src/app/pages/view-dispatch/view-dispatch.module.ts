import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";
import { IonicModule } from "@ionic/angular";
import { ViewDispatchPage } from "./view-dispatch.page";
import { PipesModule } from "../../pipes/pipes.module";
import { HeaderFooterComponentsModule } from "../../components/header-footer.components.module";

const routes: Routes = [
  {
    path: "",
    component: ViewDispatchPage
  }
];

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, RouterModule.forChild(routes), PipesModule, HeaderFooterComponentsModule],
  declarations: [ViewDispatchPage]
})
export class ViewDispatchPageModule { }
