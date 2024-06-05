import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ConfigServiceService } from '../../service/config-service.service';
import { CompanyService } from '../../service/company/company.service';
import { ElementRef } from '@angular/core';

@Component({
  selector: 'app-page-contents',
  templateUrl: './page-contents.page.html',
  styleUrls: ['./page-contents.page.scss'],
})
export class PageContentsPage implements OnInit {
  public data: any;
  public title: any;
  public compObj: any;
  public loadSkeleton = true;
  public hideFooter: boolean = false;

  constructor(
    public myElement: ElementRef,
    public router: Router,
    public _companyService: CompanyService,
    public _configServiceService: ConfigServiceService,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe((params) => {
      if (params && params['title']) {
        this.title = params['title'];
        this.getContent();
        this._configServiceService.setTitle(this.title);

        // var container = document.body,
        //   element = document.getElementById('pageContentTitleDiv');
        // container.scrollTop = element.offsetTop;
      }
    });
  }

  async getContent() {
    this.setData();
    document
      .getElementById('pageContentTitleDiv')
      .scrollIntoView({ behavior: 'smooth' });
  }

  async setData() {
    if (this._companyService.companyObj && this._companyService.companyObj) {
      if (this._companyService.companyObj.config) {
        let companyJson = this._companyService.companyObj.config;
        if (!!companyJson) {
          if (!!companyJson && companyJson.footerLinks) {
            this.data = companyJson.footerLinks.filter(
              (a) => a.title == this.title
            )[0].data;
          }

          // if(!!companyJson && companyJson?.hideFooter){
          //   this.hideFooter = companyJson?.hideFooter
          // }
        }
      }
    }
    this.loadSkeleton = false;
  }

  ionViewDidEnter() {
    const params: any = this.route.snapshot.queryParams;
    if (params && params['title']) {
      this.title = params['title'];
      this._configServiceService.setTitle(this.title);
      this.getContent();
    }
  }

  async ngOnInit() {}
}
