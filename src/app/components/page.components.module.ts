import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { PageSectionsComponent } from "./page-sections/page-sections.component";
import { SocialmediaComponent } from './socialmedia/socialmedia.component'
import { CollectionComponentsModule } from './collection.components.module'

import { Cloudinary } from 'cloudinary-core/cloudinary-core-shrinkwrap';
import { environment } from '../../environments/environment';

export const cloudinaryLib = {
  Cloudinary: Cloudinary
};

const cloudConfig = {
  cloud_name: environment.companyDetails.config.cludinaryCloud
};

@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule,
        CollectionComponentsModule
    ],
    declarations: [PageSectionsComponent, SocialmediaComponent],
    exports: [PageSectionsComponent, SocialmediaComponent]
})
export class PageComponentsModule { }
