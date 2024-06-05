import { Component, OnInit } from '@angular/core';
import { OrderService } from './../../service/order/order.service'

@Component({
  selector: 'app-track-order',
  templateUrl: './track-order.page.html',
  styleUrls: ['./track-order.page.scss'],
})
export class TrackOrderPage implements OnInit {

  public orderNO = '';
  public pincode = '';
  public loadOrderDetails: any = false;
  public error: any = false;
  public orderNo;

  constructor(public _orderService: OrderService) { }

  ngOnInit() {
  }

  async search() {
    let loadOrderDetails = await this._orderService.getTrackOrder(this.orderNO,this.pincode);
    if (loadOrderDetails.isSuccess) {
      if (loadOrderDetails.data.length > 0) {
        this.error = false;
        this.loadOrderDetails = loadOrderDetails.data;
        this.orderNo = this.loadOrderDetails.orders.serialNumber;
      } else {
        this.error = "Tracking Detail Not Found ...";
        this.loadOrderDetails = [];
      }
    } else {
      this.error = loadOrderDetails.error;
      this.loadOrderDetails = [];
    }
  }

}
