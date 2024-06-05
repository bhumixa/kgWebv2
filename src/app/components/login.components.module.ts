import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LoaderButtonComponent } from './loader-button/loader-button.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { Cloudinary } from 'cloudinary-core/cloudinary-core-shrinkwrap';
import { environment } from 'src/environments/environment';
import { NgSelectModule } from '@ng-select/ng-select';
import { IonIntlTelInputFormModule } from './ion-intl-tel-input/ion-intl-tel-input.module';
import { TranslateModule } from '@ngx-translate/core';

export const cloudinaryLib = {
  Cloudinary: Cloudinary,
};

const cloudConfig = {
  cloud_name: environment.companyDetails.config.cludinaryCloud,
};

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    IonIntlTelInputFormModule,
    TranslateModule,
  ],
  declarations: [LoginFormComponent, LoaderButtonComponent],
  exports: [LoginFormComponent, LoaderButtonComponent],
})
export class LoginComponentsModule {}
