import { Component, OnInit } from '@angular/core';
import {
  Validators,
  UntypedFormBuilder,
  UntypedFormGroup,
  UntypedFormControl,
} from '@angular/forms';
import { ModalController, NavParams, ToastController } from '@ionic/angular';
import { DatabaseServiceService } from '../../service/database-service.service';
import { HeaderFooterService } from '../../service/headerFooter/header-footer.service';
import { ConfigServiceService } from '../../service/config-service.service';
import { Storage } from '@ionic/storage';
import { CompanyService } from '../../service/company/company.service';

@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.page.html',
  styleUrls: ['./add-customer.page.scss'],
})
export class AddCustomerPage implements OnInit {
  validations_form: UntypedFormGroup;
  public addressId: any;
  public Name: any;
  public Area: any = '';
  public Mobile: any;
  public House: any;
  public City: any = '';
  public State: any = '';
  public Country: any = '';
  public userId: any;
  public allowAppAccess = false;
  public customerId: any;
  public childCustomerId: any;
  public designations: any;
  public designationId = -1;
  public lastAddedId = -1;
  public customerData;
  public buttonDisabled = false;

  constructor(
    public _companyService: CompanyService,
    public _headerFooterService: HeaderFooterService,
    public databaseServiceService: DatabaseServiceService,
    public configService: ConfigServiceService,
    public storage: Storage,
    private toastCtrl: ToastController,
    public formBuilder: UntypedFormBuilder, //  private router: Router
    public viewCtrl: ModalController,
    private navParams: NavParams
  ) {
    this.validations_form = this.formBuilder.group({
      compName: new UntypedFormControl('', Validators.required),
      contactName: new UntypedFormControl('', Validators.required),
      phone: new UntypedFormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.maxLength(25),
          Validators.minLength(5),
          Validators.pattern('^[0-9-.]+$'),
        ])
      ),
      email: new UntypedFormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
        ])
      ),
      address: new UntypedFormControl('', Validators.required),
      block: new UntypedFormControl(''),
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
    });
    //this.ngOnInit();
  }

  async ngOnInit() {
    this.customerData = await this.navParams.get('customerData');
    // console.log(this.customerData)
    if (!!this.customerData) {
      //to update
      this.validations_form.controls['compName'].setValue(
        this.customerData.companyName
      );
      this.validations_form.controls['contactName'].setValue(
        this.customerData.name
      );
      this.validations_form.controls['email'].setValue(this.customerData.email);
      //not to update
      this.validations_form.controls['phone'].setValue(
        this.customerData.username
      );
      this.validations_form.controls['address'].setValue(
        this.customerData.address
      );
      this.validations_form.controls['block'].setValue(this.customerData.city);
      this.validations_form.controls['street'].setValue(this.customerData.city);
      this.validations_form.controls['city'].setValue(this.customerData.city);
      this.validations_form.controls['state'].setValue(this.customerData.state);
      this.validations_form.controls['zip'].setValue(this.customerData.zipCode);
      this.validations_form.controls['country'].setValue('India');
    }
    this.userId = await this.storage.get('userID');
    let userData = await this._headerFooterService.fetchUserProfileDetails(
      this.userId
    );
    this.customerId = userData.data.refCustomerId;

    let res: any;
    res = await this.databaseServiceService.getAllDesignation(
      this.databaseServiceService.refCompanyId
    );
    if (res.status == 0) {
      // console.log("error");
    } else {
      this.designations = res.data;
      if (this.designations) {
        this.designationId = this.designations.filter(
          (data) => data.name == 'Customer Contact'
        )[0].id;
      }
    }
  }

  async loadCompanyData() {
    if (this._companyService.companyObj && this._companyService.companyObj) {
      if (this._companyService.companyObj.config) {
        let companyJson = this._companyService.companyObj.config;
        if (!!companyJson) {
          if (!!companyJson.allowAppAccess) {
            this.allowAppAccess = companyJson.allowAppAccess;
          }
        }
      }
    }
  }

  validation_messages = {
    compName: [{ type: 'required', message: 'Company Name is required.' }],
    contactName: [{ type: 'required', message: 'Contact name is required.' }],
    phone: [
      { type: 'required', message: 'Phone is required.' },
      { type: 'minlength', message: 'Phone must be at least 5 digits long.' },
      {
        type: 'maxlength',
        message: 'Phone cannot be more than 25 digits long.',
      },
      { type: 'pattern', message: 'Phone username must contain only numbers.' },
    ],
    email: [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Please enter a valid email.' },
    ],
    address: [{ type: 'required', message: 'Address is required.' }],
    block: [{ type: 'required', message: 'Block is required.' }],
    street: [{ type: 'required', message: 'Street is required.' }],
    city: [{ type: 'required', message: 'City is required.' }],
    state: [{ type: 'required', message: 'State is required.' }],
    zip: [
      { type: 'required', message: 'Zip Code is required.' },
      { type: 'minlength', message: 'Zip Code be at least 4 digits long.' },
      { type: 'pattern', message: 'Zip Code must contain only numbers.' },
    ],
    country: [{ type: 'required', message: 'Country is required.' }],
  };

  async onSubmit(values) {
    this.buttonDisabled = true;
    // console.log(values);

    if (!!this.customerData) {
      //update case
      let jsonObj: any = {
        id: this.databaseServiceService.refCompanyId,
        companyName: values.compName,
        customerId: this.customerData.id,
      };
      let res: any = await this.databaseServiceService.updateCustomer(jsonObj);
      if (res) {
        let data = res;
        // console.log(data);
        let contactObj: any = {
          id: this.databaseServiceService.refCompanyId,
          customerId: this.customerData.id,
          CcID: this.customerData.userid,
          name: values.contactName,
          email: values.email,
          contactNo: this.customerData.username,
        };
        let resContact: any =
          await this.databaseServiceService.updateCustomerContact(contactObj);
        if (resContact) {
          let data1 = resContact;
          // console.log(data1);
          let toast = await this.toastCtrl.create({
            message: 'Customer updated successfully',
            duration: 3000,
            position: 'top',
            color: 'success',
          });
          await toast.present();
          this.buttonDisabled = false;
          this.closeModal();
        }
      }
    } else {
      //add case
      let jsonObj: any = {
        id: this.databaseServiceService.refCompanyId,
        companyName: values.compName,
        code: values.compName,
        city: values.city,
        state: values.state,
        address: values.address,
        zipCode: values.zip,
        lang: '',
        lat: '',
        gstNo: '',
        category: '',
        segment: '',
      };
      // console.log(jsonObj);
      let res: any = await this.databaseServiceService.checkUserExistByPhoneNo(
        values.phone.toString()
      );
      if (res.isSuccess) {
        //if Customer
        if (res.data.userType == 'Customer') {
          let userData =
            await this._headerFooterService.fetchUserProfileDetails(
              res.data.id
            );
          if (userData.data.refCustomerId) {
            let refCustomerId = userData.data.refCustomerId;
            //add this in shop_parentcustomer mapping
            let pRes = await this.AddParentCustomer(refCustomerId);
            if (pRes) {
              let cRes = await this.createCustomerAddress(
                refCustomerId,
                values
              );
              if (cRes.error) {
                let toast = await this.toastCtrl.create({
                  message: cRes.error,
                  duration: 3000,
                  position: 'top',
                  color: 'danger',
                });
                toast.present();
                this.buttonDisabled = false;
              } else {
                let toast = await this.toastCtrl.create({
                  message: 'Customer Added successfully.',
                  duration: 3000,
                  position: 'top',
                  color: 'success',
                });
                await toast.present();
                this.buttonDisabled = false;
                this.closeModal();
              }
            } else {
              this.buttonDisabled = false;
            }
          } else {
            // console.log('--->>>> user not found')
          }
        } else {
          let toast = await this.toastCtrl.create({
            message: 'User with this number already exists.',
            duration: 3000,
            position: 'top',
            color: 'danger',
          });
          toast.present();
        }
      } else {
        //create customer
        let res = await this.databaseServiceService.createCustomer(jsonObj);
        if (res) {
          let data = res;
          // console.log(data.data);
          this.childCustomerId = data.data.body.refTableId;
          if (data.error) {
            let toast = await this.toastCtrl.create({
              message: data.error,
              duration: 3000,
              position: 'top',
              color: 'danger',
            });
            await toast.present();
          } else {
            //add creted customerid in shop_parentcustomer mapping
            let pRes = await this.AddParentCustomer(data.data.body.refTableId);
            //this.createContactForCustomer(values)
            if (pRes) {
              this.createContactForCustomer(values);
            } else {
              this.buttonDisabled = false;
            }
          }
        }
      }
    }
  }

  async createContactForCustomer(values) {
    let response = await this.createContact(values);
    // console.log(response);
    this.lastAddedId = response.data.id;
    let cRes = await this.createCustomerAddress(
      response.data.refUserId,
      values
    );
    if (cRes.error) {
      let toast = await this.toastCtrl.create({
        message: cRes.error,
        duration: 3000,
        position: 'top',
        color: 'danger',
      });
      toast.present();
      this.buttonDisabled = false;
    } else {
      let toast = await this.toastCtrl.create({
        message: 'Customer Added successfully.',
        duration: 3000,
        position: 'top',
        color: 'success',
      });
      await toast.present();
      this.buttonDisabled = false;
      this.closeModal();
    }
  }

  async AddParentCustomer(refTableId) {
    let updateRes = await this.databaseServiceService.setParentCustomer(
      this.databaseServiceService.refCompanyId,
      refTableId,
      parseInt(this.customerId)
    );
    if (updateRes) {
      let resp = updateRes;
      if (resp.error) {
        let toast = await this.toastCtrl.create({
          message: resp.error,
          duration: 3000,
          position: 'top',
          color: 'danger',
        });
        toast.present();
        return false;
      } else {
        return true;
      }
    } else {
      return false; // Added return statement for this code path
    }
  }

  async createContact(data) {
    let contactJsonObj = {
      id: this.databaseServiceService.refCompanyId,
      customerId: this.childCustomerId,
      name: data.contactName,
      designationId: this.designationId.toString(),
      contactNo: data.phone,
      contactNo2: data.phone,
      email: data.email,
      allowAppAccess: this.allowAppAccess,
    };
    // console.log(contactJsonObj);
    let res = await this.databaseServiceService.createCustomerContact(
      contactJsonObj
    );
    let resdata = res;
    // console.log(resdata.data);
    return resdata;
  }

  async createCustomerAddress(refUserId, data) {
    let jsonObj = {
      id: this.databaseServiceService.refCompanyId,
      CCId: refUserId, //parseInt(this.userId),
      house: data.block,
      area: data.street,
      pinCode: parseInt(data.zip),
      city: data.city,
      state: data.state,
      country: data.country,
      fullName: data.contactName,
      phoneNo: data.phone,
      email: data.email,
      defaultAddress: false,
    };
    // console.log(jsonObj);
    let addressRes = await this.databaseServiceService.insertAddress(jsonObj);
    if (!!addressRes.isSuccess) {
      return addressRes;
    } else {
      // console.log(addressRes.error);
    }
  }

  async getAreaByZipCode() {
    let PinCode = this.validations_form.get('zip').value;
    if (PinCode && PinCode != '') {
      let res = await this.databaseServiceService.getAreaByPinCode(
        PinCode.toString()
      );
      if (res.isSuccess) {
        this.validations_form.get('city').setValue(res.data[0].city);
        this.validations_form.get('state').setValue(res.data[0].state);
      }
    }
  }

  closeModal() {
    // console.log("closeModal ");
    this.viewCtrl.dismiss(this.lastAddedId);
  }
}
