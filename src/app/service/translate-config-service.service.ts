import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class TranslateConfigService {
  currentLang: any;

 constructor(
    private translate: TranslateService,
  ) {
    this.currentLang = localStorage.getItem('lang');
  }


  public getDefaultLanguage(){
    if (this.currentLang) {
      this.translate.setDefaultLang(this.currentLang);
    } else {
      localStorage.setItem('lang', this.translate.getBrowserLang()!);
      this.currentLang = this.translate.getBrowserLang();
      this.translate.setDefaultLang(this.currentLang);
    }
    return this.currentLang;
  }

  public setLanguage(setLang: string) {
    this.translate.use(setLang);
    localStorage.setItem('lang', setLang);
  }

  public getCurrentLang() {
    return localStorage.getItem('lang');
  }
}
