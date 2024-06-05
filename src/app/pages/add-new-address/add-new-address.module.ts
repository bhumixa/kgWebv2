import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";
import { IonicModule } from "@ionic/angular";
import { AddNewAddressPage } from "./add-new-address.page";
import { HeaderFooterComponentsModule } from '../../components/header-footer.components.module';
import { AddressComponentsModule } from '../../components/addresss.components.module'

const routes: Routes = [
  {
    path: "",
    component: AddNewAddressPage
  }
];

@NgModule({
    imports: [CommonModule, FormsModule, IonicModule, RouterModule.forChild(routes), HeaderFooterComponentsModule, AddressComponentsModule],
    declarations: [AddNewAddressPage]
})
export class AddNewAddressPageModule { }
