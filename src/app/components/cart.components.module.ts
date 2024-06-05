import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IonicModule } from "@ionic/angular";
import { CartComponent } from "./cart/cart.component";
import { InspectViewingComponentsModule } from './inspect-viewing.components.module';

import { Cloudinary } from 'cloudinary-core/cloudinary-core-shrinkwrap';
import { FormsModule } from "@angular/forms";
import { DxGridComponentsModule } from "./dx-grid.components.module";
import { CartActionsComponent } from "./cart/cart-actions/cart-actions.component";
import { environment } from "src/environments/environment";
import { TranslateModule } from "@ngx-translate/core";

export const cloudinaryLib = {
  Cloudinary: Cloudinary
};

const cloudConfig = {
  cloud_name: environment.companyDetails.config.cludinaryCloud
};

@NgModule({
    imports: [CommonModule, IonicModule, FormsModule,
        DxGridComponentsModule, InspectViewingComponentsModule, TranslateModule
    ],
    declarations: [CartComponent],
    exports: [CartComponent]
})
export class CartComponentsModule { }
