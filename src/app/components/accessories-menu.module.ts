import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { AccessoriesMenuComponent } from "./accessories-menu/accessories-menu.component";



@NgModule({
    declarations: [AccessoriesMenuComponent],
    imports: [
        CommonModule, FormsModule, ReactiveFormsModule, IonicModule
    ],
    exports: [AccessoriesMenuComponent]
})
export class AccessoriesMenuModule { }
