import { Component, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { DatabaseServiceService } from '../../service/database-service.service';
import { ConfigServiceService } from '../../service/config-service.service';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { CompanyService } from '../../service/company/company.service';
import { PageService } from '../../service/page/page.service';
import { LOGGEDINService } from '../../service/observable/user/loggedin.service';
import { AnalyticsService } from 'src/app/service/analytics.service';
import { ThemeService } from 'src/app/service/theme.service';
import { LoginWithSignupService } from 'src/app/service/login/login-with-sign-up.service';

@Component({
  selector: 'app-login-with-sign-up',
  templateUrl: './login-with-sign-up.page.html',
  styleUrls: ['./login-with-sign-up.page.scss'],
  providers: [LoginWithSignupService],
})
export class LoginWithSignUpPage implements OnInit {
  public pinBox: boolean = false;
  public loginVia: any;
  public email: any;
  public emailMobile: any;
  public onMobile: any;
  public OTP1: number;
  public OTP2: number;
  public OTP3: number;
  public OTP4: number;
  public OTP5: number;
  public OTP6: number;
  public OTP7: number;
  public phoneNumber: string = '';
  public userExist = false;
  public Mobile: any;
  public password: any;
  public verifyNumber = false;
  public verifyPassword: any;
  public sessionID: any;
  public to: any;
  public fromForgetPWD = false;
  public forgetPWD = false;
  public view: any;
  public allViewActions: any;
  public updatePassword = false;
  public buttonDisabled = false;
  public forgotButtonDisabled = false;
  public pageData: any;
  public showHeaderOnHomePage = true;
  public companyJson: any;
  public hideFooter: boolean = false;
  public mobileView: boolean = false;
  public imageDetails: { name: string; link: string; redirectTo: string }[] =
    this.loginWithSignupService.imageDetails;

  showImage: boolean;
  constructor(
    private theme: ThemeService,
    public _pageService: PageService,
    public _companyService: CompanyService,
    public _LOGGEDINService: LOGGEDINService,
    private route: ActivatedRoute,
    private router: Router,
    public storage: Storage,
    public platform: Platform,
    public databaseServiceService: DatabaseServiceService,
    public _configService: ConfigServiceService,
    public navCtrl: NavController,
    public analyticsService: AnalyticsService,
    public loginWithSignupService: LoginWithSignupService
  ) {
    if (
      this._companyService.companyObj &&
      this._companyService.companyObj.config
    ) {
      const companyJson = this._companyService.companyObj.config;
      if (!!companyJson) {
        if (!!companyJson) {
          this.showHeaderOnHomePage = companyJson.showHeaderOnHomePage;
        }

        if (companyJson?.hideFooter) {
          this.hideFooter = companyJson?.hideFooter;
        }
      }
    }

    this.check_platform();
  }

  async ngOnInit() {
    this.theme.themeBoolean$.subscribe((value: boolean) => {
      this.showImage = value;
    });
    const accesstoken = this.route.snapshot.queryParams['accesstoken'];
    if (!!accesstoken) {
      this.check_guestLogin(accesstoken);
    }
  }

  check_platform() {
    this.platform.ready().then(() => {
      if (this.platform.is('iphone') || this.platform.is('android')) {
        this.mobileView = true;
      }
      if (this.platform.is('desktop')) {
        this.onMobile = false;
      } else {
        this.onMobile = true;
      }
    });
  }

  async check_guestLogin(accesstoken: string) {
    const responses = await this.databaseServiceService.GuestLoginsCheck(
      accesstoken
    );
    if (responses.isSuccess) {
      this.storage.set(this._configService.TOKEN_KEY, accesstoken);
      this.storage.set('userID', responses.data.id);
      this.storage.set('userData', responses.data);
      this.storage.set('loggedInUser', responses.data.username);
      if (responses.data.userType == null) {
        this.storage.set('userType', 'User');
      } else {
        this.storage.set('userType', responses.data.userType);
      }
      this.analyticsService.identify(responses.data.username);
      this._LOGGEDINService.observables.next('loggedIn');
      let redirectTo = '/';
      if (this._companyService.companyObj.config) {
        const companyJson = this._companyService.companyObj.config;
        if (!!companyJson) {
          if (!!companyJson.redirectAfterLogin) {
            redirectTo = companyJson.redirectAfterLogin;
          }
        }
      }

      this.router.navigateByUrl(redirectTo);
    } else {
      this._configService.presentToast(responses.error, 'error');
    }
  }

  openPage(obj, redirectToProduct) {
    if (redirectToProduct && redirectToProduct == 'url') {
      this.navCtrl.navigateForward(obj.redirectTo);
    } else if (redirectToProduct && redirectToProduct == '!url') {
      let name = obj.name.replace(/\//g, '-');
      name = obj.name.replace(/ /g, '-');
      this.navCtrl.navigateForward([
        '/products/' + obj.id + '/' + name + '/' + obj.currentLocation,
      ]);
    } else {
      let navigationExtras: NavigationExtras;
      if (!!obj.config && obj.config != '') {
        navigationExtras = {
          queryParams: {
            query: obj.config,
          },
        };
      }
      if (obj.redirectTo.indexOf(document.URL) == 0) {
        this.router.navigate(
          ['/' + obj.redirectTo.split(document.URL)[1]],
          navigationExtras
        );
      } else if (obj.redirectTo[0] == '/') {
        this.router.navigate([obj.redirectTo.toLowerCase()], navigationExtras);
      }
    }
  }
}
