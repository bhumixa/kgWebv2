import { Injectable, Inject } from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { Storage } from "@ionic/storage";
import { environment } from './../../environments/environment'
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: "root"
})
export class ThemeService {
  private themeBoolean = new BehaviorSubject<boolean>(false);
  themeBoolean$ = this.themeBoolean.asObservable();

  setThemeBoolean(value: boolean) {
    this.themeBoolean.next(value);
  }
  constructor(@Inject(DOCUMENT) private document: Document, private storage: Storage) {
  }

  // Override all global variables with a new theme
  async setTheme(themeName: any) {
    let finalTheme = themeName;
    // this.document.documentElement.style.cssText = environment.themes;
    if(finalTheme.includes('light')){
      this.document.documentElement.style.cssText = environment?.companyDetails.config.lightLattice;

    }else{
      this.document.documentElement.style.cssText = environment?.companyDetails.config.darkLattice;


    }
  }

}
