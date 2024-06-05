import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ConfigServiceService } from '../../service/config-service.service';
import {
  NavController,
  ActionSheetController,
  IonContent,
} from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { CompanyService } from '../../service/company/company.service';
import { ShowFilterService } from '../../service/observable/show-filter/show-filter.service';
import { ApplySearchService } from '../../service/observable/apply-search/apply-search.service';
import { EsOrderByService } from '../../service/observable/esOrderBy/es-order-by.service';
import { environment } from 'src/environments/environment';
import { ProductTitleService } from 'src/app/service/observable/product-title/product-title.service';
import { DatabaseServiceService } from 'src/app/service/database-service.service';
import { ElasticsearchService } from 'src/app/service/elasticsearch/elasticsearch.service';
import { Storage } from '@ionic/storage-angular';
@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
  @ViewChild(IonContent) ionContent: IonContent;
  public hideFooter: boolean = false;
  public algoliaConfig: any;
  searchPage = true;
  public query: any = {
    query: {
      bool: {
        should: [
          {
            simple_query_string: {
              query: '',
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
  // public showStyledesc = false;
  // public showSizedesc = false;
  public showFilterMenu = false;
  public smallScreenFilter = 'Size';
  public esFilters: any;
  public companyLogo: any;
  public filters: any;
  public collectionOrderOptions = this._companyService.collectionOrderOptions;
  public collectionOrderBy: any = null;
  public actionSheet: any;
  public display = 'none';
  public pTitle: any;
  public postQuery = false;
  public postQueryObj = {};
  public dataLoaded = false;
  public currView: string = '';

  constructor(
    public _companyService: CompanyService,
    public navCtrl: NavController,
    private es: ElasticsearchService,
    public _productTitleService: ProductTitleService,
    private route: ActivatedRoute,
    public _showFilterService: ShowFilterService,
    public _applySearchService: ApplySearchService,
    public configService: ConfigServiceService,
    public databaseService: DatabaseServiceService,
    public _esOrderByService: EsOrderByService,
    public storage: Storage,
    public actionSheetController: ActionSheetController
  ) {
    this._productTitleService.observable().subscribe((data) => {
      this.pTitle = data;
      // console.log("data", data);
    });

    this.es.queryEmmiter.subscribe(async (data) => {
      console.log(data.query);
      //await this.databaseService.showLoading();
      if (data && data.query) {
        this.query = JSON.parse(data.query);
        //this.storage.set('search-query', data.query);
      }
      this.dataLoaded = true;
      // await this.databaseService.hideLoading();
    });

    this.checkQueryParams();
  }

  async checkQueryParams() {
    this.route.queryParams.subscribe(async (params: any) => {
      await this.databaseService.showLoading();
      if (params && params.query) {
        this.query = JSON.parse(params.query);
        // console.log("this.query ", this.query, params.query, typeof (this.query));
      } else {
        this.postQuery = false;
      }

      if (params) {
        console.log(params.searchId == '');
      }
      if (params.searchId == '') {
        this.navCtrl.navigateForward('/diamond-search');
      }
      if (params && params.searchId) {
        let res: any = await this.databaseService.getSearchQuery(
          params.searchId
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
      if (params && params.filters) {
        this.filters = JSON.parse(params.filters);
      }
      this.dataLoaded = true;
      await this.databaseService.hideLoading();
    });
  }

  async ngOnInit() {
    // let searchQuery: any = await this.storage.get('search-query');
    // if (!!searchQuery) {
    //   console.log(searchQuery);
    //   this.query = JSON.parse(searchQuery);
    //   this.dataLoaded = true;
    // }
    await this._companyService.checkAndRedirectForStoreType();
    this.loadCompanyData();
  }

  async loadCompanyData() {
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

          if (!!companyJson && companyJson?.hideFooter) {
            this.hideFooter = companyJson?.hideFooter;
          }
        }
      }
    }
  }

  onSearchChange({ results, state }: { results: any; state: any }) {
    // console.log("results", results, "state", state);
  }

  translate(items) {
    return items.map((item) => ({
      ...item,
      highlighted: item.highlighted,
    }));
  }

  productTitle(title) {
    if (title.length > 80) {
      return title.substring(0, 70) + '...';
    } else {
      return title;
    }
  }

  singleProduct(product) {
    console.log(product);
    let name = product.productName
      .replace(/\//g, '-')
      .replace(/\s+/g, '-')
      .toLowerCase();
    // console.log("name", name);
    this.navCtrl.navigateForward([
      '/products/' + product.objectID + '/' + name,
    ]);
  }

  show(view) {
    // if(view=='showStyledesc') {
    //   if(this.showStyledesc) {
    //     this.showStyledesc = false;
    //   } else {
    //     this.showStyledesc = true;
    //     this.showSizedesc = false;
    //   }
    // } else if(view=='showSizedesc') {
    //   if(this.showSizedesc) {
    //     this.showSizedesc = false;
    //   } else {
    //     this.showSizedesc = true;
    //     this.showStyledesc = false;
    //   }
    // }
    if (!!this.esFilters && this.esFilters.length > 0) {
      this.esFilters.forEach((filter) => {
        if (filter.attribute == view.attribute) {
          if (filter.showDesc) {
            filter.showDesc = false;
          } else {
            filter.showDesc = true;
          }
        } else {
          if (!view.showDesc) {
            filter.showDesc = false;
          }
        }
      });
    }
  }

  showFilterForSmallScreen() {
    if (this.showFilterMenu) {
      this.showFilterMenu = false;
    } else {
      this.showFilterMenu = true;
    }
    this._showFilterService.observables.next(this.showFilterMenu);
  }

  // openDiamondSearch(){
  //   this.navCtrl.navigateForward("/diamond-search");
  // }

  apply() {
    this._applySearchService.observables.next(this.showFilterMenu);
    this.showFilterForSmallScreen();
  }

  filterForSmallScreen(attribute) {
    this.smallScreenFilter = null;
    this.smallScreenFilter = attribute;
  }

  async showSortBy() {
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
  createButtons() {
    let buttons = [];
    for (let btn of this.collectionOrderOptions) {
      let cssClass =
        !!this.collectionOrderBy && this.collectionOrderBy == btn.id
          ? 'btnActiveClass'
          : '';
      let button = {
        id: btn.id,
        text: btn.name,
        cssClass: cssClass,
        handler: () => {
          // console.log('data ' + btn.id, btn.name);
          this.actionSheet.dismiss(btn);
          return false;
        },
      };
      buttons.push(button);
    }
    return buttons;
  }
  async sortBySelected(btn) {
    this.collectionOrderBy = btn.id;
    this._esOrderByService.observables.next(btn);
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

  ionViewWillLeave() {
    this.databaseService.searchListSelected = [];
    this._companyService.productListing = 'grid';
    this.storage.remove('search-query');
  }

  changeCurrView(event) {
    this.currView = event;
  }
}
