import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { OrderFreshnessPage } from './order-freshness.page';

import { PipesModule } from "../../pipes/pipes.module";
import { HeaderFooterComponentsModule } from "../../components/header-footer.components.module";

const routes: Routes = [
  {
    path: '',
    component: OrderFreshnessPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes), PipesModule, HeaderFooterComponentsModule
  ],
  declarations: [OrderFreshnessPage]
})
export class OrderFreshnessPageModule { }
