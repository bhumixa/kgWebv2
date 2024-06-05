import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderFooterComponentsModule } from '../../components/header-footer.components.module'

import { IonicModule } from '@ionic/angular';

import { TrackOrderPageRoutingModule } from './track-order-routing.module';

import { TrackOrderPage } from './track-order.page';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HeaderFooterComponentsModule,
    TrackOrderPageRoutingModule,
    PipesModule
  ],
  declarations: [TrackOrderPage]
})
export class TrackOrderPageModule { }
