import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Storage } from '@ionic/storage';
import { ConfigServiceService } from '../config-service.service';
import { CompanyService } from '../company/company.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CollectionService {
  public refCompanyId: any = environment.refCompanyId;
  public headers: any;
  public allViewActions: any = this._companyService.allActions;

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

  async getPageDetailByCollectionName(
    name: any,
    offset: any,
    limit: any,
    searchText: any,
    collectionOrderBy: any
  ) {
    try {
      const response = await this.http
        .get(
          ConfigServiceService.getBaseNewUrl() +
            '/shop_productCollections/getAllCollectionDetailByNamev1?id=' +
            this.refCompanyId +
            '&name=' +
            name +
            '&offset=' +
            offset +
            '&limit=' +
            limit +
            '&search=' +
            searchText +
            '&collectionOrderBy=' +
            collectionOrderBy
        )
        .toPromise();

      let newResponse: any = await response;
      this.insertCollectionView(newResponse.data[0].id);

      // console.log("response getPageDetailByCollectionName", response);
      return newResponse;
    } catch (error) {
      // console.log("error", error);
      return await error;
    }
  }

  async getCollectionDetailsByNames(
    collectionNames: any,
    offset: any,
    limit: any,
    searchText: any,
    collectionOrderBy: any
  ) {
    try {
      let sessionID = await this.storage.get('sessionID');
      let userId = await this.storage.get('userID');
      let fromStoreFront = true;
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

      let collectionNameArr = '["' + collectionNames.join('","') + '"]';
      const response = await this.http
        .get(
          ConfigServiceService.getBaseNewUrl() +
            '/shop_productCollections/getAllCollectionDetailsByNames?id=' +
            this.refCompanyId +
            '&collectionNames=' +
            collectionNameArr +
            '&offset=' +
            offset +
            '&limit=' +
            limit +
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
            '&fromStoreFront=' +
            fromStoreFront +
            '&search=' +
            searchText +
            '&collectionOrderBy=' +
            collectionOrderBy
        )
        .toPromise();
      // console.log("response getCollectionDetailsByNames", response);
      return await response;
    } catch (error) {
      // console.log("error", error);
      return await error;
    }
  }

  async findProductParameterValuesMaster(value: any) {
    try {
      const response = await this.http
        .get(
          ConfigServiceService.getBaseNewUrl() +
            '/shop_productParameterValuesMasters/findProductParameterValuesMaster?value=' +
            value +
            '&id=' +
            this.refCompanyId
        )
        .toPromise();
      // console.log("response findProductParameterValuesMaster", response);
      return await response;
    } catch (error) {
      // console.log("error", error);
      return await error;
    }
  }

  async insertCollectionView(collectionId: any) {
    let search = 2;
    if (!!this.allViewActions && !!this.allViewActions.viewCollection) {
      search = this.allViewActions.viewCollection;
    }
    let jsonObj = {
      actionId: search,
      refProductId: null,
      refPcID: collectionId,
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
