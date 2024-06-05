import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DatabaseServiceService } from '../../service/database-service.service';
import { ActivatedRoute } from '@angular/router';
import { NavController, Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { ConfigServiceService } from '../../service/config-service.service';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { Router, NavigationExtras } from '@angular/router';
import { ViewChild } from '@angular/core';
import { IonicSlides } from '@ionic/angular';
import * as CryptoJS from 'crypto-js';
import * as AES from 'crypto-js/aes';
//import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { ModalController, AlertController } from '@ionic/angular';
import { CompanyService } from './../../service/company/company.service';
import { HeaderFooterService } from './../../service/headerFooter/header-footer.service';
import { FunctionsService } from '../../service/cart/functions/functions.service';
import { PageService } from '../../service/page/page.service';
import { FavoriteService } from '../../service/product/favorite.service';
import { TranformImagesService } from '../../service/product/tranform-images.service';
import { NavigateService } from '../../service/product/navigate.service';
import { DetailsService } from '../../service/product/details.service';
import { CartService } from '../../service/observable/cart/cart.service';
import { ProductTitleService } from '../../service/observable/product-title/product-title.service';
import { HeaderFabService } from '../../service/observable/header-fab/header-fab.service';
import {
  Validators,
  UntypedFormBuilder,
  UntypedFormGroup,
  UntypedFormControl,
} from '@angular/forms';
import { AnalyticsService } from 'src/app/service/analytics.service';
import { ElasticsearchService } from 'src/app/service/elasticsearch/elasticsearch.service';

@Component({
  selector: 'app-product-summary-comp',
  templateUrl: './product-summary-comp.component.html',
  styleUrls: ['./product-summary-comp.component.scss'],
})
export class ProductSummaryCompComponent implements OnInit {
  @Input() pageName: any;
  @Input() id: any;
  @Output() dataLoadedFn: EventEmitter<any> = new EventEmitter();
  @ViewChild('imageViewSlider', { static: false }) slides: typeof IonicSlides;
  @ViewChild('slideWithNav2', { static: false })
  slideWithNav2: typeof IonicSlides;
  @ViewChild('slider', { static: false }) slides1: typeof IonicSlides;

  opt = {
    zoom: {
      maxRatio: 2,
    },
  };
  public validations_form: UntypedFormGroup;
  public productData: any;
  public isCatalog = true;
  public userId;
  public hideFavourites: any = false;
  public hideBuyNowButton: any = false;
  public segmentSelected: any;
  public listOfProductVariantType = [];
  public productTitle: any;
  public productPrice: any;
  public selectedVariant: any;
  public selectedVariantType1: any;
  public selectedVariantType2: any;
  public selectedQty = 1;
  public sessionId: any;
  public listOfVariantType1 = [];
  public listOfVariantType2 = [];
  public tags: any;
  public discount: any = 0;
  public discountPrice: any;
  public finalPrice: any;
  public onMobile: any;
  public taxes: any;
  public dataValue: any = null;
  public reportNo: any = null;
  public pincode = '';
  public pincodeResult: any;
  public compareAtPrice: any;
  public compareDiscount: any;
  public imageView = false;
  public productPage: any;
  public showDescription = true;
  public showDeliveryOption = false;
  public showSKU = false;
  public showProductWiseDeliveryOption = false;
  public productPageDetails: any;
  public seeMoreIn = [];
  public selectedVariantList = [];
  public variantList = [];
  public cartDetails = [];
  public companyLogo: any;
  public productSchemes = [];
  public loadMediaDetails: boolean = false;
  public customerTag: any;
  public cartId: any;
  public hidePrice: any;
  public productNavigationList: any;
  public canGoNext = true;
  public canGoPrev = true;
  public searchResultColumns: any = [];
  public hits: any = [];
  public productType = this._companyService.companyObj.productType || 'product';
  public loggedInUser: any;
  public segments: any;
  public buttonDisabled = false;
  public buyNowbuttonDisabled = false;
  public showResellerOption = false;
  public resellers: any;
  public resellerPinCode: any;
  public WABaseURL = '';
  public directWAInquiryURL = '';
  public directWAInquiryNumber = '';
  public showDirectWAInquiry = false;
  public selectedParentCustomerId;
  public parentCustomers;
  public encryptSecretKey = 'StorefrontEncrypt';
  public socialMediaShareLink = '';
  public shareInvite = false;
  public showShareOnProductDetails = false;
  public hideVarientParametersOnDetailPage = false;
  public hideStorePrice = false;
  public baseURL = '';
  public transformationTypes = [];
  public dynamicWidth = 285;
  public sliderOpt = {
    zoom: {
      maxRatio: 2,
    },
  };
  slideOptsTwo = {
    initialSlide: 1,
    slidesPerView: 3,
    loop: true,
    centeredSlides: true,
    // spaceBetween: 2,
    // zoom: {
    //   maxRatio: 2
    // }
  };
  public quickBuy = false;
  public screenWidth: any;
  public allViewActions: any = this._companyService.allActions;
  public showProductId = false;
  public showHaveAQuestionForm = false;
  public header: any;
  public location;
  defaultSelected: number = 0;
  constructor(
    public _detailsService: DetailsService,
    public _navigateService: NavigateService,
    public _tranformImagesService: TranformImagesService,
    public _favoriteService: FavoriteService,
    public _pageService: PageService,
    public _functionsService: FunctionsService,
    public _headerFooterService: HeaderFooterService,
    public _companyService: CompanyService,
    public _cartService: CartService,
    public _productTitleService: ProductTitleService,
    public _headerFabService: HeaderFabService,
    //private socialSharing: SocialSharing,
    public platform: Platform,
    public storage: Storage,
    private route: ActivatedRoute,
    public databaseServiceService: DatabaseServiceService,
    public navCtrl: NavController,
    public configService: ConfigServiceService,
    private router: Router,
    public modalController: ModalController,
    public alertController: AlertController,
    public formBuilder: UntypedFormBuilder,
    public analyticsService: AnalyticsService,
    public elasticSearchService: ElasticsearchService
  ) {
    this.platform.ready().then(() => {
      // console.log("this.platform", this.platform);
      if (this.platform.is('desktop') || this.platform.is('mobileweb')) {
        this.onMobile = false;
      } else {
        this.onMobile = true;
      }
      // console.log("this.onMobile", this.onMobile);
      this.screenWidth = this.platform.width();
    });
    this.setConfig();

    if (!!this.route.snapshot.paramMap.get('id')) {
      let title = this.route.snapshot.paramMap.get('title');
      this.dataValue = this.route.snapshot.paramMap.get('id');
      this.location = this.route.snapshot.paramMap.get('location');
    }

    if (!!this.route.snapshot.paramMap.get('reportNo')) {
      this.reportNo = this.route.snapshot.paramMap.get('reportNo');
    }

    if (this.platform.is('desktop')) {
      // let userId = this.route.snapshot.paramMap.get("userId");
      // alert(userId)

      this.onMobile = false;
      this.WABaseURL = 'https://api.whatsapp.com/send?phone=';
    } else {
      this.onMobile = true;
      this.WABaseURL = 'https://api.whatsapp.com/send?phone=';
    }

    this.storage.get('loggedInUser').then((val) => {
      this.loggedInUser = val;
    });

    this.productNavigationList = this._navigateService.productDetailPageList;
    if (this.productNavigationList && this.productNavigationList.length > 0) {
      this.setNextPrev();
    }
    // console.log("id via route", data, title, this.id, this.pageName);
    // if (data != null) {
    //   this.loadData(data);
    //   this.getProductTagsAndDiscount(this.dataValue);
    //   // console.log("this.userId ",this.userId);
    // }

    // console.log("in product summary Component", data);
    this.validations_form = this.formBuilder.group({
      phone: new UntypedFormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.maxLength(10),
          Validators.minLength(10),
          Validators.pattern('^[6-9][0-9]{9}$'),
        ])
      ),
    });
  }
  validation_messages = {
    phone: [
      { type: 'required', message: 'Phone no is required.' },
      { type: 'minlength', message: 'Phone no must be 10 digits long.' },
      {
        type: 'maxlength',
        message: 'Phone no cannot be more than 10 digits long.',
      },
      { type: 'pattern', message: 'Phone no must start with 6,7,8 or 9.' },
    ],
  };

  async getTransformationTypes() {
    let res: any;
    res = await this._tranformImagesService.getTransformationTypes();
    if (res.status == 0) {
      // console.log("error");
    } else {
      let json = res.data;
      this.transformationTypes = json;
    }
  }

  async shareViawhatsapp() {
    // this.socialSharing.shareViaWhatsApp(this.socialMediaShareLink).then(() => {
    //   // console.log("shared");
    // });
  }

  getNumbers(item) {
    if (item > 0) {
      // Create an array of length 'item' filled with 1s
      return Array(item).fill(1);
    } else {
      // Return an empty array when item is not greater than 0
      return [];
    }
  }

  segmentChanged(ev: any) {
    let temp = this.segmentSelected;
    this.segmentSelected = '';
    this.router.navigateByUrl(temp);
  }

  async directBuyNow() {
    this.buyNowbuttonDisabled = true;
    let loggedInUser = await this.storage.get('loggedInUser');
    this.userId = await this.storage.get('userID');
    // console.log("this.userId", this.userId);
    this.sessionId = await this.storage.get('sessionID');
    // console.log("variant", this.selectedVariant, this.sessionId);
    let validate = await this.validateControls();
    if (!validate) {
      await this.configService.showLoading();
      await this.createVariantList();
      if (!!this.taxes) {
        this.taxes = this.taxes.replace('%', '');
      } else {
        this.taxes = 0;
      }

      let response = await this._headerFooterService.getCartDetailsV1(
        this.userId,
        this.sessionId,
        0,
        50,
        this.productTitle,
        '',
        true
      );
      // if (!!response) {
      //   let cartData = response;
      //   let products = [];
      //   if(cartData.data.products){
      //     products = cartData.data.products
      //   }
      //   //if (!cartData.data.products) cartData.data.products = [];
      //   this.cartDetails = products;
      //   // console.log("cartDetails ", this.cartDetails);
      // }
      if (!!response) {
        let cartData = response;
        let products = [];
        if (cartData.data.products) {
          products = cartData.data.products;
        }
        // let selectedProdInCart = cartData.data.filter(a => a.PvID == this.selectedVariant.id);
        let selectedProdInCart = [];
        if (products.length > 0) {
          this.cartId = cartData.data.products[0].refCartID;
          // console.log(this.cartId);
        }
        products.filter((a) => {
          this.selectedVariantList.filter((selectedV) => {
            if (a.pvid == selectedV.id) {
              selectedProdInCart.push(a);
              this.selectedVariantList.splice(
                this.selectedVariantList.indexOf(selectedV),
                1
              );
            }
          });
        });
        await this.configService.hideLoading();
        // console.log("selectedProdInCart ", selectedProdInCart, this.selectedVariantList);
        if (
          selectedProdInCart &&
          selectedProdInCart.length > 0 &&
          selectedProdInCart.length == this.selectedVariantList.length
        ) {
          //product is already in cart, so dont add it

          if (loggedInUser) {
            //user is logged in
            await this.configService.hideLoading();
            let navigationExtras: NavigationExtras = {
              queryParams: {
                view: 'bag',
              },
            };
            this.router.navigate(['/manage-orders'], navigationExtras);
          } else {
            //user not is logged in
            await this.configService.hideLoading();

            if (this.quickBuy) {
              this.router.navigate(['/quick-buy']);
            } else {
              let navigationExtras: NavigationExtras = {
                queryParams: {
                  to: '/manage-orders',
                  view: 'bag',
                },
              };
              this.router.navigate(['/login-with-sign-up'], navigationExtras);
            }
          }
        } else {
          let selectedVariantObj = [];
          this.selectedVariantList.forEach((v) => {
            let selectedAddOns = [];
            if (
              !!v.listOfProductVariantAddOns &&
              v.listOfProductVariantAddOns.length > 0
            ) {
              v.listOfProductVariantAddOns.filter((addOn) => {
                if (addOn.selected && selectedAddOns.indexOf(addOn.id) == -1) {
                  selectedAddOns.push(addOn.id);
                }
              });
            }
            let objToPush: any = {
              PvID: v.id,
              quantity: v.selectedQty,
              discount: this.discount,
              taxes: this.taxes,
              sessionId: this.sessionId,
              userId: this.userId,
              selectedAddOns: selectedAddOns,
            };
            if (!!this.selectedParentCustomerId)
              objToPush.customerTags = [
                'child_of_' + this.selectedParentCustomerId,
              ];
            selectedVariantObj.push(objToPush);
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
              this.buyNowbuttonDisabled = false;
              await this._headerFooterService.cartValueUpdated();
              await this.configService.hideLoading();
              if (this.listOfVariantType2.length > 0) {
                if (this.listOfVariantType1.length > 0) {
                  this.listOfVariantType1.forEach((v1) => {
                    let v2list = JSON.parse(
                      JSON.stringify(this.listOfVariantType2)
                    );
                    v2list.forEach((v2) => {
                      v2.quantity = '-';
                    });
                    v1.secondVariantList = v2list;
                  });
                }
              }
              await this.applyScheme();
              let navigationExtras: NavigationExtras = {
                queryParams: {
                  view: 'bag',
                },
              };
              this.router.navigate(['/manage-orders'], navigationExtras);
            } else {
              this.buyNowbuttonDisabled = false;
              // console.log(res.error);
              await this.configService.hideLoading();
              await this.configService.presentToast(
                'Please try again.',
                'error'
              );
            }
          } else {
            this.buyNowbuttonDisabled = false;
            //user not is logged in
            if (!!res.isSuccess) {
              // console.log("res", res);
              await this.configService.hideLoading();
              if (this.quickBuy) {
                this.router.navigate(['/quick-buy']);
              } else {
                let navigationExtras: NavigationExtras = {
                  queryParams: {
                    to: '/manage-orders',
                    view: 'bag',
                  },
                };
                this.router.navigate(['/login-with-sign-up'], navigationExtras);
              }
            } else {
              // console.log(res.error);
              await this.configService.hideLoading();
              await this.configService.presentToast(
                'Please try again.',
                'error'
              );
            }
          }
        }
      }
    }
  }
  async setConfig() {
    if (
      this._companyService.companyObj &&
      this._companyService.companyObj &&
      this._companyService.companyObj.config
    ) {
      let companyJson = this._companyService.companyObj.config;
      if (!!this._companyService.companyObj.companyLogo) {
        this.companyLogo = this._companyService.companyObj.companyLogo;
      }
      if (!!companyJson) {
        if (!!companyJson) {
          if (
            typeof companyJson.showDescriptionOnProductDetail != 'undefined'
          ) {
            this.showDescription = companyJson.showDescriptionOnProductDetail;
          }
          if (!!companyJson.showCheckDeliveryOnProductDetail) {
            this.showDeliveryOption =
              companyJson.showCheckDeliveryOnProductDetail;
          }
          if (!!companyJson.showSKU) {
            this.showSKU = companyJson.showSKU;
          }

          if (!!companyJson.showProductWiseCheckDeliveryOnProductDetail) {
            this.showProductWiseDeliveryOption =
              companyJson.showProductWiseCheckDeliveryOnProductDetail;
          }
          if (!!companyJson.showResellerOption) {
            this.showResellerOption = companyJson.showResellerOption;
          }
          if (!!companyJson.showDirectWAInquiry) {
            this.showDirectWAInquiry = companyJson.showDirectWAInquiry;
            this.directWAInquiryNumber = companyJson.directWAInquiryNumber;
          }
          if (!!companyJson.export) {
            if (!!companyJson.export.searchResultColumns) {
              this.searchResultColumns = companyJson.export.searchResultColumns;
            }
          }
          if (!!companyJson.baseURL) {
            this.baseURL = companyJson.baseURL;
          }
          if (!!companyJson.shareInvite) {
            this.shareInvite = companyJson.shareInvite;
          }
          if (!!companyJson.showShareOnProductDetails) {
            this.showShareOnProductDetails =
              companyJson.showShareOnProductDetails;
          }
          if (!!companyJson.productPage && this.productType != 'diamond') {
            this.productPage = companyJson.productPage;
            await this.getProductPageDetails();
          }
          if (typeof companyJson.hideFavourites != 'undefined') {
            this.hideFavourites = companyJson.hideFavourites;
          }
          if (typeof companyJson.hideBuyNowButton != 'undefined') {
            this.hideBuyNowButton = companyJson.hideBuyNowButton;
          }
          if (
            !!companyJson &&
            companyJson.loggedInUserHeaderLinks &&
            this.loggedInUser
          ) {
            this.segments = companyJson.loggedInUserHeaderLinks;
          } else if (!!companyJson && companyJson.homePageHeaderLinks) {
            this.segments = companyJson.homePageHeaderLinks;
          }

          if (!!companyJson.hideStorePrice) {
            this.hideStorePrice = companyJson.hideStorePrice;
          }
          if (!!companyJson.hideVarientParametersOnDetailPage) {
            this.hideVarientParametersOnDetailPage =
              companyJson.hideVarientParametersOnDetailPage;
          }
          if (!!companyJson.quickBuy) {
            this.quickBuy = companyJson.quickBuy;
          }
          if (!!companyJson.showProductId) {
            this.showProductId = companyJson.showProductId;
          }
          if (!!companyJson.showHaveAQuestionForm) {
            this.showHaveAQuestionForm = companyJson.showHaveAQuestionForm;
          }
          if (!!companyJson && companyJson.header) {
            this.header = companyJson.header;
          }
        }
      }
    }
  }

  async checkDelivery() {
    if (!!this.pincode) {
      let res: any = await this.databaseServiceService.checkDelivery(
        this.pincode
      );
      res = res._body.replace("fillPincode('", '').replace("');", '');
      this.pincodeResult = res;
    } else {
      this.pincodeResult = '';
    }
  }
  async findDealers() {
    if (!!this.resellerPinCode) {
      let res: any;
      if (isNaN(this.resellerPinCode)) {
        res = await this.databaseServiceService.getResellersByCity(
          this.resellerPinCode
        );
      } else {
        res = await this.databaseServiceService.getResellers(
          this.resellerPinCode
        );
      }
      if (res.isSuccess) {
        this.resellers = res.data.map((a) => {
          let number;
          if (a.contactNumber) {
            if (a.contactNumber.includes(',')) {
              let n = a.contactNumber.split(',')[0];
              number = n[0];
            } else {
              number = a.contactNumber;
            }
          }
          if (
            this.platform.is('ios') ||
            this.platform.is('ipad') ||
            this.platform.is('iphone')
          ) {
            a.WAURL =
              'https://wa.me/' +
              number +
              '/?text=I am Interested in ' +
              this.productTitle;
          } else {
            a.WAURL =
              this.WABaseURL +
              number +
              '&text=I am Interested in ' +
              this.productTitle;
          }
          return a;
        });
      } else {
      }
    } else {
      this.resellerPinCode = '';
    }
  }

  async checkDeliveryProductWise() {
    if (!!this.pincode) {
      //get data from product parameter master
      let res: any = await this.databaseServiceService.checkDelivery(
        this.pincode
      );
      if (
        res._body ==
        "fillPincode('Cash on Delivery Service available only in India. Please enter a six digit pincode.');"
      ) {
        this.pincodeResult =
          'Cash on Delivery Service available only in India. Please enter a six digit pincode.';
      } else {
        res = res._body
          .replace("fillPincode('", '')
          .replace(
            "<br>Yeah! We deliver to your pincode. Cash On Delivery (CoD) Service <b>is available!</b>.');",
            ''
          );
        res = 'To Deliver at ' + res + ' it will take 7 days';
        this.pincodeResult = res;
      }
    } else {
      this.pincodeResult = '';
    }
  }

  async checkParams() {
    this.route.queryParams.subscribe((params) => {
      if (params && params['ref']) {
        let bytes = CryptoJS.AES.decrypt(
          decodeURI(params['ref']),
          'StorefrontEncrypt'
        );
        let id = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        // console.log(id);
        this.storage.set('sharedBy', id);
      }
      return;
    });
  }

  async ngOnInit() {
    await this.checkParams();
    await this._companyService.checkAndRedirectForStoreType();

    this.resellerPinCode = await this.storage.get('pincode');
    await this.getTransformationTypes();
    // console.log("idddd", this.dataValue, this.id, this.pageName);
    if (!this.dataValue && !!this.id) {
      this.dataValue = this.id;
    }
    if (this.dataValue != null && this.dataValue != undefined) {
      await this.loadData(this.dataValue, this.location);

      if (!!this.userId) await this.getParentCustomers();
      else await this.getProductTagsAndDiscount(this.dataValue);

      // let resCreateInquiry: any = await this.databaseServiceService.createInquiry(
      //   {
      //     refUserId: this.userId,
      //     refProductID: this.dataValue
      //   },
      //   "Product View"
      // );
    }

    if (!!this.reportNo) {
      await this.loadDataWithReportNo(this.reportNo);

      if (!!this.userId) await this.getParentCustomers();
      else await this.getProductTagsAndDiscount(this.dataValue);
    }

    this.configService.setTitle(this.productTitle);

    // // console.log("pageName", this.pageName);
    if (!!this.directWAInquiryNumber && !!this.showDirectWAInquiry) {
      if (this.onMobile) {
        if (
          this.platform.is('ios') ||
          this.platform.is('ipad') ||
          this.platform.is('iphone')
        ) {
          this.directWAInquiryURL =
            'https://wa.me/' +
            this.directWAInquiryNumber +
            '/?text=I am Interested in ' +
            this.productTitle;
        } else {
          this.directWAInquiryURL =
            'https://api.whatsapp.com/send?phone=' +
            this.directWAInquiryNumber +
            '&text=I am Interested in ' +
            this.productTitle;
        }
      } else {
        this.directWAInquiryURL =
          'https://api.whatsapp.com/send?phone=' +
          this.directWAInquiryNumber +
          '&text=I am Interested in ' +
          this.productTitle;
      }
    }
  }
  async ionViewDidEnter() {
    this.segmentSelected = '';
    if (!!this.userId) {
      await this.fetchFavorites(this.userId);
    }
  }

  ngOnDestroy() {
    this.segmentSelected = '';
  }

  async buyNow() {
    this.buttonDisabled = true;
    // console.log("selected variants ", this.selectedVariant, " ", this.listOfVariantType1);
    await this.createVariantList();
    this.userId = await this.storage.get('userID');
    // console.log("this.userId", this.userId);
    this.sessionId = await this.storage.get('sessionID');
    // console.log("variant", this.selectedVariant, this.sessionId, this.selectedVariantList);
    let validate = await this.validateControls();
    if (!validate) {
      await this.configService.showLoading();
      if (!!this.taxes) {
        this.taxes = this.taxes.replace('%', '');
      } else {
        this.taxes = 0;
      }

      let selectedVariantObj = [];
      this.selectedVariantList.forEach((v) => {
        let selectedAddOns = [];
        if (
          !!v.listOfProductVariantAddOns &&
          v.listOfProductVariantAddOns.length > 0
        ) {
          v.listOfProductVariantAddOns.filter((addOn) => {
            if (addOn.selected && selectedAddOns.indexOf(addOn.id) == -1) {
              selectedAddOns.push(addOn.id);
            }
          });
        }
        let objToPush: any = {
          PvID: v.id,
          quantity: v.selectedQty,
          discount: this.discount,
          taxes: this.taxes,
          sessionId: this.sessionId,
          userId: this.userId,
          selectedAddOns: selectedAddOns,
        };
        if (!!this.selectedParentCustomerId)
          objToPush.customerTags = [
            'child_of_' + this.selectedParentCustomerId,
          ];
        selectedVariantObj.push(objToPush);
      });
      // console.log("selectedVariantObj ", selectedVariantObj);
      // console.log(this.taxes);

      let res = await this._functionsService.addMultipleToCart(
        this.userId,
        this.sessionId,
        selectedVariantObj,
        ''
      );
      if (!!res.isSuccess) {
        // console.log("res", res);
        this.buttonDisabled = false;
        await this._headerFooterService.cartValueUpdated();
        await this.configService.hideLoading();
        if (this.listOfVariantType2.length > 0) {
          if (this.listOfVariantType1.length > 0) {
            this.listOfVariantType1.forEach((v1) => {
              let v2list = JSON.parse(JSON.stringify(this.listOfVariantType2));
              v2list.forEach((v2) => {
                v2.quantity = '-';
              });
              v1.secondVariantList = v2list;
            });
          }
        }
        // await this.configService.presentToast("Product added to cart successfully", "success");
        this.openCart();
      } else {
        this.buttonDisabled = false;
        // console.log(res.error);
        await this.configService.hideLoading();
        await this.configService.presentToast('Please try again.', 'error');
      }
    }
    // .then(response => {}, err => console.error(err));
  }

  createVariantList() {
    this.selectedVariantList = [];
    if (
      this.productData.data[0].listOfVariants.length == 1 &&
      this.productData.data[0].listOfVariants[0].listOfProductVariantParameter
        .length == 0
    ) {
      //if there is only 1 variant with no parameters then consider its quantity as 1
      this.productData.data[0].listOfVariants[0].selectedQty = 1;
      this.selectedVariantList.push(this.productData.data[0].listOfVariants[0]);
    } else {
      // for more than 1 variants
      this.productData.data[0].listOfVariants.filter((variant) => {
        if (variant.listOfProductVariantParameter.length > 0) {
          this.listOfVariantType1.forEach((v1) => {
            if (
              variant.listOfProductVariantParameter.findIndex(
                (i) => i.id === v1.id
              ) > -1 &&
              !!v1.secondVariantList &&
              v1.secondVariantList.length > 0
            ) {
              //if variant has 2 parameters then use the quantity entered by the user for the second parameter for all the variants
              v1.secondVariantList.forEach((v2) => {
                if (
                  variant.listOfProductVariantParameter.findIndex(
                    (i) => i.id === v2.id
                  ) > -1 &&
                  v2.quantity != '-' &&
                  v2.quantity > 0
                ) {
                  variant.selectedQty = v2.quantity;
                  if (this.selectedVariantList.indexOf(variant) == -1) {
                    this.selectedVariantList.push(variant);
                  }
                }
              });
            }
            // else if (variant.listOfProductVariantParameter.findIndex(i => i.id === v1.id) > -1 && variant.listOfProductVariantParameter.length == 1) {
            //   //if the variant has only 1 parameter then consider its selected quantity as 1
            //       // console.log(this.selectedVariantList)
            //   variant.selectedQty = 1;
            //   if (this.selectedVariantList.indexOf(variant) == -1) {
            //     this.selectedVariantList.push(variant);
            //   }
            // }
          });
        }
      });
    }
    //if no variant is selected, then select first variant with 1 quantity
    if (this.selectedVariantList.length == 0) {
      this.selectedVariant.selectedQty = 1;
      this.selectedVariantList.push(this.selectedVariant);
    }
    // console.log("this.selectedVariantList ", this.selectedVariantList);
  }

  async afterloadData(res: any, productId: any) {
    this.dataLoadedFn.emit();

    if (!!res.isSuccess) {
      this.productData = res;
      // console.log(this.productData);
      if (
        this.productData.data[0] &&
        this.productData.data[0].listOfProductImages
      ) {
        this.productData.data[0].isBeginningSlide = true;
        this.productData.data[0].isEndSlide = false;

        this.productData.data[0].listOfProductImages =
          this.productData.data[0].listOfProductImages.filter(
            (image) => image.isCoverImage !== true
          );

        this.productData.data[0].listOfProductImages.map((i) => {
          if (i.transformType) {
            let value = this.transformationTypes.filter(
              (t) => t.name == i.transformType
            )[0].values;
            i['transformationValue'] = value;
            return i;
          }
          if (i.transformType_slider) {
            let value = this.transformationTypes.filter(
              (t) => t.name == i.transformType_slider
            )[0].values;
            i['sliderTransformationValue'] = value;
            return i;
          }
        });
      }

      this.hits = this.productData.data.map((stoneDetails: any) => {
        if (stoneDetails.ColorCode.toLowerCase() === 'fancy') {
          const color = this.elasticSearchService.check_colorCode_fancy(
            stoneDetails['FancyColorCode'],
            stoneDetails['FancyColorIntensityCode'],
            stoneDetails['FancyColorOvertoneCode'],
            stoneDetails['ColorCode']
          );

          stoneDetails['ColorCode'] = color;
        }
        return stoneDetails;
      });

      let userdata = await this.storage.get('userData');

      const externalProduct =
        this._companyService.companyObj.config.externalProduct;

      // console.log("this.productData ", this.productData);
      // await this.getCartDetails();

      // event for stone View

      if (this.hits.length > 0) {
        let stoneDetails = {
          stoneName: this.hits[0].name,
          Shape: this.hits[0].ShapeCode,
          Color: this.hits[0].ColorCode,
          Clarity: this.hits[0].ClarityCode,
          Size: this.hits[0].cts,
          Cut: this.hits[0].CutCode,
          Polish: this.hits[0].PolishCode,
          Symmetry: this.hits[0].SymmetryCode,
          Lab: this.hits[0].lab,
          Amount: !!this.hits[0][externalProduct.kgAppliedAmount]
            ? Number(this.hits[0][externalProduct.kgAppliedAmount])
            : 0,
          Price: !!this.hits[0][externalProduct.kgAppliedPrice]
            ? Number(this.hits[0][externalProduct.kgAppliedPrice])
            : 0,
          Discount: !!this.hits[0][externalProduct.kgAppliedDiscount]
            ? Number(this.hits[0][externalProduct.kgAppliedDiscount])
            : 0,
          User: !!userdata?.name ? userdata.name : '-',
          Mobile: !!userdata?.username ? userdata.username : '-',
          Email: !!userdata?.email ? userdata.email : '-',
          'Sales Person Name': !!userdata?.parameter
            ? JSON.parse(userdata?.parameter)?.userAccount?.salesperson?.name ||
              '-'
            : '-',
        };

        let payload = {
          userId: this.userId || '-',
          stoneName: this.hits[0].name,
          stoneData: stoneDetails,
          Shpae: this.hits[0].ShapeCode,
          Color: this.hits[0].ColorCode,
          Clarity: this.hits[0].ClarityCode,
          Size: this.hits[0].cts,
          Cut: this.hits[0].CutCode,
          Polish: this.hits[0].PolishCode,
          Symmetry: this.hits[0].SymmetryCode,
          Lab: this.hits[0].lab,
          Fluorescence: this.hits[0].FluorescenceCode,
          Amount: !!this.hits[0][externalProduct.kgAppliedAmount]
            ? Number(this.hits[0][externalProduct.kgAppliedAmount])
            : 0,
          Price: !!this.hits[0][externalProduct.kgAppliedPrice]
            ? Number(this.hits[0][externalProduct.kgAppliedPrice])
            : 0,
          Discount: !!this.hits[0][externalProduct.kgAppliedDiscount]
            ? Number(this.hits[0][externalProduct.kgAppliedDiscount])
            : 0,
          User: userdata?.name ? userdata.name : '-',
          Mobile: !!userdata?.username ? userdata.username : '-',
          Email: !!userdata?.email ? userdata.email : '-',
          'Sales Person Name': !!userdata?.parameter
            ? JSON.parse(userdata?.parameter)?.userAccount?.salesperson?.name ||
              '-'
            : '-',
        };
        // this.hits[0].Rapnet_pluspercarat;
        // this.hits[0].Rapnet_plus;
        // this.hits[0].Rapnet_plusDiscountPercent,

        // console.table({
        //   amount: this.hits[0][externalProduct.kgAppliedAmount],
        //   price: this.hits[0][externalProduct.kgAppliedPrice],
        //   discount: this.hits[0][externalProduct.kgAppliedDiscount],
        //   kgAppliedAmount: externalProduct.kgAppliedAmount,
        //   kgAppliedPrice: externalProduct.kgAppliedPrice,
        //   kgAppliedDiscount: externalProduct.kgAppliedDiscount,
        // });

        if (
          !!this.hits[0][externalProduct.kgAppliedAmount] &&
          !!this.hits[0][externalProduct.kgAppliedPrice]
        ) {
          this.analyticsService.addEvents('Stone View', payload);
        }
      }

      if (
        this.productData.data[0] &&
        this.productData.data[0].listOfProductVariantParameters
      ) {
        // console.log("--");
        //add variant parameter names in array
        this.productData.data[0].listOfProductVariantParameters.filter(
          (variantParam) => {
            if (
              this.listOfProductVariantType.findIndex(
                (i) => i.name === variantParam.name
              ) === -1
            ) {
              this.listOfProductVariantType.push({
                name: variantParam.name,
              });
            }
          }
        );
        //add variant parameter values in array. Suppose there are 2 different parameters
        //then 2 arrays will be created
        if (this.listOfProductVariantType.length > 0) {
          this.productData.data[0].listOfProductVariantParameters.filter(
            (variantParam) => {
              //check if variant is present in cart

              // console.log(this.cartDetails);

              if (!!this.cartDetails && this.cartDetails.length > 0) {
                // console.log(this.cartDetails);
                let index = this.cartDetails.findIndex(
                  (c) => c.pvid === variantParam.refPvID
                );
                // console.log(index);
                //
                if (index > -1) {
                  variantParam.cartQuantity = this.cartDetails[index].quantity;
                  variantParam.isPresentInCart = true;
                } else {
                  variantParam.cartQuantity = 0;
                  variantParam.isPresentInCart = false;
                }
              }

              if (
                this.listOfProductVariantType[0].name === variantParam.name &&
                this.listOfVariantType1.findIndex(
                  (i) => i.id === variantParam.id
                ) == -1
              ) {
                this.listOfVariantType1.push(variantParam);
              } else if (
                this.listOfProductVariantType[0].name !== variantParam.name &&
                this.listOfVariantType2.findIndex(
                  (i) => i.id === variantParam.id
                ) == -1
              ) {
                this.listOfVariantType2.push(variantParam);
              }
            }
          );
        }
        // console.log("variant types", this.listOfVariantType1, this.listOfVariantType2);
      }
      //assign the initial values of product
      this.productTitle = this.productData.data[0].name;
      let encodedProductTitle = encodeURI(
        this.productTitle
          .replace(/\//g, '-')
          .replace(/\s+/g, '-')
          .replace(/"/g, '')
          .replace(/'/g, '')
          .replace(/\(|\)/g, '')
          .toLowerCase()
      );
      let options = {
        stoneName: this.productTitle,
        removeTitlecase: true,
      };
      this._productTitleService.observables.next(options);
      if (this.shareInvite) {
        this.userId = await this.storage.get('userID');
        let d = CryptoJS.AES.encrypt(
          JSON.stringify(this.userId),
          'StorefrontEncrypt'
        ).toString();
        this.socialMediaShareLink =
          this.baseURL +
          '/products/' +
          this.productData.data[0].id +
          '/' +
          encodedProductTitle +
          '?ref=' +
          encodeURI(d);
      } else {
        this.socialMediaShareLink =
          this.baseURL +
          '/products/' +
          this.productData.data[0].id +
          '/' +
          encodedProductTitle;
      }
      //this.socialMediaShareLink = encodeURI(this.socialMediaShareLink);s
      if (
        this.productData.data[0] &&
        this.productData.data[0].listOfVariants[0]
      ) {
        this.selectedVariant = this.productData.data[0].listOfVariants[0];
        this.productPrice = this.selectedVariant.price;
        this.compareAtPrice = this.selectedVariant.compareAtPrice;
        if (!!this.compareAtPrice && this.compareAtPrice > 0) {
          this.compareDiscount =
            ((this.compareAtPrice - this.productPrice) / this.compareAtPrice) *
            100;
          this.compareDiscount = this.compareDiscount.toFixed(0);
        }
        // console.log("this.productPrice>>", this.productPrice, this.compareAtPrice);

        if (
          this.productData.data[0].listOfVariants[0]
            .listOfProductVariantParameter.length > 0
        ) {
          this.selectedVariantType1 =
            this.productData.data[0].listOfVariants[0].listOfProductVariantParameter[0];
          if (
            this.productData.data[0].listOfVariants[0]
              .listOfProductVariantParameter.length > 1
          ) {
            this.selectedVariantType2 =
              this.productData.data[0].listOfVariants[0].listOfProductVariantParameter[1];
          }
        }
      }
      //show the first variant parameters as selected
      if (this.listOfVariantType1.length > 0) {
        this.listOfVariantType1[0].isSelected = true;
        this.selectedVariantType1 = this.listOfVariantType1[0];
      }
      if (this.listOfVariantType2.length > 0) {
        if (this.listOfVariantType1.length > 0) {
          this.listOfVariantType1.forEach((v1) => {
            let v2list = JSON.parse(JSON.stringify(this.listOfVariantType2));
            v2list.forEach((v2) => {
              v2.quantity = '-';
            });
            v1.secondVariantList = v2list;
          });
        }
        this.listOfVariantType2[0].isSelected = true;
        this.selectedVariantType2 = this.listOfVariantType2[0];
      }
      // console.log("this.listOfVariantType1 ", this.listOfVariantType1);
      // Fetch Total Taxes value for product
      if (this.productData.data[0].listOfParameter.length > 0) {
        this.productData.data[0].listOfParameter.forEach((element) => {
          // // console.log(">>>",element)
          if (element.paramName == 'Tax') {
            this.taxes = element.paramValue;
          }
          if (element.paramName == 'Hide Price') {
            this.hidePrice = element.paramValue;
          }
        });
        let manufacturer = this.productData.data[0].listOfParameter.filter(
          (element) => {
            if (element.paramName == 'Manufacturer') {
              return element;
            }
          }
        );
        let color = this.productData.data[0].listOfParameter.filter(
          (element) => {
            if (element.paramName == 'Color') {
              return element;
            }
          }
        );
        let category = this.productData.data[0].listOfParameter.filter(
          (element) => {
            if (element.paramName == 'Category') {
              return element;
            }
          }
        );
        if (!!manufacturer && manufacturer.length > 0) {
          if (manufacturer[0].paramValue != 'Others') {
            let nameArr = [];
            nameArr.push(manufacturer[0].paramValue);
            let query = {
              filters: [
                {
                  f: [
                    {
                      Manufacturer: nameArr,
                    },
                  ],
                },
              ],
            };
            this.seeMoreIn.push({
              label: manufacturer[0].paramValue,
              filters: query,
            });
          }
        }
        if (!!color && color.length > 0 && !!category && category.length > 0) {
          let nameArr = [],
            categoryValue = [];
          nameArr.push(color[0].paramValue);
          categoryValue.push(category[0].paramValue);
          let query = {
            filters: [
              {
                f: [
                  {
                    Color: nameArr,
                  },
                  {
                    Category: categoryValue,
                  },
                ],
              },
            ],
          };
          this.seeMoreIn.push({
            label: color[0].paramValue + ' ' + category[0].paramValue,
            filters: query,
          });
        }
        if (!!category && category.length > 0) {
          let nameArr = [];
          nameArr.push(category[0].paramValue);
          let query = {
            filters: [
              {
                f: [
                  {
                    Category: nameArr,
                  },
                ],
              },
            ],
          };
          this.seeMoreIn.push({
            label: category[0].paramValue,
            filters: query,
          });
        }
        // console.log("seeMoreIn ", this.seeMoreIn);
      }

      // add ons
      if (this.productData.data[0].listOfVariants.length > 0) {
        this.productData.data[0].listOfVariants.forEach((variant) => {
          if (
            !!variant.listOfProductVariantAddOns &&
            variant.listOfProductVariantAddOns.length > 0
          ) {
            variant.listOfProductVariantAddOns.filter(
              (addOn) => (addOn.selected = false)
            );
          }
        });
      }

      // console.log("list of product variant param", this.productData, this.listOfProductVariantType, this.selectedVariantType1, this.selectedVariantType2, this.selectedVariant, this.productPrice);

      if (!!this.userId) {
        await this.fetchFavorites(this.userId);
        let resSchemes =
          await this.databaseServiceService.getAllSchemesByUserAndProductId(
            this.userId,
            this.dataValue
          );
        if (resSchemes.isSuccess) {
          this.productSchemes = resSchemes.data;
        }
      }
    } else {
      let obj = {
        name: productId,
      };
      let emptyArray = [];
      emptyArray.push(obj);

      this.productData = {};
      // console.log(this.productData);
      this.productData['data'] = emptyArray;
      this.productTitle = productId;
      this.hits = emptyArray;
      // console.log(this._navigateService.productDetailPageList)
      // this._navigateService.productDetailPageList[0].productName = data
      //this.productData.data.push(obj)
      this.loadMediaDetails = true;
      //console.error("error", res.error);
    }
  }

  async loadData(data, location) {
    // console.log('in load data', data);
    this.userId = await this.storage.get('userID');
    let sessionId = await this.storage.get('sessionID');

    //await this.databaseServiceService.showLoading();
    let res = await this._detailsService.getProductDetail(
      data,
      location,
      sessionId,
      this.userId
    );
    // await this.databaseServiceService.hideLoading();

    this.afterloadData(res, data);

    /*
    if (!!res.isSuccess) {
      this.productData = res;
      console.log(this.productData);
      if (
        this.productData.data[0] &&
        this.productData.data[0].listOfProductImages
      ) {
        this.productData.data[0].isBeginningSlide = true;
        this.productData.data[0].isEndSlide = false;

        this.productData.data[0].listOfProductImages =
          this.productData.data[0].listOfProductImages.filter(
            image => image.isCoverImage !== true
          );

        this.productData.data[0].listOfProductImages.map(i => {
          if (i.transformType) {
            let value = this.transformationTypes.filter(
              t => t.name == i.transformType
            )[0].values;
            i['transformationValue'] = value;
            return i;
          }
          if (i.transformType_slider) {
            let value = this.transformationTypes.filter(
              t => t.name == i.transformType_slider
            )[0].values;
            i['sliderTransformationValue'] = value;
            return i;
          }
        });
      }

      this.hits = this.productData.data;
      let userdata = await this.storage.get('userData');

      const externalProduct =
        this._companyService.companyObj.config.externalProduct;

      // console.log("this.productData ", this.productData);
      // await this.getCartDetails();

      // event for stone View

      if (this.hits.length > 0) {
        let stoneDetails = {
          stoneName: this.hits[0].name,
          Shape: this.hits[0].ShapeCode,
          Color: this.hits[0].ColorCode,
          Clarity: this.hits[0].ClarityCode,
          Size: this.hits[0].cts,
          Cut: this.hits[0].CutCode,
          Polish: this.hits[0].PolishCode,
          Symmetry: this.hits[0].SymmetryCode,
          Lab: this.hits[0].lab,
          Amount: this.hits[0][externalProduct.kgAppliedAmount],
          Price: this.hits[0][externalProduct.kgAppliedPrice],
          Discount: this.hits[0][externalProduct.kgAppliedDiscount],
          User: userdata.name,
          Mobile: userdata.username,
          Email: userdata.email,
        };

        let payload = {
          userId: this.userId,
          stoneName: this.hits[0].name,
          // stoneData: stoneDetails,
          Shpae: this.hits[0].ShapeCode,
          Color: this.hits[0].ColorCode,
          Clarity: this.hits[0].ClarityCode,
          Size: this.hits[0].cts,
          Cut: this.hits[0].CutCode,
          Polish: this.hits[0].PolishCode,
          Symmetry: this.hits[0].SymmetryCode,
          Lab: this.hits[0].lab,
          Amount:
            !!this.hits[0][externalProduct.kgAppliedAmount] &&
            this.hits[0][externalProduct.kgAppliedAmount] !== '(not set)'
              ? this.hits[0][externalProduct.kgAppliedAmount]
              : 'we have some problem',
          Price:
            !!this.hits[0][externalProduct.kgAppliedPrice] &&
            this.hits[0][externalProduct.kgAppliedPrice] !== '(not set)'
              ? this.hits[0][externalProduct.kgAppliedPrice]
              : 'we have some problem',
          Discount:
            !!this.hits[0][externalProduct.kgAppliedDiscount] &&
            this.hits[0][externalProduct.kgAppliedDiscount] !== '(not set)'
              ? this.hits[0][externalProduct.kgAppliedDiscount]
              : 'we have some problem',
          username: userdata.name,
          user: userdata.username,
          Email: userdata.email,
        };

        if (
          !!this.hits[0][externalProduct.kgAppliedAmount] &&
          !!this.hits[0][externalProduct.kgAppliedPrice]
        ) {
          this.analyticsService.addEvents('Stone View', payload);
        }
      }

      if (
        this.productData.data[0] &&
        this.productData.data[0].listOfProductVariantParameters
      ) {
        // console.log("--");
        //add variant parameter names in array
        this.productData.data[0].listOfProductVariantParameters.filter(
          variantParam => {
            if (
              this.listOfProductVariantType.findIndex(
                i => i.name === variantParam.name
              ) === -1
            ) {
              this.listOfProductVariantType.push({ name: variantParam.name });
            }
          }
        );
        //add variant parameter values in array. Suppose there are 2 different parameters
        //then 2 arrays will be created
        if (this.listOfProductVariantType.length > 0) {
          this.productData.data[0].listOfProductVariantParameters.filter(
            variantParam => {
              //check if variant is present in cart

              // console.log(this.cartDetails);

              if (!!this.cartDetails && this.cartDetails.length > 0) {
                // console.log(this.cartDetails);
                let index = this.cartDetails.findIndex(
                  c => c.pvid === variantParam.refPvID
                );
                // console.log(index);
                //
                if (index > -1) {
                  variantParam.cartQuantity = this.cartDetails[index].quantity;
                  variantParam.isPresentInCart = true;
                } else {
                  variantParam.cartQuantity = 0;
                  variantParam.isPresentInCart = false;
                }
              }

              if (
                this.listOfProductVariantType[0].name === variantParam.name &&
                this.listOfVariantType1.findIndex(
                  i => i.id === variantParam.id
                ) == -1
              ) {
                this.listOfVariantType1.push(variantParam);
              } else if (
                this.listOfProductVariantType[0].name !== variantParam.name &&
                this.listOfVariantType2.findIndex(
                  i => i.id === variantParam.id
                ) == -1
              ) {
                this.listOfVariantType2.push(variantParam);
              }
            }
          );
        }
        // console.log("variant types", this.listOfVariantType1, this.listOfVariantType2);
      }
      //assign the initial values of product
      this.productTitle = this.productData.data[0].name;
      let encodedProductTitle = encodeURI(
        this.productTitle
          .replace(/\//g, '-')
          .replace(/\s+/g, '-')
          .replace(/"/g, '')
          .replace(/'/g, '')
          .replace(/\(|\)/g, '')
          .toLowerCase()
      );
      let options = {
        stoneName: this.productTitle,
        removeTitlecase: true,
      };
      this._productTitleService.observables.next(options);
      if (this.shareInvite) {
        this.userId = await this.storage.get('userID');
        let d = CryptoJS.AES.encrypt(
          JSON.stringify(this.userId),
          'StorefrontEncrypt'
        ).toString();
        this.socialMediaShareLink =
          this.baseURL +
          '/products/' +
          this.productData.data[0].id +
          '/' +
          encodedProductTitle +
          '?ref=' +
          encodeURI(d);
      } else {
        this.socialMediaShareLink =
          this.baseURL +
          '/products/' +
          this.productData.data[0].id +
          '/' +
          encodedProductTitle;
      }
      //this.socialMediaShareLink = encodeURI(this.socialMediaShareLink);s
      if (
        this.productData.data[0] &&
        this.productData.data[0].listOfVariants[0]
      ) {
        this.selectedVariant = this.productData.data[0].listOfVariants[0];
        this.productPrice = this.selectedVariant.price;
        this.compareAtPrice = this.selectedVariant.compareAtPrice;
        if (!!this.compareAtPrice && this.compareAtPrice > 0) {
          this.compareDiscount =
            ((this.compareAtPrice - this.productPrice) / this.compareAtPrice) *
            100;
          this.compareDiscount = this.compareDiscount.toFixed(0);
        }
        // console.log("this.productPrice>>", this.productPrice, this.compareAtPrice);

        if (
          this.productData.data[0].listOfVariants[0]
            .listOfProductVariantParameter.length > 0
        ) {
          this.selectedVariantType1 =
            this.productData.data[0].listOfVariants[0].listOfProductVariantParameter[0];
          if (
            this.productData.data[0].listOfVariants[0]
              .listOfProductVariantParameter.length > 1
          ) {
            this.selectedVariantType2 =
              this.productData.data[0].listOfVariants[0].listOfProductVariantParameter[1];
          }
        }
      }
      //show the first variant parameters as selected
      if (this.listOfVariantType1.length > 0) {
        this.listOfVariantType1[0].isSelected = true;
        this.selectedVariantType1 = this.listOfVariantType1[0];
      }
      if (this.listOfVariantType2.length > 0) {
        if (this.listOfVariantType1.length > 0) {
          this.listOfVariantType1.forEach(v1 => {
            let v2list = JSON.parse(JSON.stringify(this.listOfVariantType2));
            v2list.forEach(v2 => {
              v2.quantity = '-';
            });
            v1.secondVariantList = v2list;
          });
        }
        this.listOfVariantType2[0].isSelected = true;
        this.selectedVariantType2 = this.listOfVariantType2[0];
      }
      // console.log("this.listOfVariantType1 ", this.listOfVariantType1);
      // Fetch Total Taxes value for product
      if (this.productData.data[0].listOfParameter.length > 0) {
        this.productData.data[0].listOfParameter.forEach(element => {
          // // console.log(">>>",element)
          if (element.paramName == 'Tax') {
            this.taxes = element.paramValue;
          }
          if (element.paramName == 'Hide Price') {
            this.hidePrice = element.paramValue;
          }
        });
        let manufacturer = this.productData.data[0].listOfParameter.filter(
          element => {
            if (element.paramName == 'Manufacturer') {
              return element;
            }
          }
        );
        let color = this.productData.data[0].listOfParameter.filter(element => {
          if (element.paramName == 'Color') {
            return element;
          }
        });
        let category = this.productData.data[0].listOfParameter.filter(
          element => {
            if (element.paramName == 'Category') {
              return element;
            }
          }
        );
        if (!!manufacturer && manufacturer.length > 0) {
          if (manufacturer[0].paramValue != 'Others') {
            let nameArr = [];
            nameArr.push(manufacturer[0].paramValue);
            let query = {
              filters: [
                {
                  f: [
                    {
                      Manufacturer: nameArr,
                    },
                  ],
                },
              ],
            };
            this.seeMoreIn.push({
              label: manufacturer[0].paramValue,
              filters: query,
            });
          }
        }
        if (!!color && color.length > 0 && !!category && category.length > 0) {
          let nameArr = [],
            categoryValue = [];
          nameArr.push(color[0].paramValue);
          categoryValue.push(category[0].paramValue);
          let query = {
            filters: [
              {
                f: [
                  {
                    Color: nameArr,
                  },
                  {
                    Category: categoryValue,
                  },
                ],
              },
            ],
          };
          this.seeMoreIn.push({
            label: color[0].paramValue + ' ' + category[0].paramValue,
            filters: query,
          });
        }
        if (!!category && category.length > 0) {
          let nameArr = [];
          nameArr.push(category[0].paramValue);
          let query = {
            filters: [
              {
                f: [
                  {
                    Category: nameArr,
                  },
                ],
              },
            ],
          };
          this.seeMoreIn.push({
            label: category[0].paramValue,
            filters: query,
          });
        }
        // console.log("seeMoreIn ", this.seeMoreIn);
      }

      // add ons
      if (this.productData.data[0].listOfVariants.length > 0) {
        this.productData.data[0].listOfVariants.forEach(variant => {
          if (
            !!variant.listOfProductVariantAddOns &&
            variant.listOfProductVariantAddOns.length > 0
          ) {
            variant.listOfProductVariantAddOns.filter(
              addOn => (addOn.selected = false)
            );
          }
        });
      }

      // console.log("list of product variant param", this.productData, this.listOfProductVariantType, this.selectedVariantType1, this.selectedVariantType2, this.selectedVariant, this.productPrice);

      if (!!this.userId) {
        await this.fetchFavorites(this.userId);
        let resSchemes =
          await this.databaseServiceService.getAllSchemesByUserAndProductId(
            this.userId,
            this.dataValue
          );
        if (resSchemes.isSuccess) {
          this.productSchemes = resSchemes.data;
        }
      }
    } else {
      let obj = {
        name: data,
      };
      let emptyArray = [];
      emptyArray.push(obj);

      this.productData = {};
      console.log(this.productData);
      this.productData['data'] = emptyArray;
      this.productTitle = data;
      this.hits = emptyArray;
      // console.log(this._navigateService.productDetailPageList)
      // this._navigateService.productDetailPageList[0].productName = data
      //this.productData.data.push(obj)
      this.loadMediaDetails = true;
      //console.error("error", res.error);
    }
    */
    //  .then(
    //     response => {
    //       this.productData = response;
    //     },
    //     err => console.error(err)
    //   );
  }

  async loadDataWithReportNo(reportNo: any) {
    this.userId = await this.storage.get('userID');
    let sessionId = await this.storage.get('sessionID');

    //await this.databaseServiceService.showLoading();
    let res = await this._detailsService.getProductDetailbyReportNo(
      reportNo,
      sessionId,
      this.userId
    );

    this.dataValue = res?.data[0]?.stoneName;
    this.location = res?.data[0]?.currentLocation;
    // await this.databaseServiceService.hideLoading();

    this.afterloadData(res, this.dataValue);
  }

  variantSelected() {
    // console.log("selected variant", this.selectedVariantType1, typeof this.selectedVariantType1, this.selectedVariantType2, typeof this.selectedVariantType2);
    this.productData.data[0].listOfVariants.filter((variant) => {
      if (variant.listOfProductVariantParameter.length > 0) {
        if (
          variant.listOfProductVariantParameter.findIndex(
            (i) => i.id === this.selectedVariantType1.id
          ) > -1 &&
          this.selectedVariantType2 != undefined &&
          variant.listOfProductVariantParameter.findIndex(
            (i) => i.id === this.selectedVariantType2.id
          ) > -1
        ) {
          this.calculatePrice(variant);
          // console.log("match1", variant, this.productTitle, this.productPrice);
        } else if (
          this.selectedVariantType2 == undefined &&
          variant.listOfProductVariantParameter.findIndex(
            (i) => i.id === this.selectedVariantType1.id
          ) > -1
        ) {
          this.calculatePrice(variant);
          // console.log("match2", variant, this.productTitle, this.productPrice);
        }
      }
    });
  }

  calculatePrice(variant) {
    let addOnPrice = 0;
    if (
      !!variant.listOfProductVariantAddOns &&
      variant.listOfProductVariantAddOns.length > 0
    ) {
      let selectedAddOns = variant.listOfProductVariantAddOns.filter(
        (a) => a.selected
      );
      if (!!selectedAddOns && selectedAddOns.length > 0) {
        selectedAddOns.forEach((addOn) => {
          if (!!addOn.price && addOn.price > 0) addOnPrice += addOn.price;
        });
      }
    }
    this.productPrice = variant.price + addOnPrice;
    this.compareAtPrice = variant.compareAtPrice + addOnPrice;
    if (!!this.compareAtPrice && this.compareAtPrice > 0) {
      this.compareDiscount =
        ((this.compareAtPrice - this.productPrice) / this.compareAtPrice) * 100;
      this.compareDiscount = this.compareDiscount.toFixed(0);
    }
    this.discountPrice = (this.productPrice * parseFloat(this.discount)) / 100;
    this.finalPrice = this.productPrice - this.discountPrice;
    this.selectedVariant = variant;
  }

  async validateControls() {
    if (this.selectedQty > 0 && this.selectedVariant != undefined) {
      return false;
    } else {
      if (this.selectedQty <= 0) {
        this.configService.presentToast(
          'Please enter correct quantity',
          'error'
        );
        return true;
      } else {
        this.configService.presentToast('Please select the details', 'error');
        return true;
      }
    }
  }

  openCart() {
    this._cartService.observables.next('data');
  }

  openImage(imageUrl, i) {
    imageUrl = 'https://res.cloudinary.com/dealerclub/image/upload' + imageUrl;
    // console.log("imageUrl", imageUrl);
    if (this.onMobile) {
      PhotoViewer.show(imageUrl);
    } else {
      this.imageView = true;
      this._headerFabService.observables.next(this.imageView);
      // setTimeout(data => {
      //   // console.log("slides", this.slides);
      //   if (!!this.slides) {
      //     this.slides.slideTo(i);
      //   }
      // }, 100);
    }
  }

  variantSelectedByButton(item, index, variantType) {
    // console.log("item", item, index, variantType);
    item.forEach((element) => {
      element.isSelected = false;
    });
    if (variantType == 1) {
      this.selectedVariantType1 = this.listOfVariantType1[index];
    } else if (variantType == 2) {
      this.selectedVariantType2 = this.listOfVariantType2[index];
    }
    this.variantSelected();
    // this.selectedVariant.id = item[index].id;
    // this.productPrice = item[index].price;
    item[index].isSelected = true;
    // console.log("item", item, index);
  }

  async getProductTagsAndDiscount(data) {
    this.userId = await this.storage.get('userID');
    // console.log("this.userId", this.userId);
    if (this.userId != null && this.userId != undefined) {
      let requiredCustomerTag = null;
      let requiredCustomerTagArr = [];

      if (!!this.selectedParentCustomerId) {
        requiredCustomerTag = 'child_of_' + this.selectedParentCustomerId;
        requiredCustomerTagArr.push(requiredCustomerTag);
      }

      let res = await this._detailsService.getProductTagsAndDiscount(
        data,
        this.location,
        this.userId,
        requiredCustomerTagArr
      );
      if (!!res.isSuccess) {
        this.tags = res.data.tags;
        this.discount = res.data.discount;
        if (this.discount && this.discount.toString().includes('%')) {
          this.discount.slice('%');
        }
        this.discountPrice =
          (this.productPrice * parseFloat(this.discount)) / 100;
        this.finalPrice = this.productPrice - this.discountPrice;
        if (
          !!res.data.priceRule &&
          !!res.data.priceRule.customerTag &&
          !!res.data.priceRule.customerTag.name
        ) {
          this.customerTag = res.data.priceRule.customerTag.name;
        }
        // console.log("tags", this.tags, " discount", this.discount, "discountPrice", this.discountPrice, "productPrice", this.productPrice);
      } else {
        //console.error("error", res.error);
      }
    }
  }

  async addToFavorite() {
    let product = this.productData.data[0];
    // console.log("product", product);

    let userId = await this.storage.get('userID');
    if (!userId && userId == null && userId == undefined) {
      this.configService.presentToast('Please Login', 'error');
      let navigationExtras: NavigationExtras = {
        queryParams: {
          to: '/my-favorite',
        },
      };
      this.router.navigate(['/login-with-sign-up'], navigationExtras);
    } else {
      if (!!product) {
        let favoriteObj = {
          productId: product.id,
          userId: parseInt(userId),
        };
        let favoriteResponse = await this._favoriteService.createFavorite(
          favoriteObj
        );
        // console.log("favoriteResponse", favoriteResponse);
        if (favoriteResponse.isSuccess) {
          this.configService.presentToast('Added to your favorites', 'success');
          this.fetchFavorites(userId);
        } else {
          this.configService.presentToast(favoriteResponse.error, 'error');
        }
      } else {
        this.configService.presentToast('Select Product', 'error');
      }
    }
  }

  async fetchFavorites(userId) {
    if (userId) {
      // console.log("in fetchFavorites");
      // await this.databaseServiceService.showLoading();
      let res = await this._favoriteService.fetchFavorites(userId);
      // await this.databaseServiceService.hideLoading();
      // console.log("favorites res", res);

      if (res.isSuccess && res.data.length > 0) {
        // console.log("favorites ", res.data);
        if (
          !!this.productData &&
          !!this.productData.data &&
          this.productData.data.length > 0
        ) {
          let favoriteProduct = res.data.filter(
            (f) => f.productId == this.productData.data[0].id
          );
          // console.log("favoriteProduct", favoriteProduct);
          if (!!favoriteProduct && favoriteProduct.length > 0) {
            this.productData.data[0].isFavorite = true;
          }
          // console.log("this.productData.data[0]", this.productData.data[0]);
        }
      } else {
        // console.log(res.error);
      }
    }
  }

  closeImageViewer() {
    this.imageView = false;
    this._headerFabService.observables.next(this.imageView);
  }

  next() {
    // // console.log("next ",this.slides,this.slides.isEnd);
    // this.slides.isEnd().then(data => {
    //   if (data) {
    //     this.slides.slideTo(0);
    //   } else {
    //     this.slides.slideNext();
    //   }
    // });
  }

  prev() {
    // // console.log("prev ",this.slides,this.slides.isBeginning);
    // this.slides.isBeginning().then(data => {
    //   if (data) {
    //     this.slides.length().then(data => {
    //       let totalSlides = data;
    //       // console.log("totalSlides ", totalSlides);
    //       this.slides.slideTo(totalSlides);
    //     });
    //   } else {
    //     this.slides.slidePrev();
    //   }
    // });
  }

  async getProductPageDetails() {
    // console.log("getProductPageDetails ");
    let response = await this._pageService.getPageDetailByPageName(
      this.productPage,
      this.userId
    );
    if (!!response.isSuccess) {
      // console.log("product page details ", response);
      this.productPageDetails = response;
    } else {
      // console.error(response.error);
    }
  }

  async showSearchPage(seeMore) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        filters: JSON.stringify(seeMore.filters),
      },
    };
    this.router.navigate(['search'], navigationExtras);
  }

  async getCartDetails() {
    this.userId = await this.storage.get('userID');
    this.sessionId = await this.storage.get('sessionID');
    // console.log("this.userId", this.userId, "this.sessionId ", this.sessionId);
    //let response = await this.databaseServiceService.getCartDetails(this.userId, this.sessionId);
    let response = await this._headerFooterService.getCartDetailsV1(
      this.userId,
      this.sessionId,
      0,
      50,
      this.productData.data[0].name,
      '',
      true
    );
    // console.log(response);
    if (!!response) {
      let cartData = response;
      let products = [];
      if (!!cartData.data && cartData.data.products) {
        products = cartData.data.products;
      }
      //if (!cartData.data.products) cartData.data.products = [];
      this.cartDetails = products;
      // console.log("cartDetails ", this.cartDetails);
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

  async nextProduct() {
    // console.log(this.productNavigationList);
    let currentProdIndex = this.productNavigationList.findIndex(
      (a) =>
        a.objectID == this.dataValue ||
        a.stoneName == this.dataValue ||
        a.productName == this.dataValue
    );
    // console.log(currentProdIndex);
    if (
      currentProdIndex != this.productNavigationList.length - 1 &&
      this.productNavigationList.length != 0
    ) {
      this.singleProduct(this.productNavigationList[currentProdIndex + 1]);
    }
  }

  async prevProduct() {
    let currentProdIndex = this.productNavigationList.findIndex(
      (a) =>
        a.objectID == this.dataValue ||
        a.stoneName == this.dataValue ||
        a.productName == this.dataValue
    );
    if (currentProdIndex != 0) {
      this.singleProduct(this.productNavigationList[currentProdIndex - 1]);
    }
  }
  async singleProduct(product) {
    let name = '';
    if (!!product.productName)
      name = product.productName
        .replace(/\//g, '-')
        .replace(/\s+/g, '-')
        .toLowerCase();
    else if (!!product.stoneName)
      name = product.stoneName
        .replace(/\//g, '-')
        .replace(/\s+/g, '-')
        .toLowerCase();
    else name = product.objectID;

    this._navigateService.productDetailPageList = this.productNavigationList;

    if (!!product.objectID) {
      this.navCtrl.navigateForward([
        '/products/' +
          product.objectID +
          '/' +
          name +
          '/' +
          product.currentLocation,
      ]);
    } else {
      this.navCtrl.navigateForward([
        '/products/' +
          (product.productName || product.stoneName) +
          '/' +
          name +
          '/' +
          product.currentLocation,
      ]);
    }
  }
  async setNextPrev() {
    let currentProdIndex = this.productNavigationList.findIndex(
      (a) =>
        a.objectID == this.dataValue ||
        a.stoneName == this.dataValue ||
        a.productName == this.dataValue
    );
    if (currentProdIndex == 0) this.canGoPrev = false;
    if (
      currentProdIndex == this.productNavigationList.length - 1 ||
      this.productNavigationList.length == 0
    )
      this.canGoNext = false;
  }

  selectAddOn(event, selectedVariant) {
    // console.log("selectAddOn ", event, selectedVariant);
    this.variantSelected();
  }
  async saveInquiry(seller, type) {
    this.userId = await this.storage.get('userID');
    // console.log("this.userId", this.userId);

    let addObj: any = {
      //refUserId: 0,
      refDealerId: seller.id,
      refProductID: this.dataValue,
    };
    if (!!this.userId) addObj.refUserId = this.userId;

    let res: any = await this.databaseServiceService.createInquiry(
      addObj,
      type
    );
  }

  async saveInquiryViaPlugin(seller, type) {
    this.saveInquiry(seller, type);
    let number;
    if (seller.contactNumber) {
      if (seller.contactNumber.includes(',')) {
        let n = seller.contactNumber.split(',')[0];
        number = n[0];
      } else {
        number = seller.contactNumber;
      }
    }
    // this.socialSharing
    //   .shareViaWhatsAppToReceiver(
    //     number,
    //     'I am Interested in ' + this.productTitle
    //   )
    //   .then(() => {
    //     // console.log("shared");
    //   });
  }

  async sendDirectInquiryViaPlugin() {
    this.sendDirectInquiry();
    // this.socialSharing
    //   .shareViaWhatsAppToReceiver(
    //     this.directWAInquiryNumber,
    //     'I am Interested in ' + this.productTitle
    //   )
    //   .then(() => {
    //     // console.log("shared");
    //   });
  }

  async sendDirectInquiry() {
    this.userId = await this.storage.get('userID');
    // console.log("this.userId", this.userId);
    let addObj: any = {
      //refUserId: 0,
      refProductID: this.dataValue,
    };
    if (!!this.userId) addObj.refUserId = this.userId;

    let res: any = await this.databaseServiceService.createInquiry(
      addObj,
      'WA'
    );
  }

  async getDiscountOnParentCustomerChange() {
    await this.getProductTagsAndDiscount(this.dataValue);
  }
  async getParentCustomers() {
    let res: any = await this.databaseServiceService.getParentCustomers(
      this.userId
    );
    if (res.isSuccess) {
      this.parentCustomers = res.data;
      if (res.data.length > 0) {
        this.selectedParentCustomerId = res.data[0].customerId;
      } else {
        this.selectedParentCustomerId = null;
      }
      await this.getProductTagsAndDiscount(this.dataValue);
    }
  }

  //Move to Next slide
  slideNext(object, slideView) {
    slideView.slideNext().then(() => {
      this.checkIfNavDisabled(object, slideView);
    });
  }

  //Move to previous slide
  slidePrev(object, slideView) {
    slideView.slidePrev().then(() => {
      this.checkIfNavDisabled(object, slideView);
    });
  }

  //Method called when slide is changed by drag or navigation
  slideDidChange(object, slideView) {
    this.checkIfNavDisabled(object, slideView);
  }

  //Call methods to check if slide is first or last to enable disbale navigation
  checkIfNavDisabled(object, slideView) {
    this.checkisBeginning(object, slideView);
    this.checkisEnd(object, slideView);
  }

  checkisBeginning(object, slideView) {
    slideView.isBeginning().then((istrue) => {
      object.isBeginningSlide = istrue;
    });
  }
  checkisEnd(object, slideView) {
    slideView.isEnd().then((istrue) => {
      object.isEndSlide = istrue;
    });
  }

  openThumbnail(i) {
    // console.log("open thumbnail ",i, this.slides1);
    // setTimeout(data => {
    //   // console.log("slides", this.slides1);
    //   if (!!this.slides1) {
    //     this.slides1.slideTo(i);
    //   }
    // }, 100);
  }

  async requestACallback() {
    let action = 16;

    if (!!this.allViewActions && !!this.allViewActions.haveAQuestion) {
      action = this.allViewActions.haveAQuestion;
    }
    let jsonObj = {
      actionId: action,
      refProductId: this.dataValue,
      phoneNo: '91' + this.validations_form.get('phone').value,
    };
    let res: any;

    res = await this._companyService.insertView(jsonObj);
    await this.configService.presentToast(
      'Thank you for reaching out to us. Our team will call you shortly.',
      'success'
    );

    if (res.status == 0) {
      // console.log("error");
    } else {
      // console.log("login view insert res", res);
    }
  }

  changeView() {
    this.navCtrl.back();
  }

  currentNo(no) {
    // console.log('----', this._navigateService.productDetailPageList[no]);
    // console.log(no);
    this.loadData(
      this._navigateService.productDetailPageList[no].productName,
      this._navigateService.productDetailPageList[no].location
    );
  }
}
