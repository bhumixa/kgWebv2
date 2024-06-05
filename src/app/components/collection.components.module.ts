import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { CollectionComponentComponent } from './collection-component/collection-component.component';

import { Cloudinary } from 'cloudinary-core/cloudinary-core-shrinkwrap';
import { environment } from "src/environments/environment";

export const cloudinaryLib = {
  Cloudinary: Cloudinary
};

const cloudConfig = {
  cloud_name: environment.companyDetails.config.cludinaryCloud
};


@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule,
    ],
    declarations: [CollectionComponentComponent],
    exports: [CollectionComponentComponent]
})
export class CollectionComponentsModule { }
