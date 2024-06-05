import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CartAddedPopupPageRoutingModule } from './cart-added-popup-routing.module';

import { CartAddedPopupPage } from './cart-added-popup.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CartAddedPopupPageRoutingModule
  ],
  declarations: [CartAddedPopupPage]
})
export class CartAddedPopupPageModule {}
