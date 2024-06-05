import { Component, HostListener, OnInit } from '@angular/core';
import { DatabaseServiceService } from '../../service/database-service.service';
import {
  Platform,
  AlertController,
  ModalController,
  ActionSheetController,
} from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { ConfigServiceService } from '../../service/config-service.service';
import { Storage } from '@ionic/storage-angular';
import { Router, NavigationExtras } from '@angular/router';
import { formatNumber } from '@angular/common';
import { NavController } from '@ionic/angular';
import { CompanyService } from './../../service/company/company.service';
import { FunctionsService } from '../../service/cart/functions/functions.service';
import { NavigateService } from 'src/app/service/product/navigate.service';
import * as moment from 'moment';
import { CartActionsComponent } from '../../components/cart/cart-actions/cart-actions.component';

@Component({
  selector: 'app-manage-order-details',
  templateUrl: './manage-order-details.page.html',
  styleUrls: ['./manage-order-details.page.scss'],
})
export class ManageOrderDetailsPage implements OnInit {
  public productDetailPageList: any = [];
  public userId: any;
  public loggedInUser: any;
  public itemsFormatted: any = [];
  public bookName: any;
  public searchResultColumns: any = [];
  public searchResultExport: any = [];
  public selected: any = [];
  public orderId: any;
  public userData: any;
  public publicId: any;
  public addedOn: any;
  public status: any;
  public allowDeleting: boolean = true;
  public disableOffer: boolean = false;
  public orderDetails: any;
  public shipmentDetails: any;
  public pendingDetails: any;
  public remainStock: any;
  public orderTotal: any;
  public orderTotalTax = 0;
  public pendingOrderTotal: any;
  public onMobile: any;
  public totalwithouDiscount = 0;
  public totalDiscount = 0;
  public hideBackButton = false;
  public pendingInfo = true;
  public companyLogo: any;
  public showSkeleton = true;
  public loadData = false;
  public totalpriceWithShipCost = 0;
  public totalQuantity = 0;
  public AvgDiscountPrice = 0;
  public AvgUnitPrice = 0;
  public AvgDiscount = 0;
  public selectedCol = '';
  public listOffer: boolean = false;
  public listOfferActual: boolean = false;
  isIpad: boolean = false;
  public listOfferLoadedObject: any = {
    discount: 0,
    price: 0,
    amount: 0,
  };
  public shortCodes = [];
  public orderAndAddressDetails = {
    username: '',
    fullNameUser: '',
    serialNumber: '',
    paymentMode: '',
    house: '',
    area: '',
    city: '',
    pinCode: '',
    userPincode: '',
    state: '',
    country: '',
    fullName: '',
    phoneNo: '',
    orderStatus: '',
    referenceNo: '',
    clientRemark: '',
    shipmentType: '',
    pickuptime: '',
    collectiveValue: 0,
    memoDays: '',
    totalAmt: 0,
    paymentCharges: 0,
  };
  public orderPageButton: any = [];
  public List: any = {
    discount: 0,
    price: 0,
    amount: 0,
  };
  public paymentModeList = this._companyService.allPaymentDetails;
  public paymentMode: any = '';
  public hideStorePrice = false;
  public totalSummary = [];
  public hideFooter: boolean = false;
  public contentClass = '';
  public innerWidth: any;
  public mobileView: boolean = false;
  public webViewMobile: boolean = false;

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
    public _functionsService: FunctionsService,
    public _companyService: CompanyService,
    public _configService: ConfigServiceService,
    public _navigateService: NavigateService,
    private router: Router,
    public navCtrl: NavController,
    public alertController: AlertController,
    public databaseServiceService: DatabaseServiceService,
    private route: ActivatedRoute,
    public platform: Platform,
    public actionSheetController: ActionSheetController,
    public storage: Storage,
    public modalController: ModalController,
    private modalCtrl: ModalController
  ) {
    this.route.params.subscribe((params) => {
      if (!!params && params['hideBackButton'] != null)
        this.hideBackButton = params['hideBackButton'];
      if (!!params && params['pendingInfo'] != null)
        this.pendingInfo = params['pendingInfo'];
    });

    this.platform.ready().then(() => {
      let platforms = this.platform.platforms();
      console.log(platforms);
      if (this.platform.is('ipad')) {
        this.isIpad = true;
      }
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
  }

  async ngOnInit() {
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

  async ionViewDidEnter() {
    this._configService.setTitle('Orders Details');
    this.userId = await this.storage.get('userID');

    await this.loadCompanyData();
    this.userData = await this.storage.get('userData');
    this.orderId = this.route.snapshot.paramMap.get('id');
    this.publicId = this.route.snapshot.paramMap.get('publicId');
    console.log(
      'order id ',
      this.orderId,
      ' public id ',
      this.publicId,
      ' user id ',
      this.userId,
      !!this.orderId,
      !!this.publicId,
      !!this.orderId && !!this.userId
    );
    if (!!this.publicId || (!!this.orderId && !!this.userId)) {
      if (!!this.publicId) {
        // get order id from public id
        let res = await this.databaseServiceService.getOrderIdByPublicId(
          this.publicId
        );
        if (!!res.isSuccess && !!res.data && res.data.length > 0) {
          this.orderId = res.data[0].id;
        }
      }
      if (!!this.orderId) {
        await this.getOrderDetailByOrderId();
        this.getAllOrderDetailById();
        if (!this.publicId) {
          this.getAllShipDetailByOrderId();
          this.getPendingOrderDetailByOrderID();
        }
        await this.loadCompanyData();
      }
    } else {
      let toUrl = '';
      if (!!this.publicId) {
        toUrl = '/view-order-details/' + this.publicId;
      } else {
        toUrl = '/manage-order-details/' + this.orderId;
      }
      let navigationExtras: NavigationExtras = {
        queryParams: {
          to: toUrl,
        },
      };
      this.router.navigate(['/login-with-sign-up'], navigationExtras);
    }
  }

  async loadCompanyData() {
    if (this._companyService.companyObj.config) {
      let companyJson = this._companyService.companyObj.config;
      if (!!companyJson) {
      }
      if (!!companyJson.orderPageButton) {
        this.orderPageButton = companyJson.orderPageDetailButton.filter(
          (a) => a.orderBook == this.bookName
        );
      }
      if (!!companyJson.hideStorePrice) {
        this.hideStorePrice = companyJson.hideStorePrice;
      }

      if (companyJson.searchResultExport) {
        this.searchResultExport = companyJson.searchResultExport;
      }

      if (!!companyJson.shortCodes) {
        this.shortCodes = companyJson.shortCodes;
      }
      //this.searchResultExport
      if (!!companyJson.export) {
        if (!!companyJson.export.orderPageColumns) {
          if (this.bookName == 'Offer') {
            this.searchResultColumns =
              companyJson.export.manageOfferDetailPageColumns;
            this.totalSummary =
              companyJson.export.totalSummaryForManageOfferDetails;

            // if (this.mobileView) {
            //   let obj = {
            //     "fieldName": "View",
            //     "name": "View",
            //     "type": "string",
            //     "orderBy": 18,
            //     "allowDeleting": false,
            //     "showViewTemplate": true,
            //     "fixed": true
            //   }
            //   let isFound = this.searchResultColumns.find(x => x.fieldName == "View")
            //   if (!isFound) {
            //     this.searchResultColumns.push(obj)
            //   }
            // }
          } else {
            this.searchResultColumns =
              companyJson.export.manageOrderDetailPageColumns;
            this.totalSummary =
              companyJson.export.totalSummaryForManageOrderDetails;
          }

          if (this.mobileView) {
            if (this.bookName == 'Offer') {
              this.searchResultColumns = await this.searchResultColumns.map(
                (x) => {
                  if (x.name == 'Offer Disc') {
                    x.name = 'Discount';
                  }
                  if (x.name == 'Offer Price') {
                    x.name = 'Price';
                  }
                  if (x.name == 'Offer Amt') {
                    x.name = 'Amount';
                  }
                  return x;
                }
              );
            } else {
              this.searchResultColumns = await this.searchResultColumns.map(
                (x) => {
                  if (x.name == 'PURCHASE DISCOUNT') {
                    x.name = 'DISCOUNT';
                  }
                  if (x.name == 'PURCHASE PRICE') {
                    x.name = 'PRICE';
                  }
                  if (x.name == 'PURCHASE AMOUNT') {
                    x.name = 'AMOUNT';
                  }
                  return x;
                }
              );
              this.searchResultColumns = await this.searchResultColumns.filter(
                (x) => {
                  if (
                    x.name == 'STONE ID' ||
                    x.name == 'DISCOUNT' ||
                    x.name == 'PRICE' ||
                    x.name == 'AMOUNT'
                  ) {
                    return x;
                  }
                }
              );
            }

            this.searchResultColumns = await this.searchResultColumns.sort(
              (a, b) => {
                return a.mobileViewOrder - b.mobileViewOrder;
              }
            );
          }

          let checlRemarkArray = this.searchResultColumns.filter(
            (x) => x.fieldName == 'remark'
          );
          if (checlRemarkArray.length <= 0) {
            this.searchResultColumns.push({
              fieldName: 'remark',
              name: 'REMARK',
              type: 'string',
              orderBy: 8,
              allowDeleting: false,
              showRemarks: true,
            });
          }
        }
      }

      if (!!companyJson && companyJson?.hideFooter) {
        this.hideFooter = companyJson?.hideFooter;
      }
    }
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      buttons: this.createButtons(),
    });
    await actionSheet.present();
  }

  createButtons() {
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
    return buttons;
  }

  async viewOfferInputsFn(event) {
    console.log(event);
    let modal = await this.modalCtrl.create({
      component: CartActionsComponent,
      componentProps: {
        userId: this.userId,
        row: event.data,
        actionType: 'view offer',
        listOffer: this.listOffer,
        rowIndex: event.rowIndex,
      },
      showBackdrop: true,
    });
    modal.present();
    modal.onDidDismiss().then((res) => {
      if (res.data) {
        console.log(res.data);
        let index = res.data.rowIndex;
        let row = res.data.row;
        // row["discount"] = row[]
        this.orderDetails[index] = row;

        this.orderDetails[index]['discount'] = parseFloat(
          row['Req Discount']
        ).toFixed(2);
        this.orderDetails[index]['discountPrice'] = parseFloat(
          row['Req Price']
        ).toFixed(2);
        this.orderDetails[index]['priceWithShipCost'] = parseFloat(
          row['Amount']
        ).toFixed(2);
      }
    });
  }

  async getOrderDetailByOrderId() {
    this.selected = [];
    let res = await this.databaseServiceService.getOrderDetailByOrderId(
      this.orderId
    );

    if (!!res.isSuccess) {
      if (res.data.length == 0) {
        this._configService.presentToast('Order Cancelled', 'error');
      } else {
        this.bookName = res.data[0].bookName;
        this.orderAndAddressDetails = res.data[0];
      }
    } else {
      console.error('error', res.error);
    }
  }
  async getPendingOrderDetailByOrderID() {
    // // console.log(id)

    let res = await this.databaseServiceService.getPendingOrderDetailByOrderID(
      this.orderId
    );
    if (!!res.isSuccess) {
      this.pendingDetails = res.data;
      let total = 0;
      this.pendingDetails.forEach((order) => {
        if (order.totalDiscountPrice != 0) {
          total += order.totalDiscountPrice;
          this.totalwithouDiscount += order.total;
          this.totalDiscount += order.discount;
        } else {
          total += order.total;
        }
        order.cancelQty =
          order.quantity - order.shipment_quantity - order.cancelledQuantity;
      });
      this.pendingOrderTotal = total;
      // console.log("getPendingOrderDetailByOrderID", this.pendingDetails);
    } else {
      console.error('error', res.error);
    }
  }

  checkActions(allowedActions, selectedStones) {
    // console.log(selectedStones);
    if (!!allowedActions) {
      for (let i = 0; i < selectedStones.length; i++) {
        let externalStatus = this.selected[i].externalStatus;
        let index = allowedActions.findIndex((role) => role === externalStatus);
        if (index > -1) {
          // console.log("allowed");
        } else {
          return false;
        }
      }
      return true;
    } else {
      return true;
    }
  }

  async actionButtonClick(btn) {
    let res1: any;
    switch (btn.action.toLowerCase()) {
      case 'purchase':
        if (this.selected.length == 0) {
          this.selected = this.orderDetails.filter(
            (row) => !row.cancelledQuantity
          );
        }
        if (this.selected.length == 0) {
          this._configService.presentToast('Order Cancelled', 'error');
        } else {
          if (this.selected.length == 0) {
            this.selected = this.selected.filter(
              (row) => !row.cancelledQuantity
            );
          }
          let checkActions = this.checkActions(
            btn.allowedActions,
            this.selected
          );
          if (checkActions) {
            let orderBook = 'Temp';
            let selectedVariantObj = [];
            for (let i = 0; i < this.selected.length; i++) {
              selectedVariantObj.push({
                PvID: this.selected[i].refPvID,
                quantity: this.selected[i].quantity,
                discount: this.selected[i].listDiscount,
                taxes: 0,
                //price: resProd.data[0].RAPAPORT
              });
            }
            let userId = await this.storage.get('userID');
            // console.log("selectedVariantObj ", selectedVariantObj);
            let res1 = await this._functionsService.updateMultipleToCart(
              userId,
              'Temp-' + this.orderAndAddressDetails.referenceNo,
              selectedVariantObj,
              orderBook
            );
            if (!!res1.isSuccess) {
              let navigationExtras: NavigationExtras = {
                queryParams: {
                  view: 'address',
                  orderId: res1.data.id,
                  referenceNo:
                    'Temp-' + this.orderAndAddressDetails.referenceNo,
                },
              };
              this.router.navigate(['/manage-orders']);
            } else {
              this._configService.presentToast('Some Error Occur', 'error');
            }
          }
        }
        break;
      case 'update':
        if (
          this.listOffer &&
          (!this.List.discount || !this.List.price || !this.List.amount)
        ) {
          this._configService.presentToast('Enter Valid inputs', 'error');
          return;
        }
        if (this.selected.length == 0) {
          this.selected = this.orderDetails.filter(
            (row) => !row.cancelledQuantity
          );
        }
        if (this.selected.length == 0) {
          this._configService.presentToast('Order Cancelled', 'error');
        } else {
          if (this.selected.length == 0) {
            this.selected = this.selected.filter(
              (row) => !row.cancelledQuantity
            );
          }
          let extra: any = {
            paymentMode: this.paymentMode.name,
            termName: this.paymentMode.name,
          };
          let isListOffer = this.listOffer && this.listOfferActual;
          extra.isListOffer = isListOffer;
          extra.clientRemark = isListOffer;
          if (this.bookName == 'Offer') {
            this.selected = this.selected.map((res) => {
              res['discount'] = res['Req Discount'] || res['discount'];
              res['discountPrice'] = res['Req Price'] || res['discountPrice'];
              res['priceWithShipCost'] =
                res['Amount'] || res['priceWithShipCost'];
              return res;
            });
          }
          console.log(this.selected);
          let res = await this.databaseServiceService.updateOffer(
            parseInt(this.selected[0].refOrderId),
            this.selected,
            extra
          );
          if (!!res.isSuccess) {
            this._configService.presentToast(res.data, 'success');
            this.selected = [];
            this.getPendingOrderDetailByOrderID();
          } else {
            this._configService.presentToast(res.error, 'error');
          }
        }
        break;
      case 'remove':
        if (this.selected.length == 0) {
          this.selected = this.orderDetails.filter(
            (row) => !row.cancelledQuantity
          );
        }
        if (this.selected.length == 0) {
          this._configService.presentToast('Order Cancelled', 'error');
        } else {
          if (this.selected.length == 0) {
            this.selected = this.selected.filter(
              (row) => !row.cancelledQuantity
            );
          }
          this.selected.filter((row) => {
            this.cancelProductFromOrder(row);
          });
          // this._configService.presentToast("Order removed", "success");
        }

        break;
      default:
        this._configService.presentToast('Action Not Valid', 'error');
        break;
    }
  }

  async getData(cells: any[]) {
    //// console.log( cells[0])
    return 'Inline summary: ' + cells[0];
  }

  async ListOffer() {
    let SPMDiscountPercent = this.orderDetails.map((a) => a['discount']);
    let SPMDiscountPercentSum = Number(
      this.avg(SPMDiscountPercent).replace(',', '')
    );
    // console.log("percentageSum", SPMDiscountPercentSum);

    let SPMpercarat = this.productAvg(
      this.orderDetails,
      'cts',
      'discountPrice'
    );
    let SPMpercaratSum = Number(SPMpercarat.replace(',', ''));
    console.log('SPMpercaratSum', SPMpercaratSum);

    let SPM = this.orderDetails.map((a) => a['priceWithShipCost']);
    let SPMSum = Number(this.sum(SPM).replace(',', ''));
    // console.log("SPMSum", SPMSum);

    // if (!this.listOfferLoadedObject.discount) {
    //   this.listOfferLoadedObject = this.List
    // }

    this.List = {
      discount: SPMDiscountPercentSum,
      price: SPMpercaratSum,
      amount: SPMSum,
    };
    // console.log("this.List", this.List);
  }

  showDiscountError(event) {
    this._configService.presentToast(
      'Please keep offers within 5 Rap Points difference',
      'error'
    );
  }

  async updateListValue(type) {
    this.listOfferActual = true;
    let disc;
    if (this.List.discount && this.List.price && this.List.amount) {
      if (type == 'Price') {
        let SPMpercarat = this.productAvg(
          this.orderDetails,
          'cts',
          'RAPAPORTpercarat'
        );
        let SPMpercaratSum = Number(SPMpercarat.replace(',', ''));
        disc = (1 - parseFloat(this.List.price) / SPMpercaratSum) * 100;
        this.List.discount = disc;
        this.updateListValue('Disc');
      } else if (type == 'Amt') {
        let cts = this.orderDetails.map((a) => a['cts']);
        let CtsSum = Number(this.sum(cts).replace(',', ''));
        this.List.price = this.List.amount / CtsSum;
        this.updateListValue('Price');
      } else if (type == 'Disc') {
        if (
          !this.listOfferLoadedObject.discount ||
          this.List.discount <= this.listOfferLoadedObject.discount + 5
        ) {
          let kgDiscArray = [];
          for (let i = 0; i < this.orderDetails.length; i++) {
            let cts = parseFloat(this.orderDetails[i]['cts']);
            let rap = parseFloat(this.orderDetails[i]['RAPAPORTpercarat']);
            let disc = parseFloat(this.orderDetails[i]['discount']);
            let price = parseFloat(this.orderDetails[i]['discountPrice']);
            let amt = parseFloat(this.orderDetails[i]['priceWithShipCost']);
            let kgDisc = parseFloat(this.orderDetails[i]['listDiscount']);

            if (kgDisc) {
              kgDiscArray.push(kgDisc);
            }
            if (type == 'Disc') {
              disc = parseFloat(this.List.discount);
              price = rap - (rap * disc) / 100;
              amt = price * cts;
            }
            this.orderDetails[i]['discount'] = disc.toFixed(2);
            this.orderDetails[i]['discountPrice'] = price.toFixed(2);
            this.orderDetails[i]['priceWithShipCost'] = amt.toFixed(2);
          }
          const average: any =
            kgDiscArray.reduce((a, b) => a + b, 0) / kgDiscArray.length;
          if (!this.listOfferLoadedObject.discount) {
            this.listOfferLoadedObject.discount = parseFloat(
              average.toFixed(2)
            );
          }
          console.log(
            average,
            '--average',
            this.listOfferLoadedObject.discount
          );
          this.orderDetails = await this.orderDetails.splice(
            0,
            this.orderDetails.length
          );
          this.ListOffer();
        } else {
          this.List.discount = this.listOfferLoadedObject.discount;
          setTimeout(() => {
            this.List.discount = this.listOfferLoadedObject.discount;
          }, 100);
          this.updateListValue('Disc');
          this._configService.presentToast(
            'Please keep offers within 5 Rap Points difference',
            'error'
          );
        }
      }
    }
  }

  sum(cells) {
    cells = cells.filter((res) => !!res).map((res) => Number(res));
    if (cells.length > 0) {
      return formatNumber(
        cells.reduce((sum, cell) => (sum += cell)),
        'en-US',
        '1.2-2'
      );
    } else {
      return '0';
    }
  }

  avg(cells) {
    try {
      cells = cells.filter((res) => !!res).map((res) => Number(res));
      if (cells.length > 0) {
        return formatNumber(
          cells.reduce((sum, cell) => (sum += cell)) / cells.length,
          'en-US',
          '1.2-2'
        );
      } else {
        return '0';
      }
    } catch (e) {
      return '0';
    }
  }

  productAvg(a, b, c) {
    let total = a.map((single) => {
      if (!!single[b] && single[c]) {
        let i = single[b] * single[c];
        return i.toFixed(3);
      } else {
        return 0;
      }
    });

    let qty = a.map((single) => single[b]);
    let sumQty = Number(this.sum(qty).replace(',', ''));
    total = total.map((res) => Number(res));
    return formatNumber(
      total.reduce((sum, cell) => (sum += cell)) / sumQty,
      'en-US',
      '1.2-2'
    );
  }

  singleProduct(product) {
    console.log('product ', product);
    let name = '';
    if (!!product.productName)
      name = product.productName
        .replace(/\//g, '-')
        .replace(/\s+/g, '-')
        .toLowerCase();
    else name = product.stoneName;

    // console.log("name", name);

    //set next prev array
    this._navigateService.productDetailPageList = this.productDetailPageList;
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
      if (this.isIpad && !this.webViewMobile) {
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
        console.log(path[path.length - 2]);
        window.open(
          host.replace(
            path[path.length - 2] + '/' + path[path.length - 1],
            'products'
          ) +
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
  }

  async getAllOrderDetailById() {
    // // console.log(id)
    // console.log(this.bookName);
    let res = await this.databaseServiceService.getAllOrderDetailById(
      this.orderId
    );
    if (res) {
      this.showSkeleton = false;
    }

    if (!!res.isSuccess) {
      this.loadData = true;
      let orderDetails = res.data.data;

      console.log('orderDetails', this.orderDetails, 'res', res);
      if (orderDetails?.length > 0) {
        let aa = res.data.data;
        let i = 1;
        this.productDetailPageList = aa.map((a) => ({
          objectID: a.pId,
          index: i++,
          productName: !!a.title ? a.title : a.pId,
        }));

        this.status = orderDetails[0].orderStatus;
        if (this.status == 'Cancelled') {
          this.disableOffer = true;
          this.allowDeleting = false;
        }

        this.addedOn = orderDetails[0].addedOn;
        let total = 0;
        this.orderTotalTax = 0;
        let totalArry = [];
        orderDetails.forEach((order) => {
          if (order.priceWithShipCost != 0) {
            total += order.priceWithShipCost;
            // console.log("Discount ", total);
          } else if (order.taxAblePrice != 0) {
            total += order.taxAblePrice;
            // console.log("Discount", total);
          } else {
            total += order.total;
            // console.log("Amount", total);
          }
          if (order.taxPrice != 0) {
            // console.log("data.taxPrice ", order.taxPrice);
            this.orderTotalTax += order.taxPrice;
          }

          if (order['ShapeCode']) {
            let checkRoundl = order['ShapeCode'].indexOf('Round');
            let checkRoundU = order['ShapeCode'].indexOf('ROUND');
            if (checkRoundl < 0 && checkRoundU < 0) {
              order['CutCode'] = '';
            }
            if (order['CutCode']) {
              let cutObj = this.shortCodes.filter(
                (x) => x.label == order['CutCode']
              );
              if (cutObj.length > 0) {
                order['CutCode'] = cutObj[0].code;
              }
            }

            if (order['PolishCode']) {
              let cutObj = this.shortCodes.filter(
                (x) => x.label == order['PolishCode']
              );
              if (cutObj.length > 0) {
                order['PolishCode'] = cutObj[0].code;
              }
            }

            if (order['SymmetryCode']) {
              let cutObj = this.shortCodes.filter(
                (x) => x.label == order['SymmetryCode']
              );
              if (cutObj.length > 0) {
                order['SymmetryCode'] = cutObj[0].code;
              }
            }
          }
        });

        this.orderTotal =
          !!this.orderAndAddressDetails.totalAmt &&
          this.orderAndAddressDetails.totalAmt > 0
            ? this.orderAndAddressDetails.totalAmt
            : total;
        if (this.bookName == 'Offer') {
          // orderDetails = orderDetails.map(res => {
          //   res["Req Discount"] = res["discount"];
          //   res["Req Price"] = res["discountPrice"];
          //   res["Amount"] = res["priceWithShipCost"];
          //   return res;
          // });

          if (this.orderAndAddressDetails.clientRemark == 'true') {
            this.listOffer = true;
          }
          let paymentMode = this.paymentModeList.filter(
            (payment) => payment.name == this.orderAndAddressDetails.paymentMode
          );
          if (paymentMode.length > 0) {
            this.paymentMode = paymentMode[0];
          } else {
            this.paymentMode = this.paymentModeList[0];
          }
        }
        // console.log("this.orderTotal", this.orderTotal);
      }

      this.orderDetails = orderDetails;
      if (this.listOffer) {
        this.ListOffer();
        //this.updateListValue('Disc')
      }
      // console.log("getAllOrderDetailById", this.orderDetails);
    } else {
      console.error('error', res.error);
    }
  }
  async getAllShipDetailByOrderId() {
    // // console.log(id)
    await this.databaseServiceService.showLoading();
    let res = await this.databaseServiceService.getAllShipDetailByOrderId(
      this.orderId
    );
    await this.databaseServiceService.hideLoading();
    if (!!res.isSuccess) {
      this.shipmentDetails = res.data;
      // console.log("getAllShipDetailByOrderId", this.shipmentDetails);
      this.shipmentDetails.forEach((ship) => {
        ship.total = 0;
        ship.totalQty = 0;
        ship.listOfShipmentProducts.forEach((product) => {
          ship.total += product.price;
          ship.totalQty += product.quantity;
        });
      });
    } else {
      // console.error("error", res.error);
    }
  }

  findShipQty(listOfShipmentProducts, refPvID) {
    let qty = 0;
    if (!!listOfShipmentProducts && listOfShipmentProducts.length > 0) {
      listOfShipmentProducts.forEach((product) => {
        if (product.refPvID == refPvID) {
          // console.log("product ", product);
          qty = product.quantity;
        }
      });
      return qty;
    } else {
      return qty;
    }
  }

  findRemainQty(refPvID) {
    let remianingQty = 0;
    if (!!this.pendingDetails && this.pendingDetails.length > 0) {
      this.pendingDetails.forEach((pv) => {
        if (pv.refPvID == refPvID) {
          remianingQty = pv.quantity - pv.shipment_quantity;
        }
      });
    }
    return remianingQty;
  }

  async cancelProductFromOrder(item) {
    let userId = await this.storage.get('userID');
    let jsonObj = {
      orderProductId: item.id,
      cancelledQuantity: parseFloat(item.cts || item.quantity),
      refUserId: userId,
    };

    let res = await this.databaseServiceService.cancelOrderProduct(jsonObj);
    if (!!res && res.isSuccess) {
      await this._configService.presentToast(
        'Your order has been cancelled',
        'success'
      );
      this.router.navigateByUrl('/orders/All?ob=Offer');
      // await this.getOrderDetailByOrderId();
      // await this.getAllOrderDetailById();
      // await this.getAllShipDetailByOrderId();
      // await this.getPendingOrderDetailByOrderID();
    } else {
      await this._configService.presentToast(
        'Error in product delete',
        'error'
      );
    }
  }

  async cancelProduct(item) {
    // console.log("cancelProduct item ", item);
    if (item.cancelQty < 0) {
      await this._configService.presentToast(
        'Your cancelled quantity must be greater than 0',
        'error'
      );
      item.cancelQty = item.quantity - item.shipment_quantity;
    } else if (item.cancelQty > item.quantity - item.shipment_quantity) {
      await this._configService.presentToast(
        'Your cancelled quantity must be less than order quantity',
        'error'
      );
      item.cancelQty = item.quantity - item.shipment_quantity;
    } else {
      let alert = await this.alertController.create({
        // title: 'Confirm purchase',
        message:
          'Are you sure you want to cancel ' +
          item.cancelQty +
          ' pcs of ' +
          item.title +
          ' ?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              // console.log("Cancel clicked");
            },
          },
          {
            text: 'Ok',
            handler: () => {
              // console.log("Ok clicked");
              this.cancelOrderProduct(item);
            },
          },
        ],
      });
      alert.present();
    }
  }

  async cancelOrderProduct(item) {
    let userId = await this.storage.get('userID');
    let jsonObj = {
      orderProductId: item.id,
      cancelledQuantity: item.cancelQty,
      refUserId: userId,
    };
    // console.log("cancel order product ", jsonObj);
    let res = await this.databaseServiceService.cancelOrderProduct(jsonObj);
    // console.log("res ", res);
    if (!!res && res.isSuccess) {
      await this._configService.presentToast(
        'Your order has been cancelled',
        'success'
      );

      await this.getAllOrderDetailById();
      await this.getAllShipDetailByOrderId();
      await this.getPendingOrderDetailByOrderID();
      await this.getOrderDetailByOrderId();
    }
  }
  async confirmCancelAllProducts() {
    let alert = await this.alertController.create({
      // title: 'Confirm purchase',
      message: 'Are you sure you want to cancel all products ?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            // console.log("Cancel clicked");
          },
        },
        {
          text: 'Ok',
          handler: () => {
            // console.log("Ok clicked");
            this.cancelAllOrderProducts();
          },
        },
      ],
    });
    alert.present();
  }
  async cancelAllOrderProducts() {
    let userId = await this.storage.get('userID');
    let jsonObj = {
      orderId: parseInt(this.orderId),
      refUserId: userId,
    };
    let res = await this.databaseServiceService.cancelAllOrderProduct(jsonObj);
    // console.log("res ", res);
    if (!!res && res.isSuccess) {
      await this._configService.presentToast(
        'Your order has been cancelled',
        'success'
      );

      await this.getAllOrderDetailById();
      await this.getAllShipDetailByOrderId();
      await this.getPendingOrderDetailByOrderID();
      await this.getOrderDetailByOrderId();
    }
  }

  onSelect({ selected }) {
    // console.log("Select Event", selected, this.selected);
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  async showGetEmailId() {
    const alert = await this.alertController.create({
      header: 'Enter Email Details!',
      inputs: [
        {
          name: 'sendEmail',
          type: 'text',
          placeholder: 'Enter reciever email id',
          cssClass: 'emailText',
        },
        {
          name: 'Message',
          type: 'textarea',
          placeholder: 'Enter message',
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
          text: 'Send',
          handler: (val) => {
            this.EmailProducts(val.sendEmail, val.Message);
            // console.log("Confirm Ok");
          },
        },
      ],
    });

    await alert.present();
  }

  async EmailProducts(em, msg) {
    let res = await this.databaseServiceService.emailOrderDetails(
      em,
      this.orderId,
      msg,
      this.userData.id
    );
    if (!!res.isSuccess) {
      this._configService.presentToast('Mail sent Successfully.', 'success');
    } else {
      this._configService.presentToast('Some error occur', 'error');
    }
  }

  async ExcelProducts() {
    await this._configService.showLoading();
    this.loggedInUser = await this.storage.get('loggedInUser');
    if (!!this.loggedInUser) {
      if (this.selected.length > 0) {
        let temp2 = [];
        this.itemsFormatted = [];
        // this.selected.map((a, i) => {
        //   let temp3 = {};
        //   let sortedArray = []

        //   this.searchResultExport.forEach(e => {
        //     if (i == 0) {
        //       temp2.push(e.name)
        //     }
        //     temp3[e.name] = ""
        //     Object.keys(a).map(res => {
        //       if (res == e.fieldName) {
        //         if (e.fieldName == 'KeytoSymbolsCode') {
        //           let val = ""
        //           if (!!a[res]) {
        //             val = a[res].replace(/,/g, '/')
        //           }
        //           temp3[e.name] = val
        //         } else {
        //           temp3[e.name] = a[res] || ""
        //         }
        //       } else if (e.fieldName == 'Video') {
        //         let stoneName = a['stoneName']
        //         //let link = document.createElement('a');
        //         // link.textContent = 'video';
        //         // link.href = `https://stackg.azureedge.net/v360azurekg/V360_5_0/Vision360.html?d=${stoneName}`
        //         let url = `https://stackg.azureedge.net/v360azurekg/V360_5_0/Vision360.html?d=${stoneName}`;
        //         //let link = "<a href='"+url+"'>Video</a>";
        //         temp3[e.name] = "=HYPERLINK(\"" + url + "\",\"Video\")"
        //       } else if (e.fieldName == 'Amt') {
        //         if (a['Rapnet_pluspercarat'] && a['cts']) {
        //           let amt = a['Rapnet_pluspercarat'] * a['cts']
        //           temp3[e.name] = amt
        //         } else {
        //           temp3[e.name] = ""
        //         }
        //       } else if (e.fieldName == 'RapAmt') {
        //         if (a['RAPAPORTpercarat'] && a['cts']) {
        //           let rapAmt = a['RAPAPORTpercarat'] * a['cts']
        //           temp3[e.name] = rapAmt
        //         } else {
        //           temp3[e.name] = ""
        //         }
        //       } else if (e.fieldName == "ReportNo") {
        //         let ReportNo = a['ReportNo'] || '';
        //         let lab = a['lab'] || '';
        //         if (ReportNo && lab) {
        //           let url = `https://dia-img.kgirdharlal.com/lab.aspx?lab=${lab}&reportid=${ReportNo}`
        //           temp3[e.name] = "=HYPERLINK(\"" + url + "\",\"Certificate\")"
        //         } else {
        //           temp3[e.name] = ReportNo
        //         }
        //       }
        //     });
        //   });
        //   this.itemsFormatted.push(temp3);
        // });

        for await (let [i, a] of this.selected.entries()) {
          let temp3 = {};

          for await (let e of this.searchResultExport) {
            if (i == 0) {
              temp2.push(e.name);
            }
            temp3[e.name] = '';
            Object.keys(a).map((res) => {
              if (res == e.fieldName) {
                if (e.fieldName == 'KeytoSymbolsCode') {
                  let val = '';
                  if (!!a[res]) {
                    val = a[res].replace(/,/g, '/');
                  }
                  temp3[e.name] = val;
                } else {
                  temp3[e.name] = a[res] || '';
                }
              } else if (e.fieldName == 'stoneName') {
                let stoneName = a['stoneName'];
                //let link = document.createElement('a');
                // link.textContent = 'video';
                // link.href = `https://stackg.azureedge.net/v360azurekg/V360_5_0/Vision360.html?d=${stoneName}`
                //let url = `https://stackg.azureedge.net/v360azurekg/V360_5_0/Vision360.html?d=${stoneName}`;
                //let link = "<a href='"+url+"'>Video</a>";
                //temp3[e.name] = "=HYPERLINK(\"" + url + "\",\"Video\")"
                //ws[cell] = {f: '=HYPERLINK("' + item.v.toString() + '","link text")'};
                //temp3[e.name] = {f: '=HYPERLINK("' + url.toString() + '","'+stoneName+'")', s: { font: { color: { rgb: '0563C1' }, underline: true } }};
                temp3[e.name] = stoneName;
              } else if (e.fieldName == 'Rapnet_pluspercarat') {
                temp3[e.name] = a['Rapnet_pluspercarat']
                  ? a['Rapnet_pluspercarat'].toFixed(2)
                  : 0;
              } else if (e.fieldName == 'Amt') {
                if (a['Rapnet_pluspercarat'] && a['cts']) {
                  let amt = a['Rapnet_pluspercarat'] * a['cts'];
                  temp3[e.name] = amt ? amt.toFixed(2) : 0;
                } else {
                  temp3[e.name] = '';
                }
              } else if (e.fieldName == 'RapAmt') {
                if (a['RAPAPORTpercarat'] && a['cts']) {
                  let rapAmt = a['RAPAPORTpercarat'] * a['cts'];
                  temp3[e.name] = rapAmt ? rapAmt.toFixed(2) : 0;
                } else {
                  temp3[e.name] = '';
                }
              } else if (e.fieldName == 'ReportNo') {
                let ReportNo = a['ReportNo'] || '';
                let lab = a['lab'] || '';
                if (ReportNo && lab) {
                  //let url = `https://dia-img.kgirdharlal.com/lab.aspx?lab=${lab}&reportid=${ReportNo}`
                  // temp3[e.name] = "=HYPERLINK(\"" + url + "\",\"Certificate\")"
                  //temp3[e.name] =
                  // {f: '=HYPERLINK("' + url.toString() + '","'+ReportNo+'")', , s: { font: { color: { rgb: '0563C1' }, underline: true } }: { font: { color: { rgb: '0563C1' }, underline: true } }};
                  // temp3[e.name] = { Target: 'http://www.google.com', Tooltip: "Certificate" };
                  temp3[e.name] = ReportNo.toString();
                } else {
                  temp3[e.name] = ReportNo.toString();
                }
              } else if (e.fieldName == 'ShapeCode') {
                let shape = a['standardShapeCode']
                  ? a['standardShapeCode']
                  : a['ShapeCode'];
                temp3[e.name] = shape;
              }
            });
          }
          this.itemsFormatted.push(temp3);
        }
        //console.log("excel products ", this.itemsFormatted, " temp ", temp2, " searchresultcolumns ", this.searchResultExport);
        let fileName = moment().format('YYYY-MM-DD');
        await this._configService.exportAsExcelFile(
          this.itemsFormatted,
          fileName
        );
        //  this.refreshGrid = true;
        //this.refreshMobileGrid = true;
        this.selected = [];
        await this._configService.hideLoading();
      } else {
        await this._configService.hideLoading();
        this._configService.presentToast('Please select stones', 'error');
      }
    } else {
      await this._configService.hideLoading();
      this._configService.presentToast('Please Login', 'error');
    }
  }

  equals(variable, value) {
    return variable == value;
  }

  trackShipment(shipment) {
    if (!!shipment.trackingNo && !!shipment.courierDetails.link) {
      // shipment.trackingNo = 20204200216325;
      // var form = document.createElement("form");
      // form.setAttribute("method", "post");
      // form.setAttribute("action", shipment.courierDetails.link);
      // form.setAttribute("target", "view");
      // var hiddenField = document.createElement("input");
      // hiddenField.setAttribute("type", "hidden");
      // hiddenField.setAttribute("name", "trackyourshipment");
      // hiddenField.setAttribute("value", shipment.trackingNo);
      // form.appendChild(hiddenField);
      // document.body.appendChild(form);
      // window.open('', 'view');
      // form.submit();
      window.open(shipment.courierDetails.link, '_blank');
    }
  }

  omit_special_char(event) {
    var k;
    k = event.charCode; //         k = event.keyCode;  (Both can be used)
    //return ((k > 64 && k < 91) || (k > 96 && k < 109) || (k > 109 && k < 123) || k == 8 || k == 110 || k == 13 || k == 32 || (k >= 48 && k <= 57));
    return (
      (k > 64 && k < 91) ||
      (k > 96 && k < 123) ||
      k == 8 ||
      k == 110 ||
      k == 13 ||
      k == 32 ||
      (k >= 48 && k <= 57) ||
      k != 45 ||
      k == 46
    );
  }
}
