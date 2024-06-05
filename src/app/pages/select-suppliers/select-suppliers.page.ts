import { Component, OnInit } from "@angular/core";
import { Router, NavigationExtras } from "@angular/router";
import { NavController, Platform } from "@ionic/angular";
import { Storage } from "@ionic/storage";
import { DatabaseServiceService } from "../../service/database-service.service";
import { ConfigServiceService } from "../../service/config-service.service";
import { CompanyService } from "../../service/company/company.service";
import { LOGGEDINService } from "../../service/observable/user/loggedin.service";
import { DealerClubService } from "../../service/observable/dealer-club/dealer-club.service";

@Component({
  selector: "app-select-suppliers",
  templateUrl: "./select-suppliers.page.html",
  styleUrls: ["./select-suppliers.page.scss"]
})
export class SelectSuppliersPage implements OnInit {
  public suppliers: any = [];
  public title = "";
  public selectedCompanyId;
  constructor(public _LOGGEDINService: LOGGEDINService, public _dealerClubService: DealerClubService, public _companyService: CompanyService, public platform: Platform, private router: Router, public navCtrl: NavController, public storage: Storage, public databaseServiceService: DatabaseServiceService, public configService: ConfigServiceService) { }

  async ngOnInit() {
    this.configService.setTitle("Select Supplier");
    if (this.configService.dealerClubMode == true) {
      this._companyService.multipleSupplierAvailable = false;
      let loggedInUser = await this.storage.get("loggedInUser");
      this.selectedCompanyId = await this.storage.get("refCompanyId");
      if (!!loggedInUser && loggedInUser != undefined) {
        this.configService.userNumber = loggedInUser;
        let res: any = await this.databaseServiceService.getUserInAllCompany(this.configService.userNumber);
        if (res.data.length == 0) {
          this.configService.presentToast("Please ask your suppliers to add this number to enable access", "error");
        } else if (res.data.length == 1) {
          this.selectSupplier(res.data[0]);
        } else if (res.data.length > 1) {
          this._companyService.multipleSupplierAvailable = true;
          this.title = "Select Supplier";
          this.suppliers = res.data.filter(a => a.isSFEnabled == true || a.isSFEnabled == 1);
        } else {
          this.navCtrl.navigateRoot("/my-login");
        }
      } else {
        this.navCtrl.navigateRoot("/my-login");
      }
    }
  }
  async selectSupplier(supplier) {
    this.databaseServiceService.companyName = supplier.companyName;
    this.configService.companyName = supplier.companyName;
    this.configService.appName = supplier.companyName;
    this.databaseServiceService.refCompanyId = supplier.companyId;

    this.selectedCompanyId = supplier.companyId;

    await this.databaseServiceService.getCompanyByName(this.configService.getAppName());
    await this.databaseServiceService.getCompanyId();
    let response = await this.databaseServiceService.checkUserExistByPhoneNo(this.configService.userNumber);
    await this.loginAndRedirect(response);

    this._dealerClubService.observables.next("dealerClubSupplierChanged");

    this.navCtrl.navigateRoot("/home");
  }

  async loginAndRedirect(response) {
    //this.sessionID = await this.storage.get("sessionID");
    this.configService.userNumber = "" + this.configService.userNumber;

    await this.storage.set("userData", response.data);

    await this.storage.set("loggedInUser", this.configService.userNumber);
    await this.storage.set("userID", response.data.id);
    if (response.data.userType == null) {
      await this.storage.set("userType", "User");
    } else {
      await this.storage.set("userType", response.data.userType);
    }

    await this.storage.set(this.configService.TOKEN_KEY, response.data.accessToken);
    (window as any).fcWidget.setExternalId(response.data.id);
    // To set user name
    (window as any).fcWidget.user.setFirstName(response.data.name);
    // To set user email
    (window as any).fcWidget.user.setEmail(response.data.email);
    // To set user properties
    (window as any).fcWidget.user.setProperties({
      phone: response.data.username,
      status: "Active" // meta property 2
    });
    //// console.log("sessionID", this.sessionID);
    //let cartRes = await this.databaseServiceService.setCartForCustomer(response.data.id, this.sessionID);
    // // console.log("user is", this.configService.userNumber);


    // window["heap"].identify(this.configService.userNumber);
    // window["heap"].addUserProperties({ appName: this.configService.appName });
    this._LOGGEDINService.observables.next("loggedIn");
  }
}
