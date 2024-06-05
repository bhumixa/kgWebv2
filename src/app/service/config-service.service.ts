import { Injectable, EventEmitter, Output } from '@angular/core';
import {
  HttpClient,
  HttpEventType,
  HttpHeaders,
  HttpResponse,
} from '@angular/common/http';
import { Router, NavigationExtras } from '@angular/router';
import { Title } from '@angular/platform-browser';

import {
  NavController,
  ToastController,
  LoadingController,
  Platform,
} from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { File } from '@ionic-native/file/ngx';
import { PreviewAnyFile } from '@ionic-native/preview-any-file/ngx';
import {
  FileTransfer,
  FileTransferObject,
} from '@ionic-native/file-transfer/ngx';
import {
  InAppBrowser,
  InAppBrowserOptions,
} from '@ionic-native/in-app-browser/ngx';

import { Observable } from 'rxjs';

import { environment } from './../../environments/environment';
//import * as XLSX from "xlsx";
import * as FileSaver from 'file-saver';
// import { DocumentViewer, DocumentViewerOptions } from '@ionic-native/document-viewer';
//import { DocumentViewer, DocumentViewerOptions } from '@awesome-cordova-plugins/document-viewer/ngx';
import * as S3 from 'aws-sdk/clients/s3';

import * as XLSX from 'xlsx-js-style';
import defaultValue from '../pages/diamond-search/default';

@Injectable({
  providedIn: 'root',
})
export class ConfigServiceService {
  editAddressObj: any;
  userNumber: any;
  loader: any;
  //static mode = "Dev";
  static mode = 'Production';
  public profileUpdateObj: any;
  // public appName = "Educe Consulting";
  public dealerClubMode = environment.dealerClubMode;
  public appName = environment.appName;
  public companyName = environment.appName;
  public TOKEN_KEY = 'talkBriteAccessToken';

  static algoliaAppId = environment.algoliaAppId;
  static algoliaSearchOnlyKey = environment.algoliaSearchOnlyKey;

  public onMobile = false;
  public productName = environment.companyDetails.config.productName;
  public EXCEL_TYPE =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  public EXCEL_EXTENSION = '.xlsx';
  public isAndroid: boolean = true;
  public headers;
  public refCompanyId: any = environment.refCompanyId;
  // public options: DocumentViewerOptions = {
  //   title: 'KG-stones'
  // }
  inAppBrowserOptions: InAppBrowserOptions = {
    location: 'yes', //Or 'no'
    hidden: 'no', //Or  'yes'
    clearcache: 'yes',
    clearsessioncache: 'yes',
    zoom: 'yes', //Android only ,shows browser zoom controls
    hardwareback: 'yes',
    mediaPlaybackRequiresUserAction: 'no',
    shouldPauseOnSuspend: 'no', //Android only
    closebuttoncaption: 'Close', //iOS only
    disallowoverscroll: 'no', //iOS only
    toolbar: 'yes', //iOS only
    enableViewportScale: 'no', //iOS only
    allowInlineMediaPlayback: 'no', //iOS only
    presentationstyle: 'pagesheet', //iOS only
    fullscreen: 'yes', //Windows only
  };
  @Output() addressAddedEvent = new EventEmitter<string>();
  @Output() profileUpdatedEvent = new EventEmitter<string>();
  @Output() purchaseDiamondEvent = new EventEmitter<string>();
  @Output() pdParameterEvent = new EventEmitter<string>();
  locationsArray = [];
  pdParameterSet(data) {
    this.pdParameterEvent.emit(data);
  }

  addressAdded(msg: string) {
    this.addressAddedEvent.emit(msg);
  }

  diamondPurchased(msg) {
    this.purchaseDiamondEvent.emit(msg);
  }

  profileUpdated(msg) {
    this.profileUpdatedEvent.emit(msg);
  }
  constructor(
    private titleService: Title,
    private file: File,
    private transfer: FileTransfer,
    private previewAnyFile: PreviewAnyFile,
    private iab: InAppBrowser,
    private storage: Storage,
    public toastController: ToastController,
    public loadingCtrl: LoadingController,
    public platform: Platform,
    public navCtrl: NavController,
    public router: Router,
    public http: HttpClient
  ) {
    this.platform.ready().then(() => {
      // console.log("this.platform", this.platform);
      if (this.platform.is('desktop') || this.platform.is('mobileweb')) {
        this.onMobile = false;
      } else {
        this.onMobile = true;
      }
      if (this.platform.is('android')) {
        this.isAndroid = true;
      } else {
        this.isAndroid = false;
      }
    });
    this.setTitle('');

    if (ConfigServiceService.mode == 'Production') {
      // window.console.log = () => {};
    }

    defaultValue.location.map((x) => {
      let val = x.value.split(',');
      console.log(val);
      for (let l in val) {
        let v = val[l];
        let obj = {
          ...x,
          value: v,
        };
        this.locationsArray.push(obj);
      }
    });
  }

  async ionViewWillEnter() {
    await this.setAppName();
  }
  async setAppName() {
    if (
      !this.onMobile &&
      window &&
      'location' in window &&
      'protocol' in window.location &&
      'pathname' in window.location &&
      'host' in window.location
    ) {
      this.appName = window.location.hostname;
      // console.log("company name", this.appName);
    }
  }

  setTitle(title) {
    if (this.companyName != '' && !!title && title.includes('KG Diamonds')) {
      this.titleService.setTitle(this.companyName + ' || ' + title);
    } else if (this.companyName == '' && title.includes('KG Diamonds')) {
      this.titleService.setTitle(this.appName + ' || ' + title);
    } else if (!!title && title.includes('Aspeco')) {
      this.titleService.setTitle('Aspeco Diamonds' + ' || ' + title);
    }
  }

  static getBaseNewUrl() {
    if (this.mode == 'Production') {
      return 'https://web-api.lattice-app.com/api';
    } else if (this.mode == 'Testing') {
      return 'https://talkbrite-dev.atishae.com/api';
    } else {
      return 'https://api-dev.kg-website.atishae.com/api';
    }
  }

  static nodeServerUrl() {
    if (this.mode == 'Production') {
      return 'https://apin.lattice-app.com/';
    } else if (this.mode == 'Dev') {
      return 'https://apin.lattice-dev.atishae.com/';
    } else {
      return 'http://localhost:3000/';
    }
  }

  async presentToast(message, responseType) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'top',
      color: responseType == 'error' ? 'danger' : 'success',
    });
    toast.present();
  }
  static generateSessionID(uuID) {
    return uuID + '_' + Math.round(new Date().getTime());
  }
  static generateSessionIdForDesktop() {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15) +
      Math.round(new Date().getTime() / 1000)
    );
  }

  async isValidEmail(email) {
    const re =
      /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/.test(email);
    if (re) {
      return true;
    } else {
      return false;
    }
  }

  async getAPIHeader() {
    let token = await this.storage.get(this.TOKEN_KEY);
    // console.log("user token inside api header", token);
    var obj: any = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    if (token) {
      obj.Authorization = token;
    }

    return obj;
  }
  async showLoading() {
    // if (this.platform.is("desktop")) {
    //   this.loader = await this.loadingCtrl.create({
    //     cssClass: 'custom-loader',
    //     spinner: null, // Hide the default spinner
    //     message: `
    //     <div class="custom-spinner">
    //       <img src="assets/icon/website - Loader.gif" alt="Custom Loader" />
    //     </div>
    //   `,
    //   });
    // } else {
    //   this.loader = await this.loadingCtrl.create({
    //     message: "Please wait...",
    //     spinner: "crescent",
    //   });
    // }
    this.loader = await this.loadingCtrl.create({
      message: 'Please wait...',
      spinner: 'crescent',
    });
    return await this.loader.present();
  }
  async hideLoading() {
    // // console.log("loader stop ...");
    if (!!this.loader) {
      return await this.loader?.dismiss();
    }
  }
  getAppName() {
    return this.appName;
  }

  async goToNotificationDetails(obj) {
    // console.log("obj ", obj);
    if (obj.type == 'Order') {
      this.navCtrl.navigateForward(['/manage-order-details/' + obj.refData]);
    } else if (obj.type == 'Cancel Order') {
      this.navCtrl.navigateForward(['/manage-order-details/' + obj.refData]);
    } else if (obj.type == 'Dispatch') {
      if (!!obj.refData) {
        this.navCtrl.navigateForward(['/view-dispatch/' + obj.refData]);
      } else {
        this.navCtrl.navigateForward(['/dispatchs/']);
      }
    } else if (obj.type == 'New Product Launched') {
      this.navCtrl.navigateForward(['/products/' + obj.refData]);
    } else if (obj.type == 'Schemes') {
      this.navCtrl.navigateForward(['/schemes/']);
    } else if (obj.type == 'Order Freshness') {
      let navigationExtras: NavigationExtras;
      navigationExtras = {
        queryParams: {
          data: obj.refData,
        },
      };
      this.router.navigate(['/order-freshness/'], navigationExtras);
      // this.navCtrl.navigateForward(["/order-freshness/" + obj.refData]);
    } else if (obj.type == 'Order Processing Started') {
      let orderId = JSON.parse(obj.refData).orderId;
      if (!!orderId) {
        this.navCtrl.navigateForward(['/manage-order-details/' + orderId]);
      }
    }
  }

  arrayOne(n: number): any[] {
    return Array(n);
  }

  convertToCSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';

    for (var i = 0; i < array.length; i++) {
      var line = '';
      for (var index in array[i]) {
        if (line != '') line += ',';

        line += array[i][index];
      }

      str += line + '\r\n';
    }

    return str;
  }

  modify_excelColProperty_num = function (
    colIdx: string,
    i: number,
    bold: boolean,
    color: string,
    worksheet: XLSX.WorkSheet
  ) {
    const col = XLSX.utils.decode_col(colIdx);
    const ref = XLSX.utils.encode_cell({ r: i + 1, c: col });
    const hyperlinkStyle = {
      font: { bold: bold, color: { rgb: color } },
      alignment: {
        horizontal: 'left',
        vertical: 'center',
      },
    };
    worksheet[ref].s = hyperlinkStyle;
    return worksheet;
  };

  modify_excelColProperty = function (
    json: any,
    i: number,
    columns: any,
    worksheet: XLSX.WorkSheet
  ) {
    columns.forEach((column) => {
      const columnName = Object.keys(column)[0];
      if (json[i][columnName]) {
        const { letter, isBold, color } = column[columnName];
        worksheet = this.modify_excelColProperty_num(
          letter,
          i,
          isBold,
          color,
          worksheet
        );
      }
    });

    return worksheet;
  };

  public async exportAsExcelFile(orgJson: any[], excelFileName: string) {
    const hyperlinkStyle = {
      font: {
        bold: true,
        color: '000000',
        sz: '11',
      },
      fill: {
        type: 'pattern',
        patternType: 'solid',
        fgColor: { rgb: 'e8f0f8' },
      },
    };
    let worksheet: XLSX.WorkSheet;
    // const locationJson = orgJson
    const jsonX = orgJson;

    const newJson: any = await JSON.parse(JSON.stringify(jsonX)).map((x) => {
      delete x.currentLocation;
      let obj = x;
      return obj;
    });
    console.log(newJson);
    let json = orgJson;

    if (excelFileName == 'Pricing_calc_template') {
      worksheet = XLSX.utils.json_to_sheet([], { header: newJson });
    } else {
      worksheet = XLSX.utils.json_to_sheet(newJson);
    }

    const columnList = [];

    for (let j = 65; j < 65 + 51; j++) {
      if (j > 90) {
        let char = String.fromCharCode(65) + String.fromCharCode(j - 26);
        columnList.push(char);
      } else columnList.push(String.fromCharCode(j));
    }

    columnList.forEach((column: string) => {
      let col = XLSX.utils.decode_col(column);
      let ref = XLSX.utils.encode_cell({ r: 0, c: col });
      const hyperlinkStyle = {
        font: { bold: true, color: { rgb: '000000' } },
        alignment: {
          horizontal: 'center',
          vertical: 'center',
        },
      };
      worksheet[ref].s = hyperlinkStyle;
    });

    for (let i = 0; i < json.length; i++) {
      if (json[i]['STONE ID']) {
        let stoneCol = XLSX.utils.decode_col('A');
        let ref = XLSX.utils.encode_cell({ r: i + 1, c: stoneCol });
        let stoneIdColor: string = '';
        if (String(json[i]['STONE ID']).includes('Not Available')) {
          stoneIdColor = 'FF0000';
        } else {
          stoneIdColor = '0F7FF2';
        }
        const hyperlinkStyle = {
          font: { bold: true, color: { rgb: stoneIdColor } },
          alignment: {
            horizontal: 'left',
            vertical: 'center',
          },
        };

        worksheet[ref].s = hyperlinkStyle;
        let url =
          'https://www.kgdiamonds.com/products/' +
          json[i]['STONE ID'] +
          '/' +
          json[i]['STONE ID'] +
          '/' +
          json[i]['currentLocation'];
        worksheet[ref].l = {
          Target: url,
          // Target: `https://stackg.azureedge.net/v360azurekg/V360_5_0/Vision360.html?d=${json[i]['STONE ID']}`,
          Tooltip: json[i]['STONE ID'],
        };

        // const customStyle = { font: { color: { rgb: 'FFFF00' } } };
        // XLSX.utils.cell(worksheet['B2'], customStyle);
      }

      if (json[i]['currentLocation']) {
        delete json[i]['currentLocation'];
        delete worksheet['currentLocation'];
      }

      const columns: any = [
        { CTS: { letter: 'D', isBold: false, color: '000000' } },
        { RAP: { letter: 'P', isBold: false, color: '000000' } },
        { 'RAP VALUE': { letter: 'Q', isBold: false, color: '000000' } },
        { DISC: { letter: 'M', isBold: true, color: 'FF0000' } },
        { 'PRICE($)': { letter: 'N', isBold: true, color: 'FF0000' } },
        { 'AMT($)': { letter: 'O', isBold: true, color: 'FF0000' } },
        { LENGTH: { letter: 'R', isBold: false, color: '000000' } },
        { WIDTH: { letter: 'S', isBold: false, color: '000000' } },
        { HEIGHT: { letter: 'T', isBold: false, color: '000000' } },
        { 'DEPTH %': { letter: 'U', isBold: false, color: '000000' } },
        { 'TABLE %': { letter: 'V', isBold: false, color: '000000' } },
        { 'L/W RATIO': { letter: 'W', isBold: false, color: '000000' } },
        { 'CROWN ANGLE': { letter: 'AC', isBold: false, color: '000000' } },
        { 'CROWN HEIGHT': { letter: 'AD', isBold: false, color: '000000' } },
        { 'PAVILION ANGLE': { letter: 'AE', isBold: false, color: '000000' } },
        { 'PAVILION HEIGHT': { letter: 'AF', isBold: false, color: '000000' } },
        { 'STAR LENGTH': { letter: 'AG', isBold: false, color: '000000' } },
        { 'LOWER HALVES': { letter: 'AH', isBold: false, color: '000000' } },
        { 'GIRDLE %': { letter: 'AI', isBold: false, color: '000000' } },
      ];

      worksheet = this.modify_excelColProperty(json, i, columns, worksheet);

      if (json[i]['LOC.']) {
        let locCol = XLSX.utils.decode_col('B');
        let colRef = XLSX.utils.encode_cell({ r: i + 1, c: locCol });
        let locVal = this.locationsArray.find(
          (x) => x.value == json[i]['LOC.']
        )?.label;
        let val = locVal;
        worksheet[colRef] = { v: val };
      }

      if (json[i]['REPORT NO.']) {
        let n = json[i]['REPORT NO.'].toString();
        let reportCol = XLSX.utils.decode_col('C');
        let reportC = XLSX.utils.encode_cell({ r: i + 1, c: reportCol });

        const hyperlinkStyle = {
          font: { bold: true, color: { rgb: '0F7FF2' } },
          alignment: {
            horizontal: 'left',
            vertical: 'center',
          },
        };
        worksheet[reportC].s = hyperlinkStyle;

        worksheet[reportC].l = {
          Target: `https://kgmediaprod.blob.core.windows.net/certificates/${json[i]['LAB']}/${json[i]['REPORT NO.']}.pdf`,
          Tooltip: json[i]['REPORT NO.'],
        };
      }

      // const col = XLSX.utils.decode_col('A');
      // const refC = XLSX.utils.encode_cell({ r: i, c: col });
      // worksheet[refC] = { v: worksheet[refC], s: leftAlignedStyle };

      //worksheet[refC].s = leftAlignedStyle;
      // worksheet[ref].l = { Target:"https://sheetjs.com", Tooltip:"Find us @ SheetJS.com!" };
      // var ref = XLSX.utils.encode_cell({r:i, c:colNum});
      // console.log(ref)

      // worksheet[ref].s = { font: { color: { rgb: '0563C1' }, underline: true } }
      // console.log(worksheet)
      // debugger
      //worksheet['A2'].s = hyperlinkStyle;
      // worksheet[XLSX.utils.encode_cell({
      //   c: 1,
      //   r: i + 1
      // })].l = hyperlinkStyle;

      // worksheet[XLSX.utils.encode_cell({
      //   c: 2,
      //   r: i + 1
      // })].l = { Target: json[i]['Certificate Number'] };
    }

    const leftAlignedStyle = {
      alignment: {
        horizontal: 'left',
        vertical: 'center',
      },
    };

    const columnWidths = {};
    for (const cellAddress in worksheet) {
      if (cellAddress.startsWith('!')) continue;
      const cell = worksheet[cellAddress];
      const cellValue = cell ? cell.v : undefined;
      // worksheet[cellAddress] = { v: cellValue, s: leftAlignedStyle };

      // for header (1st row) of excel to be bold font
      /*
      if (cellAddress.includes('1')) {
        const cell = worksheet[cellAddress];
        cell.s = {
          ...cell.s,
          font: { bold: true },
        };
      }
      */

      if (!cell) continue;
      const column = cellAddress.replace(/[0-9]/g, ''); // Extract the column letter
      // console.log(`Cell ${cellAddress}: ${column}`);

      if (
        !columnWidths[column] ||
        cell.v?.toString().length > columnWidths[column]
      ) {
        columnWidths[column] = cell.v?.toString().length;
      }
      // console.log(worksheet[cellAddress].s);
      if (!worksheet[cellAddress]?.s || !worksheet[cellAddress]?.s.font) {
        worksheet[cellAddress] = { v: cellValue, s: leftAlignedStyle };
      }
    }

    // Set the column widths based on the maximum content length
    for (const column in columnWidths) {
      worksheet['!cols'] = worksheet['!cols'] || [];
      worksheet['!cols'].push({ wch: columnWidths[column] + 1 });
    }

    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ['data'],
    };

    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    //const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: this.EXCEL_TYPE,
    });
    if (this.onMobile) {
      if (!!this.isAndroid) {
        let exportedFilename = fileName + this.EXCEL_EXTENSION;
        let path = this.file.externalDataDirectory + '/' + exportedFilename;
        this.file
          .writeFile(this.file.externalDataDirectory, exportedFilename, data, {
            replace: true,
          })
          .then(
            (fileEntry) => {
              this.previewAnyFile.preview(path).then(
                (res: any) => {
                  this.presentToast('File Downloaded', 'success');
                },
                (error) => {
                  // handle error
                }
              );
            },
            (error) => {
              // handle error
              alert('error in write file ' + JSON.stringify(error));
            }
          );
      } else {
        this.uploadImage(buffer, 'xlsx');
      }
    } else {
      FileSaver.saveAs(data, fileName + this.EXCEL_EXTENSION);
    }
  }

  uploadFileToS3(url: string, file: any): Observable<any> {
    return this.http.put(url, file, {
      headers: {
        'Content-Type': file.type,
      },
      reportProgress: true,
      observe: 'events',
    });
  }

  async getPresignedUrlForUploadFile(fileName, fileType, action) {
    try {
      this.headers = await this.getAPIHeader();
      const responce = await this.http
        .post(
          ConfigServiceService.getBaseNewUrl() +
            `/users/getPresignedUrlForUploadFile`,
          {
            fileName: fileName,
            fileType: fileType,
            refCompanyId: this.refCompanyId,
            action: action,
          },
          { headers: new HttpHeaders(this.headers) }
        )
        .toPromise();

      return responce;
    } catch (error) {
      return await error;
    }
  }
  async uploadFile(file: any, action: any = '') {
    try {
      // Fetch the presigned URL for file upload
      let res = await this.getPresignedUrlForUploadFile(
        file.name,
        file.type,
        action
      );

      // Check if the URL generation was successful
      if (res.isSuccess) {
        let presignedUrl = res.data;

        // Return a new promise for the file upload process
        return new Promise((resolve, reject) => {
          this.uploadFileToS3(presignedUrl, file).subscribe(
            (event) => {
              if (event.type === HttpEventType.UploadProgress) {
                if (event.total) {
                  let progress = Math.round((100 * event.loaded) / event.total);
                  console.log(progress);
                }
              } else if (event instanceof HttpResponse) {
                let uploadedFileUrl = presignedUrl.split('?')[0];
                resolve(uploadedFileUrl);
                console.log('File successfully uploaded!', uploadedFileUrl);
              }
            },
            (error) => {
              console.error('File upload error:', error);
              reject(error);
            }
          );
        });
      } else {
        // Handle the error case where the presigned URL could not be generated
        this.presentToast('Link Generation Error', 'error');
        throw new Error('Presigned URL generation failed');
      }
    } catch (error) {
      // Handle any unexpected errors
      console.error('Error in uploadFile:', error);
      throw error;
    }

    // return new Promise((resolve, reject) => {
    //   let res: any = this.dataService.getPresignedUrlForUploadFile(
    //     'myfile.jpg',
    //     'image/jpeg'
    //   );
    //   if (res.isSuccess) {
    //     let data = res.data;
    //     console.log(data);

    //   } else {
    //     this.presentToast('Link Generation Error', 'error');
    //   }
    // });
    // return new Promise((resolve, reject) => {
    //   const contentType = file.type;
    //   const bucket = new S3(environment.companyDetails.config.s3bucket);
    //   const params = {
    //     Bucket: 'kg-diamonds-profile',
    //     Key: file.name,
    //     Body: file,
    //     ACL: 'public-read',
    //     ContentEncoding: 'base64',
    //     ContentType: contentType,
    //   };
    //   bucket.upload(params, async (err, data) => {
    //     console.log(err, data);
    //     if (err) {
    //       alert(err);
    //     }
    //     if (!!data) {
    //       resolve(data.Location);
    //     }
    //   });
    // });
  }

  async uploadImage(imageData, contentType) {
    const bucket = new S3({});
    const params = {
      Bucket: 'kg-diamonds-profile',
      Key:
        'exported-files/' +
        new Date().getTime() +
        '-' +
        'file-' +
        new Date().getMilliseconds() +
        this.EXCEL_EXTENSION,
      Body: imageData,
      ACL: 'public-read',
      ContentEncoding: 'base64',
      ContentType: contentType,
    };
    bucket.upload(params, async (err, data) => {
      console.log(err, data);
      if (err) {
        alert(err);
      }
      if (!!data) {
        const browser = this.iab.create(
          data.Location,
          '_system',
          this.inAppBrowserOptions
        );
      }
    });
  }

  openRelatedPage(dt) {
    this.router.navigate([dt]);
  }

  onerror(ev) {
    alert('Error occurred on doc viewer' + ev);
  }

  exportCSVFile(headers, items, fileTitle) {
    if (headers) {
      items.unshift(headers);
    }

    // Convert Object to JSON
    var jsonObject = JSON.stringify(items);

    var csv = this.convertToCSV(jsonObject);

    var exportedFileName = fileTitle + '.csv' || 'export.csv';

    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const nav = window.navigator as any;
    if (nav.msSaveOrOpenBlob) {
      // IE 10+
      nav.msSaveOrOpenBlob(blob, exportedFileName);
    } else {
      var link = document.createElement('a');
      var url = URL.createObjectURL(blob);
      if (this.onMobile) {
        console.log(url);
        // let fileName = url.split('/').pop();

        if (!!this.isAndroid) {
          let path = this.file.externalDataDirectory + '/' + exportedFileName;

          this.file
            .writeFile(
              this.file.externalDataDirectory,
              'KG_stones.xlsx',
              blob,
              { replace: true }
            )
            .then(
              (fileEntry) => {
                this.previewAnyFile.preview(path).then(
                  (res: any) => {
                    this.presentToast('File Downloaded', 'success');
                  },
                  (error) => {
                    // handle error
                  }
                );
              },
              (error) => {
                // handle error
                alert('error in write file ' + JSON.stringify(error));
              }
            );
        } else {
          let filePath = this.file.syncedDataDirectory + '/' + exportedFileName;
          alert('IOS path' + filePath);
          this.file
            .writeFile(this.file.syncedDataDirectory, 'KG_stones.xlsx', blob, {
              replace: false,
            })
            .then(
              (fileEntry) => {
                alert('File write successfully');
                // this.documentViewer.viewDocument(filePath, this.EXCEL_TYPE, this.options, onerror)
              },
              (error) => {
                // handle error
                alert('error in write file ' + JSON.stringify(error));
              }
            );
        }
      } else {
        this.uploadImage(blob, 'csv');
        if (link.download !== undefined) {
          // feature detection
          // Browsers that support HTML5 download attribute

          link.setAttribute('href', url);
          link.setAttribute('download', exportedFileName);
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }
    }
  }
}
