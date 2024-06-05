import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { NavController, Platform } from "@ionic/angular";
import { Storage } from "@ionic/storage";
import { DatabaseServiceService } from "../../service/database-service.service";
import { ConfigServiceService } from "../../service/config-service.service";

@Component({
  selector: "app-my-login",
  templateUrl: "./my-login.page.html",
  styleUrls: ["./my-login.page.scss"]
})
export class MyLoginPage implements OnInit {
  public pinBox: boolean = false;
  public onMobile: any;
  public OTP1: number;
  public OTP2: number;
  public OTP3: number;
  public OTP4: number;
  public OTP5: number;
  public OTP6: number;
  public OTP7: number;
  public phoneNumber: string = "";
  public userExist = false;
  public Mobile: any;
  public password: any;
  public buttonDisabled = false;

  constructor(public platform: Platform, private router: Router, public navCtrl: NavController, public storage: Storage, public databaseServiceService: DatabaseServiceService, public configService: ConfigServiceService) { }

  ngOnInit() {
    this.configService.setTitle("Login to Dealer Club");
  }

  clearOTP() {
    this.pinBox = false;

    this.OTP1 = null;
    this.OTP2 = null;
    this.OTP3 = null;
    this.OTP4 = null;
    this.OTP5 = null;
    this.OTP6 = null;
  }

  async verifyOtp_1() {
    if (this.Mobile && this.Mobile != "+91") {
      let loginWithApp = await this.databaseServiceService.LoginWithApp({ mobNumbers: "91" + this.Mobile.toString() });

      if (loginWithApp == true) {
        this.configService.presentToast("Otp sent to given mobile number", "success");
        this.pinBox = true;
      } else if (loginWithApp.data == "New User") {
        let sendOtp = await this.databaseServiceService.LoginWithApp({ mobNumbers: "91" + this.Mobile.toString() });

        if (sendOtp == true) {
          this.configService.presentToast("Otp sent to given mobile number", "success");
          this.pinBox = true;
        } else {
          this.configService.presentToast("Some Error Occur", "error");
        }
      }
    } else {
      this.configService.presentToast("Please Enter Mobile number", "error");
    }
  }

  moveFocus(input) {
    input.setFocus();
  }

  async verifyOtp() {
    try {
      if (!!this.OTP1 && this.OTP2 && this.OTP3 && this.OTP4 && this.OTP5 && this.OTP6) {
        this.buttonDisabled = true;
        let dataOTPConfirmation: any = await this.databaseServiceService.loginWithConfirmation({
          mobNumbers: "91" + this.Mobile.toString(),
          otp: this.OTP1 + this.OTP2 + this.OTP3 + this.OTP4 + this.OTP5 + this.OTP6
        });
        this.buttonDisabled = false;
        if (dataOTPConfirmation.data) {
          this.configService.userNumber = "" + "91" + this.Mobile.toString();
          await this.storage.set("loggedInUser", this.configService.userNumber);

          this.navCtrl.navigateRoot("/");

          this.cancelLogin();
        } else {
          this.pinBox = true;
          this.configService.presentToast(dataOTPConfirmation.error, "error");
        }
      } else {
        this.configService.presentToast("Please Enter OTP", "error");
      }
    } catch (e) {
      this.pinBox = true;
      this.buttonDisabled = false;
      this.configService.presentToast(e, "error");
    }
  }

  async cancelLogin() {
    this.clearOTP();
    this.pinBox = false;
  }

  async getOTPCall() {
    let res = await this.databaseServiceService.getOTPCall("91" + this.Mobile.toString());
    this.pinBox = true;
    if (!!res && res.isSuccess) {
      this.configService.presentToast("Calling to given mobile number", "success");
    }
  }

  async resendOtp() {
    let loginWithApp = await this.databaseServiceService.LoginWithApp({
      mobNumbers: "91" + this.Mobile.toString(),
      email: "",
      password: this.password,
      name: ""
    });
    this.pinBox = true;
    if (loginWithApp == true) {
      this.configService.presentToast("Otp sent to given mobile number", "success");
    }
  }
}
