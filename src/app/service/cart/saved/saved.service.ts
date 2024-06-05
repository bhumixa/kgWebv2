import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Storage } from '@ionic/storage';
import { ConfigServiceService } from '../../config-service.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SavedService {
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

  async getAllSavedSearches(userId: any) {
    try {
      this.headers = await this.configService.getAPIHeader();
      const response = await this.http
        .get(
          ConfigServiceService.getBaseNewUrl() +
            '/shop_savedSearches/' +
            this.refCompanyId +
            '/getAllSavedSearchs?refUserId=' +
            userId,
          { headers: new HttpHeaders(this.headers) }
        )
        .toPromise();
      // console.log("response getCustomerOrders", response);
      return await response;
    } catch (error) {
      // console.log("error", error);
      return await error;
    }
  }

  async getSavedSearchById(userId: any, savedSearchId: any) {
    try {
      this.headers = await this.configService.getAPIHeader();
      const response = await this.http
        .get(
          ConfigServiceService.getBaseNewUrl() +
            '/shop_savedSearches/' +
            this.refCompanyId +
            '/getSavedSearchId?savedSearchId=' +
            savedSearchId,
          { headers: new HttpHeaders(this.headers) }
        )
        .toPromise();
      // console.log("response getCustomerOrders", response);
      return await response;
    } catch (error) {
      // console.log("error", error);
      return await error;
    }
  }

  async AddSaveSearch(addObj: any) {
    try {
      this.headers = await this.configService.getAPIHeader();
      const response = await this.http
        .post(
          ConfigServiceService.getBaseNewUrl() +
            '/shop_savedSearches/' +
            this.refCompanyId +
            '/AddSaveSearch',
          addObj,
          { headers: new HttpHeaders(this.headers) }
        )
        .toPromise();
      // console.log("response insertAddress", response);
      return await response;
    } catch (error) {
      // console.log("error", error);
      return await error;
    }
  }
  async sendInquiryEmail(obj: any) {
    try {
      this.headers = await this.configService.getAPIHeader();
      const response = await this.http
        .post(
          ConfigServiceService.getBaseNewUrl() + '/users/sendInquiryEmail',
          obj,
          { headers: new HttpHeaders(this.headers) }
        )
        .toPromise();
      return await response;
    } catch (error) {
      return await error;
    }
  }

  async emailSelectedProducts(
    email: any,
    selectedProduct: any,
    userId: any,
    msg = null
  ) {
    let obj = {
      refCompanyId: this.refCompanyId,
      email: email,
      selectedProduct: selectedProduct,
      userId: userId,
      msg: msg,
    };
    try {
      const response = await this.http
        .post(
          ConfigServiceService.getBaseNewUrl() +
            '/shop_carts/' +
            this.refCompanyId +
            '/sendMailUsingEmailDetails',
          obj
        )
        .toPromise();
      // console.log("response SaveCart", response);
      return await response;
    } catch (error) {
      // console.log("error", error);
      return await error;
    }
  }

  async deleteSavedSearchById(savedSearchId: any, userId: any) {
    try {
      const response = await this.http
        .delete(
          ConfigServiceService.getBaseNewUrl() +
            '/shop_savedSearches/' +
            this.refCompanyId +
            '/removeSaved',
          {
            params: {
              id: this.refCompanyId,
              cartId: savedSearchId,
              refUserId: userId,
            },
          }
        )
        .toPromise();
      // console.log("response removeCartProduct", response);
      return await response;
    } catch (error) {
      // console.log("error", error);
      return await error;
    }
  }
}
