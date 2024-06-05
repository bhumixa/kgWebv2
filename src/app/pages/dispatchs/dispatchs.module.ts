import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";
import { HeaderFooterComponentsModule } from "../../components/header-footer.components.module";
import { SelectableComponentsModule } from "../../components/selectable.components.module";
import { IonicModule } from "@ionic/angular";
import { PipesModule } from "../../pipes/pipes.module";
import { DispatchsPage } from "./dispatchs.page";

const routes: Routes = [
  {
    path: "",
    component: DispatchsPage
  }
];

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, RouterModule.forChild(routes), SelectableComponentsModule, HeaderFooterComponentsModule, PipesModule],
  declarations: [DispatchsPage]
})
export class DispatchsPageModule { }
