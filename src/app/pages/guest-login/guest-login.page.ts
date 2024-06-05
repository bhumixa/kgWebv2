import { Component, OnInit, Input, HostListener } from "@angular/core";
import { Validators, UntypedFormBuilder, UntypedFormGroup, UntypedFormControl } from "@angular/forms";
import { Storage } from "@ionic/storage";
import { DatabaseServiceService } from "../../service/database-service.service";
import { ConfigServiceService } from "../../service/config-service.service";
import { Router } from "@angular/router";
import { ModalController } from "@ionic/angular";
import { CompanyService } from "../../service/company/company.service";
import { LOGGEDINService } from "../../service/observable/user/loggedin.service";
import { AnalyticsService } from "src/app/service/analytics.service";

@Component({
  selector: "app-guest-login",
  templateUrl: "./guest-login.page.html",
  styleUrls: ["./guest-login.page.scss"]
})
export class GuestLoginPage implements OnInit {
  @Input() formType: any;
  validations_form: UntypedFormGroup;
  public distributioncenters: any = [];
  public onMobile: any;
  public showDistributioncenterInGuestLogin = false;
  public showSpinner: boolean = false;
  public innerWidth: any;
  public mobileView: boolean = false;
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
    if (this.innerWidth <= 500) {
      this.mobileView = true;
    } else if (this.innerWidth > 500) {
      this.mobileView = false;      
    }
  }
  constructor(public analyticsService: AnalyticsService,public _LOGGEDINService: LOGGEDINService, public _companyService: CompanyService, public formBuilder: UntypedFormBuilder, public storage: Storage, public configService: ConfigServiceService, public databaseServiceService: DatabaseServiceService, private router: Router, public viewCtrl: ModalController) { }

  async ngOnInit() {
    this.innerWidth = window.innerWidth;
    if (this.innerWidth <= 500) {
      this.mobileView = true;
    } else if (this.innerWidth > 500) {
      this.mobileView = false;      
    }
    this.validations_form = this.formBuilder.group({
      email: new UntypedFormControl("", Validators.compose([Validators.required, Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$")])),
      phone: new UntypedFormControl("", Validators.compose([Validators.required, Validators.maxLength(25)])),
      distributioncenter: new UntypedFormControl({}, Validators.required)
    });
    let resDist: any = await this.databaseServiceService.getDistributors();
    this.distributioncenters = resDist.data;
    // if(resDist.data.length>0)
    // {
    // this.validations_form.controls.distributioncenter.setValue(this.distributioncenters[0]);
    // }

    this.showDistributioncenterInGuestLogin = true;

    if (this._companyService.companyObj.config) {
      let companyJson = this._companyService.companyObj.config;
      if (!!companyJson) {

        if (companyJson.showDistributioncenterInGuestLogin != undefined && companyJson.showDistributioncenterInGuestLogin == false) {
          this.showDistributioncenterInGuestLogin = companyJson.showDistributioncenterInGuestLogin;
        }
      }
    }
  }

  validation_messages = {
    email: [{ type: "required", message: "Email is required." }, { type: "pattern", message: "Please enter a valid email." }],
    phone: [{ type: "required", message: "Mobile is required." }, { type: "maxlength", message: "Mobile cannot be more than 25 digits long." }],
    distributioncenter: [{ type: "required", message: "Distribution Center is required." }]
  };

  closeModal() {
    // console.log("closeModal ");
    this.viewCtrl.dismiss();
  }

  async onSubmit(values) {
    let mobile: any;
    this.showSpinner = true;
    await this.databaseServiceService.showLoading();
    if (values.phone.internationalNumber) {
      mobile = values.phone.internationalNumber.replace(/[\W_]/g, "")
      mobile = mobile.toString().replace('+', '')
    }
    console.log(mobile)
    let res = await this.databaseServiceService.checkUserExistByPhoneNo(mobile);
    if (res.isSuccess) {
      this.showSpinner = false;
      await this.databaseServiceService.hideLoading();
      this.configService.presentToast("Account already registered, we have sent you link to login", "error");
      //call send link api
    } else {
      if (res.error == "Your account is deactivated. Kindly contact the administrator.") {
        await this.databaseServiceService.hideLoading();
        this.configService.presentToast(res.error, "error");
      } else {

        let res1 = await this.databaseServiceService.checkUserExistByEmail(values.email);
        if (res1.isSuccess) {
          this.showSpinner = false;
          await this.databaseServiceService.hideLoading();
          this.configService.presentToast("Email already registered", "error");
        } else {
          if (res1.error == "Your account is deactivated. Kindly contact the administrator.") {
            this.configService.presentToast(res.error, "error");
            this.showSpinner = false;
          } else {
            //call api
            let urlToPass = "";
            if (!this.onMobile && window && "location" in window && "protocol" in window.location && "pathname" in window.location && "host" in window.location) {
              urlToPass = window.location.origin;
            } else {
              urlToPass = "App";
              //how to send url if there is App
            }
            let obj = {
              email: values.email,
              name: values.email,
              phoneno: mobile, //values.phone.toString().replace("+", ""),
              url: urlToPass,
              refParId: !!this.showDistributioncenterInGuestLogin ? values.distributioncenter.id : -1
            };
            let resGuestLogin = await this.databaseServiceService.GuestLogin(obj);
            if (resGuestLogin.isSuccess) {
              await this.databaseServiceService.hideLoading();
              this.closeModal();
              await this.storage.set(this.configService.TOKEN_KEY, resGuestLogin.data.accessToken);
              //await this.storage.set("loggedInUser", this._configService.userNumber);
              await this.storage.set("userID", resGuestLogin.data.id);
              //let res:any = await this.databaseServiceService.getDiaUserProfile(responses.data.userId);
              //// console.log(res.data)
              await this.storage.set("userData", resGuestLogin.data);
              await this.storage.set("loggedInUser", resGuestLogin.data.username);
              if (resGuestLogin.data.userType == null) {
                await this.storage.set("userType", "User");
              } else {
                await this.storage.set("userType", resGuestLogin.data.userType);
              }
              this.analyticsService.identify(resGuestLogin.data.username)
              this._LOGGEDINService.observables.next("loggedIn");

              let redirectTo = "/";
              if (this._companyService.companyObj.config) {
                let companyJson = this._companyService.companyObj.config;
                if (!!companyJson) {

                  if (!!companyJson.redirectAfterLogin) {
                    redirectTo = companyJson.redirectAfterLogin;
                  }
                }
              }
              this.router.navigateByUrl(redirectTo);
              //this.router.navigateByUrl("/diamond-search");

            } else {
              this.configService.presentToast("Some Errror Occur", "error");
            }
          }
        }
      }
    }
  }
}
