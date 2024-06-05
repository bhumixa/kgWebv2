import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";
import { IonicModule } from '@ionic/angular';
import { HeaderFooterComponentsModule } from "../../components/header-footer.components.module";
import { ChangePasswordPageRoutingModule } from './change-password-routing.module';

import { ChangePasswordPage } from './change-password.page';
import { TranslateModule } from "@ngx-translate/core";
const routes: Routes = [
  {
    path: "",
    component: ChangePasswordPage
  }
];
@NgModule({
  imports: [
    TranslateModule,
    CommonModule,
    FormsModule,
    HeaderFooterComponentsModule,
    IonicModule,
    ChangePasswordPageRoutingModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ChangePasswordPage]
})
export class ChangePasswordPageModule { }
