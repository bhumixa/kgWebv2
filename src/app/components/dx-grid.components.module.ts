import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DxDataGridComponent } from './dx-data-grid/dx-data-grid.component';
import { DxDataGridModule } from 'devextreme-angular/ui/data-grid';
import { DxTemplateModule } from 'devextreme-angular';
import { DxCheckBoxModule } from 'devextreme-angular';
import { PipesModule } from '../pipes/pipes.module';
import { SortCodesPipe } from '../pipes/sort-code/sort-codes.pipe';
import { TranslateModule } from '@ngx-translate/core';
//// Product Gird

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        IonicModule,
        DxDataGridModule,
        DxTemplateModule,
        DxCheckBoxModule,
        PipesModule,
        TranslateModule
    ],
    providers: [SortCodesPipe],
    declarations: [DxDataGridComponent],
    exports: [DxDataGridComponent]
})
export class DxGridComponentsModule {}
