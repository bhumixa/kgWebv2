import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectSuppliersPageRoutingModule } from './select-suppliers-routing.module';

import { SelectSuppliersPage } from './select-suppliers.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelectSuppliersPageRoutingModule
  ],
  declarations: [SelectSuppliersPage]
})
export class SelectSuppliersPageModule {}
