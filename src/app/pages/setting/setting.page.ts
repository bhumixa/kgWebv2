import { Component, HostListener, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { DatabaseServiceService } from '../../service/database-service.service';
import { ConfigServiceService } from '../../service/config-service.service';
import { AlertController, Platform } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Crop } from '@ionic-native/crop/ngx';
import {
  FileTransfer,
  FileUploadOptions,
  FileTransferObject,
} from '@ionic-native/file-transfer/ngx';
import { Router, NavigationExtras } from '@angular/router';
import { HeaderFooterService } from '../../service/headerFooter/header-footer.service';
import { CompanyService } from '../../service/company/company.service';
import { PageService } from '../../service/page/page.service';
//import * as typeformEmbed from '@typeform/embed'
import { File } from '@ionic-native/file/ngx';
import * as S3 from 'aws-sdk/clients/s3';
import { environment } from 'src/environments/environment';
import { KycService } from 'src/app/service/observable/kyc/kyc.service';
@Component({
  selector: 'app-setting',
  templateUrl: './setting.page.html',
  styleUrls: ['./setting.page.scss'],
})
export class SettingPage implements OnInit {
  //@ViewChild('embedTypeform', { static: false }) embedElement: ElementRef;
  public userData: any;
  public userId: any;
  public testRadioOpen = false;
  public testRadioResult: any;
  public imageFileName: any;
  public image: any;
  public imageType: any;
  public extension: any;
  public imageURL: any;
  public userType: any;
  public onMobile: any;
  public refCompanyId: number;
  public pageData: any;
  public userActions: any = 'general';
  public customerLevel = '';
  public hideFooter: boolean = false;
  public contentClass = '';
  public innerWidth: any;
  public userKycDetail: any;
  public isVerified: boolean = false;
  public pending: boolean = false;
  public mobileView: boolean = false;
  public showCompanyProfile: boolean = false;
  public kycStatus: boolean = false;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (this._companyService.productListing == 'grid') {
      this.innerWidth = window.innerWidth;
      if (this.innerWidth <= 500) {
        this.contentClass = '';
        this.mobileView = true;
      } else if (this.innerWidth > 500) {
        this.contentClass = 'leftRightMargin';
        this.mobileView = false;
      }
    }
  }
  constructor(
    public _pageService: PageService,
    public _companyService: CompanyService,
    public _headerFooterService: HeaderFooterService,
    private camera: Camera,
    private transfer: FileTransfer,
    public platform: Platform,
    public crop: Crop,
    public router: Router,
    private alertCtrl: AlertController,
    public storage: Storage,
    private file: File,
    public databaseServiceService: DatabaseServiceService,
    public _configService: ConfigServiceService,
    public KycService: KycService
  ) {
    console.log(S3);
    this.platform.ready().then(() => {
      // console.log("this.platform", this.platform);
      if (this.platform.is('desktop')) {
        this.onMobile = false;
      } else {
        this.onMobile = true;
      }
      // console.log("this.onMobile", this.onMobile);
    });
    this.storage.get('userType').then((val) => {
      this.userType = 'Customer';
    });
  }

  async getParentCustomers() {
    let res: any = await this.databaseServiceService.getParentCustomers(
      this.userId
    );
    if (res.isSuccess) {
      this.customerLevel = this._companyService.companyObj.name + ' > ';
      res.data.forEach((element) => {
        this.customerLevel += element.companyName + ' / ';
      });
      this.customerLevel = this.customerLevel.substr(
        0,
        this.customerLevel.length - 3
      );

      // if (!!this.userData && !!this.userData.data && !!this.userData.data.CompanyName && !!this.userData.data.name) {
      //   this.customerLevel += " > " + this.userData.data.CompanyName + "(" + this.userData.data.name + ")";
      // }
    }
  }

  getLabelClass(val) {
    if (this.userKycDetail) {
      const field = this.userKycDetail[val];
      if (!field) {
        return ['redLabel'];
      }
    }
    return '';
  }

  async changePassword() {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        Mobile: this.userData.data.username.toString().replace('+', ''),
      },
    };
    this.router.navigate(['/change-password'], navigationExtras);
  }

  async fetchUserDetails() {
    this.userId = await this.storage.get('userID');
    //await this.databaseServiceService.showLoading();
    this.userData = await this._headerFooterService.fetchUserProfileDetails(
      this.userId
    );

    //await this.databaseServiceService.hideLoading();
    await this.getParentCustomers();

    console.log('this.userData', this.userData);

    if (this.userData.KYCStatus) {
      console.log('111');
    }
    if (!!this.userData.data.image) {
      this.imageURL = this.userData.data.image;
      // console.log("image", this.imageURL);
    }
    if (!this.userData.isSuccess) {
      this._configService.presentToast(this.userData.error, 'error');
    } else {
      try {
        let res: any = await this.databaseServiceService.getDiaUserProfile(
          this.userId
        );
        console.log(res);

        let para = JSON.parse(res.data.parameter);
        this.userKycDetail = para;
        if (
          !!this.userKycDetail?.userAccount.distributioncenter &&
          this.userKycDetail?.userAccount.distributioncenter?.companyName ==
            'Mumbai'
        ) {
          this.showCompanyProfile = true;
        }
        if (
          (this.userKycDetail &&
            this.userKycDetail.userAccount &&
            this.userKycDetail.userAccount.latticeApproved) ||
          this.kycStatus
        ) {
          this.isVerified = true;
        }

        if (!this.kycStatus) {
          if (
            this.userKycDetail &&
            this.userKycDetail.userAccount &&
            this.userKycDetail.userKYC &&
            !this.userKycDetail.userAccount.latticeApproved
          ) {
            this.pending = true;
            // this.KycService.observables.next(true)
          }
        }

        this.KycService.observables.next(true);
        if (!!para.error && para.error != '.') {
          this._configService.presentToast(para.error, 'error');
        }
      } catch (e) {}
    }
  }

  async changeTab() {
    // console.log("change tab called ");
    let link = '';
    if (this.userActions == 'general') {
      link = 'https://atisundar.typeform.com/to/RUYh6s';
    } else if (this.userActions == 'company') {
      link = 'https://atisundar.typeform.com/to/GmV9HN';
    } else if (this.userActions == 'account') {
      link = 'https://atisundar.typeform.com/to/fqFtE7';
    } else if (this.userActions == 'kyc') {
      link = 'https://atisundar.typeform.com/to/dFLcX2';
    } else if (this.userActions == 'references') {
      link = 'https://atisundar.typeform.com/to/KcfQJe';
    } else {
      // console.log("no");
    }

    if (link) {
      //typeformEmbed.makePopup(link, {mode: 'popup', autoOpen: true})
    }
  }

  async ngOnInit() {
    let user = await this.storage.get('userData');
    if (user?.username) {
      let checkKycStatusData =
        await this.databaseServiceService.checkUserExistByPhoneNo(
          user.username
        );

      if (checkKycStatusData?.data) {
        if (checkKycStatusData?.data?.KYCStatus) {
          this.kycStatus = true;
        }
      }
    }

    if (this._companyService.productListing == 'grid') {
      this.innerWidth = window.innerWidth;
      if (this.innerWidth <= 500) {
        this.contentClass = '';
        this.mobileView = true;
      } else if (this.innerWidth > 500) {
        this.contentClass = 'leftRightMargin';
        this.mobileView = false;
      }
    }
    this._configService.profileUpdatedEvent.subscribe((data: string) => {
      console.log('Event message from Component A: ' + data);
      this.fetchUserDetails();
    });
    this.setData();
    let response = await this._pageService.getPageDetailByPageName(
      'setting',
      this.userId
    );
    if (!!response.isSuccess) {
      // console.log("product page details ", response);
      this.pageData = response.data;
    } else {
      console.error(response.error);
    }
  }

  ionViewDidEnter() {
    this.fetchUserDetails();
    this._configService.setTitle('My Account');
  }
  updateProfile(userData) {
    this._configService.profileUpdateObj = userData;
    this.router.navigate(['/profile-update']);
  }

  async imageUpload() {
    if (this.onMobile) {
      this.refCompanyId = await this.storage.get('refCompanyId');

      let alert = await this.alertCtrl.create({
        header: 'Upload Image From',
        inputs: [
          {
            type: 'radio',
            label: 'Camera',
            value: '0',
            checked: true,
          },
          {
            type: 'radio',
            label: 'Gallery',
            value: '1',
          },
        ],
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              // console.log("Confirm Cancel");
            },
          },
          {
            text: 'Ok',
            handler: (data: any) => {
              this.testRadioOpen = false;
              this.testRadioResult = data;

              if (data == '0') {
                this.UploadImageFromCamera();
              } else if (data == '1') {
                this.UploadImageFromGallery();
              }
            },
          },
        ],
      });
      alert.present();
    } else {
      let element: HTMLElement = document.querySelector(
        'input[type="file"]'
      ) as HTMLElement;
      element.click();
    }
  }

  async updateUserImage() {
    let obj = {
      userId: this.userId,
      imageLink: this.imageURL,
    };

    let res = await this.databaseServiceService.imageUpload(obj);
    if (res.isSuccess) {
      this._configService.presentToast('Image updated succesfullly', 'success');
      this.fetchUserDetails();
    }
  }

  async fromweb(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const contentType = file.type;
      const bucket = new S3(environment.companyDetails.config.s3bucket);
      console.log(bucket);
      const params = {
        Bucket: 'kg-diamonds-profile',
        Key:
          'profiles/' +
          new Date().getTime() +
          '-' +
          'file-' +
          new Date().getMilliseconds(),
        Body: file,
        ACL: 'public-read',
        ContentType: contentType,
      };
      bucket.upload(params, async (err, data) => {
        return new Promise((resolve, reject) => {
          console.log(err, data);
          if (err) {
            resolve();
          }
          if (!!data) {
            this.imageURL = data.Location;
            this.updateUserImage();
            resolve();
          }
        });
      });
    } else {
      //this.isFileSelected = true;
    }
  }

  async uploadToS3(imageData) {
    await this.databaseServiceService.showLoading();
    let buf = Buffer.from(imageData, 'base64');
    const bucket = new S3(environment.companyDetails.config.s3bucket);
    const params = {
      Bucket: 'kg-diamonds-profile',
      Key:
        'profiles/' +
        new Date().getTime() +
        '-' +
        'file-' +
        new Date().getMilliseconds(),
      Body: buf,
      ACL: 'public-read',
      ContentEncoding: 'base64',
      ContentType: 'image/jpeg',
    };
    bucket.upload(params, async (err, data) => {
      console.log(err, data);
      if (err) {
        // Handle the error, for example:
        // this.config.presentToast('There was an error uploading your file');
        // Return void indicating no successful upload
        return;
      }

      if (!!data) {
        try {
          await this.databaseServiceService.hideLoading();
          this.imageURL = data.Location;
          this.updateUserImage();
        } catch (error) {
          // Handle error if any occurred during asynchronous operations
          console.error('Error:', error);
          // Return void indicating no successful upload
          return;
        }
      }
      // Return void indicating successful upload
    });
  }
  //new
  async UploadImageFromCamera() {
    const options: CameraOptions = {
      quality: 75,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      targetWidth: 400,
      targetHeight: 400,
      correctOrientation: true,
      cameraDirection: this.camera.Direction.FRONT,
    };
    const imageData = await this.camera.getPicture(options);
    console.log(imageData);

    this.uploadToS3(imageData);
  }

  loadImageFromDevice(event) {
    const file = event.target.files[0];

    const reader = new FileReader();

    reader.readAsArrayBuffer(file);

    reader.onload = () => {
      // get the blob of the image:
      let blob: Blob = new Blob([new Uint8Array(reader.result as ArrayBuffer)]);

      // create blobURL, such that we could use it in an image element:
      let blobURL: string = URL.createObjectURL(blob);
      console.log(blobURL);

      var str: string;
      str = btoa(blobURL);
      console.log(str);

      this.uploadImage(str);
    };

    reader.onerror = (error) => {
      console.log(error);
      //handle errors
    };
  }

  uploadI(imageData) {
    //this.imageURI = "data:image/jpeg;base64," + imageData;
    this.extension = imageData.ContentType;
    var imgData = {
      Base64ImageUrl: imageData.Base64ImageUrl,
      FileName: imageData.FileName,
      ContentType: this.extension,
    };
    this.databaseServiceService.imageUpload(imgData);
  }
  async getPicture(cropped = false) {
    const options: CameraOptions = {
      quality: 75,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      targetWidth: 400,
      targetHeight: 400,
      correctOrientation: true,
      cameraDirection: this.camera.Direction.FRONT,
    };
    return await this.getCameraPicture(options, cropped);
  }

  async getCameraPicture(options, cropped = false) {
    try {
      let image = await this.camera.getPicture(options);
      let entry;
      entry = await this.file.resolveLocalFilesystemUrl(image);
      let b64Data = await this.gotFile(entry);
      let imageData: any = b64Data;
      const currentTime = new Date().getTime();
      let Image = imageData.split('base64,')[1];
      let ImageType = imageData.split('base64,')[0];
      let extension = ImageType.split('/')[1];
      extension = extension.split(';')[0];
      var imgData = {
        Base64ImageUrl: Image,
        FileName: currentTime + '.jpg',
        ContentType: extension,
      };
      console.log('imgData', imgData);
      return imgData;
    } catch (e) {
      console.log(e);
      // Handle the error here or rethrow it
      throw e; // Rethrow the error to propagate it to the caller
    }
  }

  async uploadFile(formData) {
    let res: any = await this.databaseServiceService.userUpload(formData);
    console.log(res);

    if (!!res.isSuccess) {
    }
  }
  dataURItoBlob(dataURI) {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/jpeg' });
    return blob;
  }

  UploadImageFromGallery() {
    // console.log("Upload Image From Gallery");
    const options: CameraOptions = {
      quality: 75,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      targetWidth: 600,
      targetHeight: 600,
      correctOrientation: true,
      cameraDirection: this.camera.Direction.FRONT,
    };
    this.camera.getPicture(options).then(
      (imageData) => {
        this.uploadToS3(imageData);
      },
      (err) => {
        // Handle error
        // console.log("getPicture error ", err);
      }
    );
  }
  gotFile(fileEntry) {
    // console.log("in go file");
    var promise = new Promise((resolve, reject) => {
      fileEntry.file(function (eFile) {
        var reader = new FileReader();
        reader.onloadend = function (e) {
          var content = this.result;
          // console.log("content", content);
          resolve(content);
        };
        // console.log("eFile", eFile);
        reader.readAsDataURL(eFile);
      });
    });
    return promise;
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

  // async newUpload() {
  //   var imgData = {
  //     "Base64ImageUrl": "data:image/jpeg;base64,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",
  //     "FileName": "1639214472463.jpg",
  //     "ContentType": "jpeg",
  //     "ID": 114048
  //   }
  //   // console.log("imgData", imgData);
  //   let response = await this.databaseServiceService.imageUpload(imgData);
  //   if (response) {
  //     this.imageURL = response.location;
  //   }
  // }

  async uploadImage(imageData) {
    //this.imageURI = "data:image/jpeg;base64," + imageData;

    const currentTime = new Date().getTime();
    this.image = imageData.split('base64,')[1];

    this.imageType = imageData.split('base64,')[0];
    this.extension = this.imageType.split('/')[1];
    this.extension = this.extension.split(';')[0];
    // console.log("in uploadImage", this.imageType, this.extension);
    var imgData = {
      Base64ImageUrl: imageData,
      FileName: currentTime + '.jpeg',
      ContentType: 'jpeg',
      ID: this.userId,
    };
    // console.log("imgData", imgData);
    let response = await this.databaseServiceService.imageUpload(imgData);
    if (response) {
      this.imageURL = response.location;
    }
    // console.log("response", response);
  }
  openRelatedPage(dt) {
    this.router.navigate([dt]);
  }
}
