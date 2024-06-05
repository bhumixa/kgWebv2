import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { HeaderFooterComponentsModule } from '../../components/header-footer.components.module'

import { MyFavoritePage } from './my-favorite.page';
import { Cloudinary } from 'cloudinary-core/cloudinary-core-shrinkwrap';

import { DxGridComponentsModule } from "../../components/dx-grid.components.module";
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
    component: MyFavoritePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HeaderFooterComponentsModule,
   
    RouterModule.forChild(routes),
    DxGridComponentsModule
  ],
  declarations: [MyFavoritePage]
})
export class MyFavoritePageModule { }
