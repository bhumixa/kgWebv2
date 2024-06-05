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

@Component({
  selector: 'app-dia-comp-user-references',
  templateUrl: './dia-comp-user-references.component.html',
  styleUrls: ['./dia-comp-user-references.component.scss'],
})
export class DiaCompUserReferencesComponent implements OnInit {
  public userType: any;
  public userData: any;
  public userId: any;
  public loggedInUser: any;
  public sessionId: any;
  public profileData: any;
  public refFile: any;
  public innerWidth: any;
  public mobileView: boolean = false;
  validations_formUserReferences: any;
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
    public databaseServiceService: DatabaseServiceService
  ) {}

  async ngOnInit() {
    if (this._companyService.productListing == 'grid') {
      this.innerWidth = window.innerWidth;
      if (this.innerWidth <= 500) {
        this.mobileView = true;
      } else if (this.innerWidth > 500) {
        this.mobileView = false;
      }
    }
    this.validations_formUserReferences = this.formBuilder.group({
      name: new UntypedFormControl('', Validators.required),
      companyname: new UntypedFormControl(''),
      email: new UntypedFormControl(
        '',
        Validators.compose([
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
        ])
      ),

      phone: new UntypedFormControl(
        '',
        Validators.compose([
          Validators.maxLength(15),
          Validators.minLength(5),
          Validators.pattern('^[0-9-.]+$'),
        ])
      ),
      name2: new UntypedFormControl(''),
      companyname2: new UntypedFormControl(''),
      email2: new UntypedFormControl(
        '',
        Validators.compose([
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
        ])
      ),

      phone2: new UntypedFormControl(
        '',
        Validators.compose([
          Validators.maxLength(15),
          Validators.minLength(5),
          Validators.pattern('^[0-9-.]+$'),
        ])
      ),
      fileUploaded: new UntypedFormControl(''),
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
      if (para && para.userReferences) this.profileData = para.userReferences;
    }

    if (this.profileData) {
      this.validations_formUserReferences.controls.name.setValue(
        this.profileData.name
      );
      this.validations_formUserReferences.controls.companyname.setValue(
        this.profileData.companyname
      );
      this.validations_formUserReferences.controls.email.setValue(
        this.profileData.email
      );
      this.validations_formUserReferences.controls.phone.setValue(
        this.profileData.phone
      );

      this.validations_formUserReferences.controls.name2.setValue(
        this.profileData.name2
      );
      this.validations_formUserReferences.controls.companyname2.setValue(
        this.profileData.companyname2
      );
      this.validations_formUserReferences.controls.email2.setValue(
        this.profileData.email2
      );
      this.validations_formUserReferences.controls.phone2.setValue(
        this.profileData.phone2
      );
    }
  }

  validation_messages = {
    name: [{ type: 'required', message: 'First Name is required.' }],
    companyname: [{ type: 'required', message: 'Last name is required.' }],
    email: [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Please enter a valid email.' },
    ],
    phone: [
      { type: 'required', message: 'Phone is required.' },
      { type: 'minlength', message: 'Phone must be at least 5 digits long.' },
      {
        type: 'maxlength',
        message: 'Phone cannot be more than 25 digits long.',
      },
      { type: 'pattern', message: 'Phone username must contain only numbers.' },
    ],
    name2: [{ type: 'required', message: 'First Name is required.' }],
    companyname2: [{ type: 'required', message: 'Last name is required.' }],
    email2: [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Please enter a valid email.' },
    ],
    phone2: [
      { type: 'required', message: 'Phone is required.' },
      { type: 'minlength', message: 'Phone must be at least 5 digits long.' },
      {
        type: 'maxlength',
        message: 'Phone cannot be more than 25 digits long.',
      },
      { type: 'pattern', message: 'Phone username must contain only numbers.' },
    ],
  };

  async onSubmit(values) {
    // console.log(values);
    let objToPost = {
      useid: this.userId,
      update: 'userReferences',
      newValues: values,
    };
    let res: any = await this.databaseServiceService.updateDiaUserProfile(
      objToPost
    );
    await this.databaseServiceService.checkUserKyc();

    this.configService.presentToast('Profile Saved', 'success');
  }

  async showVal(event) {
    const formData: FormData = new FormData();
    let fileToUpload = <File>event.target.files[0];
    formData.append('file', fileToUpload);
    formData.append('ID', this.userId);
    formData.append('path', fileToUpload.name);

    let res: any = await this.databaseServiceService.commonFileUpload(formData);
    let obj = {
      path: res.data,
      name: fileToUpload.name,
    };

    if (!!res.isSuccess) {
      this.validations_formUserReferences.controls.fileUploaded.setValue(obj);
    }

    //let extension = "";
    // if (!!selectedFile) {
    // extension = this.selectedFile.name.split(".")[this.selectedFile.name.split(".").length - 1];
    // // console.log("extension ", extension, this.selectedFile.name.split("."));
    // if (!!extension && extension != "xlsx" && extension != "xls") {
    // this._configService.presentToast("Please select excel file.", "error");
    // this.selectedFile = null;
    // }
    // }
  }
}
