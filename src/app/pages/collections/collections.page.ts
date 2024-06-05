import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  NavController,
  ActionSheetController,
  PopoverController,
  IonContent,
} from '@ionic/angular';
import { IonInfiniteScroll } from '@ionic/angular';
import { ConfigServiceService } from '../../service/config-service.service';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Router, NavigationExtras } from '@angular/router';
import { CompanyService } from '../../service/company/company.service';
import { CollectionService } from '../../service/page/collection.service';
import { FavoriteService } from '../../service/product/favorite.service';
import { TranformImagesService } from '../../service/product/tranform-images.service';
import { CartService } from '../../service/observable/cart/cart.service';
import { ShowFilterService } from 'src/app/service/observable/show-filter/show-filter.service';
import { SegmentChangedService } from '../../service/observable/segment-changed/segment-changed.service';
import { EsOrderByService } from 'src/app/service/observable/esOrderBy/es-order-by.service';
import { PopoverComponent } from '../../components/popover/popover.component';
import { DatabaseServiceService } from 'src/app/service/database-service.service';

@Component({
  selector: 'app-collections',
  templateUrl: './collections.page.html',
  styleUrls: ['./collections.page.scss'],
})
export class CollectionsPage implements OnInit {
  public defaultpageName = 'CollectionsPage';

  @ViewChild(IonInfiniteScroll, { static: false })
  infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonContent) ionContent: IonContent;

  public products = [];
  public collectionName: any;
  public favoriteColor = false;
  public favorites: any;
  public offset = 0;
  public limit = 24;
  public userId: any;
  public favoriteArray = [];
  public loggedInUser: any;
  public onMobile: any;
  public companyLogo: any;
  public query: any;
  public showFilterMenu = false;
  public esFilters: any;
  public category: any;
  public showSkeleton = true;
  public transformationTypes = [];
  public collectionOrderOptions = this._companyService.collectionOrderOptions;
  public collectionOrderBy: any = null;
  public actionSheet: any;
  public popover: any;
  public orderByFromServer: any;
  public collectionOrderOptionsTB =
    this._companyService.collectionOrderOptionsTB;
  public header: any;
  public display = 'none';
  public filters: any;
  public postQuery = false;
  public postQueryObj = {};
  public dataLoaded = false;
  showSearchPage = true;
  constructor(
    public _cartService: CartService,
    public _tranformImagesService: TranformImagesService,
    public _favoriteService: FavoriteService,
    public _collectionService: CollectionService,
    public databaseService: DatabaseServiceService,
    public _companyService: CompanyService,
    public _showFilterService: ShowFilterService,
    public _segmentChangedService: SegmentChangedService,
    public platform: Platform,
    private router: Router,
    public storage: Storage,
    private route: ActivatedRoute,
    public navCtrl: NavController,
    public configService: ConfigServiceService,
    public actionSheetController: ActionSheetController,
    public _esOrderByService: EsOrderByService,
    public popoverController: PopoverController
  ) {
    this._companyService.currentPage = this.defaultpageName;

    this.collectionName = this.route.snapshot.paramMap.get('id');
    this.category = this.route.snapshot.paramMap.get('category');
    // console.log("collectionName", this.collectionName, this.category);
    this.configService.setTitle(this.collectionName);
    this.route.queryParams.subscribe(async (params) => {
      await this.databaseService.showLoading();
      if (params && params['query']) {
        this.query = JSON.parse(params['query']);
        // console.log("this.query ", this.query, params.query, typeof (this.query));
      } else {
        this.postQuery = false;
      }
      if (params) {
        console.log(params['searchId'] == '');
      }
      if (params['searchId'] == '') {
        this.navCtrl.navigateForward('/diamond-search');
      }
      if (params && params['searchId']) {
        let res: any = await this.databaseService.getSearchQuery(
          params['searchId']
        );
        if (res.isSuccess && res.data.length > 0) {
          let data = JSON.parse(res.data[0].taskInputJson);
          if (data) {
            this.postQueryObj = data;
            this.postQuery = true;
          }
        } else {
          this.navCtrl.navigateForward('/diamond-search');
        }
      }
      if (params && params['filters']) {
        this.filters = JSON.parse(params['filters']);
      }
      this.dataLoaded = true;
      await this.databaseService.hideLoading();
    });
    this.storage.get('loggedInUser').then((val) => {
      this.loggedInUser = val;
    });

    this.platform.ready().then(() => {
      // console.log("this.platform", this.platform);
      if (this.platform.is('desktop')) {
        this.onMobile = false;
      } else {
        this.onMobile = true;
      }
      // console.log("this.onMobile", this.onMobile);
    });
    this._segmentChangedService.observable().subscribe((collectionName) => {
      if (collectionName) {
        this.offset = 0;
        this.limit = 24;
        this.products = [];
        this.showSkeleton = true;
        this.collectionName = collectionName;
        this.loadData(collectionName, null);
      }
    });
    this._esOrderByService.observable().subscribe((data) => {
      if (!!this.popover) {
        this.popover.dismiss();
      }
      this.collectionOrderBy = data;
      if (!this.query) {
        this.loadData(this.collectionName, null);
      }
    });
  }

  async ionViewDidEnter() {
    /*await this.configService.setTitle(this.collectionName);
    this.offset = 0;
    this.limit = 24;
    this.products = [];
    this.showSkeleton = true;
    await this.loadCompanyData();
    await this.getTransformationTypes();
    await this.loadData(this.collectionName, null);*/
    // let val = await this.storage.get("userID");
    // this.userId = parseInt(val);
    // // console.log("userId", this.userId);
    // if (this.loggedInUser) {
    //   this.fetchFavorites(this.userId);
    // }
  }

  async getTransformationTypes() {
    let res: any;
    res = await this._tranformImagesService.getTransformationTypes();
    if (res.status == 0) {
      // console.log("error");
    } else {
      let json = res.data;
      this.transformationTypes = json;
    }
  }

  async ionViewDidLeave() {}

  async ngOnInit() {
    await this.configService.setTitle(this.collectionName);
    this.offset = 0;
    this.limit = 24;
    this.products = [];
    this.showSkeleton = true;
    await this.loadCompanyData();
    await this.getTransformationTypes();
    await this.loadData(this.collectionName, null);
  }

  async loadCompanyData() {
    await this._companyService.checkAndRedirectForStoreType();

    // console.log("this._companyService.companyObj ", this._companyService.companyObj);
    if (this._companyService.companyObj && this._companyService.companyObj) {
      if (!!this._companyService.companyObj.companyLogo) {
        this.companyLogo = this._companyService.companyObj.companyLogo;
      }
      if (this._companyService.companyObj.config) {
        let companyJson = this._companyService.companyObj.config;
        if (!!companyJson) {
          if (!!companyJson.esFilters) {
            this.esFilters = companyJson.esFilters;
            // console.log("this.esFilters ", this.esFilters);
          }
          if (!!companyJson.header) {
            this.header = companyJson.header;
          }
        }
      }
    }
  }
  async loadData(data, infiniteScroll) {
    if (!this.onMobile) {
      this.limit = 24;
    }
    let response = await this._collectionService.getPageDetailByCollectionName(
      data,
      this.offset,
      this.limit,
      '',
      !!this.collectionOrderBy ? this.collectionOrderBy.id : null
    );
    if (response) {
      this.showSkeleton = false;
    }
    if (response.isSuccess && response.data[0]) {
      if (this.products.length == 0 && !!response.data[0].config) {
        this.query = JSON.parse(response.data[0].config);
      }

      if (response.data[0].listOfProducts) {
        this.products = response.data[0].listOfProducts;
        if (
          this.products.length == 0 &&
          !!response.data[0].sectionResult &&
          response.data[0].sectionResult.length > 0
        ) {
          if (
            !!response.data[0].sectionResult[0].imageRes &&
            response.data[0].sectionResult[0].imageRes.length > 0
          ) {
            if (!!response.data[0].sectionResult[0].imageRes[0].config) {
              this.query = JSON.parse(
                response.data[0].sectionResult[0].imageRes[0].config
              );
            }
          }
        }
      }

      if (response.data[0].collectionOrderBy) {
        let orderByOptions = this.collectionOrderOptionsTB.filter(
          (o) => o.id == response.data[0].collectionOrderBy
        );
        if (orderByOptions.length > 0) {
          this.orderByFromServer = orderByOptions[0];
        }
      }

      if (this.products.length == 0 && !!this.category) {
        this.collectionName = this.collectionName + '/' + this.category;
        this.findProductParameterValuesMaster(this.category);
      }
    }
    if (!response.isSuccess && !!response.error && !this.query) {
      this.router.navigateByUrl('/home');
    }
    // console.log("this.products1", this.products, document.URL, this.query, response.data[0]);
  }

  async loadDatawithScroll(data, infiniteScroll) {
    let response = await this._collectionService.getPageDetailByCollectionName(
      data,
      this.offset,
      this.limit,
      '',
      !!this.collectionOrderBy ? this.collectionOrderBy.id : null
    );
    if (response && response.data[0] && response.data[0].listOfProducts) {
      let allData = response.data[0].listOfProducts;
      if (!!response.isSuccess) {
        if (allData.length == 0) {
          infiniteScroll.target.disabled = true;
        } else {
          if (infiniteScroll) {
            Array.prototype.push.apply(this.products, allData);
            infiniteScroll.target.complete();
            // console.log("this.products2", this.products);
          }
        }

        if (response.length == 1000) {
          infiniteScroll.target.disabled = true;
        }
        // this.products = response;

        // this.products.push(allData);
      } else {
        // console.log("error", response.error);
        infiniteScroll.target.complete();
        this.configService.presentToast(response.error, 'error');
      }
    } else {
      infiniteScroll.target.complete();
    }
  }

  doInfiniteNew(infiniteScroll) {
    this.offset += 1;
    // console.log("infiniteScroll", infiniteScroll);
    setTimeout(() => {
      this.loadDatawithScroll(this.collectionName, infiniteScroll);
      // infiniteScroll.target.complete();
    }, 500);
  }

  singleProduct(product) {
    let name = product.name.replace(/\//g, '-');
    name = product.name.replace(/ /g, '-');
    // console.log("name", name);
    this.navCtrl.navigateForward([
      '/products/' + product.id + '/' + name + '/' + product.currentLocation,
    ]);
  }
  openCart() {
    this._cartService.observables.next('data');
  }

  async fetchFavorites(userId) {
    if (userId) {
      // console.log("in fetchFavorites");
      let res = await this._favoriteService.fetchFavorites(userId);
      this.favorites = res;
      if (this.products) {
        this.products.forEach((element1) => {
          element1.favorite = false;
        });
        this.products.forEach((element1) => {
          if (this.favorites && this.favorites.data) {
            this.favorites.data.forEach((element2) => {
              if (element1.id == element2.productId) {
                this.favoriteArray.push(element2);
                element1.favorite = true;
              }
            });
          }
        });

        if (!!res.isSuccess) {
        } else {
          // console.log(res.error);
        }
      }
    }
  }

  async addToFavorite(product) {
    // console.log("product", product);

    let userId = await this.storage.get('userID');
    if (!userId && userId == null && userId == undefined) {
      // this.configService.presentToast("Please Login", "error");
      let navigationExtras: NavigationExtras = {
        queryParams: {
          to: '/my-favorite',
        },
      };
      this.router.navigate(['/sign-up'], navigationExtras);
    } else {
      var favProd = this.favorites.data.filter(
        (d) => d.productId == product.id
      );
      if (!!favProd && favProd.length > 0) {
        //already added
        let res = await this._favoriteService.removeFavorites(favProd[0].id);
        this.configService.presentToast('Removed from favorites', 'error');
        this.fetchFavorites(userId);
      } else {
        //not in fav,add it to fav
        let favoriteObj = {
          productId: product.id,
          userId: parseInt(userId),
        };
        let favoriteResponse = await this._favoriteService.createFavorite(
          favoriteObj
        );
        // console.log("favoriteResponse", favoriteResponse);
        if (favoriteResponse.isSuccess) {
          this.configService.presentToast('Added to your favorites', 'success');
          this.fetchFavorites(userId);
        } else {
          //this should be never be the case
          this.configService.presentToast(favoriteResponse.error, 'error');
        }
      }
    }
  }
  productTitle(title) {
    if (title.length > 80) {
      return title.substring(0, 70) + '...';
    } else {
      return title;
    }
  }

  showFilterForSmallScreen() {
    if (this.showFilterMenu) {
      this.showFilterMenu = false;
      this._showFilterService.observables.next(this.showFilterMenu);
    } else {
      this.showFilterMenu = true;
      this._showFilterService.observables.next(this.showFilterMenu);
    }
  }

  async findProductParameterValuesMaster(category) {
    let response =
      await this._collectionService.findProductParameterValuesMaster(category);
    let res = response;
    // console.log("findProductParameterValuesMaster response", res);
    if (res.isSuccess && !!res.data && res.data.length > 0) {
      // console.log("findProductParameterValuesMaster response data", res.data);
      if (!!res.data[0].paramRes && res.data[0].paramRes.length > 0) {
        let name = res.data[0].paramRes[0].name;
        let value = res.data[0].value;
        let valueArr = [];
        valueArr.push(value);
        let c = {},
          cArr = [];
        c[name] = valueArr;
        cArr.push(c);
        // let config = {
        //   disjunctiveFacetsRefinements: c
        // };
        let config = {
          filters: [
            {
              f: cArr,
            },
          ],
        };
        if (!!this.query) {
          // // console.log("***********",this.query);
          /*if (!!this.query.disjunctiveFacetsRefinements) {
            // // console.log("*********** 1",this.query);
            if (!!this.query.disjunctiveFacetsRefinements.name) {
              this.query.disjunctiveFacetsRefinements.name.push(value);
              // // console.log("*********** 2",this.query);
            } else {
              this.query.disjunctiveFacetsRefinements[name] = valueArr;
              // // console.log("*********** 3",this.query);
            }*/
          if (!!this.query.filters && !!this.query.filters.f) {
            // // console.log("*********** 1",this.query);
            if (!!this.query.filters.f[0].name) {
              this.query.filters.f[0].name.push(value);
              // // console.log("*********** 2",this.query);
            } else {
              this.query.filters.f[0][name] = valueArr;
              // // console.log("*********** 3",this.query);
            }
          } else {
            this.query = config;
            // // console.log("*********** 4",this.query);
          }
        } else {
          this.query = config;
          // // console.log("*********** 5",this.query);
        }
      }
    } else {
      console.error(res.error);
    }
  }

  async showSortBy(ev) {
    if (!!ev) {
      if (this.popover) {
        await this.popover.dismiss();
      }
      this.popover = await this.popoverController.create({
        component: PopoverComponent,
        event: ev,
        componentProps: {
          sortBy: this.collectionOrderOptions,
          selectedBtn: !!this.collectionOrderBy
            ? this.collectionOrderBy.id
            : null,
        },
        // translucent: true
      });
      return await this.popover.present();
    } else {
      this.actionSheet = await this.actionSheetController.create({
        header: 'Sort By',
        cssClass: 'actionSheetClass',
        keyboardClose: true,
        buttons: this.createButtons(),
      });
      await this.actionSheet.present();
      this.actionSheet.onDidDismiss().then((data) => {
        console.log('actionSheet will dismiss ', data);
        this.sortBySelected(data.data);
      });
    }
  }
  createButtons() {
    let buttons = [];
    for (let btn of this.collectionOrderOptions) {
      let cssClass =
        !!this.collectionOrderBy && this.collectionOrderBy.id == btn.id
          ? 'btnActiveClass'
          : '';
      let button = {
        id: btn.id,
        text: btn.name,
        cssClass: cssClass,
        handler: () => {
          console.log('data ' + btn.id, btn.name);
          // if(!!this.query) {
          //   this._esOrderByService.observables.next(btn);
          // } else {
          //   this.collectionOrderBy = btn.id;
          //   this.loadData(this.collectionName, null);
          // }
          this.actionSheet.dismiss(btn);
          return false;
        },
      };
      buttons.push(button);
    }
    return buttons;
  }
  async sortBySelected(btn) {
    this.collectionOrderBy = btn;
    if (!!this.query) {
      this._esOrderByService.observables.next(btn);
    } else {
      await this.loadData(this.collectionName, null);
    }
  }

  scrollContent() {
    this.ionContent.scrollToTop(300);
  }

  logScrolling(ev) {
    if (ev.detail.scrollTop < 10) {
      this.display = 'none';
    } else {
      this.display = 'block';
    }
  }
}
