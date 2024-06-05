import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { UserReferencesPageRoutingModule } from './user-references-routing.module';
import { UserReferencesPage } from './user-references.page';
import { HeaderFooterComponentsModule } from '../../../../components/header-footer.components.module'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    UserReferencesPageRoutingModule,
    HeaderFooterComponentsModule
  ],
  declarations: [UserReferencesPage]
})
export class UserReferencesPageModule { }
