import { Component, OnInit } from "@angular/core";
import { DatabaseServiceService } from "../../service/database-service.service";
import { ActionSheetController, NavController } from "@ionic/angular";
import { Storage } from "@ionic/storage";
import { ConfigServiceService } from "../../service/config-service.service";
import { CartService } from "../../service/observable/cart/cart.service";
import { ProductTitleService } from "../../service/observable/product-title/product-title.service";
import { HeaderFabService } from "../../service/observable/header-fab/header-fab.service";
import { CompanyService } from "../../service/company/company.service";
import { ActivatedRoute } from "@angular/router";
//import { AppAvailability } from '@ionic-native/app-availability';
import { Platform, LoadingController, PopoverController, AlertController } from "@ionic/angular";
@Component({
  selector: "app-products",
  templateUrl: "./products.page.html",
  styleUrls: ["./products.page.scss"]
})
export class ProductsPage implements OnInit {
  public defaultpageName = 'ProductsPage';
  public showBackButton: boolean = true;
  public productTitle: any;
  public showHideHeader = false;
  public hideFooter: boolean = false;
  isActionSheetOpen = false;
  stoneName;
  location;

  public actionSheetButtons = [
    {
      text: 'Continue in Browser',
      role: 'destructive',
      data: {
        action: 'browser',
      },
    },
    {
      text: 'Open APP',
      data: {
        action: 'app',
      },
    },
    {
      text: 'Cancel',
      role: 'cancel',
      data: {
        action: 'cancel',
      },
    },
  ];

  constructor(
    public actionSheetController: ActionSheetController,
    private route: ActivatedRoute,
    public _productTitleService: ProductTitleService,
    public _headerFabService: HeaderFabService,
    public _companyService: CompanyService,
    public platform: Platform,
    public storage: Storage, public _cartService: CartService, public databaseServiceService: DatabaseServiceService, public navCtrl: NavController, public configService: ConfigServiceService) {
    this._companyService.currentPage = this.defaultpageName;

    this._productTitleService.observable().subscribe(data => {
      this.productTitle = data;
    });
    this._headerFabService.observable().subscribe(data => {
      this.showHideHeader = data;
      // console.log("showHideHeader", data);
    });
    this.loadCompanyData();

    // this.platform.ready().then(() => {
     
    //   let app;

    //   if (this.platform.is('ios')) {
    //     app = 'kgdiamonds://';
    //   } else if (this.platform.is('android')) {
    //     app = 'com.kg.kgdiamonds';
    //   }

    //   this.appAvailability.check(app).then(res=>{
    //     alert(res);
    //   })


    // });
    
  }
  async ngOnInit() {
    this.storage.remove("deeplink-stoneName");
    this.storage.remove("deeplink-location");

    this.stoneName = this.route.snapshot.paramMap.get("title");
    this.location = this.route.snapshot.paramMap.get("location");
  }


  load(data) {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (document.URL.indexOf('http://localhost') === 0 ||
      document.URL.indexOf('ionic') === 0 ||
      document.URL.indexOf('https://localhost') === 0) {
    } else {
      if (isMobile) {
        this.openActionSheet()
      }
    }

  }

  async openActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      buttons: [
        {
          text: 'Continue on Browser',
          role: 'browser',
          handler: () => {
            console.log('Browser clicked');
          }
        },
        {
          text: 'Open App',
          handler: () => {
            this.generateDiplink()
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    await actionSheet.present();
  }


  generateDiplink() {
    let link = `https://kg-diamonds.app.link?$stoneName=${this.stoneName}&$refKgCompanyId=${this.location}`
    window.open(link)
  }

  openCart() {
    this._cartService.observables.next("data");
  }
  pop() {
    this.navCtrl.pop();
  }

  async loadCompanyData() {
    if (this._companyService.companyObj.config) {
      let companyJson = this._companyService.companyObj.config;
      //// console.log(companyJson);
      if (!!companyJson) {
        //// console.log(companyJson);
        if (!!companyJson) {
          // if (typeof companyJson.showHeaderOnHomePage != "undefined") {
          //   this.showHeaderOnHomePage = companyJson.showHeaderOnHomePage;
          //   // console.log(this.showHeaderOnHomePage);
          // }

          if (companyJson?.hideFooter) {
            this.hideFooter = companyJson?.hideFooter
          }

        }
      }
    }
  }
}