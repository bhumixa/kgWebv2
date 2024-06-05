import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DiamondSearchPageRoutingModule } from './diamond-search-routing.module';
import { DiamondSearchPage } from './diamond-search.page';
import { HeaderFooterComponentsModule } from '../../components/header-footer.components.module';
import { SelectableComponentsModule } from '../../components/selectable.components.module';
import { ElasticSearchComponentComponentsModule } from '../../components/elastic.components.module';
import { IonicSelectableComponent } from 'ionic-selectable';
import { PdParametersPageModule } from '../pd-parameters/pd-parameters.module';
import { LoadingModule } from 'src/app/components/loading/loading.module';
import { DiamondSearchService } from 'src/app/service/diamond-search/diamond-search.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ElasticSearchComponentComponentsModule,
    DiamondSearchPageRoutingModule,
    HeaderFooterComponentsModule,
    SelectableComponentsModule,
    IonicSelectableComponent,
    PdParametersPageModule,
    LoadingModule,
    TranslateModule
  ],
  declarations: [DiamondSearchPage],
  providers: [DiamondSearchService],
})
export class DiamondSearchPageModule {}
