import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Storage } from '@ionic/storage-angular';
import { ConfigServiceService } from '../../config-service.service';
import { CompanyService } from '../../company/company.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class FunctionsService {
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

  async updateCartQtyDetails(cartId, productId, quantity, cartProductId) {
    try {
      const response = await this.http
        .put(
          ConfigServiceService.getBaseNewUrl() +
            '/shop_cartProducts/updateProductQuantity',
          {
            id: this.refCompanyId,
            cartId: cartId,
            cartDetail: {
              PvID: productId,
              quantity: quantity,
              cartProductId: cartProductId,
            },
          }
        )
        .toPromise();
      // console.log("response updateCartQtyDetails", response);
      return await response;
    } catch (error) {
      // console.log("error", error);
      return await error;
    }
  }

  async removeCartProduct(cartId, cartProductId, sessionId, userId) {
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

      const response = await this.http
        .delete(
          ConfigServiceService.getBaseNewUrl() +
            '/shop_cartProducts/removeCartProduct',
          {
            params: {
              id: this.refCompanyId,
              cartId: cartId,
              cartProductId: cartProductId,
              sessionID: sessionId,
              userId: userId,
              utm_source: utm_source,
              utm_medium: utm_medium,
              utm_campaign: utm_campaign,
              utm_term: utm_term,
              utm_content: utm_content,
              fromStoreFront: 'true',
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

  async removeMultipleProductFromCart(
    cartId,
    cartProductIds,
    sessionId,
    userId
  ) {
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

      const response = await this.http
        .delete(
          ConfigServiceService.getBaseNewUrl() +
            '/shop_cartProducts/removeMultipleProductFromCart',
          {
            params: {
              id: this.refCompanyId,
              cartId: cartId,
              cartProductIds: cartProductIds,
              sessionID: sessionId,
              userId: userId,
              utm_source: utm_source,
              utm_medium: utm_medium,
              utm_campaign: utm_campaign,
              utm_term: utm_term,
              utm_content: utm_content,
              fromStoreFront: 'true',
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

  async applySchemes(jsonObj) {
    try {
      this.headers = await this.configService.getAPIHeader();
      jsonObj.id = this.refCompanyId;
      const response = await this.http
        .post(
          ConfigServiceService.getBaseNewUrl() +
            '/shop_schemes/applySchemesByUserAndCartId',
          jsonObj,
          { headers: new HttpHeaders(this.headers) }
        )
        .toPromise();
      // console.log("response ", response);
      return await response;
    } catch (error) {
      // console.log("error", error);
      return await error;
    }
  }

  async addToPurchaseCart(customerId, sessionId, cartDetailList) {
    let cartObj = {
      id: this.refCompanyId,
      customerId: parseInt(customerId),
      cartDetailList: cartDetailList,
      sessionId: sessionId,
    };
    try {
      const response = await this.http
        .post(
          ConfigServiceService.getBaseNewUrl() +
            '/shop_carts/addToPurchaseCart',
          cartObj
        )
        .toPromise();
      console.log('response of purchase product', response);
      return await response;
    } catch (error) {
      // console.log("error", error);
      return await error;
    }
  }

  async addMultipleToCart(customerId, sessionId, cartDetailList, bookName) {
    let cartObj: any = {};
    if (
      customerId &&
      customerId != null &&
      customerId != undefined &&
      !isNaN(customerId)
    ) {
      cartObj = {
        id: this.refCompanyId,
        customerId: parseInt(customerId),
        cartDetailList: cartDetailList,
        bookName: bookName,
      };
    } else {
      cartObj = {
        id: this.refCompanyId,
        sessionId: sessionId,
        cartDetailList: cartDetailList,
        bookName: bookName,
      };
    }
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
      cartObj.cartDetailList = cartDetailList.map(keys => {
        return {
          ...keys,
          discount: keys.discount || 0,
          utm_source: utm_source,
          utm_medium: utm_medium,
          utm_campaign: utm_campaign,
          utm_term: utm_term,
          utm_content: utm_content,
        };
      });
      const response = await this.http
        .post(
          ConfigServiceService.getBaseNewUrl() +
            '/shop_carts/addMultipleToCart',
          cartObj
        )
        .toPromise();
      // console.log("response buyProduct", response);
      return await response;
    } catch (error) {
      // console.log("error", error);
      return await error;
    }
  }

  async updateMultipleToCart(customerId, sessionId, cartDetailList, bookName) {
    let cartObj = {
      id: this.refCompanyId,
      customerId: parseInt(customerId),
      sessionId: sessionId,
      cartDetailList: cartDetailList,
      bookName: bookName,
    };

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
    cartObj.cartDetailList = cartDetailList.map(keys => {
      return {
        ...keys,
        utm_source: utm_source,
        utm_medium: utm_medium,
        utm_campaign: utm_campaign,
        utm_term: utm_term,
        utm_content: utm_content,
      };
    });
    try {
      const response = await this.http
        .post(
          ConfigServiceService.getBaseNewUrl() +
            '/shop_carts/replaceMultipleToCart',
          cartObj
        )
        .toPromise();
      // console.log("response buyProduct", response);
      return await response;
    } catch (error) {
      // console.log("error", error);
      return await error;
    }
  }

  async createOrderForLattice(
    customerId,
    sessionId,
    bookName,
    selectedObj,
    extra
  ) {
    let obj = {
      id: this.refCompanyId,
      customerId: customerId,
      referenceNo: '',
      bookName: bookName,
      updateObj: selectedObj,
      extra: extra,
    };
    // console.log(obj);
    this.headers = await this.configService.getAPIHeader();
    try {
      const response = await this.http
        .post(
          ConfigServiceService.getBaseNewUrl() +
            '/shop_orders/' +
            this.refCompanyId +
            '/createOrderForLattice',
          obj,
          { headers: new HttpHeaders(this.headers) }
        )
        .toPromise();
      // console.log("response ", response);
      return await response;
    } catch (error) {
      // console.log("error", error);
      return await error;
    }
  }
}
