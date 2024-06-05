import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { NavController } from "@ionic/angular";
import { Storage } from "@ionic/storage";
import { DatabaseServiceService } from "../../service/database-service.service";
import { ConfigServiceService } from "../../service/config-service.service";

@Component({
  selector: "app-my-addresses",
  templateUrl: "./my-addresses.page.html",
  styleUrls: ["./my-addresses.page.scss"]
})
export class MyAddressesPage implements OnInit {
  public userId: any;
  public addresses;
  constructor(private router: Router, public navCtrl: NavController, public storage: Storage, public databaseServiceService: DatabaseServiceService, public configService: ConfigServiceService) {}
  async ionViewDidEnter() {
    
  }

  onChange(addressID) {
    //call api for making changes in address or making it default address
  }

  delete(addressID) {
    //call api to delete address
  }
  

  ngOnInit() {
    // this.storage.get("userID").then(val => {
    //   this.userId = parseInt(val);
    //   // console.log("userId", this.userId);
    //   this.fetchAddress(this.userId);
    // });
  }

}
