import { Component, OnInit, ElementRef } from "@angular/core";
import { CompanyService } from "../../service/company/company.service";
import { NavigationExtras, Router } from "@angular/router";
import { Storage } from "@ionic/storage";
import { DomSanitizer } from "@angular/platform-browser";
import { DealerClubService } from "../../service/observable/dealer-club/dealer-club.service";
import { HeaderFooterService } from "../../service/headerFooter/header-footer.service";

@Component({
  selector: "app-footer",
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.scss"]
})
export class FooterComponent implements OnInit {
  public companyLogo = "";
  public mobileSearch = false;
  public footerData: any;
  public displayPopularCollection = false;
  public popularCollections = [];
  public hideReviews = false;

  public companyJson: any = {
    footerLinks: []
  };

  constructor(public _companyService: CompanyService, private router: Router, public storage: Storage, private sanitizer: DomSanitizer,
    private _element: ElementRef,
    public _dealerClubService: DealerClubService,
    public _headerFooterService: HeaderFooterService
  ) {
    this.loadCompanyData();
    this._dealerClubService.observable().subscribe(data => {
      this.loadCompanyData();
    });
  }
  ngOnInit() { }

  // openPage(obj) {
  //   // console.log("obj", obj);
  //   // this.router.navigateByUrl(obj.redirectTo);
  //   let navigationExtras: NavigationExtras = {
  //     queryParams: {
  //       title: obj.title
  //     }
  //   };
  //   this.router.navigate([obj.redirectTo], navigationExtras);
  // }
  async goToHomePage() {

    let data = await this._companyService.defaultHomePage(true);
    if (data) {
      this.router.navigateByUrl(data);
    } else {
      this.router.navigateByUrl("/");
    }
  }

  openPage(obj) {
    // console.log("obj", obj);
    let navigationExtras: NavigationExtras;
    if (!!obj.config && obj.config != "") {
      // console.log("obj.config", typeof obj.config);
      navigationExtras = {
        queryParams: {
          query: JSON.stringify(obj.config)
        }
      };
    }
    this.router.navigateByUrl(obj.redirectTo);
    
    // this.router.navigateByUrl(obj.redirectTo);
  }

  async loadCompanyData() {
    if (this._companyService.companyObj && this._companyService.companyObj) {
      this.companyLogo = this._companyService.companyObj.companyLogo;

      if (this._companyService.companyObj.config) {
        let companyJson = this._companyService.companyObj.config;
        if (!!companyJson) {
          if (!!companyJson && companyJson.footerLinks) {
            this.companyJson.footerLinks = companyJson.footerLinks;
          }
          if (!!companyJson && companyJson.footer) {
            this.footerData = companyJson.footer;
            this.footerData = this.sanitizer.bypassSecurityTrustHtml(this.footerData);
          }
          if (!!companyJson && companyJson.displayPopularCollection) {
            this.displayPopularCollection = companyJson.displayPopularCollection;
            if (this.displayPopularCollection) {
              await this.getPopularCollections();
            }
          }
          if (!!companyJson && companyJson.hideReviews) {
            this.hideReviews = companyJson.hideReviews;
          }
          this._enableDynamicHyperlinks();
        }
      }
    }
  }

  private _enableDynamicHyperlinks() {
    setTimeout(() => {
      const urls: any = this._element.nativeElement.querySelectorAll('a');
      urls.forEach((url) => {
        url.addEventListener('click', (event: any) => {
          let location: any = this.router;
          if (location.location._platformLocation.hostname == event.currentTarget.hostname) {
            event.preventDefault();
            let _link = event.target.pathname + event.target.search;
            this.router.navigateByUrl(_link);
          }
        }, false);
      });
    }, 2000);
  }

  async getPopularCollections() {
    let res = await this._companyService.getPopularCollections();
    if (!!res && res.isSuccess && res.data) {
      this.popularCollections = res.data;
    }
    // console.log("popular collections ", this.popularCollections);
  }

  redirectToCollection(collection) {
    this.router.navigate(["/collections/" + collection.name]);
  }

  open() {

  }
}
