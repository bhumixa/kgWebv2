import { Component, OnInit } from '@angular/core';
import { DatabaseServiceService } from '../../service/database-service.service';
import { Platform } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { ConfigServiceService } from '../../service/config-service.service';
import { Storage } from '@ionic/storage';
import { Device } from '@ionic-native/device/ngx';
import { Router, NavigationExtras } from '@angular/router';
import { CompanyService } from '../../service/company/company.service';
import { ActionsService } from '../../service/cart/actions/actions.service';

@Component({
  selector: 'app-show-cart',
  templateUrl: './show-cart.page.html',
  styleUrls: ['./show-cart.page.scss'],
})
export class ShowCartPage implements OnInit {
  public savedCartId: any;
  public hideBackButton = false;
  public companyLogo: any;
  public showSkeleton = true;
  public onMobile: any;
  public userId: any;
  public loggedInUser: any;
  public sessionID: any;
  public userType: any;

  constructor(
    public _actionsService: ActionsService,
    public _companyService: CompanyService,
    public _configService: ConfigServiceService,
    public databaseServiceService: DatabaseServiceService,
    private route: ActivatedRoute,
    public platform: Platform,
    public storage: Storage,
    private device: Device,
    private router: Router
  ) {
    this.route.params.subscribe((params) => {
      if (!!params && params['hideBackButton'] != null)
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
    this.savedCartId = this.route.snapshot.paramMap.get('id');
    // if (this.savedCartId != null) {
    // }
  }

  async ngOnInit() {
    await this.loadCompanyData();
    await this.setSessionId();
    await this.loadSelectedSavedCart();
  }

  async ionViewDidEnter() {
    this._configService.setTitle('Migrating your cart');
  }

  async loadCompanyData() {
    this.setConfig();
  }
  setConfig() {
    if (!!this._companyService.companyObj.companyLogo) {
      this.companyLogo = this._companyService.companyObj.companyLogo;
    }
  }

  async loadSelectedSavedCart() {
    let res = await this._actionsService.getsavedcartbyid(
      this.sessionID,
      this.userId,
      this.savedCartId,
      true
    );

    let navigationExtras: NavigationExtras = {
      queryParams: {
        openCart: 'yes',
      },
    };
    this.router.navigate(['/'], navigationExtras);
    //this.router.navigateByUrl("/");
  }

  async setSessionId() {
    this.userId = await this.storage.get('userID');
    this.sessionID = await this.storage.get('sessionID');
    this.loggedInUser = await this.storage.get('loggedInUser');
    this.userType = await this.storage.get('userType');
    // console.log("userType", this.userType);
    // console.log("userId", this.userId, this.sessionID, this.loggedInUser);
    if (!this.userId && !this.sessionID) {
      if (this.onMobile) {
        this.sessionID = ConfigServiceService.generateSessionID(
          this.device.uuid
        );
      } else {
        this.sessionID = ConfigServiceService.generateSessionIdForDesktop();
      }
      this.storage.set('sessionID', this.sessionID);
      // console.log("Device UUID is: " + this.device.uuid, this.userId, this.sessionID);
    }
  }
}
