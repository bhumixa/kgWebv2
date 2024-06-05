import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
// import { ProductCompComponent } from "../../components/product-comp/product-comp.component"
import { NewOrderPage } from './new-order.page';
import { HeaderFooterComponentsModule } from '../../components/header-footer.components.module';
//import { ProductFormPage } from "../product-form/product-form.page";
import { ProductComponentsModule } from '../../components/product.components.module'
import { PageComponentsModule } from '../../components/page.components.module';
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
    component: NewOrderPage
  }
];
@NgModule({
  declarations: [NewOrderPage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
   
    RouterModule.forChild(routes),
    HeaderFooterComponentsModule,
    PageComponentsModule,
    ProductComponentsModule
  ]

})
export class NewOrderPageModule { }
