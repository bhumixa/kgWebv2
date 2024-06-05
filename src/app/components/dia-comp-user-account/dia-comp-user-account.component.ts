import { Component, HostListener, OnInit } from '@angular/core';
import {
  Validators,
  UntypedFormBuilder,
  UntypedFormGroup,
  UntypedFormControl,
} from '@angular/forms';
//import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { DatabaseServiceService } from '../../service/database-service.service';
import { ConfigServiceService } from '../../service/config-service.service';
import { CompanyService } from 'src/app/service/company/company.service';
import { KycService } from 'src/app/service/observable/kyc/kyc.service';

@Component({
  selector: 'app-dia-comp-user-account',
  templateUrl: './dia-comp-user-account.component.html',
  styleUrls: ['./dia-comp-user-account.component.scss'],
})
export class DiaCompUserAccountComponent implements OnInit {
  public userType: any;
  public userData: any;
  public userId: any;
  public loggedInUser: any;
  public sessionId: any;
  public profileData: any;
  disabled: boolean = true;
  validations_formUserAccount: UntypedFormGroup;
  public distributioncenters: any = [];
  public salesPerson: any;
  // public salespersons: any = [];
  public innerWidth: any;
  public mobileView: boolean = false;
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (this._companyService.productListing == 'grid') {
      this.innerWidth = window.innerWidth;
      if (this.innerWidth <= 500) {
        this.mobileView = true;
      } else if (this.innerWidth > 500) {
        this.mobileView = false;
      }
    }
  }
  constructor(
    public _companyService: CompanyService,
    public formBuilder: UntypedFormBuilder,
    public storage: Storage,
    public configService: ConfigServiceService,
    public KycService: KycService,
    public databaseServiceService: DatabaseServiceService
  ) {}

  compareFn(e1, e2): boolean {
    return e1 && e2 ? e1.id == e2.id : e1 == e2;
  }

  async ngOnInit() {
    if (this._companyService.productListing == 'grid') {
      this.innerWidth = window.innerWidth;
      if (this.innerWidth <= 500) {
        this.mobileView = true;
      } else if (this.innerWidth > 500) {
        this.mobileView = false;
      }
    }
    this.validations_formUserAccount = this.formBuilder.group({
      distributioncenter: new UntypedFormControl({}, Validators.required),
      // salesperson: new FormControl({}, Validators.required),
      username: new UntypedFormControl(
        'my user name from storage',
        Validators.compose([
          Validators.required,
          Validators.maxLength(25),
          Validators.minLength(5),
        ])
      ),

      updates: new UntypedFormControl('Yes', Validators.required),
      salesperson: new UntypedFormControl({}, Validators.required),
      latticeSalesPerson: new UntypedFormControl({}, Validators.required),
    });

    this.userData = await this.storage.get('userData');
    this.userType = await this.storage.get('userType');
    this.userId = await this.storage.get('userID');
    this.sessionId = await this.storage.get('sessionID');

    let res: any = await this.databaseServiceService.getDiaUserProfile(
      this.userId
    );
    if (res.data.parameter) {
      let para = JSON.parse(res.data.parameter);
      if (para && para.userAccount) this.profileData = para.userAccount;
    }

    let resDist: any = await this.databaseServiceService.getDistributors();
    this.distributioncenters = resDist.data;

    // let resSalesUsers: any = await this.databaseServiceService.findMatchWorkAreaUsers(this.userId, '<');
    // this.salespersons = resSalesUsers.data;

    if (!!this.userData && !!this.userData.username) {
      this.validations_formUserAccount.controls['username'].setValue(
        this.userData.username
      );
    }
    setTimeout(() => {
      if (this.profileData && this.profileData.distributioncenter) {
        // console.log(this.profileData.distributioncenter)
        let companyExist = this.distributioncenters.find(
          (res) =>
            res.companyName == this.profileData.distributioncenter.companyName
        );

        //this.validations_formUserAccount.controls.distributioncenter.setValue(selectedDis[0]);
        this.validations_formUserAccount
          .get('distributioncenter')
          .setValue(companyExist);
      } else {
        this.validations_formUserAccount.controls[
          'distributioncenter'
        ].setValue(this.distributioncenters[0]);
      }
    }, 1000);

    // if (this.profileData && this.profileData.salesperson) {
    // 	// console.log(this.profileData.salesperson)
    // 	let selectedSale = this.salespersons.filter(res => res.name == this.profileData.salesperson.name);
    // 	// console.log(selectedSale)
    // 	this.validations_formUserAccount.controls.salesperson.setValue(selectedSale[0]);
    // }
    // else
    // 	this.validations_formUserAccount.controls.salesperson.setValue(this.salespersons[0]);

    if (this.profileData && this.profileData.updates)
      this.validations_formUserAccount.controls['updates'].setValue(
        this.profileData.updates
      );
    else this.validations_formUserAccount.controls['updates'].setValue('Yes');

    if (
      this.profileData &&
      this.profileData.salesperson &&
      this.profileData.salesperson.name
    ) {
      this.salesPerson = this.profileData.salesperson.name;
      this.validations_formUserAccount.controls['salesperson'].setValue(
        this.profileData.salesperson
      );
    }
    if (this.profileData && this.profileData.latticeSalesPerson) {
      this.validations_formUserAccount.controls['latticeSalesPerson'].setValue(
        this.profileData.latticeSalesPerson
      );
    }
  }

  validation_messages = {
    distributioncenter: [
      { type: 'required', message: 'Distribution Center is required.' },
    ],
    // 'salesperson': [
    // 	{ type: 'required', message: 'Sales Person name is required.' }
    // ],
    username: [
      { type: 'required', message: 'Phone is required.' },
      { type: 'minlength', message: 'Phone must be at least 5 digits long.' },
      {
        type: 'maxlength',
        message: 'Phone cannot be more than 25 digits long.',
      },
    ],
    updates: [{ type: 'required', message: 'Updates name is required.' }],
  };

  async onSubmit(values) {
    // console.log(values);

    let objToPost = {
      useid: this.userId,
      update: 'userAccount',
      newValues: values,
    };
    let res: any = await this.databaseServiceService.updateDiaUserProfile(
      objToPost
    );
    this.databaseServiceService.checkUserKyc();
    this.configService.presentToast('Profile Saved', 'success');
    this.configService.profileUpdated('Profile Updated');
    this.KycService.observables.next(true);
  }
}
