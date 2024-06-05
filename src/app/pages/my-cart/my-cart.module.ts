import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MyCartPageRoutingModule } from './my-cart-routing.module';
import { MyCartPage } from './my-cart.page';
import { CartComponentsModule } from '../../components/cart.components.module';
import { HeaderFooterComponentsModule } from '../../components/header-footer.components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyCartPageRoutingModule,
    HeaderFooterComponentsModule,
    CartComponentsModule
  ],
  declarations: [MyCartPage]
})
export class MyCartPageModule { }
