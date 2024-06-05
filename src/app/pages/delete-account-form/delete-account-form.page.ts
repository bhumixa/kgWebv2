import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { DatabaseServiceService } from 'src/app/service/database-service.service';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-delete-account-form',
  templateUrl: './delete-account-form.page.html',
  styleUrls: ['./delete-account-form.page.scss'],
})
export class DeleteAccountFormPage implements OnInit {
  deleteAccountReqForm: UntypedFormGroup = new UntypedFormGroup({});
  refCompanyId: number = null;
  userData: any = {};

  constructor(
    private databaseService: DatabaseServiceService,
    private storage: Storage
  ) {
    this.deleteAccountReqForm = new UntypedFormGroup({
      name: new UntypedFormControl('', Validators.required),
      email: new UntypedFormControl('', Validators.email),
      mobile: new UntypedFormControl('', Validators.required),
      remarks: new UntypedFormControl(''),
    });
  }

  async ngOnInit() {
    this.userData = await this.storage.get('userData');
    this.refCompanyId = JSON.parse(
      this.userData.parameter
    ).userAccount.distributioncenter.refCompanyId;
  }

  onRequest(event: Event) {
    const { email, mobile } = this.deleteAccountReqForm.value;

    this.databaseService.deleteAccount(email, mobile, this.refCompanyId);

    this.deleteAccountReqForm.reset();
  }
}
