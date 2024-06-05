import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DeleteAccountFormPageRoutingModule } from './delete-account-form-routing.module';

import { DeleteAccountFormPage } from './delete-account-form.page';
import { HeaderFooterComponentsModule } from 'src/app/components/header-footer.components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    HeaderFooterComponentsModule,
    DeleteAccountFormPageRoutingModule,
  ],
  declarations: [DeleteAccountFormPage],
})
export class DeleteAccountFormPageModule {}
