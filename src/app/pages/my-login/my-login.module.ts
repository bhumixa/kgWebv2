import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";
import { IonicModule } from "@ionic/angular";
import { MyLoginPageRoutingModule } from "./my-login-routing.module";
import { MyLoginPage } from "./my-login.page";

const routes: Routes = [
  {
    path: "",
    component: MyLoginPage
  }
];
@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, RouterModule.forChild(routes)],
  declarations: [MyLoginPage]
})
export class MyLoginPageModule { }
