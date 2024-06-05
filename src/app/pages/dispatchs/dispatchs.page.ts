import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DatabaseServiceService } from '../../service/database-service.service';
import { Storage } from '@ionic/storage';
import { NavController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ConfigServiceService } from '../../service/config-service.service';
import { CompanyService } from './../../service/company/company.service';

@Component({
  selector: 'app-dispatchs',
  templateUrl: './dispatchs.page.html',
  styleUrls: ['./dispatchs.page.scss'],
})
export class DispatchsPage implements OnInit {
  public userId = 0;
  public onMobile: any;
  public orders: any;
  public offset = 0;
  public limit = 10;
  public search = '';
  public hideBackButton = false;
  constructor(
    public _companyService: CompanyService,
    public _configService: ConfigServiceService,
    private changeRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    public platform: Platform,
    public storage: Storage,
    public databaseServiceService: DatabaseServiceService,
    public router: Router,
    public navCtrl: NavController
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
  }

  ngOnInit() {}

  async ionViewDidEnter() {
    let val = await this.storage.get('userID');
    this.userId = parseInt(val);
    this.loadData();
    this._configService.setTitle('My Dispatches');
  }
  async loadData() {
    this.orders = null;
    await this.databaseServiceService.showLoading();
    let res = await this.databaseServiceService.getLatestShipment(
      this.userId,
      this.offset,
      this.limit
    );
    await this.databaseServiceService.hideLoading();
    if (res) {
      this.orders = [];
    }
    // console.log("res", res);
    // this.orders = res.data
    if (!!res.isSuccess) {
      this.orders = res.data;
      this.changeRef.detectChanges();
      // console.log("this.orders", this.orders);
    } else {
      console.error(res.error);
    }
  }

  async doInfiniteNewForNewOrder(infiniteScroll) {
    this.offset += 1;
    // console.log("infiniteScroll for new order", infiniteScroll);
    setTimeout(() => {
      this.loadDataWithScrollForNewOrder(infiniteScroll);
      infiniteScroll.target.complete();
    }, 500);
  }

  findTotalAmt(obj) {
    if (!!obj) {
      let tmp = 0;
      if (obj.length > 0)
        tmp = obj
          .map((o) => o['quantity'] * o['price'])
          .reduce((a, c) => a + c);
      return tmp;
    } else {
      return '';
    }
  }

  findTotalQty(obj) {
    if (!!obj) {
      let tmp = 0;
      if (obj.length > 0)
        tmp = obj.map((o) => o['quantity']).reduce((a, c) => a + c);
      return tmp;
    } else {
      return '';
    }
  }
  async loadDataWithScrollForNewOrder(infiniteScroll) {
    // console.log("offset,limit", this.offset, this.limit);
    let response = await this.databaseServiceService.getLatestShipment(
      this.userId,
      this.offset,
      this.limit
    );
    if (response && response.data) {
      let allData = response.data;
      if (!!response.isSuccess) {
        if (allData.length == 0) {
          infiniteScroll.target.disabled = true;
        } else {
          if (infiniteScroll) {
            Array.prototype.push.apply(this.orders, allData);
            infiniteScroll.target.complete();
            // console.log("this.products2", this.orders);
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

  async getOrderDetailById(orderId) {
    this.navCtrl.navigateForward(['/view-dispatch/' + orderId]);
  }
}
