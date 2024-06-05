import { Component, OnInit, Input } from '@angular/core';
import { Storage } from '@ionic/storage';
import { DatabaseServiceService } from '../../service/database-service.service';
import { ConfigServiceService } from '../../service/config-service.service';
import { HeaderFooterService } from '../../service/headerFooter/header-footer.service';
import { CompanyService } from '../../service/company/company.service';
import { NavController, Platform } from '@ionic/angular';
import {
  Validators,
  UntypedFormBuilder,
  UntypedFormGroup,
  UntypedFormControl,
} from '@angular/forms';
import { SelectedCountryService } from '../../service/observable/selected-country/selected-country.service';
import { ShowAddressService } from '../../service/observable/show-address/show-address.service';

@Component({
  selector: 'app-add-address',
  templateUrl: './add-address.component.html',
  styleUrls: ['./add-address.component.scss'],
})
export class AddAddressComponent implements OnInit {
  @Input() customerContactID: any;
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
  //public customerContactID: any;
  public onMobile: any;
  public disable = false;
  public selectedCountry: any;
  public email = '';
  public buttonDisabled = false;
  validations_formAddAdress: UntypedFormGroup;
  public companyTypes: any;
  public businessType = '';
  public forUser;

  constructor(
    public _companyService: CompanyService,
    public _headerFooterService: HeaderFooterService,
    public _selectedCountryService: SelectedCountryService,
    public _showAddressService: ShowAddressService,
    public formBuilder: UntypedFormBuilder,
    public platform: Platform,
    public storage: Storage,
    public databaseServiceService: DatabaseServiceService,
    public _configService: ConfigServiceService,
    public navCtrl: NavController
  ) {
    this.platform.ready().then(() => {
      // console.log("this.platform", this.platform);
      if (this.platform.is('desktop')) {
        this.onMobile = false;
      } else {
        this.onMobile = true;
      }
      // console.log("this.onMobile", this.onMobile);
    });
    this.storage.get('userID').then((val) => {
      this.userId = val;
      // console.log("userId", this.userId);
    });
    this.storage.get('loggedInUser').then((val) => {
      let code = val.substring(0, 2);
      if (code == 91) {
        this.selectedCountry = { name: 'India', dial_code: '+91', code: 'IN' };
        this.Country = 'India';
      } else {
        this.selectedCountry = '';
      }
      // console.log("loggedInUser ", val, code, this.Country);
    });
    // this.route.params.subscribe(params => (this.customerContactID = params['userIdFromMangeOrders']));
    // // console.log("customerContactID", this.customerContactID);
    this._selectedCountryService.observable().subscribe((data) => {
      this.selectedCountry = data;
      this.Country = data.name;
      // console.log("event", data, itemName);
    });

    this.validations_formAddAdress = this.formBuilder.group({
      name: new UntypedFormControl('', Validators.required),
      address: new UntypedFormControl('', Validators.required),
      // block: new FormControl(""),
      street: new UntypedFormControl('', Validators.required),
      city: new UntypedFormControl('', Validators.required),
      state: new UntypedFormControl('', Validators.required),
      zip: new UntypedFormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(4),
          Validators.pattern('^[0-9-.]+$'),
        ])
      ),
      country: new UntypedFormControl('', Validators.required),

      // email: new FormControl("", Validators.compose([Validators.required, Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$")])),

      phone: new UntypedFormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.maxLength(25),
          Validators.minLength(5),
          Validators.pattern('^[0-9-.]+$'),
        ])
      ),
    });
  }

  ionViewDidEnter() {
    this.ngOnInit();
  }

  async loadCompanyData() {
    if (this._companyService.companyObj && this._companyService.companyObj) {
      if (this._companyService.companyObj.config) {
        let companyJson = this._companyService.companyObj.config;
        if (!!companyJson) {
          if (!!companyJson.companyTypes) {
            this.companyTypes = companyJson.companyTypes;
          }
        }
      }
    }
  }

  async ngOnInit() {
    await this.loadCompanyData();
    this.myAddressObj = this._configService.editAddressObj;
    // console.log("myAddressObj", this.myAddressObj);
    this.userId = await this.storage.get('userID');

    this.forUser = await this.databaseServiceService.getUrlParameter(
      'customerContactID'
    );

    let userData: any;
    if (!!this.forUser) {
      this.customerContactID = this.forUser;
      userData = await this._headerFooterService.fetchUserProfileDetails(
        this.forUser
      );
    } else {
      userData = await this._headerFooterService.fetchUserProfileDetails(
        this.userId
      );
    }

    if (!!userData.data && userData.data != undefined) {
      userData = userData.data;
      if (!!userData.contactNo2) {
        this.validations_formAddAdress
          .get('phone')
          .setValue(userData.contactNo2);
      }

      // if (!!userData.email) {
      //   this.validations_formAddAdress.get("email").setValue(userData.email);
      // }
    }

    //  this.validations_formAddAdress.get('city').setValue(res.data[0].city);
    //         this.validations_formAddAdress.get('state').setValue(res.data[0].state);

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

      if (this.myAddressObj.businessType) {
        let businessType = this.myAddressObj.businessType;
        let bArray = businessType.split(',');
        let a = this.companyTypes
          .filter((a) => bArray.find((o2) => o2 == a.name))
          .map((obj) => (obj.selected = true));
      }

      this.validations_formAddAdress.setValue({
        name: this.myAddressObj.fullName,
        address: this.myAddressObj.area,
        // block: this.myAddressObj.block || "",
        street: this.myAddressObj.house,
        city: this.myAddressObj.city,
        state: this.myAddressObj.state,
        zip: this.myAddressObj.pinCode,
        country: this.myAddressObj.country,
        // email: this.myAddressObj.email,
        phone: this.myAddressObj.phoneNo,
      });
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
      //// console.log("else", this.Name);
      // let addressObj = {
      //   id: this.databaseServiceService.refCompanyId,
      //   fullName: this.Name,
      //   phoneNo: this.Mobile.toString().replace("+", ""),
      //   area: this.Area,
      //   city: this.City,
      //   country: this.Country,
      //   house: this.House,
      //   pinCode: parseInt(this.PinCode),
      //   state: this.State,
      //   defaultAddress: false,
      //   CCId: this.customerContactID ? parseInt(this.customerContactID) : parseInt(this.userId),
      //   email: this.email
      // };
      let pin = this.validations_formAddAdress.get('zip').value;
      let addressObj = {
        id: this.databaseServiceService.refCompanyId,
        fullName: this.validations_formAddAdress.get('name').value,
        phoneNo: this.validations_formAddAdress
          .get('phone')
          .value.toString()
          .replace('+', ''),
        area: this.validations_formAddAdress.get('street').value,
        city: this.validations_formAddAdress.get('city').value,
        country: this.validations_formAddAdress.get('country').value,
        house: this.validations_formAddAdress.get('address').value,
        block: '-',
        pinCode: parseInt(pin),
        state: this.validations_formAddAdress.get('state').value,
        defaultAddress: false,
        CCId: this.customerContactID
          ? parseInt(this.customerContactID)
          : parseInt(this.userId),
        email: '',
        businessType: this.businessType,
      };
      await this.databaseServiceService.showLoading();
      let res = await this.databaseServiceService.insertAddress(addressObj);
      await this.databaseServiceService.hideLoading();
      if (!!res.isSuccess) {
        this.buttonDisabled = false;
        this.databaseServiceService.checkUserKyc();
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

        if (this.customerContactID) {
          this.navCtrl.navigateForward(['/manage-orders']);
        }
        // else {
        //   this.navCtrl.navigateForward(["/my-addresses"]);
        // }
        if (!!res.isSuccess) {
          this.buttonDisabled = false;
          this.databaseServiceService.checkUserKyc();
          this._configService.presentToast(
            'Your Address have been updated.',
            'success'
          );
          this._showAddressService.observables.next();
          //this.navCtrl.navigateForward(["/my-addresses"]);
        } else {
          this.buttonDisabled = false;
          // console.log(res.error);
        }
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
      this.PinCode = this.validations_formAddAdress.get('zip').value;
      if (this.PinCode && this.PinCode != '') {
        let res = await this.databaseServiceService.getAreaByPinCode(
          this.PinCode.toString()
        );
        if (res.isSuccess) {
          // this.validations_formAddAdress.setValue({
          //   city: res.data[0].city,
          //   state: res.data[0].state,
          //   country: res.data[0].country
          // })
          this.validations_formAddAdress.get('city').setValue(res.data[0].city);
          this.validations_formAddAdress
            .get('state')
            .setValue(res.data[0].state);
          //this.validations_formAddAdress.get('country').setValue(res.data[0].country);
          // this.City = res.data[0].city;
          // this.State = res.data[0].state;
          // this.Country = "India";
          // this.disable = true;
        }
        // else {
        //   this.disable = false;
        //   // this.City = "";
        //   // this.State = "";
        //   // this.Country = "";
        //   this.validations_formAddAdress.get('city').setValue("");
        //   this.validations_formAddAdress.get('state').setValue("");
        //   this._configService.presentToast("Please enter valid zipcode", "error");
        // }
      }
      // else {
      //   this.disable = false;
      //   this.validations_formAddAdress.get('city').setValue("");
      //   this.validations_formAddAdress.get('state').setValue("");
      //   this._configService.presentToast("Please enter valid zipcode", "error");
      // }
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
      // let addressObj = {
      //   fullName: this.Name,
      //   phoneNo: this.Mobile.toString().replace("+", ""),
      //   area: this.Area,
      //   city: this.City,
      //   country: this.Country,
      //   house: this.House,
      //   pinCode: parseInt(this.PinCode),
      //   state: this.State,
      //   defaultAddress: false,
      //   CCId: parseInt(this.userId),
      //   CaID: parseFloat(this.myAddressObj.id),
      //   email: this.email
      // };
      let pin = this.validations_formAddAdress.get('zip').value;
      let addressObj = {
        fullName: this.validations_formAddAdress.get('name').value,
        phoneNo: this.validations_formAddAdress
          .get('phone')
          .value.toString()
          .replace('+', ''),
        area: this.validations_formAddAdress.get('street').value,
        city: this.validations_formAddAdress.get('city').value,
        country: this.validations_formAddAdress.get('country').value,
        house: this.validations_formAddAdress.get('address').value,
        block: '-',
        pinCode: parseInt(pin),
        state: this.validations_formAddAdress.get('state').value,
        defaultAddress: false,
        CaID: parseFloat(this.myAddressObj.id),
        CCId: this.customerContactID
          ? parseInt(this.customerContactID)
          : parseInt(this.userId),
        email: '',
        businessType: this.businessType,
      };
      let res = await this.databaseServiceService.updateAddress(addressObj);
      if (!!res.isSuccess) {
        this.buttonDisabled = false;
        this.databaseServiceService.checkUserKyc();
        this._configService.presentToast(
          'Your Address have been updated.',
          'successs'
        );
        this._showAddressService.observables.next();

        //this.navCtrl.navigateForward(["/my-addresses"]);
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

  validation_messages = {
    name: [{ type: 'required', message: 'First Name is required.' }],
    address: [{ type: 'required', message: 'Address is required.' }],
    // block: [{ type: "required", message: "Block is required." }],
    street: [{ type: 'required', message: 'Street is required.' }],
    city: [{ type: 'required', message: 'City is required.' }],
    state: [{ type: 'required', message: 'State is required.' }],
    zip: [
      { type: 'required', message: 'Zip Code is required.' },
      { type: 'minlength', message: 'Zip Code be at least 4 digits long.' },
      { type: 'pattern', message: 'Zip Code must contain only numbers.' },
    ],
    country: [{ type: 'required', message: 'Country is required.' }],

    // email: [{ type: "required", message: "Email is required." }, { type: "pattern", message: "Please enter a valid email." }],
    phone: [
      { type: 'required', message: 'Phone is required.' },
      { type: 'minlength', message: 'Phone must be at least 5 digits long.' },
      {
        type: 'maxlength',
        message: 'Phone cannot be more than 25 digits long.',
      },
      { type: 'pattern', message: 'Phone username must contain only numbers.' },
    ],
  };

  onSubmit(values) {
    // console.log(values);
    if (!this.showEditButton) {
      this.save();
    } else {
      this.Update();
    }

    //this.router.navigate(["/user"]);

    // const formData: FormData = new FormData();
    // formData.append("file", this.selectedFile);
    // // console.log("form data", formData);
  }

  changeListener(event): void {
    let selectedFile = <File>event.target.files[0];
    // console.log("file ", selectedFile);
    //let extension = "";
    // if (!!selectedFile) {
    // extension = this.selectedFile.name.split(".")[this.selectedFile.name.split(".").length - 1];
    // // console.log("extension ", extension, this.selectedFile.name.split("."));
    // if (!!extension && extension != "xlsx" && extension != "xls") {
    // this._configService.presentToast("Please select excel file.", "error");
    // this.selectedFile = null;
    // }
    // }
  }
  async toggleSelection(para, val) {
    // console.log(para);
    // console.log(val);
    this.companyTypes.filter((a) => a.name == val)[0].selected =
      !this.companyTypes.filter((a) => a.name == val)[0].selected;
    this.businessType = this.companyTypes
      .filter((a) => a.selected == true)
      .map((b) => b.name)
      .join(',');
  }
}
