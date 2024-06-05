import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Storage } from "@ionic/storage";
import { ConfigServiceService } from "../config-service.service";
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PageService {

  public refCompanyId: any = environment.refCompanyId;
  public headers;

  constructor(public http: HttpClient, public storage: Storage, public configService: ConfigServiceService) {
    this.getHeaders();
  }

  async getHeaders() {
    this.headers = await this.configService.getAPIHeader();
  }

  async getPageDetailByPageName(name, userId) {
    try {
      let url = ConfigServiceService.getBaseNewUrl() + "/shop_pages/getPageDetailByPageName?id=" + this.refCompanyId + "&name=" + name;
      if (!!userId) url += "&userId=" + userId;
      const response = await this.http.get(url).toPromise();
      // console.log("response getPageDetailByPageName", response);
      return await response;
    } catch (error) {
      // console.log("error", error);
      return await error;
    }
  }


  async getPageDetailByImageType(refCompanyId) {
    try {
      const response = await this.http.get(ConfigServiceService.getBaseNewUrl() + "/shop_pages/getPageDetailByImageType?id=" + this.refCompanyId).toPromise();
      // console.log("response getPageDetailByImageType", response);
      return await response;
    } catch (error) {
      // console.log("error", error);
      return await error;
    }
  }

}