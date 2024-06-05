import { Component, OnInit } from '@angular/core';
import { ConfigServiceService } from '../../service/config-service.service';
import { DatabaseServiceService } from '../../service/database-service.service';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { CompanyService } from 'src/app/service/company/company.service';
import {
  Validators,
  UntypedFormBuilder,
  UntypedFormGroup,
  UntypedFormControl,
} from '@angular/forms';
import { HeaderFooterService } from 'src/app/service/headerFooter/header-footer.service';

@Component({
  selector: 'app-profile-update',
  templateUrl: './profile-update.page.html',
  styleUrls: ['./profile-update.page.scss'],
})
export class ProfileUpdatePage implements OnInit {
  public Name: any = '';
  public Mobile: any = '';
  public Email: any = '';
  public userData: any;
  public onMobile: any;
  public hideFooter: boolean = false;
  disabled = true;
  profile_form: UntypedFormGroup;

  constructor(
    public _companyService: CompanyService,
    public formBuilder: UntypedFormBuilder,
    public platform: Platform,
    public _headerFooterService: HeaderFooterService,
    public _configService: ConfigServiceService,
    public _databaseService: DatabaseServiceService,
    public storage: Storage,
    public router: Router
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

    this.profile_form = this.formBuilder.group({
      name: new UntypedFormControl('', Validators.required),
      email: new UntypedFormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
        ])
      ),

      phone: new UntypedFormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.maxLength(15),
          Validators.minLength(10),
          Validators.pattern('^[0-9-.]+$'),
        ])
      ),
    });
    this.setData();
  }

  ngOnInit() {}

  validation_messages = {
    name: [{ type: 'required', message: ' Name is required.' }],
    email: [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Please enter a valid email.' },
    ],
    phone: [
      { type: 'required', message: 'Phone is required.' },
      { type: 'minlength', message: 'Phone must be at least 10 digits long.' },
      {
        type: 'maxlength',
        message: 'Phone cannot be more than 25 digits long.',
      },
      { type: 'pattern', message: 'Phone username must contain only numbers.' },
    ],
  };

  async ionViewDidEnter() {
    this.userData = await this._configService.profileUpdateObj;
    if (!!this.userData) {
      // console.log("profileUpdateObj", this.userData);
      this.Name = this.userData?.name;
      // if (this.userData.username.length == 12) {
      //   this.Mobile = this.userData.username.substr(2, 10);
      // } else
      this.Mobile = this.userData?.username;
      if (!!this.Mobile) {
        this.Mobile = this.Mobile;
      }
      this.Email = this.userData?.email;

      this.profile_form.get('name').setValue(this.userData?.name);
      this.profile_form.get('email').setValue(this.userData?.email);
      this.profile_form.get('phone').setValue(this.Mobile);

      this._configService.setTitle('Edit Profile');
    } else {
      this.router.navigate(['/setting']);
    }
  }

  async setData() {
    if (this._companyService.companyObj && this._companyService.companyObj) {
      if (this._companyService.companyObj.config) {
        let companyJson = this._companyService.companyObj.config;
        if (!!companyJson) {
          if (!!companyJson && companyJson?.hideFooter) {
            this.hideFooter = companyJson?.hideFooter;
          }
        }
      }
    }
  }

  async validate() {
    if (
      this.Name.length > 0 &&
      this.Email.length > 0 &&
      this.Mobile.length > 0
    ) {
      let emailRes = await this._configService.isValidEmail(this.Email);
      if (emailRes) {
        // if (this.Mobile.length == 10) {
        return true;
        // } else {
        //   this._configService.presentToast("Please 10 digit mobile number without +91 ", "error");
        //   return false;
        // }
      } else {
        this._configService.presentToast(
          'Please enter valid email id',
          'error'
        );
        return false;
      }
    } else {
      this._configService.presentToast(
        'Please enter information to update',
        'error'
      );
      return false;
    }
  }
  async onSubmit(values) {
    //let resVal = await this.validate();
    let userId = await this.storage.get('userID');
    let updateObj = {
      customerID: userId,
      username: values.phone,
      name: values.name,
      email: values.email,
    };
    await this._databaseService.showLoading();
    let updateResponse = await this._databaseService.updateUserProfile(
      updateObj
    );
    let res = await this._headerFooterService.fetchUserProfileDetails(userId);
    if (!!res.data) {
      let userData = res.data;
      let storageData = await this.storage.get('userData');
      storageData.email = userData.email;
      await this.storage.set('userData', storageData);
    }

    await this._databaseService.hideLoading();
    if (updateResponse.isSuccess) {
      this._configService.presentToast(
        'Your profile is successfully updated',
        'success'
      );

      this.router.navigate(['/setting']);
    } else {
      this._configService.presentToast(updateResponse.error, 'error');
    }
  }
}
