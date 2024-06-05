import { Component, OnInit } from '@angular/core';
import { DatabaseServiceService } from '../../service/database-service.service';
import { Platform } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { ConfigServiceService } from '../../service/config-service.service';
import { CompanyService } from './../../service/company/company.service';

@Component({
  selector: 'app-view-dispatch',
  templateUrl: './view-dispatch.page.html',
  styleUrls: ['./view-dispatch.page.scss'],
})
export class ViewDispatchPage implements OnInit {
  public orderId: any;
  public addedOn: any;
  public status: any;
  public onMobile: any;
  public hideBackButton = false;
  public showSkeleton = true;
  public dispatchDetails: any = {
    paymentMode: '',
    house: '',
    area: '',
    city: '',
    pinCode: '',
    state: '',
    country: '',
    fullName: '',
    phoneNo: '',
    trackingNo: '',
    shipDate: '',
    shipVia: '',
    invoiceID: '',
    details: [],
    totalAmount: '',
  };

  constructor(
    public _companyService: CompanyService,
    public _configService: ConfigServiceService,
    public databaseServiceService: DatabaseServiceService,
    private route: ActivatedRoute,
    public platform: Platform
  ) {
    this.route.params.subscribe((params: any) => {
      if (!!params && params?.hideBackButton != null)
        this.hideBackButton = params['hideBackButton'];
    });

    this.platform.ready().then(() => {
      // console.log("this.platform", this.platform);
      if (this.platform.is('desktop')) {
        this.onMobile = false;
      } else {
        this.onMobile = true;
      }
      // console.log("this.onMobile", this.onMobile);
    });
    this.orderId = this.route.snapshot.paramMap.get('id');
    if (this.orderId != null) {
      this.getShipmentDetailByShipId();
    }
  }

  async ngOnInit() {
    await this.loadCompanyData();
  }

  async ionViewDidEnter() {
    this._configService.setTitle('Dispatch Details');
  }

  async loadCompanyData() {}

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

  async getShipmentDetailByShipId() {
    let res = await this.databaseServiceService.getShipmentDetailByShipId(
      this.orderId
    );
    if (res) {
      this.showSkeleton = false;
    }
    if (!!res.isSuccess) {
      this.dispatchDetails = res.data[0];
    } else {
      console.error('error', res.error);
    }
  }
}
