import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Storage } from "@ionic/storage";
import { ConfigServiceService } from "../config-service.service";
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NgxFormService {

  public refCompanyId: any = environment.refCompanyId;
  public headers;
  public frmData: any = false;

  constructor(public http: HttpClient, public storage: Storage, public configService: ConfigServiceService) {
    this.getHeaders();
  }

  async getHeaders() {
    this.headers = await this.configService.getAPIHeader();
  }


  async formStartRequestToTalkBrite(processTemplateName) {
    try {
      this.headers = await this.configService.getAPIHeader();
      const response = await this.http.get(ConfigServiceService.getBaseNewUrl() + "/processTemplates/" + this.refCompanyId + "/getProcessState?ProcessTemplateName=" + processTemplateName, { headers: new HttpHeaders(this.headers) }).toPromise();
      // console.log("response getCustomerOrders", response);
      return await response;
    } catch (error) {
      // console.log("error", error);
      return await error;
    }
  }

  async formSubmitToTalkBriteGlobal(objToPost) {
    // console.log("headers", this.headers);
    try {
      this.headers = await this.configService.getAPIHeader();
      const response = await this.http.post(ConfigServiceService.getBaseNewUrl() + "/formSubmissions/" + this.refCompanyId + "/formSubmit", objToPost, { headers: new HttpHeaders(this.headers) }).toPromise();
      // console.log("response insertAddress", response);
      return await response;
    } catch (error) {
      // console.log("error", error);
      return await error;
    }
  }


}