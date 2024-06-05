import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";
import { IonicModule } from "@ionic/angular";
import { ManageOrdersPage } from "./manage-orders.page";
import { HeaderFooterComponentsModule } from "../../components/header-footer.components.module";
import { SelectableComponentsModule } from "../../components/selectable.components.module";
import { NgxPaginationModule } from 'ngx-pagination';
import { Cloudinary } from 'cloudinary-core/cloudinary-core-shrinkwrap';

import { DxGridComponentsModule } from "../../components/dx-grid.components.module";
import { environment } from "src/environments/environment";
import { TranslateModule } from "@ngx-translate/core";

export const cloudinaryLib = {
  Cloudinary: Cloudinary
};

const cloudConfig = {
  cloud_name: environment.companyDetails.config.cludinaryCloud
};

const routes: Routes = [
  {
    path: "",
    component: ManageOrdersPage
  }
];

@NgModule({
    imports: [
      DxGridComponentsModule, 
      CommonModule, 
      FormsModule, 
      IonicModule, 
      RouterModule.forChild(routes), 
      HeaderFooterComponentsModule, 
      NgxPaginationModule, 
      SelectableComponentsModule,
      TranslateModule
    ],
    declarations: [ManageOrdersPage]
})
export class ManageOrdersPageModule { }
