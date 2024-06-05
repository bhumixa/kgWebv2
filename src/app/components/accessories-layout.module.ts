import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { AccessoriesLayoutComponent } from "./accessories-layout/accessories-layout.component";
import { AccessoriesEnquiryComponent } from "./accessories-layout/accessories-enquiry/accessories-enquiry.component";



@NgModule({
    declarations: [AccessoriesLayoutComponent, AccessoriesLayoutComponent, AccessoriesEnquiryComponent],
    imports: [
        CommonModule, FormsModule, ReactiveFormsModule, IonicModule
    ],
    exports: [AccessoriesLayoutComponent]
})
export class AccessoriesLayoutModule { }
