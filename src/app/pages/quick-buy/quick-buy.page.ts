import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import {
  Validators,
  FormBuilder,
  FormGroup,
  FormControl,
  UntypedFormGroup,
  UntypedFormBuilder,
  UntypedFormControl,
} from '@angular/forms';
import { Storage } from '@ionic/storage';
import { Router, ActivatedRoute } from '@angular/router';
import { DatabaseServiceService } from '../../service/database-service.service';
import { ConfigServiceService } from '../../service/config-service.service';
import { ActionsService } from '../../service/cart/actions/actions.service';
import { Platform, ModalController } from '@ionic/angular';
import { LoginFormComponent } from '../../components/login-form/login-form.component';
import { HeaderFooterService } from '../../service/headerFooter/header-footer.service';
import { CompanyService } from '../../service/company/company.service';
import { AmountService } from '../../service/user/amount.service';
import { RazorkeyService } from '../../service/payment/razorkey.service';
import { LOGGEDINService } from '../../service/observable/user/loggedin.service';
import { CartService } from '../../service/observable/cart/cart.service';
import { CartChangedService } from '../../service/observable/cart-changed/cart-changed.service';
import { ShowIdService } from '../../service/observable/show-id/show-id.service';
import { LOGGEDOUTService } from '../../service/observable/user/loggedout.service';

declare var RazorpayCheckout: any;
declare var Razorpay: any;

@Component({
  selector: 'app-quick-buy',
  templateUrl: './quick-buy.page.html',
  styleUrls: ['./quick-buy.page.scss'],
})
export class QuickBuyPage implements OnInit {
  public defaultpageName = 'QuickBuyPage';
  public phone: any;
  public validations_form: UntypedFormGroup;
  public buttonDisabled = false;
  public selectedAddressType: any = 'Delivery';
  public paymentModeList: any = this._companyService.allPaymentDetails;
  public paymentMode: any = this.paymentModeList[0];
  public shipmentMode: any;
  public shippingMethods: any;
  public pinCode: any;
  public country: any = 'India';
  public city: any = '';
  public state: any = '';
  public allViewActions: any = this._companyService.allActions;
  public sessionID: any;
  public userId: any;
  public userData: any;
  public businessType = '';
  public name: any;
  public addressId: any;
  public skip = 0;
  public showSkeleton = true;
  public orderNo = 0;
  public cartData: any;
  public limit = 10;
  public collectiveValue: any = 0;
  public loggedInUser: any;
  public onMobile: any;
  public orderResponse: any;
  public paymentResponse: any;
  public orderBook = '';
  public orderInRazorPay: any;
  public totalWithShipCost: any;
  public total: any;
  public shippingCost: any = 0;
  public password: any;
  public screenWidth: any;
  public Math = Math;
  public totalQty: any;

  constructor(
    public _razorkeyService: RazorkeyService,
    public _amountService: AmountService,
    public _headerFooterService: HeaderFooterService,
    public _companyService: CompanyService,
    public _actionsService: ActionsService,
    public _LOGGEDINService: LOGGEDINService,
    public _cartService: CartService,
    public _cartChangedService: CartChangedService,
    public _showIdService: ShowIdService,
    public storage: Storage,
    private router: Router,
    public _databaseService: DatabaseServiceService,
    public _configService: ConfigServiceService,
    public formBuilder: UntypedFormBuilder,
    public platform: Platform,
    public changeRef: ChangeDetectorRef,
    public modalController: ModalController,
    private route: ActivatedRoute,
    public _LOGGEDOUTService: LOGGEDOUTService
  ) {
    this.platform.ready().then(() => {
      // console.log("this.platform", this.platform);
      if (this.platform.is('desktop') || this.platform.is('mobileweb')) {
        this.onMobile = false;
      } else {
        this.onMobile = true;
      }
      this.screenWidth = this.platform.width();
      // console.log("this.onMobile", this.onMobile);
    });
    this.validations_form = this.formBuilder.group({
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
          Validators.maxLength(10),
          Validators.minLength(10),
          Validators.pattern('^[6-9][0-9]{9}$'),
        ])
      ),
      shipMode: new UntypedFormControl(''),
      payMode: new UntypedFormControl('', Validators.required),
    });
    this._cartChangedService
      .observable(this.defaultpageName)
      .subscribe(data => {
        this.getCartDetails();
      });
    this._cartChangedService
      .observable(this.defaultpageName)
      .subscribe(data => {
        this.getCartDetails();
      });
    this._companyService.currentPage = this.defaultpageName;
  }

  async ngOnInit() {
    await this._configService.setTitle('Quick Buy');
    await this.loadCompanyData();
    await this.getCartDetails();
    await this.getAllShippingMethod();
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
      { type: 'minlength', message: 'Phone must be 10 digits long.' },
      {
        type: 'maxlength',
        message: 'Phone cannot be more than 10 digits long.',
      },
      { type: 'pattern', message: 'Phone must start with 6,7,8 or 9.' },
    ],
    shipMode: [{ type: 'required', message: 'Please select shipment mode.' }],
    payMode: [{ type: 'required', message: 'Please select payment mode.' }],
  };

  async loadCompanyData() {}

  async onSubmit(values) {
    // console.log("on submit ", values,  this.userId, this.addressId);
    this.buttonDisabled = true;
    await this.insertPlaceOrderClickedView();
    if (!this.userId) {
      await this.createUser();
    } else {
      await this.userVerified();
    }
    this.buttonDisabled = false;
  }

  async userVerified() {
    // console.log("userVerified ", this.userId, this.addressId);
    if (!!this.userId && !!this.addressId) {
      await this.placeOrder();
    } else {
      if (!this.userId || this.userId == null || this.userId == undefined) {
        let res2 = await this._databaseService.checkUserExistByPhoneNo(
          '91' + this.phone.toString()
        );

        if (res2.isSuccess) {
          await this.login(res2);
        }
      }
      if (
        !this.addressId ||
        this.addressId == null ||
        this.addressId == undefined
      ) {
        await this.saveAddress();
      }
      await this.placeOrder();
    }
  }

  async getAllShippingMethod() {
    let res: any;

    res = await this._databaseService.getAllShippingMethod(
      this.selectedAddressType
    );
    if (res.status == 0) {
      // console.log("error");
    } else {
      this.shippingMethods = res.data;
      this.shipmentMode = this.shippingMethods[0].id;
      // await this.shipModeSelected();
      // console.log("getAllShippingMethod res", res, this.shippingMethods);
    }
  }

  async getAreaByZipCode() {
    if (this.country == 'India') {
      this.pinCode = this.validations_form.get('zip').value;
      if (this.pinCode && this.pinCode != '') {
        let res = await this._databaseService.getAreaByPinCode(
          this.pinCode.toString()
        );
        if (res.isSuccess) {
          this.validations_form.get('city').setValue(res.data[0].city);
          this.validations_form.get('state').setValue(res.data[0].state);
        }
      }
    }
  }

  async createUser() {
    let res1: any = await this._databaseService.checkUserExistByPhoneNo(
      '91' + this.phone.toString()
    );
    if (res1.isSuccess) {
      if (
        res1.error ==
        'Your account is deactivated. Kindly contact the administrator.'
      ) {
        this._configService.presentToast(res1.error, 'error');
      } else {
        // console.log("createUser res1 ",res1);
        // await this.login(res1);
        /*let loginWithApp = await this._databaseService.LoginWithApp({
          mobNumbers: "91" + this.phone.toString(),
          email: "",
          password: this.password,
          name: this.name
        });
        if (loginWithApp == true) {
          await this.verifyUser();
        }*/
        if (!!res1.data) {
          res1.data.isGuest = 1;
        }
        await this.login(res1);
        await this.userVerified();
      }
    } else if (
      !res1.isSuccess &&
      res1.error ==
        'Your account is deactivated. Kindly contact the administrator.'
    ) {
      this._configService.presentToast(
        'Your account is deactivated. Kindly contact the administrator.',
        'error'
      );
    } else {
      //create user with mobile number
      this.password =
        Math.random().toString(36).slice(2) +
        Math.random().toString(36).toUpperCase().slice(2);
      // let res = await this._databaseService.createUser(parseInt(this.phone.toString()), randomPwd, true);
      // let res2 = await this._databaseService.checkUserExistByPhoneNo(this.phone.toString());
      // if (res2.isSuccess) {
      //   await this.login(res2);
      // }
      /*let loginWithApp = await this._databaseService.LoginWithApp({
        mobNumbers: "91" + this.phone.toString(),
        email: "",
        password: this.password,
        name: this.name
      });
      if (loginWithApp == true) {
        await this.verifyUser();
      }*/
      let res = await this._databaseService.createUser(
        parseInt('91' + this.phone.toString()),
        this.password,
        true
      );
      let res2 = await this._databaseService.checkUserExistByPhoneNo(
        '91' + this.phone.toString()
      );
      if (res2.isSuccess) {
        if (!!res2.data) {
          res2.data.isGuest = 1;
        }
        await this.login(res2);
        await this.userVerified();
      }
    }
  }

  async login(response) {
    this.sessionID = await this.storage.get('sessionID');
    this.userId = response.data.id;
    this._configService.userNumber = '' + '91' + this.phone.toString();
    this.userData = response.data;
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
      response.data.accessToken
    );
    // console.log("sessionID", this.sessionID);
    let cartRes = await this._databaseService.setCartForCustomer(
      response.data.id,
      this.sessionID
    );
    // console.log("user is", this._configService.userNumber);
    await this.getCartDetails();

    // window["heap"].identify(this._configService.userNumber);
    // window["heap"].addUserProperties({ appName: this._configService.appName });
    this._LOGGEDINService.observables.next('loggedIn');
    await this.insertLoginView();
  }

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

  async saveAddress() {
    // console.log("saveAddress ", this.name, this.country, this.pinCode, this.state, this.userId, this.phone);
    this.buttonDisabled = true;
    if (
      !this.name &&
      !this.city &&
      !this.country &&
      !this.pinCode &&
      !this.state &&
      !this.userId &&
      !this.phone
    ) {
      this._configService.presentToast('please select all fields', 'error');
      await this.insertQuickBuyFormErrorView();
    } else {
      //// console.log("else", this.Name);
      // let addressObj = {
      //   id: this.databaseServiceService.refCompanyId,
      //   fullName: this.Name,
      //   phoneNo: this.Mobile.toString(),
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
      let pin = this.validations_form.get('zip').value;
      let addressObj = {
        id: this._databaseService.refCompanyId,
        fullName: this.validations_form.get('name').value,
        phoneNo: this.validations_form.get('phone').value.toString(),
        area: this.validations_form.get('street').value,
        city: this.validations_form.get('city').value,
        country: this.validations_form.get('country').value,
        house: this.validations_form.get('address').value,
        block: '-',
        pinCode: parseInt(pin),
        state: this.validations_form.get('state').value,
        defaultAddress: true,
        CCId: parseInt(this.userId),
        email: '',
        businessType: this.businessType,
      };
      let existObj = {
        id: this._databaseService.refCompanyId,
        CCId: parseInt(this.userId),
        house: this.validations_form.get('address').value,
        area: this.validations_form.get('street').value,
      };
      await this._databaseService.showLoading();
      let existRes = await this._databaseService.getAddress(existObj);
      if (existRes.isSuccess && existRes.data) {
        this.addressId = existRes.data.id;
      } else {
        let res = await this._databaseService.insertAddress(addressObj);
        await this._databaseService.hideLoading();
        if (!!res.isSuccess) {
          this.buttonDisabled = false;
          this._configService.presentToast(
            'Your Address have been saved.',
            'success'
          );
          this.addressId = res.data.id;
          // this.name = "";
          // this.phone = "";
          // this.pinCode = "";
          // this.house = "";
          // this.city = "";
          // this.state = "";
          // this.country = "";
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
      }
      // .then(res => {
      // this._configService.presentToast('Your Address have been saved.');
      // this.navCtrl.navigateForward(["/my-addresses"]);
      // })
    }
  }

  async getCartDetails() {
    this.userId = await this.storage.get('userID');
    this.sessionID = await this.storage.get('sessionID');
    // console.log(this.userId, this.sessionID);
    let orderBook = '';
    if (this.orderNo) {
      orderBook = 'Temp';
    }
    this._headerFooterService
      .getCartDetailsV1(
        this.userId,
        this.sessionID,
        this.skip * this.limit,
        this.limit,
        '',
        orderBook,
        true,
        this.orderNo
      )
      .then(response => {
        if (response) {
          this.showSkeleton = false;
        }
        if (!!response && !!response) {
          this.cartData = response;
          if (
            !!this.cartData &&
            !!this.cartData.data.products &&
            this.cartData.data.products.length > 0
          ) {
            this.totalWithShipCost =
              parseFloat(this.cartData.data.count.FinalPrice) +
              this.shippingCost;
          }
          if (
            !!this.cartData &&
            !!this.cartData.data.totalProduct &&
            !!this.cartData.data.totalProduct.TotalProduct
          ) {
            this.totalQty = this.cartData.data.totalProduct.TotalProduct;
          }
        } else {
          // console.log("error", response.error);
        }
      });
  }

  async checkCollectiveAmount() {
    if (this.collectiveValue != 0) {
      if (
        isNaN(this.collectiveValue) ||
        this.collectiveValue < this.cartData.data.count.FinalPrice
      ) {
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  }

  async placeOrder() {
    this.buttonDisabled = true;
    await this._databaseService.showLoading();
    this.userId = await this.storage.get('userID');
    this.loggedInUser = await this.storage.get('loggedInUser');
    this.userData = await this.storage.get('userData');
    let res = await this._databaseService.checkQuantityValidation(this.userId);
    // console.log("place order ", res, this.paymentMode.isOnline);
    let checkValidation: boolean = await this.checkCollectiveAmount();
    if (checkValidation) {
      if (!!res.isSuccess) {
        if (this.onMobile) {
          if (!this.paymentMode.isOnline || this.paymentMode.isOnline == 0) {
            await this.confirmOrder();
            await this._databaseService.hideLoading();
          } else {
            await this.payWithRazorForMobile();
            await this._databaseService.hideLoading();
          }
        } else {
          if (!this.paymentMode.isOnline || this.paymentMode.isOnline == 0) {
            await this.confirmOrder();
            await this._databaseService.hideLoading();
          } else {
            await this.payWithRazor();
            await this._databaseService.hideLoading();
          }
        }
      } else {
        this.buttonDisabled = false;
        this._configService.presentToast(res.error, 'error');
      }
    } else {
      this.buttonDisabled = false;
      this._configService.presentToast(
        'Please enter valid collectible amount',
        'error'
      );
    }
  }

  async confirmOrder() {
    let sessionId = await this.storage.get('sessionID');
    this.userId = await this.storage.get('userID');
    // console.log("confirmOrder ", this.userId, this.addressId);

    if (!!this.userId && !!this.addressId) {
      let res = await this._actionsService.orderCart(
        parseInt(this.userId),
        this.addressId,
        this.paymentMode.id,
        this.shipmentMode,
        sessionId,
        '',
        null,
        this.orderBook,
        this.selectedAddressType,
        '',
        this.orderNo,
        parseFloat(this.collectiveValue)
      );
      // console.log("res", res);
      if (!!res.isSuccess) {
        this.orderResponse = res;
        if (res) {
          if (this.paymentMode.isOnline) {
            let orderObj = {
              razorpay_order_id: this.paymentResponse.razorpay_order_id,
              paymentID: this.paymentResponse.razorpay_payment_id,
              razorpay_signature: this.paymentResponse.razorpay_signature,
              orderID: this.orderResponse.data.id,
              status: 'Attempted',
              isAlloted: 0,
            };
            this.addOrderDetailsInTalkBrite(orderObj);
            this.changeRef.detectChanges();
          }
          this.buttonDisabled = false;
          // this.reset();
          this.router.navigate([
            '/view-order-details/' + this.orderResponse.data.publicId,
            { hideBackButton: true, pendingInfo: false },
          ]);
          this.logOut('', false);
          // this.router.navigate(["/orders", { hideBackButton: true }]);
        }
        this._configService.presentToast(
          'You  Order  is placed successfully',
          'success'
        );

        this._cartChangedService.observables.next();
      } else {
        this.buttonDisabled = false;
        console.error(res.error);
        this._configService.presentToast(res.error, 'error');
      }
    } else {
      this.buttonDisabled = false;
      this._configService.presentToast('Please Select All Details', 'error');
      await this.insertQuickBuyFormErrorView();
      await this.logOut('', false);
    }
  }

  async addOrderDetailsInTalkBrite(orderObj) {
    let orderRes = await this._databaseService.paymentInfoInTalkbrite(orderObj);
    // console.log("orderRes", orderRes);
  }

  async payWithRazor() {
    // console.log(this.paymentMode, this.totalWithShipCost, this.userData);
    if (!!this.paymentMode) {
      await this._razorkeyService.loadScript();
      let orderObj: any = {
        amount: parseFloat(this.totalWithShipCost) * 100,
        currency: 'INR',
        receipt: this.userId,
        payment_capture: 0,
      };
      orderObj.amount = parseInt(orderObj.amount);

      let orderInRazorPay = await this._amountService.createOrderInRazorPay(
        orderObj
      );
      this.orderInRazorPay = orderInRazorPay;
      if (orderInRazorPay.isSuccess) {
        this.buttonDisabled = false;
        var _this = this;
        var options: any = {
          description: '',
          order_id: orderInRazorPay.data.id,
          currency: 'INR', // your 3 letter currency code
          key: this._companyService.razorpayKey, // your Key Id from Razorpay dashboard
          amount: parseFloat(this.totalWithShipCost) * 100, // Payment amount in smallest denomiation e.g. cents for USD
          name: 'Place Your order here',
          prefill: {
            email: !!this.userData.email
              ? this.userData.email
              : 'test@gmail.com',
            contact: this.userData.username,
            name: this.userData.name,
          },
          modal: {
            ondismiss: function () {
              // alert("dismissed");
            },
          },
          handler: function (paymentRes) {
            // console.log("response", paymentRes);
            if (paymentRes) {
              _this.paymentResponse = paymentRes;
              _this.confirmOrder();
            }
          },
        };
        options.amount = parseInt(options.amount);

        var rzp1 = new Razorpay(options);
        rzp1.open();
      } else {
        this.buttonDisabled = false;
        await this._configService.presentToast(
          "Payment wasn't successfull. Please contact administrator.",
          'error'
        );
      }
    } else {
      this.buttonDisabled = false;
      this._configService.presentToast('Please Select Payment Mode', 'error');
    }
  }

  async payWithRazorForMobile() {
    // console.log(this.paymentMode, this.totalWithShipCost);
    if (!!this.paymentMode) {
      let orderObj: any = {
        amount: parseFloat(this.totalWithShipCost) * 100,
        currency: 'INR',
        receipt: this.userId,
        payment_capture: 0,
      };

      orderObj.amount = parseInt(orderObj.amount);

      let orderInRazorPay = await this._amountService.createOrderInRazorPay(
        orderObj
      );
      this.orderInRazorPay = orderInRazorPay;
      if (orderInRazorPay.isSuccess) {
        this.buttonDisabled = false;
        var options: any = {
          description: '',
          order_id: orderInRazorPay.data.id,
          currency: 'INR', // your 3 letter currency code
          key: this._companyService.razorpayKey, // your Key Id from Razorpay dashboard
          amount: parseFloat(this.totalWithShipCost) * 100, // Payment amount in smallest denomiation e.g. cents for USD
          name: 'Place Your order here',
          prefill: {
            email: this.userData.email,
            contact: this.userData.username,
            name: this.userData.name,
          },
          modal: {
            ondismiss: function () {
              // alert("dismissed");
            },
          },
        };

        options.amount = parseInt(options.amount);

        // console.log("options.amount", options.amount);
        RazorpayCheckout.open(options);
        RazorpayCheckout.on('payment.success', paymentRes => {
          this.paymentResponse = paymentRes;
          this.confirmOrder();
          // console.log("paymentRes", paymentRes);
        });
        RazorpayCheckout.on('payment.cancel', error => {
          alert(error.description + ' (Error ' + error.code + ')');
        });
      } else {
        this.buttonDisabled = false;
        await this._configService.presentToast(
          "Payment wasn't successfull. Please contact administrator.",
          'error'
        );
      }
    } else {
      this.buttonDisabled = false;
      this._configService.presentToast('Please Select Payment Mode', 'error');
    }
  }

  async shipModeSelected() {
    if (!!this.shipmentMode) {
      if (!!this.country) {
        let res: any;

        res = await this._databaseService.findByShipModeAndCountry(
          this.shipmentMode,
          this.country
        );
        if (res.status == 0) {
          // console.log("error");
        } else {
          // console.log("findByShipModeAndCountry res", res);
          let data = res.data;

          if (
            !!this.cartData &&
            !!this.cartData.data.products &&
            this.cartData.data.products.length > 0
          ) {
            if (
              !!data &&
              !!this.cartData &&
              !!this.cartData.data.products &&
              this.cartData.data.products.length > 0
            ) {
              // console.log("findByShipModeAndCountry data", data);
              let shipCost = 0;
              let perKgRate = data.perKgRate;
              await this.cartData.data.forEach(data => {
                shipCost =
                  shipCost + data.shippingWeight * data.quantity * perKgRate;
              });
              // console.log("shipCost ", shipCost);
              if (shipCost > 0) {
                this.shippingCost = shipCost;
                this.totalWithShipCost =
                  this.cartData.data.count.FinalPrice + this.shippingCost;

                // console.log("ship cost added ", this.cartData.data.count.FinalPrice, typeof this.cartData.data.count.FinalPrice, this.shippingCost, typeof this.shippingCost, this.totalWithShipCost, typeof this.totalWithShipCost);
              }
            } else {
              this.shippingCost = 0;
              this.totalWithShipCost =
                parseFloat(this.cartData.data.count.FinalPrice) +
                this.shippingCost;

              // console.log("ship cost removed ", this.totalWithShipCost);
            }
          }
        }
      }
    }
  }

  reset() {
    this.phone = '';
    this.name = '';
    this.pinCode = '';
    this.city = '';
    this.state = '';
    this.country = '';
    this.validations_form.get('address').setValue('');
    this.validations_form.get('street').setValue('');
    this.validations_form.get('block').setValue('-');
  }
  /*
    async verifyUser() {
      await this.insertQuickBuyInitiatedView();
      const modal = await this.modalController.create({
        component: LoginFormComponent,
        componentProps: {
          Mobile: this.phone,
          popup: true,
          pinBox: true,
          quickBuyVerify: true
        }
      });
      await modal.present();
      modal.onDidDismiss().then(data => {
        if (data.data) {
          // OTP verified hence proceed with order flow
          this.buttonDisabled = true;
          this.insertQuickBuyVerifiedView();
          this.userVerified();
        }
      })
    }
  
    async insertQuickBuyInitiatedView() {
      let productsArray = this.cartData.data.products.map(function (p) { return p.pId })
  
      let action = 10;
      if (!!this.allViewActions && !!this.allViewActions.quickBuyWithOTPInitiated) {
        action = this.allViewActions.quickBuyWithOTPInitiated;
      }
      let jsonObj = {
        actionId: action,
        refProductId: productsArray
      };
  
      let res: any;
  
      res = await this._companyService.insertView(jsonObj);
      if (res.status == 0) {
        // console.log("error");
      } else {
        // console.log("login view insert res", res);
      }
  
    }
  
    async insertQuickBuyVerifiedView() {
      let productsArray = this.cartData.data.products.map(function (p) { return p.pId })
  
      let action = 11;
      if (!!this.allViewActions && !!this.allViewActions.quickBuyWithOTPVerified) {
        action = this.allViewActions.quickBuyWithOTPVerified;
      }
      let jsonObj = {
        actionId: action,
        refProductId: productsArray
      };
  
      let res: any;
  
      res = await this._companyService.insertView(jsonObj);
      if (res.status == 0) {
        // console.log("error");
      } else {
        // console.log("login view insert res", res);
      }
  
    }
  */
  productTitle(title) {
    if (!!title && title.length > 80) {
      return title.substring(0, 70) + '...';
    } else {
      return title;
    }
  }

  openCart(id) {
    this._showIdService.observables.next(id);
    this._cartService.observables.next('data');
  }

  async insertQuickBuyFormErrorView() {
    let sessionId = await this.storage.get('sessionID');
    let userID = await this.storage.get('userID');
    let productsArray = this.cartData.data.products.map(function (p) {
      return p.pId;
    });

    let action = 14;
    if (!!this.allViewActions && !!this.allViewActions.quickBuyFormError) {
      action = this.allViewActions.quickBuyFormError;
    }
    let jsonObj = {
      sessionId: sessionId,
      ipAddress: null,
      actionId: action,
      refUserId: userID,
      refProductId: productsArray,
      refPcID: null,
      phoneNo: '91' + this.phone.toString(),
    };

    let res: any;

    res = await this._companyService.insertView(jsonObj);
    if (res.status == 0) {
      // console.log("error");
    } else {
      // console.log("login view insert res", res);
    }
  }
  async insertQuickBuyStartedView() {
    let action = 13;
    let productsArray = this.cartData.data.products.map(function (p) {
      return p.pId;
    });

    if (!!this.allViewActions && !!this.allViewActions.quickBuyInitiated) {
      action = this.allViewActions.quickBuyInitiated;
    }
    let jsonObj = {
      actionId: action,
      refProductId: productsArray,
      phoneNo: '91' + this.phone,
    };
    let res: any;

    res = await this._companyService.insertView(jsonObj);
    if (res.status == 0) {
      // console.log("error");
    } else {
      // console.log("login view insert res", res);
    }
  }

  async insertPlaceOrderClickedView() {
    let action = 15;
    let productsArray = this.cartData.data.products.map(function (p) {
      return p.pId;
    });

    if (!!this.allViewActions && !!this.allViewActions.placeOrderClicked) {
      action = this.allViewActions.placeOrderClicked;
    }
    let jsonObj = {
      actionId: action,
      refProductId: productsArray,
      phoneNo: '91' + this.phone,
    };
    let res: any;

    res = await this._companyService.insertView(jsonObj);
    if (res.status == 0) {
      // console.log("error");
    } else {
      // console.log("login view insert res", res);
    }
  }

  async logOut(message = 'Logout Succesfully', showMsg = true) {
    if (showMsg) this._configService.presentToast(message, 'success');
    let logOutRes: any = await this._headerFooterService.logoutFromTalkBrite();

    this.storage.remove('userID');
    this.storage.remove('guestUser');
    this.storage.remove('loggedInUser');
    this.storage.remove('userData');
    this.storage.remove('pincode');
    this.storage.remove('talkBriteAccessToken');
    this._configService.userNumber = '';
    this.loggedInUser = '';
    this.userId = null;
    this._LOGGEDOUTService.observables.next('loggedOut');
    this._LOGGEDINService.observables.next('loggedIn');
    // console.log("logout", this._configService.userNumber, this.loggedInUser);
    // if (showMsg) this._configService.presentToast(message, "success");
    // this.menu.close("menu");
    await this._headerFooterService.cartValueUpdated();
    if (this._configService.dealerClubMode == true) {
      this.router.navigateByUrl('/');
    } else {
      if (this._companyService.companyObj.config) {
        let companyJson = this._companyService.companyObj.config;
        if (!!companyJson) {
          if (!!companyJson.storeType) {
            this.router.navigate(['/login-with-sign-up']);
          } else {
            // this.router.navigateByUrl("/home");
          }
        }
      }
    }
  }
}
