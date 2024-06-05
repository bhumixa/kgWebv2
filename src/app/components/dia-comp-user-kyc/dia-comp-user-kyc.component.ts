import {
  Component,
  OnInit,
  Input,
  OnChanges,
  HostListener,
} from '@angular/core';
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
import { Platform } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { File } from '@ionic-native/file/ngx';
import {
  FileTransfer,
  FileTransferObject,
} from '@ionic-native/file-transfer/ngx';
import { PreviewAnyFile } from '@ionic-native/preview-any-file/ngx';
import { KycService } from 'src/app/service/observable/kyc/kyc.service';

@Component({
  selector: 'app-dia-comp-user-kyc',
  templateUrl: './dia-comp-user-kyc.component.html',
  styleUrls: ['./dia-comp-user-kyc.component.scss'],
})
export class DiaCompUserKycComponent implements OnInit {
  public userType: any;
  public userData: any;
  public userId: any;
  public loggedInUser: any;
  public sessionId: any;
  public profileData: any;
  public onMobile: any;
  public submittedKyc: boolean = false;
  validations_formUserKYC: any;
  public innerWidth: any;
  public mobileView: boolean = false;
  public formData: any;
  public kycFile: any;
  public undertakingFile: any;
  public companypanFile: any;
  public companygstFile: any;
  public iecFile: any;
  public passportFile: any;
  public passportOrAddharcardFile: any;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
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
    private iab: InAppBrowser,
    public storage: Storage,
    public configService: ConfigServiceService,
    public KycService: KycService,
    private platform: Platform,
    private file: File,
    private transfer: FileTransfer,
    private previewAnyFile: PreviewAnyFile,
    public databaseServiceService: DatabaseServiceService
  ) {
    this.formData = {
      kyc: true,
      companypan: true,
      companygst: true,
      undertaking: true,
      iec: true,
      passport: true,
      passportOrAddharcard: true,
    };
  }
  fileTransfer: FileTransferObject = this.transfer.create();

  async download(url) {
    console.log(url);
    let fileName = url.split('/').pop();
    let path = this.file.dataDirectory + fileName;
    console.log(path);
    if (this.onMobile) {
      this.previewAnyFile.preview(url).then(
        (res: any) => {
          console.log('file : ' + res);
          //this.configService.presentToast("File Downloaded", "success");
        },
        (error) => {
          // handle error
          console.error(error);
        }
      );
    } else {
      window.open(url, '_blank');
    }
  }

  async ngOnInit() {
    this.platform.ready().then(() => {
      if (this.platform.is('desktop') || this.platform.is('mobileweb')) {
        this.onMobile = false;
      } else {
        this.onMobile = true;
      }
    });

    if (this._companyService.productListing == 'grid') {
      this.innerWidth = window.innerWidth;
      if (this.innerWidth <= 500) {
        this.mobileView = true;
      } else if (this.innerWidth > 500) {
        this.mobileView = false;
      }
    }

    this.validations_formUserKYC = this.formBuilder.group({
      kyc: new UntypedFormControl('', Validators.required),
      undertaking: new UntypedFormControl('', Validators.required),
      companypan: new UntypedFormControl('', Validators.required),
      companygst: new UntypedFormControl('', Validators.required),
      iec: new UntypedFormControl('', Validators.required),
      passportOrAddharcard: new UntypedFormControl('', Validators.required),
      passport: new UntypedFormControl('', Validators.required),
    });

    this.userData = await this.storage.get('userData');
    this.userType = await this.storage.get('userType');
    this.userId = await this.storage.get('userID');
    this.sessionId = await this.storage.get('sessionID');

    let res: any = await this.databaseServiceService.getDiaUserProfile(
      this.userId
    );
    if (res.data.parameter) {
      this.profileData = JSON.parse(res.data.parameter).userKYC;
      console.log(this.profileData);
      let companyData = JSON.parse(res.data.parameter).company;
      this.validations_formUserKYC = this.formBuilder.group({
        kyc: new UntypedFormControl('', Validators.required),
        companypan: new UntypedFormControl('', Validators.required),
        companygst: new UntypedFormControl('', Validators.required),
        undertaking: new UntypedFormControl('', Validators.required),
        iec: new UntypedFormControl('', Validators.required),
        passportOrAddharcard: new UntypedFormControl('', Validators.required),
      });
      this.formData = {
        kyc: true,
        companypan: true,
        companygst: true,
        passportOrAddharcard: true,
        undertaking: true,
        iec: true,
        passport: false,
      };
      // if (companyData?.country && companyData.country?.name.toLowerCase() != 'india') {
      //   this.validations_formUserKYC = this.formBuilder.group({
      //     kyc: new FormControl('', Validators.required),
      //     companypan: new FormControl('', Validators.required),
      //     companygst: new FormControl('', Validators.required),
      //     undertaking: new FormControl('', Validators.required),
      //     iec: new FormControl('', Validators.required),
      //     passportOrAddharcard: new FormControl('', Validators.required),
      //   });
      //   this.formData = {
      //     kyc: true,
      //     companypan: true,
      //     companygst: true,
      //     passportOrAddharcard: true,
      //     undertaking: true,
      //     iec: true,
      //     passport: false,
      //   }

      // } else {
      //   this.validations_formUserKYC = this.formBuilder.group({
      //     kyc: new FormControl('', Validators.required),
      //     iec: new FormControl('', Validators.required),
      //     passport: new FormControl('', Validators.required),
      //   });
      //   this.formData = {
      //     kyc: true,
      //     passport: true,
      //     companypan: false,
      //     companygst: false,
      //     iec: true,
      //     undertaking: false,
      //     passportOrAddharcard: false,
      //   }
      // }

      if (!!this.profileData && !!this.profileData.kyc && this.formData.kyc) {
        this.kycFile = this.profileData.kyc.path;
        // this.validations_formUserKYC.controls?.kyc.setValue(this.profileData.kyc);
      }

      if (
        !!this.profileData &&
        !!this.profileData.undertaking &&
        this.formData.undertaking
      ) {
        this.undertakingFile = this.profileData.undertaking.path;
        this.validations_formUserKYC.controls?.undertaking.setValue(
          this.profileData.undertaking
        );
      }

      if (
        !!this.profileData &&
        !!this.profileData.companypan &&
        this.formData.companypan
      ) {
        this.companypanFile = this.profileData.companypan.path;
        this.validations_formUserKYC.controls?.companypan.setValue(
          this.profileData.companypan
        );
      }

      if (
        !!this.profileData &&
        !!this.profileData.companygst &&
        this.formData.companygst
      ) {
        this.companygstFile = this.profileData.companygst.path;
        this.validations_formUserKYC.controls?.companygst.setValue(
          this.profileData.companygst
        );
      }

      if (!!this.profileData && !!this.profileData.iec && this.formData.iec) {
        this.iecFile = this.profileData.iec.path;
        this.validations_formUserKYC.controls?.iec.setValue(
          this.profileData.iec
        );
      }
      if (
        !!this.profileData &&
        !!this.profileData.passport &&
        this.formData.undertaking
      ) {
        this.passportFile = this.profileData.passport.path;
        this.validations_formUserKYC.controls?.passport.setValue(
          this.profileData.passport
        );
      }
      if (
        !!this.profileData &&
        !!this.profileData.passportOrAddharcard &&
        this.formData.passportOrAddharcard
      ) {
        this.passportOrAddharcardFile =
          this.profileData.passportOrAddharcard.path;
        this.validations_formUserKYC.controls?.passportOrAddharcard.setValue(
          this.profileData.passportOrAddharcard
        );
      }

      if (
        !!this.profileData &&
        !!this.profileData.kyc &&
        !!this.profileData.undertaking &&
        !!this.profileData.companypan &&
        !!this.profileData.companygst &&
        !!this.profileData.passportOrAddharcard
      ) {
        this.submittedKyc = true;
      }
    }
  }

  async changeListener(event, FormControlName) {
    this.submittedKyc = false;
    await this.configService.showLoading();
    console.log(event);
    const formData: FormData = new FormData();
    let fileToUpload: any = <File>event.target.files[0];
    formData.append('file', fileToUpload);
    // formData.append("ID", this.userId);
    // formData.append("path", fileToUpload.name);
    //let res: any = await this.databaseServiceService.commonFileUpload(formData);
    this.configService.uploadFile(fileToUpload).then((path) => {
      this.configService.hideLoading();
      let obj = {
        path: path,
        name: fileToUpload.name,
      };
      console.log(FormControlName);

      if (FormControlName == 'kyc') {
        this.validations_formUserKYC.controls.kyc.setValue(obj);
      }

      if (FormControlName == 'undertaking') {
        this.validations_formUserKYC.controls.undertaking.setValue(obj);
      }

      if (FormControlName == 'companypan') {
        this.validations_formUserKYC.controls.companypan.setValue(obj);
      }

      if (FormControlName == 'companygst') {
        this.validations_formUserKYC.controls.companygst.setValue(obj);
      }

      if (FormControlName == 'iec') {
        this.validations_formUserKYC.controls.iec.setValue(obj);
      }
      if (FormControlName == 'passport') {
        this.validations_formUserKYC.controls.passport.setValue(obj);
      }
      if (FormControlName == 'passportOrAddharcard') {
        this.validations_formUserKYC.controls.passportOrAddharcard.setValue(
          obj
        );
      }
    });

    //this.validations_formUserKYC.controls['FormControlName'].setValue(event.target.value);
  }

  validation_messages = {
    kyc: [{ type: 'required', message: 'KYC is required.' }],
    undertaking: [
      { type: 'required', message: 'Undertaking document name is required.' },
    ],
    companypan: [{ type: 'required', message: 'PAN ID is required.' }],
    companygst: [
      { type: 'required', message: 'Company GST document is required.' },
    ],
    iec: [{ type: 'required', message: 'IEC copy is required.' }],
    passport: [{ type: 'required', message: 'Passport copy is required.' }],
    passportOrAddharcard: [
      {
        type: 'required',
        message: 'Partner Addhar card or  Passport copy is required.',
      },
    ],
  };

  async onSubmit(values) {
    this.submittedKyc = true;
    // console.log(values);
    let objToPost = {
      useid: this.userId,
      update: 'userKYC',
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
