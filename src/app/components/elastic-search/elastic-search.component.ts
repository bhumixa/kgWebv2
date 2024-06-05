import {
  Component,
  OnInit,
  Input,
  HostListener,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core';
import { ElasticsearchService } from '../../service/elasticsearch/elasticsearch.service';
import { environment } from '../../../environments/environment';
import { SavedService } from '../../service/cart/saved/saved.service';
import { ConfigServiceService } from '../../service/config-service.service';
import {
  NavController,
  PopoverController,
  AlertController,
  ActionSheetController,
  ModalController,
} from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { PopoverComponent } from '../popover/popover.component';
import { Router, NavigationExtras } from '@angular/router';
import { IonicSelectableComponent } from 'ionic-selectable';
import CustomStore from 'devextreme/data/custom_store';
import Query from 'devextreme/data/query';
import { Platform } from '@ionic/angular';
import { CompanyService } from '../../service/company/company.service';
import { FunctionsService } from '../../service/cart/functions/functions.service';
import { NgxFormService } from '../../service/ngxForm/ngx-form.service';
import { TranformImagesService } from '../../service/product/tranform-images.service';
import { NavigateService } from '../../service/product/navigate.service';
import { DetailsService } from '../../service/product/details.service';
import { ShowFilterService } from '../../service/observable/show-filter/show-filter.service';
import { FavoriteService } from '../../service/product/favorite.service';
import { EsOrderByService } from '../../service/observable/esOrderBy/es-order-by.service';
import { HeaderFooterService } from 'src/app/service/headerFooter/header-footer.service';
import * as moment from 'moment';
import { AnalyticsService } from 'src/app/service/analytics.service';
import { ApplySearchService } from 'src/app/service/observable/apply-search/apply-search.service';
import { DatabaseServiceService } from 'src/app/service/database-service.service';
import { DomSanitizer } from '@angular/platform-browser';

import { browserRefresh$, browserRefresh } from '../../app.component';
import { map } from 'rxjs/operators';
import {
  DxDataGridComponent,
  TotalSelectedSummary,
} from '../dx-data-grid/dx-data-grid.component';
import { BookAppointmentComponent } from '../book-appointment/book-appointment.component';
import { PreviewAnyFile } from '@ionic-native/preview-any-file/ngx';
import { ExcelSheetData } from 'src/app/service/excelSheetData/excelSheetData.service';
import { MixPanelDataService } from 'src/app/service/mixpanel/mixpanelData.service';

@Component({
  selector: 'app-elastic-search',
  templateUrl: './elastic-search.component.html',
  styleUrls: ['./elastic-search.component.scss'],
})
export class ElasticSearchComponent implements OnInit {
  @ViewChild(DxDataGridComponent) dxDataGridComp: any;

  @Input()
  postQueryObj: any;
  @Input() query: any = {
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
              must_not: [
                {
                  match: {
                    internalStatus: 'Sold',
                  },
                },
                {
                  match: {
                    ShapeCode: 'ASHOKA',
                  },
                },
              ],
            },
          },
        ],
      },
    },
  };
  @Input() filters: any;
  @Input() orderBy: any;

  @Output() currView: EventEmitter<string> = new EventEmitter<string>();

  public products = [];
  public index = environment.INDEX;
  public perPage = environment.RESULTS_PER_PAGE;
  public totalHits: number = 0;
  public searchTime: number = 0;
  public currentPage: number = 1;
  public searchResponse = '';
  public totalPages: any;
  public fixedParameter = [];
  public esData: any[] = [];
  public totalSummary = [{ fieldName: 'stoneName', summaryType: 'sum' }];
  public hits: any;
  public searchResultColumns: any = [];
  public mobileColumns: any = [];
  public desktopColumns: any = [];
  public searchResultExport: any = [];
  public shortCodes = [];
  public companyLogo: any;
  public resultColumns: any = [];
  public showFilters: any = false;
  public isSelectAll: any = false;
  public DisableSavedSearches: any = false;
  public searchPageButtons: any = [];
  public searchPageAllButtons: any = [];
  public selected: any = [];
  public showFilterMenu = false;
  public smallScreenFilter: any = 'Size';
  public selectedSavedSearch: any;
  public savedSearchList: any = [];
  public userType: any;
  public userData: any;
  public states: any;
  public itemsFormatted: any = [];
  public productDetailPageList: any = [];
  public userId: any;
  public loggedInUser: any;
  public sessionId: any;
  public popover: any;
  public checkKYC = false;
  public hideFavourites: any = false;
  public showSpinner = true;
  public hideStorePrice = false;
  public transformationTypes = [];
  public mode = 'multiple';
  public inspectionView = false;
  public kgPricing: any;
  public isFirstPage = true;
  public isLastPage = false;
  public maxPage = 5;
  public esFilters: any;
  public firstLoad: boolean = false;
  public searchPara: any = {};
  public currentFilterExists = false;
  public searchFirstTime = true;
  public callSearchRefinements = true;
  public take = 50;
  public onMobile = false;
  public fixFilters: any;
  public favorites: any;
  public showSKU = false;
  public showProductId = false;
  public collectionOrderOptions = this._companyService.collectionOrderOptions;
  public actionSheet: any;
  public pageSize = 50;
  public showCart: boolean = false;
  public loadMoreData: any = [];
  public gridResultsSorted: boolean = false;
  public defaultSelected: any = 'none';
  public refreshGrid = false;
  public refreshMobileGrid = false;
  public contentClass = '';
  public innerWidth: any;
  public mobileView: boolean = false;
  public webViewMobile: boolean = false;
  showDetails: boolean = true;
  public profileData: any;
  public salesPersonEmail: any;
  public gridStones = [];
  cartProducts: any = [];
  distributioncenter: any;
  refreshCard: boolean = false;

  totalSelectedSummary: TotalSelectedSummary = {
    cts: 0,
    pcs: 0,
    amount: 0,
    rapValue: 0,
  };
  hideClearSelection: boolean = false;
  isStoneSelected: boolean = false;
  userEmail: string = '';
  totalNumOfStones: number = 0;
  isIpad: boolean = false;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (this._companyService.productListing == 'grid') {
      this.innerWidth = window.innerWidth;
      if (this.innerWidth <= 500) {
        this.contentClass = '';
        this.mobileView = true;
      } else if (this.innerWidth > 500) {
        this.contentClass = 'leftRightMargin';
        this.mobileView = false;
      }
      this.sortColumns();
    }
  }
  constructor(
    private previewAnyFile: PreviewAnyFile,
    public _applySearchService: ApplySearchService,
    public _detailsService: DetailsService,
    public _navigateService: NavigateService,
    public _tranformImagesService: TranformImagesService,
    public _ngxFormService: NgxFormService,
    public _functionsService: FunctionsService,
    public _companyService: CompanyService,
    public _showFilterService: ShowFilterService,
    public _favoriteService: FavoriteService,
    private es: ElasticsearchService,
    public _savedService: SavedService,
    private popoverController: PopoverController,
    private sanitizer: DomSanitizer,
    public configService: ConfigServiceService,
    public databaseServiceService: DatabaseServiceService,
    public navCtrl: NavController,
    private router: Router,
    public storage: Storage,
    public alertController: AlertController,
    public platform: Platform,
    public _esOrderByService: EsOrderByService,
    public _headerFooterService: HeaderFooterService,
    public analyticsService: AnalyticsService,
    public actionSheetController: ActionSheetController,
    private modalCtrl: ModalController,
    private excelSheetData: ExcelSheetData,
    public mixPanelDataService: MixPanelDataService
  ) {
    //this.dxDataGridComp = new DxDataGridComponent();
    browserRefresh$
      .pipe(
        map((val: boolean) => {
          if (!!val) {
            if (!!localStorage.getItem('prevState')) {
              this._companyService.productListing =
                localStorage.getItem('prevState');
              if (this._companyService.productListing !== 'card')
                localStorage.removeItem('prevState');
            }

            browserRefresh.next(false);
          }
        })
      )
      .subscribe()
      .unsubscribe();

    this._showFilterService.observable().subscribe((data) => {
      this.showFilterMenu = data;
    });
    this._esOrderByService.observable().subscribe((data) => {
      if (!!this.popover) {
        this.popover.dismiss();
      }
      this.orderBy = data;
      this.search(this.query, this.index, this.currentPage, false);
    });

    this.checkDevice();
  }

  checkDevice() {
    this.platform.ready().then(() => {
      let platforms = this.platform.platforms();
      //this.platform.is('ipad');
      if (this.platform.is('ipad')) {
        this.isIpad = true;
      }
      console.log(platforms);
      console.log(this.platform.is('android'), 'android');
      console.log(this.platform.is('desktop'), 'desktop');
      console.log(this.platform.is('mobileweb'), 'mobileweb');
      const screenWidth = this.platform.width();
      // console.log("this.platform", this.platform);
      if (this.platform.is('desktop') || this.platform.is('ipad')) {
        this.onMobile = false;
        this.webViewMobile = false;
      } else if (
        (this.platform.is('ios') || this.platform.is('android')) &&
        !this.platform.is('mobileweb') &&
        !this.platform.url().startsWith('http')
      ) {
        this.onMobile = true;
        this.webViewMobile = false;
      } else if (this.platform.is('mobileweb')) {
        this.onMobile = false;
        this.webViewMobile = true;
      } else {
        this.onMobile = false;
        this.webViewMobile = false;
      }

      console.log(this.onMobile);
      this.webViewMobile = !this.platform.is('cordova');
      console.log('this.webViewMobile', this.webViewMobile);
    });
  }

  async ngOnInit() {
    this.loadInspectView();
    this.gridResultsSorted = false;
    let sessionId = await this.storage.get('sessionID');
    let userId = await this.storage.get('userID');
    this.userId = await this.storage.get('userID');
    if (!!userId) {
      let res: any = await this.databaseServiceService.getDiaUserProfile(
        this.userId
      );
      if (res?.data?.parameter) {
        let para = JSON.parse(res.data.parameter);
        this.distributioncenter =
          para?.userAccount?.distributioncenter?.companyName;
        this.userEmail = para?.general?.email;
      }
    }

    let response = await this._headerFooterService.getCartDetailsV1(
      userId,
      sessionId,
      0,
      10000,
      '',
      '',
      false
    );

    if (!!response) {
      let cartData: any = response;
      if (cartData.data.products) {
        this.cartProducts = cartData.data.products;
        console.log(this.cartProducts);
      }
    }

    if (this._companyService.productListing == 'grid') {
      this.innerWidth = window.innerWidth;
      if (this.innerWidth <= 500) {
        this.contentClass = '';
        this.mobileView = true;
      } else if (this.innerWidth > 500) {
        this.contentClass = 'leftRightMargin';
        this.mobileView = false;
      }
      this.sortColumns();
    }

    this.selected = [];
    // console.log("ngOnInit query ", this.query, " filters ", this.filters);
    this.checkDevice();
    // if (this.platform.is('desktop') || this.platform.is('ipad')) {
    //   this.onMobile = false;
    // } else {
    //   this.onMobile = true;
    // }
    // console.log("on mobile ", this.onMobile, this.perPage);

    this.userData = await this.storage.get('userData');
    this.userType = await this.storage.get('userType');
    await this.loadCompanyData();
    await this.getTransformationTypes();

    if (!!this.userData) this.loadSavedSearches();

    if (this.filters) {
      this.loadMoreData = [];
      this.callSearchRefinements = false;
      await this.addFilters();
    } else {
      this.loadMoreData = [];
      if (this.postQueryObj) {
        await this.search(
          this.postQueryObj,
          this.index,
          this.currentPage,
          false
        );
      } else {
        await this.search(this.query, this.index, this.currentPage, false);
      }
    }
  }

  refeshGridValueTrue() {
    this.refreshGrid = true;
    this.refreshMobileGrid = true;
  }

  refeshGridValueFalse() {
    setTimeout(() => {
      this.refreshGrid = false;
      this.refreshMobileGrid = false;
    }, 100);
  }

  dataSorted(event: any) {
    this.gridResultsSorted = true;
    console.log(event);
  }

  ngOnDestroy() {
    //this._companyService.productListing = "grid"
    // console.log("ngOnDestroy called ")
    if (this.esFilters && this.esFilters.length > 0) {
      this.esFilters.filter((f: any) => {
        if (f.isRefined) {
          f.isRefined = false;
        }
        f.values.filter((v: any) => (v.isRefined = false));
      });
    }
  }

  async ngOnChanges() {
    // console.log("ngOnChanges calling ", this.searchFirstTime, this.query);
    if (!this.searchFirstTime) {
      // console.log("ngOnChanges called ", this.query);
      this.fixFilters &&
        this.fixFilters.forEach((f: any) => {
          let termsQry = this.esTermsQuery(f.name, f.values);
          this.query.query.bool.should[1].bool.must.push(termsQry);
        });
      this.callFavorites();

      if (this.filters) {
        this.callSearchRefinements = false;
        await this.addFilters();
      } else {
        await this.search(this.query, this.index, this.currentPage, false);
        this.loadInspectView();
      }
    }
  }

  async loadInspectView() {
    if (!this.inspectionView) {
      this.searchPageButtons = this.searchPageAllButtons.filter(
        (x: any) => x.name != 'List View'
      );
    } else {
      this.searchPageButtons = this.searchPageAllButtons.filter(
        (x: any) => x.name != 'Virtual Inspection'
      );
    }

    if (this.distributioncenter != 'Mumbai') {
      this.searchPageButtons = this.searchPageButtons.filter(
        (x: any) => x.name != 'Book Appointment'
      );
    }
  }

  viewCertificate(data: any) {
    // window.open(data['certificate'], '_blank');
    if (this.mobileView && !this.webViewMobile) {
      this.previewAnyFile.preview(data['certificate']).then(
        (res: any) => {
          console.log('file : ' + res);
          //this.configService.presentToast("File Downloaded", "success");
        },
        (error) => {
          // handle error
          console.error(error);
        }
      );
    } else {
      if (this.isIpad && !this.webViewMobile) {
        this.previewAnyFile.preview(data['certificate']).then(
          (res: any) => {
            console.log('file : ' + res);
            //this.configService.presentToast("File Downloaded", "success");
          },
          (error) => {
            // handle error
            console.error(error);
          }
        );
      } else {
        window.open(data['certificate'], '_blank');
      }
    }
  }

  async sortColumns() {
    if (this.mobileView) {
      // this.searchResultColumns = this.searchResultColumns.filter(x => {
      //   if (x.name == 'Stone ID' || x.name == 'Rap' || x.name == 'Discount' || x.name == 'Price') {
      //     return x
      //   }
      // })
      // this.searchResultColumns = this.searchResultColumns.sort((a, b) => {
      //   return a.mobileViewOrder - b.mobileViewOrder;
      // });

      this.searchResultColumns = this.mobileColumns;
    } else {
      this.searchResultColumns = this.desktopColumns;
      this.searchResultColumns = this.searchResultColumns.sort((a, b) => {
        return a.orderBy - b.orderBy;
      });
    }
  }

  async loadCompanyData() {
    if (this._companyService.companyObj && this._companyService.companyObj) {
      if (!!this._companyService.companyObj.companyLogo) {
        this.companyLogo = this._companyService.companyObj.companyLogo;
      }
      if (this._companyService.companyObj.config) {
        let companyJson = this._companyService.companyObj.config;
        if (!!companyJson) {
          if (!!companyJson.externalProduct) {
            this.kgPricing = companyJson.externalProduct;
          }

          if (!!companyJson.export) {
            if (!!companyJson.export.searchResultColumns) {
              this.desktopColumns = companyJson.export.searchResultColumns;
            }

            if (!!companyJson.export.searchResultMobileColumns) {
              this.mobileColumns = companyJson.export.searchResultMobileColumns;
            }

            if (!!companyJson.searchResultExport) {
              this.searchResultExport = companyJson.searchResultExport;
            }
            if (!!companyJson.shortCodes) {
              this.shortCodes = companyJson.shortCodes;
            }
            this.sortColumns();
          }
          if (!!companyJson.fixSearchFilters) {
            this.fixFilters = companyJson.fixSearchFilters;
            this.fixFilters.forEach((f: any) => {
              if (!!f.query) {
                this.query.query.bool.should[1].bool.must.push(f.query);
              } else {
                let termsQry = this.esTermsQuery(f.name, f.values);
                this.query.query.bool.should[1].bool.must.push(termsQry);
              }
            });
          }

          if (!!companyJson.searchPageButtons) {
            this.searchPageAllButtons = companyJson.searchPageButtons;
            this.loadInspectView();
          }

          if (typeof companyJson.DisableSavedSearches) {
            this.DisableSavedSearches = companyJson.DisableSavedSearches;
          }

          if (!!companyJson.KYCrequired) {
            this.checkKYC = companyJson.KYCrequired;
          }

          if (!!companyJson.hideStorePrice) {
            this.hideStorePrice = companyJson.hideStorePrice;
          }

          if (!!companyJson.esFilters) {
            this.esFilters = companyJson.esFilters;
            await this.getCount(this.query, false);
          }

          if (typeof companyJson.hideFavourites != 'undefined') {
            this.hideFavourites = companyJson.hideFavourites;
          }
          if (!!companyJson.showSKU) {
            this.showSKU = companyJson.showSKU;
          }
          if (!!companyJson.showProductId) {
            this.showProductId = companyJson.showProductId;
          }

          if (!!companyJson.showCartInSearchColumns && !this.mobileView) {
            this.showCart = companyJson.showCartInSearchColumns;
            let obj = {
              fieldName: 'stoneName',
              name: 'ADD TO CART',
              type: 'string',
              orderBy: 53,
              allowDeleting: false,
              showAddToCart: true,
            };
            let isFound = await this.searchResultColumns.find(
              (x: any) => x.name == 'ADD TO CART'
            );
            if (!isFound) {
              this.searchResultColumns.push(obj);
              this.refreshGrid = true;
              setTimeout(() => {
                this.refreshGrid = false;
              }, 1000);
            }
          }
        }
      }
    }
  }
  /**
   * Elasticsearch misbehaves if users enter symbolic characters. User this method to strip out any such characters.
   * @param query - user search query.
   */
  public sanitized(query: any) {
    // console.log("query ", query);
    // if (!!query)
    //   return query.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
    // else
    return query;
  }

  algolia(loadOption: any) {
    let wildcard: any = {},
      must_not: any = {},
      search: any = '';
    let indivisualFilter = [],
      searchFilter = '',
      loadOptions: any = loadOption.filter;
    if (!!loadOption.filter) {
      let options: any = loadOptions;
      if (
        loadOptions[1] == 'and' &&
        Array.isArray(options[0]) &&
        Array.isArray(options[2]) &&
        (options[0][1] == 'or' || options[2][1] == 'or')
      ) {
        let first: any = options[0]
          .map((keys) => Array.isArray(keys) && keys[2])
          .filter((res) => !!res)
          .filter((v, i, a) => a.indexOf(v) === i);
        let secound: any = options[2]
          .map((keys) => Array.isArray(keys) && keys[2])
          .filter((res) => !!res)
          .filter((v, i, a) => a.indexOf(v) === i);
        if (first.length == 1) {
          searchFilter = first[0];
          indivisualFilter = options[2];
        } else if (secound.length == 1) {
          searchFilter = secound[0];
          indivisualFilter = options[0];
        } else {
          // console.log("======something Wrong ====");
        }
      } else if (!Array.isArray(loadOption.filter[0])) {
        indivisualFilter = [loadOption.filter];
      } else {
        let first: any = options
          .map((keys: any) => Array.isArray(keys) && keys[2])
          .filter((res: any) => !!res)
          .filter((v: any, i: any, a: any) => a.indexOf(v) === i);
        if (first.length == 1) {
          searchFilter = first[0];
        } else {
          indivisualFilter = options;
        }
      }
      if (indivisualFilter.length > 0) {
        indivisualFilter.filter((loadOption: any) => {
          if (loadOption.length > 0) {
            switch (loadOption[1]) {
              case 'contains':
                wildcard[loadOption[0]] = '*' + loadOption[2] + '*';
                break;
              case 'notcontains':
                must_not[loadOption[0]] = '*' + loadOption[2] + '*';
                break;
              case 'startswith':
                wildcard[loadOption[0]] = loadOption[2] + '*';
                break;
              case 'endswith':
                wildcard[loadOption[0]] = '*' + loadOption[2];
                break;
              case '=':
                wildcard[loadOption[0]] = loadOption[2];
                break;
              case '<>':
                must_not[loadOption[0]] = loadOption[2];
                break;
              default:
                break;
            }
          }
        });
      }
      if (searchFilter.length > 0) {
        search = '*' + searchFilter + '*';
      }
    }
    return { wildcard, must_not, search };
  }

  /*|||||||||||||| Checking for ShapeCode, if it is not 'round', than removing 'CutCode' ||||||||||||||*/
  checkingShapeCode(res: any) {
    let checkRound = res['ShapeCode']?.toLowerCase();
    if (checkRound !== 'round') {
      res['CutCode'] = '';
    }
    return res;
  }

  /*|||||||||||||| updating stoneDetails for customStore ||||||||||||||*/
  update_stoneDetail(res: any) {
    res['stoneName'] = String(res['stoneName']);

    if (res['ShapeCode']) res = this.checkingShapeCode(res);

    if (res['CutCode']) {
      const cutObj: any = this.shortCodes.filter(
        (x: any) => x.label == res['CutCode']
      );
      if (cutObj.length > 0) res['CutCode'] = cutObj[0].code;
    }

    if (res['PolishCode']) {
      const polishObj: any = this.shortCodes.filter(
        (x: any) => x.label == res['PolishCode']
      );
      if (polishObj.length > 0) res['PolishCode'] = polishObj[0].code;
    }

    if (res['SymmetryCode']) {
      const symmetryObj: any = this.shortCodes.filter(
        (x: any) => x.label == res['SymmetryCode']
      );
      if (symmetryObj.length > 0) res['SymmetryCode'] = symmetryObj[0].code;
    }

    if (res['RAPAPORTpercarat'] && res['cts'])
      res['RapAmt'] = res['RAPAPORTpercarat'] * res['cts'];
    else res['RapAmt'] = 0;

    if (res['Rapnet_plus'])
      res['Rapnet_plus'] = Math.round(res['Rapnet_plus'] * 100) / 100;

    const shapeCode =
      res['eliteShapeCode'] || res['standardShapeCode'] || res['ShapeCode'];

    res['ShapeCode'] = shapeCode;

    //for Fancy ColorCode
    if (res?.['ColorCode']?.toLowerCase() === 'fancy') {
      res['ColorCode'] = this.es.check_colorCode_fancy(
        res['FancyColorCode'],
        res['FancyColorIntensityCode'],
        res['FancyColorOvertoneCode'],
        res['ColorCode']
      );
      res['ColorCodeFancy'] = 'FANCY';
    } else {
      res['ColorCodeFancy'] = '';
    }

    let stoneName = res.name || res.stoneName;
    if (!!res.kgStoneId) {
      stoneName = res.kgStoneId;
    }

    res['idealImage'] = this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://stackg.azureedge.net/v360azurekg/V360_5_0/imaged/${stoneName}/still.jpg`
    );
    let lab = res['lab'];
    let ReportNo = res['ReportNo'];
    res[
      'videoLink'
    ] = `https://stackg.azureedge.net/v360azurekg/V360_5_0/Vision360.html?d=${stoneName}`;
    res['videoPlayLink'] = this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://stackg.azureedge.net/v360azurekg/V360_5_0/Vision360.html?d=${stoneName}&btn=0&sv=0&z=0`
    );
    res[
      'certificate'
    ] = `https://kgmediaprod.blob.core.windows.net/certificates/${lab}/${ReportNo}.pdf`;

    if (this.cartProducts.length > 0) {
      let item: any = this.cartProducts.filter(
        (x: any) => (x.stoneName || x.sku) == stoneName
      )[0];
      if (!!item) {
        console.log(item);
        res['refCartID'] = item.refCartID;
        res['refCartProductId'] = item.refCartProductId;
      }
    }

    return res;
  }

  /**
   * Search function.
   * @param query - user input.
   * @param index - ES index to search.
   * @param page  - page.
   */
  async search(query: any, index: any, page: any, addToExistingArray = false) {
    let checkStones =
      query?.query?.bool?.should[1]?.bool?.must[2]?.bool?.should;
    let sanitized = await this.sanitized(query);
    // console.log("sanitized ", sanitized), this.perPage;
    if (!!sanitized && Object.keys(sanitized).length > 0) {
      this.inspectionView = false;
      if (this._companyService.productListing == 'grid') {
        this.searchFirstTime = false;
        this.showSpinner = false;
        this.hits = new CustomStore({
          load: async (loadOptions: any) => {
            let subqry = JSON.parse(JSON.stringify(query));
            let body: any = {};

            //console.log("loadOptions ", loadOptions);
            if (!!loadOptions.filter) {
              let { wildcard, must_not, search } = this.algolia(loadOptions);
              if (!subqry.query) {
                subqry.query = {};
              }
              if (!subqry.query.bool) {
                subqry.query.bool = {};
              }
              if (!subqry.query.bool.must) {
                subqry.query.bool.must = [];
              }
              if (!subqry.query.bool.must_not) {
                subqry.query.bool.must_not = [];
              }
              Object.keys(wildcard).filter((regkey) => {
                let wildcards: any = {};
                wildcards[regkey] = wildcard[regkey];
                subqry.query.bool.must.push({ wildcard: wildcards });
              });

              Object.keys(must_not).filter((regkey) => {
                let mustNot: any = {};
                mustNot[regkey] = must_not[regkey];
                subqry.query.bool.must_not.push({ wildcard: mustNot });
              });
              if (search) {
                subqry.query.bool.must.push({
                  query_string: {
                    query: search,
                  },
                });
              }
            }
            subqry.sort = [];

            if (!!loadOptions.sort) {
              loadOptions.sort.filter((sorting: any) => {
                let sort: any = {};
                sort[sorting.selector] = {
                  order: sorting.desc ? 'desc' : 'asc',
                };
                subqry.sort.push(sort);
              });
            }

            if ([10, 20, 50, 100, 500].indexOf(loadOptions.take) == -1) {
              loadOptions.take = this.take;
            } else {
              this.take = loadOptions.take;
            }

            if (!loadOptions.skip) {
              loadOptions.skip = 0;
            }
            if (!loadOptions.take || loadOptions.take == 0) {
              delete loadOptions.take;
            }
            if (this.onMobile) {
              this.pageSize = this.take = loadOptions.take = 20;
            }
            this.pageSize = this.take;
            sanitized = await this.sanitized(subqry);
            if (index !== 'all') {
              body = await this.es.getPaginatedDocuments(
                sanitized,
                loadOptions.skip,
                index,
                '',
                loadOptions.take
              );
            } else {
              body = await this.es.getPaginatedDocuments(
                sanitized,
                loadOptions.skip,
                '',
                '',
                loadOptions.take
              );
            }
            this.esData = body.hits.hits;
            this.esData.filter((h) => {
              let isFound =
                !!this.loadMoreData &&
                this.loadMoreData.find(
                  (x: any) => x._source.stoneName == h._source.stoneName
                );
              if (!isFound) {
                this.loadMoreData.push(h);
              }
            });
            this.totalHits = body.hits.total.value;

            if (
              !!checkStones &&
              checkStones.length == 1 &&
              this.totalHits == 0
            ) {
              this.configService.presentToast(
                'Stone is not available',
                'error'
              );
            }

            //console.log("total esData:", this.esData, this.totalHits, this.loadMoreData)
            if (!!loadOptions.group && loadOptions.group.length > 0) {
              if (loadOptions.group[0].selector) {
                this.resultColumns = this.resultColumns.map((res: any) => {
                  if (res.fieldName == loadOptions.group[0].selector) {
                    res.groupIndex = 0;
                  }
                  return res;
                });
                let dataRes = Query(
                  body.hits.hits
                    .map((d: any) => d._source)
                    .filter((res: any) => {
                      return this.update_stoneDetail(res);
                    })
                );

                this.totalNumOfStones = body.hits.total.value;

                return {
                  data: dataRes
                    .groupBy(loadOptions.group[0].selector)
                    .toArray(),
                  totalCount: body.hits.total.value,
                  groupCount: body.hits.total.value,
                };
              }
            } else {
              let data = body.hits.hits
                .map((d: any) => d._source)
                .filter((res: any) => {
                  return this.update_stoneDetail(res);
                });

              let i = 0;
              let newProducts = data.map((a) => ({
                index: i++,
                productName: !!a.productName
                  ? a.productName
                  : !!a.stoneName
                  ? a.stoneName
                  : a.id,
                location: !!a.currentLocation ? a.currentLocation : '',
              }));

              if (!this.gridResultsSorted) {
                this.productDetailPageList =
                  this.productDetailPageList.concat(newProducts);
              } else {
                this.productDetailPageList = newProducts;
              }

              this.totalNumOfStones = body.hits.total.value;

              return {
                data: data,
                totalCount: body.hits.total.value,
              };
            }
          },
        });
        console.log(this.hits);
      } else {
        sanitized.sort = [];
        if (!!this.orderBy) {
          let sort: any = {};
          sort[this.orderBy.field] = {
            order: this.orderBy.ascDesc,
            missing: '_last',
          };
          sanitized.sort.push(sort);
        }

        // let clrSort = {};
        // clrSort['ColorCode'] = {
        //   order: 'asc',
        // };
        // sanitized.sort.push(clrSort);

        let ctsSort: any = {};
        ctsSort['cts'] = {
          order: 'desc',
        };
        sanitized.sort.push(ctsSort);

        this.searchResponse = '';
        this.searchFirstTime = false;
        let from = (page - 1) * this.perPage;
        // this.currentPage = page;
        // Search all indexes on ES
        if (index !== 'all') {
          let body = await this.es.getPaginatedDocuments(
            sanitized,
            from,
            index
          );
          this.showSpinner = false;
          if (!!body.hits.total.value) {
            this.esData = body.hits.hits;
            this.totalHits = body.hits.total.value;
            this.searchTime = body.hits.took;

            // this.totalPages = Array.from(Array(Math.ceil(body.hits.total.value / this.perPage)), (_, i) => i + 1);
            this.totalPages = Math.ceil(body.hits.total.value / this.perPage);

            // // console.log("this.esData 0 ", body, this.esData);
            this.isFirstPage = true;
            if (this.totalPages == 1) {
              this.isLastPage = true;
            } else {
              this.isLastPage = false;
            }
          } else {
            this.esData = [];
            this.searchResponse = 'No matches found';
            this.totalPages = 0;
          }
        } else {
          this.es.getPaginatedDocuments(sanitized, from).then(
            (body) => {
              this.showSpinner = false;
              if (!!body.hits.total.value) {
                this.esData = body.hits.hits;
                this.totalHits = body.hits.total;
                this.searchTime = body.took;
                this.totalPages = Math.ceil(body.hits.total / this.perPage);
                this.isFirstPage = true;
                if (this.totalPages == 1) {
                  this.isLastPage = true;
                } else {
                  this.isLastPage = false;
                }
              } else {
                this.esData = [];
                this.searchResponse = 'No matches found';
                this.totalPages = 0;
              }
            },
            (err) => {
              this.esData = [];
              this.searchResponse =
                'Oops! Something went wrong... ERROR: ' + err.error;
              this.totalPages = 0;
            }
          );
        }

        if (!!this.esData && this.esData.length > 0) {
          if (addToExistingArray && !!this.hits && this.hits.length > 0) {
            //let newHits = this.esData.map(d => d._source);
            let newHits = await this.esData
              .map((d) => d._source)
              .filter(async (res) => {
                return this.update_stoneDetail(res);

                // res['stoneName'] = String(res['stoneName']);

                // let stoneName = res.name || res.stoneName;
                // if (!!res.kgStoneId) {
                //   stoneName = res.kgStoneId;
                // }
                // if (res['ShapeCode']) {
                //   res = this.checkingShapeCode(res);
                // }

                // if (!!res.kgStoneId) {
                //   stoneName = res.kgStoneId;
                // }

                // if (res['CutCode']) {
                //   let cutObj = this.shortCodes.filter(
                //     x => x.label == res['CutCode']
                //   );
                //   if (cutObj.length > 0) {
                //     res['CutCode'] = cutObj[0].code;
                //   }
                // }

                // if (res['PolishCode']) {
                //   let cutObj = this.shortCodes.filter(
                //     x => x.label == res['PolishCode']
                //   );
                //   if (cutObj.length > 0) {
                //     res['PolishCode'] = cutObj[0].code;
                //   }
                // }

                // if (res['SymmetryCode']) {
                //   let cutObj = this.shortCodes.filter(
                //     x => x.label == res['SymmetryCode']
                //   );
                //   if (cutObj.length > 0) {
                //     res['SymmetryCode'] = cutObj[0].code;
                //   }
                // }

                // if (res['RAPAPORTpercarat'] && res['cts']) {
                //   let rapAmt = res['RAPAPORTpercarat'] * res['cts'];
                //   res['RapAmt'] = rapAmt;
                // } else {
                //   res['RapAmt'] = 0;
                // }

                // if (res['Rapnet_plus'])
                //   res['Rapnet_plus'] =
                //     Math.round(res['Rapnet_plus'] * 100) / 100;

                // let shapeCode =
                //   res['eliteShapeCode'] ||
                //   res['standardShapeCode'] ||
                //   res['ShapeCode'];

                // res['ShapeCode'] = shapeCode;

                // //for Fancy ColorCode
                // if (res?.['ColorCode']?.toLowerCase() === 'fancy') {
                //   res['ColorCode'] = this.es.check_colorCode_fancy(
                //     res['FancyColorCode'],
                //     res['FancyColorIntensityCode'],
                //     res['FancyColorOvertoneCode'],
                //     res['ColorCode']
                //   );
                //   res['ColorCodeFancy'] = 'FANCY';
                // } else {
                //   res['ColorCodeFancy'] = '';
                // }

                // res['idealImage'] =
                //   this.sanitizer.bypassSecurityTrustResourceUrl(
                //     `https://stackg.azureedge.net/v360azurekg/V360_5_0/imaged/${stoneName}/still.jpg`
                //   );
                // let lab = res['lab'];
                // let ReportNo = res['ReportNo'];
                // res[
                //   'videoLink'
                // ] = `https://stackg.azureedge.net/v360azurekg/V360_5_0/Vision360.html?d=${stoneName}`;
                // res['videoPlayLink'] =
                //   this.sanitizer.bypassSecurityTrustResourceUrl(
                //     `https://stackg.azureedge.net/v360azurekg/V360_5_0/Vision360.html?d=${stoneName}&btn=0&sv=0&z=0`
                //   );
                // res[
                //   'certificate'
                // ] = `https://kgmediaprod.blob.core.windows.net/certificates/${lab}/${ReportNo}.pdf`;

                // if (this.cartProducts.length > 0) {
                //   let item: any = await this.cartProducts.filter(
                //     x => String(x.stoneName) == res['stoneName']
                //   )[0];

                //   if (!!item) {
                //     console.log(item);

                //     res['refCartID'] = item.refCartID;
                //     res['refCartProductId'] = item.refCartProductId;
                //   }
                // }

                // if (res['CutCode']) {
                //   res['CutCode'] = this.shortCodes.filter(x => x.label == res['CutCode'])[0].code
                // }

                // return res;
              });

            Array.prototype.push.apply(this.hits, newHits);
          } else {
            //this.hits = this.esData.map(d => d._source);
            this.hits = await this.esData
              .map((d) => d._source)
              .filter((res) => {
                return this.update_stoneDetail(res);

                // res['stoneName'] = String(res['stoneName']);

                // let stoneName = res.name || res.stoneName;
                // if (!!res.kgStoneId) {
                //   stoneName = res.kgStoneId;
                // }

                // if (res['ShapeCode']) {
                //   res = this.checkingShapeCode(res);
                // }

                // if (res['CutCode']) {
                //   let cutObj = this.shortCodes.filter(
                //     x => x.label == res['CutCode']
                //   );
                //   if (cutObj.length > 0) {
                //     res['CutCode'] = cutObj[0].code;
                //   }
                // }

                // if (res['PolishCode']) {
                //   let cutObj = this.shortCodes.filter(
                //     x => x.label == res['PolishCode']
                //   );
                //   if (cutObj.length > 0) {
                //     res['PolishCode'] = cutObj[0].code;
                //   }
                // }

                // if (res['SymmetryCode']) {
                //   let cutObj = this.shortCodes.filter(
                //     x => x.label == res['SymmetryCode']
                //   );
                //   if (cutObj.length > 0) {
                //     res['SymmetryCode'] = cutObj[0].code;
                //   }
                // }
                // if (res['RAPAPORTpercarat'] && res['cts']) {
                //   let rapAmt = res['RAPAPORTpercarat'] * res['cts'];
                //   res['RapAmt'] = rapAmt;
                // } else {
                //   res['RapAmt'] = 0;
                // }

                // let shapeCode =
                //   res['eliteShapeCode'] ||
                //   res['standardShapeCode'] ||
                //   res['ShapeCode'];

                // res['ShapeCode'] = shapeCode;

                // //for Fancy ColorCode
                // if (res?.['ColorCode']?.toLowerCase() === 'fancy') {
                //   res['ColorCode'] = this.es.check_colorCode_fancy(
                //     res['FancyColorCode'],
                //     res['FancyColorIntensityCode'],
                //     res['FancyColorOvertoneCode'],
                //     res['ColorCode']
                //   );
                //   res['ColorCodeFancy'] = 'FANCY';
                // } else {
                //   res['ColorCodeFancy'] = '';
                // }

                // res['idealImage'] =
                //   this.sanitizer.bypassSecurityTrustResourceUrl(
                //     `https://stackg.azureedge.net/v360azurekg/V360_5_0/imaged/${stoneName}/still.jpg`
                //   );
                // let lab = res['lab'];
                // let ReportNo = res['ReportNo'];
                // res[
                //   'videoLink'
                // ] = `https://stackg.azureedge.net/v360azurekg/V360_5_0/Vision360.html?d=${stoneName}`;
                // res['videoPlayLink'] =
                //   this.sanitizer.bypassSecurityTrustResourceUrl(
                //     `https://stackg.azureedge.net/v360azurekg/V360_5_0/Vision360.html?d=${stoneName}&btn=0&sv=0&z=0`
                //   );
                // res[
                //   'certificate'
                // ] = `https://kgmediaprod.blob.core.windows.net/certificates/${lab}/${ReportNo}.pdf`;

                // if (this.cartProducts.length > 0) {
                //   let item: any = this.cartProducts.filter(
                //     x => String(x.stoneName) == res['stoneName']
                //   )[0];

                //   if (!!item) {
                //     res['refCartID'] = item.refCartID;
                //     res['refCartProductId'] = item.refCartProductId;
                //   }
                // }

                // if (res['CutCode']) {
                //   res['CutCode'] = this.shortCodes.filter(x => x.label == res['CutCode'])[0].code
                // }

                // return res;
              });
          }
          let aa = this.hits;
          let i = 1;
          let newProducts = aa.map((a) => ({
            objectID: a.id,
            index: i++,
            productName: !!a.productName ? a.productName : a.id,
            location: !!a.currentLocation ? a.currentLocation : '',
          }));
          this.productDetailPageList =
            this.productDetailPageList.concat(newProducts);
        }
      }
    } else {
      this.searchResponse = 'Nothing found';
    }

    this.refreshGrid = true;
    setTimeout(() => {
      this.refreshGrid = false;
    }, 500);
  }

  async nextPage(infiniteScroll: any = false) {
    const sanitized = this.sanitized(this.query);
    if (!!sanitized) {
      if (this.currentPage < this.totalPages) {
        this.currentPage = this.currentPage + 1;
        await this.search(this.query, this.index, this.currentPage, true);
        infiniteScroll && infiniteScroll.target.complete();
      } else {
        infiniteScroll.target.disabled = true;
      }
    } else {
      this.esData = [];
      this.searchResponse = 'Nothing found';
      infiniteScroll.target.disabled = true;
    }
  }

  async previousPage() {
    const sanitized = this.sanitized(this.query);
    if (!!sanitized) {
      if (this.currentPage - 1 >= 1) {
        this.currentPage = this.currentPage - 1;
        await this.search(this.query, this.index, this.currentPage, true);
      }
    } else {
      this.esData = [];
      this.searchResponse = 'Nothing found';
    }
  }

  async pagination(page: any) {
    // console.log("pagination ", page);
    this.currentPage = page;
    const sanitized = this.sanitized(this.query);
    // console.log("selected page ", sanitized.length, this.currentPage);
    if (!!sanitized) {
      if (this.currentPage >= 1) {
        await this.search(this.query, this.index, this.currentPage, false);
      }
    } else {
      this.esData = [];
      this.searchResponse = 'Nothing found';
    }
  }

  esTermsQuery(paramName: any, valueArr: any) {
    let termsQry: any = {
      terms: {},
    };

    termsQry.terms[paramName] = [];
    for (let i = 0; i < valueArr.length; i++) {
      termsQry.terms[paramName].push(valueArr[i]);
    }

    return termsQry;
  }

  esRangeQuery(paramName: any, from: any, to: any) {
    let rangeQry: any = {
      range: {},
    };
    rangeQry.range[paramName] = {};
    //from
    if (!!from) rangeQry.range[paramName]['gte'] = from;

    //to size
    if (!!to) rangeQry.range[paramName]['lte'] = to;

    if (!!from || !!to) {
      return rangeQry;
    } else {
      return null;
    }
  }

  async showSideFilter() {
    if (this._companyService.productListing == 'grid') {
      this.navCtrl.pop();
    } else {
      this.showFilters = !this.showFilters;
    }
  }

  async openBookAppointmentPopup(formData: any) {
    const bookAppointmentModal = await this.modalCtrl.create({
      component: BookAppointmentComponent,
      cssClass: 'book-appointment-popup',
      componentProps: {
        formData: formData,
        refCompanyId: this._companyService.refCompanyId,
      },
    });

    bookAppointmentModal.present();

    const { data, role } = await bookAppointmentModal.onWillDismiss();

    if (role === 'closeedAfterBooking') this.refresh();
  }

  check_externalStatus(type: string): boolean {
    const actualSelectedLength = this.selected.length;
    let hasOnMemoStone: boolean = false;

    this.selected = this.selected.filter(
      (stone: any) => stone.externalStatus?.toLowerCase() !== 'on memo'
    );

    if (actualSelectedLength !== this.selected.length) {
      hasOnMemoStone = true;
      if (!this.selected.length) {
        this.refeshGridValueTrue();
        this.refeshGridValueFalse();
      }

      this.configService.presentToast(
        `Status of some stones are 'On Memo'. ${
          type === 'Purchase'
            ? 'You can not purchase those stones.'
            : 'You can not add those stones into cart.'
        }`,
        'error'
      );
    }

    return hasOnMemoStone;
  }

  async actionButtonClick(btn: any) {
    if (btn.name == 'Book Appointment') {
      await this.configService.showLoading();
      if (this.selected.length > 0) {
        let checkActions = await this.checkActions(
          btn.allowedActions,
          this.selected
        );
        if (checkActions) {
          this.userId = await this.storage.get('userID');
          // console.log("this.userId", this.userId);
          this.sessionId = await this.storage.get('sessionID');
          let selectedVariantObj = [];
          let formVariantObj = [];
          let stoneArray = [];
          // for (let i = 0; i < this.selected.length; i++) {
          //   let sId = this.selected[i];
          //   let obj = {
          //     discount: !!sId[this.kgPricing.kgAppliedDiscount]
          //       ? sId[this.kgPricing.kgAppliedDiscount]
          //       : 0,
          //     price: !!sId[this.kgPricing.kgAppliedPrice]
          //       ? sId[this.kgPricing.kgAppliedPrice].toFixed(2)
          //       : 0,
          //     amount: !!sId[this.kgPricing.kgAppliedAmount]
          //       ? sId[this.kgPricing.kgAppliedAmount].toFixed(2)
          //       : 0,
          //     ...sId
          //   }
          //   // let obj = {
          //   //   stoneId: sId.stoneName,
          //   //   lab: sId.lab,
          //   //   ShapeCode: sId.ShapeCode,
          //   //   ColorCode: sId.ColorCode,
          //   //   ClarityCode: sId.ClarityCode,
          //   //   cts: sId.cts,
          //   //   discount: !!sId[this.kgPricing.kgAppliedDiscount]
          //   //     ? sId[this.kgPricing.kgAppliedDiscount]
          //   //     : 0,
          //   //   price: !!sId[this.kgPricing.kgAppliedPrice]
          //   //     ? sId[this.kgPricing.kgAppliedPrice].toFixed(2)
          //   //     : 0,
          //   //   amount: !!sId[this.kgPricing.kgAppliedAmount]
          //   //     ? sId[this.kgPricing.kgAppliedAmount].toFixed(2)
          //   //     : 0,
          //   //   color: sId.ColorCode,
          //   //   clarity: sId.ClarityCode,
          //   //   cut: sId.CutCode,
          //   //   polish: sId.PolishCode,
          //   //   symm: sId.SymmetryCode,
          //   //   fluor: sId.FluorescenceCode,
          //   //   status: sId.externalStatus,
          //   //   reportNo: sId.ReportNo,
          //   //   location: sId.location,
          //   // };
          //   stoneArray.push(obj);
          // }
          let processName = 'Schedule Viewing';
          let frmdata = {
            userId: this.userId,
            stones: this.selected,
          };
          //await this.configService.hideLoading();
          // this.refreshGrid = true;
          // this.refreshMobileGrid = true;
          await this.configService.hideLoading();
          this.openBookAppointmentPopup(frmdata); //new addition
        } else {
          await this.configService.hideLoading();
          this.configService.presentToast('Action not Allowed', 'error');
        }
      } else {
        await this.configService.hideLoading();
        this.configService.presentToast('Please select stones', 'error');
      }

      // this.router.navigateByUrl(
      //   '/ngx-form?processName=' + processName
      // );
      // } else if (btn.name == "Purchase") {
      //   let navigationExtras: NavigationExtras = {
      //     queryParams: {
      //       view: "address"
      //     }
      //   };
      //   await this.configService.hideLoading();
      //   this.refreshGrid = true;
      //   this.refreshMobileGrid = true;
      //   this.router.navigate(["/manage-orders"], navigationExtras);
      return;
    } else {
      let resKYC = await this.checkForKYC(btn);
      let hasOnMemoStone: boolean = false;

      if (resKYC) {
        this.loggedInUser = await this.storage.get('loggedInUser');
        if (
          !!this.loggedInUser ||
          btn.name == 'Add To Cart' ||
          btn.name == 'Ask KAM' ||
          btn.name == 'Virtual Inspection' ||
          btn.name == 'Purchase'
        ) {
          if (btn.name == 'Ask KAM') {
            this.configService.showLoading();
            if (this.selected.length > 0) {
              let checkActions = await this.checkActions(
                btn.allowedActions,
                this.selected
              );
              if (checkActions) {
                let stoneArray = [];
                for (let i = 0; i < this.selected.length; i++) {
                  let sId = this.selected[i];
                  let obj = {
                    stoneId: sId.stoneName,
                    lab: sId.lab,
                    ShapeCode: sId.ShapeCode,
                    ColorCode: sId.ColorCode,
                    ClarityCode: sId.ClarityCode,
                    cts: sId.cts,
                  };
                  stoneArray.push(obj);
                }
                let processName = 'Ask KAM';
                let frmdata = {
                  stones: stoneArray,
                };

                this._ngxFormService.frmData = JSON.stringify(frmdata);
                await this.configService.hideLoading();
                this.router.navigateByUrl(
                  '/ngx-form?processName=' + processName
                );
              } else {
                await this.configService.hideLoading();
                this.configService.presentToast('Action not Allowed', 'error');
              }
              this.refeshGridValueTrue();
              this.refeshGridValueFalse();
            } else {
              await this.configService.hideLoading();
              this.configService.presentToast('Please select stones', 'error');
            }
          } else if (btn.name == 'List View') {
            this.inspectionView = false;
            this.refeshGridValueTrue();
            this.refeshGridValueFalse();
            this.loadInspectView();
          } else if (btn.name == 'Virtual Inspection') {
            if (this.selected.length > 0) {
              this.inspectionView = true;
              this.refeshGridValueTrue();
              this.refeshGridValueFalse();
              this.loadInspectView();
            } else {
              this.configService.presentToast('Please select stones', 'error');
            }
          } else if (btn.name == 'Purchase') {
            await this.configService.showLoading();
            let orderBook = btn.orderBook;

            if (!!this.selected && this.selected.length)
              hasOnMemoStone = this.check_externalStatus(btn.name);

            if (this.selected.length > 0) {
              let checkActions = await this.checkActions(
                btn.allowedActions,
                this.selected
              );
              if (checkActions) {
                this.userId = await this.storage.get('userID');
                // console.log("this.userId", this.userId);
                this.sessionId = await this.storage.get('sessionID');
                let selectedVariantObj = [];
                let formVariantObj = [];
                let stoneArray = [];

                for (let i = 0; i < this.selected.length; i++) {
                  let sId = this.selected[i];
                  //console.log(`this is id = ${sId}`)
                  let obj = {
                    stoneId: sId.stoneName,
                    lab: sId.lab,
                    ShapeCode: sId.ShapeCode,
                    ColorCode: sId.ColorCode,
                    ClarityCode: sId.ClarityCode,
                    cts: sId.cts,
                  };
                  stoneArray.push(obj);

                  let resProd: any =
                    await this._detailsService.getProductDetail(
                      this.selected[i].stoneName,
                      this.selected[i].currentLocation,
                      this.sessionId,
                      this.userId
                    );
                  if (resProd) {
                    selectedVariantObj.push({
                      PvID: resProd?.data[0]?.listOfVariants[0].id,
                      quantity: resProd?.data[0]?.cts,
                      discount:
                        resProd?.data[0]?.[this.kgPricing.kgAppliedDiscount],
                      taxes: 0,
                      //price: resProd.data[0].RAPAPORT
                    });

                    formVariantObj.push({
                      refPvID: resProd?.data[0]?.listOfVariants[0].id,
                      quantity: resProd?.data[0]?.cts,
                      discount:
                        resProd?.data[0]?.[this.kgPricing.kgAppliedDiscount],
                      taxes: 0,
                      //price: resProd.data[0].RAPAPORT
                    });
                  }
                }
                let res: any = await this._functionsService.addToPurchaseCart(
                  this.userId,
                  this.sessionId,
                  selectedVariantObj
                );
                if (!!res.isSuccess) {
                  // let navigationExtras: NavigationExtras = {
                  //   queryParams: {
                  //     view: "address"
                  //   }
                  // };
                  await this.configService.hideLoading();
                  this.refeshGridValueTrue();
                  this.refeshGridValueFalse();
                  //this.router.navigate(['/manage-orders']);
                  let navigationExtras: NavigationExtras = {
                    queryParams: {
                      cartId: res?.data.id,
                    },
                  };

                  this.selected.forEach((product: any) => {
                    const purchaseData =
                      this.mixPanelDataService.getPurchaseData(
                        product,
                        this.userId,
                        this.userData
                      );
                    this.analyticsService.addEvents('purchase', purchaseData);
                  });

                  this.router.navigate(['/manage-orders'], navigationExtras);
                } else {
                  await this.configService.hideLoading();
                  this.configService.presentToast('Some error occur', 'error');
                }
              } else {
                await this.configService.hideLoading();
                this.configService.presentToast('Action not Allowed', 'error');
              }
            } else {
              await this.configService.hideLoading();
              if (!hasOnMemoStone)
                this.configService.presentToast(
                  'Please select stones',
                  'error'
                );
            }
          } else {
            await this.configService.showLoading();

            let orderBook = btn.orderBook;

            hasOnMemoStone = this.check_externalStatus(btn.name);

            if (this.selected.length > 0) {
              let checkActions = await this.checkActions(
                btn.allowedActions,
                this.selected
              );
              if (checkActions) {
                this.userId = await this.storage.get('userID');
                // console.log("this.userId", this.userId);
                this.sessionId = await this.storage.get('sessionID');
                const selectedVariantObj: any = [];
                const formVariantObj = [];
                const stoneArray: any = [];
                const stonesZeroPrice: any = [];
                const stonesZeroPriceObj: any = {
                  stonesZeroPrice: [],
                };

                const productData: {
                  stoneName: string;
                  refKgCompanyId: number;
                }[] = this.selected.map((stone: any) => {
                  const sId: any = stone;
                  const obj: any = {
                    stoneId: sId.stoneName,
                    lab: sId.lab,
                    ShapeCode: sId.ShapeCode,
                    ColorCode: sId.ColorCode,
                    ClarityCode: sId.ClarityCode,
                    cts: sId.cts,
                  };
                  stoneArray.push(obj);

                  const price = sId[this.kgPricing.kgAppliedPrice];
                  if (price <= 0) {
                    stonesZeroPriceObj.stonesZeroPrice.push(sId.stoneName);
                    stonesZeroPriceObj[sId.stoneName] = true;
                  }

                  const resultObj = {
                    stoneName: stone.stoneName,
                    refKgCompanyId: stone.currentLocation,
                  };

                  return resultObj;
                });

                const productsDetails: any =
                  await this._detailsService.getMultipleProductDetail(
                    JSON.stringify(productData),
                    this.sessionId,
                    this.userId
                  );

                productsDetails.data.forEach((productDetail: any) => {
                  if (
                    productDetail &&
                    !stonesZeroPriceObj[productDetail.stoneName]
                  ) {
                    selectedVariantObj.push({
                      PvID: productDetail?.PvID,
                      quantity: productDetail?.cts,
                      discount:
                        productDetail?.[this.kgPricing.kgAppliedDiscount],
                      taxes: 0,
                      //price: productDetail.data[0].RAPAPORT
                    });

                    formVariantObj.push({
                      refPvID: productDetail?.PvID,
                      quantity: productDetail?.cts,
                      discount:
                        productDetail?.[this.kgPricing.kgAppliedDiscount],
                      taxes: 0,
                      //price: resProd.data[0].RAPAPORT
                    });
                  }
                });

                // for (let i = 0; i < this.selected.length; i++) {
                //   let sId = this.selected[i];
                //   let obj = {
                //     stoneId: sId.stoneName,
                //     lab: sId.lab,
                //     ShapeCode: sId.ShapeCode,
                //     ColorCode: sId.ColorCode,
                //     ClarityCode: sId.ClarityCode,
                //     cts: sId.cts,
                //   };
                //   stoneArray.push(obj);

                //   let resProd: any =
                //     await this._detailsService.getProductDetail(
                //       this.selected[i].stoneName,
                //       this.selected[i].currentLocation,
                //       this.sessionId,
                //       this.userId
                //     );

                //   let price = sId[this.kgPricing.kgAppliedPrice];
                //   if (price <= 0) {
                //     stonesZeroPrice.push(sId.stoneName);
                //   }
                //   if (resProd && price > 0) {
                //     selectedVariantObj.push({
                //       PvID: resProd.data[0]?.listOfVariants[0].id,
                //       quantity: resProd.data[0]?.cts,
                //       discount:
                //         resProd.data[0]?.[this.kgPricing.kgAppliedDiscount],
                //       taxes: 0,
                //       //price: resProd.data[0].RAPAPORT
                //     });

                //     formVariantObj.push({
                //       refPvID: resProd.data[0]?.listOfVariants[0].id,
                //       quantity: resProd.data[0]?.cts,
                //       discount:
                //         resProd.data[0]?.[this.kgPricing.kgAppliedDiscount],
                //       taxes: 0,
                //       //price: resProd.data[0].RAPAPORT
                //     });
                //   }
                // }

                let ids = [];
                for (let i = 0; i < stoneArray.length; i++) {
                  ids.push(stoneArray[i].stoneId);
                }

                if (!!this.userData && !!this.userData.name) {
                  this.analyticsService.addEvents('add to cart', {
                    stoneID: ids,
                    username: this.userData.name,
                    user: this.userData.username,
                  });
                }

                if (stonesZeroPrice.length > 0) {
                  await this.configService.hideLoading();
                  let string = stonesZeroPrice.join(',');
                  this.configService.presentToast(
                    string + ` has 0 price so can not add to cart.`,
                    'error'
                  );
                }

                if (selectedVariantObj.length > 0) {
                  let res: any = await this._functionsService.addMultipleToCart(
                    this.userId,
                    this.sessionId,
                    selectedVariantObj,
                    orderBook
                  );
                  if (!!res.isSuccess) {
                    if (btn.name == 'Memo') {
                      let navigationExtras: NavigationExtras = {
                        queryParams: {
                          ob: 'Memo',
                        },
                      };
                      await this.configService.hideLoading();
                      this.refeshGridValueTrue();
                      this.refeshGridValueFalse();
                      this.router.navigate(
                        ['/manage-orders'],
                        navigationExtras
                      );
                    } else {
                      await this.configService.hideLoading();
                      this.router.navigateByUrl(btn.action);
                    }
                  } else {
                    await this.configService.hideLoading();
                    this.configService.presentToast(
                      'Some error occur',
                      'error'
                    );
                  }
                }
              } else {
                await this.configService.hideLoading();
                this.configService.presentToast('Action not Allowed', 'error');
              }

              this.refeshGridValueTrue();
              this.refeshGridValueFalse();
            } else {
              await this.configService.hideLoading();
              if (!hasOnMemoStone)
                this.configService.presentToast(
                  'Please select stones',
                  'error'
                );
            }
          }
        } else {
          await this.configService.hideLoading();
          this.configService.presentToast('Please Login', 'error');
        }
      }
    }
  }

  async checkActions(allowedActions: any, selectedStones: any) {
    if (!!allowedActions) {
      for (let i = 0; i < selectedStones.length; i++) {
        let externalStatus = this.selected[i].externalStatus;
        let index = allowedActions.findIndex(
          (role: any) => role === externalStatus
        );
        if (index > -1) {
          // console.log("allowed");
        } else {
          return false;
        }
      }
      return true;
    } else {
      return true;
    }
  }

  async checkForKYC(btn: any) {
    this.userData = await this.storage.get('userData');
    // if(this.checkKYC && !!this.guestUser && this.guestUser.length>0)
    // {
    // //guest login
    // this.configService.presentToast("Guest User, Please login to perform any operation", "Error");
    // this.navCtrl.navigateForward(["/login-with-sign-up"]);
    // return false;

    // }
    // else
    console.log(this.userData);
    if (
      btn.name == 'Add To Cart' ||
      btn.name == 'Ask KAM' ||
      btn.name == 'Virtual Inspection'
    ) {
      return true;
    } else if (!(await this.storage.get('loggedInUser'))) {
      this.configService.presentToast('Please Login', 'error');
      return false;
    } else if (
      (btn.name == 'Purchase' ||
        btn.name == 'Memo' ||
        btn.name == 'Book Appointment' ||
        btn.name == 'Submit Offer') &&
      this.checkKYC &&
      (!this.userData?.KYCStatus || this.userData?.KYCStatus == false)
    ) {
      //user with incomplete KYC
      this.configService.presentToast('Please complete KYC first', 'error');
      this.navCtrl.navigateForward(['/setting']);
      return false;
    } else return true;
  }

  async CartProducts() {
    this.loggedInUser = await this.storage.get('loggedInUser');
    if (!!this.loggedInUser) {
      if (this.selected.length > 0) {
        this.userId = await this.storage.get('userID');
        // console.log("this.userId", this.userId);
        this.sessionId = await this.storage.get('sessionID');

        let selectedVariantObj = [];
        for (let i = 0; i < this.selected.length; i++) {
          let resProd: any = await this._detailsService.getProductDetail(
            this.selected[i].stoneName,
            this.selected[i].currentLocation,
            this.sessionId,
            this.userId
          );
          selectedVariantObj.push({
            PvID: resProd.data[0].listOfVariants[0].id,
            quantity: resProd.data[0].cts,
            discount: resProd.data[0][this.kgPricing.kgAppliedDiscount],
            taxes: 0,
            //price: resProd.data[0].RAPAPORT
          });
        }

        // console.log("selectedVariantObj ", selectedVariantObj);
        let res: any = await this._functionsService.addMultipleToCart(
          this.userId,
          this.sessionId,
          selectedVariantObj,
          ''
        );
        if (!!res.isSuccess) {
          // console.log("res", res);
          this.configService.presentToast(
            'Selected stones added to cart',
            'Success'
          );
        } else {
          this.configService.presentToast('Some error occur', 'error');
        }
      } else {
        this.configService.presentToast('Please select stones', 'error');
      }
    } else {
      this.configService.presentToast('Please Login', 'error');
    }
  }

  async ExcelProducts() {
    await this.configService.showLoading();
    this.loggedInUser = await this.storage.get('loggedInUser');
    if (!!this.loggedInUser) {
      if (this.selected.length > 0) {
        let temp2 = [];
        this.itemsFormatted = [];
        // this.selected.map((a, i) => {
        //   let temp3 = {};
        //   let sortedArray = []

        //   this.searchResultExport.forEach(e => {
        //     if (i == 0) {
        //       temp2.push(e.name)
        //     }
        //     temp3[e.name] = ""
        //     Object.keys(a).map(res => {
        //       if (res == e.fieldName) {
        //         if (e.fieldName == 'KeytoSymbolsCode') {
        //           let val = ""
        //           if (!!a[res]) {
        //             val = a[res].replace(/,/g, '/')
        //           }
        //           temp3[e.name] = val
        //         } else {
        //           temp3[e.name] = a[res] || ""
        //         }
        //       } else if (e.fieldName == 'Video') {
        //         let stoneName = a['stoneName']
        //         //let link = document.createElement('a');
        //         // link.textContent = 'video';
        //         // link.href = `https://stackg.azureedge.net/v360azurekg/V360_5_0/Vision360.html?d=${stoneName}`
        //         let url = `https://stackg.azureedge.net/v360azurekg/V360_5_0/Vision360.html?d=${stoneName}`;
        //         //let link = "<a href='"+url+"'>Video</a>";
        //         temp3[e.name] = "=HYPERLINK(\"" + url + "\",\"Video\")"
        //       } else if (e.fieldName == 'Amt') {
        //         if (a['Rapnet_pluspercarat'] && a['cts']) {
        //           let amt = a['Rapnet_pluspercarat'] * a['cts']
        //           temp3[e.name] = amt
        //         } else {
        //           temp3[e.name] = ""
        //         }
        //       } else if (e.fieldName == 'RapAmt') {
        //         if (a['RAPAPORTpercarat'] && a['cts']) {
        //           let rapAmt = a['RAPAPORTpercarat'] * a['cts']
        //           temp3[e.name] = rapAmt
        //         } else {
        //           temp3[e.name] = ""
        //         }
        //       } else if (e.fieldName == "ReportNo") {
        //         let ReportNo = a['ReportNo'] || '';
        //         let lab = a['lab'] || '';
        //         if (ReportNo && lab) {
        //           let url = `https://dia-img.kgirdharlal.com/lab.aspx?lab=${lab}&reportid=${ReportNo}`
        //           temp3[e.name] = "=HYPERLINK(\"" + url + "\",\"Certificate\")"
        //         } else {
        //           temp3[e.name] = ReportNo
        //         }
        //       }
        //     });
        //   });
        //   this.itemsFormatted.push(temp3);
        // });

        for await (let [i, a] of this.selected.entries()) {
          let temp3: any = {};

          for await (let e of this.searchResultExport) {
            if (i == 0) {
              temp2.push(e.name);
            }
            temp3[e.name] = '';

            temp3 = await this.excelSheetData.dataForExcelsheet(e, temp3, a);

            /*
            switch (e.fieldName) {
              case 'stoneName':
                let stoneName = a['stoneName'];
                temp3[e.name] = stoneName;
                break;
              case 'Rapnet_pluspercarat':
                temp3[e.name] = !!a['Rapnet_pluspercarat']
                  ? Math.round(Number(a['Rapnet_pluspercarat']) * 100) / 100
                  : !!a['stoneName']
                  ? 0
                  : '';
                break;
              case 'Amt':
                if (a['Rapnet_pluspercarat'] && a['cts']) {
                  let amt = Number(a['Rapnet_pluspercarat']) * Number(a['cts']);
                  temp3[e.name] = amt
                    ? Math.round(amt * 100) / 100
                    : !!a['stoneName']
                    ? 0
                    : '';
                } else {
                  temp3[e.name] = !!a['stoneName'] ? 0 : '';
                }
                break;
              case 'RapAmt':
                if (a['RAPAPORTpercarat'] && a['cts']) {
                  let rapAmt = Number(a['RAPAPORTpercarat']) * Number(a['cts']);
                  temp3[e.name] = rapAmt
                    ? Math.round(rapAmt * 100) / 100
                    : !!a['stoneName']
                    ? 0
                    : '';
                } else {
                  temp3[e.name] = !!a['stoneName'] ? 0 : '';
                }
                break;
              case 'ReportNo':
                let ReportNo = a['ReportNo'] || '';
                let lab = a['lab'] || '';
                if (ReportNo && lab) {
                  temp3[e.name] = ReportNo.toString();
                } else {
                  temp3[e.name] = ReportNo.toString();
                }
                break;
              case 'Rapnet_plusDiscountPercent':
                temp3[e.name] = !!a['Rapnet_plusDiscountPercent']
                  ? Math.round(Number(a['Rapnet_plusDiscountPercent']) * 100) /
                    100
                  : !!a['stoneName']
                  ? 0
                  : '';
                break;
              case 'cts':
                temp3[e.name] = !!a['cts']
                  ? Math.round(Number(a['cts']) * 100) / 100
                  : !!a['stoneName']
                  ? 0
                  : '';
                break;
              case 'RAPAPORTpercarat':
                temp3[e.name] = !!a['RAPAPORTpercarat']
                  ? Math.round(Number(a['RAPAPORTpercarat']) * 100) / 100
                  : !!a['stoneName']
                  ? 0
                  : '';
                break;
              case 'KeytoSymbolsCode':
                let val = '';
                if (!!a[e.fieldName]) {
                  val = a[e.fieldName].replace(/,/g, '/');
                }
                temp3[e.name] = val;
                break;
              default:
                temp3[e.name] = a[e.fieldName] || '';
                break;
            }
            */

            /*
            Object.keys(a).map(res => {
              if (res == e.fieldName) {
                if (e.fieldName == 'KeytoSymbolsCode') {
                  let val = '';
                  if (!!a[res]) {
                    val = a[res].replace(/,/g, '/');
                  }
                  temp3[e.name] = val;
                } else {
                  temp3[e.name] = a[res] || '';
                }
              } else if (e.fieldName == 'stoneName') {
                let stoneName = a['stoneName'];
                //let link = document.createElement('a');
                // link.textContent = 'video';
                // link.href = `https://stackg.azureedge.net/v360azurekg/V360_5_0/Vision360.html?d=${stoneName}`
                //let url = `https://stackg.azureedge.net/v360azurekg/V360_5_0/Vision360.html?d=${stoneName}`;
                //let link = "<a href='"+url+"'>Video</a>";
                //temp3[e.name] = "=HYPERLINK(\"" + url + "\",\"Video\")"
                //ws[cell] = {f: '=HYPERLINK("' + item.v.toString() + '","link text")'};
                //temp3[e.name] = {f: '=HYPERLINK("' + url.toString() + '","'+stoneName+'")', s: { font: { color: { rgb: '0563C1' }, underline: true } }};
                temp3[e.name] = stoneName;
              } else if (e.fieldName == 'Rapnet_pluspercarat') {
                temp3[e.name] = a['Rapnet_pluspercarat']
                  ? a['Rapnet_pluspercarat']?.toFixed(2)
                  : 0;
              } else if (e.fieldName == 'Amt') {
                if (a['Rapnet_pluspercarat'] && a['cts']) {
                  let amt = a['Rapnet_pluspercarat'] * a['cts'];
                  temp3[e.name] = amt ? amt?.toFixed(2) : 0;
                } else {
                  temp3[e.name] = '';
                }
              } else if (e.fieldName == 'RapAmt') {
                if (a['RAPAPORTpercarat'] && a['cts']) {
                  let rapAmt = a['RAPAPORTpercarat'] * a['cts'];
                  temp3[e.name] = rapAmt ? rapAmt?.toFixed(2) : 0;
                } else {
                  temp3[e.name] = '';
                }
              } else if (e.fieldName == 'ReportNo') {
                let ReportNo = a['ReportNo'] || '';
                let lab = a['lab'] || '';
                if (ReportNo && lab) {
                  temp3[e.name] = ReportNo.toString();
                } else {
                  temp3[e.name] = ReportNo.toString();
                }
              } else if (e.fieldName == 'ShapeCode') {
                let shape =
                  a['eliteShapeCode'] ||
                  a['standardShapeCode'] ||
                  a['ShapeCode'];
                temp3[e.name] = shape;
              }
            });
            */
          }
          temp3['SHAPE'] =
            a['eliteShapeCode'] || a['standardShapeCode'] || a['ShapeCode'];
          temp3['currentLocation'] = a['currentLocation'];
          this.itemsFormatted.push(temp3);
        }
        // console.log(
        //   'excel products ',
        //   this.itemsFormatted,
        //   ' temp ',
        //   temp2,
        //   ' searchresultcolumns ',
        //   this.searchResultExport
        // );

        let fileName = moment().format('YYYY-MM-DD');
        await this.configService.exportAsExcelFile(
          this.itemsFormatted,
          fileName
        );
        if (!this.inspectionView) this.selected = [];
        this.refeshGridValueTrue();
        this.refeshGridValueFalse();
        await this.configService.hideLoading();
      } else {
        await this.configService.hideLoading();
        this.configService.presentToast('Please select stones', 'error');
      }
    } else {
      await this.configService.hideLoading();
      this.configService.presentToast('Please Login', 'error');
    }
  }

  async openPopoverMail() {
    let res: any = await this.databaseServiceService.getDiaUserProfile(
      this.userId
    );
    if (res.data.parameter) {
      let para = JSON.parse(res.data.parameter);
      if (para && para.userAccount) this.profileData = para.userAccount;
    }
    if (
      this.profileData &&
      this.profileData.salesperson &&
      this.profileData.salesperson.name
    ) {
      this.salesPersonEmail = this.profileData.salesperson.email;
    }
    this.loggedInUser = await this.storage.get('loggedInUser');

    if (!!this.loggedInUser) {
      const excelModel = await this.modalCtrl.create({
        component: BookAppointmentComponent,
        cssClass: 'mail-popup',
        componentProps: {
          isMail: true,
          isStoneSelected: this.isStoneSelected,
          salesPersonEmail: this.salesPersonEmail,
          numOfSelectedStone: this.totalSelectedSummary['pcs'],
          totalNumOfStones: this.totalNumOfStones,
          pageSize: this.pageSize,
        },
      });

      excelModel.present();

      const { data, role } = await excelModel.onWillDismiss();

      if (role === 'sendEmail') {
        this.EmailProducts(data.sendEmail, data.message);
      } else if (role === 'sendEmailAll') {
        const payload: any = {};
        payload.email = data.sendEmail;
        payload.refCompanyId = this._companyService.refCompanyId;
        payload.query = JSON.stringify(this.query.query);
        payload.message = data.message;
        payload.userId = this.userId;
        payload.parameters = this.searchResultExport;

        this.databaseServiceService
          .sendExcelViaEmailOfStones(payload)
          .then((res: any) => {
            if (!!res.isSuccess) {
              this.configService.presentToast(res.data, 'success');
            } else {
              this.configService.presentToast(res.error, 'error');
            }
            if (!this.inspectionView) this.selected = [];
            this.refeshGridValueTrue();
            this.refeshGridValueFalse();
          });
      }
    }
  }

  async showGetEmailId() {
    let res: any = await this.databaseServiceService.getDiaUserProfile(
      this.userId
    );
    if (res.data.parameter) {
      let para = JSON.parse(res.data.parameter);
      if (para && para.userAccount) this.profileData = para.userAccount;
    }
    if (
      this.profileData &&
      this.profileData.salesperson &&
      this.profileData.salesperson.name
    ) {
      this.salesPersonEmail = this.profileData.salesperson.email;
    }
    this.loggedInUser = await this.storage.get('loggedInUser');
    if (!!this.loggedInUser) {
      if (this.selected.length > 0) {
        const alert = await this.alertController.create({
          header: 'Enter Email Details!',
          inputs: [
            {
              name: 'sendEmail',
              type: 'text',
              placeholder: 'Enter reciever email id',
              cssClass: 'emailText',
              value: this.salesPersonEmail,
            },
            {
              name: 'Message',
              type: 'textarea',
              placeholder: 'Enter message',
              cssClass: 'emailText-area',
            },
          ],
          cssClass: 'email-alert-box',
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
              cssClass: 'secondary',
              handler: () => {
                // console.log("Confirm Cancel");
              },
            },
            {
              text: 'Send',
              handler: (val) => {
                this.EmailProducts(val.sendEmail, val.Message);
                // console.log("Confirm Ok");
              },
            },
          ],
        });

        await alert.present();
      } else {
        this.configService.presentToast('Please select stones', 'error');
      }
    } else {
      this.configService.presentToast('Please Login', 'error');
    }
  }

  async EmailProducts(em: any, msg: any) {
    if (this.selected.length > 0) {
      await this.configService.showLoading();
      let temp2 = [];
      this.itemsFormatted = [];
      await this.selected.map((a: any, i: any) => {
        let temp3: any = {};
        let sortedArray = [];

        this.searchResultExport.forEach(async (e) => {
          if (i == 0) {
            temp2.push(e.name);
          }
          temp3[e.name] = '';

          temp3 = await this.excelSheetData.dataForExcelsheet(e, temp3, a);

          /*
          Object.keys(a).map(res => {
            if (res == e.fieldName) {
              if (e.fieldName == 'KeytoSymbolsCode') {
                let val = '';
                if (!!a[res]) {
                  val = a[res].replace(/,/g, '/');
                }
                temp3[e.name] = val;
              } else {
                temp3[e.name] = a[res] || '';
              }
            } else if (e.fieldName == 'stoneName') {
              let stoneName = a['stoneName'];
              //let link = document.createElement('a');
              // link.textContent = 'video';
              // link.href = `https://stackg.azureedge.net/v360azurekg/V360_5_0/Vision360.html?d=${stoneName}`
              //let url = `https://stackg.azureedge.net/v360azurekg/V360_5_0/Vision360.html?d=${stoneName}`;
              //let link = "<a href='"+url+"'>Video</a>";
              //temp3[e.name] = "=HYPERLINK(\"" + url + "\",\"Video\")"
              //ws[cell] = {f: '=HYPERLINK("' + item.v.toString() + '","link text")'};
              //temp3[e.name] = {f: '=HYPERLINK("' + url.toString() + '","'+stoneName+'")', s: { font: { color: { rgb: '0563C1' }, underline: true } }};
              temp3[e.name] = stoneName;
            } else if (e.fieldName == 'Amt') {
              if (a['Rapnet_pluspercarat'] && a['cts']) {
                let amt = a['Rapnet_pluspercarat'] * a['cts'];
                temp3[e.name] = amt;
              } else {
                temp3[e.name] = '';
              }
            } else if (e.fieldName == 'RapAmt') {
              if (a['RAPAPORTpercarat'] && a['cts']) {
                let rapAmt = a['RAPAPORTpercarat'] * a['cts'];
                temp3[e.name] = rapAmt;
              } else {
                temp3[e.name] = '';
              }
            } else if (e.fieldName == 'ReportNo') {
              let ReportNo = a['ReportNo'] || '';
              let lab = a['lab'] || '';
              if (ReportNo && lab) {
                //let url = `https://dia-img.kgirdharlal.com/lab.aspx?lab=${lab}&reportid=${ReportNo}`
                // temp3[e.name] = "=HYPERLINK(\"" + url + "\",\"Certificate\")"
                //temp3[e.name] =
                // {f: '=HYPERLINK("' + url.toString() + '","'+ReportNo+'")', , s: { font: { color: { rgb: '0563C1' }, underline: true } }: { font: { color: { rgb: '0563C1' }, underline: true } }};
                // temp3[e.name] = { Target: 'http://www.google.com', Tooltip: "Certificate" };
                temp3[e.name] = ReportNo.toString();
              } else {
                temp3[e.name] = ReportNo.toString();
              }
            }
          });
          */
        });

        temp3['SHAPE'] =
          a['eliteShapeCode'] || a['standardShapeCode'] || a['ShapeCode'];
        temp3['currentLocation'] = a['currentLocation'];

        temp3['PRICE($)'] =
          typeof temp3['PRICE($)'] === 'string'
            ? Number(temp3['PRICE($)'])
            : temp3['PRICE($)'];
        temp3['AMT($)'] =
          typeof temp3['AMT($)'] === 'string'
            ? Number(temp3['AMT($)'])
            : temp3['AMT($)'];
        temp3['RAP'] =
          typeof temp3['RAP'] === 'string'
            ? Number(temp3['RAP'])
            : temp3['RAP'];
        temp3['RAP VALUE'] =
          typeof temp3['RAP VALUE'] === 'string'
            ? Number(temp3['RAP VALUE'])
            : temp3['RAP VALUE'];

        // console.log(temp3);

        this.itemsFormatted.push(temp3);
      });

      // console.log(
      //   '\x1b[41m%s\x1b[0m',
      //   'this.itemsFormatted: ',
      //   this.itemsFormatted
      // );

      this.sendMail(em, this.itemsFormatted, msg);
      if (!this.inspectionView) this.selected = [];
      this.refeshGridValueTrue();
      this.refeshGridValueFalse();
      await this.configService.hideLoading();
    } else {
      this.configService.presentToast('Please select records', 'error');
    }
  }

  async sendMail(em: any, products: any, msg: any) {
    let res: any = await this._savedService.emailSelectedProducts(
      em,
      products,
      this.userData.id,
      msg
    );
    if (!!res.isSuccess) {
      if (!this.inspectionView) this.selected = [];
      this.refeshGridValueTrue();
      this.refeshGridValueFalse();
      this.configService.presentToast('Mail sent successfully', 'success');
    } else {
      this.configService.presentToast('Some error occur', 'error');
    }
  }

  async presentPopover(ev: any, obj: any, row: any) {
    this.popover = await this.popoverController.create({
      component: PopoverComponent,
      event: ev,
      componentProps: { obj: obj, row: row },
      translucent: true,
    });
    return await this.popover.present();
  }

  async popOverFunction(event: any) {
    let selectedCol = this.resultColumns[event.columnIndex - 1];
    if (this.popover) {
      await this.popover.dismiss();
    }
    await this.presentPopover(event.event, selectedCol, event.data);
  }

  async openPopoverExcel() {
    if (
      this.pageSize > this.totalSelectedSummary['pcs'] ||
      this.pageSize >= this.totalNumOfStones
    ) {
      this.ExcelProducts();
    } else if (this.pageSize <= this.totalNumOfStones) {
      const excelModel = await this.modalCtrl.create({
        component: BookAppointmentComponent,
        cssClass: 'excel-popup',
        componentProps: {
          isExcel: true,
          isStoneSelected: this.isStoneSelected,
          userEmail: this.userEmail,
          numOfSelectedStone: this.totalSelectedSummary['pcs'],
          totalNumOfStones: this.totalNumOfStones,
          pageSize: this.pageSize,
        },
      });

      excelModel.present();

      const { data, role } = await excelModel.onWillDismiss();

      if (role === 'export') {
        this.ExcelProducts();
      } else if (role === 'sendNow') {
        const payload: any = {};
        payload.email = this.userEmail;
        payload.refCompanyId = this._companyService.refCompanyId;
        payload.query = JSON.stringify(this.query.query);
        payload.userId = this.userId;
        payload.parameters = this.searchResultExport;

        this.databaseServiceService
          .sendExcelViaEmailOfStones(payload)
          .then((res: any) => {
            if (!!res.isSuccess) {
              this.configService.presentToast(res.data, 'success');
            } else {
              this.configService.presentToast(res.error, 'error');
            }
            if (!this.inspectionView) this.selected = [];
            this.refeshGridValueTrue();
            this.refeshGridValueFalse();
          });
      }
    }
    // else {
    //   this.ExcelProducts();
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

  dismissPopover() {
    if (this.popover) {
      setTimeout(() => {
        this.popover.dismiss().then(() => {
          this.popover = null;
        });
      }, 1000);
    }
  }

  async loadSavedSearches() {
    let res: any = await this._savedService.getAllSavedSearches(
      parseInt(this.userData.id)
    );
    if (res.isSuccess) this.savedSearchList = res.data;
    else this.savedSearchList = [];
  }

  async SavedSearchSelect() {
    let res: any = await this._savedService.getSavedSearchById(
      parseInt(this.userData.id),
      this.selectedSavedSearch
    );
    this.states = res.data.searchObject;
    this.query = this.states;
  }

  async openNewSavedSearch() {
    const alert = await this.alertController.create({
      header: 'New Saved Search!',
      inputs: [
        {
          name: 'newSavedSearchName',
          type: 'text',
          placeholder: 'Enter search name to save',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            // console.log("Confirm Cancel");
          },
        },
        {
          text: 'Ok',
          handler: (val) => {
            this.insertSavedSearch(val);
            // console.log("Confirm Ok");
          },
        },
      ],
    });
    await alert.present();
  }

  async insertSavedSearch(val: any) {
    let objToPost = {
      id: this._companyService.refCompanyId,
      refCompanyId: this._companyService.refCompanyId,
      name: val.newSavedSearchName,
      refUserId: this.userData.id,
      searchObject: JSON.stringify(this.states),
    };
    let res = await this._savedService.AddSaveSearch(objToPost);

    this.configService.presentToast('Saved search added', 'success');
    await this.loadSavedSearches();
  }

  // onSelect({ selected }) {
  //   // console.log("Select Event", selected, this.selected);
  //   this.selected.splice(0, this.selected.length);
  //   this.selected.push(...selected);
  // }

  productTitle(title: any) {
    if (!!title && title.length > 80) {
      return title.substring(0, 70) + '...';
    } else {
      return title;
    }
  }

  show(view: any) {
    if (!!this.esFilters && this.esFilters.length > 0) {
      this.esFilters.forEach((filter: any) => {
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
  }

  filterForSmallScreen(attribute: any) {
    this.smallScreenFilter = null;
    this.smallScreenFilter = attribute;
  }

  changeView() {
    if (this.inspectionView) {
      this.inspectionView = false;
    } else {
      this.inspectionView = true;
    }
  }

  async modifySearch() {
    localStorage.removeItem('prevState');
    this._applySearchService.searchCriteria.next(true);
    this.router.navigateByUrl('/diamond-search');
    //this.navCtrl.pop();
  }

  async valueChange(event: {
    component: IonicSelectableComponent;
    value: any;
  }) {
    // console.log("selected values:", event);
    this.selectedSavedSearch = event.value.id;
    this.SavedSearchSelect();
  }

  async getCount(qry: any = {}, defaultSelected = false) {
    let object: any = {};

    this.esFilters.forEach((e: any) => {
      object[e.label] = e.attribute;
    });
    if (this.firstLoad) {
      let { mapOfSearchCriteria } = this.defaultLoad();
      Object.keys(object)
        .filter(
          (res) => Object.keys(mapOfSearchCriteria).indexOf(object[res]) != -1
        )
        .filter((res) => {
          delete object[res];
        });
    }

    let obj: any = {};
    Object.keys(object).filter((key) => {
      let single = object[key];
      let fIndex = this.esFilters.findIndex((f: any) => f.label == key);
      if (
        !!this.esFilters[fIndex].type &&
        this.esFilters[fIndex].type == 'rangeSlider'
      ) {
        if (
          !!this.esFilters[fIndex].filterValues &&
          this.esFilters[fIndex].filterValues.length > 0
        ) {
          let ranges: any = [];
          this.esFilters[fIndex].filterValues.forEach((v) => {
            let obj: any = {};
            if (!!v.start) {
              // from value is included
              obj['from'] = v.start;
            }
            if (!!v.end) {
              // to value is excluded
              obj['to'] = v.end;
            }
            if (!!v.label) {
              obj['key'] = v.label;
            }
            ranges.push(obj);
          });
          obj[single] = {
            range: { field: single, ranges: ranges },
          };
        }
      } else {
        obj[single] = {
          terms: { field: single, size: 10000 },
        };
      }
    });
    await this.es
      .getPaginatedDocuments(
        {
          aggs: obj,
          ...qry,
        },
        0,
        this.index,
        undefined,
        0
      )
      .then((res) => {
        // console.log("get count res ", res);
        let tempObj = { ...this.searchPara };
        let selectedValue: any = [];
        if (defaultSelected) {
          let match = qry.query.bool.should
            .map((res: any) => Object.keys(res)[0])
            .indexOf('bool');
          selectedValue = qry.query.bool.should[match].bool.must.map(
            (res: any) => res.terms
          );
        }
        Object.keys(object) &&
          Object.keys(object).filter((key) => {
            if (!this.firstLoad) {
              switch (true) {
                case !tempObj[key]:
                  tempObj[key] = res.aggregations[object[key]].buckets.map(
                    (value: any) => {
                      return {
                        id: value.key,
                        label: value.key,
                        value: value.key,
                        isRefined: false,
                        from: !!value.from ? value.from : null,
                        to: !!value.to ? value.to : null,
                      };
                    }
                  );
                  break;
                default:
                  break;
              }
            }

            tempObj[key] &&
              tempObj[key].map((obj: any) => {
                obj.count = 0;
                res.aggregations[object[key]].buckets.map((value: any) => {
                  if (obj.value == value.key) {
                    obj.count = value.doc_count;
                  }
                  if (defaultSelected) {
                    try {
                      selectedValue.filter((keys: any) => {
                        if (Object.keys(keys)[0] == object[key]) {
                          let data: any = Object.values(keys)[0];
                          if (data.indexOf(obj.value) != -1) {
                            obj.isRefined = true;
                          } else {
                            obj.isRefined = false;
                          }
                        }
                      });
                    } catch (e) {
                      obj.isRefined = false;
                    }
                  }
                });

                return obj;
              });
          });
        this.searchPara = { ...tempObj };

        this.firstLoad = true;

        this.esFilters.filter((e: any) => {
          let search = Object.keys(this.searchPara).filter((p) => e.label == p);
          if (!!search && search.length > 0) {
            e.values = this.searchPara[search[0]];
          }
        });
        // console.log("get count ", this.searchPara, this.esFilters);
      });
  }

  async addRefinements(attribute: any) {
    if (!!attribute && !Array.isArray(attribute)) {
      await this.addRefinementsForSingleAttribute(attribute);
    } else {
      attribute.forEach((attr: any) => {
        this.addRefinementsForSingleAttribute(attr);
      });
    }
    setTimeout(() => {
      this.hits = [];
      this.currentPage = 1;
      this.search(this.query, this.index, this.currentPage, false);
      this.getCount(this.query, false);
      this.checkIfFilterIsPresent();
    }, 500);
  }

  async addRefinementsForSingleAttribute(attribute: any) {
    let selectedFilterIndex = this.esFilters.findIndex(
      (e: any) => e.attribute == attribute
    );
    // console.log("addRefinementsForSingleAttribute selectedFilter ", selectedFilterIndex);
    if (selectedFilterIndex > -1) {
      let tmp = this.esFilters[selectedFilterIndex].values.filter(
        (a: any) => a.isRefined
      );
      // // console.log("addRefinementsForSingleAttribute this.esFilters ",this.esFilters[selectedFilterIndex], tmp);
      let { mapOfSearchCriteria, mapOfNumericCriteria } =
        await this.defaultLoad();

      if (!!tmp && tmp.length > 0) {
        this.esFilters[selectedFilterIndex].isRefined = true;
        // // console.log("addRefinementsForSingleAttribute this.esFilters 1 ",this.esFilters[selectedFilterIndex].isRefined);
        if (
          this.esFilters[selectedFilterIndex].type == 'refinement' ||
          this.esFilters[selectedFilterIndex].type == 'sideRefinement'
        ) {
          let values: any = [];
          tmp.forEach((t: any) => {
            values.push(t.value);
          });
          let termsQry = await this.esTermsQuery(attribute, values);
          if (this.query.query.bool.should[1].bool.must.length > 0) {
            let existingTermIndex =
              this.query.query.bool.should[1].bool.must.findIndex(
                (f: any) => !!f['terms'] && !!f['terms'][attribute]
              );
            if (existingTermIndex > -1) {
              // if filter exists in query, then override
              this.query.query.bool.should[1].bool.must[existingTermIndex] =
                termsQry;
            } else {
              this.query.query.bool.should[1].bool.must.push(termsQry);
            }
          } else {
            this.query.query.bool.should[1].bool.must.push(termsQry);
          }
        } else if (this.esFilters[selectedFilterIndex].type == 'rangeSlider') {
          let rangeArr = [];

          for (let i = 0; i < tmp.length; i++) {
            let rangeQry = await this.esRangeQuery(
              attribute,
              tmp[i].from,
              tmp[i].to
            );
            if (!!rangeQry) rangeArr.push(rangeQry);
          }

          // remove existing numeric filters of given attribute
          await this.removeRangeFiltersOfGivenAttribute(attribute);

          if (rangeArr.length > 0) {
            if (rangeArr.length > 1) {
              let boolShould = {
                bool: {
                  should: rangeArr,
                },
              };
              this.query.query.bool.should[1].bool.must.push(boolShould);
            } else {
              this.query.query.bool.should[1].bool.must.push(rangeArr[0]);
            }
          }
        }
      } else {
        // remove from query if filter is present
        this.esFilters[selectedFilterIndex].isRefined = false;
        if (
          this.esFilters[selectedFilterIndex].type == 'refinement' ||
          this.esFilters[selectedFilterIndex].type == 'sideRefinement'
        ) {
          let existingTermIndex =
            this.query.query.bool.should[1].bool.must.findIndex(
              (f: any) => !!f['terms'] && !!f['terms'][attribute]
            );
          if (existingTermIndex > -1) {
            this.query.query.bool.should[1].bool.must.splice(
              existingTermIndex,
              1
            );
          }
        } else if (this.esFilters[selectedFilterIndex].type == 'rangeSlider') {
          await this.removeRangeFiltersOfGivenAttribute(attribute);
        }
      }
    }
  }

  async clearAllRefinements() {
    let refinementExist = false,
      cnt = 0;
    this.esFilters.forEach((f: any) => {
      let tmp = f.values.filter((a: any) => a.isRefined == true);
      if (!!tmp && tmp.length > 0) {
        if (f.type == 'refinement' || f.type == 'sideRefinement') {
          let values: any = [];
          tmp.forEach((t: any) => {
            values.push(t.value);
          });
          let termsQry = this.esTermsQuery(f.attribute, values);
          if (this.query.query.bool.should[1].bool.must.length > 0) {
            let existingTermIndex =
              this.query.query.bool.should[1].bool.must.findIndex(
                (o: any) => !!o['terms'] && !!o['terms'][f.attribute]
              );
            if (existingTermIndex > -1) {
              this.query.query.bool.should[1].bool.must.splice(
                existingTermIndex,
                1
              );
              refinementExist = true;
            }
          }
        } else if (f.type == 'rangeSlider') {
          refinementExist = this.removeRangeFiltersOfGivenAttribute(
            f.attribute
          );
        }
        f.values.filter((a: any) => (a.isRefined = false));
        f.isRefined = false;
        cnt++;
      } else {
        cnt++;
      }
      // console.log("clear all refinements ", f, refinementExist, this.esFilters, cnt);
      if (refinementExist && cnt == this.esFilters.length) {
        this.showFilters = false;
        this.hits = [];
        this.currentPage = 1;
        this.search(this.query, this.index, this.currentPage, false);
      }
    });
  }

  singleProduct(product: any) {
    let name = '';
    if (!!product.productName)
      name = product.productName
        .replace(/\//g, '-')
        .replace(/\s+/g, '-')
        ?.toLowerCase();
    else name = product.stoneName;

    this._navigateService.productDetailPageList = this.productDetailPageList;
    if (this.mobileView && !this.webViewMobile) {
      this.navCtrl.navigateForward([
        '/products/' +
          (!!product.stoneName ? product.stoneName : product.id) +
          '/' +
          name +
          '/' +
          product.currentLocation,
      ]);
    } else {
      if (this.isIpad && !this.webViewMobile) {
        this.navCtrl.navigateForward([
          '/products/' +
            (!!product.stoneName ? product.stoneName : product.id) +
            '/' +
            name +
            '/' +
            product.currentLocation,
        ]);
      } else {
        var host = window.location.href;
        const path: string[] = this.platform.url().split('/');
        console.log(path[path.length - 2]);
        if (path.includes('collections')) {
          window.open(
            host.replace('collections/' + path[path.length - 1], 'products') +
              '/' +
              (!!product.stoneName ? product.stoneName : product.id) +
              '/' +
              name +
              '/' +
              product.currentLocation,
            '_blank'
          );
        } else {
          window.open(
            host.replace(path[path.length - 1], 'products') +
              '/' +
              (!!product.stoneName ? product.stoneName : product.id) +
              '/' +
              name +
              '/' +
              product.currentLocation,
            '_blank'
          );
        }
      }
    }
  }

  checkIfFilterIsPresent() {
    let currentFilters = this.esFilters.filter((f: any) => f.isRefined);
    if (!!currentFilters && currentFilters.length > 0) {
      this.currentFilterExists = true;
    } else {
      this.currentFilterExists = false;
    }
    //console.log("checkIfFilterIsPresent ", currentFilters, this.currentFilterExists, this.esFilters);
  }

  defaultLoad() {
    var mapOfSearchCriteria: any = {},
      mapOfNumericCriteria: any = {};
    try {
      let qry = this.query;
      let match = qry.query.bool.should
        .map((res: any) => Object.keys(res)[0])
        .indexOf('bool');
      try {
        qry.query.bool.should[match].bool.must
          .map((res: any) => res.terms)
          .filter((res: any) => !!res)
          .filter((res: any) => {
            mapOfSearchCriteria[Object.keys(res)[0]] = res[Object.keys(res)[0]];
          });
      } catch (e) {
        // console.log(e);
      }
      try {
        qry.query.bool.should[match].bool.must
          .map((res: any) => res.range)
          .filter((res: any) => !!res)
          .filter((res: any) => {
            mapOfNumericCriteria[Object.keys(res)[0]] =
              res[Object.keys(res)[0]];
          });
      } catch (e) {
        // console.log(e);
      }
    } catch (e) {
      // console.log(e);
    }
    // console.log("default load ", mapOfSearchCriteria, mapOfNumericCriteria);
    return { mapOfSearchCriteria, mapOfNumericCriteria };
  }

  removeRangeFiltersOfGivenAttribute(attribute: any) {
    let filterExist = false;
    if (this.query.query.bool.should[1].bool.must.length > 0) {
      let existingSingleRangeIndex =
        this.query.query.bool.should[1].bool.must.findIndex(
          (f: any) => !!f['range'] && !!f['range'][attribute]
        );
      if (existingSingleRangeIndex > -1) {
        // console.log("single numeric filters exist ", existingSingleRangeIndex, this.query.query.bool.should[1].bool.must);
        this.query.query.bool.should[1].bool.must.splice(
          existingSingleRangeIndex,
          1
        );
        filterExist = true;
      } else {
        // check if there are multiple numeric filters in bool-should
        let indexes = [],
          i;
        let boolMust = this.query.query.bool.should[1].bool.must;
        for (i = 0; i < boolMust.length; i++) {
          if (
            !!boolMust[i].bool &&
            !!boolMust[i].bool.should &&
            boolMust[i].bool.should.length > 0
          ) {
            let innerBoolShould = boolMust[i].bool.should;
            for (let j = 0; j < innerBoolShould.length; j++) {
              if (
                !!innerBoolShould[j] &&
                !!innerBoolShould[j].range &&
                !!innerBoolShould[j].range[attribute]
              ) {
                indexes.push(i);
                this.query.query.bool.should[1].bool.must.splice(i, 1);
                filterExist = true;
              }
            }
          }
        }
        // console.log("multiple numeric filters exist ", indexes, boolMust);
      }
    }
    return filterExist;
  }

  async addFilters() {
    // console.log("addFilters this.filters", this.filters);
    if (
      !!this.filters &&
      !!this.filters.filters &&
      this.filters.filters.length > 0
    ) {
      let filters = this.filters.filters;
      let termFilters: any = [],
        numericFilters: any = [],
        addRefinements: any = [];
      filters.filter((filter: any) => {
        if (filter.f) {
          termFilters = filter.f[0];
        }
        if (filter.nf) {
          numericFilters = filter.nf[0];
        }
        if (filter.query && filter.query.length > 0) {
          let queryString = filter.query.join(' ');
          this.query.query.bool.should[0].simple_query_string.query =
            queryString;
        }
      });
      if (termFilters) {
        Object.keys(termFilters).filter((term) => {
          let selectedFilterIndex = this.esFilters.findIndex(
            (e: any) => e.attribute == term
          );
          if (selectedFilterIndex > -1) {
            termFilters[term].forEach((value: any) => {
              this.esFilters[selectedFilterIndex].values.filter((v: any) => {
                if (v.value == value) {
                  v.isRefined = true;
                }
              });
            });
            addRefinements.push(term);
          }
        });
      }
      if (numericFilters) {
        Object.keys(numericFilters).filter((range) => {
          let selectedFilterIndex = this.esFilters.findIndex(
            (e: any) => e.attribute == range
          );
          if (selectedFilterIndex > -1) {
            numericFilters[range].forEach((value: any) => {
              let valueIndex = this.esFilters[
                selectedFilterIndex
              ].values.findIndex((v: any) => {
                let fromPresent = false,
                  toPresent = false;
                if (!!value.from && !!v.from) {
                  if (value.from == v.from) {
                    fromPresent = true;
                  } else {
                    fromPresent = false;
                  }
                } else if (
                  (!!value.from && !v.from) ||
                  (!value.from && !!v.from)
                ) {
                  fromPresent = false;
                } else if (!value.from && !v.from) {
                  fromPresent = true;
                } else {
                  fromPresent = true;
                }
                if (!!value.to && !!v.to) {
                  if (value.to == v.to) {
                    toPresent = true;
                  } else {
                    toPresent = false;
                  }
                } else if ((!!value.to && !v.to) || (!value.to && !!v.to)) {
                  toPresent = false;
                } else if (!value.to && !v.to) {
                  toPresent = true;
                } else {
                  toPresent = true;
                }
                // // console.log("value ", value, " v ",v, fromPresent, toPresent);

                if (fromPresent && toPresent) {
                  return v;
                }
              });
              if (valueIndex > -1) {
                this.esFilters[selectedFilterIndex].values[
                  valueIndex
                ].isRefined = true;
              }
            });
            addRefinements.push(range);
          }
        });
      }
      this.callSearchRefinements = true;
      await this.addRefinements(addRefinements);
    }
  }

  async callFavorites() {
    if (!this.userId) {
      let val = await this.storage.get('userID');
      this.userId = parseInt(val);
      this.fetchFavorites(this.userId);
    } else if (this.loggedInUser) {
      this.fetchFavorites(this.userId);
    } else {
      // console.log('---')
    }
  }

  async fetchFavorites(userId: any) {
    if (userId) {
      let res = await this._favoriteService.fetchFavorites(userId);
      this.favorites = res;
      if (this.products.length > 0) {
        this.products.forEach((element1: any) => {
          element1.favorite = false;
        });
        this.products.forEach((element1: any) => {
          if (this.favorites && this.favorites.data) {
            this.favorites.data.forEach((element2: any) => {
              if (element1.id == element2.productId) {
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
    } else {
      // console.log('--')
    }
  }

  async addToFavorite(product: any) {
    let userId = await this.storage.get('userID');
    if (!userId && userId == null && userId == undefined) {
      let navigationExtras: NavigationExtras = {
        queryParams: {
          to: '/my-favorite',
        },
      };
      this.router.navigate(['/login-with-sign-up'], navigationExtras);
    } else {
      var favProd = this.favorites.data.filter(
        (d: any) => d.productId == product.id
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
        let favoriteResponse: any = await this._favoriteService.createFavorite(
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

  async showSortBy(ev: any) {
    if (this.popover) {
      await this.popover.dismiss();
    }
    this.popover = await this.popoverController.create({
      component: PopoverComponent,
      event: ev,
      componentProps: {
        sortBy: this.collectionOrderOptions,
        selectedBtn: !!this.orderBy ? this.orderBy.id : null,
      },
      // translucent: true
    });
    return await this.popover.present();
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      buttons: this.createSearchButtons(),
    });
    await actionSheet.present();
  }

  createSearchButtons() {
    let buttons = [];
    for (let btn of this.searchPageButtons) {
      let button = {
        id: btn.id,
        text: btn.name,
        handler: () => {
          this.actionButtonClick(btn);
          return true;
        },
      };
      buttons.push(button);
    }
    let excelBtn = {
      id: -1,
      text: 'Download Excel',
      icon: 'reader',
      handler: () => {
        this.ExcelProducts();
        return true;
      },
    };
    buttons.push(excelBtn);
    let emailBtn = {
      id: -2,
      text: 'Email stones',
      icon: 'mail',
      handler: () => {
        this.showGetEmailId();
        return true;
      },
    };
    buttons.push(emailBtn);
    return buttons;
  }
  openDiamondSearch() {
    // this.navCtrl.navigateForward("/diamond-search");
    this.navCtrl.back();
    this.loadMoreData = [];
    this.totalHits = 0;
  }

  async addToCart(data: any) {
    if (
      !!data &&
      !!data.externalStatus &&
      data.externalStatus?.toLowerCase() !== 'on memo'
    ) {
      this.configService.showLoading();
      console.log(await this.storage.get('userID'));
      this.userId = await this.storage.get('userID');
      // console.log("this.userId", this.userId);
      this.sessionId = await this.storage.get('sessionID');
      let selectedVariantObj = [];

      let resProd: any = await this._detailsService.getProductDetail(
        data.stoneName,
        data.currentLocation,
        this.sessionId,
        this.userId
      );

      selectedVariantObj.push({
        PvID: resProd.data[0]?.listOfVariants[0].id,
        quantity: resProd.data[0]?.cts,
        discount: resProd.data[0]?.[this.kgPricing.kgAppliedDiscount],
        taxes: 0,
        //price: resProd.data[0].RAPAPORT
      });

      let price = resProd.data[0]?.[this.kgPricing.kgAppliedPrice];
      if (price <= 0) {
        this.configService.presentToast(
          `Stone has 0 price so it can not add to cart`,
          'error'
        );
        await this.configService.hideLoading();
        return;
      }

      let res = await this._functionsService.addMultipleToCart(
        this.userId,
        this.sessionId,
        selectedVariantObj,
        ''
      );
      await this.updateCartOnGridview(data.stoneName, data.currentLocation);
      await this._headerFooterService.cartValueUpdated();
      await this.configService.hideLoading();
      this.analyticsService.addEvents('add to cart', {
        stoneID: data.stoneName,
        username: this.userData?.name,
        user: this.userData?.username,
      });
      this.configService.presentToast(
        'Stone added to cart successfully',
        'success'
      );
    } else {
      this.configService.presentToast(
        `Status of this stone is "On Memo". You can not add this stone into cart.`,
        'error'
      );
      await this.configService.hideLoading();
    }
  }

  async updateCartOnGridview(stoneName: any, location: any) {
    let sessionId = await this.storage.get('sessionID');
    let userId = await this.storage.get('userID');
    let response = await this._headerFooterService.getCartDetailsV1(
      userId,
      sessionId,
      0,
      10000,
      '',
      '',
      false
    );

    if (!!response) {
      let cartData: any = response;
      if (cartData.data?.products) {
        this.cartProducts = cartData.data?.products;
        console.log(this.cartProducts);
      }
    }

    if (this.hits.length > 0) {
      this.hits = await Promise.all(
        this.hits.map(async (a: any) => {
          // let sName = a.name || a.stoneName;
          let loc = !!a.currentLocation ? a.currentLocation : '';

          let sName = a.stoneName;

          if (sName === stoneName && loc === location) {
            let item = this.cartProducts.find(
              (x: any) => String(x.stoneName || x.sku) == stoneName
            );
            if (item) {
              a['refCartID'] = item.refCartID;
              a['refCartProductId'] = item.refCartProductId;
            }
          }

          console.log(a);
          return a;
        })
      );
    }
  }

  async clearSelection() {
    this.refreshMobileGrid = true;
  }

  async options() {
    const actionSheet = await this.actionSheetController.create({
      cssClass: 'my-custom-actionsheet',
      buttons: [
        {
          text: 'Download Excel',
          handler: () => {
            this.openPopoverExcel();
            // this.ExcelProducts();
          },
        },
        {
          text: 'Book Appointment',
          handler: () => {
            if (!!this.selected.length) {
              this.openBookAppointmentPopup({
                userId: this.userId,
                stones: this.selected,
              });
            } else {
              this.configService.presentToast('Please select stones', 'error');
            }
          },
        },
        // {
        //   text: 'Submit Offer Bid',
        //   handler: () => {
        //     let obj = {
        //       "name": "Submit Offer Bid",
        //       "action": "/my-cart?ob=Offer",
        //       "orderBook": "Offer"
        //     }
        //     this.actionButtonClick(obj);
        //   }
        // },
        {
          text: 'Clear Selection',
          handler: () => {
            this.clearSelection();
          },
        },
        {
          text: 'Modify Search',
          handler: () => {
            this.openDiamondSearch();
          },
        },
        {
          text: 'Virtual Inspection',
          handler: () => {
            this.actionButtonClick({
              name: 'Virtual Inspection',
              action: 'Virtual Inspection',
              orderBook: '',
            });
          },
        },
      ],
    });
    await actionSheet.present();
  }

  toggleView(type: any) {
    if (type == 'grid') {
      this.databaseServiceService.searchListSelected = [];
    }
    localStorage.setItem('prevState', type);
    this._companyService.productListing = type;
    this.currView.emit(this._companyService.productListing);
  }

  setSelection() {
    this.databaseServiceService.searchListSelected = this.selected;
  }

  selectionViewData(event: {
    totalSelectedSummary: TotalSelectedSummary;
    hideClearSelection: boolean;
  }) {
    this.totalSelectedSummary = event.totalSelectedSummary;
    this.hideClearSelection = event.hideClearSelection;
    if (!!this.totalSelectedSummary['pcs']) {
      this.isStoneSelected = true;
    } else {
      this.isStoneSelected = false;
    }
  }

  refresh() {
    this.totalSelectedSummary = {
      cts: 0,
      pcs: 0,
      amount: 0,
      rapValue: 0,
    };
    this.dxDataGridComp.refresh();
  }

  copyToClipboard(data: string) {
    navigator.clipboard
      .writeText(data)
      .then((clipboardRes) => {
        this.configService.presentToast(
          'Stone(s) details copied successfully',
          'success'
        );
      })
      .catch((clipboardErr) => {
        this.configService.presentToast(
          'Unable to copy Stone(s) details',
          'error'
        );
      });
  }

  checkClipboardPermission(completeMsg: string) {
    navigator.permissions
      .query({ name: 'clipboard-write' as PermissionName })
      .then((result: any) => {
        if (result.state === 'granted' || result.state == 'prompt') {
          this.copyToClipboard(completeMsg);
        } else {
          this.configService.presentToast(
            'Your browser does not allow copying',
            'error'
          );
        }
      })
      .catch((err) => {
        this.configService.presentToast(err, 'error');
      });
  }

  encode_data(stoneData: any) {
    return encodeURIComponent(`
${!!stoneData?.stoneName ? stoneData.stoneName : '-'}  ${
      !!stoneData?.ReportNo ? stoneData.ReportNo : '-'
    }
${!!stoneData?.cts ? stoneData.cts : '-'}  ${
      !!stoneData?.ColorCode ? stoneData.ColorCode : '-'
    }  ${!!stoneData?.ClarityCode ? stoneData.ClarityCode : '-'}  ${
      !!stoneData?.ShapeCode ? stoneData.ShapeCode : '-'
    }  ${!!stoneData?.lab ? stoneData.lab : '-'}
    
${
  !!stoneData?.Rapnet_plusDiscountPercent
    ? stoneData.Rapnet_plusDiscountPercent
    : '-'
}  ${!!stoneData?.Rapnet_pluspercarat ? stoneData.Rapnet_pluspercarat : '-'}  ${
      !!stoneData?.Rapnet_plus ? stoneData.Rapnet_plus : '-'
    }
    
${!!stoneData?.CutCode ? stoneData.CutCode : '-'}  ${
      !!stoneData?.PolishCode ? stoneData.PolishCode : '-'
    }  ${!!stoneData?.SymmetryCode ? stoneData.SymmetryCode : '-'}  ${
      !!stoneData?.FluorescenceCode ? stoneData.FluorescenceCode : '-'
    }
    
Location: ${!!stoneData?.location ? stoneData.location?.toUpperCase() : '-'}
    
Diamond Details
${!!stoneData?.ImageUrl ? stoneData.ImageUrl : '-'}
 
Diamond Certificate
${!!stoneData?.certificate ? stoneData.certificate : '-'}
    
Diamond Unbranded Video
${!!stoneData?.videoLink ? stoneData.videoLink : '-'}
    `);
  }

  shareSelectedStones() {
    if (!!this.selected.length && this.selected.length <= 10) {
      let completeMsg = '';
      this.selected.forEach((stoneData: any) => {
        const message = this.encode_data(stoneData);

        if (completeMsg === '') {
          completeMsg = decodeURIComponent(message);
        } else {
          completeMsg =
            completeMsg +
            '\n' +
            '**********' +
            '\n' +
            decodeURIComponent(message);
        }
      });
      this.checkClipboardPermission(completeMsg);
      // this.copyToClipboard(completeMsg);
    } else {
      this.configService.presentToast(
        'Maximum 10 stones details can be copied',
        'error'
      );
    }
  }
}
