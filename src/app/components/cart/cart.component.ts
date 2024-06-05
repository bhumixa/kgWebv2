import {
  Component,
  OnInit,
  Input,
  OnChanges,
  HostListener,
  ViewChild,
  SimpleChanges,
} from '@angular/core';
import {
  NavController,
  ModalController,
  IonToolbar,
  Platform,
  ActionSheetController,
} from '@ionic/angular';
import { MenuController } from '@ionic/angular';
import { ConfigServiceService } from '../../service/config-service.service';
import { HeaderFooterService } from '../../service/headerFooter/header-footer.service';
import { Router, NavigationExtras } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { AlertController } from '@ionic/angular';
import { formatNumber } from '@angular/common';
import { CompanyService } from '../../service/company/company.service';
import { ActionsService } from '../../service/cart/actions/actions.service';
import { FunctionsService } from '../../service/cart/functions/functions.service';
import { OpenCartService } from '../../service/observable/open-cart/open-cart.service';
import { CartChangedService } from '../../service/observable/cart-changed/cart-changed.service';
import { CloseCartService } from '../../service/observable/close-cart/close-cart.service';
import { ShowIdService } from '../../service/observable/show-id/show-id.service';
import { OrderDetailsService } from '../../service/observable/order-details/order-details.service';
import { CartActionsComponent } from './cart-actions/cart-actions.component';
import { NavigateService } from '../../service/product/navigate.service';
import { DatabaseServiceService } from 'src/app/service/database-service.service';
import { AnalyticsService } from 'src/app/service/analytics.service';
import * as moment from 'moment';
import { SavedService } from 'src/app/service/cart/saved/saved.service';
import {
  DxDataGridComponent,
  TotalSelectedSummary,
} from '../dx-data-grid/dx-data-grid.component';
import { BookAppointmentComponent } from '../book-appointment/book-appointment.component';
import { PreviewAnyFile } from '@ionic-native/preview-any-file/ngx';
import { ExcelSheetData } from 'src/app/service/excelSheetData/excelSheetData.service';
import { MixPanelDataService } from 'src/app/service/mixpanel/mixpanelData.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit, OnChanges {
  @ViewChild(DxDataGridComponent) dxDataGridComp: any;

  @Input() view: any;
  @Input() refresh: boolean = false;
  @Input() parameters = false;
  allowDeleting: boolean = true;
  details: boolean = true;
  defaultSelected: number = 0;
  @Input() orderBook: any;
  public refreshGrid = false;
  public refreshMobileGrid = false;
  isStoneSelected = false;
  userEmail = '';
  totalNumOfStones = 0;

  public productDetailPageList = [];
  public cartPageButton = [];
  public cartPageButtonAllButons = [];
  public cartData: any;
  public total: number = 0;
  public customerAddress: any;
  public userId: any;
  public userData: any;
  public loggedInUser: any;
  public sessionID: any;
  public userType: any;
  public page = 1;
  public onMobile: any = false;
  public cartQuantity: number = 0;
  public imageURL: any;
  public companyLogo: any;
  public totalTax = 0;
  public appName: any;
  public mobileWeb = false;
  public skip = 0;
  public limit = 10;
  public companyJson = {
    homePageHeaderLinks: [],
  };
  public showHideMenuButton = false;
  public cartId: any;
  public searchText = '';
  public quantities: any = [];
  public showSchemes = true;
  public ShowDispatches = true;
  public selectedCartAction: any;
  public ShowCartPage: any;
  public showActionButton = true;
  public searchResultColumnsForCart: any = [];
  public searchResultExport = [];
  public mobileColumns = [];
  public desktopColumns = [];
  public totalSummary = [];
  public selected: any = [];
  public itemsFormatted = [];
  public orderBookName = '';
  public offerObj = [];
  public paymentModeList = this._companyService.allPaymentDetails;
  public paymentMode = this.paymentModeList[0];
  public kgPricing: any;
  public shortCodes = [];
  public colSize = 10;
  public goBtncolSize = 2;
  public selectedCol = '';
  public checkKYC = false;
  public showSkeleton = true;
  public loadCart = false;
  public showId: any;
  public List = {
    discount: 0,
    price: 0,
    amount: 0,
  };
  public listOffer = false;
  public listOfferActual = false;
  public listOfferLoadedObject = {
    discount: 0,
    price: 0,
    amount: 0,
  };
  public hideStorePrice = false;
  public pauseOrders = false;
  public pauseOrderMessage = '';
  public inspectionView = false;
  public allViewActions = this._companyService.allActions;
  public contentClass = '';
  public innerWidth: any;
  public mobileView = false;
  public webViewMobile = false;
  public hideClearSelection = true;
  public profileData: any;
  public salesPersonEmail: any;
  isIpad = false;
  totalSelectedSummary: TotalSelectedSummary = {
    cts: 0,
    pcs: 0,
    amount: 0,
    rapValue: 0,
  };
  mode = 'multiple';
  public subTotal = 0;
  private cartCount = 0;

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
    private previewAnyFile: PreviewAnyFile,
    public _savedService: SavedService,
    public _actionsService: ActionsService,
    public _companyService: CompanyService,
    public _headerFooterService: HeaderFooterService,
    public _openCartService: OpenCartService,
    public _cartChangedService: CartChangedService,
    public _showIdService: ShowIdService,
    public navCtrl: NavController,
    public _configService: ConfigServiceService,
    public _closeCartService: CloseCartService,
    public _orderDetailsService: OrderDetailsService,
    public storage: Storage,
    public _functionsService: FunctionsService,
    private router: Router,
    private menu: MenuController,
    public alertController: AlertController,
    public modalController: ModalController,
    private modalCtrl: ModalController,
    public platform: Platform,
    public actionSheetController: ActionSheetController,
    public _navigateService: NavigateService,
    public databaseServiceService: DatabaseServiceService,
    public analyticsService: AnalyticsService,
    private excelSheetData: ExcelSheetData,
    public mixPanelDataService: MixPanelDataService
  ) {
    this._openCartService.observable().subscribe((data) => {
      this.loadData();
    });
    this._showIdService.observable().subscribe((data) => {
      this.showId = data;
    });

    this.checkDevice();
  }

  checkDevice() {
    this.platform.ready().then(() => {
      let platforms = this.platform.platforms();
      //this.platform.is('ipad');
      if (this.platform.is('ipad')) {
        this.isIpad = true;
      }
      console.log(platforms);
      console.log(this.platform.is('android'), 'android');
      console.log(this.platform.is('desktop'), 'desktop');
      console.log(this.platform.is('mobileweb'), 'mobileweb');
      const screenWidth = this.platform.width();
      // console.log("this.platform", this.platform);
      if (this.platform.is('desktop') || this.platform.is('ipad')) {
        this.onMobile = false;
        this.webViewMobile = false;
      } else if (
        (this.platform.is('ios') || this.platform.is('android')) &&
        !this.platform.is('mobileweb') &&
        !this.platform.url().startsWith('http')
      ) {
        this.onMobile = true;
        this.webViewMobile = false;
      } else if (this.platform.is('mobileweb')) {
        this.onMobile = false;
        this.webViewMobile = true;
      } else {
        this.onMobile = false;
        this.webViewMobile = false;
      }

      console.log(this.onMobile);
      this.webViewMobile = !this.platform.is('cordova');
      console.log('this.webViewMobile', this.webViewMobile);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    try {
      // if (!!changes.orderBook.currentValue) {
      this.ngOnInit();
      // }
    } catch (e) {}
  }

  async ngOnInit() {
    this.inspectionView = false;
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
    this.cartData = null;
    this.selected = [];
    if (this.view == 'page') {
      this.colSize = 2;
      this.goBtncolSize = 2;
    } else {
      this.goBtncolSize = 12;
    }

    this.checkDevice();
    // if (this.platform.is('desktop')) {
    //   this.onMobile = false;
    // } else {
    //   this.onMobile = true;
    // }
    await this.loadCompanyData();

    await this.loadData();

    if (this._companyService.companyObj.config) {
      let companyJson = this._companyService.companyObj.config;
      if (!!companyJson) {
        if (!!companyJson.KYCrequired) {
          this.checkKYC = companyJson.KYCrequired;
        }
        if (!!companyJson.hideStorePrice) {
          this.hideStorePrice = companyJson.hideStorePrice;
        }
      }
    }

    this.cartCount = this._headerFooterService.getCartTotal;
  }

  refeshDataGridValueChange() {
    setTimeout(() => {
      this.refreshGrid = false;
      this.refreshMobileGrid = false;
    }, 100);
  }

  async checkForKYC(btn: any) {
    return true;
  }

  async loadInspectView() {
    if (!this.inspectionView) {
      this.cartPageButton = this.cartPageButtonAllButons.filter(
        (x: any) => x.name != 'List View'
      );
    } else {
      this.cartPageButton = this.cartPageButtonAllButons.filter(
        (x: any) => x.name != 'Virtual Inspection'
      );
    }
  }

  async loadCompanyData() {
    if (this._companyService.companyObj && this._companyService.companyObj) {
      this.companyLogo = this._companyService.companyObj.companyLogo;
      this.pauseOrders = this._companyService.companyObj.pauseOrders;
      this.pauseOrderMessage =
        this._companyService.companyObj.pauseOrderMessage;

      if (this._companyService.companyObj.config) {
        let companyJson = this._companyService.companyObj.config;
        if (!!companyJson) {
          if (typeof companyJson.ShowCartPage) {
            this.ShowCartPage = companyJson.ShowCartPage;
          }

          if (!!companyJson.externalProduct) {
            this.kgPricing = companyJson.externalProduct;
          }

          if (!!companyJson.cartPageButton && !this.orderBook) {
            this.cartPageButtonAllButons = companyJson.cartPageButton;
            this.loadInspectView();
          }

          if (!!companyJson.cartOfferButton && this.orderBook == 'Offer') {
            this.cartPageButton = companyJson.cartOfferButton;
          }

          if (!!companyJson.shortCodes) {
            this.shortCodes = companyJson.shortCodes;
          }

          if (!!companyJson.export) {
            if (!!companyJson.searchResultExport) {
              this.searchResultExport = companyJson.searchResultExport;
            }

            if (!!companyJson.export.searchResultMobileColumns) {
              this.mobileColumns = companyJson.export.searchResultMobileColumns;
            }

            if (!!companyJson.export.searchResultColumns) {
              if (this.orderBook == 'Offer') {
                this.searchResultColumnsForCart =
                  companyJson.export.offerPageColumns;
                console.log(this.searchResultColumnsForCart);
                this.searchResultColumnsForCart =
                  this.searchResultColumnsForCart.filter((x: any) => {
                    let i: any = x.name.indexOf('KG Counter Offer');
                    if (i < 0) {
                      return x;
                    }
                  });

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
                //   let isFound = this.searchResultColumnsForCart.find(x => x.fieldName == "View")
                //   if (!isFound) {
                //     this.searchResultColumnsForCart.push(obj)
                //   }
                // }

                this.totalSummary = companyJson.export.totalSummary;
              } else {
                this.searchResultColumnsForCart =
                  companyJson.export.searchResultColumns;
                this.totalSummary = [];
                this.desktopColumns = companyJson.export.searchResultColumns;
              }

              if (this.mobileView) {
                if (this.orderBook == 'Offer') {
                  this.searchResultColumnsForCart =
                    this.searchResultColumnsForCart.map((x: any) => {
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
                    });
                }

                // this.searchResultColumnsForCart = this.searchResultColumnsForCart.filter(x => {
                //   if (x.name == 'Stone ID' || x.name == 'Rap' || x.name == 'Discount'|| x.name == 'Price'|| x.name == 'Amount') {
                //     return x
                //   }
                // })
                // this.searchResultColumnsForCart = this.searchResultColumnsForCart.sort((a, b) => {
                //   return a.mobileViewOrder - b.mobileViewOrder;
                // });
                this.searchResultColumnsForCart = this.mobileColumns;

                // let obj = {
                //   "fieldName": this.kgPricing.kgAppliedAmount,
                //   "name": "Amount",
                //   "type": "number",
                //   "allowDeleting": true,
                //   "orderBy": 13,
                //   "mobileViewOrder": 5
                // }
                // let isFound = this.searchResultColumnsForCart.find(x => x.name == "Amount")
                // if (!isFound) {
                //   this.searchResultColumnsForCart.push(obj)
                // }
              }

              //this.totalSummary = this.totalSummary.filter(x => x.fieldName != 'SPM')
              // if (this.fixedCol) {
              //   this.searchResultColumnsForCart = this.searchResultColumnsForCart.map(col => {
              //     if(col.fieldName == '')
              //   })
              // }
            }
          }

          if (typeof companyJson.showActionButton != 'undefined') {
            this.showActionButton = companyJson.showActionButton;
          }
        }
      }
    }
    // console.log("load company data ", this._companyService.companyObj, this.pauseOrders, this.pauseOrderMessage);
  }

  onSelect() {
    // console.log("Select Event", selected, this.selected);
    //this.selected.splice(0, this.selected.length);
    // this.selected.push(...selected);
  }

  // async ionViewDidEnter() {
  //   await this.loadData();
  // }

  async clearSearch(e: any) {
    this.searchText = '';

    this.loadData();
  }

  closeCart() {
    if (this.ShowCartPage) {
      this.router.navigateByUrl('/home');
    } else {
      this.menu.close('cart');
    }
    this._closeCartService.observables.next();
    this.searchText = '';
  }

  async submitSearch() {
    this.loadData();
  }

  async incrementQuantity(item: any) {
    this.showSkeleton = false;
    // console.log("item", item);
    item['show'] = true;
    this.loadCart = false;

    let res: any = await this._functionsService.updateCartQtyDetails(
      item.refCartID,
      item.refPvID,
      ++item.quantity,
      item.refCartProductId
    );

    if (!!res.isSuccess) {
      // alert('from in')
      let data = {
        type: 'increment',
        data: item,
      };
      this._cartChangedService.observables.next(data);
      //await this.updateCartCount()
      //await this.loadData();
    }
  }

  hideCardView(item: any) {
    item['show'] = false;
  }

  showCardView(item: any) {
    // if (this.visibleIndex === ind) {
    //   this.visibleIndex = -1;
    // } else {
    //   this.visibleIndex = ind;
    // }
    this.showId = item.id;
    // console.log(this.showId);
    item['show'] = true;
  }

  async removeCartProduct(item: any) {
    let sessionId = await this.storage.get('sessionID');
    let userId = await this.storage.get('userID');

    let res: any = await this._functionsService.removeCartProduct(
      item.refCartID,
      item.refCartProductId || item.id,
      sessionId,
      userId
    );
    if (!!res.isSuccess) {
      if (this.orderBook == 'Offer') {
        this._configService.presentToast(
          'Product removed from Offer successfully',
          'success'
        );
      } else {
        this._configService.presentToast(
          'Product removed from cart successfully',
          'success'
        );
      }

      let data = {
        type: 'remove',
        data: item,
      };
      this._cartChangedService.observables.next(data);
      await this.loadData();
      this.selected = [];
    }
  }

  async checkActions(allowedActions: any, selectedStones: any) {
    if (!!allowedActions) {
      for (let i = 0; i < selectedStones.length; i++) {
        let externalStatus = this.selected[i].externalStatus;
        let index = allowedActions.findIndex(
          (role: any) => role === externalStatus
        );
        if (index > -1) {
        } else {
          return false;
        }
      }
      return true;
    } else {
      return true;
    }
  }

  async decrementQuantity(item: any) {
    this.showSkeleton = false;
    // console.log("item", item);
    item['show'] = true;
    this.loadCart = false;
    if (item.quantity != 0) {
      let res = await this._functionsService.updateCartQtyDetails(
        item.refCartID,
        item.refPvID,
        --item.quantity,
        item.refCartProductId
      );
      if (!!res) {
        let data = {
          type: 'decrement',
          data: item,
        };
        this._cartChangedService.observables.next(data);
      }
    }
    if (item.quantity == 0) {
      this.removeCartProduct(item);
    }
  }

  async ExcelCart() {
    this.cartId = this.cartData.data.products[0].refCartID;
    let urlToPass = '';
    if (
      !this.onMobile &&
      window &&
      'location' in window &&
      'protocol' in window.location &&
      'pathname' in window.location &&
      'host' in window.location
    ) {
      urlToPass = window.location.origin;
    } else {
      urlToPass = 'App';
      //how to send url if there is App
    }
    let res: any = await this._actionsService.exportCartExcel(
      this.cartId,
      urlToPass
    );
    if (res.isSuccess) {
      let headers: any = [];
      Object.keys(res.data[0]).forEach((header) => {
        headers.push(header);
      });
      this._configService.exportCSVFile(headers, res.data, 'Email.csv');
      // call the exportCSVFile() function to process the JSON and trigger the download

      //this._configService.presentToast("Mail sent to given email id", "sucess");
      //download res.data (eg : /tmp/talkbrite/resources/1/cartExport/52302.csv)
    } else {
      this._configService.presentToast('Error in sending mail', 'error');
    }
  }

  setFilteredLocations(ev: any) {
    let val = ev.target.value;

    if (val && val.trim() !== '') {
      return this.cartData.data.products.filterLocations(val);
    }
  }

  offerValueUpdate(bool: any) {
    this.listOffer = false;
    this.listOfferActual = false;
    this.ListOffer();
  }

  showDiscountError(event: any) {
    this._configService.presentToast(
      'Please keep offers within 5 Rap Points difference',
      'error'
    );
  }

  sum(cells: any) {
    cells = cells.filter((res: any) => !!res).map((res) => Number(res));
    if (cells.length > 0) {
      return formatNumber(
        cells.reduce((sum: any, cell: any) => (sum += cell)),
        'en-US',
        '1.2-2'
      );
    } else {
      return '0';
    }
  }

  avg(cells: any) {
    try {
      cells = cells.filter((res: any) => !!res).map((res: any) => Number(res));
      if (cells.length > 0) {
        return formatNumber(
          cells.reduce((sum: any, cell: any) => (sum += cell)) / cells.length,
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

  productAvg(a: any, b: any, c: any) {
    let total = a.map((single: any) => {
      if (!!single[b] && single[c]) {
        let i = single[b] * single[c];
        return Math.round(i * 1000) / 1000;
      } else {
        return 0;
      }
    });
    console.log(total);
    let qty = a.map((single: any) => single[b]);
    let sumQty = Number(this.sum(qty).replace(',', ''));
    console.log(sumQty);
    total = total.map((res: any) => Number(res));
    console.log(total);
    let val = formatNumber(
      total.reduce((sum: any, cell: any) => (sum += cell)) / sumQty,
      'en-US',
      '1.2-2'
    );
    console.log(val);
    return val;
  }

  async ListOffer() {
    let SPMDiscountPercent = this.cartData.data.products.map(
      (a: any) => a['Req Discount']
    );
    let SPMDiscountPercentSum = Number(
      this.avg(SPMDiscountPercent).replace(',', '')
    );
    console.log('percentageSum', SPMDiscountPercentSum);

    let SPMpercarat = this.productAvg(
      this.cartData.data.products,
      'cts',
      'Req Price'
    );
    let SPMpercaratSum = Number(SPMpercarat.replace(',', ''));
    console.log('SPMpercaratSum', SPMpercaratSum);

    let SPM = this.cartData.data.products.map((a) => a['Amount']);
    let SPMSum = Number(this.sum(SPM).replace(',', ''));
    console.log('SPMSum', SPMSum);

    if (!this.listOfferLoadedObject.discount) {
      this.listOfferLoadedObject = this.List;
    }
    this.List = {
      discount: SPMDiscountPercentSum,
      price: SPMpercaratSum,
      amount: SPMSum,
    };
  }

  async updateListValue(type: any) {
    this.listOfferActual = true;
    let disc;
    if (this.List.discount && this.List.price && this.List.amount) {
      if (type == 'Price') {
        let SPMpercarat = this.productAvg(
          this.cartData.data.products,
          'cts',
          'RAPAPORTpercarat'
        );
        let SPMpercaratSum = Number(SPMpercarat.replace(',', ''));
        disc = (1 - Number(this.List.price) / SPMpercaratSum) * 100;
        this.List.discount = disc;
        this.updateListValue('Disc');
      } else if (type == 'Amt') {
        let cts = this.cartData.data.products.map((a) => a['cts']);
        let CtsSum = Number(this.sum(cts).replace(',', ''));
        this.List.price = this.List.amount / CtsSum;
        this.updateListValue('Price');
      } else if (type == 'Disc') {
        console.log(
          this.listOfferLoadedObject.discount,
          '---',
          this.List.discount
        );
        if (
          !this.listOfferLoadedObject.discount ||
          this.List.discount <= this.listOfferLoadedObject.discount + 5
        ) {
          for (let i = 0; i < this.cartData.data.products.length; i++) {
            let cts = parseFloat(this.cartData.data.products[i]['cts']);
            let rap = parseFloat(
              this.cartData.data.products[i]['RAPAPORTpercarat']
            );
            let disc = parseFloat(
              this.cartData.data.products[i]['Req Discount']
            );
            let price = parseFloat(this.cartData.data.products[i]['Req Price']);
            let amt = parseFloat(this.cartData.data.products[i]['Amount']);

            if (type == 'Disc') {
              disc = Number(this.List.discount);
              price = rap - (rap * disc) / 100;
              amt = price * cts;
            } else if (type == 'Price') {
            } else if (type == 'Amt') {
            }
            this.cartData.data.products[i]['Req Discount'] =
              Math.round(Number(disc) * 100) / 100;
            this.cartData.data.products[i]['Req Price'] =
              Math.round(Number(price) * 100) / 100;
            this.cartData.data.products[i]['Amount'] =
              Math.round(Number(amt) * 100) / 100;
          }
          this.cartData.data.products = this.cartData.data.products.splice(
            0,
            this.cartData.data.products.length
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

  private getCartDetails() {
    this._headerFooterService
      .getCartDetailsV1(
        this.userId,
        this.sessionID,
        this.skip * this.limit,
        this.limit,
        this.searchText,
        this.orderBook,
        this.parameters
      )
      .then((response) => {
        if (response) {
          this.cartData = [];
        }

        let cartValueUpdated: any = {};
        try {
          cartValueUpdated = response;
        } catch (e) {}
        if (!this.orderBook) {
          this._headerFooterService.getCartTotal =
            cartValueUpdated &&
            cartValueUpdated.data &&
            cartValueUpdated.data.totalProduct &&
            cartValueUpdated.data.totalProduct.TotalProduct
              ? cartValueUpdated.data.totalProduct.TotalProduct
              : 0;
          // if (this._companyService.productListing == "grid") {
          //   this._headerFooterService.getCartTotal = cartValueUpdated && cartValueUpdated.data && cartValueUpdated.data.totalProduct && cartValueUpdated.data.totalProduct.TotalProduct ? cartValueUpdated.data.totalProduct.TotalProduct : 0;
          // } else {
          //   this._headerFooterService.getCartTotal = cartValueUpdated && cartValueUpdated.data && cartValueUpdated.data.count && cartValueUpdated.data.count.TotalQuantity ? cartValueUpdated.data.count.TotalQuantity : 0;
          // }
        }
        try {
          this.cartData = response;
          this.searchResultColumnsForCart;
          if (!!this.cartData.data) {
            if (!!this.cartData.data.products) {
              this.subTotal = 0;

              let aa = this.cartData.data.products;
              let i = 1;
              this.productDetailPageList = aa.map((a: any) => ({
                objectID: a.pId,
                index: i++,
                productName: !!a.title ? a.title : a.pId,
              }));

              if (!!aa && aa.length > 0) {
                this.cartId = aa[0].refCartID;
                aa.forEach((product: any) => {
                  product.addOns = '';
                  if (
                    !!product.selectedAddOns &&
                    product.selectedAddOns.length > 0
                  ) {
                    product.selectedAddOns.forEach((addOn: any) => {
                      product.addOns += addOn.name + ', ';
                    });
                    product.addOns = product.addOns.slice(0, -2);
                  }
                });
              }

              this.cartData.data.products = this.cartData.data.products.map(
                (p: any) => {
                  if (
                    p.listOfProductParameter &&
                    p.listOfProductParameter.length > 0
                  ) {
                    p.listOfProductParameter.map((d: any) => {
                      if (d.id) {
                        p[d.name] = d.value;
                      }
                    });
                  }

                  if (p['ShapeCode']) {
                    // let checkRoundl = p['ShapeCode'].indexOf('Round');
                    // let checkRoundU = p['ShapeCode'].indexOf('ROUND');
                    // if (checkRoundl < 0 && checkRoundU < 0) {
                    //   p['CutCode'] = '';
                    // }

                    /* Checking for ShapeCode, if it is not 'round', than removing 'CutCode' */
                    let checkRound = p['ShapeCode'].toLowerCase();
                    if (checkRound !== 'round') {
                      p['CutCode'] = '';
                    }

                    if (p['CutCode']) {
                      let cutObj: any = this.shortCodes.filter(
                        (x: any) => x.label == p['CutCode']
                      );
                      if (cutObj.length > 0) {
                        p['CutCode'] = cutObj[0].code;
                      }
                    }

                    if (p['PolishCode']) {
                      let cutObj: any = this.shortCodes.filter(
                        (x: any) => x.label == p['PolishCode']
                      );
                      if (cutObj.length > 0) {
                        p['PolishCode'] = cutObj[0].code;
                      }
                    }

                    if (p['SymmetryCode']) {
                      let cutObj: any = this.shortCodes.filter(
                        (x: any) => x.label == p['SymmetryCode']
                      );
                      if (cutObj.length > 0) {
                        p['SymmetryCode'] = cutObj[0].code;
                      }
                    }
                  }

                  if (p['RAPAPORTpercarat'] && p['cts']) {
                    let rapAmt = p['RAPAPORTpercarat'] * p['cts'];
                    p['RapAmt'] = rapAmt;
                  } else {
                    p['RapAmt'] = 0;
                  }

                  if (this.orderBook == 'Offer') {
                    p['Req Discount'] = p[this.kgPricing.kgAppliedDiscount];
                    p['Req Price'] = p[this.kgPricing.kgAppliedPrice];
                    p['Amount'] = p[this.kgPricing.kgAppliedAmount];
                  }
                  if (!!p['Rapnet_plus']) this.subTotal += p['Rapnet_plus'];
                  return p;
                }
              );
            }

            if (this.cartData.data.count.FinalPrice) {
              this.total = this.cartData.data.count.FinalPrice;
              this.cartQuantity = this.cartData.data.count.TotalQuantity;
              this._orderDetailsService.observables.next([
                this.total,
                this.cartQuantity,
              ]);
            }
            this.page = this.skip + 1;
            this.refreshGrid = true;
            this.refreshMobileGrid = true;

            setTimeout(() => {
              this.refreshGrid = false;
              this.refreshMobileGrid = false;
            }, 100);
            //this.searchText = '';
          }
        } catch (e) {
          // console.log("error", e);
        }
      });
  }

  async loadData() {
    //this.resultColumns = [];
    this.sessionID = await this.storage.get('sessionID');
    this.quantities.length = 0;
    this.userId = await this.storage.get('userID');
    this.userData = await this.storage.get('userData');

    // console.log(this.userId);

    if (this._companyService.productListing == 'grid') {
      this.limit = 100;
    }

    // if(this.orderBook){
    //   this.orderBookName = this.orderBook;
    // }else{
    //   this.orderBookName = '';
    // }
    // // console.log( this.orderBookName)
    if (this.loadCart) {
      this.cartData = null;
    }

    this.getCartDetails();
  }

  pagination(i: any) {
    this.skip = i - 1;
    this.loadData();
  }

  async insertCartReView(refProductId: any) {
    let cartReviewAction = 7;
    if (!!this.allViewActions && !!this.allViewActions.cartReview) {
      cartReviewAction = this.allViewActions.cartReview;
    }
    let jsonObj = {
      actionId: cartReviewAction,
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

  goToSearch() {
    this.navCtrl.navigateForward('/diamond-search');
  }

  purchaseEvent = function (products: any, userId: number) {
    // products.forEach((product: any) => {
    //   const purchaseData = this.mixPanelDataService.getPurchaseData(
    //     product,
    //     userId,
    //     this.userData
    //   );
    //   this.analyticsService.addEvents('purchase', purchaseData);
    // });
  };

  async continue() {
    let productIds = [];
    let selectedVariantObj = [];
    let sessionId = await this.storage.get('sessionID');
    let userId = await this.storage.get('userID');

    this.loggedInUser = await this.storage.get('loggedInUser');
    await this._configService.showLoading();
    // if(this.cartData.data.count.SubTotal < 5000){
    //   this._configService.presentToast("Cart value should be more than 5000", "error");
    //   return
    // }
    if (!!this.selected.length) {
      for (let i = 0; i < this.selected.length; i++) {
        productIds.push(
          this.selected[i]?.refCartProductId || this.selected[i]?.id
        );
        selectedVariantObj.push({
          PvID: this.selected[i].pvid,
          quantity: this.selected[i].cts,
          discount: this.selected[i][this.kgPricing.kgAppliedDiscount],
          taxes: 0,
          sessionId: sessionId,
          userId: userId,
          //price: resProd.data[0].RAPAPORT
        });
      }
      await this.insertCartReView(productIds);
    } else if (this.cartData.data.products.length > 0) {
      let productsArray = this.cartData.data.products.map(function (p: any) {
        return p.pId;
      });
      await this.insertCartReView(productsArray);
    }

    const forPricingError = !!this.selected.length
      ? this.selected
      : this.cartData.data.products;
    let pricingErrorProducts = await forPricingError.filter((p) => {
      console.log(
        p[this.kgPricing.kgAppliedDiscount] +
          '--' +
          this.kgPricing.kgAppliedDiscount
      );
      console.log(
        p[this.kgPricing.kgAppliedPrice] + '--' + this.kgPricing.kgAppliedPrice
      );
      if (!p[this.kgPricing.kgAppliedPrice]) {
        return p;
      }
    });
    if (pricingErrorProducts.length > 0) {
      await this._configService.hideLoading();
      this._configService.presentToast(
        'Product cost is missing please remove the product',
        'error'
      );
    } else {
      await this.loadCompanyData();
      if (this.pauseOrders) {
        let alert = await this.alertController.create({
          header: this.pauseOrderMessage,
          buttons: ['Dismiss'],
        });
        await this._configService.hideLoading();
        await alert.present();
      } else {
        if (this.loggedInUser) {
          // let userId = await this.storage.get("userID");
          // console.log("this.loggedInUser ", this.loggedInUser, this.userId, this.cartId);
          if (!this.selected.length) {
            if (!!this.loggedInUser && !!this.userId && !!this.cartId) {
              await this.applyScheme();
            }
            this.menu.close('cart');
            // this.router.navigate(["/manage-orders?ob="+this.orderBook]);
            if (this.orderBook) {
              this.router.navigateByUrl('/manage-orders?ob=' + this.orderBook);
            } else {
              this.router.navigate(['/manage-orders']);
            }

            this.purchaseEvent(this.cartData.data.products, userId);

            await this._configService.hideLoading();
          } else {
            let res: any = await this._functionsService.addToPurchaseCart(
              userId,
              sessionId,
              selectedVariantObj
            );
            if (!!res.isSuccess) {
              this._headerFooterService.cartValueUpdated();
              await this._configService.hideLoading();
              let navigationExtras: NavigationExtras = {
                queryParams: {
                  cartId: res?.data.id,
                  from: 'cart',
                  refCartID: this.selected[0].refCartID,
                  productIds: productIds,
                },
              };

              this.purchaseEvent(this.selected, userId);

              this.router.navigate(['/manage-orders'], navigationExtras);
            } else {
              await this._configService.hideLoading();
              this._configService.presentToast('Some error occur', 'error');
            }
          }
        } else {
          this.menu.close('cart');
          //this._configService.presentToast("Please Login", "error");
          await this._configService.hideLoading();
          let navigationExtras: NavigationExtras = {};
          if (this.orderBook) {
            navigationExtras = {
              queryParams: {
                to: '/manage-orders?ob=' + this.orderBook,
              },
            };
          } else {
            navigationExtras = {
              queryParams: {
                to: '/manage-orders',
              },
            };
          }

          this.router.navigate(['/login-with-sign-up'], navigationExtras);
        }
      }
    }
  }

  async onFocus(value: string, index: number) {
    this.quantities[index] = value;
    //// console.log(item.olderQty +'----older qty');
  }
  async changeQuantity(item, i) {
    let qty = item.quantity;
    // console.log("change quantity item ", item, qty, this.quantities[i]);

    if (qty > 0 && qty != this.quantities[i]) {
      let res = await this._functionsService.updateCartQtyDetails(
        item.refCartID,
        item.refPvID,
        qty,
        item.refCartProductId
      );

      if (!!res && res.isSuccess) {
        this._cartChangedService.observables.next();
        await this.loadData();
      }
    }
  }

  async applyScheme() {
    let jsonObj = {
      refUserId: this.userId,
      refCartId: this.cartId,
    };
    let res: any;
    res = await this._functionsService.applySchemes(jsonObj);
    if (res) {
      await this.loadData();
    }
  }

  getClasses(postn) {
    if (this.view == 'page') {
      if (postn == 'first') {
        return ['mar16', 'mw300p', 'fr'];
      }
      if (postn == 'last') {
        return ['mar16', 'martop0', 'mw300p', 'fr'];
      }
    } else {
      if (postn == 'first') {
        return ['w100'];
      }
      if (postn == 'last') {
        return ['martop0', 'w100'];
      }
      if (
        postn == 'actionBtn' &&
        this._companyService.productListing == 'grid'
      ) {
        return ['w100', 'round-button', 'v2Btn'];
      }
    }
  }

  async actionButtonClick(btn) {
    let resKYC = await this.checkForKYC(btn);
    let sessionId = await this.storage.get('sessionID');
    let userId = await this.storage.get('userID');
    if (resKYC) {
      this.loggedInUser = await this.storage.get('loggedInUser');
      if (
        !!this.loggedInUser ||
        btn.name.toLowerCase() == 'remove' ||
        btn.name == 'Ask KAM' ||
        btn.name == 'Virtual Inspection'
      ) {
        if (btn.name.toLowerCase() == 'purchase') {
          if (this.selected.length <= 0) {
            this._configService.presentToast('Please select stones', 'error');
            return;
          }
          await this._configService.showLoading();
          let selectedVariantObj = [];
          let productIds = [];
          for (let i = 0; i < this.selected.length; i++) {
            productIds.push(
              this.selected[i]?.refCartProductId || this.selected[i]?.id
            );
            selectedVariantObj.push({
              PvID: this.selected[i].pvid,
              quantity: this.selected[i].cts,
              discount: this.selected[i][this.kgPricing.kgAppliedDiscount],
              taxes: 0,
              sessionId: sessionId,
              userId: userId,
              //price: resProd.data[0].RAPAPORT
            });
          }

          let res = await this._functionsService.addToPurchaseCart(
            userId,
            sessionId,
            selectedVariantObj
          );
          if (!!res.isSuccess) {
            this._headerFooterService.cartValueUpdated();
            await this._configService.hideLoading();
            let navigationExtras: NavigationExtras = {
              queryParams: {
                cartId: res?.data.id,
                from: 'cart',
                refCartID: this.selected[0].refCartID,
                productIds: productIds,
              },
            };

            this.purchaseEvent(this.selected, userId);

            this.router.navigate(['/manage-orders'], navigationExtras);
          } else {
            await this._configService.hideLoading();
            this._configService.presentToast('Some error occur', 'error');
          }
          // let checkActions = await this.checkActions(
          //   btn.allowedActions,
          //   this.selected
          // );
          // await this._configService.hideLoading();
          // if (checkActions) {
          //   let navigationExtras: NavigationExtras = {
          //     queryParams: {
          //       view: 'address',
          //     },
          //   };
          //   this.router.navigate(['/manage-orders']);
          // } else {
          //   this._configService.presentToast('Action not Allowed', 'error');
          // }
        } else {
          if (this.selected.length > 0) {
            // console.log("selected" + this.selected);
          } else {
            this.selected = [...this.cartData.data.products];
            //this._configService.presentToast("Please select stones", "error");
            //return;
          }

          if (btn.name == 'Memo') {
            await this._configService.showLoading();
            let checkActions = await this.checkActions(
              btn.allowedActions,
              this.selected
            );
            if (checkActions) {
              let orderBook = btn.orderBook;
              let selectedVariantObj = [];
              for (let i = 0; i < this.selected.length; i++) {
                selectedVariantObj.push({
                  PvID: this.selected[i].pvid,
                  quantity: this.selected[i].cts,
                  discount: this.selected[i][this.kgPricing.kgAppliedDiscount],
                  taxes: 0,
                  sessionId: sessionId,
                  userId: userId,
                  //price: resProd.data[0].RAPAPORT
                });
              }
              // console.log("selectedVariantObj ", selectedVariantObj);
              let deleteRes = await this.databaseServiceService.emptyCart(
                userId,
                sessionId,
                orderBook,
                null
              );

              let res = await this._functionsService.addMultipleToCart(
                userId,
                sessionId,
                selectedVariantObj,
                orderBook
              );
              await this._configService.hideLoading();
              if (!!res.isSuccess) {
                let navigationExtras: NavigationExtras = {
                  queryParams: {
                    view: 'address',
                    ob: 'Memo',
                  },
                };
                this.router.navigate(['/manage-orders']);
              } else {
                this._configService.presentToast('Some Error Occur', 'error');
              }
            } else {
              this._configService.presentToast('Action not Allowed', 'error');
            }
          } else if (btn.name == 'Submit Offer') {
            await this._configService.showLoading();
            let checkActions = true;
            if (checkActions) {
              let orderBook = btn.orderBook;
              let selectedVariantObj = [];
              for (let i = 0; i < this.selected.length; i++) {
                selectedVariantObj.push({
                  PvID: this.selected[i].pvid,
                  quantity: this.selected[i].cts,
                  discount: this.selected[i][this.kgPricing.kgAppliedDiscount],
                  taxes: 0,
                  sessionId: sessionId,
                  userId: userId,
                  //price: resProd.data[0].RAPAPORT
                });
              }
              // console.log("selectedVariantObj ", selectedVariantObj);
              let deleteRes = await this.databaseServiceService.emptyCart(
                userId,
                sessionId,
                orderBook,
                null
              );

              let res = await this._functionsService.addMultipleToCart(
                userId,
                sessionId,
                selectedVariantObj,
                orderBook
              );
              await this._configService.hideLoading();
              if (!!res.isSuccess) {
                let navigationExtras: NavigationExtras = {
                  queryParams: {
                    ob: 'Offer',
                  },
                };
                this.router.navigate(['/my-cart'], navigationExtras);

                //same page redirect
              } else {
                this._configService.presentToast('Some Error Occur', 'error');
              }
            } else {
              this._configService.presentToast('Action not Allowed', 'error');
            }
          } else if (btn.name == 'Ask KAM') {
            let checkActions = await this.checkActions(
              btn.allowedActions,
              this.selected
            );
            if (checkActions) {
              let orderBook = btn.orderBook;
              let stoneArray = [];
              for (let i = 0; i < this.selected.length; i++) {
                let sId = this.selected[i].id.replace('ObjectId-', '');

                let obj = {
                  stoneId: sId,
                  lab: this.selected[i].lab,
                  ShapeCode: this.selected[i].ShapeCode,
                  ColorCode: this.selected[i].ColorCode,
                  ClarityCode: this.selected[i].ClarityCode,
                  cts: this.selected[i].cts,
                };
                stoneArray.push(obj);
              }
              let processName = 'Ask KAM';
              // console.log(stoneArray);
              let frmdata = {
                stones: stoneArray,
              };
              // const modal = await this.modalController.create({
              //   component: NgxFormPage,
              //   componentProps: {
              //     frmdata: frmdata,
              //     processName: processName,
              //     popup: true,
              //   },
              //   cssClass: 'square-modal',
              // });
              // await modal.present();
            } else {
              this._configService.presentToast('Action not Allowed', 'error');
            }
          } else if (btn.name == 'Schedule Viewing') {
            let checkActions = await this.checkActions(
              btn.allowedActions,
              this.selected
            );
            if (checkActions) {
              let orderBook = btn.orderBook;
              let formVariantObj = [];
              let stoneArray = [];
              let selectedVariantObj = [];
              for (let i = 0; i < this.selected.length; i++) {
                let sId = this.selected[i].id.replace('ObjectId-', '');
                let obj = {
                  stoneId: sId,
                  lab: this.selected[i].lab,
                  ShapeCode: this.selected[i].ShapeCode,
                  ColorCode: this.selected[i].ColorCode,
                  ClarityCode: this.selected[i].ClarityCode,
                  cts: this.selected[i].cts,
                };
                stoneArray.push(obj);

                formVariantObj.push({
                  refPvID: this.selected[i].pvid,
                  quantity: this.selected[i].cts,
                  discount: this.selected[i][this.kgPricing.kgAppliedDiscount],
                  taxes: 0,
                });

                selectedVariantObj.push({
                  PvID: this.selected[i].pvid,
                  quantity: this.selected[i].cts,
                  discount: this.selected[i][this.kgPricing.kgAppliedDiscount],
                  taxes: 0,
                  //price: resProd.data[0].RAPAPORT
                });
              }
              let deleteRes = await this.databaseServiceService.emptyCart(
                userId,
                sessionId,
                orderBook,
                null
              );

              let res = await this._functionsService.addMultipleToCart(
                userId,
                sessionId,
                selectedVariantObj,
                orderBook
              );
              if (!!res.isSuccess) {
                let processName = 'Schedule Viewing';
                let frmdata = {
                  cartId: res.data.id,
                  userId: userId,
                  sessionId: sessionId,
                  variants: formVariantObj,
                  orderBook: orderBook,
                  stones: stoneArray,
                };
                // const modal = await this.modalController.create({
                //   component: NgxFormPage,
                //   componentProps: {
                //     frmdata: frmdata,
                //     processName: processName,
                //     popup: true,
                //   },
                //   cssClass: 'square-modal',
                // });
                // await modal.present();
              } else {
                this._configService.presentToast('Some Error Occur', 'error');
              }
            } else {
              this._configService.presentToast('Action not Allowed', 'error');
            }
          } else if (btn.name.toLowerCase() == 'remove') {
            for (let i = 0; i < this.selected.length; i++) {
              let res = await this._functionsService.removeCartProduct(
                this.selected[i].refCartID,
                this.selected[i].refCartProductId || this.selected[i].id,
                sessionId,
                userId
              );
            }
            await this.loadData();
            this.selected = [];
          } else if (btn.name == 'Save Offer' && btn.action == 'add') {
            if (
              this.listOffer &&
              (!this.List.discount || !this.List.price || !this.List.amount)
            ) {
              this._configService.presentToast('Enter Valid inputs', 'error');
              return;
            }
            if (this.selected.length > 0) {
              await this._configService.showLoading();
              let selectedObj = [];
              let error = false;
              let stoneid_mixpanel = [];
              for (let i = 0; i < this.selected.length; i++) {
                if (
                  this.selected[i][this.kgPricing.kgAppliedDiscount] !=
                    this.selected[i]['Req Discount'] ||
                  this.selected[i][this.kgPricing.kgAppliedPrice] !=
                    this.selected[i]['Req Price'] ||
                  this.selected[i][this.kgPricing.kgAppliedAmount] !=
                    this.selected[i]['Amount']
                ) {
                  let obj = {
                    refPvID: this.selected[i].refPvID,

                    kgDiscountPercent:
                      this.selected[i][this.kgPricing.kgAppliedDiscount],
                    kgPrice: this.selected[i][this.kgPricing.kgAppliedPrice],

                    offerDiscountPercent: this.selected[i]['Req Discount'],
                    offerPrice: this.selected[i]['Req Price'],

                    listDiscount:
                      this.selected[i][this.kgPricing.kgAppliedDiscount],
                    listDiscountPrice:
                      this.selected[i][this.kgPricing.kgAppliedPrice],

                    rapnet: this.selected[i]['RAPAPORTpercarat'],
                    cts: this.selected[i]['cts'],
                    stoneName: this.selected[i]['stoneName'],
                  };
                  selectedObj.push(obj);
                  stoneid_mixpanel.push(this.selected[i].id);
                } else {
                  error = true;
                }
              }
              if (!error) {
                let extra: any = {
                  paymentMode: this.paymentMode.name,
                  termName: this.paymentMode.name,
                };
                let isListOffer = this.listOffer && this.listOfferActual;
                extra.isListOffer = isListOffer;
                extra.clientRemark = isListOffer;
                let res = await this._functionsService.createOrderForLattice(
                  this.userId,
                  this.sessionID,
                  this.orderBook,
                  selectedObj,
                  extra
                );
                await this._configService.hideLoading();
                if (res.isSuccess) {
                  this._configService.presentToast(
                    'Offer Submitted Successfully',
                    'success'
                  );
                  this.router.navigateByUrl('/orders/All?ob=Offer');

                  //mixpanel api
                  this.analyticsService.addEvents('offer submitted', {
                    StoneId: stoneid_mixpanel,
                  });
                } else {
                  this._configService.presentToast(res.error, 'error');
                }
              } else {
                await this._configService.hideLoading();
                this._configService.presentToast(
                  'You have not changed anything!',
                  'error'
                );
              }
            } else {
              this._configService.presentToast('Please select stones', 'error');
            }
          } else if (btn.name == 'Cancel Offer' && btn.action == 'cancel') {
            for (let i = 0; i < this.selected.length; i++) {
              let res = await this._functionsService.removeCartProduct(
                this.selected[i].refCartID,
                this.selected[i].refCartProductId || this.selected[i].id,
                sessionId,
                userId
              );
            }

            await this.loadData();
          } else if (btn.name == 'Virtual Inspection') {
            if (this.selected.length > 0) {
              this.inspectionView = true;
              this.loadInspectView();
            } else {
              this._configService.presentToast('Please select stones', 'error');
            }
          } else if (btn.name == 'List View') {
            this.inspectionView = false;
            const prevCartCount = this.cartCount;
            this.cartCount = this._headerFooterService.getCartTotal;
            if (prevCartCount !== this.cartCount) {
              this.cartData = null;
              this.getCartDetails();
            }
            this.loadInspectView();
          }
        }
      } else {
        this._configService.presentToast('Please Login', 'error');
      }
    }
  }

  async viewOfferInputsFn(event) {
    console.log(event);
    let modal = await this.modalCtrl.create({
      component: CartActionsComponent,
      componentProps: {
        userId: this.userId,
        sessionID: this.sessionID,
        userType: this.userType,
        row: event.data,
        actionType: 'view offer',
        listOffer: this.listOffer,
        rowIndex: event.rowIndex,
        page: 'cart',
      },
      showBackdrop: true,
    });
    modal.present();
    modal.onDidDismiss().then((res) => {
      if (res.data) {
        console.log(res.data);
        let index = res.data.rowIndex;
        let row = res.data.row;
        this.cartData.data.products[index] = row;
      }
    });
  }

  async downloadCart() {
    await this._configService.showLoading();
    let urlToPass = '';
    if (
      !this.onMobile &&
      window &&
      'location' in window &&
      'protocol' in window.location &&
      'pathname' in window.location &&
      'host' in window.location
    ) {
      urlToPass = window.location.origin;
    } else {
      urlToPass = 'App';
      //how to send url if there is mobile App
    }
    let res: any = await this._actionsService.exportCartExcel(
      this.cartId,
      urlToPass
    );
    await this._configService.hideLoading();
    if (res.isSuccess) {
      let paramsHeader = this.searchResultExport.map((id) => id.name);
      let headers = [];
      paramsHeader.forEach((header) => {
        headers.push(header);
      });
      //console.log(headers)
      let fileName = moment().format('YYYY-MM-DD');
      this._configService.exportAsExcelFile(res.data, fileName);
      // let fileName = moment().format("YYYY-MM-DD HH:mm:ss")
      // this._configService.exportCSVFile(headers, res.data, fileName);
    } else {
      this._configService.presentToast('Error in export', 'error');
    }
  }

  async ExcelExport() {
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
            temp3['currentLocation'] = a['currentLocation'];
            temp3 = await this.excelSheetData.dataForExcelsheet(e, temp3, a);

            /*
            switch (e.fieldName) {
              case 'stoneName':
                let stoneName = a['stoneName'] || '';
                if (!!stoneName) temp3[e.name] = stoneName;
                else temp3[e.name] = `${a['title']} Not Available`;
                break;
              case 'Rapnet_pluspercarat':
                temp3[e.name] = a['Rapnet_pluspercarat']
                  ? Number(a['Rapnet_pluspercarat']?.toFixed(2))
                  : !!a['stoneName']
                  ? 0
                  : '';
                break;
              case 'Amt':
                if (a['Rapnet_pluspercarat'] && a['cts']) {
                  let amt = a['Rapnet_pluspercarat'] * a['cts'];
                  temp3[e.name] = amt
                    ? Number(amt?.toFixed(2))
                    : !!a['stoneName']
                    ? 0
                    : '';
                } else {
                  temp3[e.name] = !!a['stoneName'] ? 0 : '';
                }
                break;
              case 'RapAmt':
                if (a['RAPAPORTpercarat'] && a['cts']) {
                  let rapAmt = a['RAPAPORTpercarat'] * a['cts'];
                  temp3[e.name] = rapAmt
                    ? Number(rapAmt?.toFixed(2))
                    : !!a['stoneName']
                    ? 0
                    : '';
                } else {
                  temp3[e.name] = !!a['stoneName'] ? 0 : '';
                }
                break;
              case 'ReportNo':
                let ReportNo = a['ReportNo'] || '';
                let lab = a['lab'] || '';
                if (ReportNo && lab) {
                  temp3[e.name] = ReportNo.toString();
                } else {
                  temp3[e.name] = ReportNo.toString();
                }
                break;
              case 'Rapnet_plusDiscountPercent':
                temp3[e.name] = a['Rapnet_plusDiscountPercent']
                  ? Number(a['Rapnet_plusDiscountPercent']?.toFixed(2))
                  : !!a['stoneName']
                  ? 0
                  : '';
                break;
              case 'cts':
                temp3[e.name] = a['cts'] ? Number(a['cts']?.toFixed(2)) : '';
                break;
              case 'RAPAPORTpercarat':
                temp3[e.name] = a['RAPAPORTpercarat']
                  ? Number(a['RAPAPORTpercarat']?.toFixed(2))
                  : !!a['stoneName']
                  ? 0
                  : '';
                break;
              case 'KeytoSymbolsCode':
                let val = '';
                if (!!a[e.fieldName]) {
                  val = a[e.fieldName].replace(/,/g, '/');
                }
                temp3[e.name] = val;
                break;
              case 'ShapeCode':
                let shape =
                  a['eliteShapeCode'] ||
                  a['standardShapeCode'] ||
                  a['ShapeCode'] ||
                  '';
                temp3[e.name] = shape;
                break;
              default:
                temp3[e.name] = a[e.fieldName] || '';
                break;
            }
            */

            /*
            Object.keys(a).map(res => {
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
                let shape =
                  a['eliteShapeCode'] ||
                  a['standardShapeCode'] ||
                  a['ShapeCode'];
                temp3[e.name] = shape;
              }
            });
            */
          }
          this.itemsFormatted.push(temp3);
        }
        console.log(
          'excel products ',
          this.itemsFormatted,
          ' temp ',
          temp2,
          ' searchresultcolumns ',
          this.searchResultExport
        );
        let fileName = moment().format('YYYY-MM-DD');
        await this._configService.exportAsExcelFile(
          this.itemsFormatted,
          fileName
        );

        this.refreshGrid = true;
        this.refreshMobileGrid = true;
        if (!this.inspectionView) {
          this.selected = [];
        }
        this.refeshDataGridValueChange();
        await this._configService.hideLoading();
      } else {
        await this._configService.hideLoading();
        this.downloadCart();
        //this._configService.presentToast("Please select stones", "error");
      }
    } else {
      await this._configService.hideLoading();
      this._configService.presentToast('Please Login', 'error');
    }
  }

  async openCartActions() {
    let productDetailsModal = await this.modalCtrl.create({
      component: CartActionsComponent,
      componentProps: {
        userId: this.userId,
        sessionID: this.sessionID,
        userType: this.userType,
        cartData: this.cartData,
        userData: this.userData,
        onMobile: this.onMobile,
        columns: this.searchResultExport,
        productType: this._companyService.productListing,
      },
      cssClass: 'square-modal',
      showBackdrop: true,
    });
    productDetailsModal.present();
    productDetailsModal.onDidDismiss().then((res) => {
      if (res.data) {
        let data = res?.data;
        if (data?.action == 'download-cart') {
          this.ExcelExport();
        }
        if (data?.action == 'clear-cart') {
          this.selected = [];
        }
      }
      this.loadData();
    });
  }

  changeView() {
    this.loadData();
    if (this.inspectionView) {
      this.inspectionView = false;
    } else {
      this.inspectionView = true;
    }
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      buttons: this.createSearchButtons(),
    });
    await actionSheet.present();
  }

  createSearchButtons() {
    let buttons = [];
    for (let btn of this.cartPageButton) {
      if (btn.name != 'Submit Offer') {
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
    }
    if (!this.orderBook) {
      let cartBtn = {
        id: -1,
        text: 'Cart actions',
        icon: 'cart',
        handler: () => {
          this.openCartActions();
          return true;
        },
      };
      buttons.push(cartBtn);
    }
    return buttons;
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
        console.log(path[path.length - 2]);
        if (path.includes('collections')) {
          window.open(
            host.replace('collections/' + path[path.length - 1], 'products') +
              '/' +
              (!!product.stoneName ? product.stoneName : product.id) +
              '/' +
              name +
              '/' +
              product.currentLocation,
            '_blank'
          );
        } else {
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
    }
  }

  omit_special_char(event) {
    var k;
    k = event.charCode;
    console.log(k);
    //         k = event.keyCode;  (Both can be used)
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

  async showGetEmailId() {
    let res: any = await this.databaseServiceService.getDiaUserProfile(
      this.userId
    );
    if (res.data.parameter) {
      let para = JSON.parse(res.data.parameter);
      if (para && para.userAccount) this.profileData = para.userAccount;
    }
    if (
      this.profileData &&
      this.profileData.salesperson &&
      this.profileData.salesperson.name
    ) {
      this.salesPersonEmail = this.profileData.salesperson.email;
    }
    this.loggedInUser = await this.storage.get('loggedInUser');
    if (!!this.loggedInUser) {
      const excelModel = await this.modalCtrl.create({
        component: BookAppointmentComponent,
        cssClass: 'mail-popup',
        componentProps: {
          isMail: true,
          sendBtn: true,
          isStoneSelected: this.isStoneSelected,
          salesPersonEmail: this.salesPersonEmail,
          numOfSelectedStone: this.totalSelectedSummary['pcs'],
          totalNumOfStones: this.totalNumOfStones,
          //pageSize: this.pageSize,
        },
      });

      excelModel.present();

      const { data, role } = await excelModel.onWillDismiss();

      if (role === 'sendEmail') {
        this.EmailProducts(data.sendEmail, data.message);
      }
    }
    // if (!!this.loggedInUser) {
    //   const alert = await this.alertController.create({
    //     header: 'Enter Email Details!',
    //     inputs: [
    //       {
    //         name: 'sendEmail',
    //         type: 'text',
    //         placeholder: 'Enter reciever email id',
    //         cssClass: 'emailText',
    //         value: this.salesPersonEmail,
    //       },
    //       {
    //         name: 'Message',
    //         type: 'textarea',
    //         placeholder: 'Enter message',
    //         cssClass: 'emailText-area',
    //       },
    //     ],
    //     cssClass: 'email-alert-box',
    //     buttons: [
    //       {
    //         text: 'Cancel',
    //         role: 'cancel',
    //         cssClass: 'secondary',
    //         handler: () => {
    //           // console.log("Confirm Cancel");
    //         },
    //       },
    //       {
    //         text: 'Send',
    //         handler: val => {
    //           this.EmailProducts(val.sendEmail, val.Message);
    //           // console.log("Confirm Ok");
    //         },
    //       },
    //     ],
    //   });
    //   await alert.present();
    // } else {
    //   this._configService.presentToast('Please Login', 'error');
    // }
  }

  async EmailProducts(em, msg) {
    await this._configService.showLoading();
    let temp2 = [];
    this.itemsFormatted = [];
    if (this.selected.length > 0) {
      await this.selected.map((a, i) => {
        let temp3 = {};
        let sortedArray = [];

        this.searchResultExport.forEach(async (e) => {
          if (i == 0) {
            temp2.push(e.name);
          }
          temp3[e.name] = '';

          temp3 = await this.excelSheetData.dataForExcelsheet(e, temp3, a);

          /*
          Object.keys(a).map(res => {
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
            }
          });
          */
        });
        temp3['SHAPE'] =
          a['eliteShapeCode'] || a['standardShapeCode'] || a['ShapeCode'];
        temp3['currentLocation'] = a['currentLocation'];
        this.itemsFormatted.push(temp3);
      });
    } else {
      await this.cartData.data.products.map(async (a, i) => {
        let temp3 = {};
        let sortedArray = [];
        await this.searchResultExport.forEach(async (e) => {
          if (i == 0) {
            temp2.push(e.name);
          }
          temp3[e.name] = '';

          temp3 = await this.excelSheetData.dataForExcelsheet(e, temp3, a);

          /*
          Object.keys(a).map(res => {
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
              temp3[e.name] = a['Rapnet_pluspercarat'].toFixed(2);
            } else if (e.fieldName == 'Amt') {
              if (a['Rapnet_pluspercarat'] && a['cts']) {
                let amt = a['Rapnet_pluspercarat'] * a['cts'];
                temp3[e.name] = amt.toFixed(2);
              } else {
                temp3[e.name] = '';
              }
            } else if (e.fieldName == 'RapAmt') {
              if (a['RAPAPORTpercarat'] && a['cts']) {
                let rapAmt = a['RAPAPORTpercarat'] * a['cts'];
                temp3[e.name] = rapAmt.toFixed(2);
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
            }
          });
          */
        });
        temp3['SHAPE'] =
          a['eliteShapeCode'] || a['standardShapeCode'] || a['ShapeCode'];
        temp3['currentLocation'] = a['currentLocation'];
        this.itemsFormatted.push(temp3);
      });
      //this._configService.presentToast("Please select records", "error");
    }

    this.sendMail(em, this.itemsFormatted, msg);
    this.refreshGrid = true;
    this.refreshMobileGrid = true;
    if (!this.insertCartReView) {
      this.selected = [];
    }
    this.refeshDataGridValueChange();
    await this._configService.hideLoading();
  }

  async sendMail(em, products, msg) {
    let res = await this._savedService.emailSelectedProducts(
      em,
      products,
      this.userData.id,
      msg
    );

    if (!!res.isSuccess) {
      this.refreshGrid = true;
      this.refreshMobileGrid = true;
      if (!this.inspectionView) {
        this.selected = [];
      }
      this._configService.presentToast('Mail sent successfully', 'success');
    } else {
      this._configService.presentToast('Some error occur', 'error');
    }
  }

  async clearCart() {
    if (this.selected.length > 0) {
      let sessionId = await this.storage.get('sessionID');
      let userId = await this.storage.get('userID');
      await this._configService.showLoading();
      let productIds: any = this.selected.map(
        (item) => item.refCartProductId || item.id
      );
      console.log(productIds);

      let res: any = await this._functionsService.removeMultipleProductFromCart(
        this.selected[0].refCartID,
        productIds,
        sessionId,
        userId
      );
      if (res.isSuccess) {
        await this.loadData();
        await this._configService.hideLoading();
        this._configService.presentToast(
          'Product removed from cart successfully',
          'sucess'
        );
        this.selected = [];
      }
      // await this.selected.map(async (item, i) => {

      // })
    } else {
      //alert for clear cart
      let alert = await this.alertController.create({
        message: 'Are you sure you want to remove  all Products from cart?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {},
          },
          {
            text: 'Ok',
            handler: () => {
              this.clear();
            },
          },
        ],
      });
      alert.present();
    }
  }

  async clear() {
    await this._configService.showLoading();
    let res: any = await this._actionsService.clearCart(
      this.cartId,
      !!this.userId ? '' : this.sessionID,
      this.userId,
      '',
      '',
      '',
      '',
      ''
    );
    await this._configService.hideLoading();
    if (res.isSuccess) {
      let userdata = await this.storage.get('userData');
      this._configService.presentToast('Cart Cleared', 'success');
      this.loadData();
    } else {
      this._configService.presentToast('Error in sending mail', 'error');
    }
  }

  viewCertificate(data) {
    let lab = data['lab'];
    let ReportNo = data['ReportNo'];
    let url = `https://kgmediaprod.blob.core.windows.net/certificates/${lab}/${ReportNo}.pdf`;
    // window.open(url, '_blank');

    if (this.mobileView && !this.webViewMobile) {
      this.previewAnyFile.preview(url).then(
        (res: any) => {
          console.log('file : ' + res);
          //this.configService.presentToast("File Downloaded", "success");
        },
        (error) => {
          // handle error
          console.error(error);
        }
      );
    } else {
      if (this.isIpad && !this.webViewMobile) {
        this.previewAnyFile.preview(url).then(
          (res: any) => {
            console.log('file : ' + res);
            //this.configService.presentToast("File Downloaded", "success");
          },
          (error) => {
            // handle error
            console.error(error);
          }
        );
      } else {
        window.open(url, '_blank');
      }
    }
  }

  selectionViewData(event: {
    totalSelectedSummary: TotalSelectedSummary;
    hideClearSelection: boolean;
  }) {
    this.totalSelectedSummary = event.totalSelectedSummary;
  }

  // refresh() {
  //   this.totalSelectedSummary = {
  //     cts: 0,
  //     pcs: 0,
  //     amount: 0,
  //   };
  //   this.dxDataGridComp.refresh();
  // }
}
