import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup,Validators  } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { SavedService } from 'src/app/service/cart/saved/saved.service';
import { Storage } from '@ionic/storage-angular';
import { ConfigServiceService } from 'src/app/service/config-service.service';

@Component({
  selector: 'app-accessories-enquiry',
  templateUrl: './accessories-enquiry.component.html',
  styleUrls: ['./accessories-enquiry.component.scss'],
})
export class AccessoriesEnquiryComponent implements OnInit {
  @Input() data: any;
  enquiryForm: UntypedFormGroup;

  constructor(public viewCtrl: ModalController,     public configService: ConfigServiceService,   private router: Router,public http: HttpClient, public _savedService: SavedService,public storage:Storage) {
    this.enquiryForm = new UntypedFormGroup({
      email: new UntypedFormControl('', [Validators.required, Validators.email]),
      description: new UntypedFormControl('', Validators.required),
    });
  }

  ngOnInit() {
this.enquiryForm.controls.email.setValue(this.data.enquiryPayload.salesPersonData.email);
 }
  closeModal() {
    this.viewCtrl.dismiss();
  }
 async handleSendInEnquiryModal() {

    let payload  = {
      "emailIdKAM": this.enquiryForm.value.email,
      "description":this.enquiryForm.value.description,
      "refCompanyId": this.data.enquiryPayload.refCompanyId,
      "customerId": this.data.enquiryPayload.customerId,
      "itemInfo" : this.data.e,
    }
   await this._savedService.sendInquiryEmail(payload);
    this.configService.presentToast('Email sent successfully', 'success');
    this.viewCtrl.dismiss();
   
  }


  redirectToLoginPage(){
    this.router.navigateByUrl('/login-with-sign-up');
    this.viewCtrl.dismiss();
  }
}
