import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DatabaseServiceService } from '../../service/database-service.service';
import { Storage } from '@ionic/storage';
import { Platform } from '@ionic/angular';
// import { Router, NavigationExtras } from "@angular/router";
import { ActivatedRoute } from '@angular/router';
import { ConfigServiceService } from '../../service/config-service.service';
import { CompanyService } from 'src/app/service/company/company.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {
  public hideFooter: boolean = false;
  public userId = 0;
  public onMobile: any;
  public allNotifications: any;
  public offset = 0;
  public limit = 10;
  public search = '';
  public hideBackButton = false;
  public status: String = '';
  constructor(
    public _companyService: CompanyService,
    public _configService: ConfigServiceService,
    private changeRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    public platform: Platform,
    public storage: Storage,
    public databaseServiceService: DatabaseServiceService
  ) {
    this.platform.ready().then(() => {
      // console.log("this.platform", this.platform);
      if (this.platform.is('desktop')) {
        this.onMobile = false;
      } else {
        this.onMobile = true;
      }
      // console.log("this.onMobile", this.onMobile);
    });

    this.route.params.subscribe((params) => {
      this.changeRef.detectChanges();
      this.hideBackButton = params['hideBackButton'];
    });

    this.status = this.route.snapshot.paramMap.get('status');
    if (this.status == 'All') {
      this.status = '';
    }
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
    // this.storage.get("userID").then(val => {
    //   this.userId = parseInt(val);
    //   this.loadOrders();
    // });
  }

  async ionViewDidEnter() {
    let val = await this.storage.get('userID');
    this.userId = parseInt(val);
    this.loadCards();
    this._configService.setTitle('Notifications');
  }

  async loadCards() {
    this.allNotifications = null;
    // await this.databaseServiceService.showLoading();
    let res = await this.databaseServiceService.getCards(
      this.userId,
      this.offset,
      this.limit,
      this.search,
      this.status
    );
    // await this.databaseServiceService.hideLoading();
    // console.log("res", res);

    if (res) {
      this.allNotifications = [];
    }
    // this.orders = res.data
    if (!!res.isSuccess) {
      this.allNotifications = res.data;
      this.changeRef.detectChanges();
    } else {
      // console.error(res.error);
    }
  }

  async doInfinite(infiniteScroll) {
    this.offset += 1;
    // console.log("infiniteScroll for new order", infiniteScroll);
    setTimeout(() => {
      this.loadDataWithScroll(infiniteScroll);
      infiniteScroll.target.complete();
    }, 500);
  }

  async loadDataWithScroll(infiniteScroll) {
    // console.log("offset,limit", this.offset, this.limit);
    let response = await this.databaseServiceService.getCards(
      this.userId,
      this.offset,
      this.limit,
      this.search,
      this.status
    );
    if (response && response.data) {
      let allData = response.data;
      if (!!response.isSuccess) {
        if (allData.length == 0) {
          infiniteScroll.target.disabled = true;
        } else {
          if (infiniteScroll) {
            Array.prototype.push.apply(this.allNotifications, allData);
            infiniteScroll.target.complete();
          }
        }

        if (response.length == 1000) {
          infiniteScroll.target.disabled = true;
        }
      } else {
        // console.log("error", response.error);
      }
    }
  }
}
