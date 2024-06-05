import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { CompanyService } from 'src/app/service/company/company.service';
import { ActionsService } from '../../../service/cart/actions/actions.service';
import { ConfigServiceService } from '../../../service/config-service.service';
import * as moment from 'moment';
@Component({
  selector: 'app-cart-actions',
  templateUrl: './cart-actions.component.html',
  styleUrls: ['./cart-actions.component.scss'],
})
export class CartActionsComponent implements OnInit {
  @Input() userId: string;
  @Input() sessionID: string;
  @Input() userType: string;
  @Input() cartData: any;
  @Input() userData: any;
  @Input() onMobile: any;
  @Input() columns: any;
  @Input() row: any;
  @Input() actionType: any;
  @Input() listOffer: any;
  @Input() rowIndex: any;
  @Input() page: any;
  @Input() productType: any;
  public cartId: any;
  public selectedSegment: any;
  public emailId: any;
  public emailMeOrCustom: any;
  public saveCartName: any;
  public savedSearches: any;
  public selected: any = [];
  public selectedSavedCart: any;
  public emailBody: any;
  public loggedInUser: any;
  constructor(
    public _companyService: CompanyService,
    public storage: Storage,
    public _actionsService: ActionsService,
    public _configService: ConfigServiceService,
    public viewCtrl: ModalController
  ) {
    this.selectedSegment = '1';
    this.emailMeOrCustom = 'Me';
  }

  async ngOnInit() {
    if (!this.actionType) {
      if (
        this.cartData &&
        this.cartData.data &&
        this.cartData.data.products &&
        this.cartData.data.products.length > 0
      ) {
        this.selectedSegment = '1';
        this.cartId = this.cartData.data.products[0].refCartID;
      } else this.selectedSegment = '6';

      this.emailId = this.userData.email;
      await this.loadSavedSearches();
    } else {
      if (!this.page) {
        if (this.row['discount']) {
          this.row['Req Discount'] = this.row['discount'];
        }

        if (this.row['discountPrice']) {
          this.row['Req Price'] = this.row['discountPrice'];
        }

        if (this.row['priceWithShipCost']) {
          this.row['Amount'] = this.row['priceWithShipCost'];
        }
      }
    }
  }

  async submit() {
    let rowData = {
      row: this.row,
      rowIndex: this.rowIndex,
    };
    this.viewCtrl.dismiss(rowData);
  }

  updateValue(value, type, product) {
    //console.log(value)
    //console.log(product)

    // let product = this.cartData.data.products[rowIndex];
    let cts = parseFloat(product['cts']);
    let rap = parseFloat(product['RAPAPORTpercarat']);
    let listDisc = parseFloat(product['Rapnet_plusDiscountPercent']);
    let listPrice = parseFloat(product['Rapnet_pluspercarat']);
    let listAmt = parseFloat(product['Rapnet_plus']);
    let disc = parseFloat(product['Req Discount']);
    let price = parseFloat(product['Req Price']);
    let amt = parseFloat(product['Amount']);

    if (type == 'Disc') {
      disc = parseFloat(value);
      price = rap - (rap * disc) / 100;
      amt = price * cts;
    } else if (type == 'Price') {
      price = parseFloat(value);
      disc = 100 - (price / rap) * 100;
      amt = price * cts;
    } else if (type == 'Amt') {
      amt = parseFloat(value);
      price = amt / cts;
      disc = 100 - (price / rap) * 100;
    }
    if (disc <= listDisc + 5) {
      product['Req Discount'] = disc.toFixed(2);
      product['Req Price'] = price.toFixed(2);
      product['Amount'] = amt.toFixed(2);
    } else {
      product['Req Discount'] = listDisc.toFixed(2);
      product['Req Price'] = listPrice.toFixed(2);
      product['Amount'] = listAmt.toFixed(2);
      //console.log('disct exceeded');
      //this.discountError.emit(true)
    }
    this.row = product;
    return product;
  }

  async loadSavedSearches() {
    let res = await this._actionsService.getSavedCart(this.userId);
    if (res.isSuccess) {
      this.savedSearches = res.data;
    }
  }

  async loadSavedCart() {
    if (!!this.selectedSavedCart) {
      await this._configService.showLoading();
      let res = await this._actionsService.getsavedcartbyid(
        this.sessionID,
        this.userId,
        this.selectedSavedCart,
        true
      );
      await this._configService.hideLoading();
      if (res.isSuccess) {
        this._configService.presentToast('Cart Loaded', 'sucess');
        this.closeModal();
      } else {
        this._configService.presentToast('Error in loading cart', 'error');
      }
    } else {
      this._configService.presentToast('Please select cart to load', 'error');
    }
  }

  closeModal() {
    // console.log("closeModal ");
    this.viewCtrl.dismiss();
  }

  async downloadCart() {
    this.viewCtrl.dismiss({ action: 'download-cart' });
  }
  // async downloadCart() {
  //   await this._configService.showLoading();
  //   let urlToPass = "";
  //   if (!this.onMobile && window && "location" in window && "protocol" in window.location && "pathname" in window.location && "host" in window.location) {
  //     urlToPass = window.location.origin;
  //   } else {
  //     urlToPass = "App";
  //     //how to send url if there is mobile App
  //   }
  //   let res: any = await this._actionsService.exportCartExcel(this.cartId, urlToPass);
  //   await this._configService.hideLoading();
  //   if (res.isSuccess) {
  //     let paramsHeader = this.columns.map((id) => id.name);
  //     let headers = [];
  //     paramsHeader.forEach((header) => {
  //       headers.push(header);
  //     });
  //     //console.log(headers)
  //     let fileName = moment().format("YYYY-MM-DD")
  //     this._configService.exportAsExcelFile(res.data, fileName);
  //     // let fileName = moment().format("YYYY-MM-DD HH:mm:ss")
  //     // this._configService.exportCSVFile(headers, res.data, fileName);
  //   } else {
  //     this._configService.presentToast("Error in sending mail", "error");
  //   }
  // }

  radioGroupEmailChange(event) {
    if (this.emailMeOrCustom == 'Me') {
      this.emailId = this.userData.email;
    } else {
      this.emailId = '';
    }
  }
  async clearCart() {
    await this._configService.showLoading();
    let res: any = await this._actionsService.clearCart(
      this.cartId,
      !!this.userId ? '' : this.sessionID,
      this.userId,
      '',
      '',
      '',
      '',
      ''
    );
    console.log('kojijij');
    console.log(res);
    await this._configService.hideLoading();
    if (res.isSuccess) {
      let userdata = await this.storage.get('userData');

      this._configService.presentToast('Cart Cleared', 'sucess');
      // this.closeModal();
      this.viewCtrl.dismiss({ action: 'clear-cart' });
    } else {
      this._configService.presentToast('Error in sending mail', 'error');
    }
  }
  async emailCart() {
    if (this.emailId) {
      let urlToPass = '';
      await this._configService.showLoading();
      if (
        !this.onMobile &&
        window &&
        'location' in window &&
        'protocol' in window.location &&
        'pathname' in window.location &&
        'host' in window.location
      ) {
        urlToPass = window.location.origin;
      } else {
        urlToPass = 'https://kgdiamonds.dealerclub.in/';
        //how to send url if there is App
      }

      let res: any = await this._actionsService.exportCart(
        this.cartId,
        this.emailId,
        urlToPass,
        this.userId.toString(),
        this.emailBody
      );
      await this._configService.hideLoading();
      if (res.isSuccess) {
        this._configService.presentToast(
          'Mail sent to given email id',
          'sucess'
        );
        this.closeModal();
      } else {
        this._configService.presentToast('Error in sending mail', 'error');
      }
    } else {
      this._configService.presentToast('Please enter email id', 'error');
    }
  }

  async saveCart() {
    if (!!this.saveCartName) {
      await this._configService.showLoading();
      let res = await this._actionsService.SaveCart(
        this.saveCartName,
        this.userId,
        this.cartId
      );
      await this._configService.hideLoading();
      this.emailId = '';
      this._configService.presentToast('Cart saved', 'success');
      await this.loadSavedSearches();
    } else {
      this._configService.presentToast('Please add cart name to save', 'error');
    }
  }
}
