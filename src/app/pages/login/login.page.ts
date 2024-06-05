import { Component, OnInit } from "@angular/core";
import { Storage } from "@ionic/storage";
import { NavController, LoadingController, Platform } from "@ionic/angular";
import { Router } from "@angular/router";
import { ConfigServiceService } from "../../service/config-service.service";
import { DatabaseServiceService } from "../../service/database-service.service";
import { LOGGEDINService } from "../../service/observable/user/loggedin.service";
import { CompanyService } from "../../service/company/company.service";
import { AnalyticsService } from "src/app/service/analytics.service";

declare var AccountKitPlugin: any;

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"]
})
export class LoginPage implements OnInit {
  public Mobile: any;
  public loading: any;
  public id: any;
  public onMobile: any;
  public sessionID: any;
  public password: any;
  public companyLogo: any;
  public buttons = {
    login: false
  };
  backgrounds = ["assets/images/background/background-1.jpg", "assets/images/background/background-2.jpg", "assets/images/background/background-3.jpg", "assets/images/background/background-4.jpg"];

  constructor(
    public _databaseService: DatabaseServiceService,
    public databaseServiceService: DatabaseServiceService,
    public _LOGGEDINService: LOGGEDINService,
    public _companyService: CompanyService,
    public storage: Storage,
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public platform: Platform,
    private router: Router,
    public _configService: ConfigServiceService,
    public analyticsService: AnalyticsService
  ) {
    this.platform.ready().then(() => {
      // console.log("this.platform", this.platform);
      if (this.platform.is("desktop") || this.platform.is("mobileweb")) {
        this.onMobile = false;
      } else {
        this.onMobile = true;
      }
      // console.log("this.onMobile", this.onMobile);
    });
  }

  ngOnInit() {
    this.getCompanyByName();
  }

  presentLoadingDefault() {
    this.loading = this.loadingCtrl.create({
      message: "Logging in...",
      spinner: "crescent",
      duration: 5000
      // dismissOnPageChange: true
    });

    this.loading.present();
  }
  async loginViaFBaK() {
    this.buttons.login = true;
    this.sessionID = await this.storage.get("sessionID");
    if (this.onMobile) {
      // let successData = await AccountKitPlugin.loginWithPhoneNumber(
      //   {
      //     useAccessToken: true,
      //     defaultCountryCode: "IN",
      //     facebookNotificationsEnabled: true,
      //   });
      AccountKitPlugin.loginWithPhoneNumber(
        {
          useAccessToken: true,
          defaultCountryCode: "IN",
          facebookNotificationsEnabled: true
        },
        successData => {
          // console.log("successData", successData);
          AccountKitPlugin.getAccount(user => {
            // console.log(user);
            // console.log("AT = " + user.phoneNumber);
            let number = user.phoneNumber.toString().replace("+", "");
            // console.log("phonNumber", number);
            this.storage.set("loggedInUser", number);
            this.databaseServiceService.authenticateUserWithTalkBrite(user.token, number).then(response => {
              // console.log("response", response);
              if (response.isSuccess) {
                this.storage.set("userData", response.data);
                this.storage.set("userID", response.data.id);
                // console.log("userId", response.data.id);
                // console.log("sessionID", this.sessionID);
                this._configService.presentToast("Login successful", "success");
                this.databaseServiceService.setCartForCustomer(response.data.id, this.sessionID);
                this.storage.set("talkBriteAccessToken", response.data.token);
                // console.log("talkBriteAccessToken", response.data.token);
                // console.log("userType", response.data.userType);
                this.storage.set("userType", response.data.userType);
                this.analyticsService.identify(response.data.username)
                this._LOGGEDINService.observables.next("loggedIn");
                
                //this.router.navigateRoot("/home",);
                this.router.navigate(["/home"], {replaceUrl: true})
                
              } else {
                this._configService.presentToast(response.error, "error");
              }
            });
          });
        },
        err => {
          alert(err);
          // console.log("error", err);
        }
      );
    } else {
      this._configService.userNumber = "91" + this.Mobile;
      let mobileNo = this._configService.userNumber;
      await this.databaseServiceService.showLoading();
      let response = await this.databaseServiceService.userLoginForDesktop(mobileNo, this.password);
      await this.databaseServiceService.hideLoading();
      if (response.isSuccess) {
        // console.log("this._configService.userNumber", this._configService.userNumber, response.data);
        await this.storage.set("loggedInUser", this._configService.userNumber);
        await this.storage.set("userID", response.data.id);
        if (response.data.userType == null) {
          await this.storage.set("userType", "User");
        } else {
          await this.storage.set("userType", response.data.userType);
        }
        await this.storage.set("talkBriteAccessToken", response.data.token);
        // console.log("sessionID", this.sessionID);
        this.databaseServiceService.setCartForCustomer(response.data.id, this.sessionID);
        // console.log("user is", this._configService.userNumber);
        this.analyticsService.identify(response.data.username)
        this._LOGGEDINService.observables.next("loggedIn");
        //this.router.navigateByUrl("/home");
        this.router.navigate(["/home"], {replaceUrl: true})
      } else {
        this._configService.presentToast("You are not registered with us", "error");
      }
      this.buttons.login = false;
    }
  }
  async getCompanyByName() {
    let res;
    res = await this._databaseService.getCompanyByName(this._configService.getAppName());
    if (res) {
      // console.log("companyRes", res);
      this.companyLogo = res.data.companyLogo;
      // console.log("companyLogo", this.companyLogo);
    }
  }

  async signUp() {
    this.navCtrl.navigateForward(["/sign-up"]);
  }
}
