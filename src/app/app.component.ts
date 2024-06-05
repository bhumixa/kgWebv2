import {
  Component,
  EventEmitter,
  Injectable,
  OnDestroy,
  Output,
} from '@angular/core';
import { NavigationExtras, Router, NavigationStart } from '@angular/router';
import { Device } from '@ionic-native/device/ngx';
//import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {
  AlertController,
  MenuController,
  NavController,
  Platform,
} from '@ionic/angular';
import { Storage } from '@ionic/storage';

import { register } from 'swiper/element/bundle';
import { CompanyService } from './service/company/company.service';
import { ConfigServiceService } from './service/config-service.service';
import { HeaderFooterService } from './service/headerFooter/header-footer.service';
import { CartService } from './service/observable/cart/cart.service';
import { DealerClubService } from './service/observable/dealer-club/dealer-club.service';
import { HeaderFabService } from './service/observable/header-fab/header-fab.service';
import { OpenCartService } from './service/observable/open-cart/open-cart.service';
import { LOGGEDINService } from './service/observable/user/loggedin.service';
import { LOGGEDOUTService } from './service/observable/user/loggedout.service';
import { ThemeService } from './service/theme.service';
import mixpanel from 'mixpanel-browser';
import { AnalyticsService } from './service/analytics.service';
import { DatabaseServiceService } from './service/database-service.service';
import { Subscription, BehaviorSubject, Observable } from 'rxjs';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { TranslateConfigService } from './service/translate-config-service.service';
interface DeeplinkMatch {
  $stoneName: string;
  $refKgCompanyId: number;
}

export let browserRefresh: BehaviorSubject<boolean> =
  new BehaviorSubject<boolean>(false);

export const browserRefresh$: Observable<boolean> =
  browserRefresh.asObservable();

register();

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
})
export class AppComponent implements OnDestroy {
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
  ];
  subscription: Subscription;
  @Output() toggleImage: EventEmitter<boolean> = new EventEmitter<boolean>();
  public parameters: any = false;
  public cartData: any;
  public total;
  public customerAddress;
  public userId: any;
  public loggedInUser: any;
  public sessionID: any;
  public userType: any;
  public page: number = 1;
  public onMobile: any;
  public cartQuantity;
  public imageURL: any;
  public companyLogo: any;
  public totalTax = 0;
  public appName: any;
  public mobileWeb: any = false;
  public skip = 0;
  public limit = 10;
  public companyJson: any = {
    homePageHeaderLinks: [],
  };
  public DisableSavedSearches: any = false;
  public showHideMenuButton = false;
  public showActionButton = true;
  public cartId: any;
  public searchText = '';
  public quantities = [];
  public showSchemes = true;
  public ShowDispatches = true;
  public ShowNeworders = true;
  public selectedCartAction: any;
  public ShowCartPage = false;
  public disableMenu = true;
  public hideFavourites: any = false;
  public isGuestUser: any = false;
  public manageCustomers = false;
  public showNewOrdersForAll = false;
  public showDirectWAInquiry = false;
  public directWAInquiryURL = '';
  public directWAInquiryNumber = '';
  public showFullMenu = false;
  public sideMenu = 'start';
  public headerToolbarClass = '';
  public headerIconColor = 'primary';
  public sideMenuList = [];
  public searchType = 'normal';
  public hideMyNotifications = false;
  public hideMyOrders = false;
  public hideSavedCart = false;
  public hideSavedSearches = false;
  public lightTheme: boolean = true;
  showImage: boolean;
  public mixpanelToken = '';
  defaultLang = this.translateConfigService.getDefaultLanguage();
  constructor(
    private iab: InAppBrowser,
    public appVersion: AppVersion,
    public navCtrl: NavController,
    public _headerFooterService: HeaderFooterService,
    public _configService: ConfigServiceService,
    public alertController: AlertController,
    public databaseService: DatabaseServiceService,
    public _companyService: CompanyService,
    public _LOGGEDINService: LOGGEDINService,
    public _LOGGEDOUTService: LOGGEDOUTService,
    public _openCartService: OpenCartService,
    public _cartService: CartService,
    public _headerFabService: HeaderFabService,
    public _dealerClubService: DealerClubService,
    public storage: Storage,
    private platform: Platform,
    private router: Router,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private menu: MenuController,
    private device: Device,
    private theme: ThemeService,
    public analyticsService: AnalyticsService,
    public companyService: CompanyService,
    //private socialSharing: SocialSharing,
    private alertCtrl: AlertController,
    public translateConfigService: TranslateConfigService
  ) {
    // this.initializeApp();
    // this.loadCompanyData();
    //this.translateConfigService.setLanguage('pt');
    this.translateConfigService.getDefaultLanguage();
    this.subscription = router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        browserRefresh.next(!router.navigated);
      }
    });

    if (this.companyService.underMaintenance) {
      this.router.navigate(['/maintenance']);
    }

    this._LOGGEDINService.observable().subscribe((data) => {
      this.loadCompanyData();
    });

    this._headerFabService.observable().subscribe((data) => {
      this.showHideMenuButton = data;

      // console.log("showHideHeader", data);
    });

    this._dealerClubService.observable().subscribe((data) => {
      this.ngOnInit('dealerClubSupplierChanged');
    });

    this._headerFooterService.cartValueUpdated();

    // this.evenets();
    // this.setSessionAndLoadData();

    //used to change the theme of the app, commented to keep the default
    // this.changeTheme("atisundar");

    // // console.log("this.appName >>>",this.appName);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  async ngOnInit(dt) {
    this.theme.themeBoolean$.subscribe((value: boolean) => {
      this.showImage = value;
    });
    if (
      this._companyService.dealerClubMode == false ||
      dt == 'dealerClubSupplierChanged'
    ) {
      if (this._companyService.productListing == 'grid') {
        this.disableMenu = false;
        this.sideMenu = 'end';
      } else if (this._companyService.productListing == 'list') {
        this.disableMenu = false;
      } else {
        this.sideMenu = 'end';
      }
      await this.initializeApp();
      await this.loadCompanyData();
    } else {
      await this.initializeApp();
    }
  }

  openPage(obj) {
    this.menu.close('menu');

    if (obj.redirectTo) {
      this.router.navigateByUrl(obj.redirectTo);
    } else if (obj.name == 'Logout') {
      this.logOut();
    } else if (obj.name == 'Profile') {
      this.setting();
    }
  }

  async deactivateUser() {
    let userId = await this.storage.get('userID');
    let res = await this.databaseService.deleteUser(userId, 1);
    if (!!res.isSuccess) {
      await this._configService.presentToast(
        'Account Deleted Successfully',
        'success'
      );
      this.logOut();
    } else {
      console.error(res.err);
    }
  }

  async deleteAccount() {
    let alert = await this.alertController.create({
      // title: 'Confirm purchase',
      message: 'Are you sure you want to delete your Account?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {},
        },
        {
          text: 'Ok',
          handler: () => {
            this.deactivateUser();
          },
        },
      ],
    });
    alert.present();
  }

  async loadCompanyData() {
    if (this._companyService.companyObj && this._companyService.companyObj) {
      this.companyLogo = this._companyService.companyObj.companyLogo;
      this.loggedInUser = await this.storage.get('loggedInUser');

      if (this._companyService.companyObj.config) {
        let companyJson = this._companyService.companyObj.config;
        if (!!companyJson) {
          console.log(companyJson.loggedInUserHeaderLinks, this.loggedInUser);
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
          }

          if (typeof companyJson.ShowNeworders != 'undefined') {
            this.ShowNeworders = companyJson.ShowNeworders;
          }

          if (typeof companyJson.showSchemes != 'undefined') {
            this.showSchemes = companyJson.showSchemes;
          }

          if (typeof companyJson.ShowDispatches != 'undefined') {
            this.ShowDispatches = companyJson.ShowDispatches;
          }
          if (typeof companyJson.ShowCartPage) {
            this.ShowCartPage = companyJson.ShowCartPage;
          }

          if (typeof companyJson.showActionButton != 'undefined') {
            this.showActionButton = companyJson.showActionButton;
          }

          if (typeof companyJson.DisableSavedSearches) {
            this.DisableSavedSearches = companyJson.DisableSavedSearches;
          }

          if (typeof companyJson.hideFavourites != 'undefined') {
            this.hideFavourites = companyJson.hideFavourites;
          }

          if (typeof companyJson.showNewOrdersForAll != 'undefined') {
            this.showNewOrdersForAll = companyJson.showNewOrdersForAll;
          }

          if (!!companyJson.showDirectWAInquiry) {
            this.showDirectWAInquiry = companyJson.showDirectWAInquiry;
            this.directWAInquiryNumber = companyJson.directWAInquiryNumber;
          }

          if (!!companyJson.showFullMenu) {
            this.showFullMenu = companyJson.showFullMenu;
          }

          if (companyJson?.headerToolbarClass) {
            this.headerToolbarClass = companyJson?.headerToolbarClass;
          }
          if (companyJson?.headerIconColor) {
            this.headerIconColor = companyJson?.headerIconColor;
          }
          if (this._companyService.companyObj.productType) {
            this.searchType = this._companyService.companyObj.productType;
          }

          if (!!companyJson.externalProduct.mixpanelToken) {
            this.mixpanelToken = companyJson.externalProduct.mixpanelToken;

            // mix panel analytics
            mixpanel.init(this.mixpanelToken, { debug: true });
            mixpanel.track('Website Visit');
          }

          if (!!this.directWAInquiryNumber && !!this.showDirectWAInquiry) {
            if (this.onMobile) {
              if (
                this.platform.is('ios') ||
                this.platform.is('ipad') ||
                this.platform.is('iphone')
              ) {
                this.directWAInquiryURL =
                  'https://wa.me/' +
                  this.directWAInquiryNumber +
                  '/?text=Hello';
              } else {
                this.directWAInquiryURL =
                  'https://api.whatsapp.com/send?phone=' +
                  this.directWAInquiryNumber +
                  '&text=Hello';
              }
            } else {
              this.directWAInquiryURL =
                'https://api.whatsapp.com/send?phone=' +
                this.directWAInquiryNumber +
                '&text=Hello';
            }
          }

          if (companyJson?.sideMenuList) {
            this.sideMenuList = companyJson?.sideMenuList;
          }

          if (companyJson?.hideMyNotifications) {
            this.hideMyNotifications = companyJson?.hideMyNotifications;
          }

          if (companyJson?.hideMyOrders) {
            this.hideMyOrders = companyJson?.hideMyOrders;
          }

          if (companyJson?.hideSavedCart) {
            this.hideSavedCart = companyJson?.hideSavedCart;
          }

          if (companyJson?.hideSavedSearches) {
            this.hideSavedSearches = companyJson?.hideSavedSearches;
          }
        }
      }
    }
  }

  async initializeApp() {
    this.platform.ready().then(() => {
      this.getCompanyByName();
      this.statusBar.styleDefault();
      setTimeout(() => {
        this.splashScreen.hide();
      }, 2000);
      // console.log("this.platform", this.platform);
      if (this.platform.is('desktop') || this.platform.is('mobileweb')) {
        this.onMobile = false;
        if (this.platform.is('mobileweb')) {
          this.mobileWeb = true;
        }
      } else {
        this.onMobile = true;
      }
      this.eventsLoad();
      this.setSessionAndLoadData();
      this.checkAppVersion();
      // console.log("this.onMobile", this.onMobile);
    });
    // await this.getCompanyByName();
  }

  async checkAppVersion() {
    this.appVersion
      .getVersionNumber()
      .then(async (res: any) => {
        let currentAppVersion = parseInt(res.replaceAll('.', ''));
        let detailsRes: any = await this.databaseService.getCompanyDetails();
        if (detailsRes.isSuccess) {
          let data = detailsRes.data;

          let newVersion;
          let platform;
          if (this.platform.is('android')) {
            newVersion = parseInt(data?.androidVersion.replaceAll('.', ''));
            platform = 'android';
          }
          if (this.platform.is('ios')) {
            newVersion = parseInt(data?.iosVersion.replaceAll('.', ''));
            platform = 'ios';
          }

          if (currentAppVersion < newVersion) {
            this.showUpdateAppPopup(platform);
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  showUpdateAppPopup(platform) {
    let url;
    let message;
    if (platform == 'android') {
      // url = 'https://play.google.com/store/apps/details?id=com.kg.kgdiamonds&hl=en-IN';
      url = 'market://details?id=com.kg.kgdiamonds';
      message =
        'Updates are available, please update the app to the latest version';
    }

    if (platform == 'ios') {
      //url = 'https://apps.apple.com/in/app/kg-diamonds/id1641236433'
      url = 'https://itunes.apple.com/gb/app/id1641236433';
      message =
        'Updates are available, please update the app to the latest version';
    }

    this.alertCtrl
      .create({
        header: 'App Update!',
        message: message,
        backdropDismiss: false,
        buttons: [
          {
            text: 'Update',
            handler: () => {
              if (platform == 'android') {
                window.open(url, '_system');
              }

              if (platform == 'ios') {
                this.iab.create(url);
                // this.previewAnyFile.preview(url).then((res: any) => {

                //   //this.configService.presentToast("File Downloaded", "success");
                // }, (error) => {
                //   // handle error
                //   console.error(error)
                // });
              }
            },
          },
        ],
      })
      .then((alert) => {
        alert.present();
      });
  }

  async eventsLoad() {
    this._LOGGEDINService.observable().subscribe((data) => {
      this.storage.get('userID').then((val) => {
        this.userId = val;
      });
      this.storage.get('loggedInUser').then((val) => {
        this.loggedInUser = val;
        // console.log("loggedInUser from storage", this.loggedInUser, this.userId);
      });

      this.storage.get('manageCustomers').then((val) => {
        if (!!val) {
          this.manageCustomers = val;
        } else {
          this.manageCustomers = false;
        }
      });

      this.storage.get('userData').then((userData) => {
        if (!!userData) {
          this.isGuestUser = userData.isGuest;
          // console.log("isGuest", this.isGuestUser);
        }
      });
    });
    this._cartService.observable().subscribe((data) => {
      // if(!!data){
      //   this.taxPrice=data;
      // }
      // console.log("data", data);
      this.openCart();
    });
  }

  async setSessionAndLoadData() {
    await this.setSessionId();
    //await this.loadData();
    if (
      this.loggedInUser &&
      this.loggedInUser != null &&
      this.loggedInUser != undefined
    ) {
      await this.fetchUserDetails();
    }
  }

  async setSessionId() {
    this.userId = await this.storage.get('userID');
    this.sessionID = await this.storage.get('sessionID');
    this.loggedInUser = await this.storage.get('loggedInUser');
    this.userType = await this.storage.get('userType');

    this.storage.get('manageCustomers').then((val) => {
      if (!!val) {
        this.manageCustomers = val;
      } else {
        this.manageCustomers = false;
      }
    });

    // console.log("userType", this.userType);
    // console.log("userId", this.userId, this.sessionID, this.loggedInUser);
    if (!this.userId && !this.sessionID) {
      if (this.onMobile) {
        this.sessionID = await ConfigServiceService.generateSessionID(
          this.device.uuid
        );
      } else {
        this.sessionID =
          await ConfigServiceService.generateSessionIdForDesktop();
      }
      await this.storage.set('sessionID', this.sessionID);
      let sessionId = await this.storage.get('sessionID');
      // console.log(sessionId)
      // console.log("Device UUID is: " + this.device.uuid, this.userId, this.sessionID);
    }
  }

  async fetchUserDetails() {
    let userData = await this._headerFooterService.fetchUserProfileDetails(
      this.userId
    );
    // console.log("userData", userData);
    if (!!userData.data && userData.data != undefined && userData.data.image) {
      this.imageURL = userData.data.image;
      // console.log("image", this.imageURL);
    }
    if (!!userData && !!userData.data && userData.data.isGuest != undefined) {
      this.isGuestUser = userData.data.isGuest;
      // console.log("isGuest", this.isGuestUser);
    }
    if (userData.status != 401) {
      if (!userData.isSuccess) {
        this._configService.presentToast(userData.error, 'error');
        // this.logOut("", false);
      } else {
      }
    } else {
      this.logOut('', false);
    }
  }

  openHome() {
    this.menu.close('menu');
    this.router.navigateByUrl('/home');
  }

  async goToSchemes() {
    this.loggedInUser = await this.storage.get('loggedInUser');
    this.menu.close('menu');

    if (this.loggedInUser) {
      this.router.navigateByUrl('/schemes');
      // this.router.navigate(["/orders"])
    } else {
      //this._configService.presentToast("Please Login", "error");
      let navigationExtras: NavigationExtras = {
        queryParams: {
          to: '/schemes',
        },
      };
      this.router.navigate(['/login-with-sign-up'], navigationExtras);
    }
  }

  async goToDispatch() {
    this.loggedInUser = await this.storage.get('loggedInUser');
    this.menu.close('menu');

    if (this.loggedInUser) {
      this.router.navigateByUrl('/dispatchs');
      // this.router.navigate(["/orders"])
    } else {
      //this._configService.presentToast("Please Login", "error");
      let navigationExtras: NavigationExtras = {
        queryParams: {
          to: '/schemes',
        },
      };
      this.router.navigate(['/login-with-sign-up'], navigationExtras);
    }
  }

  async openOrders() {
    this.loggedInUser = await this.storage.get('loggedInUser');
    this.menu.close('menu');

    if (this.loggedInUser) {
      this.router.navigateByUrl('/orders/All');
      // this.router.navigate(["/orders"])
    } else {
      //this._configService.presentToast("Please Login", "error");
      let navigationExtras: NavigationExtras = {
        queryParams: {
          to: '/orders/All',
        },
      };
      this.router.navigate(['/login-with-sign-up'], navigationExtras);
    }
  }

  async openSavedCarts() {
    this.loggedInUser = await this.storage.get('loggedInUser');
    this.menu.close('menu');

    if (this.loggedInUser) {
      this.router.navigateByUrl('/saved-carts');
    } else {
      this.router.navigate(['/login-with-sign-up']);
    }
  }

  async openSavedSeraches() {
    this.loggedInUser = await this.storage.get('loggedInUser');
    this.menu.close('menu');

    if (this.loggedInUser) {
      this.router.navigateByUrl('/saved-searches');
    } else {
      this.router.navigate(['/login-with-sign-up']);
    }
  }

  menuOpen() {
    this.menu.enable(true, 'menu');
    this.menu.open('menu');
  }

  openCart() {
    // if (this.loggedInUser) {
    // console.log("if", this.loggedInUser);
    //this.loadData();
    // this.getCustomerAddress();
    if (this.ShowCartPage) {
      this.router.navigate(['/my-cart']);
      this.menu.close('menu');
    } else {
      this.menu.open('cart');
      this._openCartService.observables.next('cart');
      this.menu.close('menu');
    }
    // // }
    // else {
    //   // console.log("else", this.loggedInUser);
    //   this._configService.presentToast('please Login');
    //   this.router.navigate(["/login"]);
    // }
  }
  openLayouts() {
    this.router.navigate(['/accessories']);
    this.menu.close('menu');
  }

  // onClick(item) {
  //   // console.log(item.id)
  //   Object.keys(this.hideme).forEach(h => {
  //     this.hideme[h] = true;
  //   });
  //   this.hideme[item.id] = false;
  // }

  Login() {
    this.menu.close('menu');
    let navigationExtras: NavigationExtras = {
      queryParams: {
        showLogin: true,
      },
    };
    this.router.navigate(['/login-with-sign-up'], navigationExtras);
    //this.router.navigate(["/sign-up"]);
  }

  // async getCustomerAddress() {
  //   if (this.userId != undefined && this.userId != null && this.!Number.isNaN(userId) && this.cartData.data && this.cartData.data.length > 0) {
  //     let res = await this._databaseService.getCustomerAddress(this.userId);
  //     if (!!res.isSuccess) {
  //       // console.log("res Address", res);
  //       this.customerAddress = res;
  //     } else {
  //       console.error(res.err);
  //     }
  //   }
  // }

  async openMyAddress() {
    this.menu.close('menu');
    this.loggedInUser = await this.storage.get('loggedInUser');
    // console.log("loggedInUser", this.loggedInUser);
    if (this.loggedInUser) {
      this.router.navigate(['/my-addresses']);
    } else {
      //this._configService.presentToast("Please Login", "error");
      let navigationExtras: NavigationExtras = {
        queryParams: {
          to: '/my-addresses',
        },
      };
      this.router.navigate(['/login-with-sign-up'], navigationExtras);
    }
  }
  async logOut(message = 'Logout Successful', showMsg = true) {
    const user = await this.storage.get('userData');

    if (showMsg) this._configService.presentToast(message, 'success');
    let logOutRes: any = await this._headerFooterService.logoutFromTalkBrite();

    //mixpanel
    this.analyticsService.addEvents('user Logged Out', {
      username: user?.name,
      user: user?.username,
    });

    this.storage.remove('userID');
    this.storage.remove('guestUser');
    this.storage.remove('loggedInUser');
    this.storage.remove('userData');
    this.storage.remove('pincode');
    this.storage.remove('talkBriteAccessToken');
    this.storage.remove('searchData');
    this.storage.remove('deeplink-stoneName');
    this.storage.remove('deeplink-location');
    this.storage.remove('distributorEmailSended');
    // this.storage.remove('isEventPopup');
    this._configService.userNumber = '';
    this.loggedInUser = '';
    this.userId = null;
    this._LOGGEDOUTService.observables.next('loggedOut');
    this.analyticsService.logout(user.username);
    this._LOGGEDINService.observables.next('loggedIn');
    // console.log("logout", this._configService.userNumber, this.loggedInUser);
    // if (showMsg) this._configService.presentToast(message, "success");
    this.menu.close('menu');
    await this._headerFooterService.cartValueUpdated();
    if (this._configService.dealerClubMode == true) {
      this.router.navigateByUrl('/');
    } else {
      if (this._companyService.companyObj.config) {
        let companyJson = this._companyService.companyObj.config;
        if (!!companyJson) {
          if (!!companyJson.storeType) {
            this.router.navigate(['/login-with-sign-up']);
          } else {
            this.router.navigateByUrl('/home');
          }
        }
      }
    }
  }

  async openNotifications() {
    this.menu.close('menu');
    this.loggedInUser = await this.storage.get('loggedInUser');
    // console.log("loggedInUser", this.loggedInUser);
    if (this.loggedInUser) {
      this.router.navigate(['/notifications']);
    } else {
      //this._configService.presentToast("Please Login", "error");
      let navigationExtras: NavigationExtras = {
        queryParams: {
          to: '/notifications',
        },
      };
      this.router.navigate(['/login-with-sign-up'], navigationExtras);
    }
  }

  async openMyCustomers() {
    this.menu.close('menu');
    this.loggedInUser = await this.storage.get('loggedInUser');
    // console.log("loggedInUser", this.loggedInUser);
    if (this.loggedInUser) {
      this.router.navigate(['/my-customers']);
    } else {
      //this._configService.presentToast("Please Login", "error");
      let navigationExtras: NavigationExtras = {
        queryParams: {
          to: '/my-customers',
        },
      };
      this.router.navigate(['/login-with-sign-up'], navigationExtras);
    }
  }

  async menuClose() {
    this.menu.close('menu');
  }

  async openFavorites() {
    this.menu.close('menu');
    this.loggedInUser = await this.storage.get('loggedInUser');
    // console.log("loggedInUser", this.loggedInUser);
    if (this.loggedInUser) {
      this.router.navigate(['/my-favorite']);
    } else {
      //this._configService.presentToast("Please Login", "error");
      let navigationExtras: NavigationExtras = {
        queryParams: {
          to: '/my-favorite',
        },
      };
      this.router.navigate(['/login-with-sign-up'], navigationExtras);
    }
  }

  async setting() {
    this.menu.close('menu');
    this.loggedInUser = await this.storage.get('loggedInUser');
    if (this.loggedInUser) {
      this.router.navigate(['/setting']);
    } else {
      //this._configService.presentToast("Please Login", "error");
      let navigationExtras: NavigationExtras = {
        queryParams: {
          to: '/setting',
        },
      };
      this.router.navigate(['/login-with-sign-up'], navigationExtras);
    }
  }

  async newOrder() {
    if (this.showNewOrdersForAll) {
      this.menu.close('menu');
      this.router.navigate(['/new-order']);
    } else {
      this.loggedInUser = await this.storage.get('loggedInUser');
      if (this.loggedInUser) {
        this.menu.close('menu');
        this.router.navigate(['/new-order']);
      } else {
        this.menu.close('menu');
        //this._configService.presentToast("Please Login", "error");
        let navigationExtras: NavigationExtras = {
          queryParams: {
            to: '/new-order',
          },
        };
        this.router.navigate(['/login-with-sign-up'], navigationExtras);
      }
    }
  }

  async changeTheme(name) {
    this.theme.setTheme(name);
  }

  async getCompanyByName() {
    const url = window.location;
    this.theme.setThemeBoolean(true);

    await this.changeTheme('lightLattice');
    if (this._configService.getAppName() == '') {
      await this._configService.setAppName();
    }
    let res;
    res = this._companyService.setCompanyInfo();
    if (res) {
      // console.log("companyRes", res);
      this._configService.companyName = res.name;
      await this._configService.setTitle(
        'Welcome to ' + this._configService.companyName + ' '
      );
      this.appName = res.name;
      this.companyLogo = res.companyLogo;
      // await this.changeTheme(this.appName);
    }
    // if (
    //   url.href.includes('kgdiamonds') ||
    //   url.href.includes('localhost') ||
    //   url.href.includes('192.168.7.133')
    // ) {
    //   // || url.href.includes('localhost')
    //   this.theme.setThemeBoolean(true);

    //   await this.changeTheme('lightLattice');
    //   if (this._configService.getAppName() == '') {
    //     await this._configService.setAppName();
    //   }
    //   let res;
    //   res = this._companyService.setCompanyInfo();
    //   if (res) {
    //     // console.log("companyRes", res);
    //     this._configService.companyName = res.name;
    //     await this._configService.setTitle(
    //       'Welcome to ' + this._configService.companyName + ' '
    //     );
    //     this.appName = res.name;
    //     this.companyLogo = res.companyLogo;
    //     // await this.changeTheme(this.appName);
    //   }
    // } else {
    //   await this.changeTheme('darkLattice');
    //   this.theme.setThemeBoolean(false);
    //   await this._configService.setTitle(
    //     'Welcome to ' + 'Aspeco Diamonds' + ' '
    //   );
    // }

    // if (this._configService.getAppName() == '') {
    //   await this._configService.setAppName();
    // }
    // let res;
    // res = this._companyService.setCompanyInfo();
    // if (res) {
    //   // console.log("companyRes", res);
    //   this._configService.companyName = res.name;
    //   await this._configService.setTitle(
    //     'Welcome to ' + this._configService.companyName + ' '
    //   );

    //   this.appName = res.name;
    //   this.companyLogo = res.companyLogo;

    //   // await this.changeTheme(this.appName);
    // }
  }

  valChange(value: string, index: number): void {
    this.quantities[index] = value;
  }
  SwitchSupplier() {
    this.menu.close('menu');
    this.router.navigateByUrl('/');
  }

  async sendDirectInquiryViaPlugin() {
    // this.sendDirectInquiry();
    // this.socialSharing
    //   .shareViaWhatsAppToReceiver(this.directWAInquiryNumber, 'Hello')
    //   .then(() => {
    //     // console.log("shared");
    //   });
  }

  async goToHomePage() {
    this.userId = await this.storage.get('userID');
    let data = await this._companyService.defaultHomePage(true);
    if (data) {
      this.router.navigateByUrl(data);
    } else {
      this.router.navigateByUrl('/');
    }
  }

  getToolbarClass() {
    return this.headerToolbarClass;
  }

  // private async initDeepLinking(): Promise<void> {
  //   if (this.platform.is('cordova')) {
  //     await this.initDeepLinkingBranchio();
  //   }
  // }

  // ngAfterViewInit() {
  //   this.platform.ready().then(async () => {
  //     await this.initDeepLinking();
  //   });
  // }

  // private async initDeepLinkingBranchio(): Promise<void> {
  //   try {
  //     const branchIo = window['Branch'];
  //     const data: DeeplinkMatch =
  //       await branchIo.initSession();
  //     console.log(data.$stoneName)
  //     if (data.$stoneName !== undefined && data.$refKgCompanyId!== undefined) {
  //       //alert('Parameter' + data.$stoneName + '---' + data.$refKgCompanyId);
  //       this.navCtrl.navigateForward(["/products/" + data.$stoneName + "/" + data.$stoneName + "/" + data.$refKgCompanyId]);
  //     }

  //   } catch (err) {
  //     console.error(err);
  //   }
  // }
}
