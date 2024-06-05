import { Component, OnInit, Input } from "@angular/core";
import { NavController } from "@ionic/angular";
import { Storage } from "@ionic/storage";
import { Router, NavigationExtras } from "@angular/router";
import { ConfigServiceService } from "../../service/config-service.service";
import { Platform } from "@ionic/angular";
import { CompanyService } from "./../../service/company/company.service";
import { FunctionsService } from "../../service/cart/functions/functions.service";
import { FavoriteService } from "../../service/product/favorite.service";
import { TranformImagesService } from "../../service/product/tranform-images.service";
import { NavigateService } from "../../service/product/navigate.service";
import { DetailsService } from "../../service/product/details.service";
import { CartService } from "../../service/observable/cart/cart.service";
import { SegmentChangedService } from "../../service/observable/segment-changed/segment-changed.service";

@Component({
  selector: "app-collection-component",
  templateUrl: "./collection-component.component.html",
  styleUrls: ["./collection-component.component.scss"]
})
export class CollectionComponentComponent implements OnInit {
  @Input() products = [];
  @Input() showSkeleton;
  @Input() collectionName;
  @Input() showSegment;
  @Input() hideStorePrice = false;
  @Input() hideFavourites: any = false;

  public companyLogo: any;
  public algoliaFilters: any;
  public favorites: any;
  public userId: any;
  public loggedInUser: any;
  public segments: any;
  public selectedSegment: any;
  public sessionId: any;
  public discount: any = 0;
  public taxes: any = 0;
  public onMobile = false;
  public productDetailPageList: any = [];
  public transformationTypes = [];
  public screenWidth = 250;
  public showSKU = false;
  public showProductId = false;

  async ngOnChanges(changes) {
    // console.log("ngOnChanges ",changes)
    try {
      if (changes.showSkeleton) {
        this.showSkeleton = changes.showSkeleton.currentValue;
        // console.log("showSkeleton",this.showSkeleton);
      }
      if (changes.products.previousValue != changes.products.currentValue) {
        await this.getTransformationTypes();
        this.callFavorites();
        this.addTransformation();
        this.productDetailsListing()
      }
    } catch (e) {

    }
  }
  constructor(public _detailsService: DetailsService,
    public _cartService: CartService,
    public _navigateService: NavigateService,
    public _tranformImagesService: TranformImagesService,
    public _favoriteService: FavoriteService,
    public _functionsService: FunctionsService,
    public _companyService: CompanyService,
    public _segmentChangedService: SegmentChangedService,
    private router: Router,
    public storage: Storage, private navCtrl: NavController, public configService: ConfigServiceService, public platform: Platform) {
    if (this.platform.is("desktop")) {
      this.onMobile = false;
    } else {
      this.onMobile = true;
    }
    // this.screenWidth = this.platform.width();  
  }

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

  async addTransformation() {
    if (this.products.length > 0) {
      this.products.map(i => {
        if (i.listOfImages && i.listOfImages.length > 0 && i.listOfImages[0].transformType_collection) {
          let value = this.transformationTypes.filter(t => t.name == i.listOfImages[0].transformType_collection)[0].values;
          i.listOfImages[0]["transformationValue"] = value;
          return i;
        }
      });
    }
  }
 
  async productDetailsListing() {
    if (this.products.length > 0) {
      let aa = this.products
      let i = 1;
      this.productDetailPageList = aa.map(a => ({ objectID: a.id, index: i++, productName: !!a.name ? a.name : a.id }));
    }
  }

  async ngOnInit() {
    await this.loadCompanyData();

    //await this.callFavorites();
    this.storage.get("loggedInUser").then(val => {
      this.loggedInUser = val;
    });
    this.selectedSegment = "/collections/" + this.collectionName;

    await this.getTransformationTypes();
  }

  segmentChanged(ev: any) {
    //set selected segment and data here
    if (this.selectedSegment.indexOf("/home/") > -1 || this.selectedSegment.indexOf("/products/") > -1) {
      this.router.navigate([this.selectedSegment]);
    } else {
      let collectionName = this.selectedSegment.split("/collections/")[1];
      this._segmentChangedService.observables.next(collectionName);
    }
  }

  async callFavorites() {
    if (!this.userId) {
      let val = await this.storage.get("userID");
      this.userId = parseInt(val);
      this.fetchFavorites(this.userId);
    }
    else if (this.loggedInUser) {
      this.fetchFavorites(this.userId);
    } else {
      // console.log('---')
    }
  }

  async loadCompanyData() {

    // console.log("this._companyService.companyObj ", this._companyService.companyObj);
    if (this._companyService.companyObj && this._companyService.companyObj) {
      if (!!this._companyService.companyObj.companyLogo) {
        this.companyLogo = this._companyService.companyObj.companyLogo;
      }
      if (this._companyService.companyObj.config) {
        let companyJson = this._companyService.companyObj.config;
        if (!!companyJson) {
          if (!!companyJson.algoliaFilters) {
            this.algoliaFilters = companyJson.algoliaFilters;
            // console.log("this.algoliaFilters ", this.algoliaFilters);
          }
          if (!!companyJson && companyJson.loggedInUserHeaderLinks && this.loggedInUser) {
            this.segments = companyJson.loggedInUserHeaderLinks;
          } else if (!!companyJson && companyJson.homePageHeaderLinks) {
            this.segments = companyJson.homePageHeaderLinks;
          }
          if (typeof companyJson.hideFavourites != "undefined") {
            this.hideFavourites = companyJson.hideFavourites;
          }
          if (!!companyJson.hideStorePrice) {
            this.hideStorePrice = companyJson.hideStorePrice;
          }
          if (!!companyJson.showSKU) {
            this.showSKU = companyJson.showSKU;
          }
          if (!!companyJson.showProductId) {
            this.showProductId = companyJson.showProductId;
          }
        }
      }
      console.log("segments  ", this.segments);
    }
  }

  async singleProduct(product) {
    let productsArr = [{
      'name': product.name,                      // Name or ID is required.
      'id': product.id,
      'price': product.price,
      'variant': (product.listOfVariants && product.listOfVariants.length>0) ? product.listOfVariants[0].name: product.name
    }];
    this._companyService.insertGTM('productClick','click',null,productsArr);
    let name = product.name.replace(/\//g, "-");
    name = name.replace(/ /g, "-").toLowerCase();
    console.log("name", name, " product ", product);
    //set next prev array
    this._navigateService.productDetailPageList = this.productDetailPageList;

    this.navCtrl.navigateForward(["/products/" + product.id + "/" + name]);
  }

  productTitle(title) {
    if (title.length > 80) {
      return title.substring(0, 70) + "...";
    } else {
      return title;
    }
  }

  async fetchFavorites(userId) {
    if (userId) {
      // console.log("in fetchFavorites");
      let res = await this._favoriteService.fetchFavorites(userId);
      this.favorites = res;
      if (this.products.length > 0) {
        this.products.forEach(element1 => {
          element1.favorite = false;
        });
        this.products.forEach(element1 => {
          if (this.favorites && this.favorites.data) {
            this.favorites.data.forEach(element2 => {
              if (element1.id == element2.productId) {
                element1.favorite = true;
              }
            });
          }
        });

        if (!!res.isSuccess) {
        } else {
          // console.log(res.error);
        }
      }
    } else {
      // console.log('--')
    }
  }

  async addToCart(product) {
    console.log(product);
    let appName = this.configService.appName;
    (<any>window).dataLayer.push({
      'event': 'addToCart',
      appName: {
        'add': {
          'products': [{
            'name': product.name,                      // Name or ID is required.
            'id': product.id,
            'price': product.price,
            'variant': (product.listOfVariants && product.listOfVariants.length>0) ? product.listOfVariants[0].name: product.name
           }]
         }
       }
    });
    this.userId = await this.storage.get("userID");
    // console.log("this.userId", this.userId);
    this.sessionId = await this.storage.get("sessionID");

    await this.configService.showLoading();
    await this.getProductTagsAndDiscount(product.id);

    let selectedVariantObj = [];
    let resProd: any = await this._detailsService.getProductDetail(product.id, product.location, this.sessionId, this.userId);
    if (resProd.data[0].listOfParameter.length > 0) {
      resProd.data[0].listOfParameter.forEach(element => {
        // // console.log(">>>",element)
        if (element.paramName == "Tax") {
          this.taxes = element.paramValue;
        }
      });
    }
    selectedVariantObj.push({
      PvID: resProd.data[0].listOfVariants[0].id,
      quantity: 1,
      discount: this.discount,
      taxes: this.taxes
    });
    // console.log("selectedVariantObj ", selectedVariantObj);

    let res = await this._functionsService.addMultipleToCart(this.userId, this.sessionId, selectedVariantObj, "");
    if (!!res.isSuccess) {
      // console.log("res", res);
      await this.configService.hideLoading();
      this._cartService.observables.next("data");
      //await this.configService.presentToast("Product added to cart successfully", "success");
    } else {
      // console.log(res.error);
      await this.configService.hideLoading();
      await this.configService.presentToast("Please try again.", "error");
    }
  }

  async getProductTagsAndDiscount(data) {
    this.userId = await this.storage.get("userID");
    // console.log("this.userId", this.userId);
    if (this.userId != null && this.userId != undefined) {
      let res = await this._detailsService.getProductTagsAndDiscount(data, null, this.userId, null);
      if (!!res.isSuccess) {
        this.discount = res.data.discount;
        if (this.discount?.toString().includes("%")) {
          this.discount.slice("%");
        }
      } else {
        //console.error("error", res.error);
      }
    }
  }

  async addToFavorite(product) {
    // console.log("product", product);

    let userId = await this.storage.get("userID");
    if (!userId && userId == null && userId == undefined) {
      // this.configService.presentToast("Please Login", "error");
      let navigationExtras: NavigationExtras = {
        queryParams: {
          to: "/my-favorite"
        }
      };
      this.router.navigate(["/login-with-sign-up"], navigationExtras);
    } else {
      var favProd = this.favorites.data.filter(d => d.productId == product.id);
      if (!!favProd && favProd.length > 0) {
        //already added
        let res = await this._favoriteService.removeFavorites(favProd[0].id);
        this.configService.presentToast("Removed from favorites", "error");
        this.fetchFavorites(userId);
      } else {
        //not in fav,add it to fav
        let favoriteObj = {
          productId: product.id,
          userId: parseInt(userId)
        };
        let favoriteResponse = await this._favoriteService.createFavorite(favoriteObj);
        // console.log("favoriteResponse", favoriteResponse);
        if (favoriteResponse.isSuccess) {
          this.configService.presentToast("Added to your favorites", "success");
          this.fetchFavorites(userId);
        } else {
          //this should be never be the case
          this.configService.presentToast(favoriteResponse.error, "error");
        }
      }
    }
  }

}
