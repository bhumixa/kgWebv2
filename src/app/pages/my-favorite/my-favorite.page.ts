import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController, Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { ConfigServiceService } from '../../service/config-service.service';
import { CompanyService } from '../../service/company/company.service';
import { FavoriteService } from '../../service/product/favorite.service';

@Component({
  selector: 'app-my-favorite',
  templateUrl: './my-favorite.page.html',
  styleUrls: ['./my-favorite.page.scss'],
})
export class MyFavoritePage implements OnInit {
  public userId: any;
  public favorites: any = false;
  public onMobile: any;
  public resultColumns: any = [];
  public searchResultColumns: any = [];
  public selected: any = [];
  public totalSummary = [];
  public hideFooter: boolean = false;
  allowDeleting: boolean = true;
  constructor(
    public _favoriteService: FavoriteService,
    public _companyService: CompanyService,
    public platform: Platform,
    private router: Router,
    public navCtrl: NavController,
    public storage: Storage,
    public configService: ConfigServiceService
  ) {
    this.platform.ready().then(() => {
      // console.log("this.platform", this.platform);
      if (this.platform.is('desktop')) {
        this.onMobile = false;
      } else {
        this.onMobile = true;
      }
      // console.log("this.onMobile", this.onMobile);
    });
  }

  async ionViewDidEnter() {}

  async loadCompanyData() {
    if (this._companyService.companyObj && this._companyService.companyObj) {
      if (this._companyService.companyObj.config) {
        let companyJson = this._companyService.companyObj.config;
        if (!!companyJson) {
          if (!!companyJson.export) {
            if (!!companyJson.export.searchResultColumns) {
              this.searchResultColumns = companyJson.export.searchResultColumns;
              this.totalSummary = companyJson.export.totalSummary;
            }
            if (!!companyJson && companyJson?.hideFooter) {
              this.hideFooter = companyJson?.hideFooter;
            }
          }
        }
      }
    }
  }

  async ngOnInit() {
    let val = await this.storage.get('userID');
    this.userId = parseInt(val);
    // console.log("userId", this.userId);
    await this.loadCompanyData();
    this.fetchFavorites(this.userId);
    this.configService.setTitle('My Favorites');
  }

  async fetchFavorites(userId) {
    this.resultColumns = [];
    let res = await this._favoriteService.fetchFavorites(userId);
    this.favorites = res.data;
  }
  async removeFromFavorites(fvID) {
    let res = await this._favoriteService.removeFavorites(fvID);
    this.fetchFavorites(this.userId);
    this.configService.presentToast('Removed from favorites', 'success');
    if (!res) {
      this.configService.presentToast(res.error, 'error');
    }
  }

  async openProductSummaryPage(product) {
    // console.log("product", product);
    let name = product.name.replace(/\//g, '-');
    name = product.name.replace(/ /g, '-');

    // console.log("name", name);
    this.navCtrl.navigateForward([
      '/products/' + product.productId + '/' + name,
    ]);
  }

  singleProduct(product) {
    let name = product.name
      .replace(/\//g, '-')
      .replace(/\s+/g, '-')
      .toLowerCase();
    // console.log("name", name);
    this.navCtrl.navigateForward([
      '/products/' + product.productId + '/' + name,
    ]);
  }
}
