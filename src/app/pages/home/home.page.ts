import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, IonContent } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { ConfigServiceService } from '../../service/config-service.service';
import { ActivatedRoute } from '@angular/router';
import { Storage } from '@ionic/storage';
import { NavController } from '@ionic/angular';
import { CompanyService } from '../../service/company/company.service';
import { PageService } from '../../service/page/page.service';
import { LOGGEDINService } from '../../service/observable/user/loggedin.service';
import { CartService } from '../../service/observable/cart/cart.service';
import { DealerClubService } from '../../service/observable/dealer-club/dealer-club.service';
import { HomePageService } from '../../service/observable/home-page/home-page.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild(IonContent) ionContent: IonContent;

  public defaultpageName = 'homePage';
  public userId: any;
  public display = 'none';
  public pageCollection: any;
  public collectionList: any;
  public subscription: any;
  public showAlert = false;
  public appName: any;
  public showHeaderOnHomePage = true;
  public companyJson: any;
  public pageName: any;
  public hideFooter: boolean = false;
  searchPage = true;
  constructor(
    public _companyService: CompanyService,
    public _pageService: PageService,
    public _LOGGEDINService: LOGGEDINService,
    public _cartService: CartService,
    public _homePageService: HomePageService,
    private route: ActivatedRoute,
    public navCtrl: NavController,
    private router: Router,
    public configService: ConfigServiceService,
    private menu: MenuController,
    public platform: Platform,
    public storage: Storage,
    public _dealerClubService: DealerClubService
  ) {
    if (
      !!this.configService.companyName &&
      this.configService.companyName != ''
    ) {
      this.configService.setTitle(
        'Welcome to ' + this.configService.companyName + ' '
      );
    } else {
      this.configService.setTitle(
        'Welcome to ' + this.configService.appName + ' '
      );
    }

    this.loadCompanyData();

    this.route.queryParams.subscribe((params) => {
      if (!!params && params['openCart'] != null && params['openCart'] == 'yes')
        this.openCart();
    });

    this._dealerClubService.observable().subscribe((data) => {
      this.collectionList = [];
    });

    this._companyService.currentPage = this.defaultpageName;
  }

  async loadCompanyData() {
    if (this._companyService.companyObj.config) {
      let companyJson = this._companyService.companyObj.config;
      //// console.log(companyJson);
      if (!!companyJson) {
        //// console.log(companyJson);
        if (!!companyJson) {
          if (typeof companyJson.showHeaderOnHomePage != 'undefined') {
            this.showHeaderOnHomePage = companyJson.showHeaderOnHomePage;
            // console.log(this.showHeaderOnHomePage);
          }

          if (companyJson?.hideFooter) {
            this.hideFooter = companyJson?.hideFooter;
          }
        }
      }
    }
  }

  async ngOnInit() {
    //await this._companyService.checkAndRedirectForStoreType();
    // console.log(" this.configService.dealerClubMode ", this.configService.dealerClubMode, this.configService.companyName)
    if (
      this.configService.dealerClubMode == false ||
      (this.configService.dealerClubMode == true &&
        this.configService.companyName != 'dealer club')
    ) {
      this.userId = await this.storage.get('userID');
      this.pageName = this.route.snapshot.paramMap.get('id');
      await this.getCompanyName();
      await this.doRefresh(false);
      this._LOGGEDINService.observable().subscribe((data) => {
        this.storage.get('userID').then((val) => {
          this.userId = val;
        });
        this.doRefresh(null);
      });
    }
  }

  async openMenu() {
    this.menu.open('menu');
  }

  openPage() {
    this.menu.close('menu');
    this.router.navigate(['/my-addresses']);
  }
  async ionViewDidEnter() {
    await this._companyService.checkAndRedirectForStoreType();
    // this.exitApp()
    if (
      !!this.configService.companyName &&
      this.configService.companyName != ''
    ) {
      this.configService.setTitle(
        'Welcome to ' + this.configService.companyName + ' '
      );
    } else {
      this.configService.setTitle(
        'Welcome to ' + this.configService.appName + ' '
      );
    }
    this.subscription = this.platform.backButton.subscribe(() => {
      navigator['app'].exitApp();
    });
  }
  getCompanyName() {
    this.appName = this.configService.getAppName();
    // console.log("appName", this.appName);
  }

  ionViewWillLeave() {
    this.subscription && this.subscription.unsubscribe();
  }

  async doRefresh(refresher) {
    this._homePageService.observables.next('');
    let refCompanyId = await this._companyService.refCompanyId;
    let response: any;
    if (!!this.pageName)
      response = await this._pageService.getPageDetailByPageName(
        this.pageName,
        this.userId
      );
    else
      response = await this._pageService.getPageDetailByImageType(refCompanyId);
    if (!!response.isSuccess) {
      // console.log("home response", response);
      this.collectionList = response;
      if (!!refresher) {
        refresher.target.complete();
      }
    } else {
      console.error(response.error);
    }
  }

  openCart() {
    this._cartService.observables.next('data');
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
