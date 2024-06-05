import {
  Component,
  OnInit,
  ChangeDetectorRef,
  HostListener,
} from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Router, NavigationExtras } from '@angular/router';
import { DatabaseServiceService } from '../../service/database-service.service';
import { ConfigServiceService } from '../../service/config-service.service';
import { HeaderFooterService } from '../../service/headerFooter/header-footer.service';
import { ActivatedRoute } from '@angular/router';
import { IonicSelectableComponent } from 'ionic-selectable';
import {
  Platform,
  NavController,
  LoadingController,
  PopoverController,
  AlertController,
} from '@ionic/angular';
import { PopoverComponent } from '../../components/popover/popover.component';
import { format } from 'date-fns/format';
import { addDays } from 'date-fns/addDays';
import { addHours } from 'date-fns/addHours';
import { setHours } from 'date-fns/setHours';
import { setMinutes } from 'date-fns/setMinutes';

// declare module '*';
import { ModalController } from '@ionic/angular';
import { AddCustomerPage } from '../add-customer/add-customer.page';
import { CompanyService } from '../../service/company/company.service';
import { FunctionsService } from '../../service/cart/functions/functions.service';
import { NgxFormService } from '../../service/ngxForm/ngx-form.service';
import { AmountService } from '../../service/user/amount.service';
import { FavoriteService } from '../../service/product/favorite.service';
import { RazorkeyService } from '../../service/payment/razorkey.service';
import { ActionsService } from '../../service/cart/actions/actions.service';
import { CartService } from '../../service/observable/cart/cart.service';
import { CartChangedService } from '../../service/observable/cart-changed/cart-changed.service';
import { CloseCartService } from '../../service/observable/close-cart/close-cart.service';
import { ShowIdService } from '../../service/observable/show-id/show-id.service';
import { SelectedValuesService } from '../../service/observable/selected-values/selected-values.service';
import { OrderDetailsService } from '../../service/observable/order-details/order-details.service';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import { AnalyticsService } from 'src/app/service/analytics.service';
import { waitForAsync } from '@angular/core/testing';

declare var RazorpayCheckout: any;
declare var Razorpay: any;
export interface TotalSelectedSummary {
  cts: 0;
  pcs: 0;
  amount: 0;
  rapValue: 0;
}
@Component({
  selector: 'app-manage-orders',
  templateUrl: './manage-orders.page.html',
  styleUrls: ['./manage-orders.page.scss'],
})
export class ManageOrdersPage implements OnInit {
  public defaultpageName = 'ManageOrdersPage';
  public contentClass = '';
  public hideFavourites: any = false;
  public shouldShowCancel: 'focus';
  isResponsive: boolean = true;
  maxSize = 6;
  public userType: any;
  public userData: any;
  public orderBook = '';
  public customerAddress: any;
  public userId: any;
  public total: any;
  public addressId: any;
  public loggedInUser: any;
  public customerAddressForUser: any;
  public customer: any;
  public customerContact: any;
  public userIdByCust: any;
  public customerContactId: any;
  public quantity: any;
  public searchText: any;
  public offset = 0;
  public limit = 100;
  public custName: any;
  public selectedCustomer: any;
  public selectedContact: any;
  public showUserCard = false;
  public onMobile: any;
  public orders: any;
  public cartData: any;
  public cartQuantity: any;
  public sessionID: any;
  public orderResponse: any;
  public paymentResponse: any;
  public orderInRazorPay: any;
  public paymentModeList = this._companyService.allPaymentDetails;
  public paymentMode: any = this.paymentModeList[0];
  public bagTotal: any;
  public bagDiscountPrice: any;
  public taxTotal: any;
  public view: string = 'bag';
  public deliverAddress: any;
  public payNowText = 'Pay Now';
  public allShippingMethods: any;
  public shipmentMode: any;
  public shippingCost: any = 0;
  public totalWithShipCost: any;
  public shippingMethods: any;
  public companyLogo: any;
  public clientRemark: any;
  public cartId: any;
  public bagTotalWithUnitPrice: any;
  public skip = 0;
  public page: number = 1;
  public showSkeleton = true;
  public memoDays = [];
  public addressTypes = [];
  public selectedAddressType: any;
  public selectedMemoDays: any;
  public defaultMemoDay = false;
  public pickupUserId: any;
  public showAddressSkeleton: any;
  public resultColumns: any = [];
  public manageOrderPageColumns: any = [];
  public mobileColumns: any = [];
  public desktopColumns: any = [];
  public selected: any = [];
  public isExistsNote: any = false;
  public formSubmitOnOrderPlace = false;
  public showPickUpInput = false;
  public ShowPickUpTime = false;
  public selectedPickUpDays = 'Today';
  public selectedPickUpHours: any;
  public selectedPickUpMinutes: any;
  public selectedTimePerid: any;
  public pickUpDays = [];
  public pickUpHours = [];
  public pickUpMinutes = [];
  public timePeriod = [];
  public pickUpTime: any;
  public pickUpDate: any;
  public buttonDisabled = false;
  public orderNo = 0;
  public myCustomers: any;
  public showSelectionLabel = true;
  public collectiveValue: any = 0;
  public showError = false;
  public showCustomerError = false;
  public manageCustomers = false;
  public amountError = false;
  public disableContinueButton = false;
  public hideStorePrice = false;
  public pincode: any;
  public resellers: any;
  public hideBtn = true;
  public shortCodes = [];
  public allViewActions: any = this._companyService.allActions;
  public selectedDealer: any;
  // public pickUpTime = moment().set("hour", this.selectedPickUpHours).set("minute", this.selectedPickUpMinutes).format('yyyy-MM-dd hh:mm');
  // public pickUpDate = moment().add(1, 'hours').format('yyyy-MM-dd hh:mm');
  public minDate = format(new Date(), 'yyyy-MM-dd');
  public maxDate = format(addDays(new Date(), 2), 'yyyy-MM-dd');
  public addressLabel = 'Deliver To';
  public paymentCost: any = 0;
  public hideFooter: boolean = false;
  public innerWidth: any;
  public mobileView: boolean = false;
  public webViewMobile: boolean = false;
  public userKycDetail;
  purchaseCartId;
  from = '';
  refCartID = '';
  productIds = [];
  public totalSelectedSummary: TotalSelectedSummary = {
    cts: 0,
    pcs: 0,
    amount: 0,
    rapValue: 0,
  };
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (this._companyService.productListing == 'grid') {
      this.innerWidth = window.innerWidth;
      if (this.innerWidth <= 500) {
        this.mobileView = true;
      } else if (this.innerWidth > 500) {
        this.mobileView = false;
      }
    }
  }
  constructor(
    public _razorkeyService: RazorkeyService,
    public _favoriteService: FavoriteService,
    public _amountService: AmountService,
    public _ngxFormService: NgxFormService,
    public _functionsService: FunctionsService,
    public _companyService: CompanyService,
    public _headerFooterService: HeaderFooterService,
    public _actionsService: ActionsService,
    public _cartService: CartService,
    public _cartChangedService: CartChangedService,
    public _closeCartService: CloseCartService,
    public _showIdService: ShowIdService,
    public _selectedValuesService: SelectedValuesService,
    public _orderDetailsService: OrderDetailsService,
    public loadingCthl: LoadingController,
    private changeRef: ChangeDetectorRef,
    public platform: Platform,
    private route: ActivatedRoute,
    public storage: Storage,
    private router: Router,
    public _databaseService: DatabaseServiceService,
    public _configService: ConfigServiceService,
    public navCtrl: NavController,
    private popoverController: PopoverController,
    private modalController: ModalController,
    public analyticsService: AnalyticsService,
    public alertController: AlertController
  ) {
    this.loadCompanyData();

    this.platform.ready().then(() => {
      let platforms = this.platform.platforms();
      console.log(platforms);
      console.log(this.platform.is('android'), 'android');
      console.log(this.platform.is('desktop'), 'desktop');
      console.log(this.platform.is('mobileweb'), 'mobileweb');
      // console.log("this.platform", this.platform);
      if (this.platform.is('desktop')) {
        this.onMobile = false;
      } else if (this.platform.is('ios')) {
        this.onMobile = true;
      } else if (
        this.platform.is('android') &&
        !this.platform.is('mobileweb')
      ) {
        this.onMobile = true;
      } else if (this.platform.is('mobileweb')) {
        this.onMobile = false;
        this.webViewMobile = true;
      } else {
        this.onMobile = false;
      }
      this.webViewMobile = !platform.is('cordova');
      console.log('this.webViewMobile', this.webViewMobile);
    });
    // console.log("total", this.total);
    // this.route.params.subscribe(params => {
    //   this.total = params.orderTotal;
    //   this.quantity = params.quantity;
    //   // console.log("this.quantity", this.quantity);
    // });

    this._cartChangedService
      .observable(this.defaultpageName)
      .subscribe((data) => {
        this.cartData;
        this.getCartDetails();
      });

    this.route.queryParams.subscribe((params: any) => {
      if (params && params['view']) {
        this.view = params['view'];
        if (params['view'] == 'purchase') {
          this.loadView();
        }
      }

      if (params && params.cartId) {
        this.orderNo = params.cartId;
        this.from = params.from;
        this.refCartID = params['ref'];
        this.productIds = params.productIds;
      } else {
        this.orderNo = 0;
      }

      if (params && params.ob) {
        this.orderBook = params.ob;
        this.ionViewDidEnter();
      }

      if (params && params.orderId) {
        this.orderNo = params.orderId;
      }
    });

    this._selectedValuesService.observable().subscribe((data) => {
      this.customerContactId = data;
      // console.log("event", data, itemName);
      this.fetchCustomerAddress(data);
      this.fetchCustAddForContact();
    });
    this._orderDetailsService.observable().subscribe((data) => {
      this.total = data[0];
      this.quantity = data[1];
      this.cartQuantity = data[1];
      // console.log("orderDetails", this.total, this.quantity);
    });

    this._closeCartService.observable().subscribe(async (data) => {
      this.cartData;
      await this.getCartDetails();
    });
    // this.fetchAddress();

    // this.cartDetails();
    // this.fetchCustomer();
    this.getAllShippingMethod();

    this._companyService.currentPage = this.defaultpageName;
  }

  async genPickUpDate() {
    if (this.selectedPickUpDays == 'Today') {
      this.pickUpTime = format(
        setMinutes(
          setHours(
            new Date(),
            !!this.selectedTimePerid &&
              this.selectedTimePerid == 'PM' &&
              this.selectedPickUpHours != 12
              ? this.selectedPickUpHours + 12
              : this.selectedPickUpHours
          ),
          this.selectedPickUpMinutes
        ),
        'dd-MMM-yyyy hh:mm a'
      );
    }

    if (this.selectedPickUpDays == 'Tommorrow') {
      addDays;
      this.pickUpTime = format(
        addDays(
          setMinutes(
            setHours(
              new Date(),
              !!this.selectedTimePerid &&
                this.selectedTimePerid == 'PM' &&
                this.selectedPickUpHours != 12
                ? this.selectedPickUpHours + 12
                : this.selectedPickUpHours
            ),
            this.selectedPickUpMinutes
          ),
          1
        ),
        'dd-MMM-yyyy hh:mm a'
      );
    }

    if (this.selectedPickUpDays == 'Day After Tommorrow') {
      this.pickUpTime = format(
        addDays(
          setMinutes(
            setHours(
              new Date(),
              !!this.selectedTimePerid &&
                this.selectedTimePerid == 'PM' &&
                this.selectedPickUpHours != 12
                ? this.selectedPickUpHours + 12
                : this.selectedPickUpHours
            ),
            this.selectedPickUpMinutes
          ),
          2
        ),
        'dd-MMM-yyyy hh:mm a'
      );
    }
    // console.log("genPickUpDate this.pickUpTime ", this.pickUpTime, this.selectedPickUpHours, this.selectedPickUpMinutes, this.selectedTimePerid);
  }

  async changeAddressType() {
    this.addressLabel = 'Delivery';
    this.customerAddress = [];
    this.showAddressSkeleton = true;
    this.collectiveValue = 0;
    if (this.selectedAddressType == 'Deliver to My Customer') {
      if (this.cartData) {
        this.collectiveValue = this.cartData.data.count.FinalPrice;
      }

      this.userId = await this.storage.get('userID');
      let res = await this._databaseService.fetchChildCustomers(this.userId);
      if (res) {
        this.showAddressSkeleton = false;
      }

      if (res.data) {
        this.myCustomers = res.data;
      }
      if (this.myCustomers.length > 0) {
        this.selectedContact = this.myCustomers[0];
        await this.fetchCustomerAddress(this.selectedContact);
      } else {
        this.showCustomerError = true;
      }
    } else if (this.selectedAddressType == 'Pick Up') {
      if (this.ShowPickUpTime) {
        this.showPickUpInput = true;
      }
      this.addressLabel = 'Pick Up From';
      let res = await this._databaseService.fetchAddress(this.pickupUserId);
      if (res) {
        this.showAddressSkeleton = false;
      }
      if (!!res.isSuccess) {
        if (res.data.length > 0) {
          this.customerAddress = res.data[0].listOfAddresses;
          if (!!this.customerAddress && this.customerAddress.length > 0) {
            this.addressId = this.customerAddress[0].id;
            this.deliverAddress = this.customerAddress[0];
            this.customerAddress.forEach((addr) => {
              addr.isSelected = false;
            });
            this.customerAddress[0].isSelected = true;
            if (!!this.shippingMethods) {
              await this.setShippingMethods();
              await this.shipModeSelected(this.shippingMethods[0]);
            }
          }
        }
        await this.paymentModeSelected(this.paymentMode);
        // console.log("customerAddress", this.customerAddress);
      } else {
        // console.log(res.error);
        this._configService.presentToast(res.error, 'error');
      }
      this.getDiscount('Customer');
    } else if (this.selectedAddressType == 'Order via Dealer') {
      this.addressLabel = 'Order via';

      if (!!this.pincode) {
        let res: any = await this._databaseService.getResellers(this.pincode);
        if (res.isSuccess) {
          if (res.data.length > 0) {
            this.resellers = res.data;
            this.resellers.forEach((addr) => {
              addr.isSelected = false;
            });
            this.resellers[0].isSelected = true;
            this.addDealerAddress(this.resellers[0]);
          } else {
            let companyData = this._companyService.companyObj;
            let obj = {
              id: 1,
              companyName: companyData.name,
              contactName: companyData.contactName,
              address: 'SURAT',
              city: 'SURAT',
              state: 'GUJARAT',
              zipCode: '395001',
              contactNumber: companyData.contactNumber,
            };
            this.resellers = [];
            this.resellers.push(obj);
            this.resellers[0].isSelected = true;
            this.addDealerAddress(this.resellers[0]);
          }
        }
      } else {
        let companyData = this._companyService.companyObj;
        let obj = {
          id: 1,
          companyName: companyData.name,
          contactName: companyData.contactName,
          address: 'SURAT',
          city: 'SURAT',
          state: 'GUJARAT',
          zipCode: '395001',
          contactNumber: companyData.contactNumber,
        };
        this.resellers = [];
        this.resellers.push(obj);
        this.resellers[0].isSelected = true;
        this.addDealerAddress(this.resellers[0]);
      }
      this.showAddressSkeleton = false;
    } else {
      this.fetchAddress();
      this.showAddressSkeleton = false;
      this.showPickUpInput = false;
    }
    await this.getAllShippingMethod();
    await this.paymentModeSelected(this.paymentMode);
  }

  async checkAMount(event) {
    let value = event.target.value;
    if (value) {
      let checkValidation: boolean = await this.checkCollectiveAmount();
      if (checkValidation) {
        this.amountError = false;
        this.disableContinueButton = false;
      } else {
        this.amountError = true;
        this.disableContinueButton = true;
      }
    } else {
      this.amountError = true;
      this.disableContinueButton = true;
    }
  }

  async loadCompanyData() {
    this.setConfig();

    this.storage.get('manageCustomers').then((val) => {
      // console.log("manageCustomers", val);
      if (!!val) this.manageCustomers = val;
    });

    if (this._companyService.companyObj && this._companyService.companyObj) {
      if (this._companyService.companyObj.config) {
        let companyJson = this._companyService.companyObj.config;
        if (!!companyJson) {
          this.userId = await this.storage.get('userID');
          let userData =
            await this._headerFooterService.fetchUserProfileDetails(
              this.userId
            );
          if (!!userData.data && !!userData.data.memoDay) {
            this.selectedMemoDays = userData.data.memoDay;
            this.defaultMemoDay = true;
          } else {
            if (!!companyJson.memoDays) {
              this.memoDays = companyJson.memoDays;
              this.selectedMemoDays = this.memoDays[0].value;
            }
          }
          if (companyJson.formSubmitOnOrderPlace != undefined) {
            this.formSubmitOnOrderPlace = companyJson.formSubmitOnOrderPlace;
          }

          if (!!companyJson.shortCodes) {
            this.shortCodes = companyJson.shortCodes;
          }

          if (typeof companyJson.hideFavourites != 'undefined') {
            this.hideFavourites = companyJson.hideFavourites;
          }

          if (!!companyJson.addressTypes) {
            this.addressTypes = companyJson.addressTypes;
            if (!this.manageCustomers) {
              this.addressTypes = await this.addressTypes.filter(function (
                item
              ) {
                return item.name != 'Deliver to My Customer';
              });
            }
            this.selectedAddressType = await this.addressTypes.filter(
              (item) => item.selected == 'true'
            )[0]['value'];
          } else {
            this.selectedAddressType = 'Delivery';
          }

          if (!!companyJson.pickupUserId) {
            this.pickupUserId = parseInt(companyJson.pickupUserId);
          }
          if (!!companyJson.export) {
            if (!!companyJson.export.manageOrderPageColumns) {
              this.manageOrderPageColumns =
                companyJson.export.manageOrderPageColumns;
              this.desktopColumns = companyJson.export.manageOrderPageColumns;
            }

            if (!!companyJson.export.searchResultMobileColumns) {
              this.mobileColumns = companyJson.export.searchResultMobileColumns;
            }

            if (this.mobileView) {
              this.manageOrderPageColumns = this.manageOrderPageColumns.map(
                (x) => {
                  if (x.name == 'Purchase Discount') {
                    x.name = 'Discount';
                  }
                  if (x.name == 'Purchase Price') {
                    x.name = 'Price';
                  }
                  if (x.name == 'Purchase Amount') {
                    x.name = 'Amount';
                  }
                  return x;
                }
              );
              this.manageOrderPageColumns = this.mobileColumns;
              let obj = {
                fieldName: 'Rapnet_plus',
                name: 'AMOUNT',
                type: 'number',
                allowDeleting: true,
                orderBy: 13,
                mobileViewOrder: 5,
              };
              let isFound = await this.manageOrderPageColumns.find(
                (x) => x.name == 'AMOUNT'
              );
              if (!isFound) {
                this.manageOrderPageColumns.push(obj);
              }

              // this.manageOrderPageColumns = this.manageOrderPageColumns.filter(x => {
              //   if (x.name == 'Stone ID' || x.name == 'Rap' || x.name == 'Discount' || x.name == 'Price' || x.name == 'Amount') {
              //     return x
              //   }
              // })
              // this.manageOrderPageColumns = await this.manageOrderPageColumns.sort((a, b) => {
              //   return a.mobileViewOrder - b.mobileViewOrder;
              // });
            } else {
              this.manageOrderPageColumns = this.desktopColumns;
            }
          }

          if (!!companyJson.ShowPickUpTime) {
            this.ShowPickUpTime = companyJson.ShowPickUpTime;
          }

          if (!!companyJson.pickUpDays) {
            this.pickUpDays = companyJson.pickUpDays;
          }

          if (!!companyJson.pickUpHours) {
            this.pickUpHours = companyJson.pickUpHours;
            let addHour = format(addHours(new Date(), 1), 'h');
            let period = format(addHours(new Date(), 1), 'HH:mm A');
            period = period.split(' ')[1];
            this.selectedTimePerid = period;
            this.selectedPickUpHours = this.pickUpHours.find(
              (h) => h == parseInt(addHour)
            );
          }

          if (!!companyJson.pickUpMinutes) {
            this.pickUpMinutes = companyJson.pickUpMinutes;
            let time = format(addHours(new Date(), 1), 'HH:mm');
            let minutes = this.roundTime(time, 15).split(':')[1];
            this.selectedPickUpMinutes = this.pickUpMinutes.find(
              (h) => h == minutes
            );
          }

          if (!!companyJson.timePeriod) {
            this.timePeriod = companyJson.timePeriod;
          }
          if (!!this.selectedPickUpHours && this.selectedPickUpMinutes) {
            this.pickUpTime = format(
              setMinutes(
                setHours(
                  new Date(),
                  !!this.selectedTimePerid &&
                    this.selectedTimePerid == 'PM' &&
                    this.selectedPickUpHours != 12
                    ? this.selectedPickUpHours + 12
                    : this.selectedPickUpHours
                ),
                this.selectedPickUpMinutes
              ),
              'dd-MMM-yyyy hh:mm a'
            );
            // console.log("company data this.pickUpTime ", this.pickUpTime, this.selectedPickUpHours, this.selectedPickUpMinutes, this.selectedTimePerid);
          }

          if (!!companyJson && companyJson?.hideFooter) {
            this.hideFooter = companyJson?.hideFooter;
          }
        }
      }
    }
  }

  roundTime = (time, minutesToRound) => {
    let [hours, minutes] = time.split(':');
    hours = parseInt(hours);
    minutes = parseInt(minutes);

    // Convert hours and minutes to time in minutes
    time = hours * 60 + minutes;

    let rounded = Math.round(time / minutesToRound) * minutesToRound;
    let rHr = '' + Math.floor(rounded / 60);
    let rMin = '' + (rounded % 60);

    return rHr.padStart(2, '0') + ':' + rMin.padStart(2, '0');
  };

  setConfig() {
    if (!!this._companyService.companyObj.companyLogo) {
      this.companyLogo = this._companyService.companyObj.companyLogo;
    }
    if (
      this._companyService.companyObj &&
      this._companyService.companyObj &&
      this._companyService.companyObj.config
    ) {
      let companyJson = this._companyService.companyObj.config;
      if (!!companyJson) {
        if (!!companyJson.shipmentNotes) {
          this.isExistsNote = companyJson.shipmentNotes;
        }

        if (!!companyJson.hideStorePrice) {
          this.hideStorePrice = companyJson.hideStorePrice;
        }

        // if (!!companyJson && companyJson.paymentModeList != null && companyJson.paymentModeList != undefined) {
        //   this.paymentModeList = companyJson.paymentModeList;
        // }
      }
    }
  }
  getItemWord() {
    if (this.cartQuantity > 1) return this._configService.productName;
    else return this._configService.productName;
  }
  async ngOnInit() {
    // this.orderNo = 0
    this.userId = await this.storage.get('userID');

    // let res: any = await this._databaseService.getDiaUserProfile(this.userId);
    // let para = JSON.parse(res.data.parameter);

    if (this._companyService.productListing == 'grid') {
      this.innerWidth = window.innerWidth;
      if (this.innerWidth <= 500) {
        this.mobileView = true;
      } else if (this.innerWidth > 500) {
        this.mobileView = false;
      }
    }
    const params: any = this.route.snapshot.queryParams;
    this.pincode = await this.storage.get('pincode');
    if (params && params.ob) {
      this.orderBook = params.ob;
    }
    await this.loadCompanyData();
    if (!this._companyService.razorpayKey) {
      this._configService.presentToast('Razor key not defined', 'error');
    }
  }

  async loadView() {
    await this.fetchAddress();
    if (!!this.customerAddress && this.customerAddress.length > 0) {
      this.view = 'payment';
    } else {
      this.view = 'address';
    }
  }

  portChange(event: { component: IonicSelectableComponent; value: any }) {
    // console.log("port:", event.value);
  }

  async ionViewDidEnter() {
    this._configService.purchaseDiamondEvent.subscribe((data: string) => {
      this.loadView();
    });
    this.cartData;
    await this.getCartDetails();
    //await this.getAllShippingMethod();
    await this.fetchAddress();
    await this.changeAddressType();

    this.storage.get('userData').then((val) => {
      // console.log("userData", val);
      this.userData = val;
      // console.log("userData", this.userData);
    });

    this.storage.get('userType').then((val) => {
      // console.log("val", val);
      this.userType = val;
      // console.log("userType", this.userType);
    });
    // await this.fetchCustAddForContact();
    // console.log("ionViewDidEnter");
    // if (this.customerContactId) {
    //   this.userIdByCust = this.customerContactId.id;
    //   let res = await this._databaseService.fetchAddress(this.customerContactId.id);
    //   if (res.isSuccess) {
    //     this.customerAddressForUser = res;
    //     if (this.customerAddressForUser.data.length != 0 && this.customerAddressForUser.data[0].listOfAddresses.length != 0) {
    //       this.addressId = this.customerAddressForUser.data[0].listOfAddresses[0].id;
    //       this.deliverAddress = this.customerAddressForUser.data[0].listOfAddresses[0];
    //       // console.log("customerAddressForUser", this.customerAddressForUser);
    //     }
    //   }
    // }

    this._configService.setTitle('Order Details');
    // this.fetchCustomer();
  }
  async gotoAddressPage() {
    if (this.userType == 'Customer') {
      this.userId = await this.storage.get('userID');
      this.router.navigate([
        '/add-new-address',
        { userIdFromMangeOrders: this.userId },
      ]);
    } else {
      this.router.navigate([
        '/add-new-address',
        { userIdFromMangeOrders: this.customerContactId.id },
      ]);
    }
  }
  async fetchAddress() {
    this.userType = await this.storage.get('userType');
    if (this.userType == 'Customer') {
      this.userId = await this.storage.get('userID');
      if (this.userId) {
        let res = await this._databaseService.fetchAddress(
          parseInt(this.userId)
        );
        if (res) {
          this.showSkeleton = false;
        }
        if (!!res.isSuccess) {
          if (res.data.length > 0) {
            this.customerAddress = res.data[0].listOfAddresses;
            if (!!this.customerAddress && this.customerAddress.length > 0) {
              this.addressId = this.customerAddress[0].id;
              this.deliverAddress = this.customerAddress[0];
              this.customerAddress.forEach((addr) => {
                addr.isSelected = false;
              });
              this.customerAddress[0].isSelected = true;
              if (!!this.shippingMethods) {
                await this.setShippingMethods();
                await this.shipModeSelected(this.shippingMethods[0]);
              }
            }
          }
          await this.paymentModeSelected(this.paymentMode);
          // console.log("customerAddress", this.customerAddress);
        } else {
          // console.log(res.error);
          this._configService.presentToast(res.error, 'error');
        }
        this.getDiscount('Customer');
      }
    }
  }

  async createAddressForOrderViaDeader() {}

  async placeOrder() {
    let KYCStatus = await this.checkKyc();
    if (!KYCStatus) {
      this._configService.presentToast('Please complete KYC first', 'error');
      return;
    }
    if (!this.userKycDetail?.company?.name) {
      const alert = await this.alertController.create({
        header: 'Enter Company Details',
        inputs: [
          {
            name: 'companyName',
            type: 'text',
            placeholder: 'Enter Company Name',
            cssClass: 'emailText',
          },
          {
            name: 'companyAddress',
            type: 'textarea',
            placeholder: 'Enter Company Address',
            cssClass: 'emailText-area',
          },
        ],
        cssClass: 'email-alert-box',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              // console.log("Confirm Cancel");
            },
          },
          {
            text: 'Save',
            handler: (val) => {
              if (val.companyName && val.companyAddress) {
                this.saveUserProfile(val.companyName, val.companyAddress);
                return true;
              } else {
                this._configService.presentToast(
                  'Please Enter all fields',
                  'error'
                );
                return false;
              }
              // console.log("Confirm Ok");
            },
          },
        ],
      });
      await alert.present();
      return;
    }
    this.buttonDisabled = true;
    await this._databaseService.showLoading();
    this.userId = await this.storage.get('userID');
    this.loggedInUser = await this.storage.get('loggedInUser');
    let res = await this._databaseService.checkQuantityValidation(this.userId);
    // console.log("place order ", res, this.paymentMode.isOnline);
    let checkValidation: boolean = await this.checkCollectiveAmount();
    if (checkValidation) {
      if (!!res.isSuccess) {
        if (!!this.loggedInUser) {
          if (this.selectedAddressType == 'Order via Dealer') {
            let address = this.resellers.find((h) => h.id == this.addressId);
            // console.log(address);
            // let splitAddress = address.address.split(",")
            // let house = "";
            // let area = "";
            // let block = ""
            // if(splitAddress[0]){
            //   house = splitAddress[0]
            // }
            // if(splitAddress[1]){
            //   block = splitAddress[1]
            // }
            // if(splitAddress[2]){
            //   area = splitAddress[2]
            // }
            let fullName = '';
            if (address.companyName && address.contactName) {
              fullName = address.companyName + ' ' + address.contactName;
            } else {
              fullName = address.companyName;
            }
            this.selectedDealer = address.companyName;
            let addressObj = {
              id: this._databaseService.refCompanyId,
              fullName: fullName,
              phoneNo: address.contactNumber,
              area: address.address,
              city: address.city,
              country: 'INDIA',
              house: address.contactName,
              block: address.contactNumber,
              businessType: '',
              email: '',
              pinCode: parseInt(address.zipCode),
              state: address.state,
              defaultAddress: false,
              CCId: this.userId,
            };
            let res = await this._databaseService.insertAddress(addressObj);
            if (res.isSuccess) {
              this.addressId = res.data.id;
              // console.log(this.addressId)
            } else if (res.error == 'Customer address is already exist.') {
              let obj = {
                id: this._databaseService.refCompanyId,
                area: address.address,
                house: address.contactName,
              };
              let res = await this._databaseService.getAddress(obj);
              if (res.isSuccess) {
                this.addressId = res.data.id;
              }
            }
          }
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
          this._configService.presentToast('Please Login', 'error');
          this.router.navigate(['/login-with-sign-up']);
        }
      } else {
        this.buttonDisabled = false;
        if (res.error.data) {
          for (let d of res.error.data) {
            console.log(d);
            let StoneId = d.StoneId;
            let msg = d.message;
          }
        } else {
          this._configService.presentToast(res.error, 'error');
        }
      }
    } else {
      this.buttonDisabled = false;
      this._configService.presentToast(
        'Please enter valid collectible amount',
        'error'
      );
    }
  }

  async fetchCustomer() {
    if (!!this.searchText) {
      this.showUserCard = false;
      this.addressId = null;
      this.userType = await this.storage.get('userType');
      if (this.userType == 'User') {
        let res = await this._databaseService.fetchCustomerByPageination(
          this.offset,
          this.limit,
          this.searchText
        );
        // console.log("res", res);
        if (res.isSuccess) {
          this.customer = res;
          // console.log("customerAddressForUser", this.customer);
        }
      }
    }
  }

  async fetchCustomerAddress(data) {
    this.showAddressSkeleton = true;
    let res = await this._databaseService.fetchAddress(data.userid);
    if (res) {
      this.showAddressSkeleton = false;
    }
    if (!!res.isSuccess) {
      if (res.data.length > 0) {
        this.customerAddress = res.data[0].listOfAddresses;
        if (!!this.customerAddress && this.customerAddress.length > 0) {
          this.addressId = this.customerAddress[0].id;
          this.deliverAddress = this.customerAddress[0];
          this.customerAddress.forEach((addr) => {
            addr.isSelected = false;
          });
          this.customerAddress[0].isSelected = true;
          if (!!this.shippingMethods) {
            await this.setShippingMethods();
            await this.shipModeSelected(this.shippingMethods[0]);
          }
        }
      }
      await this.paymentModeSelected(this.paymentMode);
      // console.log("customerAddress", this.customerAddress);
    } else {
      // console.log(res.error);
      this._configService.presentToast(res.error, 'error');
    }
  }

  async fetchCustomerContact(customer) {
    this.showUserCard = true;
    // console.log("customer", customer);
    this.custName = customer.companyName;
    // console.log("custName", this.custName);
    let res = await this._databaseService.fetchCustomerContact(customer.id);
    if (res.isSuccess) {
      this.customerContact = res;
      if (this.customerContact.data) {
        // console.log(this.customerContact.data);
        this.selectedCustomer = this.customerContact.data[0];
        if (this.selectedCustomer) {
          this.customerContactId = this.selectedCustomer;
          this.fetchCustAddForContact();
        }
        // console.log("fetchCustomerContact", this.selectedCustomer);
      }
      this.searchText = '';
    }
  }

  async fetchCustAddForContact() {
    this.userType = await this.storage.get('userType');
    if (this.userType != 'Customer' && !!this.customerContactId) {
      // console.log("contactId", this.customerContactId.id);
      this.userIdByCust = this.customerContactId.id;
      if (!!this.cartId) {
        await this.applyScheme(this.cartId);
      }
      let res = await this._databaseService.fetchAddress(
        this.customerContactId.id
      );
      if (res.isSuccess) {
        this.customerAddressForUser = res;
        if (
          !!this.customerAddressForUser.data &&
          this.customerAddressForUser.data.length > 0 &&
          this.customerAddressForUser.data[0].listOfAddresses.length > 0
        ) {
          this.deliverAddress =
            this.customerAddressForUser.data[0].listOfAddresses[0];
          this.customerAddressForUser.data[0].listOfAddresses.forEach(
            (addr) => {
              addr.isSelected = false;
            }
          );
          this.deliverAddress.isSelected = true;
          if (!!this.shippingMethods) {
            await this.setShippingMethods();
            await this.shipModeSelected(this.shippingMethods[0]);
          }
          this.addressId = this.deliverAddress.id;
          // console.log("this.addressId ", this.addressId);
          // console.log("customerAddressForUser", this.customerAddressForUser, this.addressId);
        }
      }
      await this.getDiscount('User');
    }
  }

  getClasses() {
    if (this._companyService.productListing == 'grid' && !this.onMobile) {
      return 'buttonTop';
    } else {
      return '';
    }
  }

  openCart(id) {
    this._showIdService.observables.next(id);
    this._cartService.observables.next('data');
  }

  async get_getDiscount(userId_1: number, userId_2: number) {
    const res = await this._databaseService.getDiscount(
      Number(userId_1),
      Number(userId_2)
    );
    // console.log("discount for customer", res);
    if (!!res.isSuccess) {
      // this._configService.presentToast('Discount applied','success');
      // this.cartData;
      await this.getCartDetails();
    } else {
      console.error(res.error);
    }
  }

  async getDiscount(type) {
    this.userId = await this.storage.get('userID');
    // console.log("get discount", this.userIdByCust, this.userId, this.addressId);
    if (type == 'Customer' && !!this.userId) {
      this.get_getDiscount(this.userId, 0);
    } else if (!!this.userIdByCust && !!this.userId) {
      this.get_getDiscount(this.userIdByCust, this.userId);
    } else {
      this._configService.presentToast('Please Select All Details', 'error');
    }
  }

  async getCartDetails() {
    this.resultColumns = [];
    this.userId = await this.storage.get('userID');
    this.sessionID = await this.storage.get('sessionID');
    // console.log(this.userId, this.sessionID);
    let orderBook = this.orderBook;
    // if (this.orderNo) {
    //   orderBook = 'Temp';
    // }
    console.log(this.orderNo);

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
      .then((response) => {
        if (response) {
          this.showSkeleton = false;
        }
        if (!!response && !!response) {
          this.cartData = response;
          if (!!this.cartData.data) {
            if (!!this.cartData.data.products[0]) {
              this.page = this.skip + 1;
            }

            if (this.cartData?.data?.products.length > 0) {
              console.log(this.cartData.data.products);

              this.cartData.data.products = this.cartData.data.products.map(
                (p) => {
                  if (p['ShapeCode']) {
                    let checkRoundl = p['ShapeCode'].indexOf('Round');
                    let checkRoundU = p['ShapeCode'].indexOf('ROUND');
                    if (checkRoundl < 0 && checkRoundU < 0) {
                      p['CutCode'] = '';
                    }
                    if (p['CutCode']) {
                      let cutObj = this.shortCodes.filter(
                        (x) => x.label == p['CutCode']
                      );
                      if (cutObj.length > 0) {
                        p['CutCode'] = cutObj[0].code;
                      }
                    }

                    if (p['PolishCode']) {
                      let cutObj = this.shortCodes.filter(
                        (x) => x.label == p['PolishCode']
                      );
                      if (cutObj.length > 0) {
                        p['PolishCode'] = cutObj[0].code;
                      }
                    }

                    if (p['SymmetryCode']) {
                      let cutObj = this.shortCodes.filter(
                        (x) => x.label == p['SymmetryCode']
                      );
                      if (cutObj.length > 0) {
                        p['SymmetryCode'] = cutObj[0].code;
                      }
                    }
                  }
                  return p;
                }
              );
            }
          }
        } else {
          // console.log("error", response.error);
        }
      });
  }

  pagination(i) {
    this.skip = i - 1;
    this.cartData;
    this.getCartDetails();
  }

  async payWithRazor() {
    // console.log(this.paymentMode, this.total);
    this.totalWithShipCost = Math.round(this.totalWithShipCost);
    if (!!this.paymentMode) {
      this._razorkeyService.loadScript();

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
            email: this.userData.email,
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
    this.totalWithShipCost = Math.round(this.totalWithShipCost);
    if (!!this.paymentMode) {
      this._razorkeyService.loadScript();
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
        RazorpayCheckout.on('payment.success', (paymentRes) => {
          this.paymentResponse = paymentRes;
          this.confirmOrder();
          // console.log("paymentRes", paymentRes);
        });
        RazorpayCheckout.on('payment.cancel', (error) => {
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

  addAddress() {
    //open new page for address adding
    this._configService.editAddressObj = {};
    this._configService.userNumber = '';
    this.navCtrl.navigateForward(['/add-new-address']);
  }

  async addOrderDetailsInTalkBrite(orderObj) {
    let orderRes = await this._databaseService.paymentInfoInTalkbrite(orderObj);
    // console.log("orderRes", orderRes);
  }

  singleProduct(product) {
    // console.log("product ", product);;
    let name = '';
    if (!!product.productName)
      name = product.productName
        .replace(/\//g, '-')
        .replace(/\s+/g, '-')
        .toLowerCase();
    else name = product.stoneName;

    // console.log("name", name);

    if (this.mobileView && !this.webViewMobile) {
      this.navCtrl.navigateForward([
        '/products/' +
          (!!product.stoneName ? product.stoneName : product.id) +
          '/' +
          name +
          '/' +
          product.currentLocation,
      ]);
    } else {
      var host = window.location.href;
      const path: string[] = this.platform.url().split('/');
      console.log(path[path.length - 1]);
      window.open(
        host.replace(path[path.length - 1], 'products') +
          '/' +
          (!!product.stoneName ? product.stoneName : product.id) +
          '/' +
          name +
          '/' +
          product.currentLocation,
        '_blank'
      );
    }
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

  getOrderData(product: any, user: any, externalProduct: any) {
    return {
      StoneID: product?.stoneName || product?.title || product?.sku || '-',
      username: user?.name || '-',
      user: user?.username || '-',
      UserId: Number(this.userId) === 0 ? 0 : Number(this.userId) || '-',
      Shape: product?.ShapeCode || '-',
      Color: product?.ColorCode || '-',
      Clarity: product?.ClarityCode || '-',
      Size: Math.round(Number(product?.cts) * 100) / 100 || '-',
      Cut: product?.CutCode || '-',
      Polish: product?.PolishCode || '-',
      Symmetry: product?.SymmetryCode || '-',
      Lab: product?.lab || '-',
      Amount: Number(product?.[externalProduct.kgAppliedAmount]) || 0,
      Price: Number(product?.[externalProduct.kgAppliedPrice]) || 0,
      Discount: Number(product?.[externalProduct.kgAppliedDiscount]) || 0,
      Name: this.userData?.name || '-',
      Mobile: this.userData?.username || '-',
      Email: this.userData?.email || '-',
      'Distribution Center City': !!this.userData?.parameter
        ? JSON.parse(this.userData.parameter)?.userAccount?.distributioncenter
            ?.city || '-'
        : '-',
      'Sales Person Name': !!this.userData?.parameter
        ? JSON.parse(this.userData.parameter)?.userAccount?.salesperson.name ||
          '-'
        : '-',
      'Sales Person Email': !!this.userData?.parameter
        ? JSON.parse(this.userData.parameter)?.userAccount?.salesperson.email ||
          '-'
        : '-',
      'Sales Person Mobile': !!this.userData?.parameter
        ? JSON.parse(this.userData.parameter)?.userAccount?.salesperson
            .username || '-'
        : '-',
      'Stone Location': product?.location || '-',
      'User Country': !!this.userData?.parameter
        ? JSON.parse(this.userData.parameter)?.company?.country?.name || '-'
        : '-',
    };
  }

  addEvent_orderPlaced(user: any, externalProduct: any) {
    this.cartData.data.products.forEach((product: any) => {
      const orderData = this.getOrderData(product, user, externalProduct);
      this.analyticsService.addEvents('order placed', orderData);
    });
  }

  async confirmOrder() {
    let stones = [];
    const externalProduct =
      this._companyService.companyObj.config.externalProduct;
    // let checkDmccProduct = this.cartData.data.products.map(x => {
    //   let stone = x.title
    //   if (x.refKgCompanyId == 7) {
    //     stones.push(stone)
    //   }
    // })
    // if (stones.length > 0) {
    //   this._configService.presentToast(stones.join(", ") + " not available for sale", "error");
    //   this.buttonDisabled = false;
    //   return
    // }
    let sessionId = await this.storage.get('sessionID');
    let appName = this._configService.appName;
    let pArrayForGTM = [];
    this.cartData.data.products.filter((item) => {
      let o = {
        name: item.title,
        id: item.pId,
        price: item.price,
        variant: item.title,
      };
      pArrayForGTM.push(o);
    });

    let foundZeroPrice = this.cartData.data.products.find(
      (el) => el?.price <= 0
    );
    if (!!foundZeroPrice) {
      this._configService.presentToast(
        'One or more stones have zero price, Please remove these stones from your cart and place order for others',
        'error'
      );
      await this._databaseService.hideLoading();
      return;
    }

    //mixpanel
    let arr_stoneid = [];
    let user = await this.storage.get('userData');
    this.cartData.data.products.filter((item) => {
      arr_stoneid.push(item.title);
    });
    // api call on line 1360 & 1365
    let companyName = '';
    let distCity = '';
    let salesperson = '';

    this._companyService.insertGTM(
      'purchase',
      'purchase',
      { step: 4, option: 'purchase' },
      pArrayForGTM
    );
    console.log(this.userData);
    if (user.parameter) {
      let para = JSON.parse(user.parameter);
      if (para && para.company) {
        companyName = para.company.name;
      }

      if (para && para.userAccount) {
        distCity = para.userAccount.distributioncenter.city;
      }

      if (para && para.userAccount) {
        salesperson = para.userAccount.salesperson.name;
      }
    }

    // let remarkText = distCity + "-" + salesperson + "-" + companyName
    let remarks = this.clientRemark ? this.clientRemark : '';

    if (this.userType == 'Customer') {
      if (!!this.userId && !!this.addressId) {
        let res = await this._actionsService.orderCart(
          parseInt(this.userId),
          this.addressId,
          this.paymentMode.id,
          this.shipmentMode,
          sessionId,
          remarks,
          this.selectedMemoDays,
          this.orderBook,
          this.selectedAddressType,
          this.selectedAddressType == 'Pick Up' ? this.pickUpTime : '',
          this.orderNo,
          parseFloat(this.collectiveValue)
        );
        // console.log("res", res);
        if (!!res.isSuccess) {
          if (!!this.formSubmitOnOrderPlace) {
            let res1 =
              await this._databaseService.getPendingOrderDetailByOrderID(
                res.data.id
              );
            let total = 0;
            let qty = 0;
            res1.data.forEach((order) => {
              if (order.totalDiscountPrice != 0) {
                total += order.totalDiscountPrice;
              } else {
                total += order.total;
              }
              qty += order.quantity;
            });
            /*
            for (let i = 0; i < res1.data.length; i++) {
              let data = await this._databaseService.getProductVarinatDetails(res1.data[i].pId, res1.data[i].refPvID);
              if (!data.isSuccess) {
                this._configService.presentToast(data.error, "error");
              }
              res1.data[i].extra = data.data[0];
            }
            */
            let data = {
              event_id: '1234',
              event_type: 'form_response',
              form_response: {
                form_id: 'ORD11',
                token: '123456789',
                hidden: {
                  mode: ConfigServiceService.mode,
                  user: this.userData.username,
                  city: this.selectedDealer || '',
                },
              },
              Total: total,
              products: res1.data.map((res) => {
                if (res.listOfImages.length == 0) {
                  res.listOfImages = [
                    {
                      image: this.companyLogo,
                    },
                  ];
                }

                /*|||||||||||||| mixpanel api: data needed for mixpanel order placed event ||||||||||||||*/
                /*|||||||||||||| moved below line to after data variable ||||||||||||||*/
                // this.addEvent_orderPlaced(user, externalProduct);

                // this.cartData.data.products.forEach((product: any) => {
                //   console.log('\x1b[41m%s\x1b[0m', 'product: ', product);

                //   const orderData = this.getOrderData(
                //     product,
                //     user,
                //     externalProduct
                //   );

                //   this.analyticsService.addEvents('order placed', orderData);
                // });

                // this.analyticsService.addEvents('order placed', { StoneID: arr_stoneid, username: user.name, user: user.username });

                let data1 = {
                  description: res.description,
                  finalPrice: res.discountPrice * res.quantity,
                  id: res.pId,
                  name: res.title,
                  productPrice: res.unitPrice,
                  productPriceDiscount: res.unitPrice,
                  quantity: res.quantity,
                  sku: res.productSKU,
                  totalDiscountPrice: res.unitPrice,
                  listOfProductImages: res.listOfImages,
                  selectedVariant: {
                    id: res.refPvID,
                    title: res.title,
                    sku: res.sku,
                    quantity: this.quantity,
                    availableQuantity: res.availableQuantity,
                    price: res.discountPrice,
                    compareAtPrice: res.discountPrice,
                    outOfStock: res.availableQuantity == 0 ? 0 : 1,
                    refProductID: res.pId,
                    productPrice: res.unitPrice,
                    listOfProductVariantParameter: res.productVariant,
                  },
                  selectedVariantID: res.refPvID,
                  oldQuantity: this.quantity,
                  approveQuantity: 0,
                  selectedAddOns: res.selectedAddOns,
                };
                return data1;
              }),
              totalQuantity: qty,
              loggedInUserMobNumber: this.userData.username,
              contactNo: this.userData.username,
              contactName: this.userData.name,
              custId: this.userData.id,
              refCompanyId: this._databaseService.refCompanyId,
              cartNo: res.data,
            };

            /*|||||||||||||| mixpanel api: data needed for mixpanel order placed event ||||||||||||||*/
            this.addEvent_orderPlaced(user, externalProduct);

            let response =
              await this._ngxFormService.formSubmitToTalkBriteGlobal(data);

            if (!response.isSuccess) {
              this._configService.presentToast('Ticket Not Created', 'error');
            }

            let updateObj = {
              orderId: parseInt(res.data.id),
              ticketNo: parseInt(response.data.processId),
              refCompanyId: parseInt(this._databaseService.refCompanyId),
            };
            let updateRes = await this._databaseService.updateOrderIdTicketNo(
              updateObj
            );

            if (!updateRes.isSuccess) {
              this._configService.presentToast('Ticket Not Assign', 'error');
            }
          }
          this.orderResponse = res;
          if (res) {
            // this.cartData;
            // this.getCartDetails();

            if (this.from == 'cart') {
              let response =
                await this._functionsService.removeMultipleProductFromCart(
                  this.refCartID,
                  this.productIds,
                  sessionId,
                  this.userId
                );
            }
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
            this.router.navigate([
              '/manage-order-details/' + this.orderResponse.data.id,
              { hideBackButton: true, pendingInfo: false },
            ]);

            // this.router.navigate(["/orders", { hideBackButton: true }]);
          }
          if (this.orderBook) {
            //mixpanel api
            this.addEvent_orderPlaced(user, externalProduct);

            // this.cartData.data.products.forEach((product: any) => {
            //   const orderData = this.getOrderData(
            //     product,
            //     user,
            //     externalProduct
            //   );

            //   this.analyticsService.addEvents('order placed', orderData);
            // });

            // this.analyticsService.addEvents('order placed', {
            //   StoneID: arr_stoneid,
            //   username: user.name,
            //   user: user.username,
            // });

            await this._headerFooterService.cartValueUpdated();

            this._configService.presentToast(
              'You  ' + this.orderBook + '  is placed successfully',
              'success'
            );
          } else {
            //mixpanel api
            this.addEvent_orderPlaced(user, externalProduct);

            // this.cartData.data.products.forEach((product: any) => {
            //   const orderData = this.getOrderData(
            //     product,
            //     user,
            //     externalProduct
            //   );

            //   this.analyticsService.addEvents('order placed', orderData);
            // });

            // this.analyticsService.addEvents('order placed', {
            //   StoneID: arr_stoneid,
            //   username: user.name,
            //   user: user.username,
            // });

            await this._headerFooterService.cartValueUpdated();

            this._configService.presentToast(
              'You  Order  is placed successfully',
              'success'
            );
            // if (this.cartData.data.products.length > 0) {
            //   let productsArray = this.cartData.data.products.map(function (p) { return p.pId })
            //   let resCreateInquiry: any = await this._databaseService.createInquiries(
            //     {
            //       refUserId: this.userId,
            //       productIds: productsArray
            //     },
            //     "Place Order"
            //   );
            // }
          }

          this._cartChangedService.observables.next();
        } else {
          this.buttonDisabled = false;
          let errors = [];
          if (res.error.data) {
            for (let d of res.error.data) {
              console.log(d);
              let obj = {};
              obj['StoneId'] = d.StoneId;
              obj['Internal Status'] = d.internalStatus;
              obj['message'] = d.message;
              errors.push(obj);
              let fileName = moment().format('YYYY-MM-DD HH:mm:ss');
              this._configService.exportAsExcelFile(errors, fileName);
              this._configService.presentToast(res.error.message, 'error');
            }
            this.router.navigate(['/my-cart']);
          } else {
            this._configService.presentToast(res.error, 'error');
            this.router.navigate(['/my-cart']);
          }
        }
        this.cartData;
        this.getCartDetails();
      } else {
        this.buttonDisabled = false;
        this._configService.presentToast('Please Select All Details', 'error');
      }
    } else {
      if (!!this.userIdByCust && !!this.userId && !!this.addressId) {
        let res = await this._actionsService.orderForCustomer(
          parseInt(this.userIdByCust),
          this.addressId,
          parseInt(this.userId),
          this.paymentMode.id,
          this.shipmentMode,
          sessionId,
          remarks,
          this.selectedAddressType,
          this.selectedAddressType == 'Pick Up' ? this.pickUpTime : ''
        );
        if (!!res.isSuccess) {
          if (!!this.formSubmitOnOrderPlace) {
            let res1 =
              await this._databaseService.getPendingOrderDetailByOrderID(
                res.data.id
              );
            let total = 0;
            let qty = 0;
            res1.data.forEach((order) => {
              if (order.totalDiscountPrice != 0) {
                total += order.totalDiscountPrice;
              } else {
                total += order.total;
              }
              qty += order.quantity;
            });

            for (let i = 0; i < res1.data.length; i++) {
              let data = await this._databaseService.getProductVarinatDetails(
                res1.data[i].pId,
                res1.data[i].refPvID
              );
              if (!data.isSuccess) {
                this._configService.presentToast(data.error, 'error');
              }
              res1.data[i].extra = data.data[0];
            }

            let savedRedord = {
              loggedInUserMobNumber: this.userData.username,
              contactNo: this.userData.username,
              contactName: this.userData.name,
              custId: this.userData.id,
            };

            if (!!this.selectedCustomer) {
              if (!!this.selectedCustomer.id) {
                savedRedord.custId = this.selectedCustomer.id;
              }
              if (!!this.selectedCustomer.name) {
                savedRedord.loggedInUserMobNumber = this.selectedCustomer.name;
                savedRedord.contactNo = this.selectedCustomer.name;
                savedRedord.contactName = this.selectedCustomer.name;
              }
            }

            let data = {
              event_id: '1234',
              event_type: 'form_response',
              form_response: {
                form_id: 'ORD11',
                token: '123456789',
                hidden: {
                  mode: ConfigServiceService.mode,
                  user: this.userData.username,
                  city: this.selectedDealer || '',
                },
              },
              Total: total,
              products: res1.data.map((res) => {
                if (res.listOfImages.length == 0) {
                  res.listOfImages = [
                    {
                      image: this.companyLogo,
                    },
                  ];
                }
                let data1 = {
                  description: res.description,
                  finalPrice: res.discountPrice * res.quantity,
                  id: res.pId,
                  name: res.title,
                  productPrice: res.unitPrice,
                  productPriceDiscount: res.unitPrice,
                  quantity: res.quantity,
                  sku: res.productSKU,
                  totalDiscountPrice: res.unitPrice,
                  listOfProductImages: res.listOfImages,
                  selectedVariant: {
                    id: res.refPvID,
                    title: res.title,
                    sku: res.sku,
                    quantity: this.quantity,
                    availableQuantity: res.extra.availableQuantity,
                    price: res.discountPrice,
                    compareAtPrice: res.discountPrice,
                    outOfStock: res.extra.availableQuantity == 0 ? 0 : 1,
                    refProductID: res.pId,
                    productPrice: res.unitPrice,
                    listOfProductVariantParameter: res.productVariant,
                  },
                  selectedVariantID: res.refPvID,
                  oldQuantity: this.quantity,
                  approveQuantity: 0,
                  selectedAddOns: res.selectedAddOns,
                };
                return data1;
              }),
              totalQuantity: qty,
              refCompanyId: this._databaseService.refCompanyId,
              cartNo: res.data,
              ...savedRedord,
            };
            let response =
              await this._ngxFormService.formSubmitToTalkBriteGlobal(data);

            if (!response.isSuccess) {
              this._configService.presentToast('Ticket Not Created', 'error');
            }

            let updateObj = {
              orderId: parseInt(res.data.id),
              ticketNo: parseInt(response.data.processId),
              refCompanyId: parseInt(this._databaseService.refCompanyId),
            };
            let updateRes = await this._databaseService.updateOrderIdTicketNo(
              updateObj
            );

            if (!updateRes.isSuccess) {
              this._configService.presentToast('Ticket Not Assign', 'error');
            }
          }
          this.orderResponse = res;
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
          this.router.navigate([
            '/manage-order-details/' + this.orderResponse.data.id,
            { hideBackButton: true, pendingInfo: false },
          ]);
          await this._headerFooterService.cartValueUpdated();
          // this.router.navigate(["/orders", { hideBackButton: true }]);
          this._configService.presentToast(
            'Your order is placed successfully',
            'success'
          );
          this._cartChangedService.observables.next();
        } else {
          this.buttonDisabled = false;
          console.error(res.error);
        }
      } else {
        this._configService.presentToast('Please Select All Details', 'error');
      }
    }
  }

  async insertViewActions(refProductId, actionId) {
    let jsonObj = {
      actionId: actionId,
      refProductId: refProductId,
    };

    let res: any;

    res = await this._companyService.insertView(jsonObj);
    if (res.status == 0) {
      // console.log("error");
    } else {
      // console.log("login view insert res", res);
    }
  }

  async buynow(view) {
    let type = 'reviewOrderSummary';
    if (view == 'payment') {
      type = 'addressSelection';
    }
    if (
      !!this.cartData &&
      this.cartData.data.products &&
      this.cartData.data.products.length > 0
    ) {
      let productsArray = this.cartData.data.products.map(function (p) {
        return p.pId;
      });
      let action;
      if (!!this.allViewActions && !!this.allViewActions[type]) {
        action = this.allViewActions[type];
      }
      let appName = this._configService.appName;
      let pArrayForGTM = [];
      this.cartData.data.products.filter((item) => {
        let o = {
          name: item.title,
          id: item.pId,
          price: item.price,
          variant: item.title,
        };
        pArrayForGTM.push(o);
      });
      this._companyService.insertGTM(
        'checkout',
        'checkout',
        { step: view == 'address' ? 2 : 3, option: action },
        pArrayForGTM
      );

      await this.insertViewActions(productsArray, action);
      // let resCreateInquiry: any = await this._databaseService.createInquiries(
      //   {
      //     refUserId: this.userId,
      //     productIds: productsArray
      //   },
      //   type
      // );
    }
    this.showError = false;
    if (view == 'payment' && this.collectiveValue != 0) {
      if (this.collectiveValue < this.cartData.data.count.FinalPrice) {
        this.showError = true;
      }
      this.view = view;
    } else {
      this.view = view;
    }
  }

  paymentModeSelected(payMode) {
    console.log('paymentModeSelected payMode ', payMode);
    this.paymentCost = 0;
    if (
      !!this.cartData &&
      this.cartData.data &&
      this.cartData.data.count &&
      this.cartData.data.count.FinalPrice
    ) {
      this.totalWithShipCost =
        parseFloat(this.cartData.data.count.FinalPrice) + this.shippingCost;
    }

    if (!!payMode) {
      this.paymentMode = payMode;
      if (this.paymentMode.flat) {
        this.paymentCost = parseFloat(this.paymentMode.flat);
        this.totalWithShipCost -= this.paymentCost;
      } else if (this.paymentMode.discount) {
        if (this.paymentMode.discount.toString().includes('%')) {
          this.paymentMode.discount.slice('%');
        }
        this.paymentCost = (
          (this.totalWithShipCost * parseFloat(this.paymentMode.discount)) /
          100
        ).toFixed(3);
        this.totalWithShipCost -= this.paymentCost;
        console.log(
          'this.totalWithShipCost ',
          this.totalWithShipCost,
          ' this.paymentCost ',
          this.paymentCost
        );
      }

      if (
        !this.paymentMode.isOnline ||
        this.paymentMode.isOnline == 0 ||
        this.paymentMode.isOnline == null
      ) {
        if (this.orderBook == 'Memo') {
          this.payNowText = 'Place Memo';
        } else {
          this.payNowText = 'Place Order';
        }
      } else if (!this.hideStorePrice) {
        // if (!!payMode.discount) {
        //   this.bagDiscountPrice = payMode.discount;
        // } else if (!!payMode.flat) {
        //   this.bagDiscountPrice = payMode.flat;
        // } else {
        //   this.bagDiscountPrice = 0;
        // }
        this.payNowText =
          'Pay ' + this.totalWithShipCost + this._companyService.currencySymbol;
      } else {
        this.payNowText = 'Place Order';
      }
    }
  }

  async changeDeliverAddress(address) {
    // console.log("address ", address);
    if (this.userType == 'User') {
      this.customerAddressForUser.data[0].listOfAddresses.forEach((addr) => {
        addr.isSelected = false;
      });
      if (!!address) {
        address.isSelected = true;
        this.deliverAddress = address;
        if (!!this.shippingMethods) {
          await this.setShippingMethods();
          await this.shipModeSelected(this.shippingMethods[0]);
        }
        this.addressId = this.deliverAddress.id;
        // console.log("addressId ", this.addressId);
      }
    } else {
      this.customerAddress.forEach((addr) => {
        addr.isSelected = false;
      });
      if (!!address) {
        address.isSelected = true;
        this.deliverAddress = address;
        if (!!this.shippingMethods) {
          await this.setShippingMethods();
          await this.shipModeSelected(this.shippingMethods[0]);
        }
        this.addressId = address.id;
      }
    }
  }
  async applyScheme(cartId) {
    let userId = await this.storage.get('userID');
    let jsonObj = {
      refUserId: userId,
      refCartId: cartId,
    };
    if (this.userType != 'Customer') {
      jsonObj.refUserId = this.userIdByCust;
    }
    let res: any;
    res = await this._functionsService.applySchemes(jsonObj);
  }

  async removeCartProduct(item) {
    let sessionId = await this.storage.get('sessionID');
    let userId = await this.storage.get('userID');

    let res = await this._functionsService.removeCartProduct(
      item.refCartID,
      item.refCartProductId,
      sessionId,
      userId
    );
    if (!!res.isSuccess) {
      this._configService.presentToast(
        'Product removed from your order successfully',
        'success'
      );
      this._cartChangedService.observables.next();
      await this.applyScheme(item.refCartID);
      this.cartData;
      await this.getCartDetails();
      setTimeout(async () => {
        await this.paymentModeSelected(this.paymentMode);
      }, 500);
    }
  }

  async addToFavorite(item) {
    // console.log("product", item);

    let userId = await this.storage.get('userID');
    if (!userId && userId == null && userId == undefined) {
      this._configService.presentToast('Please Login', 'error');
      let navigationExtras: NavigationExtras = {
        queryParams: {
          to: '/my-favorite',
        },
      };
      this.router.navigate(['/login-with-sign-up'], navigationExtras);
    } else {
      if (!!item && !!item.pId) {
        let favoriteObj = {
          productId: item.pId,
          userId: parseInt(userId),
        };
        let favoriteResponse = await this._favoriteService.createFavorite(
          favoriteObj
        );
        // console.log("favoriteResponse", favoriteResponse);
        if (favoriteResponse.isSuccess) {
          this._configService.presentToast(
            'Added to your favorites',
            'success'
          );
        } else {
          this._configService.presentToast(favoriteResponse.error, 'error');
        }
        await this.removeCartProduct(item);
      } else {
        this._configService.presentToast('Select Product', 'error');
      }
    }
  }

  async goToHomePage() {
    this.userId = await this.storage.get('userID');
    let data = await this._companyService.defaultHomePage(true);
    if (data) {
      this.router.navigateByUrl(data);
    } else {
      this.router.navigateByUrl('/');
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
      this.allShippingMethods = res.data;
      await this.setShippingMethods();
      await this.shipModeSelected(this.shippingMethods[0]);
      // console.log("getAllShippingMethod res", res, this.allShippingMethods, this.shippingMethods);
    }
  }
  async setShippingMethods() {
    this.shippingMethods = this.allShippingMethods;
    if (
      !!this.deliverAddress &&
      !!this.deliverAddress.country &&
      this.deliverAddress.country.toUpperCase() == 'INDIA'
    ) {
      let shippingMethods = this.allShippingMethods.filter((method) => {
        return method.name == 'Air';
      });
      if (shippingMethods.length > 0) {
        this.shippingMethods = shippingMethods;
      }
      // console.log("shippingMethods ", this.shippingMethods);
    }
  }

  async shipModeSelected(shipMode) {
    // console.log("shipMode ", shipMode, this.deliverAddress);
    if (!!shipMode) {
      this.shipmentMode = shipMode.id;
      if (!!this.deliverAddress && !!this.deliverAddress.country) {
        let res: any;

        res = await this._databaseService.findByShipModeAndCountry(
          this.shipmentMode,
          this.deliverAddress.country
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
              await this.cartData.data.products.forEach((data) => {
                if (!!data.shippingWeight)
                  shipCost =
                    shipCost + data.shippingWeight * data.quantity * perKgRate;
              });
              // console.log("shipCost ", shipCost);
              if (shipCost > 0) {
                this.shippingCost = shipCost;
                this.totalWithShipCost = (
                  this.cartData.data.count.FinalPrice +
                  this.shippingCost -
                  this.paymentCost
                ).toFixed(3);

                if (this.paymentMode.isOnline && !this.hideStorePrice) {
                  this.payNowText =
                    'Pay ' +
                    this.totalWithShipCost +
                    this._companyService.currencySymbol;
                }
                // console.log("ship cost added ", this.cartData.data.count.FinalPrice, typeof this.cartData.data.count.FinalPrice, this.shippingCost, typeof this.shippingCost, this.totalWithShipCost, typeof this.totalWithShipCost);
              }
            } else {
              this.shippingCost = 0;
              this.totalWithShipCost = (
                parseFloat(this.cartData.data.count.FinalPrice) +
                this.shippingCost -
                this.paymentCost
              ).toFixed(3);
              if (this.paymentMode.isOnline && !this.hideStorePrice) {
                this.payNowText =
                  'Pay ' +
                  this.totalWithShipCost +
                  this._companyService.currencySymbol;
              }
              // console.log("ship cost removed ", this.totalWithShipCost);
            }
          }
        }
      }
    }
  }
  async presentPopover(ev: any) {
    let popover = await this.popoverController.create({
      component: PopoverComponent,
      event: ev,
      componentProps: { html: this.isExistsNote.html },
      translucent: true,
    });
    if (this.isExistsNote.css) {
      popover.style.cssText = this.isExistsNote.css;
    }
    return await popover.present();
  }

  async addDealerAddress(address) {
    this.addressId = address.id;

    this.resellers.forEach((addr) => {
      addr.isSelected = false;
    });
    address.isSelected = true;

    let fullName = '';
    if (address.companyName && address.contactName) {
      fullName = address.companyName + '(' + address.contactName + ')';
    } else {
      fullName = address.companyName;
    }
    this.deliverAddress = {};
    this.deliverAddress['fullName'] = fullName;
    this.deliverAddress['city'] = address.city;
    this.deliverAddress['phoneNo'] = address.contactNumber;
    this.deliverAddress['area'] = address.address;
    this.deliverAddress['pinCode'] = address.zipCode;
    this.deliverAddress['state'] = address.state;
    this.deliverAddress['country'] = 'INDIA';
    // console.log(this.shippingMethods);
    if (!!this.shippingMethods) {
      await this.setShippingMethods();
      await this.shipModeSelected(this.shippingMethods[0]);
    }
  }

  async addNewCustomer() {
    const modal = await this.modalController.create({
      component: AddCustomerPage,
      componentProps: {
        popup: true,
      },
    });

    modal.onDidDismiss().then(async (data) => {
      // console.log("modal dismissed ", data);

      if (!!data && !!data.data && data.data != -1) {
        let res = await this._databaseService.fetchChildCustomers(this.userId);
        if (res) {
          this.showAddressSkeleton = false;
        }
        if (res.data) {
          this.myCustomers = res.data;
        }

        if (this.myCustomers.length > 0) {
          this.selectedContact = this.myCustomers[0];
          this.fetchCustomerAddress(this.selectedContact);
        } else {
          this.showCustomerError = true;
        }
      }
    });
    await modal.present();
  }

  equals(variable, value) {
    return variable == value;
  }

  async loadUserData() {
    this.loggedInUser = await this.storage.get('loggedInUser');

    this.sessionID = await this.storage.get('sessionID');
    this.userId = await this.storage.get('userID');
    this.userData = await this.storage.get('userData');

    // console.log("loadUserData ", this.loggedInUser);
  }

  selectionViewData(event: {
    totalSelectedSummary: TotalSelectedSummary;
    hideClearSelection: boolean;
  }) {
    this.totalSelectedSummary = event.totalSelectedSummary;
  }

  async saveUserProfile(companyName, companyAddress) {
    await this._databaseService.showLoading();
    let values = {
      name: companyName,
      address: companyAddress,
      block: '',
      street: '',
      city: '',
      state: '',
      zip: '',
      country: {},
      businessType: '',
    };
    let objToPost = {
      useid: this.userId,
      update: 'company',
      newValues: values,
    };
    let res: any = await this._databaseService.updateDiaUserProfile(objToPost);

    let data = await this._databaseService.checkUserExistByPhoneNo(
      this.loggedInUser.replace('+', '')
    );
    await this.storage.set('userData', data.data);

    await this._databaseService.hideLoading();

    this.placeOrder();
  }

  async checkKyc() {
    this.loggedInUser = this.storage.get('loggedInUser');
    await this.loadUserData();
    if (!!this.loggedInUser && !!this.userId) {
      let user = await this.storage.get('userData');
      let res: any = await this._databaseService.getDiaUserProfile(this.userId);
      if (res.data.parameter) {
        let para = JSON.parse(res.data.parameter);
        this.userKycDetail = para;
      }

      if (user?.username) {
        let checkKycStatusData =
          await this._databaseService.checkUserExistByPhoneNo(user.username);
        if (checkKycStatusData?.data) {
          if (checkKycStatusData?.data?.KYCStatus) {
            return true;
          }
        }
      }

      if (!!res.data && res.data.parameter != '') {
        let para = JSON.parse(res.data.parameter);
        if (
          para &&
          para.general &&
          para.general.name &&
          para.userAccount &&
          para.userAccount.username &&
          para.userKYC &&
          para.userKYC.kyc &&
          para.userAccount.latticeApproved
        ) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    }

    // Ensure a default return value is provided if none of the conditions are met
    return false;
  }
}
