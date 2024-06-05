import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShowCartPageRoutingModule } from './show-cart-routing.module';

import { ShowCartPage } from './show-cart.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShowCartPageRoutingModule
  ],
  declarations: [ShowCartPage]
})
export class ShowCartPageModule {}
