import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IonicModule } from "@ionic/angular";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
// import { ConfigServiceService } from "../service/config-service.service";
// import { DatabaseServiceService } from "../service/database-service.service";
import { HomePage } from "./home.page";
import { HeaderFooterComponentsModule } from '../../components/header-footer.components.module'
import { PageComponentsModule } from '../../components/page.components.module';

import { Cloudinary } from 'cloudinary-core/cloudinary-core-shrinkwrap';
import { environment } from "src/environments/environment";

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
   
    // ConfigServiceService,
    // DatabaseServiceService,
    RouterModule.forChild([
      {
        path: "",
        component: HomePage
      }
    ]),
    HeaderFooterComponentsModule,
    PageComponentsModule
  ],
  providers: [],
  declarations: [HomePage]
})
export class HomePageModule { }
