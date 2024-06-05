import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Storage } from '@ionic/storage';
import { ConfigServiceService } from '../config-service.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AmountService {
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

  async createOrderInRazorPay(paymentObj: any) {
    try {
      paymentObj.refCompanyId = this.refCompanyId;
      const response = await this.http
        .post(
          ConfigServiceService.getBaseNewUrl() +
            '/shop_paymentInfos/createOrderInRazorPay',
          paymentObj
        )
        .toPromise();
      // console.log("response", response);
      return await response;
    } catch (error) {
      // console.log("error", error);
      return await error;
    }
  }

  async updateOutstandingAmount(userId: any, amount: any) {
    try {
      const response = await this.http
        .get(
          ConfigServiceService.getBaseNewUrl() +
            '/shop_customers/updateOutstandingAmount?id=' +
            this.refCompanyId +
            '&customerId=' +
            userId +
            '&deductAmount=' +
            amount,
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
