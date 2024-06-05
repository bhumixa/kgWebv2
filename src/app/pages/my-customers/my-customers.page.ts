import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DatabaseServiceService } from '../../service/database-service.service';
import { Storage } from '@ionic/storage';
import {
  NavController,
  Platform,
  AlertController,
  ModalController,
  ToastController,
} from '@ionic/angular';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ConfigServiceService } from '../../service/config-service.service';
import { AddCustomerPage } from '../add-customer/add-customer.page';
import { HeaderFooterService } from '../../service/headerFooter/header-footer.service';

@Component({
  selector: 'app-my-customers',
  templateUrl: './my-customers.page.html',
  styleUrls: ['./my-customers.page.scss'],
})
export class MyCustomersPage implements OnInit {
  public userId = 0;
  public onMobile: any;
  public allCustomers: any;
  public offset = 0;
  public limit = 10;
  public search = '';
  public hideBackButton = false;

  constructor(
    public _headerFooterService: HeaderFooterService,
    public _configService: ConfigServiceService,
    private changeRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    public platform: Platform,
    public storage: Storage,
    public databaseServiceService: DatabaseServiceService,
    public router: Router,
    public navCtrl: NavController,
    public modalController: ModalController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
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

    this.route.params.subscribe((params: any) => {
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
    this.loadData();
    this._configService.setTitle('My Customers');
  }

  async loadData() {
    this.allCustomers = null;
    await this.databaseServiceService.showLoading();
    let res: any = await this.databaseServiceService.fetchChildCustomers(
      this.userId
    );
    await this.databaseServiceService.hideLoading();
    // console.log("res", res);
    if (res) {
      this.allCustomers = [];
    }
    if (!!res.isSuccess) {
      this.allCustomers = res.data;
      this.changeRef.detectChanges();
      // console.log("data", this.allCustomers);
    } else {
      console.error(res.error);
    }
  }

  async addNew() {
    const modal = await this.modalController.create({
      component: AddCustomerPage,
      componentProps: {
        popup: true,
      },
    });
    modal.onDidDismiss().then(async (data) => {
      // console.log("modal dismissed ", data);
      await this.loadData();
    });
    await modal.present();
  }

  async deleteConfirm(id: any) {
    let alert = await this.alertCtrl.create({
      // title: 'Confirm purchase',
      message: 'Are you sure you want to delete ?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            // console.log("Cancel clicked");
          },
        },
        {
          text: 'Ok',
          handler: () => {
            // console.log("Ok clicked");
            this.delete(id);
          },
        },
      ],
    });
    alert.present();
  }

  async delete(id: any) {
    await this.databaseServiceService.deleteOrEnableCustomer(id, 1);
    await this._configService.presentToast('Delete Address Called', 'success');
    await this.loadData();
  }
  async edit(customerData: any) {
    //check single parent
    let userData: any = await this._headerFooterService.fetchUserProfileDetails(
      this.userId
    );
    let refParentCustomerId = userData.data.refCustomerId;

    let checkCustomer: any =
      await this.databaseServiceService.checkSingleParentCustomer(
        this.databaseServiceService.refCompanyId,
        customerData.id,
        refParentCustomerId
      );
    if (checkCustomer.data) {
      const modal = await this.modalController.create({
        component: AddCustomerPage,
        componentProps: {
          customerData: customerData,
          popup: true,
        },
      });
      modal.onDidDismiss().then(async (data) => {
        // console.log("modal dismissed ", data);
        // if (!!data && !!data.data && data.data != -1) {
        //   await this.loadData();
        // }
        await this.loadData();
      });
      await modal.present();
    } else {
      let toast = await this.toastCtrl.create({
        message: 'You are not allowed to edit this Customer.',
        duration: 3000,
        position: 'top',
        color: 'danger',
      });
      toast.present();
    }

    //await this._configService.presentToast("Edit Address Called", "success");
  }

  async doInfinite(infiniteScroll: any) {
    this.offset += 1;
    // console.log("infiniteScroll for new order", infiniteScroll);
    setTimeout(() => {
      this.loadDataWithScroll(infiniteScroll);
      infiniteScroll.target.complete();
    }, 500);
  }

  async loadDataWithScroll(infiniteScroll: any) {
    // console.log("offset,limit", this.offset, this.limit);
    let response: any = await this.databaseServiceService.fetchChildCustomers(
      this.userId
    );
    if (response && response.data) {
      let allData = response.data;
      if (!!response.isSuccess) {
        if (allData.length == 0) {
          infiniteScroll.target.disabled = true;
        } else {
          if (infiniteScroll) {
            Array.prototype.push.apply(this.allCustomers, allData);
            infiniteScroll.target.complete();
            // console.log("data", this.allCustomers);
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
  async goToAddressPage(seller: any) {
    this.router.navigateByUrl(
      '/my-addresses?customerContactID=' + seller.userid
    );
  }
  async goToManageAddressPage(seller: any) {
    this.router.navigateByUrl(
      '/my-addresses?customerContactID=' + seller.userid
    );
  }
}
