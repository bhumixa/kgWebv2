import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { DatabaseServiceService } from '../../service/database-service.service';
import { ConfigServiceService } from '../../service/config-service.service';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Storage } from '@ionic/storage';
import { CompanyService } from '../../service/company/company.service';
import { LOGGEDINService } from '../../service/observable/user/loggedin.service';
import { AnalyticsService } from 'src/app/service/analytics.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {
  public Mobile: any;
  public password: any;
  public verifyPassword: any;
  public sessionID: any;
  public view: any;
  public to: any;
  public allViewActions: any = this._companyService.allActions;
  public buttonDisabled = false;

  constructor(
    public _companyService: CompanyService,
    private route: ActivatedRoute,
    public _LOGGEDINService: LOGGEDINService,
    private router: Router,
    public storage: Storage,
    public platform: Platform,
    public databaseServiceService: DatabaseServiceService,
    public _configService: ConfigServiceService,
    public navCtrl: NavController,
    public analyticsService: AnalyticsService
  ) {
    this.route.queryParams.subscribe((params) => {
      if (params && params['Mobile']) {
        this.Mobile = params['Mobile'];
      }
    });
  }

  ngOnInit() {}

  async insertLoginView() {
    let loginAction = 6;
    if (!!this.allViewActions && !!this.allViewActions.login) {
      loginAction = this.allViewActions.login;
    }
    let jsonObj = {
      actionId: loginAction,
      refProductId: null,
    };

    let res: any;

    res = await this._companyService.insertView(jsonObj);
    if (res.status == 0) {
      // console.log("error");
    } else {
      // console.log("login view insert res", res);
    }
  }

  async loginAfterPWDReset() {
    this.sessionID = await this.storage.get('sessionID');

    this._configService.userNumber = '' + this.Mobile;
    let mobileNo = this._configService.userNumber;
    await this.databaseServiceService.showLoading();
    let response = await this.databaseServiceService.userLoginForDesktop(
      mobileNo,
      this.password
    );

    await this.databaseServiceService.hideLoading();
    if (response.isSuccess) {
      // console.log("this._configService.userNumber", this._configService.userNumber, response.data);
      await this.storage.set('userData', response.data);

      await this.storage.set('loggedInUser', this._configService.userNumber);
      await this.storage.set('userID', response.data.id);
      if (response.data.userType == null) {
        await this.storage.set('userType', 'User');
      } else {
        await this.storage.set('userType', response.data.userType);
      }

      await this.storage.set(
        this._configService.TOKEN_KEY,
        response.data.token
      );

      // console.log("sessionID", this.sessionID);
      this.databaseServiceService.setCartForCustomer(
        response.data.id,
        this.sessionID
      );
      // console.log("user is", this._configService.userNumber);
      this.analyticsService.identify(response.data.username);
      this._LOGGEDINService.observables.next('loggedIn');
      await this.insertLoginView();
      if (!!this.view && !!this.to) {
        let navigationExtras: NavigationExtras = {
          queryParams: {
            to: this.to,
            view: this.view,
          },
        };
        this.router.navigate([this.to], navigationExtras);
      } else {
        if (!!this.to) {
          this.navCtrl.navigateForward([this.to]);
        } else {
          //this.router.navigateByUrl("/home");

          let redirectTo = '/home';
          if (this._companyService.companyObj.config) {
            let companyJson = this._companyService.companyObj.config;
            if (!!companyJson) {
              if (!!companyJson.redirectAfterLogin) {
                redirectTo = companyJson.redirectAfterLogin;
              }
            }
          }
          this.router.navigateByUrl(redirectTo);
        }
      }
    }
  }

  async Update() {
    this.buttonDisabled = true;
    // console.log(this.Mobile, this.password, this.verifyPassword);
    if (this.password && this.verifyPassword) {
      if (this.password != this.verifyPassword) {
        this._configService.presentToast(
          'Your password does not match',
          'error'
        );
        this.buttonDisabled = false;
      } else {
        if (this.password.length <= 5) {
          this._configService.presentToast(
            'Password length must be greater than 5 characters',
            'error'
          );
          this.buttonDisabled = false;
        } else {
          await this.databaseServiceService.showLoading();
          let oldLoginResponse =
            await this.databaseServiceService.userLoginForDesktop(
              this.Mobile,
              this.password
            );
          if (oldLoginResponse.isSuccess) {
            this.buttonDisabled = false;
            await this.databaseServiceService.hideLoading();
            this._configService.presentToast(
              'Please Enter New Password',
              'error'
            );
          } else {
            let response = await this.databaseServiceService.updatePassword(
              this.Mobile,
              this.password
            );
            this.buttonDisabled = false;
            await this.databaseServiceService.hideLoading();
            let temp = this.loginAfterPWDReset();
          }
        }
      }
    } else {
      this._configService.presentToast('Enter all details', 'error');
      this.buttonDisabled = false;
    }
  }
}
