import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Cloudinary } from 'cloudinary-core/cloudinary-core-shrinkwrap';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { InspectViewingComponent } from './inspect-viewing/inspect-viewing.component';
import { DxGridComponentsModule } from './dx-grid.components.module';
import { environment } from 'src/environments/environment';
import { LoadingModule } from './loading/loading.module';
import { TranslateModule } from '@ngx-translate/core';

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
    DxGridComponentsModule,
    LoadingModule,
    TranslateModule,
  ],
  declarations: [InspectViewingComponent],
  exports: [InspectViewingComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class InspectViewingComponentsModule {}
