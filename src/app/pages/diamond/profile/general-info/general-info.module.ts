import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { GeneralInfoPageRoutingModule } from './general-info-routing.module';
import { GeneralInfoPage } from './general-info.page';
import { HeaderFooterComponentsModule } from '../../../../components/header-footer.components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    GeneralInfoPageRoutingModule,
    HeaderFooterComponentsModule
  ],
  declarations: [GeneralInfoPage]
})
export class GeneralInfoPageModule { }
