import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ProductSummaryCompComponent } from './product-summary-comp/product-summary-comp.component';
import { DxGridComponentsModule } from './dx-grid.components.module';
import { InspectViewingComponentsModule } from './inspect-viewing.components.module';
import { PageComponentsModule } from './page.components.module';
import { Cloudinary } from 'cloudinary-core/cloudinary-core-shrinkwrap';
import { environment } from 'src/environments/environment';
import { LoadingModule } from './loading/loading.module';
import { ElasticsearchService } from '../service/elasticsearch/elasticsearch.service';

export const cloudinaryLib = {
  Cloudinary: Cloudinary,
};

const cloudConfig = {
  cloud_name: environment.companyDetails.config.cludinaryCloud,
};

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        IonicModule,
        DxGridComponentsModule,
        InspectViewingComponentsModule,
       
        PageComponentsModule,
        LoadingModule,
    ],
    declarations: [ProductSummaryCompComponent],
    exports: [ProductSummaryCompComponent],
    providers: [ElasticsearchService]
})
export class ProductComponentsModule {}
