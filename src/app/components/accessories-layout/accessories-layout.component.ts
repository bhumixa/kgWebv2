import { HttpClient } from '@angular/common/http';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AccessoriesEnquiryComponent } from './accessories-enquiry/accessories-enquiry.component';
import { Storage } from '@ionic/storage-angular';
import { DatabaseServiceService } from 'src/app/service/database-service.service';
@Component({
  selector: 'app-accessories-layout',
  templateUrl: './accessories-layout.component.html',
  styleUrls: ['./accessories-layout.component.scss'],
})
export class AccessoriesLayoutComponent implements OnInit, OnChanges {
  @Input() selectedMenuItem: any;
  @Input() categoryId: any = 0;
  @Output() categoryChanged = new EventEmitter<any>();
  isActiveOfItem: any;
  data: object = [
    {
      name: '',
      description: '',
      price: '',
    },
  ];
  // items: any;
  showItem: boolean;
  items: {
    id: any;
    layoutCategoryId: any;
    title: any;
    shortDescription: any;
    carats: any;
    pcs: any;
    Amount: any;
    colorRange: any;
    sizeRange: any;
    clarityRange: any;
    imageUrl: any;
    isActive: any;
  }[] = [];
  loggedInUser: any;
  kamPersonData: any;
  userIdCustomer: any;
  userData: any;

  constructor(public http: HttpClient, private modalCtrl: ModalController, private storage: Storage,public _databaseService: DatabaseServiceService) {}

  ngOnInit() {}
  ngOnChanges() {
    this.getItemsByLayoutId(this.selectedMenuItem['id']);
  }
  private populateData(items: any[]) {
    this.data = items.map(item => ({
      name: item.name,
      description: item.description,
      price: item.price,
    }));
  }
  async getItemsByLayoutId(id: any) {
    try {
      const url = `https://apin.lattice-dev.atishae.com/layoutCategoryItems/${id}`;
      const response: any = await this.http.get(url).toPromise();

      if (response.data.length) {
        this.items = response?.data?.map((item: any) => {
          let temp: {
            id: any;
            layoutCategoryId: any;
            title: any;
            shortDescription: any;
            carats: any;
            pcs: any;
            Amount: any;
            colorRange: any;
            sizeRange: any;
            clarityRange: any;
            imageUrl: any;
            isActive: any;
          } = {
            id: '',
            layoutCategoryId: '',
            title: '',
            shortDescription: '',
            carats: '',
            pcs: '',
            Amount: '',
            colorRange: '',
            sizeRange: '',
            clarityRange: '',
            imageUrl: '',
            isActive: '',
          };
          temp.id = item.id;
          temp.layoutCategoryId = item.layoutCategoryId;
          temp.title = item.title;
          temp.shortDescription = item.shortDescription;
          temp.carats = item.carats;
          temp.pcs = item.pcs;
          temp.Amount = item.Amount;
          temp.colorRange = item.colorRange;
          temp.sizeRange = item.sizeRange;
          temp.clarityRange = item.clarityRange;
          temp.imageUrl = item.imageUrl;
          temp.isActive = item.isActive;
          return temp;
        });
      }else if(response.data.length == 0){
        this.items = [];
      }

      return await response;
    } catch (e) {
      return e;
    }
  }

  async handleEnquire(e: any) {
    this.loggedInUser = await this.storage.get('loggedInUser');
    if(!!this.loggedInUser){
      this.userIdCustomer = await this.storage.get('userID')
    this.userData =  await this._databaseService.getCustomerContactDetails(this.userIdCustomer);
    const salesPersonData : any = JSON.parse(this.userData.data[0].parameter).userAccount.salesperson;
    // const customerId : any = JSON.parse(this.userData.data[0].parameter).userAccount.distributioncenter.id;
    const refCompanyId : any = JSON.parse(this.userData.data[0].parameter).userAccount.distributioncenter.refCompanyId;
    // const customerUsername : any = JSON.parse(this.userData.data[0].parameter).userAccount.username;
    // const customerInfo : any = JSON.parse(this.userData.data[0].parameter).general;
    let userData = await this.storage.get('userData');
    const customerId = userData.id;
  
    const customerPhoneNumber = JSON.parse(this.userData.data[0].parameter).general.phone;
    const companyName : any = JSON.parse(this.userData.data[0].parameter).company.name;
    const enquiryPayload = {
        "refCompanyId": refCompanyId,
        "customerId":customerId,
        "salesPersonData" : salesPersonData,
        "companyName" : companyName,
        "customerPhoneNumber" : customerPhoneNumber
    }

      let updateModal = await this.modalCtrl.create({
        component: AccessoriesEnquiryComponent,
        cssClass: 'layoutEnquiryModal',
        componentProps: {
          data: {e:e, type:1,enquiryPayload:enquiryPayload } ,
        },
        // showBackdrop:true
        
      });

      updateModal.present();
      updateModal.onDidDismiss();
    }else{
      let updateModal = await this.modalCtrl.create({
        component: AccessoriesEnquiryComponent,
        cssClass: 'layoutEnquiryModalLoginPrompt',
        componentProps: {
          data: {e:e,type:2},
        },
        // showBackdrop:true
        
      });

      updateModal.present();
      updateModal.onDidDismiss();

    }
    }

}
