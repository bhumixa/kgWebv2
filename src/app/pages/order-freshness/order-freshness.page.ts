import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { DatabaseServiceService } from '../../service/database-service.service';
import { Storage } from '@ionic/storage';
import { ConfigServiceService } from '../../service/config-service.service';
import { HeaderFooterService } from '../../service/headerFooter/header-footer.service';
import { NavController } from '@ionic/angular';
import { FunctionsService } from '../../service/cart/functions/functions.service';
import { DetailsService } from '../../service/product/details.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-order-freshness',
  templateUrl: './order-freshness.page.html',
  styleUrls: ['./order-freshness.page.scss'],
})
export class OrderFreshnessPage implements OnInit {
  public data: any;
  public discount: any = 0;
  public taxes: any;
  public productData: any;
  public selectedVariantList = [];
  public userId;
  public sessionId: any;
  public cartId: any;

  constructor(
    public _detailsService: DetailsService,
    public _functionsService: FunctionsService,
    public _headerFooterService: HeaderFooterService,
    public _configService: ConfigServiceService,
    private route: ActivatedRoute,
    public storage: Storage,
    public databaseServiceService: DatabaseServiceService,
    private navCtrl: NavController,
    public router: Router,
    public alertCtrl: AlertController
  ) {
    this.route.queryParams.subscribe((params) => {
      if (params && params['data']) {
        this.data = JSON.parse(params['data']);
        this.data.newQuantity = this.data.quantity;
        // console.log("this.data ", this.data);
      }
    });
  }

  ngOnInit() {}

  // async newOrder() {
  //   // console.log("newOrder ");
  //   let alert = await this.alertCtrl.create({
  //     message: "Are you sure you want to continue?",
  //     buttons: [
  //       {
  //         text: "Cancel",
  //         role: "cancel",
  //         handler: () => {
  //           // console.log("Cancel clicked");
  //         }
  //       },
  //       {
  //         text: "Ok",
  //         handler: () => {
  //           // console.log("Ok clicked");
  //           this.cancelOrderProduct("product");
  //         }
  //       }]
  //     });
  //   alert.present();
  // }
  async cancelOrder() {
    // console.log("cancelProduct item ", this.data.quantity);
    if (this.data.quantity < 0) {
      await this._configService.presentToast(
        'Your cancelled quantity must be greater than 0',
        'error'
      );
    } else {
      let alert = await this.alertCtrl.create({
        // title: 'Confirm purchase',
        message:
          'Are you sure you want to cancel order of ' +
          this.data.title +
          ' with ' +
          this.data.quantity +
          ' pcs?',
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
              this.cancelOrderProduct('back');
            },
          },
        ],
      });
      alert.present();
    }
  }

  async cancelOrderProduct(redirectTo) {
    // console.log("cancelOrder ");
    let userId = await this.storage.get('userID');
    let jsonObj = {
      orderProductId: this.data.orderProductId,
      cancelledQuantity: this.data.quantity,
      refUserId: userId,
    };
    let res = await this.databaseServiceService.cancelOrderProduct(jsonObj);
    // console.log("res ", res);
    if (!!res && res.isSuccess) {
      await this._configService.presentToast(
        'Your order has been cancelled successfully',
        'success'
      );
    } else {
      if (redirectTo != 'product') {
        await this._configService.presentToast(res.error, 'error');
      }
    }
    if (redirectTo == 'product') {
      await this.singleProduct();
    } else {
      this.navCtrl.navigateBack('/');
    }
  }
  async singleProduct() {
    // let name = this.data.productName.replace(/\//g, "-");
    // name = name.replace(/ /g, "-").toLowerCase();
    // // console.log("name", name, " product.name ",this.data.productName);
    // this.navCtrl.navigateForward(["/products/" + this.data.productId + "/" + name]);
    await this.loadData(this.data.productId);
    await this.getProductTagsAndDiscount(this.data.productId);
    await this.directBuyNow();
  }
  async getProductTagsAndDiscount(data) {
    let userId = await this.storage.get('userID');
    // console.log("this.userId", userId);
    if (userId != null && userId != undefined) {
      let res = await this._detailsService.getProductTagsAndDiscount(
        data,
        null,
        userId,
        null
      );
      if (!!res.isSuccess) {
        this.discount = res.data.discount;
        if (this.discount?.toString().includes('%')) {
          this.discount.slice('%');
        }
        // console.log(" discount", this.discount);
      } else {
        //console.error("error", res.error);
      }
    }
  }

  async loadData(data) {
    // console.log("in load data", data);
    let userId = await this.storage.get('userID');
    let sessionId = await this.storage.get('sessionID');
    await this.databaseServiceService.showLoading();
    let res = await this._detailsService.getProductDetail(
      data,
      '',
      sessionId,
      userId
    );
    await this.databaseServiceService.hideLoading();
    if (!!res.isSuccess) {
      this.productData = res;
      // console.log("this.productData ", this.productData);
      if (this.productData.data[0].listOfParameter.length > 0) {
        this.productData.data[0].listOfParameter.forEach((element) => {
          // // console.log(">>>",element)
          if (element.paramName == 'Tax') {
            this.taxes = element.paramValue;
          }
        });
      }
    }
  }

  async directBuyNow() {
    //step 1 - add to cart
    //step 2 - check and set address
    //step 3 - go to manage order - direct buy
    let loggedInUser = await this.storage.get('loggedInUser');
    this.userId = await this.storage.get('userID');
    // console.log("this.userId", this.userId);
    this.sessionId = await this.storage.get('sessionID');
    // console.log("variant", this.sessionId);
    let validate = await this.validateControls();
    if (!validate) {
      await this._configService.showLoading();
      await this.createVariantList();
      if (!!this.taxes) {
        this.taxes = this.taxes.replace('%', '');
      } else {
        this.taxes = 0;
      }

      //let response = await this.databaseServiceService.getCartDetails(this.userId, this.sessionId);
      let response = await this._headerFooterService.getCartDetailsV1(
        this.userId,
        this.sessionId,
        0,
        10,
        '',
        '',
        true
      );
      if (!!response) {
        let cartData = response;
        let products = [];
        if (cartData.data.products) {
          products = cartData.data.products;
        }
        // let selectedProdInCart = cartData.data.filter(a => a.PvID == this.selectedVariant.id);
        let selectedProdInCart = [];
        this.cartId = products[0].refCartID;
        // cartData.data.filter(a => {
        //   this.selectedVariantList.filter(selectedV => {
        //     if (a.PvID == selectedV.id) {
        //       selectedProdInCart.push(a);
        //       this.selectedVariantList.splice(this.selectedVariantList.indexOf(selectedV), 1);
        //     }
        //   });
        // });
        await this._configService.hideLoading();
        // console.log("selectedProdInCart ", selectedProdInCart, this.selectedVariantList);
        // if (selectedProdInCart && selectedProdInCart.length > 0 && selectedProdInCart.length == this.selectedVariantList.length) {
        //   //product is already in cart, so dont add it

        //   if (loggedInUser) {
        //     //user is logged in
        //     // await this._configService.hideLoading();
        //     let navigationExtras: NavigationExtras = {
        //       queryParams: {
        //         view: "payment"
        //       }
        //     };
        //     this.router.navigate(["/manage-orders"], navigationExtras);
        //   } else {
        //     //user not is logged in
        //     // await this._configService.hideLoading();

        //     let navigationExtras: NavigationExtras = {
        //       queryParams: {
        //         to: "/manage-orders",
        //         view: "payment"
        //       }
        //     };
        //     this.router.navigate(["/sign-up"], navigationExtras);
        //   }
        // } else {

        let selectedVariantObj = [];
        this.selectedVariantList.forEach((v) => {
          selectedVariantObj.push({
            PvID: v.id,
            quantity: v.selectedQty,
            discount: this.discount,
            taxes: this.taxes,
          });
        });
        // console.log("selectedVariantObj ", selectedVariantObj);
        let res = await this._functionsService.addMultipleToCart(
          this.userId,
          this.sessionId,
          selectedVariantObj,
          ''
        );
        if (loggedInUser) {
          //user is logged in
          if (!!res.isSuccess) {
            // console.log("res", res);
            await this._configService.hideLoading();
            await this.applyScheme();
            let navigationExtras: NavigationExtras = {
              queryParams: {
                view: 'payment',
              },
            };
            this.router.navigate(['/manage-orders'], navigationExtras);
          } else {
            // console.log(res.error);
            await this._configService.hideLoading();
            await this._configService.presentToast(
              'Please try again.',
              'error'
            );
          }
        } else {
          //user not is logged in
          if (!!res.isSuccess) {
            // console.log("res", res);
            await this._configService.hideLoading();

            let navigationExtras: NavigationExtras = {
              queryParams: {
                to: '/manage-orders',
                view: 'payment',
              },
            };
            this.router.navigate(['/login-with-sign-up'], navigationExtras);
          } else {
            // console.log(res.error);
            await this._configService.hideLoading();
            await this._configService.presentToast(
              'Please try again.',
              'error'
            );
          }
        }
        // }
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
  }
  async createVariantList() {
    this.selectedVariantList = [];
    this.selectedVariantList.push({
      id: this.data.refPvID,
      selectedQty: this.data.newQuantity,
    });
  }

  async validateControls() {
    if (this.data.newQuantity > 0 && this.data.refPvID != undefined) {
      return false;
    } else {
      if (this.data.newQuantity <= 0) {
        this._configService.presentToast(
          'Please enter correct quantity',
          'error'
        );
        return true;
      } else {
        this._configService.presentToast('Please select the details', 'error');
        return true;
      }
    }
  }
}
