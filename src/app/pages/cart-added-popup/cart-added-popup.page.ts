import { Component, Input, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-cart-added-popup',
  templateUrl: './cart-added-popup.page.html',
  styleUrls: ['./cart-added-popup.page.scss'],
})
export class CartAddedPopupPage implements OnInit {
  stoneName : any;
  @Input() popUptype: any = 'cart'
  @Input() stone:any

  constructor(public viewCtrl: ModalController, private navParams: NavParams) { }

  async ngOnInit() {
    if(this.navParams.get("stoneName")){
      this.stoneName = await this.navParams.get("stoneName");
    }    
  }

  closeModal(){
    this.viewCtrl.dismiss();
  }

  goToCheckout(){
    this.viewCtrl.dismiss("opencart");
  }

  continue(){
    this.viewCtrl.dismiss('shop');
  }

  removeFromCart(){
    this.viewCtrl.dismiss({'stoneName':this.stoneName});
  }

}
