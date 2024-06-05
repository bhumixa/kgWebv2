import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Storage } from '@ionic/storage';
import { ConfigServiceService } from '../config-service.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class FavoriteService {
  public refCompanyId: any = environment.refCompanyId;
  public headers: any;
  public favoriteArray: any = [];

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

  async createFavorite(addObj: any) {
    addObj.id = this.refCompanyId;
    try {
      this.headers = await this.configService.getAPIHeader();
      const response = await this.http
        .post(
          ConfigServiceService.getBaseNewUrl() +
            '/shop_favorites/createFavorite',
          addObj,
          { headers: new HttpHeaders(this.headers) }
        )
        .toPromise();
      // console.log("response createFavorite", response);
      await this.fetchFavorites(await this.storage.get('userID'), true);
      return await response;
    } catch (error) {
      // console.log("error", error);
      return await error;
    }
  }

  async fetchFavorites(userId: any, bool: boolean = false) {
    try {
      if (this.favoriteArray.length == 0 || bool) {
        this.headers = await this.configService.getAPIHeader();
        const response = await this.http
          .get(
            ConfigServiceService.getBaseNewUrl() +
              '/shop_favorites/getAllFavorites?id=' +
              this.refCompanyId +
              '&userId=' +
              userId,
            { headers: new HttpHeaders(this.headers) }
          )
          .toPromise();
        // console.log("response fetchFavorites", response);
        this.favoriteArray = await response;
      }

      return this.favoriteArray;
    } catch (error) {
      // console.log("error", error);
      return await error;
    }
  }

  async removeFavorites(favID: any) {
    try {
      this.headers = await this.configService.getAPIHeader();
      const response = await this.http
        .delete(
          ConfigServiceService.getBaseNewUrl() +
            '/shop_favorites/deleteFavorites?id=' +
            this.refCompanyId +
            '&fID=' +
            favID,
          { headers: new HttpHeaders(this.headers) }
        )
        .toPromise();
      // console.log("response removeCartProduct", response);
      await this.fetchFavorites(await this.storage.get('userID'), true);
      return await response;
    } catch (error) {
      // console.log("error", error);
      return await error;
    }
  }
}
