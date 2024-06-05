import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SearchPage } from './search.page';
import { HeaderFooterComponentsModule } from '../../components/header-footer.components.module'
import { ElasticComponentsModule } from '../../components/elastic.components.module';
// import { DiamondSearchPageModule } from '../diamond-search/diamond-search.module';

const routes: Routes = [
  {
    path: '',
    component: SearchPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    HeaderFooterComponentsModule,
    ElasticComponentsModule
    // DiamondSearchPageModule
  ],
  declarations: [SearchPage]
})
export class SearchPageModule { }
