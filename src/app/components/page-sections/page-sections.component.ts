import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import {
  NavController,
  LoadingController,
  Platform,
  IonicSlides,
} from '@ionic/angular';
import { SectionService } from '../../service/page/section.service';
import { AmountService } from '../../service/user/amount.service';
import { Storage } from '@ionic/storage-angular';
import { format } from 'date-fns/format';
import { ConfigServiceService } from '../../service/config-service.service';
import { CompanyService } from './../../service/company/company.service';
import { RazorkeyService } from '../../service/payment/razorkey.service';
import { LOGGEDINService } from '../../service/observable/user/loggedin.service';
import { LOGGEDOUTService } from '../../service/observable/user/loggedout.service';
import { CartService } from '../../service/observable/cart/cart.service';
import { DealerClubService } from '../../service/observable/dealer-club/dealer-club.service';
import { HomePageService } from '../../service/observable/home-page/home-page.service';

declare var Razorpay: any;
declare var RazorpayCheckout: any;

@Component({
  selector: 'app-page-sections',
  templateUrl: './page-sections.component.html',
  styleUrls: ['./page-sections.component.scss'],
})
export class PageSectionsComponent implements OnInit {
  @Input() data: any;
  @Input() hideHeader = false;
  @ViewChild('slider', { static: false }) slides: typeof IonicSlides;
  @ViewChild('slider1', { static: false }) slides1: typeof IonicSlides;
  @ViewChild('sliderScheme', { static: false })
  sliderScheme: typeof IonicSlides;
  @ViewChild('sliderImage1WithScroll', { static: false })
  sliderImage1WithScroll: typeof IonicSlides;
  public loggedInUser: any;
  public onMobile: any;
  public imageType: any;
  public sectionData: any;
  public image: any;
  public userData: any;
  public screenWidth: any;
  public isCustomerExists: boolean = false;
  public isUserExists: boolean = false;
  public isSchemaExists: boolean = false;
  public isDispatchExists: boolean = false;
  public hideSignIn = true;
  public hideUser = true;
  public companyJson: any = {
    homePageHeaderLinks: [],
  };

  public limit: any = 30;
  public showInstagramDiv: boolean = false;
  public instagramPostLink: any = [];
  public instagramPhotos: any = [];
  public instagramPublicProfile: any;

  public isOutStandingAmount: {
    creditLimit: Number;
    outstandingAmount: Number;
    creditUpdate: String;
    limitUpdate: String;
  } = {
    creditLimit: 0,
    outstandingAmount: 0,
    creditUpdate: '',
    limitUpdate: '',
  };
  public schema: any = {
    schema: [],
  };
  public showUserDetailsOnHomePage = false;
  public showUserDetailsOnHomePageBottom = false;
  public Math = Math;
  slideOpts = {
    initialSlide: 0,
    slidesPerView: 12,
    autoplay: true,
    loop: true,
    centeredSlides: true,
  };
  slideOpts1 = {
    initialSlide: 0,
    slidesPerView: 1,
    autoplay: false,
    loop: false,
    centeredSlides: true,
  };
  slideOptionsForSmallScreen = {
    initialSlide: 0,
    slidesPerView: 4,
    autoplay: true,
    loop: true,
    centeredSlides: true,
  };
  slideOptions1ForSmallScreen = {
    initialSlide: 0,
    slidesPerView: 3,
    autoplay: false,
    loop: false,
    // centeredSlides: true
  };
  slideOptionsForSchemes = {
    initialSlide: 0,
    slidesPerView: 5,
  };
  slideOptionsForSchemesSmallScreen = {
    initialSlide: 0,
    slidesPerView: 1,
  };
  slideOptionsForImage1WithScroll = {
    initialSlide: 0,
    slidesPerView: 1,
    autoplay: true,
    loop: true,
    centeredSlides: true,
  };
  public offset = 0;
  public intervalId: any;
  public orderByOptions = this._companyService.collectionOrderOptionsTB;
  public randomReplacing = this._companyService.randomReplacing;
  public header: any;

  constructor(
    public _cartService: CartService,
    public _LOGGEDOUTService: LOGGEDOUTService,
    public _LOGGEDINService: LOGGEDINService,
    public _razorkeyService: RazorkeyService,
    public _amountService: AmountService,
    public _sectionService: SectionService,
    public _companyService: CompanyService,
    public storage: Storage,
    public _configService: ConfigServiceService,
    public platform: Platform,
    private router: Router,
    private iab: InAppBrowser,
    private navCtrl: NavController,
    public _dealerClubService: DealerClubService,
    public _homePageService: HomePageService
  ) {
    this.platform.ready().then(() => {
      // console.log("this.platform", this.platform);
      if (this.platform.is('desktop')) {
        this.onMobile = false;
      } else {
        this.onMobile = true;
      }
      this.screenWidth = this.platform.width();
      // console.log("this.onMobile", this.onMobile, this.screenWidth);
    });

    this._LOGGEDOUTService.observable().subscribe((data) => {
      this.isCustomerExists = false;
      this.isUserExists = false;
      this.isSchemaExists = false;
      this.isOutStandingAmount = {
        creditLimit: 0,
        outstandingAmount: 0,
        creditUpdate: '',
        limitUpdate: '',
      };
      this.isDispatchExists = false;
    });

    this._LOGGEDINService.observable().subscribe((data) => {
      this.loadCompanyData();
    });
    this._homePageService.observable().subscribe((data) => {
      this.loadCompanyData();
    });
    this._dealerClubService.observable().subscribe((data) => {
      this.loadCompanyData();
    });
  }

  async login() {
    this.router.navigate(['/login-with-sign-up']);
  }

  openCart() {
    this._cartService.observables.next('data');
  }

  async ngOnInit() {
    // console.log("this.data", this.data);
    await this.loadCompanyData();
    let thiss = this;
    this.intervalId = setInterval(function () {
      thiss.randomReplaceProduct();
    }, 2000);
    await this.checkRandomReplacingSectionExist();
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }

  public loadBanners() {}

  openPage(obj, redirectToProduct) {
    // console.log("objjjj", obj);
    // console.log("URL", document.URL);
    if (redirectToProduct) {
      if (obj.liveStatus) {
        if (redirectToProduct == 'url') {
          this.navCtrl.navigateForward(obj.redirectTo);
        } else if (redirectToProduct != 'url') {
          let name = obj.name.replace(/\//g, '-');
          name = obj.name.replace(/ /g, '-');
          // console.log("name", name);
          this.navCtrl.navigateForward(['/products/' + obj.id + '/' + name]);
        } else {
          // console.log("else");
          this.iab.create(obj.redirectTo);
        }
      } else {
        let navigationExtras: NavigationExtras;
        this.router.navigate(['/collections/new-arrivals'], navigationExtras);
      }
    } else {
      // // console.log(obj.redirectTo);
      // obj.redirectTo = "https://beta.ionicframework.com/docs/native/in-app-browser/";
      let navigationExtras: NavigationExtras;
      if (!!obj.config && obj.config != '') {
        // console.log("obj.config", typeof obj.config);
        navigationExtras = {
          queryParams: {
            query: obj.config,
          },
        };
        // this.router.navigate(["search"],navigationExtras);
      }
      if (obj.redirectTo.indexOf(document.URL) == 0) {
        // console.log("iffffff");
        this.router.navigate(
          ['/' + obj.redirectTo.split(document.URL)[1]],
          navigationExtras
        );
      } else if (obj.redirectTo[0] == '/') {
        // console.log("else if", obj.redirectTo.toLowerCase());
        this.router.navigate([obj.redirectTo.toLowerCase()], navigationExtras);
      } else {
        // console.log("else");
        this.iab.create(obj.redirectTo);
      }
    }
  }

  next() {
    // // console.log("next ",this.slides,this.slides.isEnd);
    // this.slides.isEnd().then(data => {
    //   if (data) {
    //     this.slides.slideTo(0);
    //     this.slides.startAutoplay();
    //   } else {
    //     this.slides.slideNext();
    //     this.slides.startAutoplay();
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
    //       this.slides.startAutoplay();
    //     });
    //   } else {
    //     this.slides.slidePrev();
    //     this.slides.startAutoplay();
    //   }
    // });
  }

  next1() {
    // // console.log("next ",this.slides,this.slides.isEnd);
    // this.slides1.isEnd().then(data => {
    //   if (data) {
    //     this.slides1.slideTo(0);
    //     // this.slides1.startAutoplay();
    //   } else {
    //     this.slides1.slideNext();
    //     // this.slides1.startAutoplay();
    //   }
    // });
  }

  prev1() {
    // // console.log("prev ",this.slides,this.slides.isBeginning);
    // this.slides1.isBeginning().then(data => {
    //   if (data) {
    //     this.slides1.length().then(data => {
    //       let totalSlides = data;
    //       // console.log("totalSlides ", totalSlides);
    //       this.slides1.slideTo(totalSlides);
    //       // this.slides1.startAutoplay();
    //     });
    //   } else {
    //     this.slides1.slidePrev();
    //     // this.slides1.startAutoplay();
    //   }
    // });
  }
  next2() {
    // // console.log("next ",this.slides,this.slides.isEnd);
    // this.sliderScheme.isEnd().then(data => {
    //   if (data) {
    //     this.sliderScheme.slideTo(0);
    //     // this.slides1.startAutoplay();
    //   } else {
    //     this.sliderScheme.slideNext();
    //     // this.slides1.startAutoplay();
    //   }
    // });
  }

  prev2() {
    // // console.log("prev ",this.slides,this.slides.isBeginning);
    // this.sliderScheme.isBeginning().then(data => {
    //   if (data) {
    //     this.sliderScheme.length().then(data => {
    //       let totalSlides = data;
    //       // console.log("totalSlides ", totalSlides);
    //       this.sliderScheme.slideTo(totalSlides);
    //       // this.slides1.startAutoplay();
    //     });
    //   } else {
    //     this.sliderScheme.slidePrev();
    //     // this.slides1.startAutoplay();
    //   }
    // });
  }
  nextImage1WithScroll() {
    // // console.log("next ",this.slides,this.slides.isEnd);
    // this.sliderImage1WithScroll.isEnd().then(data => {
    //   if (data) {
    //     this.sliderImage1WithScroll.slideTo(0);
    //     this.sliderImage1WithScroll.startAutoplay();
    //   } else {
    //     this.sliderImage1WithScroll.slideNext();
    //     this.sliderImage1WithScroll.startAutoplay();
    //   }
    // });
  }

  prevImage1WithScroll() {
    // // console.log("prev ",this.slides,this.slides.isBeginning);
    // this.sliderImage1WithScroll.isBeginning().then(data => {
    //   if (data) {
    //     this.sliderImage1WithScroll.length().then(data => {
    //       let totalSlides = data;
    //       // console.log("totalSlides ", totalSlides);
    //       this.sliderImage1WithScroll.slideTo(totalSlides);
    //       this.sliderImage1WithScroll.startAutoplay();
    //     });
    //   } else {
    //     this.sliderImage1WithScroll.slidePrev();
    //     this.sliderImage1WithScroll.startAutoplay();
    //   }
    // });
  }
  changeImage(image, type) {
    /*if(!!type) {
      let arr = image.split("/");
      let img = arr[arr.length-1];
      img = "https://i2.mobioffice.io/"+this.databaseServiceService.refCompanyId + "/" + type + "/" + img;
      // arr[arr.length-1] = img;
      // let changedImage = arr.join("/");
      // // console.log("image ", image, type,img, changedImage);
      return img;
    } else {
      return image;
    }*/
    return image;
  }

  viewAll(collectionName) {
    this.navCtrl.navigateForward('/collections/' + collectionName);
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

  async loadCompanyData() {
    let userId = await this.storage.get('userID');
    this.userData = await this.storage.get('userData');

    // console.log("schemas", this.schema, userId);
    if (this._companyService.companyObj && this._companyService.companyObj) {
      if (this._companyService.companyObj.config) {
        let companyJson = this._companyService.companyObj.config;
        if (!!companyJson) {
          if (!!companyJson && companyJson.showUserDetailsOnHomePage) {
            this.showUserDetailsOnHomePage =
              companyJson.showUserDetailsOnHomePage;
          } else {
            this.showUserDetailsOnHomePage = false;
          }

          if (!!companyJson && companyJson.showUserDetailsOnHomePageBottom) {
            this.showUserDetailsOnHomePageBottom =
              companyJson.showUserDetailsOnHomePageBottom;
          } else {
            this.showUserDetailsOnHomePageBottom = false;
          }
        }

        this.loggedInUser = await this.storage.get('loggedInUser');

        if (!this.loggedInUser) {
          this.hideUser = true;
          this.hideSignIn = false;
        } else {
          this.hideUser = false;
          this.hideSignIn = true;
        }

        if (
          !!companyJson &&
          companyJson.loggedInUserHeaderLinks &&
          this.loggedInUser
        ) {
          this.companyJson.homePageHeaderLinks =
            companyJson.loggedInUserHeaderLinks;
        } else if (!!companyJson && companyJson.homePageHeaderLinks) {
          this.companyJson.homePageHeaderLinks =
            companyJson.homePageHeaderLinks;
        } else {
          // console.log("no header");
        }
        if (!!companyJson && !!companyJson.instagramProfile) {
          if (!!companyJson.instagramProfile.profileName) {
            this.instagramPublicProfile = companyJson.instagramPublicProfile;
          }
        }
        if (!!companyJson && companyJson.header) {
          this.header = companyJson.header;
        }
        if (
          !!userId &&
          !!this.showUserDetailsOnHomePage &&
          !!this.showUserDetailsOnHomePageBottom
        ) {
          let response = await this._sectionService.findSchemas(userId);
          this.schema = response.data;
          try {
            this.schema.pendingOrders.latestPendingOrders.map((res) => {
              res.addedOn = format(new Date(res.addedOn), 'dd-MM-yyyy');
              return res;
            });
          } catch (e) {}
          try {
            this.isUserExists = !!this.schema.userRes[0].fullName;
          } catch (e) {
            this.isUserExists = false;
          }
          try {
            this.isCustomerExists =
              !!this.schema.userRes[0].customerDetails[0].companyName;
          } catch (e) {
            this.isCustomerExists = false;
          }
          try {
            this.isSchemaExists = this.schema.schemes.length > 0;
          } catch (e) {
            this.isSchemaExists = false;
          }
          try {
            this.isOutStandingAmount = {
              creditLimit:
                this.schema.userRes[0].customerDetails[0].creditLimit || 0,
              outstandingAmount:
                this.schema.userRes[0].customerDetails[0].outstandingAmount ||
                0,
              creditUpdate: format(
                new Date(
                  this.schema.userRes[0].customerDetails[0].outstandingLastUpdatedDate
                ),
                'dd-MM-yyyy'
              ),
              limitUpdate: format(
                new Date(
                  this.schema.userRes[0].customerDetails[0].creditLimitLastUpdatedDate
                ),
                'dd-MM-yyyy'
              ),
            };
          } catch (e) {
            this.isOutStandingAmount = {
              creditLimit: 0,
              outstandingAmount: 0,
              creditUpdate: '',
              limitUpdate: '',
            };
          }
          try {
            this.isDispatchExists = this.schema.dispatch.length > 0;
            this.schema.dispatch.map((res) => {
              res.shipDate = format(new Date(res.shipDate), 'dd-MM-yyyy');
              return res;
            });
          } catch (e) {
            this.isDispatchExists = false;
          }
        }
      }
    }
  }

  myProfile() {
    this.router.navigateByUrl('/setting');
  }

  orderPage(status) {
    this.router.navigate(['/orders/' + status, {}]);
  }
  schemaRedirect() {
    this.router.navigateByUrl('/schemes');
  }
  dispatchRedirect() {
    this.router.navigateByUrl('/dispatchs');
  }

  async payWithRazorForMobile(amount) {
    this._razorkeyService.loadScript();
    var _this = this;
    let orderObj = {
      amount: amount.toFixed(2) * 100,
      currency: 'INR',
      receipt: await this.storage.get('userID'),
      payment_capture: 0,
    };
    let orderInRazorPay = await this._amountService.createOrderInRazorPay(
      orderObj
    );
    if (orderInRazorPay.isSuccess) {
      var options = {
        description: 'Total Outstanding Amount',
        order_id: orderInRazorPay.data.id,
        currency: 'INR', // your 3 letter currency code
        key: this._companyService.razorpayKey, // your Key Id from Razorpay dashboard
        amount: amount.toFixed(2) * 100, // Payment amount in smallest denomiation e.g. cents for USD
        name: 'Outstanding',
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
        handler: {},
      };
      if (!this.onMobile) {
        options.handler = function (paymentRes) {
          // console.log("response", paymentRes);
          if (paymentRes) {
            _this.confirmOrder(amount);
          }
        };
        var rzp1 = new Razorpay(options);
        rzp1.open();
      } else {
        // console.log("options.amount", options.amount, options);
        RazorpayCheckout.open(options);
        RazorpayCheckout.on('payment.success', (paymentRes) => {
          this.confirmOrder(amount);
          // console.log("paymentRes", paymentRes);
        });
        RazorpayCheckout.on('payment.cancel', (error) => {
          alert(error.description + ' (Error ' + error.code + ')');
        });
      }
    } else {
      await this._configService.presentToast(
        "Payment wasn't successfull. Please contact administrator.",
        'error'
      );
    }
  }

  async confirmOrder(amount) {
    let customerId = 0;
    try {
      if (this.isCustomerExists) {
        customerId = this.schema.userRes[0].customerDetails[0].id;
      }
    } catch (e) {}
    await this._amountService.updateOutstandingAmount(customerId, amount);
    await this.loadCompanyData();
  }

  // async loadInstagramPictures() {
  //   try {
  //     if(!!this.instagramPostLink && this.instagramPostLink.length>0) {
  //       const promises = this.instagramPostLink.map(async link => {
  //         const postData = await this.databaseServiceService.getInstagramPostData(link);
  //         // // console.log("postData ",postData);
  //         postData.url = link;
  //         return postData
  //       })

  //       const data = await Promise.all(promises);
  //       this.instagramPhotos = data;
  //       if(!!this.instagramPhotos && this.instagramPhotos.length>0) {
  //         this.showInstagramDiv = true;
  //       }
  //       // console.log("instagramPhotos ", this.instagramPhotos, this.showInstagramDiv);
  //     }

  //   } catch (e) {
  //     console.error('Fetching Instagram photos failed', e)
  //   }
  // }

  // openInstagram(p) {
  //   window.open(p.url,"_blank");
  // }

  openParam(param, card) {
    // console.log("openParam ",param,card);
    let c: any = {},
      cArr = [];
    c[card.collectionName] = [param.value];
    cArr.push(c);
    let query = {
      filters: [
        {
          f: cArr,
        },
      ],
    };
    let navigationExtras: NavigationExtras;
    navigationExtras = {
      queryParams: {
        query: JSON.stringify(query),
      },
    };
    this.router.navigate(
      ['/collections/' + card.collectionName],
      navigationExtras
    );
  }

  randomReplaceProduct() {
    // console.log("randomReplaceProduct ");
    let randomReplacingOrderBy = this.orderByOptions.filter(
      (o) => o.name == this.randomReplacing
    );
    if (!!randomReplacingOrderBy && randomReplacingOrderBy.length > 0) {
      this.data.filter((d) => {
        if (!!d.products && d.products.length > 0) {
          if (
            !!d.products[0].collectionOrderBy &&
            d.products[0].collectionOrderBy == randomReplacingOrderBy[0].id &&
            !!d.products[0].listOfProducts &&
            d.products[0].listOfProducts.length > 0
          ) {
            let totalProducts = d.products[0].listOfProducts.length;
            let toSwapElementIndex =
              Math.floor(Math.random() * d.noOfProducts) + 0;
            let firstNoOfProducts = d.products[0].listOfProducts.slice(
              0,
              d.noOfProducts
            );
            let newNoOfProducts = d.products[0].listOfProducts.filter(
              (d) => !d.productDisplayed
            );
            let swapWithRandomNo =
              Math.floor(Math.random() * newNoOfProducts.length) + 0;

            // console.log(firstNoOfProducts, newNoOfProducts, totalProducts, toSwapElementIndex, swapWithRandomNo);
            if (
              newNoOfProducts.length > 0 &&
              !!firstNoOfProducts &&
              firstNoOfProducts.length > 0
            ) {
              newNoOfProducts[swapWithRandomNo].transitionDelay = true;
              let swapWithIndex = d.products[0].listOfProducts.findIndex(
                (n) => n.id == newNoOfProducts[swapWithRandomNo].id
              );
              if (toSwapElementIndex > -1 && swapWithIndex > -1) {
                d.products[0].listOfProducts[
                  toSwapElementIndex
                ].productDisplayed = false;
                newNoOfProducts[swapWithRandomNo].productDisplayed = true;
                let tmp = d.products[0].listOfProducts[toSwapElementIndex];
                d.products[0].listOfProducts[toSwapElementIndex] =
                  newNoOfProducts[swapWithRandomNo];
                d.products[0].listOfProducts[swapWithIndex] = tmp;
              }
              // console.log("toSwapElement ",d.products[0].listOfProducts[toSwapElementIndex]);
            }
          }
        }
      });
    }
  }

  checkRandomReplacingSectionExist() {
    let randomReplacingOrderBy = this.orderByOptions.filter(
      (o) => o.name == this.randomReplacing
    );
    if (!!randomReplacingOrderBy && randomReplacingOrderBy.length > 0) {
      this.data.filter((d) => {
        if (!!d.products && d.products.length > 0) {
          if (
            !!d.products[0].collectionOrderBy &&
            d.products[0].collectionOrderBy == randomReplacingOrderBy[0].id
          ) {
            let firstNoOfProducts = d.products[0].listOfProducts.slice(
              0,
              d.noOfProducts
            );
            if (!!firstNoOfProducts && firstNoOfProducts.length > 0) {
              firstNoOfProducts.filter((e) => {
                e.productDisplayed = true;
              });
            }
          }
        }
        // console.log("d ",d);
      });
    }
  }

  splits(strings) {
    return strings.slice(0, 25) + '...';
  }
}
