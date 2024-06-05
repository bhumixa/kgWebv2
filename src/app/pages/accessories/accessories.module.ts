import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AccessoriesPageRoutingModule } from './accessories-routing.module';

import { AccessoriesPage } from './accessories.page';
import { HeaderFooterComponentsModule } from 'src/app/components/header-footer.components.module';

import { AccessoriesLayoutModule } from 'src/app/components/accessories-layout.module';
import { AccessoriesMenuModule } from 'src/app/components/accessories-menu.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AccessoriesPageRoutingModule,
    HeaderFooterComponentsModule,
    AccessoriesLayoutModule,
    AccessoriesMenuModule

  ],
  declarations: [AccessoriesPage]
})
export class AccessoriesPageModule {}
