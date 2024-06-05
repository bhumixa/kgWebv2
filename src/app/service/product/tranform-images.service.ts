import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Storage } from '@ionic/storage';
import { ConfigServiceService } from '../config-service.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TranformImagesService {
  public refCompanyId: any = environment.refCompanyId;
  public headers: any;
  public selectedImages: any = false;

  constructor(
    public http: HttpClient,
    public storage: Storage,
    public configService: ConfigServiceService
  ) {
    this.getHeaders();
  }

  async getHeaders() {
    this.headers = await this.configService.getAPIHeader();
  }

  async getTransformationTypes() {
    try {
      if (!this.selectedImages) {
        this.headers = await this.configService.getAPIHeader();
        const response = await this.http
          .get(
            ConfigServiceService.getBaseNewUrl() +
              '/shop_productImages/' +
              this.refCompanyId +
              '/getTransformationTypes',
            {
              headers: new HttpHeaders(this.headers),
            }
          )
          .toPromise();
        // console.log("response ", response);
        this.selectedImages = await response;
      }
      return this.selectedImages;
    } catch (error) {
      // console.log("error", error);
      return await error;
    }
  }
}
