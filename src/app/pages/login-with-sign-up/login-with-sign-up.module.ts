import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";
import { IonicModule } from '@ionic/angular';
import { LoginWithSignUpPageRoutingModule } from './login-with-sign-up-routing.module';
import { HeaderFooterComponentsModule } from "../../components/header-footer.components.module";
import { LoginComponentsModule } from "../../components/login.components.module";
import { LoginWithSignUpPage } from './login-with-sign-up.page';
import { GuestLoginPageModule } from "../guest-login/guest-login.module";
import { IonIntlTelInputModule } from 'ion-intl-tel-input';
import { SelectableComponentsModule } from "src/app/components/selectable.components.module";
import { IonIntlTelInputFormModule } from "src/app/components/ion-intl-tel-input/ion-intl-tel-input.module";
import { TranslateModule } from "@ngx-translate/core";

const routes: Routes = [
  {
    path: "",
    component: LoginWithSignUpPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    LoginWithSignUpPageRoutingModule,
    RouterModule.forChild(routes),
    HeaderFooterComponentsModule,
    GuestLoginPageModule,
    LoginComponentsModule,
    IonIntlTelInputFormModule,
    SelectableComponentsModule   
  ],
  declarations: [LoginWithSignUpPage]
})
export class LoginWithSignUpPageModule { }
