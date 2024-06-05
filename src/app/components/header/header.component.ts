import {
  Component,
  OnInit,
  Input,
  HostListener,
  Output,
  EventEmitter,
} from '@angular/core';
import { HeaderFooterService } from '../../service/headerFooter/header-footer.service';
import { CompanyService } from '../../service/company/company.service';
import { ConfigServiceService } from '../../service/config-service.service';
import { Router, NavigationExtras } from '@angular/router';
import { Storage } from '@ionic/storage';
import { MenuController, ModalController, NavController } from '@ionic/angular';
import { Meta } from '@angular/platform-browser';
import { LOGGEDINService } from '../../service/observable/user/loggedin.service';
import { LOGGEDOUTService } from '../../service/observable/user/loggedout.service';
import { CartService } from '../../service/observable/cart/cart.service';
import { DealerClubService } from '../../service/observable/dealer-club/dealer-club.service';
import { CartChangedService } from '../../service/observable/cart-changed/cart-changed.service';
import { Platform } from '@ionic/angular';
import { KycService } from 'src/app/service/observable/kyc/kyc.service';
import { DatabaseServiceService } from 'src/app/service/database-service.service';
import { ShowDNAComponent } from '../DNA/show-dna.component';
import { environment } from '../../../environments/environment';
import { ElasticsearchService } from 'src/app/service/elasticsearch/elasticsearch.service';
import { PopoverController } from '@ionic/angular';
import { AnalyticsService } from 'src/app/service/analytics.service';
import { ThemeService } from 'src/app/service/theme.service';
import { TranslateConfigService } from 'src/app/service/translate-config-service.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  languages = [
    {
      code: 'en',
      flag: 'https://media.flaticon.com/dist/min/img/flags/en.svg',
      name: 'English',
    },
    {
      code: 'pt',
      flag: 'https://media.flaticon.com/dist/min/img/flags/br.svg',
      name: 'Português',
    },
    // Add more languages as needed
  ];

  @Input() showBackButton: string;
  @Input() title: string;
  @Input() pageName: string;
  @Input() searchPage = false;
  @Input() showMenuOnRight = false;
  @Input() pageTitle: any;
  @Input() page = '';
  @Output() languageChanged = new EventEmitter<void>();
  defaultLang = this.translateConfigService.getDefaultLanguage();
  public loadMoreData = [];
  selectedLanguage = this.languages[0];
  showDropdown = false;

  public totalHits: number;
  public menuDisplay = true;
  public companyLogo = '';
  public mobileSearch = false;
  public loggedInUser: any;
  public companyJson = {
    homePageHeaderLinks: [],
    loggedInUserHeaderLinks: [],
  };
  public currentPage = '';
  public hideFavourites = false;
  public sessionID: any;
  public userId: any;
  public userData: any;
  public searchIconDisplay = true;
  public isGuestUser = false;
  public isSearchHidden = false;
  public showContactUs = false;
  public headerToolbarClass = '';
  public headerIconColor = 'primary';
  public hideLoginIcon = false;
  public headerLinkRight = false;
  public showSearch = false;
  public searchType = 'normal';
  public logoHeight = '25px';
  public showMobileLogo = false;
  public hideInSmallScreen = false;
  public loggedinRedirect = '/';
  public innerWidth: any;
  public sideMarginClass = '';
  public mobileView = false;
  public checkKYC = false;
  public showScroller = false;
  public userKycDetail;
  public showStoneIdTextbox = false;
  public excludeParameters;
  public kgPricing;
  public index = environment.INDEX;
  public perPage = environment.RESULTS_PER_PAGE;
  qry;
  founedStones = [];
  public stoneId: any;
  searchedStone;
  public kycText =
    'You need to update your KYC details to make orders and offers.';
  showImage;
  // public toolbarCss = {
  //   {'background-color':'#00A5C8'}
  // }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
    if (this.innerWidth <= 500) {
      this.showBackButton = 'false';
      this.sideMarginClass = '';
      this.mobileView = true;
    } else if (this.innerWidth > 500) {
      this.showBackButton = 'true';
      this.mobileView = false;
      if (this._companyService.productListing == 'grid') {
        this.sideMarginClass = 'ml30';
      } else {
        this.logoHeight = '50';
        this.sideMarginClass = '';
      }
    }
  }

  constructor(
    public _cartService: CartService,
    private theme: ThemeService,
    public _LOGGEDOUTService: LOGGEDOUTService,
    public _LOGGEDINService: LOGGEDINService,
    public KycService: KycService,
    private meta: Meta,
    private modalCtrl: ModalController,
    public _headerFooterService: HeaderFooterService,
    public _companyService: CompanyService,
    public popoverController: PopoverController,
    public navCtrl: NavController,
    public _cartChangedService: CartChangedService,
    private router: Router,
    public storage: Storage,
    private menu: MenuController,
    public configService: ConfigServiceService,
    public databaseServiceService: DatabaseServiceService,
    public _dealerClubService: DealerClubService,
    private es: ElasticsearchService,
    public analyticsService: AnalyticsService,
    public translateConfigService: TranslateConfigService,
    public platform: Platform
  ) {
    // if (this.platform.is("desktop")) {
    //   this.mobileSearch = false;
    // } else {
    //   this.mobileSearch = true;
    // }
    this.searchIconDisplayfn();
    this._LOGGEDINService.observable().subscribe(data => {
      this.loadUserData();
      this.getCartCount();
      this.searchIconDisplayfn();
      this.checkKyc();
    });

    this.KycService.observable().subscribe(data => {
      this.checkKyc();
    });
    this._cartChangedService.observable(this.pageName).subscribe(data => {
      this.getCartCount();
    });
    this._LOGGEDOUTService.observable().subscribe(data => {
      this.loggedInUser = this.storage.get('loggedInUser');
      this.userId = this.storage.get('userID');
      this.getCartCount();
      this.searchIconDisplayfn();
    });

    this.router.events.subscribe(path => {
      let tmp = window.location.href.toString().split(window.location.host);
      if (tmp.length > 0) this.currentPage = tmp[1];
    });

    let tmp = window.location.href.toString().split(window.location.host);
    if (tmp.length > 0) this.currentPage = tmp[1];

    this._dealerClubService.observable().subscribe(data => {
      this.ngOnInit();
    });
    this.checkMenu();

    this.router.events.subscribe(res => {
      let url = this.router.url.split('?')[0];
      this.currentPage = url;
    });
  }

  async checkKyc() {
    this.loggedInUser = this.storage.get('loggedInUser');
    await this.loadUserData();
    let user = await this.storage.get('userData');
    if (!!this.loggedInUser && !!this.userId) {
      // this.userData = await this.databaseServiceService.getDiaUserProfile(this.userId);
      // console.log(this.userData)
      let res: any = await this.databaseServiceService.getDiaUserProfile(
        this.userId
      );

      if (!!res.data && res.data.parameter != '') {
        let para = JSON.parse(res.data.parameter);

        if (user?.username) {
          let checkKycStatusData =
            await this.databaseServiceService.checkUserExistByPhoneNo(
              user.username
            );

          if (checkKycStatusData?.data) {
            if (checkKycStatusData?.data?.KYCStatus) {
              this.showScroller = false;
            } else {
              if (
                para &&
                para.general &&
                para.general.name &&
                para.userAccount &&
                para.userAccount.username &&
                para.userKYC &&
                para.userKYC.kyc &&
                para.userAccount.latticeApproved
              ) {
                // KYCStatus = true;
                this.showScroller = false;
              } else {
                this.showScroller = true;
              }
            }
          }
        }
      } else {
        this.showScroller = true;
      }

      await this.databaseServiceService.checkUserKyc();
      // let res: any = await this.databaseServiceService.getDiaUserProfile(this.userId);
      // let para = JSON.parse(res.data.parameter);
      // this.userKycDetail = para;

      // if (this.userKycDetail && this.userKycDetail.userAccount && this.userKycDetail.userAccount.salesperson.id) {
      //   this.showScroller = false
      // }

      // if (this.userKycDetail && this.userKycDetail.userAccount && this.userKycDetail.userKYC && !this.userKycDetail.userAccount.salesperson.id) {
      //  this.kycText = "Verification Pending: Email kyc@kgirdharlal.com for help"
      // }
    }
  }

  async gotoSetting() {
    this.router.navigate(['/setting']);
  }

  async checkMenu() {
    if (this._companyService.companyObj.config) {
      try {
        let companyJson = this._companyService.companyObj.config;
        if (companyJson.storeType == 'private') {
          if (!(await this.storage.get('loggedInUser'))) {
            this.showBackButton = 'false';
            this.menuDisplay = false;
          }
        } else if (companyJson.storeType == 'direct') {
          switch (
            window.location.href.toString().split(window.location.host)[1]
          ) {
            case companyJson.loggedIn:
              this.showBackButton = (await this.storage.get('loggedInUser'))
                ? 'false'
                : 'true';
              break;
            case companyJson.loggedOut:
              this.showBackButton = (await this.storage.get('loggedInUser'))
                ? 'true'
                : 'false';
              break;
          }
        }
      } catch (e) {}
    }
  }

  async loadUserData() {
    this.loggedInUser = await this.storage.get('loggedInUser');

    this.sessionID = await this.storage.get('sessionID');
    this.userId = await this.storage.get('userID');
    this.userData = await this.storage.get('userData');
    if (!!this.userData) {
      this.isGuestUser = this.userData.isGuest;
    }
    // console.log("loadUserData ", this.loggedInUser);
  }

  async getCartCount() {
    this._headerFooterService.cartValueUpdated();
  }

  setFavicon(companyJson) {
    this.theme.themeBoolean$.subscribe((value: boolean) => {
      this.showImage = value;
    });
    if (this.showImage) {
      let fc: any = document.getElementById('lnkFavicon');
      fc.href = companyJson.favicon;
    } else {
      let fc: any = document.getElementById('lnkFavicon');
      fc.href = 'assets/icon/aspecoFavicon.png';
    }

    if (!!companyJson.googleAnalyticsID) {
      //create element
      var lnkGoogleAnalytics = document.createElement('script');
      lnkGoogleAnalytics.type = 'text/javascript';
      lnkGoogleAnalytics.src =
        'https://www.googletagmanager.com/gtag/js?id=' +
        companyJson.googleAnalyticsID;
      document.getElementsByTagName('head')[0].appendChild(lnkGoogleAnalytics);

      var lnkGoogleAnalytics2 = document.createElement('script');
      // lnkGoogleAnalytics2.type = "text/javascript";
      let strData =
        "window.dataLayer = window.dataLayer || []; function gtag() { dataLayer.push(arguments); } gtag('js', new Date()); gtag('config', '" +
        companyJson.googleAnalyticsID +
        "');";
      lnkGoogleAnalytics2.innerHTML = strData;
      //lnkGoogleAnalytics2.innerHTML = " alert('hello') ";
      document.getElementsByTagName('head')[0].appendChild(lnkGoogleAnalytics2);
    }

    let obj = { ...companyJson };

    Object.keys(obj).filter(key => {
      if (['lnkFavicon', 'googleAnalyticsID'].indexOf(key) == -1) {
        // this.meta.addTag({ property: key, content: companyJson[key] });
        // let metaTag: any = document.getElementById(key);
        // if (!!metaTag && !!metaTag.content) { metaTag.content = companyJson[key]; }
      }
    });
  }

  async loadCompanyData() {
    console.log(this._companyService.companyObj);
    if (this._companyService.companyObj && this._companyService.companyObj) {
      this.companyLogo = this._companyService.companyObj.companyLogo;

      if (this._companyService.companyObj.productType) {
        this.searchType = this._companyService.companyObj.productType;
      }

      if (this.searchType == 'diamond') {
        this.logoHeight = '50';
        this.showMenuOnRight = true;
      }

      if (this._companyService.companyObj.config) {
        let companyJson = this._companyService.companyObj.config;

        if (!!companyJson) {
          if (!!companyJson.defaultSeo) {
            this.setFavicon(companyJson.defaultSeo);
          }
          if (!!companyJson.algoliaIndexName) {
          }
          this.loggedInUser = await this.storage.get('loggedInUser');
          console.log(this.loggedInUser);
          this.companyJson.homePageHeaderLinks = [];
          this.companyJson.loggedInUserHeaderLinks = [];

          this.isSearchHidden = !!companyJson.isSearchHidden
            ? companyJson.isSearchHidden
            : false;
          if (
            !!companyJson &&
            companyJson.loggedInUserHeaderLinks &&
            this.loggedInUser
          ) {
            this.companyJson.homePageHeaderLinks =
              companyJson.loggedInUserHeaderLinks;
            this.companyJson.loggedInUserHeaderLinks =
              companyJson.loggedInUserHeaderLinks;
          } else if (!!companyJson && companyJson.homePageHeaderLinks) {
            this.companyJson.homePageHeaderLinks =
              companyJson.homePageHeaderLinks;
          } else {
            // console.log("no header");
          }

          if (typeof companyJson.hideFavourites != 'undefined') {
            this.hideFavourites = companyJson.hideFavourites;
          }
          if (companyJson?.showContactUs) {
            this.showContactUs = companyJson?.showContactUs;
          }
          if (companyJson?.headerToolbarClass) {
            this.headerToolbarClass = companyJson?.headerToolbarClass;
          }
          if (companyJson?.headerIconColor) {
            this.headerIconColor = companyJson?.headerIconColor;
          }

          if (companyJson?.hideLoginIcon) {
            this.hideLoginIcon = companyJson?.hideLoginIcon;
          }

          if (companyJson?.headerLinkRight) {
            this.headerLinkRight = companyJson?.headerLinkRight;
          }

          if (companyJson?.showMobileLogo) {
            this.showMobileLogo = companyJson?.showMobileLogo;
          }

          if (!!companyJson.KYCrequired) {
            this.checkKYC = companyJson.KYCrequired;
          }

          if (companyJson?.hideInSmallScreen) {
            this.hideInSmallScreen = companyJson?.hideInSmallScreen;
          }
          if (companyJson?.loggedIn) {
            this.loggedinRedirect = companyJson?.loggedIn;
          }
          if (!!companyJson.externalProduct) {
            this.excludeParameters =
              companyJson.externalProduct.excludeParameters;
          }

          if (!!companyJson.externalProduct.kgAppliedPrice) {
            this.kgPricing = companyJson.externalProduct.kgAppliedPrice;
          }
        }
      }
    }
  }

  menuOpen() {
    this.menu.enable(true, 'menu');
    this.menu.open('menu');
  }

  async ngOnInit() {
    this.innerWidth = window.innerWidth;
    if (this.innerWidth <= 500) {
      this.showBackButton = 'false';
      this.sideMarginClass = '';
      this.mobileView = true;
    } else if (this.innerWidth > 500) {
      this.showBackButton = 'true';
      this.mobileView = false;
      if (this._companyService.productListing == 'grid') {
        this.sideMarginClass = 'ml30';
      } else {
        this.sideMarginClass = '';
      }
    }
    this.theme.themeBoolean$.subscribe((value: boolean) => {
      this.showImage = value;
    });

    // console.log("this.showBackButton", this.showBackButton);
    // console.log("this.title", this.title);
    await this.loadCompanyData();

    await this.checkKyc();
    // this.companyLogo = "https://cdn.shopify.com/s/files/1/0166/3704/t/122/assets/atisundar_logo_new.gif?853";
  }
  openPage(obj) {
    // console.log("obj", obj);
    let navigationExtras: NavigationExtras;
    if (!!obj.config && obj.config != '') {
      // console.log("obj.config", typeof obj.config);
      navigationExtras = {
        queryParams: {
          query: JSON.stringify(obj.config),
        },
      };
    }

    if (this.companyJson.loggedInUserHeaderLinks) {
      this.router.navigateByUrl(obj.redirectTo);
    } else {
      this.router.navigate([obj.redirectTo.toLowerCase()], navigationExtras);
    }
    // this.router.navigateByUrl(obj.redirectTo);
  }
  async goToHomePage() {
    this.loadMoreData = [];
    this.totalHits = 0;
    this.userId = await this.storage.get('userID');
    let data = await this._companyService.defaultHomePage(true);
    if (data) {
      this.router.navigateByUrl(data);
    } else {
      this.router.navigateByUrl('/');
    }
  }

  async openFromHeader(dt) {
    if (dt == 'cart') {
      this._cartService.observables.next('data');
    } else if (dt == 'search') {
      this.mobileSearch = !this.mobileSearch;
      // console.log("dt", dt, this.mobileSearch);
    } else {
      let redirectTo = '';
      if (dt == 'profile') {
        redirectTo = '/setting';
      } else if (dt == 'wishlist') {
        redirectTo = '/my-favorite';
      } else if (dt == 'login') {
        redirectTo = this.loggedinRedirect;
      } else if ((dt = 'accessories')) {
        redirectTo = '/accessories';
      }

      this.currentPage = dt;

      let loggedInUser = await this.storage.get('loggedInUser');
      // console.log("loggedInUser", loggedInUser);
      if (redirectTo === '/accessories') {
        this.router.navigate([redirectTo]);
      } else if (loggedInUser) {
        this.router.navigate([redirectTo]);
      } else {
        let navigationExtras: NavigationExtras = {
          queryParams: {
            to: redirectTo,
            showLogin: dt == 'login' ? true : false,
          },
        };
        console.log(navigationExtras);
        this.router.navigate(['/login-with-sign-up'], navigationExtras);
      }
    }
  }

  onSearchChange({ results, state }: { results: any; state: any }) {
    // console.log("results", results, "state", state);
    // this.router.navigateByUrl("search");
  }
  async searchIconDisplayfn() {
    let loggedInUser = await this.storage.get('loggedInUser');
    if (this._companyService.companyObj.config.storeType != 'private') {
      this.searchIconDisplay = true;
    } else if (
      this._companyService.companyObj.config.storeType == 'private' &&
      !!loggedInUser
    ) {
      this.searchIconDisplay = true;
    } else if (
      this._companyService.companyObj.config.showSearch &&
      !!loggedInUser
    ) {
      this.searchIconDisplay = true;
    }
  }

  getToolbarClass() {
    return this.headerToolbarClass;
  }

  async openDNAPopup() {
    await this.loadUserData();
    const popover = await this.popoverController.create({
      component: ShowDNAComponent,
      cssClass: 'custom-popover',
      //translucent: true,
      //mode: 'ios',
    });
    await popover.present();
    // let modal = await this.modalCtrl.create({
    //   component: ShowDNAComponent,
    //   showBackdrop: true,
    //   cssClass: 'modal-medium'
    // });
    // modal.present();
    popover.onDidDismiss().then(res => {
      if (res.data) {
        console.log(res.data);
        let product = res.data;
        let payload = {
          userId: this.userId,
          stoneName: product.stoneName,
          username: this.userData ? this.userData.name : '',
          user: this.userData ? this.userData.username : '',
        };
        this.analyticsService.addEvents('Show DNA', payload);
        this.navCtrl.navigateForward([
          '/products/' +
            product.stoneName +
            '/' +
            product.stoneName +
            '/' +
            product.location,
        ]);
      }
    });
  }

  algolia(loadOption: any) {
    let wildcard = {},
      must_not = {},
      search = '';
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
          .map(keys => Array.isArray(keys) && keys[2])
          .filter(res => !!res)
          .filter((v, i, a) => a.indexOf(v) === i);
        let secound: any = options[2]
          .map(keys => Array.isArray(keys) && keys[2])
          .filter(res => !!res)
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
          .map(keys => Array.isArray(keys) && keys[2])
          .filter(res => !!res)
          .filter((v, i, a) => a.indexOf(v) === i);
        if (first.length == 1) {
          searchFilter = first[0];
        } else {
          indivisualFilter = options;
        }
      }
      if (indivisualFilter.length > 0) {
        indivisualFilter.filter(loadOption => {
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

  async search() {
    this.showStoneIdTextbox = false;
    this.qry = '';
    this.qry = {
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
                ],
                should: [],
              },
            },
          ],
        },
      },
      _source: {
        //"include": [ "obj1.*", "obj2.*" ],
        exclude: this.excludeParameters,
      },
      //"_source": ["stoneName", "lab", "ShapeCode", "cts", "ColorCode", "ClarityCode", "CutCode", "PolishCode", "SymmetryCode", "FluorescenceCode", "Rapnet_plusDiscountPercent", "Rapnet_pluspercarat", "Rapnet_plus", "RAPAPORTpercarat", "externalStatus"]
    };
    let stoneObj = {
      bool: {
        should: [
          {
            prefix: {
              stoneName: this.stoneId,
            },
          },
        ],
      },
    };
    this.qry.query.bool.should[1].bool.must.push(stoneObj);
    //for pricing greater than 0
    let rapnetFilter = {
      range: {},
    };
    console.log(this.kgPricing);
    rapnetFilter['range'][this.kgPricing] = {
      gt: 0,
    };
    this.qry.query.bool.should[1].bool.must.push(rapnetFilter);

    let availableStoneFilter = {
      match: {
        availableForSale: 1,
      },
    };
    this.qry.query.bool.should[1].bool.must.push(availableStoneFilter);

    this.es.getPaginatedDocuments(this.qry, 0).then(body => {
      let locationnId;
      let stoneName;
      this.stoneId = '';
      if (!!body.hits.total.value) {
        let data = body.hits.hits;
        let totalHits = body.hits.total.value;
        console.log(data);
        console.log(totalHits);
        if (!!data && data.length > 0) {
          this.founedStones = data.map(d => d._source);
          if (this.founedStones.length > 1) {
            let mumbaiRecord = this.founedStones.filter(
              x => x.location == 'mumbai'
            );
            if (!!mumbaiRecord) {
              console.log(mumbaiRecord);
              locationnId = mumbaiRecord[0]['currentLocation'];
              stoneName = mumbaiRecord[0]['stoneName'];
            }
          } else {
            locationnId = this.founedStones[0]['currentLocation'];
            stoneName = this.founedStones[0]['stoneName'];
          }
          if (!!locationnId && stoneName) {
            let product = {
              stoneName: stoneName,
              location: locationnId,
            };
            this.navCtrl.navigateForward([
              '/products/' +
                product.stoneName +
                '/' +
                product.stoneName +
                '/' +
                product.location,
            ]);
          } else {
            this.configService.presentToast('Stone not found.', 'error');
          }
        } else {
          this.configService.presentToast('Stone not found.', 'error');
        }
      } else {
        this.configService.presentToast('Stone not found.', 'error');
      }
    });

    // let res = await this.es.getPaginatedDocuments(query, 0, index, '', 20);
    // console.log(res)
  }

  cancel() {
    console.log('cancelled');
  }

  selectLanguage(e: any) {
    this.selectedLanguage = e;
    this.translateConfigService.setLanguage(e.target.value);
    this.languageChanged.emit(e);
  }
}
