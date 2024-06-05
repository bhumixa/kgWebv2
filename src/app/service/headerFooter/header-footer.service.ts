import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Storage } from '@ionic/storage-angular';
import { ConfigServiceService } from '../config-service.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CompanyService } from '../../service/company/company.service';
import { Router, NavigationExtras } from '@angular/router';
import { MenuController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class HeaderFooterService {
  public refCompanyId: any = environment.refCompanyId;
  public headers;
  public getCartTotal = 0;
  public query = '';
  public allViewActions: any = this._companyService.allActions;
  public getProductCount = 0;

  constructor(
    private menu: MenuController,
    public http: HttpClient,
    public storage: Storage,
    public configService: ConfigServiceService,
    private _companyService: CompanyService,
    private router: Router
  ) {
    this.getHeaders();
    this.getCompanyProductCount();
  }

  async getHeaders() {
    this.headers = await this.configService.getAPIHeader();
  }

  async cartValueUpdated() {
    let sessionId = await this.storage.get('sessionID');
    let userId = await this.storage.get('userID');

    this.getUserCartCount(userId, sessionId).then(response => {
      let cartValueUpdated: any = {};
      try {
        this.getCartTotal = response.data.totalCount
      } catch (e) {
        this.getCartTotal = 0;
      }
    });

    // console.log("cartValueUpdated called");
    // this.getCartDetailsV1(userId, sessionId, 0, 0, "", null, false).then(response => {
    //   let cartValueUpdated: any = {};
    //   try {
    //     cartValueUpdated = response;
    //     this.getCartTotal = cartValueUpdated.data.totalProduct.TotalProduct || 0;
    //     // if (this._companyService.productListing == "grid") {
    //     //   this.getCartTotal = cartValueUpdated.data.totalProduct.TotalProduct || 0;
    //     // }else{
    //     //   this.getCartTotal = cartValueUpdated.data.count.TotalQuantity || 0;
    //     // }

    //   } catch (e) {
    //     this.getCartTotal = 0;
    //   }
    // });
  }

  async getUserCartCount(userId, sessionId, orderNo: any = false) {
    let url = '';
    // console.log("userId,sessionId", userId, sessionId);
    if (userId && userId != null && userId != undefined && !Number.isNaN(userId)) {
      url = "&customerId=" + userId;
    } else {
      url = '&sessionId=' + sessionId;
    }
    if (!!orderNo) {
      url += '&cartId=' + orderNo;
    }
    try {
      if (!!this.refCompanyId && this.refCompanyId != undefined) {
        this.headers = await this.configService.getAPIHeader();
        const response = await this.http
          .get(
            ConfigServiceService.getBaseNewUrl() +
              '/shop_carts/getUserCartCount?id=' +
              +this.refCompanyId +
              url,
            { headers: new HttpHeaders(this.headers) }
          )
          .toPromise();
        // console.log("response getCartDetails", response);
        return await response;
      } else {
        return {};
      }
    } catch (error) {
      // console.log("error", error);
      return await error;
    }
  }

  async getCartDetailsV1(
    userId,
    sessionId,
    skip,
    limit,
    searchText,
    bookName,
    variantionParameter,
    orderNo: any = false
  ) {
    let url = '';
    // console.log("userId,sessionId", userId, sessionId);
    if (userId && userId != null && userId != undefined && !Number.isNaN(userId)) {
      url = '&customerId=' + userId;
    } else {
      url = '&sessionId=' + sessionId;
    }
    if (!!orderNo) {
      url += '&cartId=' + orderNo;
    }

    try {
      if (!!this.refCompanyId && this.refCompanyId != undefined) {
        this.headers = await this.configService.getAPIHeader();
        const response = await this.http
          .get(
            ConfigServiceService.getBaseNewUrl() +
              '/shop_carts/getCartDetailByIdV1?id=' +
              this.refCompanyId +
              url +
              '&skip=' +
              skip +
              '&limit=' +
              limit +
              '&searchText=' +
              searchText +
              '&bookName=' +
              bookName +
              '&variantionParameter=' +
              variantionParameter,
            { headers: new HttpHeaders(this.headers) }
          )
          .toPromise();
        // console.log("response getCartDetails", response);
        return await response;
      } else {
        return {};
      }
    } catch (error) {
      // console.log("error", error);
      return await error;
    }
  }

  async updatedSFPlayerID(userID, playerID) {
    try {
      const response = await this.http
        .get(
          ConfigServiceService.getBaseNewUrl() +
            '/users/updateSFPlayerID?id=' +
            this.refCompanyId +
            '&userID=' +
            userID +
            '&SFPlayerID=' +
            playerID,
          { headers: new HttpHeaders(this.headers) }
        )
        .toPromise();
      // console.log("response", response);
      return await response;
    } catch (error) {
      // console.log("error", error);
      return await error;
    }
  }

  async logoutFromTalkBrite() {
    try {
      this.headers = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        accessToken: await this.storage.get('talkBriteAccessToken'),
      };
      let accessToken = await this.storage.get('talkBriteAccessToken');
      const response = await this.http
        .post(
          ConfigServiceService.getBaseNewUrl() +
            '/users/logout?access_token=' +
            accessToken,
          {
            headers: this.headers,
          }
        )
        .toPromise();
      await this.storage.remove('talkBriteAccessToken');
      // this.authenticationState.next(false);
    } catch (err) {
      await this.storage.remove('talkBriteAccessToken');
      // this.authenticationState.next(false);
    }
  }

  async fetchUserProfileDetails(userId) {
    try {
      this.headers = await this.configService.getAPIHeader();
      const response = await this.http
        .get(
          ConfigServiceService.getBaseNewUrl() +
            '/shop_customerContacts/getProfileDetail?id=' +
            this.refCompanyId +
            '&customerID=' +
            userId,
          { headers: new HttpHeaders(this.headers) }
        )
        .toPromise();
      // console.log("response fetchFavorites", response);
      return await response;
    } catch (error) {
      // console.log("error", error);
      return await error;
    }
  }

  search() {
    this.menu.close('menu');

    // console.log("search input ", this.query);
    // this.state.refine(input.value);
    let query = {
      query: {
        bool: {
          should: [
            {
              simple_query_string: {
                query: this.query,
              },
            },
            {
              bool: {
                must: [],
              },
            },
          ],
        },
      },
    };

    let navigationExtras: NavigationExtras = {
      queryParams: {
        query: JSON.stringify(query),
      },
    };
    this.router.navigate(['search'], navigationExtras);
    if (this.query) {
      this.insertSearchView();
    }
    this.query = '';
  }

  async getCompanyProductCount() {
    try {
      this.headers = await this.configService.getAPIHeader();
      const response = await this.http
        .get(
          ConfigServiceService.getBaseNewUrl() +
            '/companies/' +
            this.refCompanyId +
            '/shop_productReviews/count',
          { headers: new HttpHeaders(this.headers) }
        )
        .toPromise();
      // console.log("response fetchFavorites", response);
      let data: any = await response;
      this.getProductCount = data.count + 2000;
    } catch (error) {
      // console.log("error", error);
      return await error;
    }
  }

  async insertSearchView() {
    let search = 12;
    if (!!this.allViewActions && !!this.allViewActions.search) {
      search = this.allViewActions.search;
    }
    let jsonObj = {
      actionId: search,
      refProductId: null,
      searchTxt: this.query,
    };

    let res: any;

    res = await this._companyService.insertView(jsonObj);
    if (res.status == 0) {
      // console.log("error");
    } else {
      // console.log("login view insert res", res);
    }
  }
}
