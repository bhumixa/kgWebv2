import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Storage } from "@ionic/storage";
import { ConfigServiceService } from "../config-service.service";
import { CompanyService } from "../company/company.service";
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  public refCompanyId: any = environment.refCompanyId;
  public headers;

  constructor(public http: HttpClient, public storage: Storage, public configService: ConfigServiceService, public _companyService: CompanyService) {
    this.getHeaders();
  }

  async getHeaders() {
    this.headers = await this.configService.getAPIHeader();
  }

  async getTrackOrder(orderId, pincode) {
    try {
      const response = await this.http.get(ConfigServiceService.getBaseNewUrl() + "/shop_orders/" + this.refCompanyId + "/trackOrder?orderId=" + orderId + "&pincode=" + pincode).toPromise();
      // console.log("response getSavedCart", response);
      return await response;
    } catch (error) {
      // console.log("error", error);
      return await error;
    }
  }

}
