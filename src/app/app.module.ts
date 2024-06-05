import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule, Meta } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { Device } from '@ionic-native/device/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { File } from '@ionic-native/file/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { PreviewAnyFile } from '@ionic-native/preview-any-file/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage-angular';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { Globalization } from '@ionic-native/globalization/ngx';

import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { Cloudinary } from 'cloudinary-core/cloudinary-core-shrinkwrap';
import { CartActionsComponent } from '../app/components/cart/cart-actions/cart-actions.component';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderFooterComponentsModule } from './components/header-footer.components.module';
import { CompanyService } from './service/company/company.service';
import { ConfigServiceService } from './service/config-service.service';
import { HeaderFooterService } from './service/headerFooter/header-footer.service';
import { ThemeService } from './service/theme.service';
import { AnalyticsService } from './service/analytics.service';
import { ShowDNAComponent } from './components/DNA/show-dna.component';
import { IonIntlTelInputFormModule } from './components/ion-intl-tel-input/ion-intl-tel-input.module';
import { CartAddedPopupPageModule } from './pages/cart-added-popup/cart-added-popup.module';
import { Ionic4DatepickerModule } from '@logisticinfotech/ionic4-datepicker';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export const cloudinaryLib = {
  Cloudinary: Cloudinary,
};

const cloudConfig = {
  cloud_name: environment.companyDetails.config.cludinaryCloud,
};

@NgModule({
  declarations: [AppComponent, CartActionsComponent, ShowDNAComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    AppRoutingModule,
    HeaderFooterComponentsModule,
    CartAddedPopupPageModule,
    IonIntlTelInputFormModule,
    //Ionic4DatepickerModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    ConfigServiceService,
    AnalyticsService,
    CompanyService,
    PreviewAnyFile,
    File,
    FileTransfer,
    HeaderFooterService,
    InAppBrowser,
    Device,
    ThemeService,
    Meta,
    AppVersion,
    Globalization,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
