import {
  Component,
  OnInit,
  Input,
  ViewChild,
  EventEmitter,
  Output,
  OnChanges,
  HostListener,
  Renderer2,
  Inject,
  ElementRef,
  ChangeDetectorRef,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import {
  ActionSheetController,
  ModalController,
  Platform,
} from '@ionic/angular';
import { CompanyService } from '../../service/company/company.service';
import { Storage } from '@ionic/storage-angular';
import { DetailsService } from 'src/app/service/product/details.service';
import { FunctionsService } from 'src/app/service/cart/functions/functions.service';
import { ConfigServiceService } from '../../service/config-service.service';
import { HeaderFooterService } from 'src/app/service/headerFooter/header-footer.service';
import { NavigateService } from '../../service/product/navigate.service';
import { CartAddedPopupPage } from '../../pages/cart-added-popup/cart-added-popup.page';
import { CartService } from '../../service/observable/cart/cart.service';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { NavigationExtras, Router } from '@angular/router';
import { CartChangedService } from 'src/app/service/observable/cart-changed/cart-changed.service';
import { ProductTitleService } from 'src/app/service/observable/product-title/product-title.service';
import { PreviewAnyFile } from '@ionic-native/preview-any-file/ngx';
import { Gesture, GestureConfig, createGesture } from '@ionic/core';
import IntroJs from 'intro.js/intro.js';
import { AnalyticsService } from 'src/app/service/analytics.service';
import { Observable } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { DatabaseServiceService } from 'src/app/service/database-service.service';
//import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { MixPanelDataService } from 'src/app/service/mixpanel/mixpanelData.service';
import { SwiperContainer } from 'swiper/element';

@Component({
  selector: 'app-inspect-viewing',
  templateUrl: './inspect-viewing.component.html',
  styleUrls: ['./inspect-viewing.component.scss'],
})
export class InspectViewingComponent implements OnInit, OnChanges {
  @ViewChild('swipeCard') swipeCard: ElementRef;
  @ViewChild('tooltip') tooltip: ElementRef;
  @ViewChild('videoIframe') iframe: ElementRef;
  @ViewChild('slideWithNav', { static: false })
  slideWithNav: ElementRef<SwiperContainer>;
  @ViewChild('slideWithNav3', { static: false })
  slideWithNav3: ElementRef<SwiperContainer>;
  @ViewChild('slideWithNavMobile', { static: false })
  slideWithNavMobile: ElementRef<SwiperContainer>;
  @ViewChild('slideWithNav3Mobile', { static: false })
  slideWithNav3Mobile: ElementRef<SwiperContainer>;

  @Output() currentNo: EventEmitter<any> = new EventEmitter();
  @Output() close: EventEmitter<any> = new EventEmitter();

  @Input() selected: any;
  @Input() details: boolean = false;
  @Input() loadFrom: string = 'config';
  @Input() defaultSelected:
    | number
    | 'none'
    | '360'
    | 'Ideal'
    | 'White'
    | 'Black'
    | 'Heart'
    | 'Arrow'
    | 'ASET'
    | 'Fire' = 'none';

  isEnd$: Observable<boolean>;
  isBeginning$: Observable<boolean>;

  isIframeEmpty: boolean = false;
  sliderOne: any;
  sliderThree: any;
  design = 'new';
  public onMobile: any;
  //Configuration for each Slider
  slideOptsOne = {
    initialSlide: 0,
    slidesPerView: 1,
    autoplay: false,
  };
  slideOptsThree = {
    initialSlide: 0,
    slidesPerView: 5,
  };
  slideOptsThreeMobile = {
    initialSlide: 0,
    slidesPerView: 3,
    autoplay: false,
    pagination: false,
  };
  stone = [];
  public shortCodes = [];
  stoneName = '';
  no: number = 0;
  stoneIndex: number = 0;
  colSize = 6;
  showCartAddedPopup: boolean = false;
  addMargin: boolean = false;
  cartProducts: any = [];
  public innerWidth: any;
  public sideMarginClass = '';
  public mobileView: boolean = false;
  public showiFrame: boolean = false;
  public certiLink: any;
  public defaultView: any;
  public firstLoggedIn: any;
  public loggedinUser: any;
  public webViewMobile: boolean = false;
  public dataLoaded: boolean = false;
  isIpad: boolean = false;
  isTabletSize: boolean = false;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
    if (this.innerWidth <= 500) {
      this.mobileView = true;
    } else if (this.innerWidth > 500) {
      this.mobileView = false;
    }

    window.addEventListener(
      'orientationchange',
      async function (e) {
        // this.ngOnInit();
        await this.loadData(this.selected[this.no]);
        await this.cdr.detectChanges();
      }.bind(this)
    );

    // const { device, orientation } = this.detectDevice();
    // // console.log(device, orientation);
    // if (
    //   device === 'touch-device' &&
    //   (orientation === 'portrait' || orientation === 'landscape')
    // ) {
    //   // this.ngOnInit();
    // }
    // this.cdr.detectChanges();
  }

  detectDevice() {
    const detectObj = {
      device: !!navigator.maxTouchPoints ? 'touch-device' : 'computer',
      orientation: !navigator.maxTouchPoints
        ? 'desctop'
        : !window.screen.orientation.angle
        ? 'portrait'
        : 'landscape',
    };

    return detectObj;
  }

  // updateSliderIconState() {
  //   this.isEnd$ = from(this.slideWithNav3.isEnd());
  //   this.isBeginning$ = from(this.slideWithNav3.isBeginning());
  // }

  // nextSlide() {
  //   if (this.slideWithNav3) {
  //     this.slideWithNav3.slideNext();
  //   }
  //   console.log(this.slideWithNav3);
  // }

  // prevSlide() {
  //   if (this.slideWithNav3) {
  //     this.slideWithNav3.slidePrev();
  //   }
  // }

  ngOnChanges(changes: any) {
    if (changes.loadFrom && changes.loadFrom.currentValue === 'config') {
      try {
        if (
          changes.selected.currentValue[0].name &&
          this._navigateService.productDetailPageList.length !== 0
        ) {
          console.log(this._navigateService.productDetailPageList);
          this.no = this._navigateService.productDetailPageList.filter(
            list =>
              changes.selected.currentValue[0].name.indexOf(
                list.productName
              ) !== -1
          )[0].index;
        }
      } catch (e) {}
    }
    if (
      !changes.selected.previousValue ||
      changes.selected.previousValue[0]?.name !==
        changes.selected.currentValue[0]?.name
    ) {
      this.ngOnInit();
    }

    if (this.details) {
      this.colSize = 4;
    }
  }
  public kgPricing: any;
  public searchResultColumns: any = [];
  public hits: any = [];
  direction = '';
  swipeElement: any;
  cardanimation: any;
  whatsAppLink: any;

  constructor(
    @Inject(DOCUMENT) document,
    private cdr: ChangeDetectorRef,
    private previewAnyFile: PreviewAnyFile,
    public _companyService: CompanyService,
    public _productTitleService: ProductTitleService,
    public _cartChangedService: CartChangedService,
    private sanitizer: DomSanitizer,
    public _navigateService: NavigateService,
    public storage: Storage,
    public _detailsService: DetailsService,
    private renderer: Renderer2,
    private modalController: ModalController,
    public _cartService: CartService,
    private iab: InAppBrowser,
    public platform: Platform,
    private router: Router,
    public analyticsService: AnalyticsService,
    public _functionsService: FunctionsService,
    public actionSheetController: ActionSheetController,
    public databaseService: DatabaseServiceService,
    //private socialSharing: SocialSharing,
    public configService: ConfigServiceService,
    public _headerFooterService: HeaderFooterService,
    public mixPanelDataService: MixPanelDataService
  ) {
    //Item object for Nature
    this.sliderOne = {
      isBeginningSlide: true,
      isEndSlide: false,
      slidesItems: [
        {
          id: 995,
        },
        {
          id: 925,
        },
        {
          id: 940,
        },
        {
          id: 943,
        },
        {
          id: 944,
        },
      ],
    };

    this.platform.ready().then(() => {
      let platforms = this.platform.platforms();
      console.log(platforms);
      console.log(this.platform.is('android'), 'android');
      console.log(this.platform.is('desktop'), 'desktop');
      console.log(this.platform.is('mobileweb'), 'mobileweb');
      // console.log("this.platform", this.platform);
      if (this.platform.is('ipad')) {
        this.isIpad = true;
      }
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

    //Item object for Fashion
    this.sliderThree = {
      isBeginningSlide: true,
      isEndSlide: false,
      slidesItems: [
        {
          id: 643,
        },
        {
          id: 532,
        },
        {
          id: 232,
        },
        {
          id: 874,
        },
        {
          id: 193,
        },
      ],
    };

    this.setConfig();
    this.checkIfTabletSize();
  }

  async setConfig() {
    if (
      this._companyService.companyObj &&
      this._companyService.companyObj &&
      this._companyService.companyObj.config
    ) {
      let companyJson = this._companyService.companyObj.config;

      if (!!companyJson) {
        if (!!companyJson) {
          if (!!companyJson.externalProduct) {
            this.kgPricing = companyJson.externalProduct;
          }

          if (!!companyJson.export) {
            if (!!companyJson.export.searchResultColumns) {
              this.searchResultColumns = companyJson.export.searchResultColumns;
              console.log(
                'this.searchResultColumns ',
                this.searchResultColumns
              );
            }
            this.searchResultColumns = this.searchResultColumns.filter(
              x => x.name != 'ADD TO CART'
            );
          }

          if (!!companyJson.shortCodes) {
            this.shortCodes = companyJson.shortCodes;
          }

          if (companyJson?.showCartAddedPopup) {
            this.showCartAddedPopup = companyJson?.showCartAddedPopup;
          }
        }
      }
    }
  }

  minus(val: boolean = false) {
    if (this.no === 0) {
      this.stoneIndex = this.selected.length - 1;
      this.no = this.selected.length - 1;
    } else {
      if (val) {
        this.stoneIndex--;
      }
      this.no--;
    }
  }

  plus(val: boolean = false) {
    /* BUG removed from if =>  || this.no == this._navigateService?.productDetailPageList?.length - 1*/
    if (this.no == this.selected.length - 1) {
      this.stoneIndex = 0;
      this.no = 0;
    } else {
      if (val) {
        this.stoneIndex++;
      }
      this.no++;
    }
  }

  async ngOnDestroy() {
    this._productTitleService.observables.next('');
  }

  getStoneName(data: any) {
    return data?.kgStoneId || data?.name || data?.stoneName;
  }

  myLoadEvent(data) {
    const stoneName = this.getStoneName(data);

    const _this = this;
    var image = new Image();
    image.onload = function () {};
    image.onerror = function () {
      _this.isIframeEmpty = true;
      console.log(_this.isIframeEmpty);
    };
    let img = `https://stackg.azureedge.net/v360azurekg/V360_5_0/imaged/${stoneName}/still.jpg`;
    console.log(img);
    image.src = img;
  }

  webkitFullscreenChange() {
    document.exitFullscreen();
  }

  checkIframeContent() {
    // this.renderer.listen(this.iframe.nativeElement, 'error', () => {
    // });
    // if (!!this.iframe && this.iframe.nativeElement) {
    //   const iframeElement: HTMLIFrameElement = this.iframe.nativeElement;
    //   console.log(iframeElement)
    //   if (
    //     !iframeElement ||
    //     !iframeElement.contentDocument ||
    //     !iframeElement.contentDocument.documentElement ||
    //     iframeElement.contentDocument.documentElement.innerHTML === ''
    //   ) {
    //     this.isIframeEmpty = true;
    //   }else{
    //   }
    // }
  }

  stoneVideoAddition(
    no: number,
    href: string,
    image: any,
    link: any,
    name: string,
    enableView: boolean
  ) {
    this.stone.push({
      no,
      href,
      image,
      link,
      name,
      enableView,
    });
  }

  stoneImageAddition(no: number, href: string, link: any, name: string) {
    this.stone.push({
      no,
      href,
      link,
      name,
    });
  }

  async loadData(obj, setTransition = false) {
    this.isIframeEmpty = false;
    if (setTransition) {
      const style = this.swipeCard.nativeElement.style;
      style.transform = 'none';
    }
    this.stone = [];
    this.stoneName = obj.stoneName ? obj.stoneName : obj.name;
    let item: any = await this.cartProducts.filter(
      (x: any) => (x.stoneName || x.sku) == this.stoneName
    )[0];
    if (!!item) {
      obj['refCartID'] = item.refCartID;
      obj['refCartProductId'] = item.refCartProductId;

      if (
        this.loadFrom == 'config' &&
        this._navigateService.productDetailPageList &&
        this._navigateService.productDetailPageList.length > 0 &&
        !!this._navigateService.productDetailPageList[this.no]
      ) {
        console.log(this._navigateService.productDetailPageList[this.no]);
        this._navigateService.productDetailPageList[this.no]['refCartID'] =
          item.refCartID;
        this._navigateService.productDetailPageList[this.no][
          'refCartProductId'
        ] = item.refCartProductId;
      }
      this.cdr.detectChanges();
    }

    //console.log(obj)
    // let response = await this._headerFooterService.getCartDetailsV1(userId, sessionId, 0, 10000, "", "", true);
    // if (!!response) {
    //   let cartData = response;
    //   let products = [];
    //   if (cartData.data.products) {
    //     products = cartData.data.products;
    //     let item: any = products.filter(x => x.stoneName == this.selected[index].stoneName)[0]
    //     this.selected[index]['refCartID'] = item.refCartID
    //     this.selected[index]['refCartProductId'] = item.refCartProductId
    //   }
    // }
    let options = {
      stoneName: this.stoneName,
      removeTitlecase: true,
    };
    this._productTitleService.observables.next(options);

    if (obj.Image360) {
      // this.stone.push({
      //   no: 0,
      //   href: 'iframe',
      //   image: obj.White,
      //   link: obj.Image360,
      //   name: 'Video',
      //   enableView: true,
      // });
      this.stoneVideoAddition(
        this.stone.length,
        'iframe',
        obj.White,
        obj.Image360,
        'Video',
        true
      );
    }

    if (obj.Fire) {
      // this.stone.push({
      //   no: 7,
      //   href: 'iframe',
      //   image: obj.White,
      //   link: obj.Fire,
      //   name: 'Fire',
      //   enableView: false,
      // });
      this.stoneVideoAddition(
        this.stone.length,
        'iframe',
        obj.Black,
        obj.Fire,
        'Fire',
        false
      );
    }

    if (obj.TweezerVideo?.toLowerCase() === 'y') {
      // this.stone.push({
      //   no: 9,
      //   href: 'iframe',
      //   image: obj.White,
      //   link: obj.Sparkle,
      //   name: 'Sparkle',
      //   enableView: false,
      // });
      this.stoneVideoAddition(
        this.stone.length,
        'iframe',
        'assets/images/Tweezer-Sparkle.jpg',
        obj.Sparkle,
        'Tweezer',
        false
      );
    }

    if (obj.HandVideo?.toLowerCase() === 'y') {
      // this.stone.push({
      //   no: 8,
      //   href: 'iframe',
      //   image: obj.White,
      //   link: obj.Dazzle,
      //   name: 'Dazzle',
      //   enableView: false,
      // });
      this.stoneVideoAddition(
        this.stone.length,
        'iframe',
        'assets/images/Hand-Dazzle.jpg',
        obj.Dazzle,
        'Hand',
        false
      );
    }

    if (obj.Ideal) {
      // this.stone.push({ no: 1, href: 'image', link: obj.Ideal, name: 'Ideal' });
      this.stoneImageAddition(this.stone.length, 'image', obj.Ideal, 'Ideal');
    }

    if (obj.White) {
      // this.stone.push({ no: 2, href: 'image', link: obj.White, name: 'White' });
      this.stoneImageAddition(this.stone.length, 'image', obj.White, 'White');
    }

    if (obj.Black) {
      // this.stone.push({ no: 3, href: 'image', link: obj.Black, name: 'Black' });
      this.stoneImageAddition(this.stone.length, 'image', obj.Black, 'Black');
    }

    if (obj.Heart) {
      // this.stone.push({ no: 4, href: 'image', link: obj.Heart, name: 'Heart' });
      this.stoneImageAddition(this.stone.length, 'image', obj.Heart, 'Heart');
    }

    if (obj.Arrow) {
      // this.stone.push({ no: 5, href: 'image', link: obj.Arrow, name: 'Arrow' });
      this.stoneImageAddition(this.stone.length, 'image', obj.Arrow, 'Arrow');
    }

    // if (obj.Certifiate) {
    //   let certiLink = this.sanitizer.bypassSecurityTrustResourceUrl(obj.Certifiate);
    //   this.stone.push({ no: 6, href: 'iframe', link: certiLink, name: 'Cert' });
    // }

    if (obj.ASET) {
      // this.stone.push({ no: 6, href: 'image', link: obj.ASET, name: 'Aset' });
      this.stoneImageAddition(this.stone.length, 'image', obj.ASET, 'Aset');
    }

    this.dataLoaded = true;

    this.hits = [obj];
    console.log('this.hits ', this.hits, this.details, this.defaultSelected);
    // this.updateSliderIconState();
    //this.setDefaultView(0)
    this.checkIframeContent();
  }

  closeIframe() {
    this.showiFrame = false;
  }

  openVideoLink(link) {
    //this.showiFrame = false;
    //window.open(link, '_system', 'location=yes');
    const browser = this.iab.create(link, '_system', 'location=yes');
    browser.show();
    /*
    if (this.mobileView && !this.webViewMobile) {
      const options: InAppBrowserOptions = {
        location: 'yes', // Set to 'no' to hide the address bar
        zoom: 'no', // Set to 'yes' to allow zooming
        hardwareback: 'no', // Set to 'yes' to handle the hardware back button on Android
        footer: 'yes', // Set to 'no' to hide the toolbar at the bottom
        hideurlbar: 'yes', // Set to 'yes' to hide the URL bar on top
        hidenavigationbuttons: 'yes', // Set to 'yes' to hide navigation buttons (back, forward, etc.)
        closebuttoncaption: 'Close', // Custom text for the close button
        disallowoverscroll: 'yes', // Set to 'yes' to prevent over-scrolling
        toolbarposition: 'bottom', // Position of the toolbar (top, bottom)
      };
      this.iab.create(link, '_blank', options);
    } else {
      if (this.isIpad && !this.webViewMobile) {
        const options: InAppBrowserOptions = {
          location: 'yes', // Set to 'no' to hide the address bar
          zoom: 'no', // Set to 'yes' to allow zooming
          hardwareback: 'no', // Set to 'yes' to handle the hardware back button on Android
          footer: 'yes', // Set to 'no' to hide the toolbar at the bottom
          hideurlbar: 'yes', // Set to 'yes' to hide the URL bar on top
          hidenavigationbuttons: 'yes', // Set to 'yes' to hide navigation buttons (back, forward, etc.)
          closebuttoncaption: 'Close', // Custom text for the close button
          toolbarposition: 'top', // Position of the toolbar (top, bottom)
        };
        this.iab.create(link, '_blank', options);
      } else {
        window.open(link, '_blank');
      }
    }
    */
  }

  openCertificateFile(Certificatefilename) {
    this.certiLink = '';
    this.showiFrame = false;
    if (this.mobileView && !this.webViewMobile) {
      this.previewAnyFile.preview(Certificatefilename).then(
        (res: any) => {
          console.log('file : ' + res);
          //this.configService.presentToast("File Downloaded", "success");
        },
        error => {
          // handle error
          console.error(error);
        }
      );
    } else {
      if (this.isIpad && !this.webViewMobile) {
        this.previewAnyFile.preview(Certificatefilename).then(
          (res: any) => {
            console.log('file : ' + res);
            //this.configService.presentToast("File Downloaded", "success");
          },
          error => {
            // handle error
            console.error(error);
          }
        );
      } else {
        window.open(Certificatefilename, '_blank');
      }
    }

    // if (this.onMobile) {
    //   this.previewAnyFile.preview(Certificatefilename).then((res: any) => {
    //     console.log('file : ' + res);
    //     //this.configService.presentToast("File Downloaded", "success");
    //   }, (error) => {
    //     // handle error
    //     console.error(error)
    //   });
    // } else {

    //   window.open(Certificatefilename, "_blank");
    // }
    //const browser = this.iab.create(Certificatefilename, '_self', { location: 'no' });
  }

  checkingShapeCode(res: any) {
    let checkRound = res['ShapeCode'].toLowerCase();
    if (checkRound !== 'round') {
      res['CutCode'] = '';
    }
    return res;
  }

  async ionViewDidEnter() {}

  convertCode = function (res: any, codeKey: string) {
    if (!!res[codeKey]) {
      const obj = this.shortCodes.find((x: any) => x.label == res[codeKey]);
      if (!!obj) {
        res[codeKey] = obj.code;
      }
    }
    return res;
  };

  async ngOnInit() {
    if (this.selected.length > 0) {
      this.selected = this.selected.map((res: any) => {
        let shapeCode =
          res['eliteShapeCode'] || res['standardShapeCode'] || res['ShapeCode'];

        res['ShapeCode'] = shapeCode;

        if (res['ShapeCode']) {
          res = this.checkingShapeCode(res);
        }

        res = this.convertCode(res, 'CutCode');
        res = this.convertCode(res, 'PolishCode');
        res = this.convertCode(res, 'SymmetryCode');
        return res;
      });
    }
    this.loggedinUser = await this.storage.get('loggedInUser');
    this.innerWidth = window.innerWidth;
    if (this.innerWidth <= 500) {
      this.mobileView = true;
      this.slideOptsOne['pagination'] = false;
    } else if (this.innerWidth > 500) {
      this.mobileView = false;
    }

    let sessionId = await this.storage.get('sessionID');
    let userId = await this.storage.get('userID');

    let response = await this._headerFooterService.getCartDetailsV1(
      userId,
      sessionId,
      0,
      10000,
      '',
      '',
      false
    );
    if (!!response) {
      let cartData = response;
      if (cartData.data.products) {
        this.cartProducts = cartData.data.products;
        console.log(this.cartProducts);
      }
    }
    if (this.selected.length > 0) {
      this.selected = await this.selected.map(res => {
        let lab = res['lab'];
        let ReportNo = res['ReportNo'];
        let stoneName = res.name || res.stoneName;
        let currentLocation = res['currentLocation'];
        let tracrId;

        // if (res['ShapeCode']) {
        //   let checkRoundl = res['ShapeCode'].indexOf("Round");
        //   let checkRoundU = res['ShapeCode'].indexOf("ROUND");
        //   if (checkRoundl < 0 && checkRoundU < 0) {
        //     res['CutCode'] = ""
        //   }
        // }

        if (!!res.kgStoneId) {
          stoneName = res.kgStoneId;
        }

        if (!!res.tracrId) {
          tracrId = res.tracrId;
        }

        let item: any = this.cartProducts.filter(
          (x: any) => (x.stoneName || x.sku) == stoneName
        )[0];
        if (!!item) {
          console.log(item);
          res['refCartID'] = item.refCartID;
          res['refCartProductId'] = item.refCartProductId;
        }
        this.cdr.detectChanges();
        let images = {
          Ideal: `diaboxexport/${stoneName}/${stoneName}-IdealScope-01.jpg`,
          White: `diaboxexport/${stoneName}/${stoneName}-Officelight%20Gray-01.jpg`,
          Black: `diaboxexport/${stoneName}/${stoneName}-Officelight%20black-01.jpg`,
          Heart: `diaboxexport/${stoneName}/${stoneName}-Hearts-01.jpg`,
          Arrow: `diaboxexport/${stoneName}/${stoneName}-Arrows-01.jpg`,
          Certifiate: '',
          ASET: `diaboxexport/${stoneName}/${stoneName}-ASET%20white-01.jpg`,
          // DIBoxExport/stone_Id/stone_Id-Officelight%20Gray-01.jpg
        };

        // if (stoneName.charAt(0) == 'B' && stoneName.charAt(1) == 'N') {
        //   images[
        //     'White'
        //   ] = `diaboxexport/${stoneName}/${stoneName}-officelight%20Gray-01.jpg`;
        //   images[
        //     'Black'
        //   ] = `diaboxexport/${stoneName}/${stoneName}-officelight%20black-01.jpg`;
        // } else {
        //   images[
        //     'White'
        //   ] = `diaboxexport/${stoneName}/${stoneName}-Officelight%20Gray-01.jpg`;
        //   images[
        //     'Black'
        //   ] = `diaboxexport/${stoneName}/${stoneName}-Officelight%20black-01.jpg`;
        // }
        Object.keys(images).map(res => {
          images[res] = this.sanitizer.bypassSecurityTrustResourceUrl(
            `https://kgmediaprod.blob.core.windows.net/${images[res]}`
          );
        });

        if (!!res?.Cutwise_id) {
          images['Fire'] = this.sanitizer.bypassSecurityTrustResourceUrl(
            `https://widget.cutwise.com/video/${res?.Cutwise_id}?autoplay=1&sp=43`
          );
        }

        images['Image360'] = this.sanitizer.bypassSecurityTrustResourceUrl(
          `https://stackg.azureedge.net/v360azurekg/V360_5_0/Vision360.html?d=${stoneName}`
        );
        if (lab && ReportNo) {
          images[
            'Certificate'
          ] = `https://kgmediaprod.blob.core.windows.net/certificates/${lab}/${ReportNo}.pdf`;
        }

        if (res.HandVideo?.toLowerCase() === 'y') {
          images['Dazzle'] = this.sanitizer.bypassSecurityTrustResourceUrl(
            `https://video.diamlist.com/Hand/${stoneName}.mp4`
          );
          // `https://stackg.azureedge.net/v360azurekg/V360_5_0/Hand_Dazzle/${stoneName}.mp4`;
        }

        if (res.TweezerVideo?.toLowerCase() === 'y') {
          images['Sparkle'] = this.sanitizer.bypassSecurityTrustResourceUrl(
            `https://video.diamlist.com/Tweezer/${stoneName}.mp4`
          );
          // `https://stackg.azureedge.net/v360azurekg/V360_5_0/Tweezer_Sparkle/${stoneName}.mp4`;
        }

        if (stoneName) {
          this.whatsAppLink = encodeURIComponent(
            'https://kgdiamonds.app.link?$stoneName=' +
              stoneName +
              '&$refKgCompanyId=' +
              currentLocation
          );
          images[
            'VideoLink'
          ] = `https://video.diamlist.com/VideoPage.aspx?stoneid=${stoneName}`;
        }

        if (tracrId) {
          images['TracrUrl'] = `https://search.tracr.com/${tracrId}/diamond`;
        }

        // https://search.60a84758-15c4-4851-9d5e-fd3adb9e5804.tracr.com/search/
        // if (res.location) {
        //   if (res.location == 'mumbai') {
        //     res.location = res.location.toUpperCase()
        //   } else if (res.location == 'hk') {
        //     res.location = "HONG KONG"
        //   } else if (res.location == 'ny' || res.location == 'aspecony') {
        //     res.location = "NEW YORK"
        //   } else if (res.location == 'aspeconv') {
        //     res.location = "ANTWERP"
        //   } else if (res.location == 'dmcc') {
        //     res.location = "DUBAI"
        //   }
        // }

        return { ...res, ...images };
      });
      // console.log(this.selected);
      await this.loadData(this.selected[0]);
    }
  }

  //Move to Next slide
  slideNext(object, slideView) {
    console.log(slideView);
    slideView.slideNext(500).then(() => {
      this.checkIfNavDisabled(object, slideView);
    });
  }

  async setDefaultView(no, currentSelected = null) {
    if (currentSelected.href == 'iframe') {
      if (currentSelected) {
        return (currentSelected.enableView = true);
      }
    } else {
      return (currentSelected.enableView = false);
    }

    // if (no == 7) {
    //   this.stone = await this.stone.map(x => {
    //     if (x.no == 7) {
    //       return {
    //         ...x,
    //         enableView: true
    //       }
    //     } else {
    //       return x
    //     }
    //   })
    // } else {
    //   this.stone = await this.stone.map(x => {
    //     if (x.no == 7) {
    //       return {
    //         ...x,
    //         enableView: false
    //       }
    //     }else{
    //       return x
    //     }
    //   })
    // }
    // let s = await this.stone.map(x=>{
    //   if(x.no==no){
    //     return{
    //       ...x,
    //       enableView:true
    //     }
    //   }else{
    //     return{
    //       ...x,
    //       enableView:false
    //     }
    //   }
    // })
    // this.stone = s;
    // setTimeout(() => {
    //   this.defaultView = no;
    // }, 1000);
    this.defaultView = no;
    this.defaultSelected = no;
  }

  loaddefaultSlide() {
    let sliderIndex = 0;
    if (this.defaultView) {
      sliderIndex = this.defaultView;
    }
    // setTimeout(() => {
    //   this.slideWithNav.slideTo(sliderIndex);
    //   this.slideWithNavMobile.slideTo(sliderIndex);
    //   this.slideWithNav3Mobile.slideTo(sliderIndex);
    //   this.slideWithNav3.slideTo(sliderIndex);
    //   this.updateSliderIconState();
    // }, 100);
  }

  loadSlider(slideWithNav, no) {
    // console.log(slideWithNav, no);
    this.defaultSelected = no;
    setTimeout(() => {
      this.slideWithNav.nativeElement.swiper.slideTo(no);
      this.slideWithNavMobile.nativeElement.swiper.slideTo(no);
      this.slideWithNav3Mobile.nativeElement.swiper.slideTo(no);
      // this.slideWithNav3.nativeElement.swiper.slideTo(no);
      // this.updateSliderIconState();
      this.initGesture();
      // this.YinitGesture();
    }, 100);
  }
  //Move to previous slide
  slidePrev(object, slideView) {
    slideView.slidePrev(500).then(() => {
      this.checkIfNavDisabled(object, slideView);
    });
  }

  //Method called when slide is changed by drag or navigation
  SlideDidChange(object, slideView) {
    // this.slideWithNav.getActiveIndex().then(index => {
    //   this.defaultSelected = index;
    // });
    // this.slideWithNavMobile.getActiveIndex().then(index => {
    //   this.defaultSelected = index;
    // });
    // this.checkIfNavDisabled(object, slideView);
  }

  //Call methods to check if slide is first or last to enable disbale navigation
  checkIfNavDisabled(object, slideView) {
    this.checkisBeginning(object, slideView);
    this.checkisEnd(object, slideView);
  }

  checkisBeginning(object, slideView) {
    slideView.isBeginning().then(istrue => {
      object.isBeginningSlide = istrue;
    });
  }

  checkisEnd(object, slideView) {
    slideView.isEnd().then(istrue => {
      object.isEndSlide = istrue;
    });
  }

  async changeView() {
    if (this.selected.length > 0) {
      if (this.no == 0) {
        await this.plus(true);
        await this.changeStoneId(this.no);
        await this.loadData(this.selected[this.no]);
        //this.changeStoneId(this.no);
      } else if (this.no + 1 == this.selected.length) {
        await this.minus(true);
        await this.changeStoneId(this.no);
        await this.loadData(this.selected[this.no]);
      } else {
        await this.plus(true);
        await this.changeStoneId(this.no);
        await this.loadData(this.selected[this.no]);
      }
      //await this.plus(true);
      //await this.loadData(this.selected[this.no])
    } else if (
      this._navigateService &&
      this._navigateService.productDetailPageList &&
      this._navigateService.productDetailPageList.length > 0
    ) {
      if (this.no == 0) {
        await this.plus(true);
        await this.changeStoneId(this.no);
      } else if (
        this.no + 1 ==
        this._navigateService.productDetailPageList.length
      ) {
        await this.minus(true);
        await this.changeStoneId(this.no - 1);
      } else {
        await this.plus(true);
        await this.changeStoneId(this.no + 1);
      }
    } else {
      this.stoneName = '';
      this.hits = [];
      this.stone = [];
      this.close.emit();
    }
  }

  async rejectStone() {
    await this.databaseService.showSpinner();
    let sessionId = await this.storage.get('sessionID');
    let userId = await this.storage.get('userID');
    let userdata = await this.storage.get('userData');
    await this.databaseService.hideSpinner();
    if (this.showCartAddedPopup && this.onMobile) {
      let index = this.stoneIndex;
      console.log(index);

      if (!!this.selected[this.no] && this.loadFrom != 'config') {
        this.selected[this.no]['rejected'] = true;
      } else {
        //this.selected[index]['rejected'] = true
        this._navigateService.productDetailPageList[this.no]['rejected'] = true;
      }

      if (this.loadFrom == 'config') {
        this.cartAddedPopup(
          'reject',
          this._navigateService.productDetailPageList[this.no]['productName']
        );
        await this.plus();
        this.changeStoneId(this.no);
      } else {
        this.changeView();
        this.cartAddedPopup('reject', this.selected[this.no - 1]['stoneName']);
      }
    } else {
      let index = this.stoneIndex;
      //console.log('jjjjjj')
      //console.log(this.selected[0].name)

      if (!!this.selected[this.no] && this.loadFrom != 'config') {
        this.selected[this.no]['rejected'] = true;
      } else {
        //this.selected[index]['rejected'] = true
        this._navigateService.productDetailPageList[this.no]['rejected'] = true;
      }

      if (this.loadFrom == 'config') {
        await this.plus();
        this.changeStoneId(this.no);
      } else {
        this.changeView();
      }
      this.analyticsService.addEvents('Stone rejected', {
        stoneID: this.selected[0].name,
        username: userdata.name,
        user: userdata.username,
      });
      this.configService.presentToast('Stone rejected successfully', 'success');
    }
  }

  intro() {
    let intro = IntroJs();
    console.log('inside intro.js');
    var _this = this;
    intro.setOptions({
      tooltipClass: 'customTooltip',
      steps: [
        {
          element: '#step1',
          intro: 'Swipe Right to Add Stone to Your Cart.',
          position: 'bottom',
        },
        {
          element: '#step2',
          intro: 'Swipe Left to Reject Stone from Your List.',
          position: 'bottom',
        },
      ],
      showBullets: false,
      //showProgress: true,
      // skipLabel: "Annuler",
      // doneLabel: "Commencer",
      // nextLabel: "Suivant",
      // prevLabel: "Précédent",
      overlayOpacity: '0.8',
    });
    setTimeout(() => {
      // intro.start(async function () {

      // })

      intro
        .onchange(function (targetElement) {
          switch (targetElement.id) {
            case 'step1':
              document.getElementById('step2').style.backgroundImage = '';
              document.getElementById('step1').style.backgroundImage =
                'url(assets/images/right.png)';
              document.getElementById('step1').style.backgroundRepeat =
                'no-repeat';
              document.getElementById('step1').style.backgroundPosition =
                'center';
              document.getElementById('step1').style.backgroundSize = '50px';
              break;
            case 'step2':
              document.getElementById('step2').style.backgroundImage =
                'url(assets/images/left.png)';
              document.getElementById('step2').style.backgroundRepeat =
                'no-repeat';
              document.getElementById('step2').style.backgroundPosition =
                'center';
              document.getElementById('step2').style.backgroundSize = '50px';
              document.getElementById('step1').style.backgroundImage = '';

              break;
          }
        })
        .start();

      intro.oncomplete(async function () {
        document.getElementById('step1').style.backgroundImage = '';
        document.getElementById('step2').style.backgroundImage = '';
        _this.storage.set('firstLoggedInDone', true);
        let t = await _this.storage.get('firstLoggedInDone');
      });
      intro.onexit(async function () {
        document.getElementById('step1').style.backgroundImage = '';
        document.getElementById('step2').style.backgroundImage = '';
        _this.storage.set('firstLoggedInDone', true);
        let t = await _this.storage.get('firstLoggedInDone');
      });
    }, 1000);
    //IntroJs(document.getElementById("inst1")).start();
  }

  async ngAfterViewInit() {
    // if(this.onMobile){
    //   this.intro();
    // }

    this.initGesture();
    // this.swipeElement = document.getElementById('swipe-card');//indiquer ici l'element
    // this.cardanimation = new Hammer(this.swipeElement);
  }

  async prvStone() {
    await this.minus(true);
    this.changeStoneId(this.no);
    await this.loadData(this.selected[this.no], true);
  }

  async nxtStone() {
    await this.plus(true);
    this.changeStoneId(this.no);
    await this.loadData(this.selected[this.no], true);
  }

  async YinitGesture() {
    const style = this.swipeCard.nativeElement.style;
    const windowWidth = window.innerWidth;
    const options: GestureConfig = {
      el: this.swipeCard.nativeElement,
      direction: 'y',
      gestureName: 'tinder-swipe',
      onStart: () => {
        style.transition = 'none';
        console.log('---');
      },
      onMove: ev => {
        style.transform = `translateY(${ev.deltaY}px) rotate(${
          ev.deltaY / 20
        }deg)`;
      },
      onEnd: ev => {
        style.transition = '0.3s ease-out';
        console.log(ev);
        if (ev.deltaY > windowWidth / 2) {
          style.transform = `translateX(${windowWidth * 1.5}px)`;
          console.log('down');
          this.prvStone();
        } else if (ev.deltaY < -windowWidth / 2) {
          style.transform = `translateY(-${windowWidth * 5.5}px)`;
          console.log('up');
          this.nxtStone();
          //style.transform = 'none';
          //this.match.emit(false);
        } else {
          style.transform = '';
        }
      },
    };
    const ygesture: Gesture = await createGesture(options);
    ygesture.enable();
  }

  async initGesture() {
    const style = this.swipeCard.nativeElement.style;
    const windowWidth = window.innerWidth;
    const options: GestureConfig = {
      el: this.swipeCard.nativeElement,
      direction: 'x',
      gestureName: 'tinder-swipe',
      onStart: () => {
        style.transition = 'none';
      },
      onMove: ev => {
        style.transform = `translateX(${ev.deltaX}px) rotate(${
          ev.deltaX / 4
        }deg)`;
      },
      onEnd: ev => {
        style.transition = '0.3s ease-out';
        console.log(ev);
        if (ev.deltaX > windowWidth / 5) {
          style.transform = `translateX(${windowWidth * 1.5}px)`;
          console.log('right');
          this.addStonesToCart();
          style.transform = 'none';
          //this.match.emit(true);
        } else if (ev.deltaX < -windowWidth / 5) {
          style.transform = `translateX(-${windowWidth * 1.5}px)`;
          console.log('left');
          this.rejectStone();
          style.transform = 'none';
          //this.match.emit(false);
        } else {
          style.transform = '';
        }
      },
    };
    const xgesture: Gesture = await createGesture(options);
    xgesture.enable();

    this.firstLoggedIn = await this.storage.get('firstLoggedInDone');
    if (!this.firstLoggedIn && !!this.onMobile) {
      // let step1 = document.getElementById('step1');
      // step1.style.display = 'visible';

      // let step2 = document.getElementById('step2');
      // step2.style.display = 'visible';
      this.intro();
    }
  }

  async addStonetoCartAndNext() {
    this.databaseService.showSpinner();
    let userId = await this.storage.get('userID');
    // console.log("this.userId", this.userId);
    let sessionId = await this.storage.get('sessionID');
    let selectedVariantObj = [];
    let formVariantObj = [];
    let stoneArray = [];
    let sId = this.selected[this.loadFrom == 'config' ? 0 : this.no];

    let obj = {
      stoneId: sId.stoneName,
      lab: sId.lab,
      ShapeCode: sId.ShapeCode,
      ColorCode: sId.ColorCode,
      ClarityCode: sId.ClarityCode,
      cts: sId.cts,
    };
    stoneArray.push(obj);
    let index = this.loadFrom == 'config' ? 0 : this.no;
    let resProd: any = await this._detailsService.getProductDetail(
      this.selected[index].stoneName,
      this.selected[index].currentLocation,
      sessionId,
      userId
    );

    selectedVariantObj.push({
      PvID: resProd.data[0].listOfVariants[0].id,
      quantity: resProd.data[0].cts,
      discount: resProd.data[0][this.kgPricing.kgAppliedDiscount],
      taxes: 0,
      //price: resProd.data[0].RAPAPORT
    });

    formVariantObj.push({
      refPvID: resProd.data[0].listOfVariants[0].id,
      quantity: resProd.data[0].cts,
      discount: resProd.data[0][this.kgPricing.kgAppliedDiscount],
      taxes: 0,
      //price: resProd.data[0].RAPAPORT
    });

    // console.log("selectedVariantObj ", selectedVariantObj);
    let res = await this._functionsService.addMultipleToCart(
      userId,
      sessionId,
      selectedVariantObj,
      ''
    );

    let response = await this._headerFooterService.getCartDetailsV1(
      userId,
      sessionId,
      0,
      10000,
      '',
      '',
      false
    );
    if (!!response) {
      let cartData = response;
      let products = [];
      if (cartData.data.products) {
        products = cartData.data.products;
        let item: any = products.filter(
          x => x.stoneName == this.selected[index].stoneName
        )[0];
        this.selected[index]['refCartID'] = item.refCartID;
        this.selected[index]['refCartProductId'] = item.refCartProductId;
        this.cdr.detectChanges();
      }
    }
    await this._headerFooterService.cartValueUpdated();
    this.databaseService.hideSpinner();
  }

  async addStonesToCart(buttonType = null) {
    this.databaseService.showSpinner();
    let userId = await this.storage.get('userID');
    let userdata = await this.storage.get('userData');
    // console.log("this.userId", this.userId);
    let sessionId = await this.storage.get('sessionID');
    let selectedVariantObj = [];
    let formVariantObj = [];
    let stoneArray = [];
    let sId = this.selected[this.loadFrom == 'config' ? 0 : this.no];

    if (
      !!sId &&
      !!sId.externalStatus &&
      sId.externalStatus.toLowerCase() !== 'on memo'
    ) {
      let obj = {
        stoneId: sId.stoneName,
        lab: sId.lab,
        ShapeCode: sId.ShapeCode,
        ColorCode: sId.ColorCode,
        ClarityCode: sId.ClarityCode,
        cts: sId.cts,
      };
      stoneArray.push(obj);
      let index = this.loadFrom == 'config' ? 0 : this.no;

      let resProd: any = await this._detailsService.getProductDetail(
        this.selected[index].stoneName,
        this.selected[index].currentLocation,
        sessionId,
        userId
      );

      selectedVariantObj.push({
        PvID:
          resProd.data[0].listOfVariants.length > 0
            ? resProd.data[0].listOfVariants[0].id
            : '',
        quantity: resProd.data[0].cts,
        discount: resProd.data[0][this.kgPricing.kgAppliedDiscount],
        taxes: 0,
        //price: resProd.data[0].RAPAPORT
      });

      formVariantObj.push({
        refPvID:
          resProd.data[0].listOfVariants.length > 0
            ? resProd.data[0].listOfVariants[0].id
            : '',
        quantity: resProd.data[0].cts,
        discount: resProd.data[0][this.kgPricing.kgAppliedDiscount],
        taxes: 0,
        //price: resProd.data[0].RAPAPORT
      });
      if (buttonType == 'purchase') {
        let checkLoggedIn = await this.storage.get('loggedInUser');
        if (!!checkLoggedIn) {
          let res = await this._functionsService.addToPurchaseCart(
            userId,
            sessionId,
            selectedVariantObj
          );
          if (!!res.isSuccess) {
            await this.configService.hideLoading();
            let navigationExtras: NavigationExtras = {
              queryParams: {
                cartId: res?.data.id,
              },
            };

            const purchaseData: {} = this.mixPanelDataService.getPurchaseData(
              sId,
              userId,
              userdata
            );

            this.analyticsService.addEvents('purchase', purchaseData);

            this.router.navigate(['/manage-orders'], navigationExtras);
          } else {
            await this.configService.hideLoading();
            this.configService.presentToast('Some error occur', 'error');
          }
        } else {
          await this.configService.hideLoading();
          this.configService.presentToast('Please Login', 'error');
        }
      } else {
        let res = await this._functionsService.addMultipleToCart(
          userId,
          sessionId,
          selectedVariantObj,
          ''
        );

        let response = await this._headerFooterService.getCartDetailsV1(
          userId,
          sessionId,
          0,
          10000,
          '',
          '',
          false
        );

        if (!!response) {
          let cartData = response;
          let products = [];
          if (cartData.data.products.length > 0) {
            products = cartData.data.products;
            console.log(this.selected);
            let item: any = products.filter(
              (x: any) =>
                (x.stoneName || x.sku) == this.selected[index].stoneName
            )[0];
            this.selected[index]['refCartID'] = item.refCartID;
            this.selected[index]['refCartProductId'] = item.refCartProductId;
            if (
              this.loadFrom == 'config' &&
              !!this._navigateService.productDetailPageList &&
              this._navigateService.productDetailPageList.length > 0
            ) {
              this._navigateService.productDetailPageList[this.no][
                'refCartID'
              ] = item.refCartID;
              this._navigateService.productDetailPageList[this.no][
                'refCartProductId'
              ] = item.refCartProductId;
            }
            this.cdr.detectChanges();
          }
        }
        await this._headerFooterService.cartValueUpdated();
        //await this.configService.hideLoading();
        this.databaseService.hideSpinner();
        // if (this._navigateService && this._navigateService.productDetailPageList && this._navigateService.productDetailPageList.length > 0) {
        //   this.changeStoneId(this.no++);
        // } else if (this.selected.length == (this.no + 1)) {
        //   this.changeStoneId(this.no--);
        // }
        // this.cartAddedPopup('cart', null)

        if (this.showCartAddedPopup && this.onMobile && !this.isIpad) {
          this.cartAddedPopup('cart', null);

          if (this.selected.length > 1) {
            if (this.no == 0) {
              console.log('1');
              await this.plus(true);
              this.changeStoneId(this.no);
              //await this.loadData(this.selected[this.no])
              //this.changeStoneId(this.no);
            } else if (this.no + 1 == this.selected.length) {
              console.log('2');
              await this.minus(true);
              this.changeStoneId(this.no);
              await this.loadData(this.selected[this.no]);
            } else {
              console.log('3');
              await this.plus(true);
              this.changeStoneId(this.no);
              await this.loadData(this.selected[this.no]);
            }
            //await this.plus(true);
            //await this.loadData(this.selected[this.no])
          } else if (
            this._navigateService &&
            this._navigateService.productDetailPageList &&
            this._navigateService.productDetailPageList.length > 0
          ) {
            if (this.no == 0) {
              this.changeStoneId(this.no);
            } else if (
              this.no + 1 ==
              this._navigateService.productDetailPageList.length
            ) {
              this.changeStoneId(this.no - 1);
            } else {
              this.plus();
              this.changeStoneId(this.no);
            }
          } else {
            this.stoneName = '';
            this.hits = [];
            this.stone = [];
            this.close.emit();
          }
        } else {
          if (!!userdata && !!userdata.name)
            this.analyticsService.addEvents('add to cart from view', {
              stoneID: sId.stoneName,
              username: userdata.name,
              user: userdata.username,
            });
          this.configService.presentToast(
            'Stone added to cart successfully',
            'success'
          );
          //this._navigateService?.productDetailPageList?.splice(this.no, 1);
          //this.selected[this.no]['removed'] = true
          //console.log(this.selected)
          if (this.selected.length > 1) {
            if (this.no == 0) {
              console.log('1');
              await this.plus(true);
              this.changeStoneId(this.no);
              //await this.loadData(this.selected[this.no])
              //this.changeStoneId(this.no);
            } else if (this.no + 1 == this.selected.length) {
              console.log('2');
              await this.minus(true);
              this.changeStoneId(this.no);
              await this.loadData(this.selected[this.no]);
            } else {
              console.log('3');
              await this.plus(true);
              this.changeStoneId(this.no);
              await this.loadData(this.selected[this.no]);
            }
            //await this.plus(true);
            //await this.loadData(this.selected[this.no])
          } else if (
            this._navigateService &&
            this._navigateService.productDetailPageList &&
            this._navigateService.productDetailPageList.length > 0
          ) {
            if (this.no == 0) {
              console.log('4');
              this.changeStoneId(this.no);
            } else if (
              this.no + 1 ==
              this._navigateService.productDetailPageList.length
            ) {
              console.log('5');
              this.changeStoneId(this.no - 1);
            } else {
              console.log('6');
              await this.plus();
              this.changeStoneId(this.no);
            }
          }
        }
      }
    } else {
      this.databaseService.hideSpinner();
      this.configService.presentToast(
        `Status of this stone is "On Memo". ${
          buttonType === 'purchase'
            ? 'You can not purchase this stone.'
            : 'You can not add this stone into cart.'
        }`,
        'error'
      );
    }
  }

  async removeReject() {
    if (this.loadFrom == 'config') {
      this._navigateService.productDetailPageList[this.no]['rejected'] = false;
      await this.plus();
      this.changeStoneId(this.no);
    } else {
      this.selected[this.no]['rejected'] = false;
      this.changeView();
    }
  }

  async removeStonesFromCart() {
    this.databaseService.showSpinner();
    let item = this.selected[this.loadFrom == 'config' ? 0 : this.no];
    console.log(item);
    let sessionId = await this.storage.get('sessionID');
    let userId = await this.storage.get('userID');
    let userdata = await this.storage.get('userData');
    if (!!userdata && !!userdata.name) {
      this.analyticsService.addEvents('removed from cart', {
        stoneID: this.selected[this.loadFrom == 'config' ? 0 : this.no].name,
        username: userdata.name,
        user: userdata.username,
      });
    }
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
      await this._headerFooterService.cartValueUpdated();
      console.log(this.loadFrom, '---', this.no, '--', this.selected);
      this.selected[this.loadFrom == 'config' ? 0 : this.no]['refCartID'] = '';
      this.selected[this.loadFrom == 'config' ? 0 : this.no][
        'refCartProductId'
      ] = '';

      if (
        this.loadFrom == 'config' &&
        !!this._navigateService.productDetailPageList &&
        this._navigateService.productDetailPageList.length > 0
      ) {
        this._navigateService.productDetailPageList[this.no]['refCartID'] = '';
        this._navigateService.productDetailPageList[this.no][
          'refCartProductId'
        ] = '';
      }
      console.log(this.selected);
      // this.cdr.detectChanges();
    }

    let response = await this._headerFooterService.getCartDetailsV1(
      userId,
      sessionId,
      0,
      10000,
      '',
      '',
      false
    );
    if (!!response) {
      let cartData = response;
      let products = [];
      if (cartData.data.products) {
        this.cartProducts = cartData.data.products;
      }
    }
    this.databaseService.hideSpinner();

    // let response = await this._headerFooterService.getCartDetailsV1(userId, sessionId, 0, 10000, "", "", true);
    // if (!!response) {
    //   let cartData = response;
    //   let products = [];
    //   if (cartData.data.products) {
    //     products = cartData.data.products;
    //     let item: any = products.filter(x => x.stoneName == selcteitem.stoneName)[0]
    //     let res = await this._functionsService.removeCartProduct(item.refCartID, item.refCartProductId || item.id, sessionId, userId);
    //     if (!!res.isSuccess) {
    //       let data = {
    //         type: "remove",
    //         data: item
    //       }
    //       await this._headerFooterService.cartValueUpdated();
    //       this.selected[this.loadFrom == 'config' ? 0 : this.no]['removed'] = false
    //       this.configService.hideLoading()
    //     }
    //   }

    // }
  }

  selectionClass() {
    // console.log(this._navigateService.productDetailPageList[this.no])

    if (this.loadFrom == 'config') {
      if (
        !!this._navigateService.productDetailPageList &&
        this._navigateService.productDetailPageList[this.no]?.rejected
      ) {
        return 'rejected ';
      }
      // else if (this.selected[this.no]?.refCartID && this.selected[this.no]?.refCartProductId) {
      //   return 'inCart ';
      // }
      else if (
        !!this._navigateService.productDetailPageList &&
        this._navigateService.productDetailPageList[this.no]?.refCartID &&
        this._navigateService.productDetailPageList[this.no]?.refCartProductId
      ) {
        return 'inCart ';
      } else {
        return '';
      }
    } else {
      if (
        this.selected[this.no]?.refCartID &&
        this.selected[this.no]?.refCartProductId
      ) {
        return 'inCart ';
      } else if (this.selected[this.no]?.rejected) {
        return 'rejected ';
      } else {
        return '';
      }
    }
  }

  async cartAddedPopup(type, stone) {
    //let sId = this.selected[this.loadFrom == 'config' ? 0 : this.no];
    let cssClass = '';

    if (type == 'reject') {
      cssClass = 'modal-xs';
    } else {
      cssClass = 'modal-small';
    }
    const modal = await this.modalController.create({
      component: CartAddedPopupPage,
      componentProps: {
        popUptype: type,
        stone: stone,
      },
      cssClass: cssClass,
    });
    modal.onDidDismiss().then(data => {
      console.log('modal dismissed ', data);
      if (data.data == 'opencart') {
        this._cartService.observables.next('data');
      }

      if (data.data == 'shop') {
        this.close.emit();
      }
    });
    await modal.present();

    if (type == 'reject') {
      setTimeout(() => {
        modal.dismiss();
      }, 1200);
    }
  }

  changeStoneId(no) {
    console.log(no);
    let bool = true;
    if (this._navigateService && this._navigateService.productDetailPageList) {
      console.log(this._navigateService.productDetailPageList[no]);
      if (!!this._navigateService.productDetailPageList[no]) {
        //this.stoneName = this._navigateService.productDetailPageList[no]['stoneName']
        this.currentNo.emit(no);
        bool = false;
      } else if (!!this._navigateService.productDetailPageList[0]) {
        this.no = 0;
        this.currentNo.emit(0);
        bool = false;
      }
    } else {
      this.currentNo.emit(no);
      bool = false;
    }
    if (bool) {
      this.stoneName = '';
      this.hits = [];
      this.stone = [];
      this.close.emit();
    }
  }

  createShareButtons() {
    let buttons = [];

    let waShareBtn = {
      id: -1,
      text: 'Share Via Whatsapp',
      icon: 'logo-whatsapp',
      handler: () => {
        this.shareVia('Whatsapp');
        return true;
      },
    };
    buttons.push(waShareBtn);
    let emailBtn = {
      id: -2,
      text: 'Share Via Email',
      icon: 'mail-open',
      handler: () => {
        this.shareVia('Whatsapp');
        return true;
      },
    };
    buttons.push(emailBtn);

    let msgBtn = {
      id: -2,
      text: 'Share Via Message',
      icon: 'mail',
      handler: () => {
        this.shareVia('Message');
        return true;
      },
    };
    buttons.push(msgBtn);
    return buttons;
  }

  shareVia(type) {
    console.log(type);
  }

  async share(product) {
    let url =
      'https://www.kgdiamonds.com/products/' +
      product.stoneName +
      '/' +
      product.stoneName +
      '/' +
      product.currentLocation;
    //let url = "https://kgdiamonds.app.link?$stoneName="+product.stoneName+"&$refKgCompanyId="+product.currentLocation;
    // this.socialSharing
    //   .share(null, null, null, url)
    //   .then(res => {
    //     console.log('shared');
    //   })
    //   .catch(e => {
    //     console.log(e);
    //   });
  }

  downloadVideo(data) {
    const stoneName = this.getStoneName(data);

    let url = `https://stackg.azureedge.net/v360azurekg/V360_5_0/imaged/${stoneName}/video.mp4`;
    if (this.mobileView && !this.webViewMobile) {
      this.previewAnyFile.preview(url).then(
        (res: any) => {
          console.log('file : ' + res);
          //this.configService.presentToast("File Downloaded", "success");
        },
        error => {
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
          error => {
            // handle error
            console.error(error);
          }
        );
      } else {
        window.open(url, '_blank');
      }
    }
    // const videoUrl = 'https://stackg.azureedge.net/v360azurekg/V360_5_0/imaged/N0125549/video.mp4';
    // // Create a link element
    // const downloadLink = document.createElement('a');
    // // Set the link's href to the video URL
    // downloadLink.href = videoUrl;
    // // Set the download attribute to specify the filename
    // downloadLink.setAttribute('download', 'video.mp4');
    // // Trigger a click event on the link to start the download
    // downloadLink.click();
  }

  getClass(stone) {
    let className = 'videoiframe';
    if (stone.name == 'Fire') {
      className = 'fireFrame';
    }
    return className;
  }

  /////////////////////////////////////////////////////////////////////////////////
  /* changing iframes elements css */

  checkIfTabletSize() {
    const screenWidth = window.innerWidth;
    this.isTabletSize = screenWidth >= 768 && screenWidth <= 1200;
  }

  openTracrLink(link: string) {
    const browser = this.iab.create(link, '_system', 'location=yes');
    browser.show();
  }
}
