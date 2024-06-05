import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
//import { ShortCartComponent } from "./short-cart/short-cart.component";
import { Cloudinary } from 'cloudinary-core/cloudinary-core-shrinkwrap';
import { EsSearchBoxComponent } from './es-search-box/es-search-box.component';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { environment } from 'src/environments/environment';
import { TranslateModule } from '@ngx-translate/core';
// import { NgSelectModule } from "@ng-select/ng-select";

export const cloudinaryLib = {
  Cloudinary: Cloudinary,
};

const cloudConfig = {
  cloud_name: environment.companyDetails.config.cludinaryCloud,
};

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    NgxPaginationModule,
    TranslateModule,
  ],
  declarations: [HeaderComponent, FooterComponent, EsSearchBoxComponent],
  exports: [HeaderComponent, FooterComponent, EsSearchBoxComponent],
})
export class HeaderFooterComponentsModule {}
