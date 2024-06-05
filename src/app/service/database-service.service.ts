import { Injectable, EventEmitter, Output } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigServiceService } from '../service/config-service.service';
import { Storage } from '@ionic/storage-angular';
import { LoadingController, Platform } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { TranslateConfigService } from './translate-config-service.service';
import { TranslateService } from '@ngx-translate/core';
@Injectable({
  providedIn: 'root',
})
export class DatabaseServiceService {
  public tkn: any;
  public refCompanyId: any = environment.refCompanyId;
  public headers: any;
  public accessToken: any;
  public cartObj: any;
  public searchListSelected = [];
  public loader: any;
  public companyName: any;
  public hideCustomerTagInProductDetail = true;
  public loggedInUser: any;
  @Output() searchQueryEvent = new EventEmitter<any>();

  addQuery(obj: any) {
    console.log(obj);
    this.searchQueryEvent.emit(obj);
  }
  private _loading = new BehaviorSubject<boolean>(false);
  public readonly loading$ = this._loading.asObservable();

  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public http: HttpClient,
    public storage: Storage,
    public configService: ConfigServiceService,
    public platform: Platform,
    public translator: TranslateConfigService,
    public translateService: TranslateService
  ) {
    this.getHeaders();
    this.companyName = this.configService.getAppName();
    if (!this.refCompanyId) {
      this.getCompanyByName(this.configService.getAppName());
    }
    this.getCompanyId();
  }
  ionViewDidEnter() {
    this.getCompanyId();
  }

  showSpinner() {
    this._loading.next(true);
  }
  hideSpinner() {
    this._loading.next(false);
  }

  async showLoading() {
    // if (this.platform.is("desktop")) {
    //   this.loader = await this.loadingCtrl.create({
    //     cssClass: 'custom-loader',
    //     spinner: null, // Hide the default spinner
    //     message: `
    //     <div class="custom-spinner">
    //       <img src="assets/icon/website - Loader.gif" alt="Custom Loader" />
    //     </div>
    //   `,
    //   });
    // } else {
    //   this.loader = await this.loadingCtrl.create({
    //     message: "Please wait...",
    //     spinner: "crescent",
    //   });
    // }
    this.translator.getCurrentLang();
    let msg = 'Please wait...';
    let loadMsg = await this.translateService.get(msg).toPromise();

    this.loader = await this.loadingCtrl.create({
      message: loadMsg,
      spinner: 'crescent',
    });
    return await this.loader.present();
  }

  async hideLoading() {
    return await this.loader.dismiss();
  }

  async getHeaders() {
    this.headers = await this.configService.getAPIHeader();
  }

  async getCompanyId() {
    // this.storage.get("refCompanyId").then(refCompanyId => {
    //   this.refCompanyId = refCompanyId;
    //   // console.log("refCompanyId", refCompanyId);
    //   return refCompanyId;
    // });
    let id = await this.storage.get('refCompanyId');
    if (!!id && id != undefined) {
      if (!!environment.refCompanyId) {
        this.refCompanyId = environment.refCompanyId;
        await this.storage.set('refCompanyId', this.refCompanyId);
      } else {
        this.refCompanyId = id;
      }
    }
    return id;
  }

  async getCompanyByName(name: any) {
    try {
      const response = await this.http
        .get(
          ConfigServiceService.getBaseNewUrl() +
            '/companies/getIdByCompanyName?name=' +
            name
        )
        .toPromise();
      let Response: any = await response;

      if (Response.isSuccess) {
        this.refCompanyId = Response.data.id;
      }
      return await Response;
    } catch (error) {
      return await error;
    }
  }
  async getPageDetailById() {
    try {
      const response = await this.http
        .get(
          ConfigServiceService.getBaseNewUrl() +
            '/shop_pages/getPageDetailById?id=' +
            this.refCompanyId
        )
        .toPromise();
      return await response;
    } catch (error) {
      return await error;
    }
  }

  // public getCustomerContactDetails(userId): any {
  //   return new Promise((resolve, reject) => {
  //     return this.http
  //       .get(ConfigServiceService.getBaseNewUrl() + "/shop_customerContacts/getCustomerContactDetailById?id=" + this.refCompanyId + "&userId=" + userId)
  //       .toPromise()
  //       .then(response => {
  //         resolve(response);
  //       })
  //       .catch((errorRes: Response) => {
  //         reject(errorRes);
  //       });
  //   });
  // }
  async getCustomerContactDetails(userId: any) {
    try {
      this.headers = await this.configService.getAPIHeader();
      const response = await this.http
        .get(
          ConfigServiceService.getBaseNewUrl() +
            '/shop_customerContacts/getCustomerContactDetailById?id=' +
            this.refCompanyId +
            '&userId=' +
            userId,
          { headers: new HttpHeaders(this.headers) }
        )
        .toPromise();
      return await response;
    } catch (error) {
      return await error;
    }
  }

  async getCartDetails(userId: any, sessionId: any) {
    let url = '';
    if (
      userId &&
      userId != null &&
      userId != undefined &&
      !Number.isNaN(userId)
    ) {
      url = '&customerId=' + userId;
    } else {
      url = '&sessionId=' + sessionId;
    }
    if (!this.refCompanyId) {
      this.refCompanyId = await this.getCompanyId();
    }

    try {
      if (!!this.refCompanyId && this.refCompanyId != undefined) {
        const response = await this.http
          .get(
            ConfigServiceService.getBaseNewUrl() +
              '/shop_carts/getCartDetailById?id=' +
              this.refCompanyId +
              url
          )
          .toPromise();
        return await response;
      } else {
        return {};
      }
    } catch (error) {
      return await error;
    }
  }

  async updateCartDetails(cartId: any, productId: any, quantity: any) {
    try {
      const response = await this.http
        .post(
          ConfigServiceService.getBaseNewUrl() +
            '/shop_cartProducts/updateCart',
          {
            id: this.refCompanyId,
            cartId: cartId,
            cartDetail: { PvID: productId, quantity: quantity },
          }
        )
        .toPromise();
      return await response;
    } catch (error) {
      return await error;
    }
  }

  async getCustomerAddress(userId: any) {
    try {
      this.headers = await this.configService.getAPIHeader();
      const response = await this.http
        .get(
          ConfigServiceService.getBaseNewUrl() +
            '/shop_customerContacts/getCustomerContactDetailById?id=' +
            this.refCompanyId +
            '&userId=' +
            userId,
          { headers: new HttpHeaders(this.headers) }
        )
        .toPromise();
      return await response;
    } catch (error) {
      return await error;
    }
    // return new Promise((resolve, reject) => {
    //   return this.http
    //     .get(ConfigServiceService.getBaseNewUrl() + "/shop_customerContacts/getCustomerContactDetailById?id=" + this.refCompanyId + "&userId=" + userId)
    //     .toPromise()
    //     .then(response => {
    //       resolve(response);
    //     })
    //     .catch((errorRes: Response) => {
    //       reject(errorRes);
    //     });
    // });
  }

  async getCustomerOrders(userId: any) {
    try {
      this.headers = await this.configService.getAPIHeader();
      const response = await this.http
        .get(
          ConfigServiceService.getBaseNewUrl() +
            '/shop_orders/getOrderDetail?id=' +
            this.refCompanyId +
            '&CcId=' +
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
    // return new Promise((resolve, reject) => {
    //   return this.http
    //     .get(ConfigServiceService.getBaseNewUrl() + "/shop_orders/getOrderDetail?id=" + this.refCompanyId + "&CcId=" + userId)
    //     .toPromise()
    //     .then(response => {
    //       resolve(response);
    //     })
    //     .catch((errorRes: Response) => {
    //       reject(errorRes);
    //     });
    // });
  }

  async getCustomerOrdersByPagination(
    userId: any,
    offset: any,
    limit: any,
    serach: any,
    status: any,
    bookName: any,
    variant: any,
    shipment: any,
    images: any,
    dealerMobile = ''
  ) {
    try {
      this.headers = await this.configService.getAPIHeader();
      const response = await this.http
        .get(
          ConfigServiceService.getBaseNewUrl() +
            '/shop_orders/getOrderDetailByPagination?id=' +
            this.refCompanyId +
            '&CcId=' +
            userId +
            '&bookName=' +
            bookName +
            '&offset=' +
            offset +
            '&limit=' +
            limit +
            '&status=' +
            status +
            '&search=' +
            serach +
            '&variant=' +
            variant +
            '&shipment=' +
            shipment +
            '&images=' +
            images +
            '&dealerMobile=' +
            dealerMobile,
          { headers: new HttpHeaders(this.headers) }
        )
        .toPromise();
      // console.log("response getCustomerOrders", response);
      return await response;
    } catch (error) {
      // console.log("error", error);
      return await error;
    }
    // return new Promise((resolve, reject) => {
    //   return this.http
    //     .get(ConfigServiceService.getBaseNewUrl() + "/shop_orders/getOrderDetail?id=" + this.refCompanyId + "&CcId=" + userId)
    //     .toPromise()
    //     .then(response => {
    //       resolve(response);
    //     })
    //     .catch((errorRes: Response) => {
    //       reject(errorRes);
    //     });
    // });
  }

  async createCustomer(jsonObj: any) {
    try {
      this.headers = await this.configService.getAPIHeader();
      const response = await this.http
        .post(
          ConfigServiceService.getBaseNewUrl() +
            '/shop_customers/createCustomer',
          jsonObj,
          {
            headers: new HttpHeaders(this.headers),
          }
        )
        .toPromise();
      return await response;
    } catch (error) {
      return await error;
    }
  }

  async checkSingleParentCustomer(
    refCompanyId: any,
    refCustomerId: any,
    refParentCustomerId: any
  ) {
    try {
      this.headers = await this.configService.getAPIHeader();
      const response = await this.http
        .get(
          ConfigServiceService.getBaseNewUrl() +
            '/shop_parentcustomermappings/checkSingleParentCustomer?id=' +
            refCompanyId +
            '&refCustomerId=' +
            refCustomerId +
            '&refParentCustomerId=' +
            refParentCustomerId,
          { headers: new HttpHeaders(this.headers) }
        )
        .toPromise();
      return await response;
    } catch (error) {
      return await error;
    }
  }

  async setParentCustomer(
    refCompanyId: any,
    refCustomerId: any,
    refParentCustomerId: any
  ) {
    try {
      this.headers = await this.configService.getAPIHeader();
      const response = await this.http
        .get(
          ConfigServiceService.getBaseNewUrl() +
            '/shop_parentcustomermappings/setParentCustomer?id=' +
            refCompanyId +
            '&refCustomerId=' +
            refCustomerId +
            '&refParentCustomerId=' +
            refParentCustomerId,
          { headers: new HttpHeaders(this.headers) }
        )
        .toPromise();
      return await response;
    } catch (error) {
      return await error;
    }
  }

  async updateCustomer(jsonObj: any) {
    try {
      this.headers = await this.configService.getAPIHeader();
      const response = await this.http
        .put(
          ConfigServiceService.getBaseNewUrl() +
            '/shop_customers/updateCustomer',
          jsonObj,
          {
            headers: new HttpHeaders(this.headers),
          }
        )
        .toPromise();
      return await response;
    } catch (error) {
      return await error;
    }
  }

  async getAllDesignation(id: any) {
    try {
      this.headers = await this.configService.getAPIHeader();
      const response = await this.http
        .get(
          ConfigServiceService.getBaseNewUrl() +
            '/designations/' +
            id +
            '/getAllDesignation'
        )
        .toPromise();
      return await response;
    } catch (error) {
      return await error;
    }
  }

  async updateCustomerContact(jsonObj: any) {
    try {
      this.headers = await this.configService.getAPIHeader();
      const response = await this.http
        .put(
          ConfigServiceService.getBaseNewUrl() +
            '/shop_customerContacts/updateCustomerContact',
          jsonObj,
          { headers: new HttpHeaders(this.headers) }
        )
        .toPromise();
      return await response;
    } catch (error) {
      return await error;
    }
  }

  async createCustomerContact(jsonObj: any) {
    try {
      this.headers = await this.configService.getAPIHeader();
      const response = await this.http
        .post(
          ConfigServiceService.getBaseNewUrl() +
            '/shop_customerContacts/createCustomerContact',
          jsonObj,
          { headers: new HttpHeaders(this.headers) }
        )
        .toPromise();
      return await response;
    } catch (error) {
      return await error;
    }
  }

  async getAddress(addObj: any) {
    try {
      this.headers = await this.configService.getAPIHeader();
      const response = await this.http
        .post(
          ConfigServiceService.getBaseNewUrl() +
            '/shop_customerAddresses/getCustomerAddress',
          addObj,
          { headers: new HttpHeaders(this.headers) }
        )
        .toPromise();
      return await response;
    } catch (error) {
      return await error;
    }
  }

  async insertAddress(addObj: any) {
    try {
      this.headers = await this.configService.getAPIHeader();
      const response = await this.http
        .post(
          ConfigServiceService.getBaseNewUrl() +
            '/shop_customerAddresses/createCustomerAddress',
          addObj,
          { headers: new HttpHeaders(this.headers) }
        )
        .toPromise();
      return await response;
    } catch (error) {
      return await error;
    }
    // return new Promise((resolve, reject) => {
    //   return this.http
    //     .post(ConfigServiceService.getBaseNewUrl() + "/shop_customerAddresses/createCustomerAddress", addObj)
    //     .toPromise()
    //     .then(response => {
    //       resolve(response);
    //     })
    //     .catch((errorRes: Response) => {
    //       reject(errorRes);
    //     });
    // });
  }

  async buyProduct(
    customerId: any,
    sessionId: any,
    PvID: any,
    quantity: any,
    discount: any,
    taxes: any,
    utm_source: any,
    utm_medium: any,
    utm_campaign: any,
    utm_term: any,
    utm_content: any
  ) {
    if (
      customerId &&
      customerId != null &&
      customerId != undefined &&
      !isNaN(customerId)
    ) {
      this.cartObj = {
        id: this.refCompanyId,
        customerId: parseInt(customerId),
        cartDetail: {
          PvID: PvID,
          quantity: quantity,
          discount: discount,
          taxes: taxes,
          userId: parseInt(customerId),
          sessionId: sessionId,
          utm_source: utm_source,
          utm_medium: utm_medium,
          utm_campaign: utm_campaign,
          utm_term: utm_term,
          utm_content: utm_content,
        },
      };
    } else {
      this.cartObj = {
        id: this.refCompanyId,
        sessionId: sessionId,
        cartDetail: {
          PvID: PvID,
          quantity: quantity,
          discount: discount,
          taxes: taxes,
          userId: parseInt(customerId),
          sessionId: sessionId,
          utm_source: utm_source,
          utm_medium: utm_medium,
          utm_campaign: utm_campaign,
          utm_term: utm_term,
          utm_content: utm_content,
        },
      };
    }
    try {
      const response = await this.http
        .post(
          ConfigServiceService.getBaseNewUrl() + '/shop_carts/addToCart',
          this.cartObj
        )
        .toPromise();
      return await response;
    } catch (error) {
      return await error;
    }
  }

  async fetchChildCustomers(userId: any) {
    try {
      this.headers = await this.configService.getAPIHeader();
      const response = await this.http
        .get(
          ConfigServiceService.getBaseNewUrl() +
            '/shop_customers/getChildCustomers?refCompanyId=' +
            this.refCompanyId +
            '&userId=' +
            userId,
          { headers: new HttpHeaders(this.headers) }
        )
        .toPromise();
      return await response;
    } catch (error) {
      return await error;
    }
  }

  async getParentCustomers(userId: any) {
    try {
      this.headers = await this.configService.getAPIHeader();
      const response = await this.http
        .get(
          ConfigServiceService.getBaseNewUrl() +
            '/shop_customers/getParentCustomers?refCompanyId=' +
            this.refCompanyId +
            '&userId=' +
            userId,
          { headers: new HttpHeaders(this.headers) }
        )
        .toPromise();
      return await response;
    } catch (error) {
      return await error;
    }
  }

  async fetchAddress(userId: any) {
    try {
      this.headers = await this.configService.getAPIHeader();
      const response = await this.http
        .get(
          ConfigServiceService.getBaseNewUrl() +
            '/shop_customerContacts/getCustomerContactDetailById?id=' +
            this.refCompanyId +
            '&userId=' +
            userId,
          { headers: new HttpHeaders(this.headers) }
        )
        .toPromise();
      return await response;
    } catch (error) {
      return await error;
    }
    // return new Promise((resolve, reject) => {
    //   return this.http
    //     .get(ConfigServiceService.getBaseNewUrl() + "/shop_customerContacts/getCustomerContactDetailById?id=" + this.refCompanyId + "&userId=" + userId)
    //     .toPromise()
    //     .then(response => {
    //       resolve(response);
    //     })
    //     .catch((errorRes: Response) => {
    //       reject(errorRes);
    //     });
    // });
  }

  async userUpload(formData: any) {
    try {
      this.headers = await this.configService.getAPIHeader();
      let response = await this.http
        .post(ConfigServiceService.getBaseNewUrl() + '/upload', formData, {
          headers: new HttpHeaders(this.headers),
        })
        .toPromise();
      console.log('------', response);
      return await response;
    } catch (error) {
      console.log('error', error);
      return await error;
    }
  }

  async commonFileUpload(formData: any) {
    formData.append('selectedCompanyId', this.refCompanyId);
    console.log(ConfigServiceService.getBaseNewUrl());
    try {
      let token = await this.storage.get(this.configService.TOKEN_KEY);
      let headers = {
        Authorization: await this.storage.get(this.configService.TOKEN_KEY),
      };
      console.log(token);
      let response = await this.http
        .post(
          ConfigServiceService.getBaseNewUrl() +
            '/users/' +
            this.refCompanyId +
            '/updateUserProfileWithAttechment',
          formData,
          { headers: new HttpHeaders(headers) }
        )
        .toPromise();
      console.log('------', response);
      return await response;
    } catch (error) {
      console.log('error', error);
      return await error;
    }
  }

  async updateAddress(addObj: any) {
    try {
      this.headers = await this.configService.getAPIHeader();
      const response = await this.http
        .put(
          ConfigServiceService.getBaseNewUrl() +
            '/shop_customerAddresses/updateCustomerAddress',
          addObj,
          { headers: new HttpHeaders(this.headers) }
        )
        .toPromise();
      return await response;
    } catch (error) {
      return await error;
    }
    // return new Promise((resolve, reject) => {
    //   addObj.id = this.refCompanyId;
    //   return this.http
    //     .put(ConfigServiceService.getBaseNewUrl() + "/shop_customerAddresses/updateCustomerAddress", addObj)
    //     .toPromise()
    //     .then(response => {
    //       resolve(response);
    //     })
    //     .catch((errorRes: Response) => {
    //       reject(errorRes);
    //     });
    // });
  }
  async authenticateUserWithTalkBrite(fbAccessToken: any, userNumber: any) {
    try {
      const response = await this.http
        .get(
          ConfigServiceService.getBaseNewUrl() +
            '/users/verifyUser?id=' +
            this.refCompanyId +
            '&accessToken=' +
            fbAccessToken +
            '&username=' +
            userNumber
        )
        .toPromise();
      return await response;
    } catch (error) {
      return await error;
    }
  }

  async setCartForCustomer(customerId: any, sessionId: any) {
    try {
      this.headers = await this.configService.getAPIHeader();
      const response = await this.http
        .get(
          ConfigServiceService.getBaseNewUrl() +
            '/shop_carts/setCartForCustomer?id=' +
            this.refCompanyId +
            '&customerId=' +
            customerId +
            '&sessionId=' +
            sessionId,
          { headers: new HttpHeaders(this.headers) }
        )
        .toPromise();
      return await response;
    } catch (error) {
      return await error;
    }
  }

  async updateUserProfile(updateObj: any) {
    updateObj.id = this.refCompanyId;
    //updateObj.kycSubmitted = true
    try {
      this.headers = await this.configService.getAPIHeader();
      const response = await this.http
        .put(
          ConfigServiceService.getBaseNewUrl() +
            '/shop_customerContacts/updateCustomerContactFromApp',
          updateObj,
          { headers: new HttpHeaders(this.headers) }
        )
        .toPromise();
      //await this.storage.set("userKYCSubmitted", true);
      return await response;
    } catch (error) {
      return await error;
    }
  }

  async sendDistributorEmail(object: any) {
    if (this.refCompanyId) {
      object['refCompanyId'] = this.refCompanyId;
    }
    try {
      this.headers = await this.configService.getAPIHeader();
      const response = await this.http
        .post(
          ConfigServiceService.getBaseNewUrl() + '/users/sendDistributorEmail',
          object,
          { headers: new HttpHeaders(this.headers) }
        )
        .toPromise();
      return await response;
    } catch (error) {
      return await error;
    }
  }

  async imageUpload(req: any) {
    try {
      this.headers = await this.configService.getAPIHeader();
      let token = await this.storage.get(this.configService.TOKEN_KEY);
      const response = await this.http
        .post(
          ConfigServiceService.getBaseNewUrl() + '/users/updateUserImage',
          req,
          { headers: new HttpHeaders(this.headers) }
        )
        .toPromise();
      return await response;
    } catch (error) {
      return await error;
    }
  }

  async fetchCustomer() {
    try {
      this.headers = await this.configService.getAPIHeader();
      const response = await this.http
        .get(
          ConfigServiceService.getBaseNewUrl() +
            '/shop_customers/getAllCustomer?id=' +
            this.refCompanyId,
          { headers: new HttpHeaders(this.headers) }
        )
        .toPromise();
      return await response;
    } catch (error) {
      return await error;
    }
  }

  async fetchCustomerByPageination(offset: any, limit: any, serachText: any) {
    try {
      this.headers = await this.configService.getAPIHeader();
      const response = await this.http
        .get(
          ConfigServiceService.getBaseNewUrl() +
            '/shop_customers/getAllCustomerByPagination?id=' +
            this.refCompanyId +
            '&offset=' +
            offset +
            '&limit=' +
            limit +
            '&search=' +
            serachText,
          { headers: new HttpHeaders(this.headers) }
        )
        .toPromise();
      return await response;
    } catch (error) {
      return await error;
    }
  }
  async fetchCustomerContact(customerID: any) {
    try {
      this.headers = await this.configService.getAPIHeader();
      const response = await this.http
        .get(
          ConfigServiceService.getBaseNewUrl() +
            '/shop_customerContacts/getAllCustomerContactById?id=' +
            this.refCompanyId +
            '&customerID=' +
            customerID,
          { headers: new HttpHeaders(this.headers) }
        )
        .toPromise();
      return await response;
    } catch (error) {
      return await error;
    }
  }

  async getAllProducts(offset: any, limit: any, serachText: any) {
    try {
      const response = await this.http
        .get(
          ConfigServiceService.getBaseNewUrl() +
            '/shop_products/getAllProductByPagination?id=' +
            this.refCompanyId +
            '&offset=' +
            offset +
            '&limit=' +
            limit +
            '&search=' +
            serachText
        )
        .toPromise();
      return await response;
    } catch (error) {
      return await error;
    }
  }

  async getAreaByPinCode(pinCode: any) {
    try {
      const response = await this.http
        .get(
          ConfigServiceService.getBaseNewUrl() +
            '/shop_customers/getAllAreaDetailByPinCode?pinCode=' +
            pinCode
        )
        .toPromise();
      return await response;
    } catch (error) {
      return await error;
    }
  }

  async userLoginForDesktop(userName: any, passWord: any) {
    try {
      const response = await this.http
        .post(ConfigServiceService.getBaseNewUrl() + '/users/userLogin', {
          id: this.refCompanyId,
          username: userName,
          password: passWord,
        })
        .toPromise();
      return await response;
    } catch (error) {
      return await error;
    }
  }

  async getDiscount(custId: any, userId: any) {
    try {
      this.headers = await this.configService.getAPIHeader();
      const response = await this.http
        .put(
          ConfigServiceService.getBaseNewUrl() +
            '/shop_cartProducts/updateProductDiscount',
          { id: this.refCompanyId, customerId: custId, userId: userId },
          { headers: new HttpHeaders(this.headers) }
        )
        .toPromise();
      return await response;
    } catch (error) {
      return await error;
    }
  }
  async getAllOrderDetailById(orderId: any) {
    try {
      const response = await this.http
        .get(
          ConfigServiceService.getBaseNewUrl() +
            '/shop_orders/getAllOrderDetailById?id=' +
            this.refCompanyId +
            '&orderId=' +
            orderId,
          { headers: new HttpHeaders(this.headers) }
        )
        .toPromise();
      return await response;
    } catch (error) {
      return await error;
    }
  }
  async getAllShipDetailByOrderId(orderId: any) {
    try {
      const response = await this.http
        .get(
          ConfigServiceService.getBaseNewUrl() +
            '/shop_shipments/getAllShipDetailByOrderId?id=' +
            this.refCompanyId +
            '&orderId=' +
            orderId,
          { headers: new HttpHeaders(this.headers) }
        )
        .toPromise();
      return await response;
    } catch (error) {
      return await error;
    }
  }
  // async getAllOrderDetailByIdAndPvID(orderId,pvID) {
  //   try {
  //     const response = await this.http
  //       .get(
  //         ConfigServiceService.getBaseNewUrl() +
  //         "/shop_orders/getAllOrderDetailByIdAndPvID?id=" +
  //         this.refCompanyId +
  //         "&orderId="+orderId +
  //         "&pvID=" +pvID ,{ headers: new HttpHeaders(this.headers) }
  //       )
  //       .toPromise();
  //     // console.log("response getAllOrderDetailByIdAndPvID", response);
  //     return await response;
  //   } catch (error) {
  //     // console.log("error", error);
  //     return await error;
  //   }
  // }

  async getPendingOrderDetailByOrderID(orderId: any) {
    try {
      const response = await this.http
        .get(
          ConfigServiceService.getBaseNewUrl() +
            '/shop_orders/getPendingOrderDetailByOrderID?id=' +
            this.refCompanyId +
            '&orderId=' +
            orderId,
          { headers: new HttpHeaders(this.headers) }
        )
        .toPromise();
      return await response;
    } catch (error) {
      return await error;
    }
  }

  async updatedMobileApp(refUserId: any, pushNotificationId: any) {
    try {
      const response = await this.http
        .post(
          ConfigServiceService.getBaseNewUrl() +
            '/company_application_mobileIds/addOrUpdateApplicationMobileId',
          {
            id: this.refCompanyId,
            pushNotificationId: pushNotificationId,
            refUserId: refUserId,
            applicationId: 2,
          }
        )
        .toPromise();
      return await response;
    } catch (error) {
      return await error;
    }
  }

  async createUser(mobile: any, password: any, isGuest = false) {
    try {
      const response = await this.http
        .post(
          ConfigServiceService.getBaseNewUrl() +
            '/shop_customerContacts/signUpUserForStoreFront',
          {
            companyName: this.companyName,
            mobile: mobile,
            password: password,
            guest: isGuest,
          }
        )
        .toPromise();
      return await response;
    } catch (error) {
      return await error;
    }
  }

  async capturePayment(paymentId: any, amount: any) {
    try {
      const response = await this.http
        .post(
          ConfigServiceService.getBaseNewUrl() + '/paymentInfos/capturePayment',
          { paymentId: paymentId, amount: amount }
        )
        .toPromise();
      return await response;
    } catch (error) {
      return await error;
    }
  }

  async paymentInfoInTalkbrite(paymentObj: any) {
    try {
      const response = await this.http
        .post(
          ConfigServiceService.getBaseNewUrl() +
            '/shop_paymentInfos/paymentInfoInTalkbrite',
          paymentObj
        )
        .toPromise();
      return await response;
    } catch (error) {
      return await error;
    }
  }
  async checkQuantityValidation(userId: any) {
    if (!this.refCompanyId) {
      this.refCompanyId = await this.getCompanyId();
    }
    try {
      const response = await this.http
        .get(
          ConfigServiceService.getBaseNewUrl() +
            '/shop_orders/checkQuantityValidation?id=' +
            this.refCompanyId +
            '&userId=' +
            userId
        )
        .toPromise();
      return await response;
    } catch (error) {
      return await error;
    }
  }

  public async LoginWithApp(obj: any) {
    try {
      obj.companyName = this.companyName;
      const response = await this.http
        .post(
          ConfigServiceService.getBaseNewUrl() + '/users/loginWithApp',
          obj,
          { headers: new HttpHeaders(this.headers) }
        )
        .toPromise();
      return await response;
    } catch (error) {
      return await error;
    }
  }

  public async loginWithConfirmation(obj: any) {
    try {
      obj.companyName = this.companyName;
      const response = await this.http
        .post(
          ConfigServiceService.getBaseNewUrl() + '/users/loginWithConfirmation',
          obj,
          { headers: new HttpHeaders(this.headers) }
        )
        .toPromise();
      return await response;
    } catch (error) {
      return await error;
    }
  }

  async checkUserKyc() {
    let KYCStatus = false;
    let userData = await this.storage.get('userData');
    let userId = await this.storage.get('userID');
    if (userId) {
      let res: any = await this.fetchAddress(userId);
      if (!!res.isSuccess) {
        if (res.data.length > 0) {
          let res: any = await this.getDiaUserProfile(userId);
          let para = JSON.parse(res.data.parameter);

          if (
            para &&
            para.general &&
            para.general.name &&
            para.userAccount &&
            para.userAccount.username &&
            para.userKYC &&
            para.userKYC.kyc.path
          ) {
            KYCStatus = true;
            // console.log("----", KYCStatus);
            let kycSubmitted = userData.kycSubmitted;
            if (userData && !kycSubmitted) {
              //update user kycstatus
              let userId = await this.storage.get('userID');
              let updateObj = {
                customerID: userId,
                username: userData.username.replace('+', ''),
                kycSubmitted: true,
              };
              await this.updateUserProfile(updateObj);
            }

            if (KYCStatus) {
              const distributorEmailSended = await this.storage.get(
                'distributorEmailSended'
              );
              if (
                para.userAccount &&
                para.userAccount.distributioncenter &&
                !para.userAccount.latticeApproved &&
                !kycSubmitted &&
                !userData?.KYCStatus &&
                !distributorEmailSended
              ) {
                let distributor = para.userAccount.distributioncenter;
                if (distributor) {
                  let obj = {
                    distributorId: distributor.id,
                    userId: userId,
                    userName: para.general.name,
                    companyName: para.company.name,
                  };
                  await this.storage.set('distributorEmailSended', true);
                  let d = await this.sendDistributorEmail(obj);
                }
              }
            }
          }

          if (!!userData && !!userData?.username) {
            let data: any = await this.checkUserExistByPhoneNo(
              userData.username.replace('+', '')
            );
            await this.storage.set('userData', data.data);
          }
        }
      }
    }
  }

  async checkUserExistByPhoneNo(phoneNo: any) {
    try {
      const response = await this.http
        .get(
          ConfigServiceService.getBaseNewUrl() +
            '/users/' +
            this.refCompanyId +
            '/findUserDetailsByPhoneNo?phoneNo=' +
            phoneNo,
          { headers: new HttpHeaders(this.headers) }
        )
        .toPromise();
      return await response;
    } catch (error) {
      return await error;
    }
  }

  async checkUserExistByEmail(email: any) {
    try {
      const response = await this.http
        .get(
          ConfigServiceService.getBaseNewUrl() +
            '/users/' +
            this.refCompanyId +
            '/findUserDetailsByEmail?email=' +
            email,
          { headers: new HttpHeaders(this.headers) }
        )
        .toPromise();
      return await response;
    } catch (error) {
      return await error;
    }
  }

  async getOTPCall(phoneNo: any) {
    try {
      const response = await this.http
        .post(ConfigServiceService.getBaseNewUrl() + '/users/getCall', {
          companyName: this.companyName,
          mobNumber: phoneNo,
        })
        .toPromise();
      return await response;
    } catch (error) {
      return await error;
    }
  }

  async checkDelivery(pincode: any) {
    try {
      const response = await this.http
        .get(
          'https://admin.atisundar.com/store/pincodeService?pincode=' + pincode,
          { headers: new HttpHeaders(this.headers) }
        )
        .toPromise();
      return await response;
    } catch (error) {
      return await error;
    }
  }

  async updatePassword(userName: any, newPassWord: any) {
    try {
      let jsonObj = {
        refCompanyId: this.refCompanyId,
        username: userName,
        password: newPassWord,
      };
      const response = await this.http
        .post(
          ConfigServiceService.getBaseNewUrl() + '/users/updatePassword',
          jsonObj,
          { headers: new HttpHeaders(this.headers) }
        )
        .toPromise();
      return await response;
    } catch (error) {
      return await error;
    }
  }

  async getOrderDetailByOrderId(orderId: any) {
    try {
      const response = await this.http
        .get(
          ConfigServiceService.getBaseNewUrl() +
            '/shop_orders/getOrderDetailByOrderId?orderID=' +
            orderId,
          { headers: new HttpHeaders(this.headers) }
        )
        .toPromise();
      return await response;
    } catch (error) {
      return await error;
    }
  }

  async getTicket(ticketNumber: any, user: any) {
    this.accessToken = await this.storage.get('talkBriteAccessToken');
    try {
      const response = await this.http
        .get(
          ConfigServiceService.getBaseNewUrl() +
            '/processTemplates/' +
            this.refCompanyId +
            '/getProcess?processId=' +
            ticketNumber +
            '&phoneNumber=' +
            user +
            '&accessToken=' +
            this.accessToken
        )
        .toPromise();
      return await response;
    } catch (error) {
      return await error;
    }
  }

  async getAllShippingMethod(selectedAddressType: any) {
    try {
      if (!this.refCompanyId) {
        this.refCompanyId = await this.getCompanyId();
      }
      this.headers = await this.configService.getAPIHeader();
      const response = await this.http
        .get(
          ConfigServiceService.getBaseNewUrl() +
            '/shop_shipping_methods/' +
            this.refCompanyId +
            '/getAllMethods?mode=' +
            selectedAddressType
        )
        .toPromise();
      return await response;
    } catch (error) {
      return await error;
    }
  }

  async findByShipModeAndCountry(shippingMethod: any, country: any) {
    try {
      this.headers = await this.configService.getAPIHeader();
      const response = await this.http
        .get(
          ConfigServiceService.getBaseNewUrl() +
            '/costsDefinitions/findByShipModeAndCountry?shippingMethod=' +
            shippingMethod +
            '&country=' +
            country +
            '&refCompanyId=' +
            this.refCompanyId
        )
        .toPromise();
      return await response;
    } catch (error) {
      return await error;
    }
  }

  async getAllSchemesByUser(refUserId: any, offset: any, limit: any) {
    try {
      this.headers = await this.configService.getAPIHeader();
      const response = await this.http
        .get(
          ConfigServiceService.getBaseNewUrl() +
            '/shop_schemes/getAllSchemesByUser?id=' +
            this.refCompanyId +
            '&offset=' +
            offset +
            '&limit=' +
            limit +
            '&refUserId=' +
            refUserId,
          { headers: new HttpHeaders(this.headers) }
        )
        .toPromise();
      return await response;
    } catch (error) {
      return await error;
    }
  }
  async getAllSchemesByUserAndProductId(refUserId: any, refProductId: any) {
    try {
      this.headers = await this.configService.getAPIHeader();
      const response = await this.http
        .get(
          ConfigServiceService.getBaseNewUrl() +
            '/shop_schemes/getAllSchemesByUserAndProductId?id=' +
            this.refCompanyId +
            '&refUserId=' +
            refUserId +
            '&refProductId=' +
            refProductId,
          { headers: new HttpHeaders(this.headers) }
        )
        .toPromise();
      return await response;
    } catch (error) {
      return await error;
    }
  }

  async getLatestShipment(refUserId: any, offset: any, limit: any) {
    try {
      this.headers = await this.configService.getAPIHeader();
      const response = await this.http
        .get(
          ConfigServiceService.getBaseNewUrl() +
            '/shop_shipments/getLatestShipment?id=' +
            this.refCompanyId +
            '&refUserId=' +
            refUserId +
            '&offset=' +
            offset +
            '&limit=' +
            limit,
          { headers: new HttpHeaders(this.headers) }
        )
        .toPromise();
      return await response;
    } catch (error) {
      return await error;
    }
  }
  async getShipmentDetailByShipId(refShipID: any) {
    try {
      this.headers = await this.configService.getAPIHeader();
      const response = await this.http
        .get(
          ConfigServiceService.getBaseNewUrl() +
            '/shop_shipments/getShipmentDetailByShipId?id=' +
            this.refCompanyId +
            '&refShipID=' +
            refShipID,
          { headers: new HttpHeaders(this.headers) }
        )
        .toPromise();
      return await response;
    } catch (error) {
      return await error;
    }
  }

  async getCards(
    userId: any,
    offset: any,
    limit: any,
    serach: any,
    status: any
  ) {
    try {
      this.headers = await this.configService.getAPIHeader();
      const response = await this.http
        .get(
          ConfigServiceService.getBaseNewUrl() +
            '/notificationCards/getCards?id=' +
            this.refCompanyId +
            '&CcId=' +
            userId +
            '&offset=' +
            offset +
            '&limit=' +
            limit +
            '&status=' +
            status +
            '&search=' +
            serach,
          { headers: new HttpHeaders(this.headers) }
        )
        .toPromise();
      return await response;
    } catch (error) {
      return await error;
    }
  }

  async cancelOrderProduct(jsonObj: any) {
    try {
      jsonObj.id = this.refCompanyId;
      const response = await this.http
        .post(
          ConfigServiceService.getBaseNewUrl() +
            '/shop_orderProducts/cancelOrderProduct',
          jsonObj,
          { headers: new HttpHeaders(this.headers) }
        )
        .toPromise();
      return await response;
    } catch (error) {
      return await error;
    }
  }

  async cancelAllOrderProduct(jsonObj: any) {
    try {
      jsonObj.id = this.refCompanyId;
      const response = await this.http
        .post(
          ConfigServiceService.getBaseNewUrl() +
            '/shop_orderProducts/cancelAllPendingOrderProducts',
          jsonObj,
          { headers: new HttpHeaders(this.headers) }
        )
        .toPromise();
      return await response;
    } catch (error) {
      return await error;
    }
  }

  async uploadFileOrder(jsonObj: any) {
    try {
      this.headers = {
        Authorization: await this.storage.get(this.configService.TOKEN_KEY),
      };
      jsonObj.id = this.refCompanyId;
      const response = await this.http
        .post(
          ConfigServiceService.getBaseNewUrl() +
            '/fileFormats/downloadExcelFile?id=' +
            jsonObj.id +
            '&fileFormatName=' +
            jsonObj.fileFormatName +
            '&userId=' +
            jsonObj.userId +
            '&contactId=' +
            jsonObj.contactId +
            '&shouldWait=' +
            jsonObj.shouldWait +
            '&shipmentMode=' +
            jsonObj.shipmentMode +
            '&paymentMode=' +
            jsonObj.paymentMode +
            '&addressId=' +
            jsonObj.addressId +
            '&referenceNo=' +
            jsonObj.referenceNo,
          jsonObj.formData,
          { headers: new HttpHeaders(this.headers) }
        )
        .toPromise();
      return await response;
    } catch (error) {
      return await error;
    }
  }

  async updateOffer(orderId: any, updateObj: any, extra: any) {
    let obj = {
      id: this.refCompanyId,
      orderId: orderId,
      updateObj: updateObj,
      extra: extra,
    };
    this.headers = await this.configService.getAPIHeader();
    try {
      const response = await this.http
        .post(
          ConfigServiceService.getBaseNewUrl() +
            '/shop_orders/' +
            this.refCompanyId +
            '/updateOfferPrice',
          obj,
          { headers: new HttpHeaders(this.headers) }
        )
        .toPromise();
      return await response;
    } catch (error) {
      return await error;
    }
  }

  async deleteSavedCartById(savedCartId: any, userId: any) {
    try {
      const response = await this.http
        .delete(
          ConfigServiceService.getBaseNewUrl() +
            '/shop_saved_carts/' +
            this.refCompanyId +
            '/removeSavedCart',
          {
            params: {
              id: this.refCompanyId,
              cartId: savedCartId,
              userId,
              refUserId: userId,
            },
          }
        )
        .toPromise();
      return await response;
    } catch (error) {
      return await error;
    }
  }

  async deleteOrder(objToPost: any) {
    try {
      this.headers = await this.configService.getAPIHeader();
      const response = await this.http
        .post(
          ConfigServiceService.getBaseNewUrl() +
            '/shop_orders/' +
            this.refCompanyId +
            '/deleteOrder',
          objToPost,
          { headers: new HttpHeaders(this.headers) }
        )
        .toPromise();
      return await response;
    } catch (error) {
      return await error;
    }
  }

  async emailOrderDetails(email: any, orderId: any, msg = '', userId: any) {
    this.cartObj = {
      refCompanyId: this.refCompanyId,
      id: this.refCompanyId,
      email: email,
      orderId: orderId,
      msg: msg,
      userId: userId,
    };

    try {
      const response = await this.http
        .post(
          ConfigServiceService.getBaseNewUrl() +
            '/shop_orders/' +
            this.refCompanyId +
            '/exportOrderProductsCsv',
          this.cartObj
        )
        .toPromise();
      return await response;
    } catch (error) {
      return await error;
    }
  }

  async emailOrder(email: any, orderIds: any, bookName: any) {
    this.cartObj = {
      refCompanyId: this.refCompanyId,
      id: this.refCompanyId,
      email: email,
      orderId: orderIds,
      bookName: bookName,
    };

    try {
      const response = await this.http
        .post(
          ConfigServiceService.getBaseNewUrl() +
            '/shop_orders/' +
            this.refCompanyId +
            '/exportOrderCsv',
          this.cartObj
        )
        .toPromise();
      return await response;
    } catch (error) {
      return await error;
    }
  }

  async updateDiaUserProfile(reqObj: any) {
    try {
      this.headers = await this.configService.getAPIHeader();

      const response = await this.http
        .post(
          ConfigServiceService.getBaseNewUrl() +
            '/users/' +
            this.refCompanyId +
            '/updateUserProfile',
          reqObj,
          { headers: new HttpHeaders(this.headers) }
        )
        .toPromise();
      return await response;
    } catch (error) {
      return await error;
    }
  }

  async getDiaUserProfile(userId: any) {
    try {
      this.headers = await this.configService.getAPIHeader();
      const response = await this.http
        .get(
          ConfigServiceService.getBaseNewUrl() +
            '/users/' +
            this.refCompanyId +
            '/getUserProfile?userId=' +
            parseInt(userId),
          { headers: new HttpHeaders(this.headers) }
        )
        .toPromise();
      return await response;
    } catch (error) {
      return await error;
    }
  }

  async getDistributors() {
    try {
      this.headers = await this.configService.getAPIHeader();
      const response = await this.http
        .get(
          ConfigServiceService.getBaseNewUrl() +
            '/shop_customers/' +
            this.refCompanyId +
            '/getDistributors',
          { headers: new HttpHeaders(this.headers) }
        )
        .toPromise();
      return await response;
    } catch (error) {
      return await error;
    }
  }

  async getSalesPersonsList() {
    let obj = {
      refCompanyId: this.refCompanyId,
    };

    console.log('user token inside api header');
    var header: any = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    try {
      const response = await this.http
        .post(
          ConfigServiceService.getBaseNewUrl() + '/users/getKgAllSalesPersons',
          obj,
          { headers: new HttpHeaders(header) }
        )
        .toPromise();
      return await response;
    } catch (error) {
      return await error;
    }
  }

  async findMatchWorkAreaUsers(userId: any, condition: any) {
    try {
      this.headers = await this.configService.getAPIHeader();
      const response = await this.http
        .get(
          ConfigServiceService.getBaseNewUrl() +
            '/users/' +
            this.refCompanyId +
            '/findMatchWorkAreaUsers?userId=' +
            userId +
            '&condition=' +
            condition,
          { headers: new HttpHeaders(this.headers) }
        )
        .toPromise();
      return await response;
    } catch (error) {
      return await error;
    }
  }

  async GuestLoginsCheck(token: any) {
    try {
      this.headers = await this.configService.getAPIHeader();
      const response = await this.http
        .get(
          ConfigServiceService.getBaseNewUrl() +
            '/users/checkGuestLogin?token=' +
            token,
          { headers: new HttpHeaders(this.headers) }
        )
        .toPromise();
      return await response;
    } catch (error) {
      return await error;
    }
  }

  async GuestLogin(reqObj: any) {
    try {
      this.headers = await this.configService.getAPIHeader();
      const response = await this.http
        .post(
          ConfigServiceService.getBaseNewUrl() +
            '/users/' +
            this.refCompanyId +
            '/GuestLogin',
          reqObj,
          { headers: new HttpHeaders(this.headers) }
        )
        .toPromise();
      return await response;
    } catch (error) {
      return await error;
    }
  }

  async updateOrderIdTicketNo(reqObj: any) {
    try {
      this.headers = await this.configService.getAPIHeader();
      const response = await this.http
        .put(
          ConfigServiceService.getBaseNewUrl() + '/shop_orders/updateTicketNo',
          reqObj,
          { headers: new HttpHeaders(this.headers) }
        )
        .toPromise();
      return await response;
    } catch (error) {
      return await error;
    }
  }

  async getProductVarinatDetails(productId: any, VariantId: any) {
    try {
      const response = await this.http
        .get(
          ConfigServiceService.getBaseNewUrl() +
            '/shop_productVariants/getProductVariantsDetailById?id=' +
            this.refCompanyId +
            '&productId=' +
            productId +
            '&PvID=' +
            VariantId,
          { headers: new HttpHeaders(this.headers) }
        )
        .toPromise();
      return await response;
    } catch (error) {
      return await error;
    }
  }

  async getPdParameters() {
    try {
      const response = await this.http
        .get(
          ConfigServiceService.getBaseNewUrl() +
            '/shop_products/getPdParametersFromLattice?id=' +
            this.refCompanyId
        )
        .toPromise();
      return await response;
    } catch (error) {
      return await error;
    }
  }

  async getResellers(pinCode: any) {
    try {
      const response = await this.http
        .get(
          ConfigServiceService.getBaseNewUrl() +
            '/shop_customers/getResellers?refCompanyId=' +
            this.refCompanyId +
            '&pinCode=' +
            pinCode
        )
        .toPromise();
      return await response;
    } catch (error) {
      return await error;
    }
  }
  async getResellersByCity(city: any) {
    try {
      const response = await this.http
        .get(
          ConfigServiceService.getBaseNewUrl() +
            '/shop_customers/getResellers?refCompanyId=' +
            this.refCompanyId +
            '&city=' +
            city
        )
        .toPromise();
      return await response;
    } catch (error) {
      return await error;
    }
  }
  numberOnlyValidation(event: any) {
    const pattern = /[0-9.,]/;
    let inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  async createInquiry(addObj: any, inqVia: any) {
    addObj.refCompanyId = this.refCompanyId;
    addObj.inqVia = inqVia;
    try {
      this.headers = await this.configService.getAPIHeader();
      const response = await this.http
        .post(
          ConfigServiceService.getBaseNewUrl() + '/shop_inquiries',
          addObj,
          { headers: new HttpHeaders(this.headers) }
        )
        .toPromise();
      return await response;
    } catch (error) {
      return await error;
    }
  }

  async createInquiries(addObj: any, inqVia: any) {
    addObj.refCompanyId = this.refCompanyId;
    addObj.inqVia = inqVia;
    try {
      this.headers = await this.configService.getAPIHeader();
      const response = await this.http
        .post(
          ConfigServiceService.getBaseNewUrl() +
            '/shop_inquiries/createInquiries',
          addObj,
          { headers: new HttpHeaders(this.headers) }
        )
        .toPromise();
      return await response;
    } catch (error) {
      return await error;
    }
  }

  async getUrlParameter(key: any) {
    let val: any = '';
    let url = document.URL;
    if (!!url) {
      let queryStringParams = url.split('?')[1];
      if (!!queryStringParams) {
        let searchParams = new URLSearchParams(queryStringParams);
        if (searchParams.has(key)) {
          val = searchParams.get(key);
        }
      }
    }
    return val;
  }

  async deleteOrEnableCustomer(customerId: any, isDeleted: any) {
    try {
      const response = await this.http
        .get(
          ConfigServiceService.getBaseNewUrl() +
            '/shop_customers/deleteOrEnableCustomer?id=' +
            this.refCompanyId +
            '&customerId=' +
            customerId +
            '&isDeleted=' +
            isDeleted,
          { headers: new HttpHeaders(this.headers) }
        )
        .toPromise();
      return await response;
    } catch (error) {
      return await error;
    }
  }

  async getInstagramPostData(url: any) {
    try {
      const response = await this.http
        .get('https://api.instagram.com/oembed?url=' + url + '/media?size=t')
        .toPromise();
      return await response;
    } catch (error) {
      return await error;
    }
  }
  async getUserInAllCompany(username: any) {
    try {
      const response = await this.http
        .get(
          ConfigServiceService.getBaseNewUrl() +
            '/users/getUserInAllCompany?username=' +
            username,
          { headers: new HttpHeaders(this.headers) }
        )
        .toPromise();
      return await response;
    } catch (error) {
      return await error;
    }
  }

  async deleteAccount(email: string, mobile: string, refCompanyId: number) {
    try {
      this.headers = await this.configService.getAPIHeader();
      const response = await this.http
        .delete(
          ConfigServiceService.getBaseNewUrl() +
            `/users/deleteAccount?email=${email}&mobile=${mobile}&refCompanyId=${refCompanyId}`,
          { headers: new HttpHeaders(this.headers) }
        )
        .toPromise();
      return await response;
    } catch (err) {
      console.log('error', err);
      return await err;
    }
  }

  async deleteUser(userID: any, deleteOrActivate: any) {
    try {
      this.headers = await this.configService.getAPIHeader();
      const response = await this.http
        .delete(
          ConfigServiceService.getBaseNewUrl() +
            '/users/deleteUser?id=' +
            this.refCompanyId +
            '&userID=' +
            userID +
            '&deleteOrActivate=' +
            deleteOrActivate,
          { headers: new HttpHeaders(this.headers) }
        )
        .toPromise();
      return await response;
    } catch (error) {
      console.log('error', error);
      return await error;
    }
  }

  async emptyCart(customerId: any, sessionId: any, bookName: any, bookId: any) {
    let qry = '?id=' + this.refCompanyId;
    if (!!customerId) {
      qry += '&customerId=' + customerId;
    }
    if (!!sessionId) {
      qry += '&sessionId=' + sessionId;
    }
    if (!!bookName) {
      qry += '&bookName=' + bookName;
    }
    if (!!bookId) {
      qry += '&bookId=' + bookId;
    }

    try {
      const response = await this.http
        .delete(
          ConfigServiceService.getBaseNewUrl() + '/shop_carts/emptyCart' + qry
        )
        .toPromise();
      return await response;
    } catch (error) {
      return await error;
    }
  }

  async getOrderIdByPublicId(publicId: any) {
    try {
      const response = await this.http
        .get(
          ConfigServiceService.getBaseNewUrl() +
            '/shop_orders/getOrderIdByPublicId?publicId=' +
            publicId,
          { headers: new HttpHeaders(this.headers) }
        )
        .toPromise();
      return await response;
    } catch (error) {
      return await error;
    }
  }

  async deleteCustomerAddress(companyId: any, addressId: any) {
    try {
      const response = await this.http
        .delete(
          ConfigServiceService.getBaseNewUrl() +
            '/shop_customerAddresses/deleteCustomerAddress?id=' +
            companyId +
            '&CaId=' +
            addressId,
          { headers: new HttpHeaders(this.headers) }
        )
        .toPromise();
      console.log('response deleteCustomerAddress', response);
      return await response;
    } catch (error) {
      console.log('error', error);
      return await error;
    }
  }

  async getSearchQuery(searchId: any) {
    try {
      const response = await this.http
        .get(
          ConfigServiceService.nodeServerUrl() +
            'fetchStonesBySearchId/' +
            searchId,
          { headers: new HttpHeaders(this.headers) }
        )
        .toPromise();
      return await response;
    } catch (error) {
      return await error;
    }
  }

  async postBookAppointment(formData: any) {
    try {
      this.headers = await this.configService.getAPIHeader();
      const response = await this.http
        .post(
          ConfigServiceService.getBaseNewUrl() + '/users/scheduleAppointment',
          formData,
          { headers: new HttpHeaders(this.headers) }
        )
        .toPromise();
      return await response;
    } catch (error) {
      return await error;
    }
  }

  async getCompanyDetails() {
    try {
      this.headers = await this.configService.getAPIHeader();
      const response = await this.http
        .get(
          ConfigServiceService.getBaseNewUrl() +
            '/companies/' +
            this.refCompanyId +
            '/validate',
          { headers: new HttpHeaders(this.headers) }
        )
        .toPromise();
      return await response;
    } catch (error) {
      return await error;
    }
  }

  async sendExcelViaEmailOfStones(payload: any) {
    try {
      this.headers = await this.configService.getAPIHeader();
      const response = await this.http
        .post(
          ConfigServiceService.getBaseNewUrl() + '/users/exportSearch',
          payload,
          { headers: new HttpHeaders(this.headers) }
        )
        .toPromise();
      return await response;
    } catch (error) {
      return await error;
    }
  }

  async getBannerInfo() {
    try {
      this.headers = await this.configService.getAPIHeader();
      const response = await this.http
        .get(
          ConfigServiceService.getBaseNewUrl() +
            '/companies/' +
            this.refCompanyId +
            '/getBannerInfo',
          { headers: new HttpHeaders(this.headers) }
        )
        .toPromise();
      return await response;
    } catch (error) {
      return await error;
    }
  }
}
