import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";
import { IonicModule } from "@ionic/angular";
import { ProfileUpdatePage } from "./profile-update.page";
import { HeaderFooterComponentsModule } from "../../components/header-footer.components.module";
import { TranslateModule } from "@ngx-translate/core";

const routes: Routes = [
  {
    path: "",
    component: ProfileUpdatePage
  }
];

@NgModule({
  imports: [TranslateModule, CommonModule, FormsModule, IonicModule, HeaderFooterComponentsModule, ReactiveFormsModule, RouterModule.forChild(routes)],
  declarations: [ProfileUpdatePage]
})
export class ProfileUpdatePageModule { }
