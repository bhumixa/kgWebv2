import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DatabaseServiceService } from '../../service/database-service.service';
import { Storage } from '@ionic/storage';
import { NavController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ConfigServiceService } from '../../service/config-service.service';
@Component({
  selector: 'app-schemes',
  templateUrl: './schemes.page.html',
  styleUrls: ['./schemes.page.scss'],
})
export class SchemesPage implements OnInit {
  public userId = 0;
  public onMobile: any;
  public allSchemes: any;
  public offset = 0;
  public limit = 10;
  public search = '';
  public hideBackButton = false;
  constructor(
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

  ngOnInit() {
    // this.storage.get("userID").then(val => {
    //   this.userId = parseInt(val);
    //   this.loadOrders();
    // });
  }
  async ionViewDidEnter() {
    let val = await this.storage.get('userID');
    this.userId = parseInt(val);
    this.loadSchemes();
    this._configService.setTitle('Schemes for Me');
  }
  async loadSchemes() {
    this.allSchemes = null;
    await this.databaseServiceService.showLoading();
    let res = await this.databaseServiceService.getAllSchemesByUser(
      this.userId,
      this.offset,
      this.limit
    );
    await this.databaseServiceService.hideLoading();
    // console.log("res", res);
    if (res) {
      this.allSchemes = [];
    }
    if (!!res.isSuccess) {
      this.allSchemes = res.data;
      this.changeRef.detectChanges();
      // console.log("this.schemes", this.allSchemes);
    } else {
      console.error(res.error);
    }
  }

  async doInfiniteNewForNewScheme(infiniteScroll) {
    this.offset += 1;
    // console.log("infiniteScroll for new order", infiniteScroll);
    setTimeout(() => {
      this.loadDatawithScrollForNewOrder(infiniteScroll);
      infiniteScroll.target.complete();
    }, 500);
  }

  async loadDatawithScrollForNewOrder(infiniteScroll) {
    // console.log("offset,limit", this.offset, this.limit);
    let response = await this.databaseServiceService.getAllSchemesByUser(
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
            Array.prototype.push.apply(this.allSchemes, allData);
            infiniteScroll.target.complete();
            // console.log("this.schemes2", this.allSchemes);
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
