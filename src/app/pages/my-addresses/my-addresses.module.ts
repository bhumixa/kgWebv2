import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { MyAddressesPage } from './my-addresses.page';
import { HeaderFooterComponentsModule } from '../../components/header-footer.components.module';
import { AddressComponentsModule } from '../../components/addresss.components.module';
import { TranslateModule } from '@ngx-translate/core';

const routes: Routes = [
  {
    path: '',
    component: MyAddressesPage
  }
];

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        IonicModule,
        HeaderFooterComponentsModule,
        RouterModule.forChild(routes),
        AddressComponentsModule,
        TranslateModule,
    ],
    declarations: [MyAddressesPage]
})
export class MyAddressesPageModule { }
