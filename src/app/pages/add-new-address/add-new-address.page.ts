import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { DatabaseServiceService } from '../../service/database-service.service';
import { ConfigServiceService } from '../../service/config-service.service';
import { NavController, Platform } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-add-new-address',
  templateUrl: './add-new-address.page.html',
  styleUrls: ['./add-new-address.page.scss'],
})
export class AddNewAddressPage implements OnInit {
  public addressFormBuilder: any;
  public addressId: any;
  public Name: any;
  public Area: any = '';
  public Mobile: any;
  public PinCode: any;
  public House: any;
  public City: any = '';
  public State: any = '';
  public Country: any = '';
  public userId: any;
  public myAddressObj: any;
  public showEditButton = false;
  public customerContactID: any;
  public onMobile: any;
  public disable = false;
  public selectedCountry: any;
  public email = '';
  public buttonDisabled = false;

  constructor(
    public platform: Platform,
    private route: ActivatedRoute,
    public storage: Storage,
    public databaseServiceService: DatabaseServiceService,
    public _configService: ConfigServiceService,
    public navCtrl: NavController
  ) {
    this.route.params.subscribe(
      (params) => (this.customerContactID = params['userIdFromMangeOrders'])
    );
    // console.log("customerContactID", this.customerContactID);
  }

  ionViewDidEnter() {
    // this.ngOnInit();
  }

  ngOnInit() {
    this.myAddressObj = this._configService.editAddressObj;
    // console.log("myAddressObj", this.myAddressObj);
    if (
      this.myAddressObj &&
      this.myAddressObj != undefined &&
      this.myAddressObj != null &&
      Object.keys(this.myAddressObj).length != 0
    ) {
      // console.log("if");
      this.showEditButton = true;
      this.PinCode = this.myAddressObj.pinCode;
      this.House = this.myAddressObj.house;
      this.Area = this.myAddressObj.area;
      this.City = this.myAddressObj.city;
      this.State = this.myAddressObj.state;
      this.Country = this.myAddressObj.country;
      this.Mobile = this.myAddressObj.phoneNo;
      if (!!this.Mobile) {
        this.Mobile = '+' + this.Mobile;
      }
      this.Name = this.myAddressObj.fullName;
      this.email = this.myAddressObj.email;
      if (!this.email) {
        this.email = '';
      }
    } else {
      // console.log("else");
      this.showEditButton = false;
    }
    if (this.addressId) {
      //this is edit address mode, bind address here, get from database
    }
  }

  async save() {
    this.buttonDisabled = true;
    if (
      !this.Name &&
      !this.City &&
      !this.Country &&
      !this.House &&
      !this.PinCode &&
      !this.State &&
      !this.userId &&
      !this.Mobile
    ) {
      // console.log("if");
      this._configService.presentToast('please select all fields', 'error');
    } else {
      // console.log("else", this.Name);
      let addressObj = {
        id: this.databaseServiceService.refCompanyId,
        fullName: this.Name,
        phoneNo: this.Mobile.toString().replace('+', ''),
        area: this.Area,
        city: this.City,
        country: this.Country,
        house: this.House,
        pinCode: parseInt(this.PinCode),
        state: this.State,
        defaultAddress: false,
        CCId: this.customerContactID
          ? parseInt(this.customerContactID)
          : parseInt(this.userId),
        email: this.email,
      };
      await this.databaseServiceService.showLoading();
      let res = await this.databaseServiceService.insertAddress(addressObj);
      await this.databaseServiceService.hideLoading();
      if (!!res.isSuccess) {
        this.buttonDisabled = false;
        this._configService.presentToast(
          'Your Address have been saved.',
          'success'
        );
        this.Name = '';
        this.Mobile = '';
        this.PinCode = '';
        this.House = '';
        this.Area = '';
        this.City = '';
        this.State = '';
        this.Country = '';
        this.email = '';
        this.navCtrl.pop();

        // if (this.customerContactID) {
        //   this.navCtrl.navigateForward(["/manage-orders"]);

        // }
        // else {
        //   this.navCtrl.navigateForward(["/my-addresses"]);
        // }
      } else {
        this.buttonDisabled = false;
        // console.log(res.error);
        try {
          if (res.error.message) {
            this._configService.presentToast(res.error.message, 'error');
          }
        } catch (e) {
          if (res.error) {
            this._configService.presentToast(res.error, 'error');
          }
        }
      }
      // .then(res => {
      // this._configService.presentToast('Your Address have been saved.');
      // this.navCtrl.navigateForward(["/my-addresses"]);
      // })
    }
  }

  // (ionInput) = "runTimeChange($event)"

  async getAreaByZipCode() {
    if (this.Country == 'India') {
      if (this.PinCode && this.PinCode != '') {
        let res = await this.databaseServiceService.getAreaByPinCode(
          this.PinCode.toString()
        );
        if (res.isSuccess) {
          this.City = res.data[0].city;
          this.State = res.data[0].state;
          this.Country = 'India';
          this.disable = true;
        } else {
          this.disable = false;
          this.City = '';
          this.State = '';
          this.Country = '';
          this._configService.presentToast(
            'Please enter valid zipcode',
            'error'
          );
        }
      } else {
        this.disable = false;
        this.City = '';
        this.State = '';
        this.Country = '';
        this._configService.presentToast('Please enter valid zipcode', 'error');
      }
    }
  }

  async Update() {
    this.buttonDisabled = true;
    if (
      !this.Name &&
      !this.City &&
      !this.Country &&
      !this.House &&
      !this.PinCode &&
      !this.State &&
      !this.userId
    ) {
      this._configService.presentToast('please select all fields', 'error');
    } else {
      let addressObj = {
        fullName: this.Name,
        phoneNo: this.Mobile.toString().replace('+', ''),
        area: this.Area,
        city: this.City,
        country: this.Country,
        house: this.House,
        pinCode: parseInt(this.PinCode),
        state: this.State,
        defaultAddress: false,
        CCId: parseInt(this.userId),
        CaID: parseFloat(this.myAddressObj.id),
        email: this.email,
      };
      let res = await this.databaseServiceService.updateAddress(addressObj);
      if (!!res.isSuccess) {
        this.buttonDisabled = false;
        this._configService.presentToast(
          'Your Address have been updated.',
          'successs'
        );
        this.navCtrl.navigateForward(['/my-addresses']);
      } else {
        this.buttonDisabled = false;
        // console.log(res.error);
      }
      // .then(
      //   res => {
      // this._configService.presentToast('Your Address have been updated.');
      // this.navCtrl.navigateForward(["/my-addresses"]);
      //   }
      // );
    }
  }
}
