import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Storage } from '@ionic/storage';
import { ConfigServiceService } from '../../config-service.service';
import { CompanyService } from '../../company/company.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ActionsService {
  public refCompanyId: any = environment.refCompanyId;
  public headers;

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

  async getSavedCart(customerId) {
    try {
      const response = await this.http
        .get(
          ConfigServiceService.getBaseNewUrl() +
            '/shop_saved_carts/' +
            this.refCompanyId +
            '/getSavedCart?userId=' +
            customerId
        )
        .toPromise();
      // console.log("response getSavedCart", response);
      return await response;
    } catch (error) {
      // console.log("error", error);
      return await error;
    }
  }

  async getsavedcartbyid(sessionId, customerId, savedcartId, oldDelete) {
    let cartobj: any = {
      refCompanyId: this.refCompanyId,
      id: this.refCompanyId,
      sessionId: sessionId,
      savedcartId: parseInt(savedcartId),
      oldDelete: oldDelete,
      //userId,
      utm_source: '',
      utm_medium: '',
      utm_campaign: '',
      utm_term: '',
      utm_content: '',
      fromStoreFront: true,
    };
    if (!!customerId) cartobj.customerId = parseInt(customerId);

    // console.log("cartobj>>>", cartobj);
    try {
      const response = await this.http
        .post(
          ConfigServiceService.getBaseNewUrl() +
            '/shop_carts/' +
            this.refCompanyId +
            '/loadCartProductFormSavedCart',
          cartobj
        )
        .toPromise();
      // console.log("response getsavedcartbyid", response);
      return await response;
    } catch (error) {
      // console.log("error", error);
      return await error;
    }
  }

  async clearCart(
    cartId,
    sessionId,
    userId,
    utm_source,
    utm_medium,
    utm_campaign,
    utm_term,
    utm_content
  ) {
    try {
      const response = await this.http
        .delete(
          ConfigServiceService.getBaseNewUrl() +
            '/shop_cartProducts/removeCartProduct',
          {
            params: {
              id: this.refCompanyId,
              cartId: cartId,
              //PvID: productId,
              sessionID: sessionId,
              userId: userId,
              utm_source: utm_source,
              utm_medium: utm_medium,
              utm_campaign: utm_campaign,
              utm_term: utm_term,
              utm_content: utm_content,
              allProduct: 'true',
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

  async exportCart(cartId, email, urlToPass, userId, msg = '') {
    let cartObj = {
      refCompanyId: this.refCompanyId,
      id: this.refCompanyId,
      cartId: parseInt(cartId),
      email: email,
      url: urlToPass,
      userId: userId,
      msg: msg,
    };
    try {
      const response = await this.http
        .post(
          ConfigServiceService.getBaseNewUrl() +
            '/shop_carts/' +
            this.refCompanyId +
            '/exportCsv',
          cartObj
        )
        .toPromise();
      return await response;
    } catch (error) {
      return await error;
    }
  }

  async SaveCart(name, customerId, cartId) {
    let cartObj = {
      refCompanyId: this.refCompanyId,
      id: this.refCompanyId,
      userId: parseInt(customerId),
      cartId: parseInt(cartId),
      name: name,
    };
    try {
      const response = await this.http
        .post(
          ConfigServiceService.getBaseNewUrl() +
            '/shop_saved_carts/' +
            this.refCompanyId +
            '/SaveCart',
          cartObj
        )
        .toPromise();
      // console.log("response SaveCart", response);
      return await response;
    } catch (error) {
      // console.log("error", error);
      return await error;
    }
  }

  async exportCartExcel(cartId, urlToPass) {
    let cartObj = {
      refCompanyId: this.refCompanyId,
      id: this.refCompanyId,
      cartId: parseInt(cartId),
      url: urlToPass,
    };
    try {
      const response = await this.http
        .post(
          ConfigServiceService.getBaseNewUrl() +
            '/shop_carts/' +
            this.refCompanyId +
            '/exportCsv',
          cartObj
        )
        .toPromise();
      // console.log("response SaveCart", response);
      return await response;
    } catch (error) {
      // console.log("error", error);
      return await error;
    }
  }

  async orderCart(
    userId,
    addressId,
    paymentMode,
    shipMode,
    sessionId,
    clientRemark,
    memoDays,
    bookName,
    shipmentType = null,
    pickuptime = '',
    orderNo: any = false,
    collectiveValue: any = 0
  ) {
    // if(memoDays){
    //   memoDays = memoDays.toString()
    // }
    try {
      let utm_source, utm_medium, utm_campaign, utm_term, utm_content;

      let sParams = await this._companyService.getSearchParameters();
      if (sParams) {
        if (sParams.has('utm_source')) {
          utm_source = sParams.get('utm_source');
        }
        if (sParams.has('utm_medium')) {
          utm_medium = sParams.get('utm_medium');
        }
        if (sParams.has('utm_campaign')) {
          utm_campaign = sParams.get('utm_campaign');
        }
        if (sParams.has('utm_term')) {
          utm_term = sParams.get('utm_term');
        }
        if (sParams.has('utm_content')) {
          utm_content = sParams.get('utm_content');
        }
      }

      this.headers = await this.configService.getAPIHeader();
      const response = await this.http
        .post(
          ConfigServiceService.getBaseNewUrl() + '/shop_orders/createOrder',
          {
            id: this.refCompanyId,
            customerId: userId,
            addressId: addressId,
            paymentMode: paymentMode,
            shipMode: shipMode,
            utm_source: utm_source,
            utm_medium: utm_medium,
            utm_campaign: utm_campaign,
            utm_term: utm_term,
            utm_content: utm_content,
            sessionId: sessionId,
            clientRemark: clientRemark,
            memoDays: !!memoDays ? memoDays.toString() : '',
            bookName: bookName,
            shipmentType: shipmentType,
            pickuptime: pickuptime,
            orderId: orderNo,
            collectiveValue: collectiveValue,
          },
          { headers: new HttpHeaders(this.headers) }
        )
        .toPromise();

      // console.log("response orderCart", response);
      return await response;
    } catch (error) {
      // console.log("error", error);
      return await error;
    }
  }

  async orderForCustomer(
    custId,
    addressId,
    userId,
    paymentMode,
    shipMode,
    sessionId,
    clientRemark,
    shipmentType = null,
    pickuptime = null
  ) {
    // console.log("custId, addressId, userId", custId, addressId, userId);
    try {
      let utm_source, utm_medium, utm_campaign, utm_term, utm_content;

      let sParams = await this._companyService.getSearchParameters();
      if (sParams) {
        if (sParams.has('utm_source')) {
          utm_source = sParams.get('utm_source');
        }
        if (sParams.has('utm_medium')) {
          utm_medium = sParams.get('utm_medium');
        }
        if (sParams.has('utm_campaign')) {
          utm_campaign = sParams.get('utm_campaign');
        }
        if (sParams.has('utm_term')) {
          utm_term = sParams.get('utm_term');
        }
        if (sParams.has('utm_content')) {
          utm_content = sParams.get('utm_content');
        }
      }

      this.headers = await this.configService.getAPIHeader();
      const response = await this.http
        .post(
          ConfigServiceService.getBaseNewUrl() + '/shop_orders/createOrder',
          {
            id: this.refCompanyId,
            customerId: custId,
            addressId: addressId,
            userId: userId,
            paymentMode: paymentMode,
            shipMode: shipMode,
            utm_source: utm_source,
            utm_medium: utm_medium,
            utm_campaign: utm_campaign,
            utm_term: utm_term,
            utm_content: utm_content,
            sessionId: sessionId,
            clientRemark: clientRemark,
            shipmentType: shipmentType,
            pickuptime: pickuptime,
          },
          { headers: new HttpHeaders(this.headers) }
        )
        .toPromise();
      // console.log("response orderForCustomer", response);
      return await response;
    } catch (error) {
      // console.log("error", error);
      return await error;
    }
  }
}
