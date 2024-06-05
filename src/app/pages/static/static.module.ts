import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StaticPageRoutingModule } from './static-routing.module';

import { StaticPage } from './static.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StaticPageRoutingModule
  ],
  declarations: [StaticPage]
})
export class StaticPageModule {}
