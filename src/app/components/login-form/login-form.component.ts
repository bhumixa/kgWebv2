import {
  Component,
  OnInit,
  ChangeDetectorRef,
  Input,
  HostListener,
  ViewChild,
} from '@angular/core';
import {
  NavController,
  Platform,
  ModalController,
  IonInput,
} from '@ionic/angular';
import { DatabaseServiceService } from '../../service/database-service.service';
import { HeaderFooterService } from '../../service/headerFooter/header-footer.service';
import { ConfigServiceService } from '../../service/config-service.service';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { GuestLoginPage } from '../../pages/guest-login/guest-login.page';
import { CompanyService } from '../../service/company/company.service';
import { LOGGEDINService } from '../../service/observable/user/loggedin.service';
import { AnalyticsService } from 'src/app/service/analytics.service';
import defaultValue from '../../pages/diamond-search/default';
import { ThemeService } from 'src/app/service/theme.service';
// import { EventPopupComponent } from 'src/app/components/event-popup/event-popup.component';
@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent implements OnInit {
  @ViewChild('ca_email') ca_email: IonInput;
  @ViewChild('login_password') login_password: IonInput;

  public distributioncenters = [];
  public salesPersons: any = [];
  public btnDisabled: boolean = false;
  public flags = [
    {
      location: 'Mumbai',
      flagClass: 'in',
    },
    {
      location: 'Hong Kong',
      flagClass: 'hk',
    },
    {
      location: 'Antwerp',
      flagClass: 'be',
    },
    {
      location: 'New York',
      flagClass: 'us',
    },
    {
      location: 'Dubai',
      flagClass: 'ae',
    },
  ];
  // public salesPersons =
  //   [
  //     {
  //       "name": "Vishal Shah",
  //       "location": "mumbai"
  //     },
  //     {
  //       "name": "AKSHAY POLEKAR",
  //       "location": "mumbai"
  //     },
  //     {
  //       "name": "ATMARAM",
  //       "location": "mumbai"
  //     },
  //     {
  //       "name": "BIREN",
  //       "location": "mumbai"
  //     },
  //     {
  //       "name": "CHANDRESH DAVE",
  //       "location": "mumbai"
  //     },
  //     {
  //       "name": "CHETAN",
  //       "location": "mumbai"
  //     },
  //     {
  //       "name": "DHAIRYA",
  //       "location": "mumbai"
  //     },
  //     {
  //       "name": "DHARA",
  //       "location": "mumbai"
  //     },
  //     {
  //       "name": "EKNATH",
  //       "location": "mumbai"
  //     },
  //     {
  //       "name": "HARSH",
  //       "location": "mumbai"
  //     },
  //     {
  //       "name": "JAYANT",
  //       "location": "mumbai"
  //     },
  //     {
  //       "name": "JENIL",
  //       "location": "mumbai"
  //     },
  //     {
  //       "name": "JITU",
  //       "location": "mumbai"
  //     },
  //     {
  //       "name": "KAMLESH",
  //       "location": "mumbai"
  //     },
  //     {
  //       "name": "NEMIL JOGANI",
  //       "location": "mumbai"
  //     },
  //     {
  //       "name": "NISHIL",
  //       "location": "mumbai"
  //     },
  //     {
  //       "name": "PRANAY MEHTA",
  //       "location": "mumbai"
  //     },
  //     {
  //       "name": "PRASHANT SHAH",
  //       "location": "mumbai"
  //     },
  //     {
  //       "name": "RAINISH GANDHI",
  //       "location": "mumbai"
  //     },
  //     {
  //       "name": "RAJU",
  //       "location": "mumbai"
  //     },
  //     {
  //       "name": "RESHMA",
  //       "location": "mumbai"
  //     },
  //     {
  //       "name": "RUSHABH",
  //       "location": "mumbai"
  //     },
  //     {
  //       "name": "SHENIL SHAH",
  //       "location": "mumbai"
  //     },
  //     {
  //       "name": "SHRAVANI",
  //       "location": "mumbai"
  //     },
  //     {
  //       "name": "SIDDHANT SHAH",
  //       "location": "mumbai"
  //     },
  //     {
  //       "name": "VIRAJ SHAH",
  //       "location": "mumbai"
  //     },
  //     {
  //       "name": "Prakash",
  //       "location": "mumbai"
  //     },
  //     {
  //       "name": "Ritesh",
  //       "location": "mumbai"
  //     },
  //     {
  //       "name": "KIRTI",
  //       "location": "mumbai"
  //     },
  //     {
  //       "name": "keval kevadiya",
  //       "location": "ny"
  //     },
  //     {
  //       "name": "SMITA MANVAL",
  //       "location": "mumbai"
  //     },
  //     {
  //       "name": "Ashvi",
  //       "location": "mumbai"
  //     },
  //     {
  //       "name": "FTP ",
  //       "location": "mumbai"
  //     },
  //     {
  //       "name": "RushabhSVC",
  //       "location": "mumbai"
  //     },
  //     {
  //       "name": "Utkarsh Shah",
  //       "location": "mumbai"
  //     },
  //     {
  //       "name": "Pankil Shah",
  //       "location": "mumbai"
  //     },
  //     {
  //       "name": "Rajeev Savani",
  //       "location": "mumbai"
  //     },
  //     {
  //       "name": "JIGNESH JARIWALA2",
  //       "location": "mumbai"
  //     },
  //     {
  //       "name": "Saaniya Shah",
  //       "location": "mumbai"
  //     },
  //     {
  //       "name": "DEEP SHAH",
  //       "location": "mumbai"
  //     },
  //     {
  //       "name": "Smart I Regestration",
  //       "location": "mumbai"
  //     },
  //     {
  //       "name": "ASPECO BELGIUM NV SVC",
  //       "location": "mumbai"
  //     },
  //     {
  //       "name": "ASPECO HK SVC",
  //       "location": "mumbai"
  //     },
  //     {
  //       "name": "ASPECO DMCC SVC",
  //       "location": "mumbai"
  //     },
  //     {
  //       "name": "Mansukh Nakum",
  //       "location": "ny"
  //     },
  //     {
  //       "name": "PRAMOD SAKPAL",
  //       "location": "mumbai"
  //     },
  //     {
  //       "name": "KGS SVC",
  //       "location": "mumbai"
  //     },
  //     {
  //       "name": "Nishidh Botadra",
  //       "location": "mumbai"
  //     }
  //   ]
  showImage: boolean;
  selectedDistributor;
  selectedSalesPerson: any;
  distributorSalesperson;
  @Input() Mobile: any = '';
  @Input() pinBox: boolean = false;
  @Input() formType: any;
  @Input() quickBuyVerify: boolean = false;
  public pincode = '';
  public showPinCode = false;
  public distributioncenter;
  public salesPerson;
  public checkoutAsGuest = false;
  public loginVia: any;
  public email: any;
  public emailMobile: any;
  public onMobile: any;
  public OTP1: number;
  public OTP2: number;
  public OTP3: number;
  public OTP4: number;
  public OTP5: number;
  public OTP6: number;
  public OTP7: number;
  emailError = '';
  public phoneNumber: string = '';
  public userExist = false;
  public password: any;
  public verifyNumber = false;
  public newPassword: any;
  public verifyPassword: any;
  public sessionID: any;
  public to: any;
  public fromForgetPWD = false;
  public forgetPWD = false;
  public mobileError = false;
  public nameError = false;
  public emailInError = false;
  public pwdError = false;
  public validPwdError = false;
  public distErr = false;
  public salesPersonErr = false;
  public view: any;
  public allViewActions: any = this._companyService.allActions;
  public updatePassword = false;
  public buttonDisabled = false;
  public forgotButtonDisabled = false;
  public pageData: any;
  public showHeaderOnHomePage = true;
  public showLoginAsGuest = false;
  public companyName: any;
  public isLoginForm: boolean = true;
  public name;
  public checkoutAsGuestEnable = false;
  public checkoutAsGuestWithoutOTPEnable = false;
  public hideCreateAccount = true;
  public pincodeInSignInProcess = false;

  public welcomeText = 'Please Login';
  public getOTPCallEnable = false;
  public showLogin = false;
  public hideLogoOnSignup: boolean = false;
  public innerWidth: any;
  public mobileView: boolean = false;
  public token = '';
  public intNumber;
  public inView: string = '';
  public preInView: string = '';
  showPlaceholder: boolean = true;
  showPlaceholderForSales: boolean = true;

  @HostListener('document: keydown', ['$event'])
  onAddItem(event: any) {
    if (event.key === 'Enter' && !this.isLoginForm) {
      this.signUpContinue(false);
    }

    if (event.key === 'Enter' && this.isLoginForm && !this.userExist) {
      this.signIn(false);
    }

    if (
      event.key === 'Enter' &&
      this.isLoginForm &&
      !this.checkoutAsGuest &&
      this.userExist &&
      !this.forgetPWD &&
      !this.fromForgetPWD
    ) {
      this.login();
    }

    if (event.key === 'Tab') {
      if (
        !!event?.srcElement?.form?.className.includes('mobileInput') &&
        !!this.Mobile
      ) {
        switch (this.inView) {
          case 'login-mb':
            this.login_password.setFocus();
            break;
          case 'create-account':
            this.ca_email.setFocus();
            break;
        }
      } else if (
        event?.srcElement?.parentNode?.id === 'login_email' &&
        !!this.email
      ) {
        this.login_password.setFocus();
      }
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
    if (this.innerWidth <= 500) {
      this.mobileView = true;
    } else if (this.innerWidth > 500) {
      this.mobileView = false;
    }
  }
  constructor(
    public theme: ThemeService,
    public _companyService: CompanyService,
    public _headerFooterService: HeaderFooterService,
    public _LOGGEDINService: LOGGEDINService,
    private route: ActivatedRoute,
    private router: Router,
    public storage: Storage,
    public platform: Platform,
    public databaseServiceService: DatabaseServiceService,
    public _configService: ConfigServiceService,
    public navCtrl: NavController,
    private changeRef: ChangeDetectorRef,
    private modalCtrl: ModalController,
    public analyticsService: AnalyticsService
  ) {
    this.loginVia = 'mb';
    this.route.queryParams.subscribe((params) => {
      if (params && params['to']) {
        this.to = params['to'];
      }
      if (params && params['view']) {
        this.view = params['view'];
      }
      if (params && params['showLogin']) {
        this.showLogin = params['showLogin'];
        this.isLoginForm = this.showLogin;
      }
    });
    this.platform.ready().then(() => {
      // console.log("this.platform", this.platform);
      if (this.platform.is('desktop') || this.platform.is('mobileweb')) {
        this.onMobile = false;
      } else {
        this.onMobile = true;
      }
      // console.log("this.onMobile", this.onMobile);
    });

    let input = document.getElementById('signupBtn');
    if (!!input) {
      input.addEventListener('keypress', function (event) {
        // If the user presses the "Enter" key on the keyboard
        if (event.key === 'Enter') {
          // Cancel the default action, if needed
          event.preventDefault();
          // Trigger the button element with a click
          document.getElementById('myBtn').click();
        }
      });
    }

    if (
      this._companyService.companyObj &&
      this._companyService.companyObj.config
    ) {
      let companyJson = this._companyService.companyObj.config;
      if (!!companyJson) {
        this.hideLogoOnSignup = companyJson?.hideLogoOnSignup;

        // this.getSalesPersonAndDistributor();

        this.showLoginAsGuest = companyJson.showLoginAsGuest;
        this.checkoutAsGuestEnable = this.showLogin
          ? false
          : companyJson.checkoutAsGuestEnable;
        this.checkoutAsGuestWithoutOTPEnable =
          companyJson.checkoutAsGuestWithoutOTPEnable;
        if (!this.showLogin && companyJson.checkoutAsGuestDefault) {
          this.checkoutAsGuestFun1();
        }

        if (typeof companyJson.pincodeInSignInProcess != 'undefined') {
          this.pincodeInSignInProcess = companyJson.pincodeInSignInProcess;
        }
        if (typeof companyJson.AudioConfig != 'undefined') {
          this.getOTPCallEnable = companyJson.AudioConfig;
        }
        if (typeof companyJson.hideCreateAccount != 'undefined') {
          this.hideCreateAccount = companyJson.hideCreateAccount;
        } else this.hideCreateAccount = false;
      }
    }
  }

  async ngOnInit() {
    this.theme.themeBoolean$.subscribe((value: boolean) => {
      this.showImage = value;
    });
    this.innerWidth = window.innerWidth;
    if (this.innerWidth <= 500) {
      this.mobileView = true;
    } else if (this.innerWidth > 500) {
      this.mobileView = false;
    }
    this.companyName = this._companyService.companyObj.name;
    this.changeTab();
  }

  getSalesPersonAndDistributor() {
    this.databaseServiceService.getSalesPersonsList().then((res: any) => {
      //this.salesPerson = res.data;
      let locationsArray = [];
      //let defaultValue.split()
      let defaultLocations = defaultValue.location.map((x) => {
        let val = x.value.split(',');
        console.log(val);
        for (let l in val) {
          let v = val[l];
          let obj = {
            ...x,
            value: v,
          };
          locationsArray.push(obj);
        }
      });
      console.log(locationsArray);
      console.log(this.salesPerson);

      this.salesPersons = [...res.data].map((y) => {
        console.log(y);
        let lData = locationsArray.find((x) => x.value == y.location)['label'];
        let flagClass = this.flags.find((x) => x.location == lData)[
          'flagClass'
        ];

        return {
          ...y,
          location: lData,
          flagClass: this.flags.find((x) => x.location == lData)['flagClass'],
        };
      });

      this.databaseServiceService.getDistributors().then((resDist) => {
        this.distributioncenters = resDist.data;
        //this.distributioncenterSelected(this.distributioncenters[0].companyName)
        //this.selectedDistributor = this.distributioncenters[0]
      });
    });
  }

  getStoredIdNPassword() {
    setTimeout(async () => {
      if (this.loginVia == 'mb') {
        let mobile = await this.storage.get('remMobile');
        let password = await this.storage.get('remMobilePassword');
        this.Mobile = mobile;
        if (mobile) {
          this.password = password;
        }
        if (this.Mobile && this.password) {
          this.userExist = true;
        }
      } else if (this.loginVia == 'em') {
        let email = await this.storage.get('remEmail');
        let password = await this.storage.get('remEmailPassword');
        this.email = email;
        if (this.email) {
          this.password = password;
          this.userExist = true;
        }
        if (this.Mobile && this.password) {
          this.userExist = true;
        }
      }
    }, 500);
  }

  async changeTab() {
    this.userExist = false;
    this.verifyNumber = false;
    this.buttonDisabled = false;
    this.password = '';

    this.clearOTP();
    this.pinBox = false;
    this.checkoutAsGuest = false;
    this.welcomeText = 'Please Login';
    this.isLoginForm = true;
    this.fromForgetPWD = false;
    //let mobile = await this.storage.get("remMobile");

    if (this.loginVia === 'mb') {
      this.inView = 'login-mb';
    } else if (this.loginVia === 'em') {
      this.inView = 'login-em';
    }

    this.getStoredIdNPassword();

    // setTimeout(async () => {
    //   if (this.loginVia == 'mb') {
    //     let mobile = await this.storage.get('remMobile');
    //     let password = await this.storage.get('remMobilePassword');
    //     this.Mobile = mobile;
    //     if (mobile) {
    //       this.password = password;
    //     }
    //     if (this.Mobile && this.password) {
    //       this.userExist = true;
    //     }
    //   } else if (this.loginVia == 'em') {
    //     let email = await this.storage.get('remEmail');
    //     let password = await this.storage.get('remEmailPassword');
    //     this.email = email;
    //     if (this.email) {
    //       this.password = password;
    //     }
    //     if (this.Mobile && this.password) {
    //       this.userExist = true;
    //     }
    //   }
    // }, 500);
  }

  async cancelForgetPWD() {
    this.pincode = '';
    this.showPinCode = false;
    this.userExist = false;
    this.verifyNumber = false;
    this.buttonDisabled = false;
    this.password = '';
    this.clearOTP();
    this.pinBox = false;
    this.checkoutAsGuest = false;
    this.welcomeText = 'Please Login';
    this.isLoginForm = true;
    this.fromForgetPWD = false;
  }

  moveFocus(event, forwordInput, backwordInput) {
    // console.log(event, forwordInput, backwordInput);
    if (event.key === 'Backspace' && !!backwordInput) {
      backwordInput.setFocus();
    } else if (event.key !== 'Backspace' && !!forwordInput) {
      forwordInput.setFocus();
    }

    if (
      !!this.OTP1 &&
      !!this.OTP2 &&
      !!this.OTP3 &&
      !!this.OTP4 &&
      !!this.OTP5 &&
      !!this.OTP6
    ) {
      this.btnDisabled = false;
    } else {
      this.btnDisabled = true;
    }
  }

  clearOTP() {
    this.OTP1 = null;
    this.OTP2 = null;
    this.OTP3 = null;
    this.OTP4 = null;
    this.OTP5 = null;
    this.OTP6 = null;
  }

  async loginAsGuest() {
    // let cssClass = "square-modal"
    // if (this.mobileView) {
    //   cssClass = 'mobile-guest-modal'
    // }
    // let productDetailsModal = await this.modalCtrl.create({
    //   component: GuestLoginPage,
    //   componentProps: {
    //     userId: "",
    //     formType: this.formType
    //   },
    //   cssClass: cssClass,
    //   showBackdrop: true
    // });
    // productDetailsModal.present();
    // productDetailsModal.onDidDismiss().then(data => { });

    this.router.navigateByUrl('/diamond-search');
  }

  async loginAfterPWDReset() {
    this.sessionID = await this.storage.get('sessionID');
    if (this.Mobile.internationalNumber) {
      this.Mobile = this.Mobile.internationalNumber.replace(/[\W_]/g, '');
      this.Mobile = this.Mobile.toString().replace('+', '');
    }
    this._configService.userNumber = this.Mobile.toString();
    let mobileNo = this._configService.userNumber;
    await this.databaseServiceService.showLoading();
    let response = await this.databaseServiceService.userLoginForDesktop(
      mobileNo,
      this.password
    );

    await this.databaseServiceService.hideLoading();
    if (response.isSuccess) {
      // console.log("this._configService.userNumber", this._configService.userNumber, response.data);
      // await this.storage.set('remEmail', '');
      await this.storage.set('userData', response.data);
      // await this.storage.set('isEventPopup', true);

      await this.storage.set('loggedInUser', this._configService.userNumber);
      let manageCustomers = false;
      let manageCustomerTag = response.data.tags.filter(
        (a) => a.name == 'Manage Customers'
      );
      if (!!manageCustomerTag && manageCustomerTag.length > 0)
        manageCustomers = true;
      await this.storage.set('manageCustomers', manageCustomers);

      await this.storage.set('userID', response.data.id);
      if (response.data.userType == null) {
        await this.storage.set('userType', 'User');
      } else {
        await this.storage.set('userType', response.data.userType);
      }
      await this.storage.set('pincode', response.data.pincode);
      await this.storage.set(
        this._configService.TOKEN_KEY,
        response.data.token
      );
      // (window as any).fcWidget.setExternalId(response.data.id);
      // // To set user name
      // (window as any).fcWidget.user.setFirstName(response.data.name);
      // // To set user email
      // (window as any).fcWidget.user.setEmail(response.data.email);
      // // To set user properties
      // (window as any).fcWidget.user.setProperties({
      //   phone: response.data.username,
      //   status: "Active" // meta property 2
      // });
      // console.log("sessionID", this.sessionID);
      let cartRes = await this.databaseServiceService.setCartForCustomer(
        response.data.id,
        this.sessionID
      );
      // console.log("user is", this._configService.userNumber);

      // window["heap"].identify(this._configService.userNumber);
      // window["heap"].addUserProperties({ appName: this._configService.appName });

      let sharedByUserId = await this.storage.get('sharedBy');
      // console.log(sharedByUserId);
      if (sharedByUserId != null) {
        let loggedinUserData =
          await this._headerFooterService.fetchUserProfileDetails(
            response.data.id
          );
        let loggeinCustomerId = loggedinUserData.data.refCustomerId;

        let sharedUserData =
          await this._headerFooterService.fetchUserProfileDetails(
            sharedByUserId
          );
        let sharedCustomerId = sharedUserData.data.refCustomerId;

        let res1 = await this.databaseServiceService.setParentCustomer(
          this.databaseServiceService.refCompanyId,
          parseInt(loggeinCustomerId),
          parseInt(sharedCustomerId)
        );
        if (res1) {
          let resp = res1;
          this.storage.remove('sharedBy');
        }
      }
      this.analyticsService.identify(response.data.username);
      this.analyticsService.setUserProfile({
        mobile: response.data.username || 'no mobile',
        email: response.data.email || 'no email',
        username: response.data.name || 'no username',
        name: response.data.name || 'no username',
      });

      this._LOGGEDINService.observables.next('loggedIn');
      await this.insertLoginView();
      if (!!this.view && !!this.to) {
        let navigationExtras: NavigationExtras = {
          queryParams: {
            to: this.to,
            view: this.view,
          },
          replaceUrl: true,
        };
        this.router.navigate([this.to], navigationExtras);
      } else {
        let stoneName = await this.storage.get('deeplink-stoneName');
        let refKgCompanyId = await this.storage.get('deeplink-location');
        if (stoneName && refKgCompanyId) {
          this.router.navigate([
            '/products/' + stoneName + '/' + stoneName + '/' + refKgCompanyId,
          ]);
        } else if (!!this.to) {
          //this.navCtrl.navigateRoot([this.to]);
          this.router.navigate([this.to], { replaceUrl: true });
        } else {
          let redirectTo = '/home';
          if (this._companyService.companyObj.config) {
            let companyJson = this._companyService.companyObj.config;
            if (!!companyJson) {
              if (!!companyJson.redirectAfterLogin) {
                redirectTo = companyJson.redirectAfterLogin;
              }
            }
          }
          this.router.navigate([redirectTo], { replaceUrl: true });
          //this.router.navigateByUrl(redirectTo);
        }
      }
    }
  }

  async updatePwd() {
    this.buttonDisabled = true;
    this.sessionID = await this.storage.get('sessionID');
    // console.log(this.Mobile, this.password, this.verifyPassword);
    if (this.newPassword && this.verifyPassword) {
      if (this.newPassword != this.verifyPassword) {
        this.buttonDisabled = false;
        this._configService.presentToast(
          'Your password did not match',
          'error'
        );
      } else {
        if (this.newPassword.length <= 5) {
          this.buttonDisabled = false;
          this._configService.presentToast(
            'Password length must be greater than 5 characters',
            'error'
          );
        } else {
          if (this.Mobile.internationalNumber) {
            this.Mobile = this.Mobile.internationalNumber.replace(/[\W_]/g, '');
            this.Mobile = this.Mobile.toString().replace('+', '');
          }
          let response = await this.databaseServiceService.updatePassword(
            this.Mobile.toString(),
            this.newPassword
          );
          this.buttonDisabled = false;
          let temp = this.loginAfterPWDReset();
        }
      }
    } else {
      this.buttonDisabled = false;
      this._configService.presentToast('Enter all details', 'error');
    }
  }

  async createUser() {
    this.buttonDisabled = true;
    this.sessionID = await this.storage.get('sessionID');
    // console.log(this.Mobile, this.password, this.verifyPassword);
    if (this.newPassword && this.verifyPassword) {
      if (this.newPassword != this.verifyPassword) {
        this.buttonDisabled = false;
        this._configService.presentToast(
          'Your password did not match',
          'error'
        );
      } else {
        if (this.newPassword.length <= 5) {
          this.buttonDisabled = false;
          this._configService.presentToast(
            'Password length must be greater than 5 characters',
            'error'
          );
        } else {
          if (this.Mobile.internationalNumber) {
            this.Mobile = this.Mobile.internationalNumber.replace(/[\W_]/g, '');
            this.Mobile = this.Mobile.toString().replace('+', '');
          }
          let res: any = await this.databaseServiceService.createUser(
            parseInt(this.Mobile.toString()),
            this.newPassword,
            false
          );
          if (res.isSuccess) {
            this.buttonDisabled = false;
            this._configService.presentToast(
              'Your account is created successfully',
              'success'
            );
            await this.storage.set('loggedInUser', res.data.username);
            await this.storage.set('mobile', res.data.username);
            await this.storage.set('pwd', this.newPassword);
            await this.storage.set('userData', res.data);
            // await this.storage.set('isEventPopup', true);
            await this.storage.set('userID', res.data.id);
            await this.storage.set(
              this._configService.TOKEN_KEY,
              res.data.token
            );
            await this.storage.set('userType', res.data.userType);

            // console.log("userId", res.data.id);
            // console.log("sessionID", this.sessionID);
            this._configService.presentToast('Login successful', 'success');
            let cartRes = await this.databaseServiceService.setCartForCustomer(
              res.data.id,
              this.sessionID
            );
            // console.log("cartRes ", cartRes);

            // console.log("talkBriteAccessToken", res.data.token);
            // console.log("userType", res.data.userType);
            this.analyticsService.identify(res.data.username);
            this.analyticsService.setUserProfile({
              mobile: res.data.username || 'no mobile',
              email: res.data.email || 'no email',
              username: res.data.name || 'no username',
              name: res.data.name || 'no username',
            });

            this._LOGGEDINService.observables.next('loggedIn');
            // let resCreateInquiry: any = await this.databaseServiceService.createInquiry(
            //   {
            //     refUserId: res.data.id
            //   },
            //   "Login"
            // );
            await this.insertLoginView();
            if (!!this.view && !!this.to) {
              let navigationExtras: NavigationExtras = {
                queryParams: {
                  to: this.to,
                  view: this.view,
                },
                replaceUrl: true,
              };
              this.router.navigate([this.to], navigationExtras);
            } else {
              let stoneName = await this.storage.get('deeplink-stoneName');
              let refKgCompanyId = await this.storage.get('deeplink-location');
              if (stoneName && refKgCompanyId) {
                this.router.navigate([
                  '/products/' +
                    stoneName +
                    '/' +
                    stoneName +
                    '/' +
                    refKgCompanyId,
                ]);
              } else if (!!this.to) {
                this.router.navigate([this.to], { replaceUrl: true });
              } else {
                let redirectTo = '/home';
                if (this._companyService.companyObj.config) {
                  let companyJson = this._companyService.companyObj.config;
                  if (!!companyJson) {
                    if (!!companyJson.redirectAfterLogin) {
                      redirectTo = companyJson.redirectAfterLogin;
                    }
                  }
                }
                this.router.navigate([redirectTo], { replaceUrl: true });
                // this.router.navigateByUrl(redirectTo);
              }
            }
          } else {
            this.buttonDisabled = false;
            this._configService.presentToast(res.error, 'error');
          }
        }
      }
    } else {
      this.buttonDisabled = false;
      this._configService.presentToast('Enter all details', 'error');
    }
  }

  async resendOtp() {
    if (this.Mobile.internationalNumber) {
      this.Mobile = this.Mobile.internationalNumber.replace(/[\W_]/g, '');
      this.Mobile = this.Mobile.toString().replace('+', '');
    }
    let loginWithApp = await this.databaseServiceService.LoginWithApp({
      //mobNumbers: this.countryCode + this.Mobile.toString(),
      mobNumbers: this.Mobile,
      email: this.email,
      password: this.password,
      name: this.name,
    });
    this.pinBox = true;
    if (loginWithApp == true) {
      this.btnDisabled = false;
      this._configService.presentToast(
        'Otp sent to given mobile number and email',
        'success'
      );
    }
  }

  async signIn(pinBox = false) {
    // console.log(this.Mobile);
    this.intNumber = this.Mobile;

    this.buttonDisabled = true;
    if (this.pinBox == false || pinBox) {
      let res: any;
      if (this.loginVia == 'mb') {
        if (!!!this.Mobile) {
          this._configService.presentToast('Enter mobile number', 'error');
          this.buttonDisabled = false;
          return;
        }
        // console.log(this.Mobile);
        if (
          this.Mobile.isoCode == 'in' &&
          this.Mobile.nationalNumber.length < 10
        ) {
          this._configService.presentToast(
            'Enter Valid mobile number',
            'error'
          );
          this.buttonDisabled = false;
          return;
        }
        if (this.Mobile.internationalNumber) {
          this.Mobile = this.Mobile.internationalNumber.replace(/[\W_]/g, '');
          this.Mobile = this.Mobile.toString().replace('+', '');
        }

        res = await this.databaseServiceService.checkUserExistByPhoneNo(
          this.Mobile
        );
      } else if (this.loginVia == 'em') {
        if (!!!this.email) {
          this._configService.presentToast('Enter email address', 'error');
          this.buttonDisabled = false;
          return;
        }
        res = await this.databaseServiceService.checkUserExistByEmail(
          this.email
        );
      }

      if (res.isSuccess) {
        if (this.loginVia == 'em') this.emailMobile = res.data.username;
        this.userExist = true;
        this.buttonDisabled = false;
      } else {
        if (
          res.error ==
          'Your account is deactivated. Kindly contact the administrator.'
        ) {
          this._configService.presentToast(res.error, 'error');
          this.buttonDisabled = false;
        } else {
          //user is not registered and not deactivated
          if (this.loginVia == 'em') {
            this._configService.presentToast(
              'This email id is not registered with us, kindly sign up using mobile number',
              'error'
            );
            this.analyticsService.addEvents('login error', {
              error:
                'This email id is not registered with us, kindly sign up using mobile number"',
              email: this.email,
              mobile_email: this.email,
            });
            this.buttonDisabled = false;
            this.loginVia = 'mb';
            this.email = '';
            return;
          }
          try {
            let sharedByUserId = await this.storage.get('sharedBy');
            let type = 'storefront';
            if (this.Mobile.internationalNumber) {
              this.Mobile = this.Mobile.internationalNumber.replace(
                /[\W_]/g,
                ''
              );
              this.Mobile = this.Mobile.toString().replace('+', '');
            }

            if (!!sharedByUserId && sharedByUserId.length > 0) {
              type = this.Mobile;
            }

            //check for pincode facility
            if (this.pincodeInSignInProcess && !this.showPinCode) {
              this.showPinCode = true;
              this.buttonDisabled = false;

              return;
            } else if (
              this.pincodeInSignInProcess &&
              this.showPinCode &&
              !this.pincode
            ) {
              this._configService.presentToast('Please Enter Pincode', 'error');
              this.buttonDisabled = false;
              return;
            } else if (
              (this.pincodeInSignInProcess &&
                this.showPinCode &&
                !!this.pincode) ||
              !this.pincodeInSignInProcess
            ) {
              if (this.Mobile.internationalNumber) {
                this.Mobile = this.Mobile.internationalNumber.replace(
                  /[\W_]/g,
                  ''
                );
                this.Mobile = this.Mobile.toString().replace('+', '');
              }
              this.buttonDisabled = false;
              console.log(this.Mobile);
              this._configService.presentToast(
                'This mobile number is not registered with us, Please create new account.',
                'error'
              );
              this.analyticsService.addEvents('sign in error', {
                error:
                  'This mobile number is not registered with us, Please create new account.',
                mobile: this.Mobile,
                mobile_email: this.Mobile,
              });
              this.Mobile = this.intNumber;
              this.createAccountClick();

              // let loginWithApp = await this.databaseServiceService.LoginWithApp({
              //   // mobNumbers: "91" + this.Mobile.toString(),
              //   mobNumbers: this.Mobile,
              //   email: this.email,
              //   password: this.password,
              //   name: this.name,
              //   pincode: this.pincode,
              //   type: type
              // });
              // if (loginWithApp.data == "New User") {
              //   if (this.Mobile.internationalNumber) {
              //     this.Mobile = this.Mobile.internationalNumber.replace(/[\W_]/g, "")
              //     this.Mobile = this.Mobile.toString().replace('+', '')
              //   }
              //   console.log(this.Mobile);
              //   //update password
              //   this.updatePassword = true;
              //   let sendOtp = await this.databaseServiceService.LoginWithApp({
              //     //mobNumbers: this.countryCode + this.Mobile.toString(),
              //     mobNumbers: this.Mobile,
              //     email: this.email,
              //     password: this.password,
              //     name: this.name,
              //     pincode: this.pincode,
              //     type: type
              //   });
              //   this.pincode = "";
              //   this.showPinCode = false;
              //   this.pinBox = true;
              //   this.buttonDisabled = false;
              //   if (sendOtp == true) {
              //     this._configService.presentToast("Otp sent to given mobile number and email", "success");
              //   }
              // } else {
              //   this.pincode = "";
              //   this.showPinCode = false;
              //   this.pinBox = true;
              //   this.buttonDisabled = false;
              // }
            }
          } catch (e) {
            this.pincode = '';
            this.showPinCode = false;
            this.pinBox = false;
            this.buttonDisabled = false;
            this.analyticsService.addEvents('sign in error', {
              error: e,
              mobile_email: this.email,
            });
            this._configService.presentToast(e, 'error');
          }
        }
      }
    } else {
      if (this.Mobile.internationalNumber) {
        this.Mobile = this.Mobile.internationalNumber.replace(/[\W_]/g, '');
        this.Mobile = this.Mobile.toString().replace('+', '');
      }
      if (
        !!this.OTP1 &&
        this.OTP2 &&
        this.OTP3 &&
        this.OTP4 &&
        this.OTP5 &&
        this.OTP6
      ) {
        try {
          let dataOTPConfirmation: any =
            await this.databaseServiceService.loginWithConfirmation({
              mobNumbers: this.Mobile.toString(),
              otp:
                this.OTP1 +
                this.OTP2 +
                this.OTP3 +
                this.OTP4 +
                this.OTP5 +
                this.OTP6,
            });
          this.buttonDisabled = false;
          //this.pinBox = false;
          if (dataOTPConfirmation.data) {
            this.pinBox = false;
            this.clearOTP();
            this.verifyNumber = true;
            this.changeRef.detectChanges();
          } else {
            this.pinBox = true;
            this._configService.presentToast(
              dataOTPConfirmation.error,
              'error'
            );
          }
        } catch (e) {
          this.pinBox = true;
          this.buttonDisabled = false;
          this._configService.presentToast(e, 'error');
        }
      } else {
        this._configService.presentToast('Please Enter OTP', 'error');
        this.buttonDisabled = false;
      }
    }
  }

  async forgotPassword() {
    this.forgotButtonDisabled = true;
    //this.Mobile = Mobile.toString().replace("+", "");
    // if (!!!Mobile) {
    //   this._configService.presentToast("Enter Mobile Number", "error");
    //   return;
    // }
    // let res = await this.databaseServiceService.checkUserExistByPhoneNo(Mobile.replace("+", ""));
    // // console.log("res ", res);
    // if (res.isSuccess && !!res.data) {
    //   this.userExist = true;
    //   this.fromForgetPWD = true;
    //   //this.pinBox = true;
    // } else {
    //   //system will never display this, as we enable forget password for registered users only
    //   this._configService.presentToast("Entered mobile number not registered, Please sign up", "error");
    // }
    try {
      let nmbr = '';
      if (
        !!this.Mobile &&
        this.Mobile?.isoCode == 'in' &&
        this.Mobile?.nationalNumber.length < 10
      ) {
        this._configService.presentToast('Enter Valid mobile number', 'error');
        this.buttonDisabled = false;
        return;
      }
      if (!!this.Mobile && this.Mobile?.internationalNumber) {
        this.Mobile = this.Mobile?.internationalNumber.replace(/[\W_]/g, '');
        this.Mobile = this.Mobile?.toString().replace('+', '');
      }

      let res = null;

      if (this.loginVia == 'mb') nmbr = this.Mobile.toString();
      else if (this.loginVia == 'em') {
        res = await this.databaseServiceService.checkUserExistByEmail(
          this.email
        );

        if (!!res.isSuccess) {
          this.emailMobile = res.data.username;
          nmbr = this.emailMobile;
        } else {
          this._configService.presentToast(
            'Email Does not Registerd With Us',
            'error'
          );
        }
        // nmbr = this.emailMobile;
      }

      let loginWithApp = await this.databaseServiceService.LoginWithApp({
        mobNumbers: nmbr,
        email: this.email,
        password: this.password,
        name: this.name,
      });
      this.pinBox = true;
      this.userExist = true;

      if (res !== null && !!!res.isSuccess) {
        this.pinBox = false;
        this.userExist = false;
      }

      if (loginWithApp == true) {
        this._configService.presentToast(
          'Otp sent to given mobile number and email',
          'success'
        );
      }
      this.fromForgetPWD = true;
      this.forgotButtonDisabled = false;
    } catch (e) {
      this.pinBox = false;
      this.forgotButtonDisabled = false;
      this._configService.presentToast(e, 'error');
    }
  }

  async verifyOtp() {
    try {
      let nmbr = '';
      if (
        this.Mobile &&
        this.Mobile?.isoCode == 'in' &&
        this.Mobile.nationalNumber.length < 10
      ) {
        this._configService.presentToast('Enter Valid mobile number', 'error');
        this.buttonDisabled = false;
        return;
      }
      if (this.Mobile && this.Mobile?.internationalNumber) {
        this.Mobile = this.Mobile.internationalNumber.replace(/[\W_]/g, '');
        this.Mobile = this.Mobile.toString().replace('+', '');
      }
      if (this.loginVia == 'mb') nmbr = this.Mobile.toString();
      else if (this.loginVia == 'em') nmbr = this.emailMobile;
      if (
        !!this.OTP1 &&
        this.OTP2 &&
        this.OTP3 &&
        this.OTP4 &&
        this.OTP5 &&
        this.OTP6
      ) {
        this.buttonDisabled = true;
        let dataOTPConfirmation: any =
          await this.databaseServiceService.loginWithConfirmation({
            mobNumbers: nmbr,
            otp:
              this.OTP1 +
              this.OTP2 +
              this.OTP3 +
              this.OTP4 +
              this.OTP5 +
              this.OTP6,
          });
        //this.pinBox = false;
        this.buttonDisabled = false;
        if (dataOTPConfirmation.data) {
          //this.router.navigate(["/change-password"]);
          //this.navCtrl.navigateForward(["/change-password/" + Mobile]);
          let navigationExtras: NavigationExtras = {
            queryParams: {
              Mobile: nmbr,
            },
          };
          this.router.navigate(['/change-password'], navigationExtras);
        } else {
          this.pinBox = true;
          this._configService.presentToast(dataOTPConfirmation.error, 'error');
        }
      } else {
        this._configService.presentToast('Please Enter OTP', 'error');
      }
    } catch (e) {
      this.pinBox = true;
      this.buttonDisabled = false;
      this._configService.presentToast(e, 'error');
    }
  }

  trackSignInEvent(user: any, userData: any) {
    const userDistributionCenter = userData.userAccount.distributioncenter;
    const userSalesPerson = userData.userAccount.salesperson;

    /* Mixpanel signIn event */
    this.analyticsService.addEvents('SignIn', {
      email: user.email || 'no email',
      name: user.name || 'no name',
      mobile: user.mobile || 'no mobile',
      mobile_email: user.email || 'no email',
      'Distribution Center': userDistributionCenter || {},
      'Sales Person': userSalesPerson || {},
    });
  }

  trackErrorSignInEvent(user: any) {
    /* Mixpanel signIn event */
    this.analyticsService.addEvents('SignIn Track-Error', {
      email: user.email || 'no email',
      name: user.name || 'no name',
      mobile: user.mobile || 'no mobile',
      mobile_email: user.email || 'no email',
    });
  }

  // For Event-Popup
  /*
  async check_isEventPopup() {
    let isEventPopup: boolean = false;
    isEventPopup = await this.storage.get('isEventPopup');

    if (!!isEventPopup) {
      setTimeout(() => {
        this.openEventPopup();
      }, 1000);
    }
  }

  async openEventPopup() {
    const eventModal = await this.modalCtrl.create({
      component: EventPopupComponent,
      cssClass: 'event-popup',
      componentProps: {},
    });

    eventModal.present();

    await this.storage.set('isEventPopup', false);
  }
  */

  async login() {
    this.buttonDisabled = true;
    this.sessionID = await this.storage.get('sessionID');
    let mobileNo: any;
    let user: { name: string; email: string; mobile: string };

    if (this.loginVia == 'mb') {
      if (
        this.Mobile.isoCode == 'in' &&
        this.Mobile.nationalNumber.length < 10
      ) {
        this._configService.presentToast('Enter Valid mobile number', 'error');
        this.buttonDisabled = false;
        return;
      }

      if (this.Mobile.internationalNumber) {
        this.intNumber = this.Mobile;
        /*BUG we are changing object(this.Mobile) to string that why during login mobile number changing*/

        // this.Mobile
        mobileNo = this.Mobile.internationalNumber;
        mobileNo = mobileNo.replace(/[\W_]/g, '').toString().replace('+', ''); // this.Mobile.internationalNumber.replace(/[\W_]/g, '');
        // this.Mobile = this.Mobile.toString().replace('+', '');
        mobileNo = mobileNo.toString();
      } else {
        mobileNo = this.Mobile.toString();
      }

      if (this.intNumber) {
        this.storage.remove('remMobile');
        this.storage.remove('remMobilePassword');
        this.storage.set('remMobile', this.intNumber);
        this.storage.set('remMobilePassword', this.password);
        this.storage.set('remEmail', '');
        this.storage.set('remEmailPassword', '');
      }

      const res = await this.databaseServiceService.checkUserExistByPhoneNo(
        mobileNo
      );

      user = { name: res.data.name, email: res.data.email, mobile: mobileNo };

      this._configService.userNumber = mobileNo; // this.Mobile.toString();
      this.analyticsService.identify(mobileNo); //this.Mobile
      if (!!mobileNo && !!user.email) {
        this.analyticsService.setUserProfile({
          mobile: mobileNo || 'no mobile',
          email: user.email || 'no email',
          username: user.name || 'no username',
          name: user.name || 'no username',
        });
      } //this.Mobile
      // this.analyticsService.addEvents('Sign in with Number', {
      //   mobile: mobileNo,
      //   mobile_email: mobileNo,
      // }); //this.Mobile
    } else if (this.loginVia == 'em') {
      this.storage.remove('remEmail');
      this.storage.remove('remEmailPassword');
      this.storage.set('remEmail', this.email);
      this.storage.set('remEmailPassword', this.password);
      this.storage.set('remMobile', '');
      this.storage.set('remMobilePassword', '');

      // this.analyticsService.addEvents('Sign in with Email', {
      //   email: this.email,
      //   mobile_email: this.email,
      // });
      const res = await this.databaseServiceService.checkUserExistByEmail(
        this.email
      );

      user = {
        name: res.data.name,
        email: this.email,
        mobile: res.data.username,
      };

      if (!!this.email && !!user.mobile) {
        this.analyticsService.identify(this.email);
        this.analyticsService.setUserProfile({
          email: this.email || 'no email',
          mobile: user.mobile || 'no mobile',
          username: user.name || 'no username',
          name: user.name || 'no username',
        });
      }

      if (
        res.error ==
        'Your account is deactivated. Kindly contact the administrator.'
      ) {
        this.analyticsService.identify(mobileNo); //this.Mobile
        this.analyticsService.setUserProfile({
          mobile: mobileNo || 'no mobile',
          email: user.email || 'no email',
          username: user.name || 'no username',
          name: user.name || 'no username',
        }); //this.Mobile
        this.analyticsService.addEvents('Sign in error', {
          error: 'Account is deactivated',
          mobile: mobileNo,
          email: this.email,
          mobile_email: this.email,
        }); //this.Mobile
        this.btnDisabled = false;
        this._configService.presentToast(res.error, 'error');
        return;
      }

      if (!!res.isSuccess) {
        this.emailMobile = res.data.username;
        mobileNo = this.emailMobile;
        this._configService.userNumber = this.emailMobile.replace('+', '');
      }
    }

    if (!this.isLoginForm && this.newPassword) {
      this.password = this.newPassword;
    }

    if (this.password) {
      //let mobileNo = this._configService.userNumber;
      await this.databaseServiceService.showLoading();

      let response = await this.databaseServiceService.userLoginForDesktop(
        mobileNo,
        this.password
      );

      if (!!response.data && !!response.data.parameter) {
        const userData = JSON.parse(response.data.parameter);

        if (this.loginVia === 'mb') {
          this.analyticsService
            .addEvents('Sign in with Number', {
              mobile: mobileNo,
              mobile_email: mobileNo,
            })
            .then((res: string) => {
              this.trackSignInEvent(user, userData);
            })
            .catch((err: any) => {
              this.trackErrorSignInEvent(user);
            });
        } else if (this.loginVia === 'em') {
          this.analyticsService
            .addEvents('Sign in with Email', {
              email: this.email,
              mobile_email: this.email,
            })
            .then((res: string) => {
              this.trackSignInEvent(user, userData);
            })
            .catch((err: any) => {
              this.trackErrorSignInEvent(user);
            });
        }
      }

      await this.databaseServiceService.hideLoading();

      if (response.isSuccess) {
        //this.buttonDisabled = false;
        // await this.storage.set('remEmail', '');
        this.storage.set('loggedInUser', this._configService.userNumber);

        let manageCustomers = false;
        let manageCustomerTag = response.data.tags.filter(
          (a) => a.name == 'Manage Customers'
        );
        if (!!manageCustomerTag && manageCustomerTag.length > 0)
          manageCustomers = true;
        this.storage.set('manageCustomers', manageCustomers);

        this.storage.set('userID', response.data.id);
        this.storage.set('userData', response.data);
        // await this.storage.set('isEventPopup', true);

        if (!!response.data?.KYCStatus && !!response.data?.kycSubmitted) {
          this.storage.set('distributorEmailSended', true);
        } else {
          this.storage.set('distributorEmailSended', false);
        }

        if (response.data.userType == null) {
          this.storage.set('userType', 'User');
        } else {
          this.storage.set('userType', response.data.userType);
        }

        this.storage.set('pincode', response.data.pincode);
        await this.storage.set(
          this._configService.TOKEN_KEY,
          response.data.token
        );

        this._LOGGEDINService.observables.next('loggedIn');

        if (!!this.view && !!this.to) {
          this.buttonDisabled = false;
          let navigationExtras: NavigationExtras = {
            queryParams: {
              to: this.to,
              view: this.view,
            },
            replaceUrl: true,
          };
          this.router.navigate([this.to], navigationExtras);
        } else {
          let stoneName = await this.storage.get('deeplink-stoneName');
          let refKgCompanyId = await this.storage.get('deeplink-location');

          if (stoneName && refKgCompanyId) {
            this.router.navigate([
              '/products/' + stoneName + '/' + stoneName + '/' + refKgCompanyId,
            ]);
          } else if (!!this.to) {
            this.buttonDisabled = false;
            this.router.navigate([this.to], { replaceUrl: true });
          } else {
            this.buttonDisabled = false;
            this._configService.presentToast('Login successful', 'success');
            // let resCreateInquiry: any = await this.databaseServiceService.createInquiry(
            //   {
            //     refUserId: response.data.id
            //   },
            //   "Login"
            // );
            let redirectTo = '/home';
            if (this._companyService.companyObj.config) {
              let companyJson = this._companyService.companyObj.config;
              if (!!companyJson) {
                if (!!companyJson.redirectAfterLogin) {
                  redirectTo = companyJson.redirectAfterLogin;
                }
              }
            }

            const currUrl = window.location.href;
            const distributionCity = JSON.parse(
              response?.data?.parameter
            )?.userAccount?.distributioncenter?.city?.toLowerCase();

            this.router.navigate([redirectTo], { replaceUrl: true });

            this.databaseServiceService
              .setCartForCustomer(response.data.id, this.sessionID)
              .then(async () => {
                let sharedByUserId = await this.storage.get('sharedBy');
                if (sharedByUserId != null) {
                  this._headerFooterService
                    .fetchUserProfileDetails(response.data.id)
                    .then((loggedinUserData) => {
                      let loggeinCustomerId =
                        loggedinUserData.data.refCustomerId;

                      this._headerFooterService
                        .fetchUserProfileDetails(sharedByUserId)
                        .then((sharedUserData) => {
                          let sharedCustomerId =
                            sharedUserData.data.refCustomerId;

                          this.databaseServiceService
                            .setParentCustomer(
                              this.databaseServiceService.refCompanyId,
                              parseInt(loggeinCustomerId),
                              parseInt(sharedCustomerId)
                            )
                            .then((res1) => {
                              if (res1) {
                                let resp = res1;
                                this.storage.remove('sharedBy');
                              }
                            });
                        });
                    });
                }
              });

            this.insertLoginView();

            // For Ebent-Popup
            /*
            if (
              !currUrl.toLowerCase().includes('aspecodiamonds') &&
              distributionCity === 'mumbai'
            ) {
              this.check_isEventPopup();
            }
            */
            //this.router.navigateByUrl(redirectTo);
          }
        }
      } else {
        this.buttonDisabled = false;

        if (
          response.error.code ==
          'Your account is deactivated. Kindly contact the administrator.'
        ) {
          this.analyticsService.identify(this.Mobile);
          this.analyticsService.setUserProfile({
            mobile: this.Mobile || 'no mobile',
            email: response.data.email || 'no email',
            username: user.name || 'no username',
            name: user.name || 'no username',
          });
          this.analyticsService.addEvents('Sign in error', {
            error: 'Account is deactivated',
            mobile: this.Mobile,
            email: this.email,
            mobile_email: this.email,
          });
          await this.databaseServiceService.hideLoading();
          this.btnDisabled = false;
          this._configService.presentToast(response.error, 'error');
        } else {
          this.analyticsService.identify(mobileNo); //this.Mobile
          this.analyticsService.setUserProfile({
            mobile: mobileNo || 'no mobile',
            email: response.data.email || 'no email',
            username: user.name || 'no username',
            name: user.name || 'no username',
          }); //this.Mobile
          this.analyticsService.addEvents('Sign in error', {
            error: 'Invalid login credentials',
            mobile: mobileNo,
            email: this.email,
            mobile_email: this.email,
          }); //this.Mobile

          this._configService.presentToast(
            'Invalid login credentials',
            'error'
          );
        }
      }
    } else {
      this.buttonDisabled = false;
      this._configService.presentToast('Please enter password', 'error');
      this.analyticsService.addEvents('Sign in error', {
        error: 'Wrong Password',
        mobile_email: this.loginVia === 'mb' ? mobileNo : this.email,
      });
    }
    // }
  }

  insertLoginView() {
    let loginAction = 6;
    if (!!this.allViewActions && !!this.allViewActions.login) {
      loginAction = this.allViewActions.login;
    }
    let jsonObj = {
      actionId: loginAction,
      refProductId: null,
    };

    this._companyService.insertView(jsonObj);
  }

  validMobile(valid, validValue) {
    if (!validValue) {
      return false;
    } else {
      return !!validValue.match(valid);
    }
  }

  async signUpContinue(pinBox = false) {
    this.btnDisabled = true;
    if (
      !this.Mobile ||
      !this.email ||
      !this.newPassword ||
      !this.name ||
      !this.verifyPassword ||
      !this.selectedDistributor ||
      !this.selectedSalesPerson
    ) {
      if (!this.Mobile) {
        this.mobileError = true;
      }
      if (!this.email) {
        this.emailInError = true;
      }
      if (!this.name) {
        this.nameError = true;
      }
      if (!this.newPassword) {
        this.pwdError = true;
      }
      if (!this.verifyPassword) {
        this.validPwdError = true;
      }

      if (!this.selectedDistributor) {
        this.distErr = true;
      }
      if (this.selectedSalesPerson) {
        this.salesPersonErr = true;
      }
      // this.btnDisabled = false;
      this._configService.presentToast('Please enter all inputs', 'error');
      return;
    }
    if (!this.isLoginForm && !this.selectedDistributor) {
      this.btnDisabled = false;
      this._configService.presentToast(
        'Please Select Distribution Center',
        'error'
      );
      return;
    }
    if (this.newPassword && this.verifyPassword) {
      this.btnDisabled = false;
      if (this.newPassword != this.verifyPassword) {
        this._configService.presentToast(
          'Your password did not match',
          'error'
        );
        return;
      }
    }

    if (this.pinBox == false || pinBox) {
      await this.databaseServiceService.showLoading();
      this.btnDisabled = true;
      if (
        this.Mobile.isoCode == 'in' &&
        this.Mobile.nationalNumber.length < 10
      ) {
        this._configService.presentToast('Enter Valid mobile number', 'error');
        this.buttonDisabled = false;
        await this.databaseServiceService.hideLoading();
        return;
      }
      if (this.Mobile.internationalNumber) {
        this.Mobile = this.Mobile.internationalNumber.replace(/[\W_]/g, '');
        this.Mobile = this.Mobile.toString().replace('+', '');
      }
      if (!this.name) {
        this._configService.presentToast('Invalid name', 'error');
      } else if (
        !this.validMobile(
          /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
          this.email
        )
      ) {
        this._configService.presentToast('Invalid email', 'error');
        await this.databaseServiceService.hideLoading();
        return;
      } else if (!this.newPassword) {
        this._configService.presentToast('Invalid password', 'error');
        await this.databaseServiceService.hideLoading();
        return;
      } else {
        if (this.Mobile.internationalNumber) {
          this.Mobile = this.Mobile.internationalNumber.replace(/[\W_]/g, '');
          this.Mobile = this.Mobile.toString().replace('+', '');
        }
        let res = await this.databaseServiceService.checkUserExistByPhoneNo(
          this.Mobile.toString()
        );
        let resEmail = await this.databaseServiceService.checkUserExistByEmail(
          this.email
        );

        if (res.isSuccess || resEmail.isSuccess) {
          await this.databaseServiceService.hideLoading();
          this.btnDisabled = false;
          this._configService.presentToast(
            'Account already registered.',
            'error'
          );
          this.isLoginForm = true;
        } else {
          if (
            res.error ==
            'Your account is deactivated. Kindly contact the administrator.'
          ) {
            await this.databaseServiceService.hideLoading();
            this.btnDisabled = false;
            this._configService.presentToast(res.error, 'error');
          } else {
            try {
              if (this.Mobile.internationalNumber) {
                this.Mobile = this.Mobile.internationalNumber.replace(
                  /[\W_]/g,
                  ''
                );
                this.Mobile = this.Mobile.toString().replace('+', '');
              }
              let loginWithApp = await this.databaseServiceService.LoginWithApp(
                {
                  mobNumbers: this.Mobile.toString(),
                  email: this.email,
                  password: this.newPassword,
                  name: this.name,
                  distributioncenter: this.selectedDistributor || {},
                  salesPerson: this.selectedSalesPerson || {},
                }
              );
              if (loginWithApp.data == 'New User') {
                //update password
                this.updatePassword = true;
                if (this.Mobile.internationalNumber) {
                  this.Mobile = this.Mobile.internationalNumber.replace(
                    /[\W_]/g,
                    ''
                  );
                  this.Mobile = this.Mobile.toString().replace('+', '');
                }
                let sendOtp = await this.databaseServiceService.LoginWithApp({
                  mobNumbers: this.Mobile.toString(),
                  email: this.email,
                  password: this.newPassword,
                  name: this.name,
                  distributioncenter: this.selectedDistributor || {},
                  salesPerson: this.selectedSalesPerson || {},
                });
                await this.databaseServiceService.hideLoading();
                this.btnDisabled = false;
                this.pinBox = true;
                this.btnDisabled = true;
                this.buttonDisabled = false;

                if (sendOtp == true) {
                  this.analyticsService.identify(this.Mobile.toString());
                  this.analyticsService.setUserProfile({
                    mobile: this.Mobile.toString() || 'no mobile',
                    email: this.email || 'no email',
                    username: this.name || 'no username',
                    name: this.name || 'no username',
                  });

                  this.analyticsService.addEvents('New sign up otp send', {
                    mobNumbers: this.Mobile.toString(),
                    email: this.email,
                    password: this.newPassword,
                    name: this.name,
                    mobile_email: this.email,
                    distributioncenter: this.selectedDistributor || {},
                    salesPerson: this.selectedSalesPerson || {},
                  });
                  this._configService.presentToast(
                    'Otp sent to given mobile number and email',
                    'success'
                  );
                }
              } else {
                this.pinBox = true;
                this.btnDisabled = true;
                this.buttonDisabled = false;
              }
            } catch (e) {
              this.pinBox = false;
              this.buttonDisabled = false;
              this.analyticsService.addEvents('sign up error', {
                mobNumbers: this.Mobile.toString(),
                email: this.email,
                mobile_email: this.email,
              });
              this._configService.presentToast(e, 'error');
            }
          }
        }
      }
    } else {
      this.btnDisabled = true;
      await this.databaseServiceService.showLoading();
      try {
        let dataOTPConfirmation: any =
          await this.databaseServiceService.loginWithConfirmation({
            mobNumbers: this.Mobile.toString(),
            otp:
              this.OTP1 +
              this.OTP2 +
              this.OTP3 +
              this.OTP4 +
              this.OTP5 +
              this.OTP6,
          });
        await this.databaseServiceService.hideLoading();
        this.buttonDisabled = false;
        //this.pinBox = false;
        if (dataOTPConfirmation.data) {
          this.pinBox = false;
          this.clearOTP();
          this.verifyNumber = true;
          this.changeRef.detectChanges();
          this.login();
        } else {
          this.pinBox = true;
          this.analyticsService.addEvents('sign up error', {
            error: dataOTPConfirmation.error,
            mobNumbers: this.Mobile.toString(),
            email: this.email,
            mobile_email: this.email,
          });
          this._configService.presentToast(dataOTPConfirmation.error, 'error');
        }
      } catch (e) {
        this.pinBox = true;
        this.buttonDisabled = false;
        this._configService.presentToast(e, 'error');
        await this.databaseServiceService.hideLoading();
      }
    }
  }

  async createAccountClick() {
    if (!this.salesPersons.length) {
      const companyJson = this._companyService.companyObj.config;
      if (!!companyJson) this.getSalesPersonAndDistributor();
    }
    this.clearOTP();
    this.pinBox = false;
    this.isLoginForm = false;
    this.verifyNumber = false;
    this.userExist = false;
    this.fromForgetPWD = false;
    this.showPinCode = false;
    this.pincode = '';
    this.btnDisabled = true;
    this.preInView = this.inView;
    this.inView = 'create-account';
    this.name = '';
    this.Mobile = '';
    this.email = '';
    this.newPassword = '';
    this.verifyPassword = '';
    this.selectedDistributor = [];
    this.selectedSalesPerson = [];
  }

  noSignUpErrors() {
    this.emailError = '';
    this.emailInError = false;
    this.nameError = false;
    this.mobileError = false;
    this.pwdError = false;
    this.validPwdError = false;
    this.distErr = false;
    this.salesPersonErr = false;
  }

  async backToLoginPage() {
    this.isLoginForm = true;
    this.verifyNumber = false;
    this.userExist = false;

    this.name = '';
    this.Mobile = '';
    this.email = '';
    this.pinBox = false;
    this.clearOTP();
    this.fromForgetPWD = false;
    this.showPinCode = false;
    this.pincode = '';

    this.inView = this.preInView;

    this.noSignUpErrors();
    this.getStoredIdNPassword();
  }

  async checkoutAsGuestFun() {
    if (this.Mobile.internationalNumber) {
      this.Mobile = this.Mobile.internationalNumber.replace(/[\W_]/g, '');
      this.Mobile = this.Mobile.toString().replace('+', '');
    }
    if (this.Mobile && this.Mobile != '+91') {
      if (this.checkoutAsGuestEnable) {
        this.analyticsService.addEvents('check out as guest', {
          mobile: this.Mobile,
          mobile_email: this.Mobile,
        });
        this.checkoutAsGuest = true;
        if (this.Mobile.internationalNumber) {
          this.Mobile = this.Mobile.internationalNumber.replace(/[\W_]/g, '');
          this.Mobile = this.Mobile.toString().replace('+', '');
        }
        let loginWithApp = await this.databaseServiceService.LoginWithApp({
          mobNumbers: this.Mobile.toString(),
          email: this.email,
          password: this.password,
          name: this.name,
        });

        if (loginWithApp == true) {
          // || loginWithApp.isSuccess == true)
          this._configService.presentToast(
            'Otp sent to given mobile number and email',
            'success'
          );
          this.pinBox = true;
        } else if (loginWithApp.data == 'New User') {
          //update password
          if (this.Mobile.internationalNumber) {
            this.Mobile = this.Mobile.internationalNumber.replace(/[\W_]/g, '');
            this.Mobile = this.Mobile.toString().replace('+', '');
          }
          let sendOtp = await this.databaseServiceService.LoginWithApp({
            mobNumbers: this.Mobile.toString(),
            email: this.email,
            password: this.password,
            name: this.name,
          });
          if (sendOtp == true) {
            this._configService.presentToast(
              'Otp sent to given mobile number and email',
              'success'
            );
            this.pinBox = true;
          } else {
            this._configService.presentToast('Some Error Occur', 'error');
          }
        }
      } else if (this.checkoutAsGuestWithoutOTPEnable) {
        //direct login without OTP
        if (this.Mobile.internationalNumber) {
          this.Mobile = this.Mobile.internationalNumber.replace(/[\W_]/g, '');
          this.Mobile = this.Mobile.toString().replace('+', '');
        }
        let res1: any =
          await this.databaseServiceService.checkUserExistByPhoneNo(
            this.Mobile.toString()
          );
        if (res1.isSuccess) {
          if (
            res1.error ==
            'Your account is deactivated. Kindly contact the administrator.'
          ) {
            this._configService.presentToast(res1.error, 'error');
          } else {
            // if (!!res1.data && (res1.data.isGuest == null || res1.data.isGuest == undefined)) {
            //   this._configService.presentToast("This number is already registered, please try login", "error");
            // } else {
            if (!!res1.data) {
              res1.data.isGuest = 1;
            }
            await this.loginAndRedirect(res1);
            // }
          }
        } else if (
          !res1.isSuccess &&
          res1.error ==
            'Your account is deactivated. Kindly contact the administrator.'
        ) {
          this._configService.presentToast(
            'Your account is deactivated. Kindly contact the administrator.',
            'error'
          );
        } else {
          //create user with mobile number
          if (this.Mobile.internationalNumber) {
            this.Mobile = this.Mobile.internationalNumber.replace(/[\W_]/g, '');
            this.Mobile = this.Mobile.toString().replace('+', '');
          }
          let res = await this.databaseServiceService.createUser(
            parseInt(this.Mobile.toString()),
            this.Mobile.toString().replace('+', ''),
            true
          );
          let res2 = await this.databaseServiceService.checkUserExistByPhoneNo(
            this.Mobile.toString()
          );
          if (res2.isSuccess) {
            await this.loginAndRedirect(res2);
          }
        }
      }
    } else {
      this._configService.presentToast('Please Enter Mobile number', 'error');
    }
  }

  async loginAndRedirect(response) {
    console.log('hi');
    this.sessionID = await this.storage.get('sessionID');
    if (this.Mobile.internationalNumber) {
      this.Mobile = this.Mobile.internationalNumber.replace(/[\W_]/g, '');
      this.Mobile = this.Mobile.toString().replace('+', '');
    }
    this._configService.userNumber = this.Mobile.toString();

    await this.storage.set('userData', response.data);
    // await this.storage.set('isEventPopup', true);

    await this.storage.set('loggedInUser', this._configService.userNumber);
    await this.storage.set('userID', response.data.id);
    if (response.data.userType == null) {
      await this.storage.set('userType', 'User');
    } else {
      await this.storage.set('userType', response.data.userType);
    }

    await this.storage.set(
      this._configService.TOKEN_KEY,
      response.data.accessToken
    );

    // console.log("sessionID", this.sessionID);
    let cartRes = await this.databaseServiceService.setCartForCustomer(
      response.data.id,
      this.sessionID
    );
    // console.log("user is", this._configService.userNumber);

    // window["heap"].identify(this._configService.userNumber);
    // window["heap"].addUserProperties({ appName: this._configService.appName });
    this.analyticsService.identify(response.data.username);
    this.analyticsService.setUserProfile({
      mobile: response.data.username || 'no mobile',
      email: response.data.email || 'no email',
      username: response.data.name || 'no username',
      name: response.data.name || 'no username',
    });
    this._LOGGEDINService.observables.next('loggedIn');
    await this.insertLoginView();
    if (!!this.view && !!this.to) {
      let navigationExtras: NavigationExtras = {
        queryParams: {
          to: this.to,
          view: this.view,
        },
        replaceUrl: true,
      };
      this.router.navigate([this.to], navigationExtras);
    } else {
      let stoneName = await this.storage.get('deeplink-stoneName');
      let refKgCompanyId = await this.storage.get('deeplink-location');
      if (stoneName && refKgCompanyId) {
        this.router.navigate([
          '/products/' + stoneName + '/' + stoneName + '/' + refKgCompanyId,
        ]);
      } else if (!!this.to) {
        this.navCtrl.navigateForward([this.to], { replaceUrl: true });
      } else {
        let redirectTo = '/home';
        if (this._companyService.companyObj.config) {
          let companyJson = this._companyService.companyObj.config;
          if (!!companyJson) {
            if (!!companyJson.redirectAfterLogin) {
              redirectTo = companyJson.redirectAfterLogin;
            }
          }
        }
        this.router.navigate([redirectTo], { replaceUrl: true });
        //this.router.navigateByUrl(redirectTo);
      }
    }
  }

  async checkoutAsGuestFun1() {
    this.welcomeText = 'Checkout as Guest';
    this.checkoutAsGuest = true;
    this.loginVia = 'mb';
    this.isLoginForm = true;
    this.verifyNumber = false;
    this.userExist = false;
    this.pinBox = false;
    this.fromForgetPWD = false;
  }

  async cancelCheckOutAsGuest() {
    this.pincode = '';
    this.showPinCode = false;
    this.clearOTP();
    this.pinBox = false;
    this.checkoutAsGuest = false;
    this.welcomeText = 'Please Login';
    this.isLoginForm = true;
    this.verifyNumber = false;
    this.userExist = false;
    this.fromForgetPWD = false;
  }
  async checkoutAsGuestFunLogin() {
    if (
      !!this.OTP1 &&
      this.OTP2 &&
      this.OTP3 &&
      this.OTP4 &&
      this.OTP5 &&
      this.OTP6
    ) {
      if (this.Mobile.internationalNumber) {
        this.Mobile = this.Mobile.internationalNumber.replace(/[\W_]/g, '');
        this.Mobile = this.Mobile.toString().replace('+', '');
      }
      let dataOTPConfirmation: any =
        await this.databaseServiceService.loginWithConfirmation({
          mobNumbers: this.Mobile.toString(),
          otp:
            this.OTP1 +
            this.OTP2 +
            this.OTP3 +
            this.OTP4 +
            this.OTP5 +
            this.OTP6,
        });

      if (dataOTPConfirmation.data) {
        this.pinBox = false;
        this.clearOTP();
        if (this.Mobile.internationalNumber) {
          this.Mobile = this.Mobile.internationalNumber.replace(/[\W_]/g, '');
          this.Mobile = this.Mobile.toString().replace('+', '');
        }
        let response =
          await this.databaseServiceService.checkUserExistByPhoneNo(
            this.Mobile.toString()
          );
        await this.loginAndRedirect(response);
      } else {
        this._configService.presentToast(dataOTPConfirmation.error, 'error');
      }
    } else {
      this._configService.presentToast('Please enter OTP', 'error');
    }
  }
  async getOTPCall() {
    if (this.Mobile.internationalNumber) {
      this.Mobile = this.Mobile.internationalNumber.replace(/[\W_]/g, '');
      this.Mobile = this.Mobile.toString().replace('+', '');
    }
    let res = await this.databaseServiceService.getOTPCall(
      this.Mobile.toString()
    );
    this.pinBox = true;
    if (!!res && res.isSuccess) {
      this._configService.presentToast(
        'Calling to given mobile number',
        'success'
      );
    }
  }
  async quickBuyVerifyOTP() {
    if (
      !!this.OTP1 &&
      this.OTP2 &&
      this.OTP3 &&
      this.OTP4 &&
      this.OTP5 &&
      this.OTP6
    ) {
      if (this.Mobile.internationalNumber) {
        this.Mobile = this.Mobile.internationalNumber.replace(/[\W_]/g, '');
        this.Mobile = this.Mobile.toString().replace('+', '');
      }
      let dataOTPConfirmation: any =
        await this.databaseServiceService.loginWithConfirmation({
          mobNumbers: this.Mobile.toString(),
          otp:
            this.OTP1 +
            this.OTP2 +
            this.OTP3 +
            this.OTP4 +
            this.OTP5 +
            this.OTP6,
        });

      if (dataOTPConfirmation.data) {
        this.pinBox = false;
        this.clearOTP();
        this.modalCtrl.dismiss(true);
      } else {
        this._configService.presentToast(dataOTPConfirmation.error, 'error');
      }
    } else {
      this._configService.presentToast('Please enter OTP', 'error');
    }
  }

  dismiss() {
    this.modalCtrl.dismiss(false);
  }

  checkEmail(value) {
    console.log(value);
    this.emailError = '';
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (value.match(mailformat)) {
      // alert("Valid email address!");
      // document.form1.text1.focus();
      return true;
    } else {
      this.emailError = 'Please enter a valid email.';
      return false;
    }
  }

  distributioncenterSelected(distributor) {
    this.showPlaceholder = false;
    this.showPlaceholderForSales = false;
    this.selectedSalesPerson = null;
    this.distributorSalesperson = [];
    this.distErr = false;
    if (distributor?.companyName) {
      console.log(distributor);
      console.log(this.salesPersons);
      this.selectedDistributor = this.distributioncenters.find(
        (x) => x.companyName == distributor.companyName
      );
      this.distributorSalesperson = this.salesPersons.filter(
        (x) => x.location == distributor.companyName
      );
      this.selectedSalesPerson = null;
      if (this.distributorSalesperson.length > 0) {
        let defaultKam = distributor['defaultKam'];
        console.log(this.distributorSalesperson);
        this.selectedSalesPerson = this.distributorSalesperson.filter(
          (n) => n.name == defaultKam
        )[0];
      }
    } else {
      this.showPlaceholder = true;
      this.showPlaceholderForSales = true;
      this.distErr = true;
    }
    this.enableCreateAccountBtn();
  }

  async salesPersonSelection(salesPerson) {
    this.showPlaceholderForSales = false;
    console.log(salesPerson);
    this.salesPersonErr = false;
    if (!!salesPerson) {
      this.selectedSalesPerson = await this.salesPersons.find(
        (x) => x.name == salesPerson.name
      );
      console.log(this.selectedSalesPerson);
    } else {
      this.showPlaceholderForSales = true;
      this.selectedSalesPerson = {};
      this.salesPersonErr = true;
    }
    this.enableCreateAccountBtn();
  }

  keyPressed(event: any) {
    alert('hkjhk ');
    if (event.keyCode == 13) {
      alert('Entered Click Event!');
    } else {
    }
  }

  unCheckFocus(field) {
    if (field == 'name') {
      if (!this.name) {
        this.nameError = true;
      } else {
        this.nameError = false;
      }
    }

    if (field == 'mobile') {
      if (!this.Mobile) {
        this.mobileError = true;
      } else {
        this.mobileError = false;
      }
    }

    if (field == 'email') {
      if (!this.email) {
        this.emailInError = true;
      } else {
        this.emailInError = false;
      }
    }

    if (field == 'password') {
      if (!this.newPassword || this.newPassword.length < 6) {
        this.pwdError = true;
      } else {
        this.pwdError = false;
      }
    }

    if (field == 'verifyPassword') {
      if (!this.verifyPassword) {
        this.validPwdError = true;
      } else {
        this.validPwdError = false;
      }
    }

    this.enableCreateAccountBtn();

    // if (field == 'distribution') {
    //   if (!this.selectedDistributor) {
    //     this.distErr = true;
    //   } else {
    //     this.distErr = false;
    //   }
    // }
  }

  enableCreateAccountBtn() {
    if (
      this.name &&
      this.Mobile &&
      this.email &&
      this.newPassword &&
      this.newPassword.length >= 6 &&
      this.verifyPassword === this.newPassword &&
      this.selectedDistributor &&
      this.selectedSalesPerson
    ) {
      this.btnDisabled = false;
    } else {
      this.btnDisabled = true;
    }
  }
}
