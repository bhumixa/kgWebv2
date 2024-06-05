import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { KgGeneralInfoComponentsModule } from '../../components/kg-general-info.component.module';
import { HeaderFooterComponentsModule } from '../../components/header-footer.components.module'
import { AddressComponentsModule } from '../../components/addresss.components.module'
import { Crop } from "@ionic-native/crop/ngx";
import { FileTransfer } from "@ionic-native/file-transfer/ngx";
import { Camera } from "@ionic-native/camera/ngx";
import { File } from '@ionic-native/file/ngx';
import { IonicModule } from '@ionic/angular';

import { SettingPage } from './setting.page';
import { TranslateModule } from '@ngx-translate/core';
//import { GeneralInfoPageModule } from '../../pages/diamond/profile/general-info/general-info.module';

const routes: Routes = [
  {
    path: '',
    component: SettingPage
  }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        IonicModule,
        KgGeneralInfoComponentsModule,
        AddressComponentsModule,
        HeaderFooterComponentsModule,
        RouterModule.forChild(routes),
        TranslateModule,
    ],
    declarations: [SettingPage],
    providers: [Crop, FileTransfer, File, Camera]

})
export class SettingPageModule { }
