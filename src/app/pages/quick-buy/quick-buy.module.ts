import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QuickBuyPageRoutingModule } from './quick-buy-routing.module';

import { QuickBuyPage } from './quick-buy.page';
import { HeaderFooterComponentsModule } from '../../components/header-footer.components.module';
import { LoginComponentsModule } from "../../components/login.components.module";


import { Cloudinary } from 'cloudinary-core/cloudinary-core-shrinkwrap';

import { environment } from 'src/environments/environment';

export const cloudinaryLib = {
  Cloudinary: Cloudinary
};

const cloudConfig = {
  cloud_name: environment.companyDetails.config.cludinaryCloud
};

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoginComponentsModule,
    QuickBuyPageRoutingModule,
    ReactiveFormsModule,
    HeaderFooterComponentsModule,
  ],
  declarations: [QuickBuyPage]
})
export class QuickBuyPageModule { }
