import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Storage } from '@ionic/storage';
import { ConfigServiceService } from '../config-service.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SocialService {
  public refCompanyId: any = environment.refCompanyId;
  public headers: any;

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

  async getSocialMediaFeedsByName(name: any, offset: any, limit: any) {
    try {
      const response = await this.http
        .get(
          ConfigServiceService.getBaseNewUrl() +
            '/socialmedia/getSocialMediaFeedsByName?name=' +
            name +
            '&id=' +
            this.refCompanyId +
            '&offset=' +
            offset +
            '&limit=' +
            limit,
          { headers: new HttpHeaders(this.headers) }
        )
        .toPromise();
      return await response;
    } catch (error) {
      // console.log("error", error);
      return await error;
    }
  }
}
