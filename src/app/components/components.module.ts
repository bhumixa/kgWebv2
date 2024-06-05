import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PipesModule } from '../pipes/pipes.module';
// import { CartComponent } from "./cart/cart.component";
import { NgxPaginationModule } from 'ngx-pagination';
import { Ionic4DatepickerModule } from '@logisticinfotech/ionic4-datepicker';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    PipesModule,
    //Ionic4DatepickerModule,
    NgxPaginationModule,
  ],
  declarations: [],
  exports: [],
})
export class ComponentsModule {}
