import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ProductsPage } from './products.page';
import { HeaderFooterComponentsModule } from '../../components/header-footer.components.module'
import { ProductComponentsModule } from '../../components/product.components.module'

import { Cloudinary } from 'cloudinary-core/cloudinary-core-shrinkwrap';

import { environment } from 'src/environments/environment';

export const cloudinaryLib = {
  Cloudinary: Cloudinary
};

const cloudConfig = {
  cloud_name: environment.companyDetails.config.cludinaryCloud
};

const routes: Routes = [
  {
    path: '',
    component: ProductsPage
  }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
       
        RouterModule.forChild(routes),
        HeaderFooterComponentsModule,
        ProductComponentsModule
    ],
    declarations: [ProductsPage]
})
export class ProductsPageModule { }
