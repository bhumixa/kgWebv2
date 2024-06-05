import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { Routes, RouterModule } from "@angular/router";
import { MyCustomersPage } from "./my-customers.page";
import { PipesModule } from "../../pipes/pipes.module";
import { HeaderFooterComponentsModule } from "../../components/header-footer.components.module";

const routes: Routes = [
  {
    path: "",
    component: MyCustomersPage
  }
];

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, RouterModule.forChild(routes), PipesModule, HeaderFooterComponentsModule],
  declarations: [MyCustomersPage]
})
export class MyCustomersPageModule { }
