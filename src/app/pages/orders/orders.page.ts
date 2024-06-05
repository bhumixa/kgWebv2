import {
  Component,
  OnInit,
  ChangeDetectorRef,
  TemplateRef,
  ViewChild,
  HostListener,
} from '@angular/core';
import { DatabaseServiceService } from '../../service/database-service.service';
import { Storage } from '@ionic/storage-angular';
import {
  NavController,
  Platform,
  AlertController,
  ModalController,
  ActionSheetController,
} from '@ionic/angular';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ConfigServiceService } from '../../service/config-service.service';
import { format } from 'date-fns/format';
import { differenceInDays } from 'date-fns/differenceInDays';

import { formatNumber } from '@angular/common';
import { CompanyService } from './../../service/company/company.service';
import { HeaderFooterService } from '../../service/headerFooter/header-footer.service';
import { SelectedValuesService } from '../../service/observable/selected-values/selected-values.service';
import { TranslateService } from '@ngx-translate/core';
import { TranslateConfigService } from 'src/app/service/translate-config-service.service';
@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {
  public selectedSegment = 'By Me';
  public shouldShowCancel: 'focus';
  public filter = false;
  public myDate = 'YOUR_DATE';
  public datePickerObj: any = {};
  public orderPageButton: any = [];
  public resultColumns: any = [];
  public searchResultColumns: any = [];
  public selected: any = [];
  public temp: any = [];
  public orderBook = '';
  public userId = 0;
  public loggedInUser: any;
  public onMobile: any;
  public orders: any = [];
  public offset = 0;
  public skeleton: boolean = true;
  public limit = 10;
  public search = '';
  public hideBackButton = false;
  public showDealersOrderOnOrdersPage = false;
  public status: String = '';
  public selectedFile: File = null;
  public uploadOrderView = false;
  public allShippingMethods: any;
  public shipmentMode: any;
  public paymentModeList: any = this._companyService.allPaymentDetails.filter(
    (p) => !p.isOnline
  );
  public paymentMode: any = this.paymentModeList[0];
  public customerAddress: any;
  public addressId: any;
  public referenceNo: any = '';
  public allowUploadFromFile = false;
  public userType: any;
  public searchText: any;
  public customers: any;
  public customerContacts: any;
  public custName: any;
  public selectedCustomer: any;
  public customerContactId: any;
  public title = 'Orders';
  public quantityLabel = '';
  public variant = true;
  public shipment = true;
  public images = true;
  public searchObj: any = {};
  public label = 'Transaction';
  public colName = 'Order';
  public selectedCol = '';
  public hideStorePrice = false;
  public totalSummary: any = [];
  public isGuestUser: any = false;
  public pageSize = 10;
  public hideFooter: boolean = false;
  public contentClass = '';
  public innerWidth: any;
  public mobileView: boolean = false;
  public refreshGrid: boolean = false;
  languageChanged: any = '';

  translatedData: any;
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (this._companyService.productListing == 'grid') {
      this.innerWidth = window.innerWidth;
      if (this.innerWidth <= 500) {
        this.contentClass = '';
        this.mobileView = true;
      } else if (this.innerWidth > 500) {
        this.contentClass = 'leftRightMargin';
        this.mobileView = false;
      }
    }
  }
  constructor(
    public _headerFooterService: HeaderFooterService,
    public _companyService: CompanyService,
    public _configService: ConfigServiceService,
    public _selectedValuesService: SelectedValuesService,
    private changeRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    public platform: Platform,
    public storage: Storage,
    public databaseServiceService: DatabaseServiceService,
    public router: Router,
    public navCtrl: NavController,
    public alertController: AlertController,
    private activeRoute: ActivatedRoute,
    public modalController: ModalController,
    public actionSheetController: ActionSheetController,
    public translator: TranslateService,
    private translateService: TranslateConfigService
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

    this.route.params.subscribe((params) => {
      this.changeRef.detectChanges();
      this.hideBackButton = params['hideBackButton'];
    });

    this._selectedValuesService.observable().subscribe((data) => {
      this.customerContactId = data;

      // console.log("event", data, itemName);
      this.fetchCustAddForContact();
    });

    this.activeRoute.queryParams.subscribe((queryParams: any) => {
      if (queryParams.ob) {
        this.orderBook = queryParams.ob;
        if (this.orderBook) {
          this.label = this.orderBook;
          this.colName = this.orderBook;
        }
      } else {
        this.orderBook = '';
        this.label = 'Transaction';
        this.colName = 'Order';
      }
      this.fetchUserData();

      //fetch your new parameters here, on which you are switching the routes and call ngOnInit()
      if (!this.isGuestUser) {
        this.loadData(queryParams.ob);
        this.ionViewDidEnterCustom();
      } else {
        this.skeleton = false;
      }
    });
  }

  async loadData(ob) {
    if (ob) {
      this.title = ob;
      this.orderBook = ob;
    } else {
      this.title = 'Orders';
      this.orderBook = '';
    }

    await this.setOrderUploadButton();
  }

  async ngOnInit() {
    if (this._companyService.productListing == 'grid') {
      this.innerWidth = window.innerWidth;
      if (this.innerWidth <= 500) {
        this.contentClass = '';
      } else if (this.innerWidth > 500) {
        this.contentClass = 'leftRightMargin';
      }
    }
    this.status = this.route.snapshot.paramMap.get('status');
    const params: any = this.activeRoute.snapshot.queryParams;
    if (params && params.ob) {
      this.title = params.ob;
      this.orderBook = params.ob;
      if (this.orderBook) {
        this.label = this.orderBook;
      }
    }
    if (this.status == 'All') {
      this.status = '';
    }
    // this.storage.get("userID").then(val => {
    //   this.userId = parseInt(val);
    //   this.loadOrders();
    // });
    await this.fetchUserData();

    if (!this.isGuestUser) {
      await this.getAllShippingMethod();
      await this.fetchAddress();
      await this.setOrderUploadButton();
    } else {
      this.skeleton = false;
    }

    this.datePickerObj = {
      setLabel: 'Set', // default 'Set'
      todayLabel: 'Today', // default 'Today'
      closeLabel: 'Close', // default 'Close'
      titleLabel: 'Select a Date', // default null
      monthsList: [
        'Jan',
        'Feb',
        'March',
        'April',
        'May',
        'June',
        'July',
        'Aug',
        'Sept',
        'Oct',
        'Nov',
        'Dec',
      ],
      weeksList: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
      dateFormat: 'dd/MM/yyyy',
      clearButton: false, // default true
      momentLocale: 'pt-BR', // Default 'en-US'
      yearInAscending: true, // Default false
      btnCloseSetInReverse: true, // Default false
      btnProperties: {
        expand: 'block',
        size: 'small',
      },
      arrowNextPrev: {
        nextArrowSrc: 'assets/images/arrow_right.svg',
        prevArrowSrc: 'assets/images/arrow_left.svg',
      },

      isSundayHighlighted: {
        fontColor: '#ee88bf',
      },
    };
  }

  async fetchUserData() {
    let val = await this.storage.get('userID');
    this.userId = parseInt(val);
    this.loggedInUser = await this.storage.get('loggedInUser');
    let userData = await this.storage.get('userData');
    if (!!userData) {
      this.isGuestUser = userData.isGuest;
    }

    let userType = await this.storage.get('userType');
    this.userType = userType;
  }

  async setOrderUploadButton() {
    if (
      this._companyService.companyObj &&
      this._companyService.companyObj &&
      this._companyService.companyObj.config
    ) {
      let companyJson = this._companyService.companyObj.config;
      if (!!companyJson) {
        if (!!companyJson && companyJson.uploadOrderViaExcelSF) {
          this.allowUploadFromFile = companyJson.uploadOrderViaExcelSF;
        }
        if (!!companyJson.orderPageButton) {
          this.orderPageButton = companyJson.orderPageButton.filter(
            (a) => a.orderBook == this.title
          );
        }
        if (!!companyJson.hideStorePrice) {
          this.hideStorePrice = companyJson.hideStorePrice;
        }
        if (!!companyJson.showDealersOrderOnOrdersPage) {
          this.showDealersOrderOnOrdersPage =
            companyJson.showDealersOrderOnOrdersPage;
        }
        if (companyJson?.hideFooter) {
          this.hideFooter = companyJson?.hideFooter;
        }
        if (!!companyJson.export) {
          if (!!companyJson.export.searchResultColumns) {
            this.searchResultColumns = companyJson.export.searchResultColumns;
            let strText = this.colName.toUpperCase();
            this.totalSummary = [
              {
                fieldName: 'listOfOrderProducts',
                summaryType: 'sum',
              },
              {
                fieldName: 'totalOrderQty',
                summaryType: 'sum',
              },
              {
                fieldName: 'total',
                summaryType: 'sum',
              },
            ];

            this.resultColumns = [
              {
                fieldName: 'serialNumber',
                name: strText + ' NO.',
                type: 'string',
                orderBy: 1,
                redirectToOrderPage: true,
                fixed: true,
              },
              {
                fieldName: 'addedOn',
                name: 'DATE',
                type: 'date',
                orderBy: 2,
              },
              // {
              //   "fieldName": "serialNumber",
              //   "name": this.label + " Id",
              //   "type": "string",
              //   "orderBy": 3,
              //   "redirectToOrderPage": true
              // },
              // {
              //   "fieldName": "bookName",
              //   "name": this.label + " Type",
              //   "type": "string",
              //   "orderBy": 4,
              //   "redirectToOrderPage": true
              // },
              {
                fieldName: 'listOfOrderProducts',
                name: 'TOTAL PIECES',
                type: 'string',
                orderBy: 3,
              },
              {
                fieldName: 'totalOrderQty',
                name: 'TOTAL CARATS',
                type: 'number',
                orderBy: 4,
              },
              {
                fieldName: 'total',
                name: 'TOTAL PRICE',
                type: 'number',
                orderBy: 5,
              },
              {
                fieldName: 'orderStatus',
                name: 'TRANSACTION STATUS',
                type: 'number',
                orderBy: 6,
              },
            ];

            // if(this.orderBook == "Offer"){
            //   this.resultColumns.push({
            //     "fieldName": "bookName",
            //     "name": "",
            //     "type": "string",
            //     "showViewTemplate":true,
            //     "orderBy": 9,

            //   })
            // }
          }
        }
        this.quantityLabel = 'Total ' + this._configService.productName;
      }
    }
  }

  openOrder(event) {
    if (event.row.orderId) {
      let orderId = event.row.orderId;
      this.navCtrl.navigateForward(['/manage-order-details/' + orderId]);
    }
  }

  onSelect({ selected }) {
    // console.log("Select Event", selected, this.selected);
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  async ExcelProducts() {
    if (this.selected.length > 0) {
      for (let i = 0; i < this.selected.length; i++) {
        let bookName = this.selected[i]['bookName'];
        if (!bookName) {
          this.selected[i]['bookName'] = 'Order';
        }
      }

      let itemsFormatted = [];
      let hdrs: any = [
        { fieldName: 'addedOn', displayName: 'Date', orderby: 1 },
        {
          fieldName: 'serialNumber',
          displayName: 'Transaction Id',
          orderby: 2,
        },
        { fieldName: 'bookName', displayName: 'Transaction Type', orderby: 3 },
        {
          fieldName: 'listOfOrderProducts',
          displayName: 'Total Pieces',
          orderby: 4,
        },
        {
          fieldName: 'totalQuantity',
          displayName: this.quantityLabel,
          orderby: 5,
        },
        { fieldName: 'total', displayName: 'Total Price', orderby: 6 },
        {
          fieldName: 'orderStatus',
          displayName: 'Transaction Status',
          orderby: 7,
        },
      ];
      let temp2 = this.selected;

      let temp3 = hdrs.map((res) => res.fieldName);

      const keys_to_keep = temp3;
      const redux = (array) =>
        array.map((o) =>
          keys_to_keep.reduce((acc, curr) => {
            acc[curr] = o[curr];
            return acc;
          }, {})
        );
      let temp4 = redux(temp2);
      let c = [];
      temp4.map((key) => {
        let newObject = {};
        hdrs.map((res) => {
          newObject[res.displayName] = key[res.fieldName];
        });
        c.push(newObject);
      });

      this._configService.exportCSVFile(
        hdrs.map((res) => res.displayName),
        c,
        'Excel'
      );
      // temp2.map(a => {
      // 	let temp3 = {}; bhumi.patel2512@gmail.com
      // 	Object.keys(a).map((res) => {
      // 		let tmpSelected = hdrs.filter(a => a.fieldName == res);
      // 		if (tmpSelected.length > 0) {
      // 			temp3[res] = a[res];
      // 		}
      // 	})
      // 	itemsFormatted.push(temp3);
      // });
      // hdrs = hdrs.map(a=>a.displayName);
      // this._configService.exportCSVFile(hdrs, itemsFormatted, "Excel");
      this.selected = [];
    } else {
      this._configService.presentToast('Please select rows', 'error');
    }
  }

  async showGetEmailId() {
    if (this.selected.length > 0) {
      const alert = await this.alertController.create({
        header: 'Enter Email Id!',
        inputs: [
          {
            name: 'sendEmail',
            type: 'text',
            placeholder: 'Enter reciever email id',
          },
        ],
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
            text: 'Ok',
            handler: (val) => {
              this.EmailProducts(val.sendEmail);
              // console.log("Confirm Ok");
            },
          },
        ],
      });

      await alert.present();
    } else {
      this._configService.presentToast('Please select rows', 'error');
    }
  }
  dateComparator(a, b) {
    const getDateValue = (dateStr) => {
      const parts = dateStr.split('/');
      if (parts.length === 3) {
        return parseInt(parts[2] + parts[1] + parts[0]);
      }
      return NaN; // Invalid date format
    };

    const dateA = getDateValue(a);
    const dateB = getDateValue(b);

    if (!isNaN(dateA) && !isNaN(dateB)) {
      return dateA - dateB;
    }
    // Handle invalid or missing date formats
    return 0;
  }
  async EmailProducts(em) {
    if (this.selected.length > 0) {
      let selectedOrders = this.selected;
      selectedOrders = selectedOrders.map((a) => a.orderId);

      // console.log("selectedOrders ", selectedOrders);
      let res = await this.databaseServiceService.emailOrder(
        em,
        selectedOrders,
        this.orderBook
      );
      if (!!res.isSuccess) {
        // console.log("res", res);
        this.selected = [];
      } else {
        this._configService.presentToast('Some error occur', 'error');
      }
    } else {
      this._configService.presentToast('Please select records', 'error');
    }
  }

  async checkForOrderStatusBeforeDelete(ordersSelected) {
    let allowedStatus = ['Pending', 'abc'];

    let newData = ordersSelected.filter(
      (a) => allowedStatus.indexOf(a.orderStatus) == -1
    );
    if (newData.length > 0) return false;
    else return true;
  }
  async actionButtonClick(btn) {
    if (this.selected.length > 0) {
      let res1: any;
      switch (btn.name.toLowerCase()) {
        case 'remove offer':
        case 'remove appointment':
          for (let i = 0; i < this.selected.length; i++) {
            let res = await this.databaseServiceService.deleteOrder({
              orderId: this.selected[i].orderId,
            });
          }
          this.loadOrders();
          this.router.navigateByUrl('/orders/All?ob=Offer');
          break;
        // res1 = await this.checkForOrderStatusBeforeDelete(this.selected);
        // if (res1) {
        //   for (let i = 0; i < this.selected.length; i++) {
        //     let res = await this.databaseServiceService.deleteOrder({ orderId: this.selected[i].orderId });
        //   }
        //   this.loadOrders();
        // } else {
        //   this._configService.presentToast("To remove, status of all entries must be in pending state ", "error");
        // }
        // break;
        case 'cancel memo':
        case 'cancel order':
          await this.databaseServiceService.showLoading();
          res1 = await this.checkForOrderStatusBeforeDelete(this.selected);
          if (res1) {
            for (let i = 0; i < this.selected.length; i++) {
              let jsonObj = {
                orderId: parseInt(this.selected[i].orderId),
                refUserId: this.userId,
              };
              let res = await this.databaseServiceService.cancelAllOrderProduct(
                jsonObj
              );
              // console.log("res ", res);
              if (!!res && res.isSuccess) {
                this._configService.presentToast(res.data, 'success');
              }
            }
            await this.databaseServiceService.hideLoading();
            this.loadOrders();
          } else {
            await this.databaseServiceService.hideLoading();
            this._configService.presentToast(
              'To remove, status of all entries must be in pending state ',
              'error'
            );
          }
          break;
        case 'update appointment':
          if (this.selected.length == 1) {
            let stoneArray = [];
            let ticketNo = '';

            for (let i = 0; i < this.selected.length; i++) {
              ticketNo = this.selected[i].ticketNo;
            }
            this.userId = await this.storage.get('userID');
            await this.databaseServiceService.showLoading();
            let userData =
              await this._headerFooterService.fetchUserProfileDetails(
                this.userId
              );

            if (!!userData.data && userData.data) {
              let userMobile = userData.data.username;
              let response = await this.databaseServiceService.getTicket(
                ticketNo,
                userMobile
              );

              if (!!response.data) {
                let appointmentData = response.data;
                if (appointmentData.customJson) {
                  let typeId = appointmentData.customJson.nextProcess.typeId;
                  let frmdata = appointmentData.customJson.frmdata;
                  frmdata.form_response.hidden.refprocessid = ticketNo;
                  let processId = appointmentData.processId;
                  let processName = 'Schedule Viewing';
                  this.router.navigateByUrl(
                    '/ngx-form?processName=' +
                      processName +
                      '&frmdata=' +
                      JSON.stringify(frmdata) +
                      '&processId=' +
                      processId +
                      '&typeId=' +
                      typeId
                  );
                }
              }
            }
          } else {
            this._configService.presentToast(
              'Please select single appointment',
              'error'
            );
          }
          break;
        default:
          this._configService.presentToast('Action Not Valid', 'error');
          break;
      }
    } else {
      this._configService.presentToast('Please select record', 'error');
    }
  }

  nullSum() {
    return null;
  }

  totalSum(cells: any[]) {
    return formatNumber(
      cells.reduce((res, cell) => (res += cell)),
      'en-US',
      '1.2-2'
    );
  }

  async ionViewDidEnterCustom() {
    await this.fetchUserData();
    if (!this.isGuestUser) {
      this.loadOrders();
    } else {
      this.skeleton = false;
    }
    if (!!this.orderBook) this._configService.setTitle('My ' + this.orderBook);
    else this._configService.setTitle('My Orders');
  }

  async loadOrders() {
    //this.orders = null;
    this.selected = [];
    this.skeleton = true;
    this.orders = [];

    if (this._companyService.productListing == 'grid') {
      this.limit = 100;
      this.variant = false;
      this.shipment = false;
      this.images = false;
    }

    await this.databaseServiceService.showLoading();
    let dealerMobile = '';
    if (this.selectedSegment == 'For Me') dealerMobile = this.loggedInUser;
    let res = await this.databaseServiceService.getCustomerOrdersByPagination(
      this.userId,
      this.offset,
      this.limit,
      this.search,
      this.status,
      this.orderBook,
      this.variant,
      this.shipment,
      this.images,
      dealerMobile
    );
    await this.databaseServiceService.hideLoading();
    // console.log("res", res);

    // this.orders = res.data
    if (!!res.isSuccess) {
      let srNumber = 0;
      let arrays: any = res.data.map((single: any) => {
        srNumber++;
        single.srNumber = srNumber;
        single.listOfOrderProducts = single.listOfOrderProducts.length;
        single.totalQuantity = parseFloat(single.totalQuantity);
        single.bookName = single.bookName ? single.bookName : 'Order';
        single.addedOn =
          this._companyService.productListing == 'grid'
            ? format(new Date(single.addedOn), 'dd/MM/yyyy')
            : single.addedOn;
        return single;
      });

      console.log('\x1b[41m%s\x1b[0m', 'translated: ', this.translatedData);
      this.orders = [];
      if (this.languageChanged !== '' && this.languageChanged === 'en') {
        this.translateService.setLanguage('en');
        this.orders = arrays;
      } else if (this.languageChanged !== '' && this.languageChanged === 'pt') {
        this.translateService.setLanguage('pt');
        this.orders = arrays;
        const x = await this.translateData(this.orders);
        this.orders = x;
      }

      //refresh
      if (
        this.translator.getDefaultLang() === 'pt' &&
        this.languageChanged === ''
      ) {
        this.orders = arrays;
        let x = await this.translateData(this.orders);
        this.orders = x;
      } else if (
        this.translator.getDefaultLang() === 'en' &&
        this.languageChanged === ''
      ) {
        this.orders = arrays;
      }

      this.temp = [...this.orders];
      //      this.changeRef.detectChanges();
      this.skeleton = false;
      console.log('this.orders', this.orders);
      //this.countOrderDetails(this.orders);
    } else {
      this.skeleton = false;
      console.error(res.error);
    }
  }

  // refreshGridFn() {
  //   setTimeout(() => {
  //     this.refreshGrid = true;
  //     setTimeout(() => {
  //       this.refreshGrid = false;
  //     }, 500);
  //   }, 1000);
  // }

  async translateData(data: any[]): Promise<any[]> {
    const translatedData = [];
    for (const item of data) {
      const translatedOrderStatus = await this.translator
        .get(item.orderStatus)
        .toPromise();
      const translatedItem = {
        ...item,
        orderStatus: translatedOrderStatus,
      };
      translatedData.push(translatedItem);
    }

    return translatedData;
  }
  async doRefresh(refresher) {
    await this.fetchUserData();
    if (!this.isGuestUser) {
      await this.loadOrders();
    }
    if (!!refresher) {
      refresher.target.complete();
    }
  }

  clearFilter() {
    this.filter = false;
    this.searchObj = {};
    this.updateFilter({ target: { value: '' } }, null);
  }

  updateFilter(event, fieldName) {
    const val = event.target.value.toLowerCase();
    let searchObj = this.searchObj;
    if (Object.keys(searchObj).length == 0) {
      this.orders = this.temp;
    } else {
      let temp = this.temp;
      Object.keys(searchObj).filter((keys) => {
        if (!!searchObj[keys]) {
          if (keys.indexOf('from_date_') != -1) {
            temp = temp.filter(function (d) {
              return (
                differenceInDays(
                  new Date(
                    format(new Date(d[keys.substr(10, 7)]), 'dd/MM/yyyy')
                  ),
                  new Date(format(new Date(searchObj[keys]), 'dd/MM/yyyy'))
                ) >= 0
              );
            });
          } else if (keys.indexOf('to_date_') != -1) {
            temp = temp.filter(function (d) {
              return (
                differenceInDays(
                  new Date(
                    format(new Date(d[keys.substr(8, 7)]), 'dd/MM/yyyy')
                  ),
                  new Date(format(new Date(searchObj[keys]), 'dd/MM/yyyy'))
                ) <= 0
              );
            });
          } else {
            temp = temp.filter(function (d) {
              if (typeof d[keys] == 'number') {
                d[keys] = String(d[keys]);
              }
              return (
                !!d[keys] &&
                !d[keys].toLowerCase().indexOf(searchObj[keys].toLowerCase())
              );
            });
          }
        }
      });
      this.orders = temp;
      if (this.orders.length > 0) {
        this.filter = true;
      }
    }
    this.changeRef.detectChanges();
  }

  countOrderDetails(Orders) {
    Orders.map((res) => {
      let total = 0,
        totalOrderQty = 0,
        totalShipQty = 0,
        totalQuantity = 0;
      res.listOfOrderProducts.map((res1) => {
        // // console.log(res1.taxAblePrice)
        if (res1.totalDiscountPrice != 0) {
          // total += res1.totalDiscountPrice;
          if (!!res1.shipCost) {
            total += res1.priceWithShipCost;
            // console.log("discount + tax", total);
          } else if (res1.taxes != 0) {
            total += res1.taxAblePrice;
            // console.log("discount + tax", total);
          } else {
            // console.log("discount", total);
            total += res1.totalDiscountPrice;
          }
        } else {
          // total += res1.total;
          if (!!res1.shipCost) {
            total += res1.priceWithShipCost;
            // console.log("discount + tax", total);
          } else if (res1.taxes != 0) {
            total += res1.taxAblePrice;
            // console.log("tax", total);
          } else {
            total += res1.total;
            // console.log("Amount", total);
          }
        }
        // console.log(total);
        totalOrderQty += res1.quantity;
        totalShipQty += res1.shipment_quantity;
        totalQuantity += res1.quantity;
      });

      res.total = total;
      res.totalQuantity = totalQuantity;
      // console.log(total);
      this.changeRef.detectChanges();
      res.totalOrderQty = totalOrderQty;
      res.totalPendingQty = totalOrderQty - totalShipQty;
    });
  }

  async doInfiniteNewForNewOrder(infiniteScroll) {
    this.offset += 1;
    // console.log("infiniteScroll for new order", infiniteScroll);
    setTimeout(() => {
      this.loadDataWithScrollForNewOrder(infiniteScroll);
      infiniteScroll.target.complete();
    }, 500);
  }

  async loadDataWithScrollForNewOrder(infiniteScroll) {
    // console.log("offset,limit", this.offset, this.limit);

    if (this._companyService.productListing == 'grid') {
      this.limit = 100;
      this.variant = true;
      this.shipment = true;
      this.images = true;
    }

    let response =
      await this.databaseServiceService.getCustomerOrdersByPagination(
        this.userId,
        this.offset,
        this.limit,
        this.search,
        this.status,
        this.orderBook,
        this.variant,
        this.shipment,
        this.images
      );
    if (response && response.data) {
      let allData = response.data;
      if (!!response.isSuccess) {
        if (allData.length == 0) {
          infiniteScroll.target.disabled = true;
        } else {
          if (infiniteScroll) {
            Array.prototype.push.apply(this.orders, allData);
            infiniteScroll.target.complete();
            //await this.countOrderDetails(this.orders);
            // console.log("this.products2", this.orders);
          }
        }

        if (response.length == 1000) {
          infiniteScroll.target.disabled = true;
        }
      } else {
        // console.log("error", response.error);
      }
    }
  }

  addNewOrder() {
    this.router.navigate(['/new-order']);
  }

  async getOrderDetailById(orderId) {
    this.navCtrl.navigateForward(['/manage-order-details/' + orderId]);
    // this.router.navigate(['/manage-order-details']);
  }

  changeListener(event): void {
    this.selectedFile = <File>event.target.files[0];
    // console.log("file ", this.selectedFile);
    let extension = '';
    if (!!this.selectedFile) {
      extension =
        this.selectedFile.name.split('.')[
          this.selectedFile.name.split('.').length - 1
        ];
      // console.log("extension ", extension, this.selectedFile.name.split("."));
      if (!!extension && extension != 'xlsx' && extension != 'xls') {
        this._configService.presentToast('Please select excel file.', 'error');
        this.selectedFile = null;
      }
    }
  }

  async uploadOrders() {
    let validate = await this.validateControls();
    if (validate) {
      // console.log(this.selectedFile);
      const formData: FormData = new FormData();
      formData.append('file', this.selectedFile);
      // console.log("form data", formData);
      let res: any;

      let jsonObj: any = {
        fileFormatName: 'Order Upload',
        // userId: this.userId,
        formData: formData,
        shouldWait: false,
        shipmentMode: this.shipmentMode.id,
        paymentMode: this.paymentMode.id,
        addressId: this.addressId,
        referenceNo: this.referenceNo,
        userId: this.userId,
      };

      if (this.userType == 'User') {
        jsonObj.contactId = this.customerContactId.id;
      } else {
        jsonObj.contactId = this.userId;
        jsonObj.userId = this.userId;
      }

      // console.log("upload file json obj ", jsonObj);
      res = await this.databaseServiceService.uploadFileOrder(jsonObj);
      // console.log("res ", res);
      this.selectedFile = null;
      this.uploadOrdersViewChange();
    }
    // else {
    //   await this._configService.presentToast("Please select file to upload.","error");
    // }
  }

  async fetchCustomer() {
    if (!!this.searchText) {
      this.addressId = null;
      this.custName = '';
      let res = await this.databaseServiceService.fetchCustomerByPageination(
        this.offset,
        this.limit,
        this.searchText
      );
      // console.log("res", res);
      if (res.isSuccess) {
        this.customers = res;
        // console.log("customerAddressForUser", this.customers);
      }
    }
  }

  async fetchCustomerContact(customer) {
    // console.log("customer", customer);
    this.custName = customer.companyName;
    // console.log("custName", this.custName);
    let res = await this.databaseServiceService.fetchCustomerContact(
      customer.id
    );
    if (res.isSuccess) {
      this.customerContacts = res;
      if (this.customerContacts.data) {
        this.selectedCustomer = this.customerContacts.data[0];
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
    this.addressId = '';
    // this.userIdByCust = this.customerContactId.id;
    let res = await this.databaseServiceService.fetchAddress(
      this.customerContactId.id
    );
    if (res.isSuccess) {
      if (res.data.length > 0)
        this.customerAddress = res.data[0].listOfAddresses;
      else this.customerAddress = null;
      // this.customerAddressForUser = res;
      // if (!!this.customerAddressForUser.data && this.customerAddressForUser.data.length > 0 && this.customerAddressForUser.data[0].listOfAddresses.length > 0) {
      //   this.deliverAddress = this.customerAddressForUser.data[0].listOfAddresses[0];
      //   this.customerAddressForUser.data[0].listOfAddresses.forEach(addr => {
      //     addr.isSelected = false;
      //   });
      //   this.deliverAddress.isSelected = true;
      //   // if (!!this.shippingMethods) {
      //   //   await this.setShippingMethods();
      //   //   await this.shipModeSelected(this.shippingMethods[0]);
      //   }
      //   this.addressId = this.deliverAddress.id;
      //   // console.log("this.addressId ", this.addressId);
      //   // console.log("customerAddressForUser", this.customerAddressForUser, this.addressId);
      // }
    }
    // await this.getDiscount("User");
  }

  async uploadOrdersViewChange() {
    if (this.uploadOrderView) {
      this.uploadOrderView = false;
    } else {
      this.uploadOrderView = true;
    }
  }

  async getAllShippingMethod() {
    let res: any;

    res = await this.databaseServiceService.getAllShippingMethod('');
    if (res.status == 0) {
      // console.log("error");
    } else {
      this.allShippingMethods = res.data;
      this.shipmentMode = this.allShippingMethods[0];
      // console.log("getAllShippingMethod res", res, this.allShippingMethods);
    }
  }

  async fetchAddress() {
    let userType = await this.storage.get('userType');
    // console.log("userType ", userType, this.userId);
    if (userType == 'Customer') {
      if (this.userId) {
        let res = await this.databaseServiceService.fetchAddress(this.userId);
        if (!!res.isSuccess) {
          if (res.data.length > 0) {
            this.customerAddress = res.data[0].listOfAddresses;
            if (!!this.customerAddress && this.customerAddress.length > 0) {
              this.addressId = this.customerAddress[0].id;
              // this.customerAddress.forEach(addr => {
              //   addr.isSelected = false;
              // });
              // this.customerAddress[0].isSelected = true;
            }
          }
          // console.log("customerAddress", this.customerAddress);
        } else {
          // console.log(res.error);
          this._configService.presentToast(res.error, 'error');
        }
      }
    }
  }

  async validateControls() {
    if (
      !!this.addressId &&
      !!this.shipmentMode &&
      !!this.paymentMode &&
      !!this.selectedFile
    ) {
      return true;
    } else {
      if (!this.selectedFile) {
        await this._configService.presentToast(
          'Please select file to upload.',
          'error'
        );
        return false;
      } else if (!this.addressId) {
        await this._configService.presentToast(
          'Please select address.',
          'error'
        );
        return false;
      } else if (!this.shipmentMode) {
        await this._configService.presentToast(
          'Please select shipment mode.',
          'error'
        );
        return false;
      } else if (!this.paymentMode) {
        await this._configService.presentToast(
          'Please select payment mode.',
          'error'
        );
        return false;
      } else {
        await this._configService.presentToast(
          'Please select all fields.',
          'error'
        );
        return false;
      }
    }
  }
  async segmentChanged(ev: any) {
    this.orders = [];
    this.offset = 0;
    this.limit = 10;
    this.search = '';
    await this.loadOrders();
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      buttons: this.createSearchButtons(),
    });
    await actionSheet.present();
  }

  createSearchButtons() {
    let buttons = [];
    for (let btn of this.orderPageButton) {
      let button = {
        id: btn.id,
        text: btn.name,
        handler: () => {
          this.actionButtonClick(btn);
          return true;
        },
      };
      buttons.push(button);
    }
    let excelBtn = {
      id: -1,
      text: 'Download Excel',
      icon: 'reader',
      handler: () => {
        this.ExcelProducts();
        return true;
      },
    };
    buttons.push(excelBtn);
    let emailBtn = {
      id: -2,
      text: 'Email stones',
      icon: 'mail',
      handler: () => {
        this.showGetEmailId();
        return true;
      },
    };
    buttons.push(emailBtn);
    return buttons;
  }
  onLanguageChanged(e: any) {
    console.log('\x1b[41m%s\x1b[0m', 'onLanguageChanged : ', e);
    this.languageChanged = e.target.value;
    // window.location.reload();
    this.loadOrders();
  }
}
