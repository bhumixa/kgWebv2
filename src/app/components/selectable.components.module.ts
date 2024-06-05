import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { IonicSelectableComponent } from "ionic-selectable";
import { IonicSelectableCompComponent } from "./ionic-selectable-comp/ionic-selectable-comp.component";
import { CountryselectionComponent } from './countryselection/countryselection.component';


@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule, IonicSelectableComponent],
    declarations: [IonicSelectableCompComponent, CountryselectionComponent],
    exports: [IonicSelectableCompComponent, CountryselectionComponent]
})
export class SelectableComponentsModule { }
