import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { StoneGridComponent } from "./stone-grid/stone-grid.component";



@NgModule({
    declarations: [StoneGridComponent],
    imports: [
        CommonModule, FormsModule, ReactiveFormsModule, IonicModule
    ],
    exports: [StoneGridComponent]
})
export class StoneGridModule { }
