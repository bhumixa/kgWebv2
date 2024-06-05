import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CompanyService } from 'src/app/service/company/company.service';
import { ProductTitleService } from 'src/app/service/observable/product-title/product-title.service';
import { ConfigServiceService } from '../../service/config-service.service';

@Component({
  selector: 'app-my-cart',
  templateUrl: './my-cart.page.html',
  styleUrls: ['./my-cart.page.scss'],
})
export class MyCartPage implements OnInit {
  public ob: any = '';
  public refresh: boolean = true;
  public hideFooter: boolean = false;
  public pageTitle = 'My Cart';
  public showParameters: boolean = true;
  constructor(
    private activeRoute: ActivatedRoute,
    public _productTitleService: ProductTitleService,
    public _configService: ConfigServiceService,
    public _companyService: CompanyService
  ) {
    this._productTitleService.observable().subscribe((data) => {
      this.pageTitle = data;
      // console.log("data", data);
    });
    const params: any = this.activeRoute.snapshot.queryParams;
    if (params && params.ob) {
      this.ob = params.ob;
    }

    this.activeRoute.queryParams.subscribe((queryParams: any) => {
      this.ob = queryParams.ob;
      this.refresh = !this.refresh;
    });
    this.refresh = !this.refresh;
  }

  async setData() {
    if (this._companyService.companyObj && this._companyService.companyObj) {
      if (this._companyService.companyObj.config) {
        let companyJson = this._companyService.companyObj.config;
        if (!!companyJson) {
          if (!!companyJson && companyJson?.hideFooter) {
            this.hideFooter = companyJson?.hideFooter;
          }
        }
      }
    }
  }

  ngOnInit() {
    this.setData();
    // console.log("ngOnInit");
    this.refresh = !this.refresh;
  }

  async ionViewDidEnter() {
    // console.log("ionViewDidEnter");
    this._configService.setTitle('My Cart');
    this.refresh = !this.refresh;
  }
}
