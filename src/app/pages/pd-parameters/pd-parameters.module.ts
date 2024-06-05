import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PdParametersPageRoutingModule } from './pd-parameters-routing.module';

import { PdParametersPage } from './pd-parameters.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PdParametersPageRoutingModule,
    TranslateModule
  ],
  declarations: [PdParametersPage]
})
export class PdParametersPageModule {}
