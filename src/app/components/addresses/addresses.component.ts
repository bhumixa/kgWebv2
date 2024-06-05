import { Component, OnInit, Input } from "@angular/core";
import { Router } from "@angular/router";
import { NavController } from "@ionic/angular";
import { Storage } from "@ionic/storage";
import { DatabaseServiceService } from "../../service/database-service.service";
import { ConfigServiceService } from "../../service/config-service.service";
import { ShowAddressService } from "../../service/observable/show-address/show-address.service";
import { CompanyService } from "src/app/service/company/company.service";

@Component({
  selector: "app-addresses",
  templateUrl: "./addresses.component.html",
  styleUrls: ["./addresses.component.scss"]
})
export class AddressesComponent implements OnInit {
  public userId: any;
  public addresses;
  public showNewAddress = false;
  public forUser;
  public whoseAddress = "";
  @Input() displayCompany: any;

  constructor(public _showAddressService: ShowAddressService, public _companyService: CompanyService, public navCtrl: NavController, public storage: Storage, public databaseServiceService: DatabaseServiceService, public configService: ConfigServiceService) {
    this._showAddressService.observable().subscribe(data => {
      this.showNewAddress = false;
      this.ngOnInit();
    });
  }

  async ionViewDidEnter() { }

  onChange(addressID) {
    //call api for making changes in address or making it default address
  }

  async delete(addressID) {
    await this.databaseServiceService.showLoading();
    let res = await this.databaseServiceService.deleteCustomerAddress(this.databaseServiceService.refCompanyId, addressID);
    await this.databaseServiceService.hideLoading();
    //call api to delete address

    if (!!res.isSuccess) {
      this.configService.presentToast("Your Address deleted successfully.", "success");
      await this.loadData()
    } else {
      this.configService.presentToast(res.error.message, "error");
      // console.log(res.error);
    }
  }

  showAddresses() {
    this.showNewAddress = false;
  }
  addAddress() {
    //open new page for address adding
    this.configService.editAddressObj = {};
    this.configService.userNumber = "";
    this.showNewAddress = true;
    //this.navCtrl.navigateForward(["/add-new-address"]);
  }

  async loadData() {
    let val = await this.storage.get("userID");
    this.userId = parseInt(val);
    // console.log("userId", this.userId);
    this.forUser = await this.databaseServiceService.getUrlParameter("customerContactID");
    if (!!this.forUser) {
      await this.fetchAddress(this.forUser);
      this.whoseAddress = "";
    } else {
      await this.fetchAddress(this.userId);
      this.whoseAddress = "My ";
    }

    this.configService.setTitle("My Addresses");
  }

  async ngOnInit() {
    this.loadData()
    this.configService.addressAddedEvent
      .subscribe((data: string) => {
        console.log('Event message from Component A: ' + data);
        this.loadData();
      });
  }

  async fetchAddress(userId) {
    await this.databaseServiceService.showSpinner();
    let res = await this.databaseServiceService.fetchAddress(userId);
    await this.databaseServiceService.hideSpinner();
    this.addresses = null;
    if (res) {
      this.addresses = [];
    }
    if (!!res.isSuccess) {
      this.addresses = res;
      // console.log("res", res);
    } else {
      // console.log(res.error);
      this.configService.presentToast(res.error, "error");
    }
  }

  editAddress(address, userName) {
    // console.log("address", address);
    this.configService.editAddressObj = address;
    this.configService.userNumber = userName;
    this.showNewAddress = true;
    //this.navCtrl.navigateForward(["/add-new-address"]);
  }
}
