import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { OrdersPage } from './orders.page';
import { PipesModule } from '../../pipes/pipes.module';
import { HeaderFooterComponentsModule } from '../../components/header-footer.components.module';
import { Ionic4DatepickerModule } from '@logisticinfotech/ionic4-datepicker';
import { SelectableComponentsModule } from '../../components/selectable.components.module';
import { DxGridComponentsModule } from '../../components/dx-grid.components.module';
import { TranslateModule } from '@ngx-translate/core';

const routes: Routes = [
  {
    path: '',
    component: OrdersPage,
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    PipesModule,
    DxGridComponentsModule,
    HeaderFooterComponentsModule,
    //Ionic4DatepickerModule,
    SelectableComponentsModule,
    TranslateModule,
  ],
  declarations: [OrdersPage],
})
export class OrdersPageModule {}
