import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Storage } from '@ionic/storage-angular';
import { ConfigServiceService } from '../config-service.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CompanyService } from '../../service/company/company.service';

@Injectable({
  providedIn: 'root',
})
export class DetailsService {
  public refCompanyId: any = environment.refCompanyId;
  public headers: any;

  constructor(
    public http: HttpClient,
    public storage: Storage,
    public configService: ConfigServiceService,
    public _companyService: CompanyService
  ) {
    this.getHeaders();
  }

  async getHeaders() {
    this.headers = await this.configService.getAPIHeader();
  }

  async getUtmData() {
    const obj: any = {
      utm_source: '',
      utm_medium: '',
      utm_campaign: '',
      utm_term: '',
      utm_content: '',
    };

    const sParams = await this._companyService.getSearchParameters();
    if (sParams) {
      if (sParams.has('utm_source')) {
        obj.utm_source = sParams.get('utm_source');
      }
      if (sParams.has('utm_medium')) {
        obj.utm_medium = sParams.get('utm_medium');
      }
      if (sParams.has('utm_campaign')) {
        obj.utm_campaign = sParams.get('utm_campaign');
      }
      if (sParams.has('utm_term')) {
        obj.utm_term = sParams.get('utm_term');
      }
      if (sParams.has('utm_content')) {
        obj.utm_content = sParams.get('utm_content');
      }
    }

    return obj;
  }

  async getProductDetail(
    productId: any,
    location = '',
    sessionID: any,
    userId: any
  ) {
    // console.log(location);
    try {
      const { utm_source, utm_medium, utm_campaign, utm_term, utm_content } =
        await this.getUtmData();

      // let utm_source, utm_medium, utm_campaign, utm_term, utm_content;

      // let sParams = await this._companyService.getSearchParameters();
      // if (sParams) {
      //   if (sParams.has('utm_source')) {
      //     utm_source = sParams.get('utm_source');
      //   }
      //   if (sParams.has('utm_medium')) {
      //     utm_medium = sParams.get('utm_medium');
      //   }
      //   if (sParams.has('utm_campaign')) {
      //     utm_campaign = sParams.get('utm_campaign');
      //   }
      //   if (sParams.has('utm_term')) {
      //     utm_term = sParams.get('utm_term');
      //   }
      //   if (sParams.has('utm_content')) {
      //     utm_content = sParams.get('utm_content');
      //   }
      // }

      this.headers = await this.configService.getAPIHeader();
      const response = await this.http
        .get(
          ConfigServiceService.getBaseNewUrl() +
            '/shop_products/getProductDetailByProductId?id=' +
            this.refCompanyId +
            '&productId=' +
            productId +
            '&sessionID=' +
            sessionID +
            '&userId=' +
            userId +
            '&utm_source=' +
            utm_source +
            '&utm_medium=' +
            utm_medium +
            '&utm_campaign=' +
            utm_campaign +
            '&utm_term=' +
            utm_term +
            '&utm_content=' +
            utm_content +
            '&fromStoreFront=true' +
            '&refKgCompanyId=' +
            location,
          { headers: new HttpHeaders(this.headers) }
        )
        .toPromise();
      // console.log("response getProductDetail", response);
      return await response;
    } catch (error) {
      // console.log("error", error);
      return await error;
    }
  }

  async getMultipleProductDetail(
    productsData: string,
    sessionID: string,
    userId: number
  ) {
    try {
      const { utm_source, utm_medium, utm_campaign, utm_term, utm_content } =
        await this.getUtmData();

      const data = {
        id: this.refCompanyId,
        productsData,
        sessionID,
        userId,
        utm_source,
        utm_medium,
        utm_campaign,
        utm_term,
        utm_content,
        fromStoreFront: true,
      };

      this.headers = await this.configService.getAPIHeader();
      return await this.http
        .post(
          ConfigServiceService.getBaseNewUrl() +
            '/shop_products/getMultipleProductsDetailByProductId',
          data,
          { headers: new HttpHeaders(this.headers) }
        )
        .toPromise();
    } catch (err) {
      return await err;
    }
  }

  async getProductDetailbyReportNo(reportNo: any, sessionID: any, userId: any) {
    // console.log(location);
    try {
      const { utm_source, utm_medium, utm_campaign, utm_term, utm_content } =
        await this.getUtmData();

      // let utm_source, utm_medium, utm_campaign, utm_term, utm_content;

      // let sParams = await this._companyService.getSearchParameters();
      // if (sParams) {
      //   if (sParams.has('utm_source')) {
      //     utm_source = sParams.get('utm_source');
      //   }
      //   if (sParams.has('utm_medium')) {
      //     utm_medium = sParams.get('utm_medium');
      //   }
      //   if (sParams.has('utm_campaign')) {
      //     utm_campaign = sParams.get('utm_campaign');
      //   }
      //   if (sParams.has('utm_term')) {
      //     utm_term = sParams.get('utm_term');
      //   }
      //   if (sParams.has('utm_content')) {
      //     utm_content = sParams.get('utm_content');
      //   }
      // }

      this.headers = await this.configService.getAPIHeader();
      const response = await this.http
        .get(
          ConfigServiceService.getBaseNewUrl() +
            '/shop_products/getProductDetailByReportNo?id=' +
            this.refCompanyId +
            '&reportNo=' +
            reportNo +
            '&sessionID=' +
            sessionID +
            '&userId=' +
            userId +
            '&utm_source=' +
            utm_source +
            '&utm_medium=' +
            utm_medium +
            '&utm_campaign=' +
            utm_campaign +
            '&utm_term=' +
            utm_term +
            '&utm_content=' +
            utm_content +
            '&fromStoreFront=true',
          { headers: new HttpHeaders(this.headers) }
        )
        .toPromise();
      return await response;
    } catch (error) {
      // console.log("error", error);
      return await error;
    }
  }

  async getProductTagsAndDiscount(
    productId: any,
    location: any,
    userId: any,
    requiredCustomerTagArr: any
  ) {
    try {
      let url =
        ConfigServiceService.getBaseNewUrl() +
        '/shop_pricings/getDiscountAndTagsByProductAndCustomer?id=' +
        this.refCompanyId +
        '&productID=' +
        productId +
        '&customerID=' +
        userId +
        '&refKgCompanyId=' +
        location;
      if (!!requiredCustomerTagArr && requiredCustomerTagArr.length > 0) {
        url += '&customerTags=["' + requiredCustomerTagArr.join('","') + '"]';
      }
      const response = await this.http.get(url).toPromise();
      // console.log("response getProductTagsAndDiscount", response);
      return await response;
    } catch (error) {
      // console.log("error", error);
      return await error;
    }
  }
}
