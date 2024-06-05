import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { ConfigServiceService } from '../config-service.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  public refCompanyId: any = environment.refCompanyId;
  public companyObj: any = environment.companyDetails;
  static algoliaAppId = environment.algoliaAppId;
  static algoliaSearchOnlyKey = environment.algoliaSearchOnlyKey;
  public dealerClubMode: any = environment.dealerClubMode;
  public allActions = environment.viewActions;
  public allPaymentDetails = environment.paymentDetails;
  public collectionOrderOptions = environment.collectionOrderOptions;
  public collectionOrderOptionsTB = environment.collectionOrderOptionsTB;

  public defaultNoForProcesses = '910000000000';
  public currency = 'Rs.';
  public currencySymbol = '₹';
  public razorpayKey;
  public productListing: any = 'card';
  public productName = 'Items';
  public hidePriceForLogin = true;
  public hideCustomerTagInProductDetail = true;
  public storeType = '';
  public multipleSupplierAvailable = false;
  public headers: any;
  public currentPage = '';
  public randomReplacing = 'Random Replacing';
  public underMaintenance: boolean = false;
  public defaultImage: {
    defaultLogo: string;
    base64: string;
    X1X: string;
  } = {
    defaultLogo: `assets/logo/atisundar_logo.gif`,
    base64: `data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA`,
    X1X: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
  };

  constructor(
    public storage: Storage,
    private router: Router,
    public http: HttpClient,
    public configService: ConfigServiceService
  ) {
    this.setCompanyInfo();
    this.getHeaders();
    if (
      this.companyObj &&
      this.companyObj.config &&
      this.companyObj.config.razorpay &&
      this.companyObj.config.razorpay.public
    ) {
      this.razorpayKey = this.companyObj.config.razorpay.public;
    }
  }

  async getHeaders() {
    this.headers = await this.configService.getAPIHeader();
  }

  setCompanyInfo() {
    try {
      if (
        this.dealerClubMode == false ||
        (this.dealerClubMode == true &&
          this.companyObj.companyName != 'dealer club')
      ) {
        let config = this.companyObj.config;
        if (!!config) {
          if (!!config.defaultNoForProcesses) {
            this.defaultNoForProcesses = config.defaultNoForProcesses;
          }
          if (!!config.currency) {
            this.currency = config.currency;
            this.currencySymbol = config.currency;
          }

          if (!!config.productListing) {
            this.productListing = config.productListing;
          }
          // if (!!config.productName) {
          //   this.productName = config.productName;
          // }
          if (typeof config.hidePriceForLogin != 'undefined') {
            this.hidePriceForLogin = config.hidePriceForLogin;
          } else {
            this.hidePriceForLogin = false;
          }

          if (typeof config.hideCustomerTagInProductDetail != 'undefined') {
            this.hideCustomerTagInProductDetail =
              config.hideCustomerTagInProductDetail;
          } else {
            this.hideCustomerTagInProductDetail = true;
          }
        }
      }
      return this.companyObj;
    } catch (error) {
      // console.log("error", error);
      return error;
    }
  }

  async dfHomePage(): Promise<any> {
    if (this.dealerClubMode) {
      return false;
    } else {
      let redirect = '/';
      try {
        if (this.companyObj.config) {
          const companyJson = this.companyObj.config;
          if (companyJson.storeType === 'private') {
            const loggedInUser = await this.storage.get('loggedInUser');
            if (!loggedInUser) {
              redirect = '/login-with-sign-up';
            }
          } else if (
            companyJson.storeType === 'direct' &&
            window.location.href.toString().split(window.location.host)[1] ===
              '/'
          ) {
            const loggedInUser = await this.storage.get('loggedInUser');
            redirect = loggedInUser
              ? companyJson.loggedIn
              : companyJson.loggedOut;
          } else {
            const loggedInUser = await this.storage.get('loggedInUser');
            redirect = loggedInUser
              ? companyJson.loggedIn
              : companyJson.loggedOut;
          }
        }
      } catch (error) {
        console.error('Error occurred:', error);
        // Handle error appropriately, maybe redirect to an error page
      }
      return redirect;
    }
  }

  async defaultHomePage(bool: boolean = false) {
    if (this.dealerClubMode) {
      return false;
    } else {
      let redirect = '/';
      if (this.companyObj.config) {
        try {
          let companyJson = this.companyObj.config;
          if (companyJson.storeType == 'private') {
            if (!(await this.storage.get('loggedInUser'))) {
              redirect = '/login-with-sign-up';
            }
          } else if (
            companyJson.storeType == 'direct' &&
            (window.location.href.toString().split(window.location.host)[1] ==
              '/' ||
              bool)
          ) {
            if (await this.storage.get('loggedInUser')) {
              redirect = companyJson.loggedIn;
            } else {
              redirect = companyJson.loggedOut;
            }
          }
        } catch (e) {}
      }
      return redirect;
    }
  }

  async checkAndRedirectForStoreType() {
    let userID = await this.storage.get('userID');

    if (this.companyObj.config) {
      let companyJson = this.companyObj.config;
      if (!!companyJson) {
        this.storeType = companyJson.storeType;
        if (!!companyJson.storeType) {
          if (companyJson.storeType == 'private' && !userID) {
            this.router.navigate(['/login-with-sign-up'], { replaceUrl: true });
          } else if (
            companyJson.storeType == 'direct' &&
            window.location.href.toString().split(window.location.host)[1] ==
              '/'
          ) {
            if (userID) {
              this.router.navigate([companyJson.loggedIn]);
            } else {
              this.router.navigate([companyJson.loggedOut]);
            }
          }
        }
      }
    }
  }

  async getSearchParameters() {
    let searchParametersUrl = await this.storage.get('urlSearchParameters');
    let searchParams;
    if (!!searchParametersUrl) {
      let queryStringparam = searchParametersUrl.split('?')[1];
      if (!!queryStringparam) {
        searchParams = new URLSearchParams(queryStringparam);
        // console.log("searchParams ", searchParams);
      }
    }
    return searchParams;
  }

  async insertView(jsonObj: any) {
    try {
      let sessionId = await this.storage.get('sessionID');
      let userID = await this.storage.get('userID');
      let loggedInUser = await this.storage.get('loggedInUser');

      jsonObj.refCompanyId = this.refCompanyId;
      let utm_source, utm_medium, utm_campaign, utm_term, utm_content;

      let sParams = await this.getSearchParameters();
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
      jsonObj.utm_source = utm_source;
      jsonObj.utm_medium = utm_medium;
      jsonObj.utm_campaign = utm_campaign;
      jsonObj.utm_term = utm_term;
      jsonObj.utm_content = utm_content;
      jsonObj.ipAddress = null;
      jsonObj.refPcID = null;

      if (sessionId) {
        jsonObj.sessionId = sessionId;
      }

      if (userID) {
        jsonObj.refUserId = userID;
      }

      if (loggedInUser) {
        jsonObj.phoneNo = loggedInUser;
      } else {
        jsonObj.phoneNo = jsonObj.phoneNo ? jsonObj.phoneNo : '';
      }

      const response = await this.http
        .post(
          ConfigServiceService.getBaseNewUrl() + '/viewDetails/insertView',
          jsonObj
        )
        .toPromise();
      // console.log("response", response);
      return await response;
    } catch (error) {
      // console.log("error", error);
      return await error;
    }
  }

  async insertGTM(
    event: any,
    action: any,
    actionFieldObj: any,
    productsArr: any
  ) {
    try {
      let appName = this.configService.appName;
      (<any>window).dataLayer = (<any>window).dataLayer || [];
      let actionObj: any = {};
      if (!!actionFieldObj) {
        // optional
        actionObj['actionField'] = actionFieldObj;
      }
      actionObj['products'] = productsArr;
      (<any>window).dataLayer.push({
        event: event,
        appName: {
          action: actionObj,
        },
      });
    } catch (err) {
      console.error(err);
    }
  }

  async getPopularCollections() {
    try {
      const response = await this.http
        .get(
          ConfigServiceService.getBaseNewUrl() +
            '/shop_productCollections/getAllPopularCollections?id=' +
            this.refCompanyId
        )
        .toPromise();

      let newResponse: any = await response;

      // console.log("response getPopularCollections", response);
      return newResponse;
    } catch (error) {
      // console.log("error", error);
      return await error;
    }
  }
}
