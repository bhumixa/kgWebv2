import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductFormPageRoutingModule } from './product-form-routing.module';

import { ProductFormPage } from './product-form.page';
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
    ProductFormPageRoutingModule
  ],
  declarations: [ProductFormPage]
})
export class ProductFormPageModule {}
