import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TranslateModule } from '@ngx-translate/core';

import { PopoverComponent } from './popover/popover.component';
import { ElasticSearchComponent } from './elastic-search/elastic-search.component';
import { EsRefinementListComponent } from './es-refinement-list/es-refinement-list.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { IonicSelectableComponent } from 'ionic-selectable';
import { InspectViewingComponentsModule } from './inspect-viewing.components.module';
import { DxGridComponentsModule } from './dx-grid.components.module';
import { Cloudinary } from 'cloudinary-core/cloudinary-core-shrinkwrap';
import { environment } from 'src/environments/environment';
import { StoneGridModule } from './stone-grid.module';
import { BookAppointmentModule } from './book-appointment.module';

export const cloudinaryLib = {
  Cloudinary: Cloudinary,
};

const cloudConfig = {
  cloud_name: environment.companyDetails.config.cludinaryCloud,
};

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule],
  declarations: [EsRefinementListComponent],
  exports: [EsRefinementListComponent],
})
export class ElasticSearchComponentComponentsModule {}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    NgxPaginationModule,
    StoneGridModule,
    DxGridComponentsModule,
    InspectViewingComponentsModule,
    IonicSelectableComponent,
    ElasticSearchComponentComponentsModule,
    BookAppointmentModule,
    TranslateModule,
  ],
  declarations: [PopoverComponent, ElasticSearchComponent],
  exports: [PopoverComponent, ElasticSearchComponent],
})
export class ElasticComponentsModule {}
