import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CollectionsPage } from './collections.page';
import { HeaderFooterComponentsModule } from '../../components/header-footer.components.module'
import { CollectionComponentsModule } from '../../components/collection.components.module'
import { ElasticComponentsModule } from '../../components/elastic.components.module'
import { IonicSelectableComponent } from 'ionic-selectable';

// import { ProductCompComponent } from '../../components/product-comp/product-comp.component'

const routes: Routes = [
  {
    path: '',
    component: CollectionsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    HeaderFooterComponentsModule,
    CollectionComponentsModule,
    ElasticComponentsModule,
    IonicSelectableComponent
  ],
  declarations: [CollectionsPage]
})
export class CollectionsPageModule { }
