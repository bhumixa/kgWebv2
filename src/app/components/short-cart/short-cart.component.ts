import { Component, OnInit, Input } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { ConfigServiceService } from '../../service/config-service.service';
import { HeaderFooterService } from '../../service/headerFooter/header-footer.service';
import { Router, NavigationExtras } from '@angular/router';
import { Storage } from '@ionic/storage';
import { AlertController } from '@ionic/angular';
import { CompanyService } from '../../service/company/company.service';
import { FunctionsService } from '../../service/cart/functions/functions.service';
import { OpenCartService } from '../../service/observable/open-cart/open-cart.service';
import { CartChangedService } from '../../service/observable/cart-changed/cart-changed.service';
import { CloseCartService } from '../../service/observable/close-cart/close-cart.service';
import { ShowIdService } from '../../service/observable/show-id/show-id.service';
import { OrderDetailsService } from '../../service/observable/order-details/order-details.service';

@Component({
  selector: 'app-short-cart',
  templateUrl: './short-cart.component.html',
  styleUrls: ['./short-cart.component.scss'],
})
export class ShortCartComponent implements OnInit {
  @Input() parameters: boolean = false;

  public cartData: any;
  public total;
  public customerAddress;
  public userId: any;
  public userData: any;
  public loggedInUser: any;
  public sessionID: any;
  public userType: any;
  public page: number = 1;
  public onMobile: any;
  public cartQuantity;
  public imageURL: any;
  public companyLogo: any;
  public totalTax = 0;
  public appName: any;
  public mobileWeb: any = false;
  public skip = 0;
  public limit = 10;
  public companyJson: any = {
    homePageHeaderLinks: [],
  };
  public showHideMenuButton = false;
  public cartId: any;
  public searchText = '';
  public quantities = [];
  maxSize = 6;
  public showSchemes = true;
  public ShowDispatches = true;
  public selectedCartAction: any;
  public ShowCartPage: any;
  public showActionButton = true;
  public searchResultColumns: any = [];
  public totalSummary = [];
  public selected: any = [];
  public orderBookName = '';
  public offerObj = [];
  public paymentModeList = this._companyService.allPaymentDetails;
  public paymentMode: any = this.paymentModeList[0];

  public colSize = 10;
  public goBtncolSize = 2;
  public selectedCol = '';
  public checkKYC = false;
  public showSkeleton = true;
  public loadCart = false;
  public showId: any;
  public List: any = {
    discount: 0,
    price: 0,
    amount: 0,
  };
  public listOffer: boolean = false;
  public listOfferActual: boolean = false;
  public hideStorePrice = false;
  public pauseOrders: Boolean = false;
  public pauseOrderMessage = '';
  public allViewActions: any = this._companyService.allActions;

  constructor(
    public _companyService: CompanyService,
    public _headerFooterService: HeaderFooterService,
    public _configService: ConfigServiceService,
    public _openCartService: OpenCartService,
    public _cartChangedService: CartChangedService,
    public _closeCartService: CloseCartService,
    public _showIdService: ShowIdService,
    public _orderDetailsService: OrderDetailsService,
    public storage: Storage,
    public _functionsService: FunctionsService,
    private router: Router,
    private menu: MenuController,
    public alertController: AlertController
  ) {
    this._openCartService.observable().subscribe((data) => {
      this.loadData();
    });
    this._showIdService.observable().subscribe((data) => {
      this.showId = data;
    });
  }

  async ngOnInit() {
    this.cartData = null;
    this.selected = [];
    this.colSize = 2;
    this.goBtncolSize = 2;
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
        }
      }
    }
    // console.log("load company data ", this._companyService.companyObj, this.pauseOrders, this.pauseOrderMessage);
  }

  onSelect({ selected }) {
    // console.log("Select Event", selected, this.selected);
    //this.selected.splice(0, this.selected.length);
    // this.selected.push(...selected);
  }

  async ionViewDidEnter() {
    await this.loadData();
  }

  async clearSearch(e) {
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

  async incrementQuantity(item) {
    this.showSkeleton = false;
    // console.log("item", item);
    item['show'] = true;
    this.loadCart = false;

    let res = await this._functionsService.updateCartQtyDetails(
      item.refCartID,
      item.refPvID,
      ++item.quantity,
      item.refCartProductId
    );

    if (!!res.isSuccess) {
      let data = {
        type: 'increment',
        data: item,
      };
      this._cartChangedService.observables.next(data);
    }
  }

  hideCardView(item) {
    item['show'] = false;
  }

  async removeCartProduct(item) {
    // console.log(item)
    let pArrayForGTM = [
      {
        name: item.title, // Name or ID is required.
        id: item.pId,
        price: item.price,
        variant: item.title,
      },
    ];
    this._companyService.insertGTM(
      'removeFromCart',
      'remove',
      null,
      pArrayForGTM
    );

    let sessionId = await this.storage.get('sessionID');
    let userId = await this.storage.get('userID');

    let res = await this._functionsService.removeCartProduct(
      item.refCartID,
      item.refCartProductId || item.id,
      sessionId,
      userId
    );
    if (!!res.isSuccess) {
      let data = {
        type: 'remove',
        data: item,
      };
      this._cartChangedService.observables.next(data);
      await this.loadData();
      this.selected = [];
    }
  }

  async decrementQuantity(item) {
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

  showCardView(item) {
    // if (this.visibleIndex === ind) {
    //   this.visibleIndex = -1;
    // } else {
    //   this.visibleIndex = ind;
    // }
    item.oldQuantity = item.quantity;
    this.showId = item.id;
    // console.log(this.showId);
    item['show'] = true;
  }

  noop() {}
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

    // // console.log( this.orderBookName)
    if (this.loadCart) {
      this.cartData = null;
    }
    this._headerFooterService
      .getCartDetailsV1(
        this.userId,
        this.sessionID,
        this.skip * this.limit,
        this.limit,
        this.searchText,
        '',
        this.parameters
      )
      .then((response) => {
        if (response) {
          this.cartData = [];
        }

        let cartValueUpdated: any = {};
        try {
          cartValueUpdated = response;
          if (this._companyService.productListing == 'grid') {
            this._headerFooterService.getCartTotal =
              cartValueUpdated.data.totalProduct.TotalProduct || 0;
          } else {
            this._headerFooterService.getCartTotal =
              cartValueUpdated.data.count.TotalQuantity || 0;
          }
        } catch (e) {
          this._headerFooterService.getCartTotal = 0;
        }

        try {
          this.cartData = response;
          this.searchResultColumns;
          if (!!this.cartData.data) {
            if (!!this.cartData.data.products) {
              let aa = this.cartData.data.products;
              let i = 1;

              if (!!aa && aa.length > 0) {
                this.cartId = aa[0].refCartID;
                aa.forEach((product) => {
                  product.addOns = '';
                  if (
                    !!product.selectedAddOns &&
                    product.selectedAddOns.length > 0
                  ) {
                    product.selectedAddOns.forEach((addOn) => {
                      product.addOns += addOn.name + ', ';
                    });
                    product.addOns = product.addOns.slice(0, -2);
                  }
                });
              }
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
            //this.searchText = '';
          }
        } catch (e) {
          // console.log("error", e);
        }
      });
  }

  pagination(i) {
    this.skip = i - 1;
    this.loadData();
  }

  async insertCartReView(refProductId) {
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

  async continue() {
    this.loggedInUser = await this.storage.get('loggedInUser');
    if (this.cartData.data.products.length > 0) {
      let productsArray = this.cartData.data.products.map(function (p) {
        return p.pId;
      });
      await this.insertCartReView(productsArray);
    }
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
      { step: 1, option: 'cartReview' },
      pArrayForGTM
    );

    await this.loadCompanyData();
    if (this.pauseOrders) {
      let alert = await this.alertController.create({
        header: this.pauseOrderMessage,
        buttons: ['Dismiss'],
      });
      await alert.present();
    } else {
      if (this.loggedInUser) {
        // let userId = await this.storage.get("userID");
        // console.log("this.loggedInUser ", this.loggedInUser, this.userId, this.cartId);
        if (!!this.loggedInUser && !!this.userId && !!this.cartId) {
          await this.applyScheme();
        }
        this.menu.close('cart');
        // this.router.navigate(["/manage-orders?ob="+this.orderBook]);

        this.router.navigate(['/manage-orders']);
      } else {
        this.menu.close('cart');
        //this._configService.presentToast("Please Login", "error");
        let navigationExtras: NavigationExtras = {};

        navigationExtras = {
          queryParams: {
            to: '/manage-orders',
          },
        };

        this.router.navigate(['/login-with-sign-up'], navigationExtras);
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
    if (item.oldQuantity != item.quantity) {
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
    if (postn == 'first') {
      return ['w100'];
    }
    if (postn == 'last') {
      return ['martop0', 'w100'];
    }
    if (postn == 'actionBtn') {
      return ['w100'];
    } else {
      return false;
    }
  }
}
