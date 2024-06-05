import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { AddressesComponent } from './addresses/addresses.component';
import { AddAddressComponent } from './add-address/add-address.component'



import { DiaCompanyInfoComponent } from './dia-company-info/dia-company-info.component';
import { LoadingModule } from "./loading/loading.module";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule, LoadingModule, TranslateModule],
    declarations: [DiaCompanyInfoComponent],
    exports: [DiaCompanyInfoComponent]
})
export class DiaCompanyInfoComponentsModule { }



@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule, DiaCompanyInfoComponentsModule, LoadingModule, TranslateModule],
    declarations: [AddressesComponent, AddAddressComponent],
    exports: [AddressesComponent, AddAddressComponent]
})
export class AddressComponentsModule { }

