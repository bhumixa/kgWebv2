import {
  Component,
  OnInit,
  ChangeDetectorRef,
  Input,
  OnDestroy,
  HostListener,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { ConfigServiceService } from '../../service/config-service.service';
// import * as algoliasearch from "algoliasearch/lite";
import { CompanyService } from '../../service/company/company.service';
import { SavedService } from '../../service/cart/saved/saved.service';
import { IonButton, IonInput, NavController } from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { ModalController } from '@ionic/angular';
import { IonicSelectableComponent } from 'ionic-selectable';
import { PdParametersPage } from '../pd-parameters/pd-parameters.page';
import defaultValue from './default';
import { ElasticsearchService } from '../../service/elasticsearch/elasticsearch.service';
import { environment } from '../../../environments/environment';
import { ApplySearchService } from '../../service/observable/apply-search/apply-search.service';
import { DatabaseServiceService } from 'src/app/service/database-service.service';
import { LOGGEDOUTService } from 'src/app/service/observable/user/loggedout.service';
import { LOGGEDINService } from 'src/app/service/observable/user/loggedin.service';
import { AnalyticsService } from 'src/app/service/analytics.service';
import { DiamondSearchService } from 'src/app/service/diamond-search/diamond-search.service';

// const searchClient = algoliasearch(
// 	ConfigServiceService.algoliaAppId,
// 	ConfigServiceService.algoliaSearchOnlyKey
// );

interface SearchParameter {
  id?: string | number;
  label: string;
  value: string | string[] | {};
  isRefined: boolean;
  count?: string | number;
  href?: string;
  para?: any[];
}
// interface Clarity {
//   count: string;
//   href: string;
//   id: string;
//   isRefined: boolean;
//   label: string;
//   value: {};
// }

// interface Description {
//   href: string;
//   isRefined: boolean;
//   label: string;
//   para: any[];
//   value: string;
// }

// interface Fluorescence {
//   label: string;
//   value: string | string[];
//   isRefined: boolean;
//   count: number;
// }

// interface FancyColor {
//   label: string;
//   value: string;
//   isRefined: boolean;
//   count: number;
// }

@Component({
  selector: 'app-diamond-search',
  templateUrl: './diamond-search.page.html',
  styleUrls: ['./diamond-search.page.scss'],
})
export class DiamondSearchPage implements OnInit {
  @ViewChild('searchComponent') searchComponent: IonicSelectableComponent;
  @ViewChild('resetBtn') resetBtn: IonButton;
  @ViewChild('clearBtn') clearBtn: IonButton;
  @ViewChild('fromCaratInput') fromCaratInput: IonInput;

  // @ViewChild('finishingDivBtn') finishingDivBtn: ElementRef<any>;
  @Input() hideHeaderFooter = false;
  showScroll: boolean = false;
  scrollTitle;
  queryFilter;
  public userType: any;
  public userData: any;
  public userId: any;
  public loggedInUser: any;
  public sessionId: any;
  public selectedSavedSearch: any;
  public savedSearchList: any;
  public searchCount = 0;
  public selectedShapesArray: any = [];
  public selectedOtherShapesArray: any = [];
  public selectedColorsArray: any = [];
  public selectedAdvancedClaritiesArray: any = [];
  public selectedClaritiesArray: any = [];
  public selectedOriginArray: any = [];
  public selectedFluorescenceArray: any = [];
  public selectedCutArray: any = [];
  public selectedPolishArray: any = [];
  public selectedSymmetryArray: any = [];
  public selectedFinishArray: any = [];
  // public algoliaConfig: any;
  // public algoliaIndexName: any;
  public showFilters = true;
  public excludeParameters;
  public kgPricing;
  public selectedSearch = '';
  public savedSearchParameters;
  public showDetails;

  default: any = {
    criteria: false,
    search: true,
    shape: true,
    advancedShapes: true,
    carat: true,
    color: true,
    colorOverride: false,
    clarity: true,
    clarityOverride: false,
    description: true,
    finishing: true,
    fluorescence: true,
    lab: true,
    size: false,
    internalStatus: false,
    externalStatus: true,
    transType: false,
    users: false,
    location: true,
    box: false,
    department: false,
    saveSearch: true,
    download: false,
    displayCount: true,
    fm: true,
    // Lotcountry: true,
    // diamondType: true,
    traceabilityProtocol: true,
  };
  public firstLoad: boolean = false;
  public query = {
    disjunctiveFacetsRefinements: {},
  };
  public allShapes = [];
  public show: boolean = false;
  public shapeMoreTxt: any;
  public searchPara: any = {
    shapes: [],
    advancedShapes: [],
    colors: [],
    clarities: [],
    cuts: [],
    polishes: [],
    symmetries: [],
    descriptions: [],
    finishings: [],
    fluorescences: [],
    labs: [],
    origin: [],
    Lotcountry: [],
    fancyColorIntensities: [],
    selectedFancyColorIntensity: [],
    fancyColorOvertones: [],
    selectedFancyColorOvertone: [],
    fancyColors: [],
    selectedFancyColor: [],
    // lusters:[],
    // selectedLuster:"",
    // naturals:[],
    // selectedNatural:"",
    saveSearchName: '',
    savedSearchName: '',
    fromCarat: '',
    toCarat: '',
    specificCaratGroup: [],
    stoneId: '',
    certNo: '',
    stoneIdORCertSelected: 'stoneId',
    shapeType: 'generic',
    colorType: 'white',
    caratType: 'specific',
    clarityType: 'basic',
    finishingType: 'general',
    tablePerFrom: '',
    tablePerTo: '',
    depthPerFrom: '',
    depthPerTo: '',
    lengthFrom: '',
    lengthTo: '',
    widthFrom: '',
    widthTo: '',
    depthFrom: '',
    depthTo: '',
    ratioFrom: '',
    ratioTo: '',
    crownAngleFrom: '',
    crownAngleTo: '',
    crownHeightFrom: '',
    crownHeightTo: '',
    girdles: [],
    selectedGirdle: '',
    pavilionAngleFrom: '',
    pavilionAngleTo: '',
    pavilionDepthFrom: '',
    pavilionDepthTo: '',
    heightFrom: '',
    heightTo: '',
    pavilionHeightFrom: '',
    pavilionHeightTo: '',
    pdObject: {},
    location: [],
    discountPerFrom: '',
    discountPerTo: '',
    pricePerFrom: '',
    pricePerTo: '',
    amtPerFrom: '',
    amtPerTo: '',
  };
  public queryalldocs = {
    query: {
      match_all: {},
    },
    sort: [{ _score: { order: 'desc' } }],
  };
  public index = environment.INDEX;
  public isConnected = false;
  public status: string;
  public smallScreenFilter = 'search';
  public innerWidth: any;
  public mobileView: boolean = false;
  public ssFilters = [
    {
      label: 'By ID',
      attribute: 'search',
    },
    {
      label: 'Shape',
      attribute: 'shapes',
      type: 'refinement',
      searchPlaceholder: 'Search For Shape',
    },
    {
      label: 'Carat',
      attribute: 'carat',
      type: 'refinement',
      searchPlaceholder: 'Search For Carat',
      subSection: [],
    },
    {
      label: 'Color',
      attribute: 'colors',
      type: 'refinement',
      searchPlaceholder: 'Search For Color',
      subSection: [],
    },
    {
      label: 'Clarity',
      attribute: 'clarities',
      type: 'refinement',
      searchPlaceholder: 'Search For Clarity',
      subSection: [],
    },
    {
      label: 'Description',
      attribute: 'descriptions',
      type: 'refinement',
      searchPlaceholder: 'Search For Description',
    },
    {
      label: 'Finishing',
      attribute: 'finishings',
      type: 'refinement',
      searchPlaceholder: 'Search For Finishing',
      subSection: [],
    },
    {
      label: 'Fluorescence',
      attribute: 'fluorescences',
      type: 'refinement',
      searchPlaceholder: 'Search For Fluorescence',
    },
    {
      label: 'Lab',
      attribute: 'labs',
      type: 'refinement',
      searchPlaceholder: 'Search For Lab',
    },
  ];

  public filteredPD: any;
  public savedShapes = [];
  private checkLab_isFirst = false;
  shapePreferences = {
    isRoundShape: false,
    isFancyShape: false,
    isBothShape: false,
  };

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
    public _LOGGEDINService: LOGGEDINService,
    public _LOGGEDOUTService: LOGGEDOUTService,
    public _savedService: SavedService,
    public _companyService: CompanyService,
    public databaseServiceService: DatabaseServiceService,
    public configService: ConfigServiceService,
    public navCtrl: NavController,
    private router: Router,
    public storage: Storage,
    public _applySearchService: ApplySearchService,
    public analyticsService: AnalyticsService,
    private modalController: ModalController,
    private es: ElasticsearchService,
    private cd: ChangeDetectorRef,
    private diamondSearchService: DiamondSearchService
  ) {
    this._applySearchService.observable().subscribe((data) => {
      this.addRefinements(null);
    });
    //this.searchPara = ''
    if (!!this._applySearchService.searchCriteria) {
      this._applySearchService.searchCriteria.subscribe(async (res) => {
        //this.resetSearch()
        if (!!res) {
          setTimeout(async () => {
            this.searchPara = await this.storage.get('searchData');
            this._applySearchService.searchCriteria.next(false);
          }, 500);
        }
      });
    }

    this.configService.pdParameterEvent.subscribe((data: string) => {
      console.log('pd parameter', data);
      if (data) {
        this.handlePdFilterDismiss(data);
      }
    });

    this._LOGGEDINService.observable().subscribe(async (data) => {
      this.userData = await this.storage.get('userData');
      this.userType = await this.storage.get('userType');
      this.userId = await this.storage.get('userID');
      this.loadSavedSearches();
    });
    this._LOGGEDOUTService.observable().subscribe((data) => {
      this.savedSearchList = [];
      this.resetSearch();
    });
    // this.intializeSearchPara();
  }

  async onSearchChange({ results, state }: { results: any; state: any }) {
    //console.log("results", results, "state", state);
  }

  async checkBanner() {
    let res = await this.databaseServiceService.getBannerInfo();
    if (!!res.isSuccess && !!res.data) {
      let bannerDetails = res.data;
      if (!!bannerDetails?.enableBanner) {
        this.showScroll = true;
        this.scrollTitle = bannerDetails?.title;
        this.queryFilter = bannerDetails?.queryFilter;
      }
    }
  }

  async ngOnInit() {
    if (!!localStorage.getItem('prevState')) {
      localStorage.removeItem('prevState');
    }
    this.checkBanner();
    this.analyticsService.addEvents('View Search', '');
    // this.databaseServiceService.searchQueryEvent
    // 	.subscribe((data: any) => {
    // 		if (data) {
    // 			let d = JSON.parse(data);
    // 			this.searchPara = d.param;
    // 			//this.esTermsQuery = d.query;
    // 		}
    // 	});
    await this.loadCompanyData();
    this.innerWidth = window.innerWidth;
    if (this.innerWidth <= 500) {
      this.mobileView = true;
    } else if (this.innerWidth > 500) {
      this.mobileView = false;
    }
    this.userData = await this.storage.get('userData');
    this.userType = await this.storage.get('userType');
    this.userId = await this.storage.get('userID');
    this.sessionId = await this.storage.get('sessionID');
    this.es
      .isAvailable()
      .then(
        () => {
          this.status = 'OK';
          this.isConnected = true;
        },
        (error) => {
          this.status = 'ERROR';
          this.isConnected = false;
          console.error('Server is down', error);
        }
      )
      .then(() => {
        this.cd.detectChanges();
      });
    await this.intializeSearchPara();
    if (!!this.userData) {
      this.loadSavedSearches();
    }

    //await this.toggleShapes()
  }

  async loadCompanyData() {
    if (this._companyService.companyObj && this._companyService.companyObj) {
      if (this._companyService.companyObj.config) {
        let companyJson = this._companyService.companyObj.config;
        if (!!companyJson.externalProduct) {
          this.excludeParameters =
            companyJson.externalProduct.excludeParameters;
        }

        if (!!companyJson.externalProduct.kgAppliedPrice) {
          this.kgPricing = companyJson.externalProduct.kgAppliedPrice;
        }

        // if (!!companyJson.showDetails?.enableBanner) {
        //   this.showScroll = true;
        //   this.scrollTitle = companyJson.showDetails?.title;
        //   this.queryFilter = companyJson.showDetails?.queryFilter;
        // }
      }
    }
  }

  async loadSavedSearches() {
    if (!!this.userData) {
      let res: any = await this._savedService.getAllSavedSearches(
        parseInt(this.userData.id)
      );
      if (!!res && !!res.data && res.data.length > 0)
        this.savedSearchList = res.data;
      else this.savedSearchList = [];
    }
  }

  async insertSavedSearch() {
    if (!!this.userData) {
      if (!!this.searchPara.savedSearchName) {
        this.databaseServiceService.showSpinner();
        let queryObj = {
          query: this.searchQuery(true),
          shapes: this.savedShapes,
        };
        let objToPost = {
          id: this._companyService.refCompanyId,
          name: this.searchPara.savedSearchName,
          refUserId: this.userData.id,
          searchObject: JSON.stringify(queryObj),
        };
        let res = await this._savedService.AddSaveSearch(objToPost);
        if (res.isSuccess) {
          await this.loadSavedSearches();
          this.databaseServiceService.hideSpinner();
          this.configService.presentToast('Saved search added', 'success');
          this.searchPara.savedSearchName = '';
        }
      } else
        this.configService.presentToast(
          'Please add saved search label',
          'error'
        );
    } else {
      this.configService.presentToast('Please login to continue', 'error');
    }
  }

  resetUiInputs() {
    document.querySelectorAll('.tablePerFrom').forEach((item) => {
      item.classList.remove('error');
    });
    document.querySelectorAll('.tablePerTo').forEach((item) => {
      item.classList.remove('error');
    });

    document.querySelectorAll('.lengthFrom').forEach((item) => {
      item.classList.remove('error');
    });
    document.querySelectorAll('.lengthTo').forEach((item) => {
      item.classList.remove('error');
    });
    document.querySelectorAll('.heightFrom').forEach((item) => {
      item.classList.remove('error');
    });
    document.querySelectorAll('.heightTo').forEach((item) => {
      item.classList.remove('error');
    });
    document.querySelectorAll('.widthFrom').forEach((item) => {
      item.classList.remove('error');
    });
    document.querySelectorAll('.widthTo').forEach((item) => {
      item.classList.remove('error');
    });
    document.querySelectorAll('.depthFrom').forEach((item) => {
      item.classList.remove('error');
    });
    document.querySelectorAll('.depthTo').forEach((item) => {
      item.classList.remove('error');
    });
    document.querySelectorAll('.ratioFrom').forEach((item) => {
      item.classList.remove('error');
    });
    document.querySelectorAll('.ratioTo').forEach((item) => {
      item.classList.remove('error');
    });
    document.querySelectorAll('.crownAngleFrom').forEach((item) => {
      item.classList.remove('error');
    });
    document.querySelectorAll('.crownAngleTo').forEach((item) => {
      item.classList.remove('error');
    });
    document.querySelectorAll('.crownHeightFrom').forEach((item) => {
      item.classList.remove('error');
    });
    document.querySelectorAll('.crownHeightTo').forEach((item) => {
      item.classList.remove('error');
    });
    document.querySelectorAll('.pavilionAngleFrom').forEach((item) => {
      item.classList.remove('error');
    });
    document.querySelectorAll('.pavilionAngleTo').forEach((item) => {
      item.classList.remove('error');
    });
    document.querySelectorAll('.pavilionHeightFrom').forEach((item) => {
      item.classList.remove('error');
    });
    document.querySelectorAll('.pavilionHeightTo').forEach((item) => {
      item.classList.remove('error');
    });
  }

  async resetSearch(resetSearchSelection = false) {
    this.resetUiInputs();
    this.databaseServiceService.showSpinner();
    //this.configService.showLoading()
    //this.showFilters = false;
    this.selectedShapesArray.length = 0;
    this.selectedColorsArray.length = 0;
    this.selectedClaritiesArray.length = 0;
    this.selectedOriginArray.length = 0;
    this.selectedOtherShapesArray.length = 0;
    this.selectedAdvancedClaritiesArray.length = 0;
    this.selectedFluorescenceArray.length = 0;
    this.selectedCutArray.length = 0;
    this.selectedPolishArray.length = 0;
    this.selectedSymmetryArray.length = 0;
    this.selectedFinishArray.length = 0;
    this.searchPara.selectedFancyColorIntensity = '';
    this.searchPara.selectedFancyColorOvertone = '';
    this.searchPara.selectedFancyColor = '';

    this.searchPara.fromCarat = '';
    this.searchPara.toCarat = '';
    this.searchPara.tablePerFrom = '';
    this.searchPara.tablePerTo = '';
    this.searchPara.lengthFrom = '';
    this.searchPara.lengthTo = '';

    this.searchPara.widthFrom = '';
    this.searchPara.widthTo = '';
    this.searchPara.depthFrom = '';
    this.searchPara.depthTo = '';

    this.searchPara.ratioFrom = '';
    this.searchPara.ratioTo = '';
    this.searchPara.crownAngleFrom = '';
    this.searchPara.crownAngleTo = '';

    this.searchPara.crownHeightFrom = '';
    this.searchPara.crownHeightTo = '';
    this.searchPara.selectedGirdle = '';

    this.searchPara.pavilionAngleFrom = '';
    this.searchPara.pavilionAngleTo = '';
    this.searchPara.pavilionDepthFrom = '';
    this.searchPara.pavilionDepthTo = '';

    this.searchPara.heightFrom = '';
    this.searchPara.heightTo = '';
    this.searchPara.pavilionHeightFrom = '';
    this.searchPara.pavilionHeightTo = '';

    this.searchPara.certNo = '';

    this.searchPara.stoneId = '';

    this.searchPara.specificCaratGroup = [];
    this.shapePreferences = {
      isRoundShape: false,
      isFancyShape: false,
      isBothShape: false,
    };

    if (resetSearchSelection) {
      this.selectedSearch = null;
    }

    this.searchPara.savedSearchName = null;
    this.searchPara.Location = [];
    this.firstLoad = false;
    this.filteredPD = '';
    await this.loadSavedSearches();
    await this.intializeSearchPara();

    // console.log(this.resetBtn);
    // console.log(this.clearBtn);

    if (this.resetBtn) this.resetBtn.disabled = true;
    if (this.clearBtn) this.clearBtn.disabled = true;

    setTimeout(() => {
      this.firstLoad = false;
      this.showFilters = true;
      this.databaseServiceService.hideSpinner();
      //this.configService.hideLoading()
    }, 500);

    // console.log(this.searchPara)
    // this.searchPara['Location'] = this.searchPara['Location'].map(res => {
    // 	if (!!res.isRefined) {
    // 		res.isRefined = false;

    // 	}
    // 	return res;
    // });
  }

  async SavedSearchSelect() {
    let res: any = await this._savedService.getSavedSearchById(
      parseInt(this.userData.id),
      this.selectedSavedSearch
    );

    //shape
    if (
      !!res.data &&
      !!res.data.searchObject &&
      !!res.data.searchObject.disjunctiveFacetsRefinements &&
      !!res.data.searchObject.disjunctiveFacetsRefinements.ShapeCode
    ) {
      for (
        let i = 0;
        i < res.data.searchObject.disjunctiveFacetsRefinements.ShapeCode.length;
        i++
      ) {
        //this.searchPara.shapes.filter(a => a.value.toLowerCase() == res.data.searchObject.disjunctiveFacetsRefinements.ShapeCode[i].toLowerCase())[0].isRefined = true;
      }
    }

    //lab
    if (
      !!res.data &&
      !!res.data.searchObject &&
      !!res.data.searchObject.disjunctiveFacetsRefinements &&
      !!res.data.searchObject.disjunctiveFacetsRefinements.lab
    ) {
      for (
        let i = 0;
        i < res.data.searchObject.disjunctiveFacetsRefinements.lab.length;
        i++
      ) {
        this.searchPara.labs.filter(
          (a) =>
            a.value.toLowerCase() ==
            res.data.searchObject.disjunctiveFacetsRefinements.lab[
              i
            ].toLowerCase()
        )[0].isRefined = true;
      }
    }

    //origin

    //lab
    if (
      !!res.data &&
      !!res.data.searchObject &&
      !!res.data.searchObject.disjunctiveFacetsRefinements &&
      !!res.data.searchObject.disjunctiveFacetsRefinements.Lotcountry
    ) {
      for (
        let i = 0;
        i <
        res.data.searchObject.disjunctiveFacetsRefinements.Lotcountry.length;
        i++
      ) {
        this.searchPara.Lotcountry.filter(
          (a) =>
            a.value.toLowerCase() ==
            res.data.searchObject.disjunctiveFacetsRefinements.Lotcountry[
              i
            ].toLowerCase()
        )[0].isRefined = true;
      }
    }

    //colors
    if (
      !!res.data &&
      !!res.data.searchObject &&
      !!res.data.searchObject.disjunctiveFacetsRefinements &&
      !!res.data.searchObject.disjunctiveFacetsRefinements.ColorCode
    ) {
      for (
        let i = 0;
        i < res.data.searchObject.disjunctiveFacetsRefinements.ColorCode.length;
        i++
      ) {
        this.searchPara.colors.filter(
          (a) =>
            a.value.toLowerCase() ==
            res.data.searchObject.disjunctiveFacetsRefinements.ColorCode[
              i
            ].toLowerCase()
        )[0].isRefined = true;
      }
    }
    //clarities
    if (
      !!res.data &&
      !!res.data.searchObject &&
      !!res.data.searchObject.disjunctiveFacetsRefinements &&
      !!res.data.searchObject.disjunctiveFacetsRefinements.ClarityCode
    ) {
      for (
        let i = 0;
        i <
        res.data.searchObject.disjunctiveFacetsRefinements.ClarityCode.length;
        i++
      ) {
        this.searchPara.clarities.filter(
          (a) =>
            a.value.toLowerCase() ==
            res.data.searchObject.disjunctiveFacetsRefinements.ClarityCode[
              i
            ].toLowerCase()
        )[0].isRefined = true;
      }
    }

    //descriptions--pending
    // if(!!res.data && !!res.data.searchObject && !!res.data.searchObject.disjunctiveFacetsRefinements
    // && !!res.data.searchObject.disjunctiveFacetsRefinements.lab)
    // {
    // for(let i =0;i<res.data.searchObject.disjunctiveFacetsRefinements.lab.length;i++)
    // {
    // this.searchPara.descriptions.filter(a=>a.value.toLowerCase()==res.data.searchObject.disjunctiveFacetsRefinements.lab[i].toLowerCase())[0].isRefined=true;
    // }
    // }

    //finishings
    if (
      !!res.data &&
      !!res.data.searchObject &&
      !!res.data.searchObject.disjunctiveFacetsRefinements &&
      !!res.data.searchObject.disjunctiveFacetsRefinements.CutCode
    ) {
      for (
        let i = 0;
        i < res.data.searchObject.disjunctiveFacetsRefinements.CutCode.length;
        i++
      ) {
        this.searchPara.finishings.filter(
          (a) =>
            a.value.toLowerCase() ==
            res.data.searchObject.disjunctiveFacetsRefinements.CutCode[
              i
            ].toLowerCase()
        )[0].isRefined = true;
      }
    }

    //fluorescences
    if (
      !!res.data &&
      !!res.data.searchObject &&
      !!res.data.searchObject.disjunctiveFacetsRefinements &&
      !!res.data.searchObject.disjunctiveFacetsRefinements.FluorescenceColorCode
    ) {
      for (
        let i = 0;
        i <
        res.data.searchObject.disjunctiveFacetsRefinements.FluorescenceColorCode
          .length;
        i++
      ) {
        this.searchPara.fluorescences.filter(
          (a) =>
            a.value.toLowerCase() ==
            res.data.searchObject.disjunctiveFacetsRefinements.FluorescenceColorCode[
              i
            ].toLowerCase()
        )[0].isRefined = true;
      }
    }
  }

  async ionViewDidEnter() {
    this.configService.setTitle('Diamond Search');
    this.analyticsService.addEvents('Search Page', '');
  }

  // async ionViewWillLeave() {
  // 	this.resetSearch();
  // }

  async valueChange(event: {
    component: IonicSelectableComponent;
    value: any;
  }) {
    this.savedShapes = [];
    console.log(event.value.searchObject.shapes);
    this.savedShapes = event.value.searchObject.shapes;
    this.databaseServiceService.showSpinner();
    this.resetSearch(false);
    try {
      this.firstLoad = true;
      setTimeout(() => {
        this.getCount(event.value.searchObject.query, true);
        this.databaseServiceService.hideSpinner();
      }, 500);
    } catch (e) {
      console.log(e);
    }
  }
  async afterSelect(event) {
    // // console.log("afterSelect diamond search ",event, this.searchPara[event.identifier]);
    this.toggleSelection(
      this.searchPara[event.identifier],
      event.item.value,
      null
    );
    // let tmp = [];
    // tmp = this.searchPara.clarities.filter(a=>a.isRefined==true);
    // for(let i=0;i<tmp.length;i++)
    // {
    // 	this.query.filters.push({"facetFilters" : ["ClarityCode", tmp[i].value ]})
    // }
  }

  async selectPD() {
    const modal = await this.modalController.create({
      component: PdParametersPage,
      componentProps: {
        pd: this.searchPara.pdObject,
      },
      cssClass: 'modal-fullscreen',
    });
    modal.onWillDismiss().then((data) => {
      if (!!data.data && Object.keys(data.data).length > 0) {
        this.searchPara.pdObject = data.data;
        console.log(this.searchPara.pdObject);
      }
    });
    await modal.present();
  }

  ////////////////////  Copy From Lattice  ////////////////////

  public sanitized(query) {
    // console.log("query ", query);
    // if (!!query)
    //   return query.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
    // else
    return query;
  }

  tradeShow() {
    let qry = this.searchQuery(true);
    console.log(qry);

    let tradeShow = {
      match: {
        tradeShow: this.queryFilter,
      },
    };

    qry.query.bool.should[1].bool.must.push(tradeShow);
    // console.log(qry);

    this.storage.set('searchData', this.searchPara).then(() => {
      let navigationExtras: NavigationExtras;
      navigationExtras = {
        queryParams: {
          query: JSON.stringify(qry),
        },
      };
      let url = 'search';
      this.router.navigate(['/' + url], navigationExtras);
    });
    // this.router.navigate(['/' + url]).then(() =>
    //   this.es.queryEmmiter.emit({
    //     query: JSON.stringify(qry),
    //   })
    // );
  }

  defaultLoad() {
    var mapOfSearchCriteria = {},
      mapOfNumericCriteria = {};
    try {
      let qry = this.searchQuery(true);
      console.log(qry);
      let match = qry.query.bool.should
        .map((res) => Object.keys(res)[0])
        .indexOf('bool');
      try {
        qry.query.bool.should[match].bool.must
          .map((res) => res.terms)
          .filter((res) => !!res)
          .filter((res) => {
            mapOfSearchCriteria[Object.keys(res)[0]] = res[Object.keys(res)[0]];
          });
      } catch (e) {
        // console.log(e);
      }
      try {
        qry.query.bool.should[match].bool.must
          .map((res) => res.range)
          .filter((res) => !!res)
          .filter((res) => {
            mapOfNumericCriteria[Object.keys(res)[0]] =
              res[Object.keys(res)[0]];
          });
      } catch (e) {
        // console.log(e);
      }
    } catch (e) {
      // console.log(e);
    }

    return { mapOfSearchCriteria, mapOfNumericCriteria };
  }

  async intializeSearchPara() {
    this.searchPara = defaultValue;
    Object.keys(this.searchPara).filter((key) => {
      if (Array.isArray(this.searchPara[key])) {
        // console.log('diamond-search L865 key', key);
        if (
          key === 'specificCaratGroup' &&
          !!this.searchPara['specificCaratGroup'].length
        ) {
          this.searchPara[key] = [];
        } else {
          this.searchPara[key] = this.searchPara[key].map((res) => {
            res.isRefined = false;
            return res;
          });
        }

        if (key == 'shapes') {
          this.allShapes = this.searchPara[key];
        }
      }
    });
    this.ssFilters.filter((filter) => {
      filter['values'] = this.searchPara[filter.attribute];
      if (filter.subSection && filter.subSection.length > 0) {
        filter.subSection.filter((subSection) => {
          console.log(subSection);
          subSection['values'] = this.searchPara[subSection.attribute];
        });
      }
    });
    //commented for centurion show by keval
    await this.toggleSelection(this.searchPara.fm, 'NO FM INSCRIPTION', null);

    this.getCount(this.searchQuery(true));

    // this.selectedSavedSearch="";
  }

  private update_selectedFieldsArray(
    fieldName: string,
    isRefined: boolean,
    values: string[] | string
  ) {
    const findIndex = (arr: any[], currVal: string) => {
      return arr.findIndex((val) => val === currVal);
    };

    const update_selected = (value: string) => {
      switch (fieldName) {
        case 'shapecode':
          isRefined
            ? !this.selectedShapesArray.includes(value) &&
              this.selectedShapesArray.push(value)
            : findIndex(this.selectedShapesArray, value) !== -1 &&
              this.selectedShapesArray.splice(
                findIndex(this.selectedShapesArray, value),
                1
              );
          break;
        case 'colorcode':
          isRefined
            ? !this.selectedColorsArray.includes(value) &&
              this.selectedColorsArray.push(value)
            : findIndex(this.selectedColorsArray, value) !== -1 &&
              this.selectedColorsArray.splice(
                findIndex(this.selectedColorsArray, value),
                1
              );
          break;
        case 'claritycode':
          isRefined
            ? !this.selectedClaritiesArray.includes(value) &&
              this.selectedClaritiesArray.push(value)
            : findIndex(this.selectedClaritiesArray, value) !== -1 &&
              this.selectedClaritiesArray.splice(
                findIndex(this.selectedClaritiesArray, value),
                1
              );
          break;
        case 'advclaritycode':
          isRefined
            ? !this.selectedAdvancedClaritiesArray.includes(value) &&
              this.selectedAdvancedClaritiesArray.push(value)
            : findIndex(this.selectedAdvancedClaritiesArray, value) !== -1 &&
              this.selectedAdvancedClaritiesArray.splice(
                findIndex(this.selectedAdvancedClaritiesArray, value),
                1
              );
          break;
        case 'fluorescencecode':
          isRefined
            ? !this.selectedFluorescenceArray.includes(value) &&
              this.selectedFluorescenceArray.push(value)
            : findIndex(this.selectedFluorescenceArray, value) !== -1 &&
              this.selectedFluorescenceArray.splice(
                findIndex(this.selectedFluorescenceArray, value),
                1
              );
          break;
        case 'cutcode':
          isRefined
            ? !this.selectedCutArray.includes(value) &&
              this.selectedCutArray.push(value)
            : findIndex(this.selectedCutArray, value) !== -1 &&
              this.selectedCutArray.splice(
                findIndex(this.selectedCutArray, value),
                1
              );
          break;
        case 'polishcode':
          isRefined
            ? !this.selectedPolishArray.includes(value) &&
              this.selectedPolishArray.push(value)
            : findIndex(this.selectedPolishArray, value) !== -1 &&
              this.selectedPolishArray.splice(
                findIndex(this.selectedPolishArray, value),
                1
              );
          break;
        case 'symmetrycode':
          isRefined
            ? !this.selectedSymmetryArray.includes(value) &&
              this.selectedSymmetryArray.push(value)
            : findIndex(this.selectedSymmetryArray, value) !== -1 &&
              this.selectedSymmetryArray.splice(
                findIndex(this.selectedSymmetryArray, value),
                1
              );
          break;
        case 'finishcode':
          isRefined
            ? !this.selectedFinishArray.includes(value) &&
              this.selectedFinishArray.push(value)
            : findIndex(this.selectedFinishArray, value) !== -1 &&
              this.selectedFinishArray.splice(
                findIndex(this.selectedFinishArray, value),
                1
              );
          break;
      }
    };

    let value: string = '';

    if (!Array.isArray(values)) value = values;

    if (Array.isArray(values)) {
      values.forEach((value: string) => update_selected(value));
    } else {
      update_selected(value);
    }
  }

  private handle_finishingsCriteria(finishingValue: string[], tempObj: any) {
    const compare_values = (array: string[]) => {
      return finishingValue.every((value: string) => array.includes(value));
    };

    const GOOD_Plus = [
      'GOOD',
      'EXCL',
      'VGOOD',
      'GOOD',
      'EXCL',
      'VGOOD',
      'GOOD',
    ];
    const VGOOD_Plus = ['EXCL', 'VGOOD', 'EXCL', 'VGOOD', 'EXCL', 'VGOOD'];
    const VGOOD_Minus = [
      'VGOOD',
      'VGOOD',
      'GOOD',
      'FAIR',
      'VGOOD',
      'GOOD',
      'FAIR',
    ];
    const EXCL_Minus = [
      'EXCL',
      'EXCL',
      'VGOOD',
      'GOOD',
      'FAIR',
      'EXCL',
      'VGOOD',
      'GOOD',
      'FAIR',
    ];
    const three_EXCL = ['EXCL', 'EXCL', 'EXCL'];
    const IDEAL = ['EXCL', 'EXCL', 'EXCL'];

    let result = '';
    let isResult = false;

    switch (finishingValue.length) {
      case 3:
        isResult = compare_values(IDEAL);
        result = isResult ? 'IDEAL' : '';
        break;
      case 6:
        isResult = compare_values(VGOOD_Plus);
        result = isResult ? 'VG+' : '';
        break;
      case 7:
        isResult = compare_values(GOOD_Plus);
        result = isResult ? 'GD+' : '';
        if (!isResult) {
          isResult = compare_values(VGOOD_Minus);
          result = isResult ? 'VG-' : '';
        }
        break;
      case 9:
        isResult = compare_values(EXCL_Minus);
        result = isResult ? 'EX-' : '';
        break;
    }

    if (!!result) {
      const idx: number = tempObj['finishings'].findIndex(
        (obj: any) => obj.value === result
      );

      if (idx !== -1) tempObj['finishings'][idx].isRefined = true;
    }
    return tempObj;
  }

  private filter_selectedTermValue(selectedValue, obj, tempObj, object, key) {
    const find_girdle = (
      value: string
    ): { label: string; value: string; isRefined: boolean } => {
      return tempObj['girdleOptions'].find(
        (opt: { label: string; value: string; isRefined: boolean }) => {
          return opt.value === value;
        }
      );
    };

    const handle_fancyColor = (
      fc_name: string,
      fc_codeName: string,
      keys: any,
      tempObj: any,
      arrName: string
    ) => {
      const idx = tempObj[fc_name].findIndex(
        (intensity: SearchParameter) => intensity.value === keys[fc_codeName][0]
      );

      tempObj[fc_name][idx].isRefined = true;
      tempObj[arrName] = [tempObj[fc_name][idx]];
      setTimeout(() => {
        this.searchPara['colorType'] = 'fancy';
      }, 1000);
      return tempObj;
    };

    const handle_clarityBasic = () => {
      obj.isRefined = true;
      this.update_selectedFieldsArray(
        object[key].toLowerCase(),
        obj.isRefined,
        obj.value
      );
    };

    const handle_otherMatched = handle_clarityBasic;

    selectedValue.filter((keys) => {
      if (keys['ShapeCode'] && Array.isArray(obj.value)) {
        let n = Array.isArray(this.savedShapes);
        let match = this.savedShapes.filter((x) => x.label == obj.label);
        if (match.length > 0) {
          if (
            defaultValue.shapes.filter((x) => x.label == match[0].label)
              .length > 0
          ) {
            setTimeout(() => {
              this.searchPara.shapeType = 'generic';
              this.cd.detectChanges();
            }, 1000);
            this.cd.detectChanges();
          } else if (
            defaultValue.advancedShapes.filter((x) => x.label == match[0].label)
              .length > 0
          ) {
            setTimeout(() => {
              this.searchPara.shapeType = 'eliteCuts';
              this.cd.detectChanges();
            }, 1000);
          } else {
            console.log('--');
          }
          obj.isRefined = true;
        }
      } else if (keys['cts']) {
        tempObj['fromCarat'] = keys['cts']['gte'];
        tempObj['toCarat'] = keys['cts']['lte'];
      } else if (keys['GirdleCode']) {
        if (tempObj['selectedGirdle'] !== Object.values(keys)[0][0]) {
          tempObj['selectedGirdle'] = Object.values(keys)[0][0];
          const girdleArr = tempObj['selectedGirdle'].split(' TO ');
          tempObj['selectedGirdleFrom'] = !!girdleArr[0]
            ? find_girdle(girdleArr[0])
            : '';
          tempObj['selectedGirdleTo'] = !!girdleArr[1]
            ? find_girdle(girdleArr[1])
            : '';
        }
      } else if (Object.keys(keys)[0] == object[key]) {
        if (!!keys['FluorescenceCode'] && keys['FluorescenceCode'].length) {
          const faintArray = ['VERY SLIGHT', 'SLIGHT', 'FAINT'];
          const isFaint = faintArray.every((faint: string) =>
            keys['FluorescenceCode'].includes(faint)
          );

          if (isFaint) {
            const idx = tempObj['fluorescences'].findIndex(
              (fluorescence: SearchParameter) =>
                fluorescence.label?.toLowerCase() === 'faint'
            );

            if (idx !== -1) tempObj['fluorescences'][idx].isRefined = true;
          }
        }

        let data: any = Object.values(keys)[0];
        if (
          typeof obj.value === 'object' &&
          !Array.isArray(obj.value) &&
          obj.value !== null
        ) {
          // if (!!keys['ClarityCode'] && keys['ClarityCode'].length) {
          keys['ClarityCode'].forEach((clarity: string) => {
            const idx = tempObj['advancedClarities'].findIndex(
              (advClarity: SearchParameter) => advClarity.value === clarity
            );

            if (idx !== -1) {
              tempObj['advancedClarities'][idx].isRefined = true;
              setTimeout(() => {
                this.searchPara['clarityType'] = 'advanced';
              }, 1000);
            }
          });
          // }
          if (data.indexOf(Object.keys(obj.value)[0]) != -1) {
            if (Array.isArray(obj.value[obj.label])) {
              const isClarityBasic = obj.value[obj.label].every(
                (clarity: string) => data.includes(clarity)
              );

              if (isClarityBasic) {
                handle_clarityBasic();
                setTimeout(() => {
                  this.searchPara['clarityType'] = 'basic';
                }, 1000);
              }
            } else {
              handle_clarityBasic();
              setTimeout(() => {
                this.searchPara['clarityType'] = 'basic';
              }, 1000);
            }
          } else {
            obj.isRefined = false;
          }
        } else {
          if (object[key] === 'location') {
            if (data.indexOf(obj.id) != -1) {
              handle_otherMatched();
            } else {
              obj.isRefined = false;
            }
          } else {
            if (data.indexOf(obj.value) != -1) {
              handle_otherMatched();
            } else {
              obj.isRefined = false;
            }
          }
        }
      } else {
        if (
          !!keys['FancyColorIntensityCode'] &&
          keys['FancyColorIntensityCode'].length
        ) {
          tempObj = handle_fancyColor(
            'fancyColorIntensities',
            'FancyColorIntensityCode',
            keys,
            tempObj,
            'selectedFancyColorIntensity'
          );
        } else if (
          !!keys['FancyColorOvertoneCode'] &&
          keys['FancyColorOvertoneCode'].length
        ) {
          tempObj = handle_fancyColor(
            'fancyColorOvertones',
            'FancyColorOvertoneCode',
            keys,
            tempObj,
            'selectedFancyColorOvertone'
          );
        } else if (!!keys['FancyColorCode'] && keys['FancyColorCode'].length) {
          tempObj = handle_fancyColor(
            'fancyColors',
            'FancyColorCode',
            keys,
            tempObj,
            'selectedFancyColor'
          );
        } else if (!!keys['NOBGM'] && keys['NOBGM'].length) {
          const idx = tempObj['descriptions'].findIndex(
            (description: SearchParameter) =>
              description.value === keys['NOBGM'][0]
          );

          if (idx !== -1) tempObj['descriptions'][idx].isRefined = true;
        } else if (!!keys['EyeCleanCode'] && keys['EyeCleanCode'].length) {
          keys['EyeCleanCode'].forEach((key: string) => {
            const idx = tempObj['descriptions'].findIndex(
              (description: SearchParameter) =>
                description['secondaryText']?.replace('%', '') ===
                key?.replace('%', '')
            );

            if (idx !== -1) tempObj['descriptions'][idx].isRefined = true;
          });
        } else if (
          !!keys['HeartandArrowCode'] &&
          keys['HeartandArrowCode'].length
        ) {
          keys['HeartandArrowCode'].forEach((key: string) => {
            const idx = tempObj['descriptions'].findIndex(
              (description: SearchParameter) =>
                description.value === 'HeartandArrowCode' &&
                description.para[0].value === key
            );

            if (idx !== -1) tempObj['descriptions'][idx].isRefined = true;
          });
        }
      }
    });

    return { obj, tempObj };
  }

  private handle_ctsRange(selectedCtsRange: any, tempObj: any) {
    selectedCtsRange.forEach((ctsRangeObj: any) => {
      const obj: { from: string; to: string } = {
        from: ctsRangeObj.cts?.gte,
        to: ctsRangeObj.cts?.lte,
      };
      let idx: number = -1;
      if (!!obj.from && !obj.to && obj.from === '5.00') {
        // idx = tempObj['sizeGroups'].findIndex(
        //   (group: any) =>
        //     Number(group.from) === Number(obj.from) &&
        //     !group.to && !obj.to
        // );
        idx = tempObj['sizeGroups'].length - 1;
      } else {
        idx = tempObj['sizeGroups'].findIndex(
          (group: any) =>
            Number(group.from) === Number(obj.from) &&
            Number(group.to) === Number(obj.to)
        );
      }

      if (idx !== -1) {
        tempObj['sizeGroups'][idx].isRefined = true;
        setTimeout(() => {
          this.searchPara['caratType'] = 'groups';
        }, 1000);
      } else {
        tempObj.specificCaratGroup.push(obj);
        setTimeout(() => {
          this.searchPara['caratType'] = 'specific';
        }, 1000);
      }
    });

    return tempObj;
  }

  async getCount(qry: any = {}, defaultSelected = false) {
    let object = {};
    if (this.default.advancedShapes) {
      object['advancedShapes'] = 'ShapeCode';
    }
    if (this.default.shape) {
      object['shapes'] = 'ShapeCode';
    }
    if (this.default.color) {
      object['colors'] = 'ColorCode';
    }
    if (this.default.clarity) {
      object['clarities'] = 'ClarityCode';
    }
    if (this.default.finishing) {
      object['polishes'] = 'PolishCode';
      object['cuts'] = 'CutCode';
      object['symmetries'] = 'SymmetryCode';
    }
    if (this.default.fluorescence) {
      object['fluorescences'] = 'FluorescenceCode';
    }
    if (this.default.lab) {
      object['labs'] = 'lab';
    }
    if (this.default.carat) {
      object['ClarityCode'] = 'advancedClarities';
    }
    if (this.default.users) {
      object['Users'] = 'username';
    }
    if (this.default.location) {
      object['location'] = 'location';
    }
    if (this.default.size) {
      object['AllSize'] = 'Size';
    }
    if (this.default.internalStatus) {
      object['InternalStatus'] = 'internalStatus';
    }
    if (this.default.transType) {
      object['TransType'] = 'transType';
    }
    if (this.default.box) {
      object['Box'] = 'Box';
    }
    if (this.default.department) {
      object['Department'] = 'department';
    }
    if (this.default.externalStatus) {
      object['ExternalStatus'] = 'externalStatus';
    }
    if (this.default.fm) {
      object['fm'] = 'fm';
    }
    if (this.default.party) {
      object['partyName'] = 'partyName';
    }
    /*|||||||||||||| ROUGH ORIGIN ||||||||||||||*/
    // if (this.default.Lotcountry) {
    //   object['Lotcountry'] = 'Lotcountry';
    // }

    // if (this.firstLoad) {
    //   let { mapOfSearchCriteria } = this.defaultLoad();
    //   Object.keys(object).filter(res => Object.keys(mapOfSearchCriteria).indexOf(object[res]) != -1).filter(res => {
    //     delete object[res];
    //   });
    // }

    let obj = {};
    Object.keys(object).filter((key) => {
      let single = object[key];
      obj[single] = {
        terms: { field: single, size: 10000 },
      };
    });
    console.log(obj);

    this.es
      .getPaginatedDocuments(
        {
          aggs: obj,
          ...qry,
        },
        0,
        this.index,
        undefined,
        0
      )
      .then(async (res) => {
        if (!this.checkLab_isFirst && !!res.aggregations.lab.buckets.length) {
          this.checkLab_isFirst = true;
          const labMap = {};
          const labLabels = []; //['GIA', 'HRD', 'IGI', 'GSI', 'NGTC', 'DBO'];
          const labsData = [];

          res.aggregations.lab.buckets.forEach(
            (lab: { key: string; doc_count: number }) => {
              labMap[lab.key] = lab.doc_count;

              const notToAdd = {
                KGLAB: true,
                KGSU: true,
                NCSS: true,
                FM: true,
                FM01: true,
                FM02: true,
                BLFM: true,
              };

              if (!notToAdd[lab.key]) labLabels.push(lab.key);

              // if (
              //   lab.key !== 'KGLAB' &&
              //   lab.key !== 'KGSU' &&
              //   lab.key !== 'NCSS' &&
              //   lab.key !== 'FM' &&
              //   lab.key !== 'FM01' &&
              //   lab.key !== 'FM02' &&
              //   lab.key !== 'BLFM'
              // )
              //   labLabels.push(lab.key);
            }
          );

          labLabels.forEach((label) => {
            if (!!labMap[label]) {
              labsData.push({
                label: label,
                value: label,
                isRefined: false,
              });
            }
          });
          if (!!labMap['FM']) {
            labsData.push({
              label: 'FM',
              value: ['FM01', 'FM02', 'BLFM', 'FM'],
              isRefined: false,
            });
          }
          labsData.push({
            label: 'NON CERT',
            value: 'NONE CERT',
            hideCount: true,
            isRefined: false,
          });

          this.searchPara['labs'] = labsData;
        }

        this.searchCount = res.hits.total.value;

        if (this.searchCount > 10000) this.searchCount = 10000;

        let tempObj = { ...this.searchPara };
        let selectedValue = [];
        let selectedRangeValue = [];
        let fmValues = [];
        let selectedFinishingsValue = [];
        let finishingsValue = [];
        let selectedCtsRange = [];
        let loopedSelectedCtsRange: boolean = false;
        let loopedSelectedFinishing: boolean = false;

        if (defaultSelected) {
          let match = qry.query.bool.should
            .map((res) => Object.keys(res)[0])
            .indexOf('bool');
          selectedValue = qry.query.bool.should[match].bool.must
            .map((res) => {
              return res.terms;
            })
            .filter((x) => x);
          selectedRangeValue = qry.query.bool.should[match].bool.must
            .filter((res) => Object.keys(res)[0] === 'range')
            .map((x) => x.range);
          fmValues = qry.query.bool.should[match].bool.must
            .map((res) => res.bool)
            .filter((x) => x);

          selectedFinishingsValue = selectedValue.filter(
            (finishingValue: any) =>
              (finishingValue['CutCode'] &&
                finishingValue['CutCode'].length &&
                Object.keys(finishingValue)[0] === 'CutCode') ||
              (finishingValue['PolishCode'] &&
                finishingValue['PolishCode'].length &&
                Object.keys(finishingValue)[0] === 'PolishCode') ||
              (finishingValue['SymmetryCode'] &&
                finishingValue['SymmetryCode'].length &&
                Object.keys(finishingValue)[0] === 'SymmetryCode')
          );

          if (selectedFinishingsValue.length === 3) {
            finishingsValue = selectedFinishingsValue.reduce((acc, obj) => {
              return acc.concat(obj[Object.keys(obj)[0]]);
            }, []);
          }

          if (
            selectedRangeValue.findIndex(
              (rangeObj: any) =>
                Object.keys(rangeObj)[0].toLowerCase() === 'cts'
            ) === -1
          ) {
            selectedCtsRange = qry.query.bool.should[match].bool.must
              .filter((res: any) => Object.keys(res)[0] === 'bool')
              .filter((res: any) => Object.keys(res.bool)[0] === 'should')[0]
              ?.bool?.should.map((x: any) => x.range);
          }

          let selecctedDescriptions = qry.query.bool.should[match].bool.must
            .filter((res: any) => Object.keys(res)[0] === 'bool')
            .filter((res: any) => Object.keys(res.bool)[0] === 'must')[0]
            ?.bool?.must;

          if (Array.isArray(selecctedDescriptions)) {
            let noBGMCheck_1: boolean = false;
            let noBGMCheck_2: boolean = false;
            selecctedDescriptions = selecctedDescriptions
              .map((x: any) => x.terms)
              .map((res) => {
                if (Object.keys(res)[0] === 'ShadesCode.keyword') {
                  if (res['ShadesCode.keyword'].includes('NONE')) {
                    noBGMCheck_1 = true;
                  }
                  const obj: any = {};
                  obj['ShadesCode'] = res['ShadesCode.keyword'];
                  return obj;
                } else if (
                  Object.keys(res)[0] === 'LusterCode' &&
                  res['LusterCode'].length >= 4
                ) {
                  const checkFor = ['VG', 'GD', 'EX', 'FR'];
                  noBGMCheck_2 = checkFor.every((val: string) =>
                    res['LusterCode'].includes(val)
                  );
                }
                return res;
              });

            if (noBGMCheck_1 && noBGMCheck_2)
              selecctedDescriptions.push({ NOBGM: ['No BGM'] });

            if (!!selecctedDescriptions && selecctedDescriptions.length) {
              selectedValue = selectedValue.concat(selecctedDescriptions);
            }
          }
        }

        Object.keys(object) &&
          (await Object.keys(object).filter(async (key) => {
            if (!this.firstLoad) {
              switch (true) {
                case !tempObj[key]:
                case key == 'colors' && this.default.colorOverride:
                case key == 'clarities' && this.default.clarityOverride:
                  tempObj[key] = res.aggregations[object[key]].buckets.map(
                    (value) => {
                      return {
                        id: value.key,
                        label: value.key,
                        value: value.key,
                        isRefined: false,
                      };
                    }
                  );
                  break;
                default:
                  break;
              }
            }

            let shapesArray = tempObj['shapes'].concat(
              tempObj['advancedShapes']
            );

            tempObj[key] &&
              (await tempObj[key].map((obj) => {
                if (res.aggregations[object[key]].buckets.length > 0) {
                  obj.count = 0;
                  res.aggregations[object[key]].buckets.map((value) => {
                    if (obj.value == value.key) {
                      // this.searchCount = value.doc_count;
                      obj.count = value.doc_count;
                    }

                    if (defaultSelected) {
                      try {
                        const filtered_selectedTermValue =
                          this.filter_selectedTermValue(
                            selectedValue,
                            obj,
                            tempObj,
                            object,
                            key
                          );

                        obj = filtered_selectedTermValue.obj;
                        tempObj = filtered_selectedTermValue.tempObj;

                        selectedRangeValue.filter((keys) => {
                          // const obj = this.check_rangeQuery(keys);
                          const result =
                            this.diamondSearchService.check_rangeQuery(
                              this._companyService,
                              keys,
                              tempObj['sizeGroups']
                            );

                          const rangeObj = result['tempObj'];

                          if (!!result['searchPara']['caratType']) {
                            setTimeout(() => {
                              this.searchPara['caratType'] =
                                result['searchPara']['caratType'];
                            }, 1000);
                          }

                          tempObj = {
                            ...tempObj,
                            ...rangeObj,
                          };
                        });

                        if (!loopedSelectedCtsRange) {
                          loopedSelectedCtsRange = true;
                          tempObj = this.handle_ctsRange(
                            selectedCtsRange,
                            tempObj
                          );
                        }

                        if (!loopedSelectedFinishing) {
                          loopedSelectedFinishing = true;
                          tempObj = this.handle_finishingsCriteria(
                            finishingsValue,
                            tempObj
                          );
                        }
                      } catch (e) {
                        obj.isRefined = false;
                      }
                    }
                  });

                  return obj;
                } else {
                  if (object[key] == 'fm') {
                    let boolQ = obj.query[0]['bool'];
                    let objQuery = JSON.stringify(boolQ);

                    if (defaultSelected) obj.isRefined = false;

                    fmValues.filter((x) => {
                      let query1 = JSON.stringify(x);
                      if (query1 == objQuery) {
                        obj.isRefined = true;
                      }
                      // else {
                      //   obj.isRefined = false;
                      // }
                    });
                  } else if (
                    object[key] === 'Lotcountry' ||
                    object[key] === 'CutCode' ||
                    object[key] === 'externalStatus'
                  ) {
                  } else {
                    this.searchCount = 0;
                  }

                  if (defaultSelected) {
                    try {
                      const filtered_selectedTermValue =
                        this.filter_selectedTermValue(
                          selectedValue,
                          obj,
                          tempObj,
                          object,
                          key
                        );

                      obj = filtered_selectedTermValue.obj;
                      tempObj = filtered_selectedTermValue.tempObj;

                      selectedRangeValue.filter((keys) => {
                        // const obj = this.check_rangeQuery(keys);
                        const result =
                          this.diamondSearchService.check_rangeQuery(
                            this._companyService,
                            keys,
                            tempObj['sizeGroups']
                          );

                        const obj = result['tempObj'];

                        if (!!result['searchPara']['caratType']) {
                          setTimeout(() => {
                            this.searchPara['caratType'] =
                              result['searchPara']['caratType'];
                          }, 1000);
                        }

                        tempObj = { ...tempObj, ...obj };
                      });

                      if (!loopedSelectedCtsRange) {
                        loopedSelectedCtsRange = true;
                        tempObj = this.handle_ctsRange(
                          selectedCtsRange,
                          tempObj
                        );
                      }

                      if (!loopedSelectedFinishing) {
                        loopedSelectedFinishing = true;
                        tempObj = this.handle_finishingsCriteria(
                          finishingsValue,
                          tempObj
                        );
                      }
                    } catch (e) {
                      obj.isRefined = false;
                    }
                  }
                }
              }));
          }));

        this.searchPara = { ...tempObj };

        setTimeout(() => {
          this.toggleSelection(this.searchPara.location, '', null);
          this.firstLoad = true;
          if (this.resetBtn) this.resetBtn.disabled = false;
          if (this.clearBtn) this.clearBtn.disabled = false;
        }, 700);
      });
  }

  async toggleSelectionPara(para, value) {
    if (para == 'stoneIdORCertSelected') {
      if (this.searchPara.stoneIdORCertSelected == 'stoneId') {
        this.searchPara.stoneIdORCertSelected = 'certNo';
        return;
      } else if (this.searchPara.stoneIdORCertSelected == 'certNo') {
        this.searchPara.stoneIdORCertSelected = 'stoneId';
        return;
      }
    } else if (para == 'colorType') {
      // const cutDivBtn = document.querySelectorAll('.finishingCutDivBtn');
      if (this.searchPara.colorType == 'white') {
        this.searchPara.colorType = 'fancy';
        // cutDivBtn.forEach((btn: any) => {
        // 	btn.classList.add('disabledDivBtn')
        // })
        this.getCount(this.searchQuery(true));
        return;
      } else if (this.searchPara.colorType == 'fancy') {
        this.searchPara.colorType = 'white';
        // cutDivBtn.forEach((btn: any) => {
        // 	btn.classList.remove('disabledDivBtn')
        // })
        this.getCount(this.searchQuery(true));
        return;
      }
    } else if (para == 'caratType') {
      if (this.searchPara.caratType == 'specific') {
        this.searchPara.caratType = 'groups';
        return;
      } else if (this.searchPara.caratType == 'groups') {
        this.searchPara.caratType = 'specific';
        return;
      }
    } else if (para == 'clarityType') {
      this.searchPara.clarityType = value;
      return;
    } else if (para == 'finishingType') {
      this.searchPara.finishingType = value;
      return;
    } else if (para === 'shapeType') {
      if (this.searchPara.shapeType === 'generic') {
        this.searchPara.shapeType = 'eliteCuts';
        return;
      } else if (this.searchPara.shapeType === 'eliteCuts') {
        this.searchPara.shapeType = 'generic';
        return;
      }
    }
    // else if (para == 'shapeType') {
    //   if (this.searchPara.shapeType == 'specific') {
    //     this.searchPara.shapeType = 'others';
    //     return;
    //   } else if (this.searchPara.shapeType == 'others') {
    //     this.searchPara.shapeType = 'specific';
    //     return;
    //   }
    // }
  }

  private update_selectedClaritiesArray = function (
    paraValKey: string,
    paraVal: SearchParameter
  ) {
    const getIndex_selectedClaritiesArray = (): number => {
      return this.selectedClaritiesArray.findIndex(
        (clarityObj: SearchParameter) => {
          const clarityObjKey = Object.keys(clarityObj)[0];
          if (clarityObjKey === paraValKey) {
            return true;
          }
          return false;
        }
      );
    };

    // const idx = this.getIndex_selectedClaritiesArray(paraValKey);
    const idx = getIndex_selectedClaritiesArray();

    idx === -1
      ? this.selectedClaritiesArray.push(paraVal)
      : this.selectedClaritiesArray.splice(idx, 1);
  };

  compareToggleParalistParaval(paraList: any[], paraVal: any[]) {
    return paraList.filter(
      (para) => JSON.stringify(para.value) === JSON.stringify(paraVal)
    );
  }

  toggleSelection(paraList, paraVal, parameter: any = null) {
    // paraList.filter(a => a.value == paraVal)[0].isRefined = !paraList.filter(a => a.value == paraVal)[0].isRefined;
    // if (this.default.displayCount) {
    // 	this.getCount(this.searchQuery(true));
    // }

    if (parameter == 'Color') {
      paraList.map((res) => (res.isRefined = false));
      let firstValue: any;
      if (this.selectedColorsArray.length == 1) {
        if (this.selectedColorsArray[0] == paraVal) {
          this.selectedColorsArray.indexOf(paraVal) === -1
            ? this.selectedColorsArray.push(paraVal)
            : this.selectedColorsArray.splice(
                this.selectedColorsArray.indexOf(paraVal),
                1
              );
        }
        let val1 = this.selectedColorsArray[0];
        let arrayIndex = paraList.findIndex(function (object) {
          return object.value === val1;
        });
        let paraIndex = paraList.findIndex(function (object) {
          return object.value === paraVal;
        });
        if (arrayIndex > paraIndex) {
          this.selectedColorsArray.indexOf(paraVal) === -1
            ? this.selectedColorsArray.push(paraVal)
            : this.selectedColorsArray.splice(
                this.selectedColorsArray.indexOf(paraVal),
                1
              );
        }
        let start = false;
        for (let a in paraList) {
          let val = paraList[a].value;
          let val1 = this.selectedColorsArray[0];
          let checkVal =
            this.selectedColorsArray.indexOf(val) >= 0 ? (start = true) : false;
          if (
            start &&
            this.selectedColorsArray.indexOf(val) === -1 &&
            arrayIndex < paraIndex
          ) {
            if (val != paraVal) {
              this.selectedColorsArray.push(val);
            }
            if (val == paraVal) {
              this.selectedColorsArray.push(val);
              break;
            }
          }
        }
      } else {
        this.selectedColorsArray.indexOf(paraVal) === -1
          ? this.selectedColorsArray.push(paraVal)
          : this.selectedColorsArray.splice(
              this.selectedColorsArray.indexOf(paraVal),
              1
            );
      }
      console.log(this.selectedColorsArray);
      for (let i in this.selectedColorsArray) {
        let val = this.selectedColorsArray[i];
        paraList.filter((a) => a.value == val)[0].isRefined = !paraList.filter(
          (a) => a.value == val
        )[0].isRefined;
      }

      this.getCount(this.searchQuery(true));
    } else if (parameter == 'Clarity') {
      paraList.map((res) => (res.isRefined = false));
      if (this.searchPara.clarityType == 'advanced') {
        if (this.selectedAdvancedClaritiesArray.length == 1) {
          if (this.selectedAdvancedClaritiesArray[0] == paraVal) {
            this.selectedAdvancedClaritiesArray.indexOf(paraVal) === -1
              ? this.selectedAdvancedClaritiesArray.push(paraVal)
              : this.selectedAdvancedClaritiesArray.splice(
                  this.selectedAdvancedClaritiesArray.indexOf(paraVal),
                  1
                );
          }
          let val1 = this.selectedAdvancedClaritiesArray[0];
          let arrayIndex = paraList.findIndex(function (object) {
            return object.value === val1;
          });
          let paraIndex = paraList.findIndex(function (object) {
            return object.value === paraVal;
          });
          if (arrayIndex > paraIndex) {
            this.selectedAdvancedClaritiesArray.indexOf(paraVal) === -1
              ? this.selectedAdvancedClaritiesArray.push(paraVal)
              : this.selectedAdvancedClaritiesArray.splice(
                  this.selectedAdvancedClaritiesArray.indexOf(paraVal),
                  1
                );
          }
          let start = false;
          for (let a in paraList) {
            let val = paraList[a].value;
            let val1 = this.selectedAdvancedClaritiesArray[0];
            let checkVal =
              this.selectedAdvancedClaritiesArray.indexOf(val) >= 0
                ? (start = true)
                : false;
            if (
              start &&
              this.selectedAdvancedClaritiesArray.indexOf(val) === -1 &&
              arrayIndex < paraIndex
            ) {
              if (val != paraVal) {
                this.selectedAdvancedClaritiesArray.push(val);
              }
              if (val == paraVal) {
                this.selectedAdvancedClaritiesArray.push(val);
                break;
              }
            }
          }
        } else {
          this.selectedAdvancedClaritiesArray.indexOf(paraVal) === -1
            ? this.selectedAdvancedClaritiesArray.push(paraVal)
            : this.selectedAdvancedClaritiesArray.splice(
                this.selectedAdvancedClaritiesArray.indexOf(paraVal),
                1
              );
        }
        console.log(this.selectedAdvancedClaritiesArray);
        for (let i in this.selectedAdvancedClaritiesArray) {
          let val = this.selectedAdvancedClaritiesArray[i];
          paraList.filter((a) => a.value == val)[0].isRefined =
            !paraList.filter((a) => a.value == val)[0].isRefined;
        }

        this.getCount(this.searchQuery(true));
      }
      if (this.searchPara.clarityType == 'basic') {
        /*
        if (this.selectedClaritiesArray.length == 1) {
          if (this.selectedClaritiesArray[0] == paraVal) {
            this.selectedClaritiesArray.indexOf(paraVal) === -1
              ? this.selectedClaritiesArray.push(paraVal)
              : this.selectedClaritiesArray.splice(
                  this.selectedClaritiesArray.indexOf(paraVal),
                  1
                );
          }
          let val1 = this.selectedClaritiesArray[0];
          let arrayIndex = paraList.findIndex(function (object) {
            return object.value === val1;
          });
          let paraIndex = paraList.findIndex(function (object) {
            return object.value === paraVal;
          });
          if (arrayIndex > paraIndex) {
            this.selectedClaritiesArray.indexOf(paraVal) === -1
              ? this.selectedClaritiesArray.push(paraVal)
              : this.selectedClaritiesArray.splice(
                  this.selectedClaritiesArray.indexOf(paraVal),
                  1
                );
          }
          let start = false;
          for (let a in paraList) {
            let val = paraList[a].value;
            let val1 = this.selectedClaritiesArray[0];
            let checkVal =
              this.selectedClaritiesArray.indexOf(val) >= 0
                ? (start = true)
                : false;
            if (
              start &&
              this.selectedClaritiesArray.indexOf(val) === -1 &&
              arrayIndex < paraIndex
            ) {
              if (val != paraVal) {
                this.selectedClaritiesArray.push(val);
              }
              if (val == paraVal) {
                this.selectedClaritiesArray.push(val);
                break;
              }
            }
          }
        } else {
          this.selectedClaritiesArray.indexOf(paraVal) === -1
            ? this.selectedClaritiesArray.push(paraVal)
            : this.selectedClaritiesArray.splice(
                this.selectedClaritiesArray.indexOf(paraVal),
                1
              );
        }
        console.log(this.selectedClaritiesArray);
        for (let i in this.selectedClaritiesArray) {
          let val = this.selectedClaritiesArray[i];
          paraList.filter(a => a.value == val)[0].isRefined = !paraList.filter(
            a => a.value == val
          )[0].isRefined;
        }

        */
        const paraValKey = Object.keys(paraVal)[0];

        if (this.selectedClaritiesArray.length == 1) {
          const val = this.selectedClaritiesArray[0];
          const arrayIndex = paraList.findIndex(
            (object: any) => object.value === val
          );
          const paraIndex = paraList.findIndex(
            (object: any) => object.value === paraVal
          );

          if (arrayIndex >= paraIndex) {
            this.update_selectedClaritiesArray(paraValKey, paraVal);
          } else {
            let start = false;
            for (let a in paraList) {
              const val = paraList[a].value;
              this.selectedClaritiesArray.indexOf(val) >= 0 && (start = true);
              if (start && this.selectedClaritiesArray.indexOf(val) === -1) {
                this.selectedClaritiesArray.push(val);
                if (val == paraVal) {
                  break;
                }
              }
            }
          }
        } else {
          this.update_selectedClaritiesArray(paraValKey, paraVal);
        }
        for (let i in this.selectedClaritiesArray) {
          let val = Object.keys(this.selectedClaritiesArray[i])[0];
          paraList.filter((a) => Object.keys(a.value)[0] === val)[0].isRefined =
            !paraList.filter((a) => Object.keys(a.value)[0] === val)[0]
              .isRefined;
        }
        // */

        this.getCount(this.searchQuery(true));
      }
    } else if (parameter == 'Fluorescence') {
      // console.log(parameter);
      paraList.map((res) => (res.isRefined = false));
      let firstValue: any;
      if (this.selectedFluorescenceArray.length == 1) {
        if (this.selectedFluorescenceArray[0] == paraVal) {
          this.selectedFluorescenceArray.indexOf(paraVal) === -1
            ? this.selectedFluorescenceArray.push(paraVal)
            : this.selectedFluorescenceArray.splice(
                this.selectedFluorescenceArray.indexOf(paraVal),
                1
              );
        }
        let val1 = this.selectedFluorescenceArray[0];
        let arrayIndex = paraList.findIndex(function (object) {
          return object.value === val1;
        });
        let paraIndex = paraList.findIndex(function (object) {
          return object.value === paraVal;
        });
        if (arrayIndex > paraIndex) {
          this.selectedFluorescenceArray.indexOf(paraVal) === -1
            ? this.selectedFluorescenceArray.push(paraVal)
            : this.selectedFluorescenceArray.splice(
                this.selectedFluorescenceArray.indexOf(paraVal),
                1
              );
        }
        let start = false;
        for (let a in paraList) {
          let val = paraList[a].value;
          let val1 = this.selectedFluorescenceArray[0];
          let checkVal =
            this.selectedFluorescenceArray.indexOf(val) >= 0
              ? (start = true)
              : false;
          if (
            start &&
            this.selectedFluorescenceArray.indexOf(val) === -1 &&
            arrayIndex < paraIndex
          ) {
            if (val != paraVal) {
              this.selectedFluorescenceArray.push(val);
            }
            if (val == paraVal) {
              this.selectedFluorescenceArray.push(val);
              break;
            }
          }
        }
      } else {
        this.selectedFluorescenceArray.indexOf(paraVal) === -1
          ? this.selectedFluorescenceArray.push(paraVal)
          : this.selectedFluorescenceArray.splice(
              this.selectedFluorescenceArray.indexOf(paraVal),
              1
            );
      }
      console.log(this.selectedFluorescenceArray);
      for (let i in this.selectedFluorescenceArray) {
        let val = this.selectedFluorescenceArray[i];
        paraList.filter((a) => a.value == val)[0].isRefined = !paraList.filter(
          (a) => a.value == val
        )[0].isRefined;
      }

      this.getCount(this.searchQuery(true));
    } else if (parameter == 'Finish') {
      this.searchPara.cuts.map((res) => (res.isRefined = false));
      this.searchPara.polishes.map((res) => (res.isRefined = false));
      this.searchPara.symmetries.map((res) => (res.isRefined = false));

      let selected = paraList.filter((a) => a.value == paraVal)[0].isRefined;
      if (selected) {
        paraList.filter((a) => a.value == paraVal)[0].isRefined =
          !paraList.filter((a) => a.value == paraVal)[0].isRefined;
      } else {
        paraList.map((res) => (res.isRefined = false));
        paraList.filter((a) => a.value == paraVal)[0].isRefined =
          !paraList.filter((a) => a.value == paraVal)[0].isRefined;
      }
      if (paraVal == '3EX') {
        this.searchPara.cuts = this.searchPara.cuts.filter((i) => {
          if (i.label == 'EX') {
            i.isRefined = !selected;
          }
          return i;
        });
        this.searchPara.polishes = this.searchPara.polishes.filter((i) => {
          if (i.label == 'EX') {
            i.isRefined = !selected;
          }
          return i;
        });
        this.searchPara.symmetries = this.searchPara.symmetries.filter((i) => {
          if (i.label == 'EX') {
            i.isRefined = !selected;
          }
          return i;
        });
      }
      if (paraVal == 'IDEAL') {
        this.searchPara.cuts = this.searchPara.cuts.filter((i) => {
          if (i.label == 'EX' || i.label == 'Ideal') {
            i.isRefined = !selected;
          }
          return i;
        });
        this.searchPara.polishes = this.searchPara.polishes.filter((i) => {
          if (i.label == 'EX' || i.label == 'Ideal') {
            i.isRefined = !selected;
          }
          return i;
        });
        this.searchPara.symmetries = this.searchPara.symmetries.filter((i) => {
          if (i.label == 'EX' || i.label == 'Ideal') {
            i.isRefined = !selected;
          }
          return i;
        });
      }

      if (paraVal == 'EX-') {
        this.searchPara.cuts = this.searchPara.cuts.filter((i) => {
          if (i.label == 'EX') {
            i.isRefined = !selected;
          }
          return i;
        });
        this.searchPara.polishes = this.searchPara.polishes.filter((i) => {
          if (
            i.label == 'VG' ||
            i.label == 'EX' ||
            i.label == 'GD' ||
            i.label == 'FR'
          ) {
            i.isRefined = !selected;
          }
          return i;
        });
        this.searchPara.symmetries = this.searchPara.symmetries.filter((i) => {
          if (
            i.label == 'VG' ||
            i.label == 'EX' ||
            i.label == 'GD' ||
            i.label == 'FR'
          ) {
            i.isRefined = !selected;
          }
          return i;
        });
      }

      if (paraVal == 'VG+') {
        this.searchPara.cuts = this.searchPara.cuts.filter((i) => {
          if (i.label == 'VG' || i.label == 'EX') {
            i.isRefined = !selected;
          }
          return i;
        });
        this.searchPara.polishes = this.searchPara.polishes.filter((i) => {
          if (i.label == 'VG' || i.label == 'EX') {
            i.isRefined = !selected;
          }
          return i;
        });
        this.searchPara.symmetries = this.searchPara.symmetries.filter((i) => {
          if (i.label == 'VG' || i.label == 'EX') {
            i.isRefined = !selected;
          }
          return i;
        });
      }

      if (paraVal == 'VG-') {
        this.searchPara.cuts = this.searchPara.cuts.filter((i) => {
          if (i.label == 'VG') {
            i.isRefined = !selected;
          }
          return i;
        });
        this.searchPara.polishes = this.searchPara.polishes.filter((i) => {
          if (i.label == 'VG' || i.label == 'GD' || i.label == 'FR') {
            i.isRefined = !selected;
          }
          return i;
        });
        this.searchPara.symmetries = this.searchPara.symmetries.filter((i) => {
          if (i.label == 'VG' || i.label == 'GD' || i.label == 'FR') {
            i.isRefined = !selected;
          }
          return i;
        });
      }

      if (paraVal == 'GD+') {
        this.searchPara.cuts = this.searchPara.cuts.filter((i) => {
          if (i.label == 'GD') {
            i.isRefined = !selected;
          }
          return i;
        });
        this.searchPara.polishes = this.searchPara.polishes.filter((i) => {
          if (i.label == 'EX' || i.label == 'VG' || i.label == 'GD') {
            i.isRefined = !selected;
          }
          return i;
        });
        this.searchPara.symmetries = this.searchPara.symmetries.filter((i) => {
          if (i.label == 'EX' || i.label == 'VG' || i.label == 'GD') {
            i.isRefined = !selected;
          }
          return i;
        });
      }

      this.getCount(this.searchQuery(true));
    } else {
      if (parameter === 'Shape') {
        if (paraVal[0].toLowerCase().includes('round')) {
          if (this.compareToggleParalistParaval(paraList, paraVal)[0].isRefined)
            this.shapePreferences.isRoundShape = false;
          else this.shapePreferences.isRoundShape = true;
        } else {
          if (this.compareToggleParalistParaval(paraList, paraVal)[0].isRefined)
            this.shapePreferences.isFancyShape = false;
          else this.shapePreferences.isFancyShape = true;
        }

        // if (this.shapePreferences.isRoundShape && this.shapePreferences.isFancyShape) {
        //   this.shapePreferences.isBothShape = true;
        //   this.shapePreferences.isRoundShape = false;
        //   this.shapePreferences.isFancyShape = false;
        // }
      }

      if (
        parameter == 'Cut' ||
        parameter == 'Polish' ||
        parameter == 'Symmetry'
      ) {
        this.searchPara.finishings.map((res) => (res.isRefined = false));
      }

      if (paraVal === 'NO FM INSCRIPTION') this.checkLab_isFirst = false;

      if (!!paraList && paraList.length > 0 && paraVal) {
        paraList.filter((a) => a.value == paraVal)[0].isRefined =
          !paraList.filter((a) => a.value == paraVal)[0].isRefined;
        if (parameter == 'Shape') {
          this.savedShapes = [];
          this.savedShapes = paraList.filter((x) => x.isRefined);
        }
        this.getCount(this.searchQuery(true));
      }
    }
    if (parameter == 'lab') {
    }
  }

  // toggleSelection(paraList, paraVal, parameter: any = null) {
  // 	console.log(paraList)
  // 	if (parameter == "Shape") {
  // 		paraList.map(res => res.isRefined = false)
  // 		let firstValue: any;
  // 		if (this.selectedShapesArray.length == 1) {
  // 			if (this.selectedShapesArray[0] == paraVal) {
  // 				this.selectedShapesArray.indexOf(paraVal) === -1 ? this.selectedShapesArray.push(paraVal) : this.selectedShapesArray.splice(this.selectedShapesArray.indexOf(paraVal), 1);
  // 			}
  // 			let val1 = this.selectedShapesArray[06];
  // 			let arrayIndex = paraList.findIndex(function (object) { return object.value === val1; });
  // 			let paraIndex = paraList.findIndex(function (object) { return object.value === paraVal; });
  // 			if (arrayIndex > paraIndex) {
  // 				this.selectedShapesArray.indexOf(paraVal) === -1 ? this.selectedShapesArray.push(paraVal) : this.selectedShapesArray.splice(this.selectedShapesArray.indexOf(paraVal), 1);
  // 			}
  // 			let start = false
  // 			for (let a in paraList) {
  // 				let val = paraList[a].value
  // 				let val1 = this.selectedShapesArray[0];
  // 				let checkVal = this.selectedShapesArray.indexOf(val) >= 0 ? start = true : false;
  // 				if (start && this.selectedShapesArray.indexOf(val) === -1 && arrayIndex < paraIndex) {
  // 					if (val != paraVal) {
  // 						this.selectedShapesArray.push(val)
  // 					}
  // 					if (val == paraVal) {
  // 						this.selectedShapesArray.push(val)
  // 						break;
  // 					}
  // 				}
  // 			}
  // 		} else {
  // 			this.selectedShapesArray.indexOf(paraVal) === -1 ? this.selectedShapesArray.push(paraVal) : this.selectedShapesArray.splice(this.selectedShapesArray.indexOf(paraVal), 1);
  // 		}
  // 		console.log(this.selectedShapesArray)
  // 		for (let i in this.selectedShapesArray) {
  // 			let val = this.selectedShapesArray[i];
  // 			paraList.filter(a => a.value == val)[0].isRefined = !paraList.filter(a => a.value == val)[0].isRefined;
  // 		}
  // 		if (this.default.displayCount) {
  // 			this.getCount(this.searchQuery(true));
  // 		}
  // 	}
  // 	else if (parameter == "Color") {
  // 		paraList.map(res => res.isRefined = false)
  // 		let firstValue: any;
  // 		if (this.selectedColorsArray.length == 1) {
  // 			if (this.selectedColorsArray[0] == paraVal) {
  // 				this.selectedColorsArray.indexOf(paraVal) === -1 ? this.selectedColorsArray.push(paraVal) : this.selectedColorsArray.splice(this.selectedColorsArray.indexOf(paraVal), 1);
  // 			}
  // 			let val1 = this.selectedColorsArray[0];
  // 			let arrayIndex = paraList.findIndex(function (object) { return object.value === val1; });
  // 			let paraIndex = paraList.findIndex(function (object) { return object.value === paraVal; });
  // 			if (arrayIndex > paraIndex) {
  // 				this.selectedColorsArray.indexOf(paraVal) === -1 ? this.selectedColorsArray.push(paraVal) : this.selectedColorsArray.splice(this.selectedColorsArray.indexOf(paraVal), 1);
  // 			}
  // 			let start = false
  // 			for (let a in paraList) {
  // 				let val = paraList[a].value
  // 				let val1 = this.selectedColorsArray[0];
  // 				let checkVal = this.selectedColorsArray.indexOf(val) >= 0 ? start = true : false;
  // 				if (start && this.selectedColorsArray.indexOf(val) === -1 && arrayIndex < paraIndex) {
  // 					if (val != paraVal) {
  // 						this.selectedColorsArray.push(val)
  // 					}
  // 					if (val == paraVal) {
  // 						this.selectedColorsArray.push(val)
  // 						break;
  // 					}
  // 				}
  // 			}
  // 		} else {
  // 			this.selectedColorsArray.indexOf(paraVal) === -1 ? this.selectedColorsArray.push(paraVal) : this.selectedColorsArray.splice(this.selectedColorsArray.indexOf(paraVal), 1);
  // 		}
  // 		console.log(this.selectedColorsArray)
  // 		for (let i in this.selectedColorsArray) {
  // 			let val = this.selectedColorsArray[i];
  // 			paraList.filter(a => a.value == val)[0].isRefined = !paraList.filter(a => a.value == val)[0].isRefined;
  // 		}
  // 		if (this.default.displayCount) {
  // 			this.getCount(this.searchQuery(true));
  // 		}
  // 	} else if (parameter == "Clarity") {
  // 		paraList.map(res => res.isRefined = false)
  // 		if (this.searchPara.clarityType == 'advanced') {
  // 			if (this.selectedAdvancedClaritiesArray.length == 1) {
  // 				if (this.selectedAdvancedClaritiesArray[0] == paraVal) {
  // 					this.selectedAdvancedClaritiesArray.indexOf(paraVal) === -1 ? this.selectedAdvancedClaritiesArray.push(paraVal) : this.selectedAdvancedClaritiesArray.splice(this.selectedAdvancedClaritiesArray.indexOf(paraVal), 1);
  // 				}
  // 				let val1 = this.selectedAdvancedClaritiesArray[0];
  // 				let arrayIndex = paraList.findIndex(function (object) { return object.value === val1; });
  // 				let paraIndex = paraList.findIndex(function (object) { return object.value === paraVal; });
  // 				if (arrayIndex > paraIndex) {
  // 					this.selectedAdvancedClaritiesArray.indexOf(paraVal) === -1 ? this.selectedAdvancedClaritiesArray.push(paraVal) : this.selectedAdvancedClaritiesArray.splice(this.selectedAdvancedClaritiesArray.indexOf(paraVal), 1);
  // 				}
  // 				let start = false;
  // 				for (let a in paraList) {
  // 					let val = paraList[a].value;
  // 					let val1 = this.selectedAdvancedClaritiesArray[0];
  // 					let checkVal = this.selectedAdvancedClaritiesArray.indexOf(val) >= 0 ? start = true : false;
  // 					if (start && this.selectedAdvancedClaritiesArray.indexOf(val) === -1 && arrayIndex < paraIndex) {
  // 						if (val != paraVal) {
  // 							this.selectedAdvancedClaritiesArray.push(val)
  // 						}
  // 						if (val == paraVal) {
  // 							this.selectedAdvancedClaritiesArray.push(val)
  // 							break;
  // 						}
  // 					}
  // 				}
  // 			} else {
  // 				this.selectedAdvancedClaritiesArray.indexOf(paraVal) === -1 ? this.selectedAdvancedClaritiesArray.push(paraVal) : this.selectedAdvancedClaritiesArray.splice(this.selectedAdvancedClaritiesArray.indexOf(paraVal), 1);
  // 			}
  // 			console.log(this.selectedAdvancedClaritiesArray)
  // 			for (let i in this.selectedAdvancedClaritiesArray) {
  // 				let val = this.selectedAdvancedClaritiesArray[i];
  // 				paraList.filter(a => a.value == val)[0].isRefined = !paraList.filter(a => a.value == val)[0].isRefined;
  // 			}
  // 			if (this.default.displayCount) {
  // 				this.getCount(this.searchQuery(true));
  // 			}
  // 		}
  // 		if (this.searchPara.clarityType == 'basic') {
  // 			if (this.selectedClaritiesArray.length == 1) {
  // 				if (this.selectedClaritiesArray[0] == paraVal) {
  // 					this.selectedClaritiesArray.indexOf(paraVal) === -1 ? this.selectedClaritiesArray.push(paraVal) : this.selectedClaritiesArray.splice(this.selectedClaritiesArray.indexOf(paraVal), 1);
  // 				}
  // 				let val1 = this.selectedClaritiesArray[0];
  // 				let arrayIndex = paraList.findIndex(function (object) { return object.value === val1; });
  // 				let paraIndex = paraList.findIndex(function (object) { return object.value === paraVal; });
  // 				if (arrayIndex > paraIndex) {
  // 					this.selectedClaritiesArray.indexOf(paraVal) === -1 ? this.selectedClaritiesArray.push(paraVal) : this.selectedClaritiesArray.splice(this.selectedClaritiesArray.indexOf(paraVal), 1);
  // 				}
  // 				let start = false;
  // 				for (let a in paraList) {
  // 					let val = paraList[a].value;
  // 					let val1 = this.selectedClaritiesArray[0];
  // 					let checkVal = this.selectedClaritiesArray.indexOf(val) >= 0 ? start = true : false;
  // 					if (start && this.selectedClaritiesArray.indexOf(val) === -1 && arrayIndex < paraIndex) {
  // 						if (val != paraVal) {
  // 							this.selectedClaritiesArray.push(val)
  // 						}
  // 						if (val == paraVal) {
  // 							this.selectedClaritiesArray.push(val)
  // 							break;
  // 						}
  // 					}
  // 				}
  // 			} else {
  // 				this.selectedClaritiesArray.indexOf(paraVal) === -1 ? this.selectedClaritiesArray.push(paraVal) : this.selectedClaritiesArray.splice(this.selectedClaritiesArray.indexOf(paraVal), 1);
  // 			}
  // 			console.log(this.selectedClaritiesArray)
  // 			for (let i in this.selectedClaritiesArray) {
  // 				let val = this.selectedClaritiesArray[i];
  // 				paraList.filter(a => a.value == val)[0].isRefined = !paraList.filter(a => a.value == val)[0].isRefined;
  // 			}
  // 			if (this.default.displayCount) {
  // 				this.getCount(this.searchQuery(true));
  // 			}
  // 		}
  // 	} else if (parameter == "Fluorescence") {
  // 		paraList.map(res => res.isRefined = false)
  // 		let firstValue: any;
  // 		if (this.selectedFluorescenceArray.length == 1) {
  // 			if (this.selectedFluorescenceArray[0] == paraVal) {
  // 				this.selectedFluorescenceArray.indexOf(paraVal) === -1 ? this.selectedFluorescenceArray.push(paraVal) : this.selectedFluorescenceArray.splice(this.selectedFluorescenceArray.indexOf(paraVal), 1);
  // 			}
  // 			let val1 = this.selectedFluorescenceArray[0];
  // 			let arrayIndex = paraList.findIndex(function (object) { return object.value === val1; });
  // 			let paraIndex = paraList.findIndex(function (object) { return object.value === paraVal; });
  // 			if (arrayIndex > paraIndex) {
  // 				this.selectedFluorescenceArray.indexOf(paraVal) === -1 ? this.selectedFluorescenceArray.push(paraVal) : this.selectedFluorescenceArray.splice(this.selectedFluorescenceArray.indexOf(paraVal), 1);
  // 			}
  // 			let start = false
  // 			for (let a in paraList) {
  // 				let val = paraList[a].value
  // 				let val1 = this.selectedFluorescenceArray[0];
  // 				let checkVal = this.selectedFluorescenceArray.indexOf(val) >= 0 ? start = true : false;
  // 				if (start && this.selectedFluorescenceArray.indexOf(val) === -1 && arrayIndex < paraIndex) {
  // 					if (val != paraVal) {
  // 						this.selectedFluorescenceArray.push(val)
  // 					}
  // 					if (val == paraVal) {
  // 						this.selectedFluorescenceArray.push(val)
  // 						break;
  // 					}
  // 				}
  // 			}
  // 		} else {
  // 			this.selectedFluorescenceArray.indexOf(paraVal) === -1 ? this.selectedFluorescenceArray.push(paraVal) : this.selectedFluorescenceArray.splice(this.selectedFluorescenceArray.indexOf(paraVal), 1);
  // 		}
  // 		console.log(this.selectedFluorescenceArray)
  // 		for (let i in this.selectedFluorescenceArray) {
  // 			let val = this.selectedFluorescenceArray[i];
  // 			paraList.filter(a => a.value == val)[0].isRefined = !paraList.filter(a => a.value == val)[0].isRefined;
  // 		}
  // 		if (this.default.displayCount) {
  // 			this.getCount(this.searchQuery(true));
  // 		}
  // 	} else if (parameter == "Cut") {
  // 		//make finish unselect
  // 		this.selectedFinishArray.length = 0;
  // 		this.searchPara.finishings.map(res => res.isRefined = false)
  // 		//--------------//
  // 		paraList.map(res => res.isRefined = false)
  // 		let firstValue: any;
  // 		if (this.selectedCutArray.length == 1) {
  // 			if (this.selectedCutArray[0] == paraVal) {
  // 				this.selectedCutArray.indexOf(paraVal) === -1 ? this.selectedCutArray.push(paraVal) : this.selectedCutArray.splice(this.selectedCutArray.indexOf(paraVal), 1);
  // 			}
  // 			let val1 = this.selectedCutArray[0];
  // 			let arrayIndex = paraList.findIndex(function (object) { return object.value === val1; });
  // 			let paraIndex = paraList.findIndex(function (object) { return object.value === paraVal; });
  // 			if (arrayIndex > paraIndex) {
  // 				this.selectedCutArray.indexOf(paraVal) === -1 ? this.selectedCutArray.push(paraVal) : this.selectedCutArray.splice(this.selectedCutArray.indexOf(paraVal), 1);
  // 			}
  // 			let start = false
  // 			for (let a in paraList) {
  // 				let val = paraList[a].value
  // 				let val1 = this.selectedCutArray[0];
  // 				let checkVal = this.selectedCutArray.indexOf(val) >= 0 ? start = true : false;
  // 				if (start && this.selectedCutArray.indexOf(val) === -1 && arrayIndex < paraIndex) {
  // 					if (val != paraVal) {
  // 						this.selectedCutArray.push(val)
  // 					}
  // 					if (val == paraVal) {
  // 						this.selectedCutArray.push(val)
  // 						break;
  // 					}
  // 				}
  // 			}
  // 		} else {
  // 			this.selectedCutArray.indexOf(paraVal) === -1 ? this.selectedCutArray.push(paraVal) : this.selectedCutArray.splice(this.selectedCutArray.indexOf(paraVal), 1);
  // 		}
  // 		console.log(this.selectedCutArray)
  // 		for (let i in this.selectedCutArray) {
  // 			let val = this.selectedCutArray[i];
  // 			paraList.filter(a => a.value == val)[0].isRefined = !paraList.filter(a => a.value == val)[0].isRefined;
  // 		}
  // 		if (this.default.displayCount) {
  // 			this.getCount(this.searchQuery(true));
  // 		}
  // 	} else if (parameter == "Polish") {
  // 		//make finish unselect
  // 		this.selectedFinishArray.length = 0;
  // 		this.searchPara.finishings.map(res => res.isRefined = false)
  // 		//--------------//
  // 		paraList.map(res => res.isRefined = false)
  // 		let firstValue: any;
  // 		if (this.selectedPolishArray.length == 1) {
  // 			if (this.selectedPolishArray[0] == paraVal) {
  // 				this.selectedPolishArray.indexOf(paraVal) === -1 ? this.selectedPolishArray.push(paraVal) : this.selectedPolishArray.splice(this.selectedPolishArray.indexOf(paraVal), 1);
  // 			}
  // 			let val1 = this.selectedPolishArray[0];
  // 			let arrayIndex = paraList.findIndex(function (object) { return object.value === val1; });
  // 			let paraIndex = paraList.findIndex(function (object) { return object.value === paraVal; });
  // 			if (arrayIndex > paraIndex) {
  // 				this.selectedPolishArray.indexOf(paraVal) === -1 ? this.selectedPolishArray.push(paraVal) : this.selectedPolishArray.splice(this.selectedPolishArray.indexOf(paraVal), 1);
  // 			}
  // 			let start = false
  // 			for (let a in paraList) {
  // 				let val = paraList[a].value
  // 				let val1 = this.selectedPolishArray[0];
  // 				let checkVal = this.selectedPolishArray.indexOf(val) >= 0 ? start = true : false;
  // 				if (start && this.selectedPolishArray.indexOf(val) === -1 && arrayIndex < paraIndex) {
  // 					if (val != paraVal) {
  // 						this.selectedPolishArray.push(val)
  // 					}
  // 					if (val == paraVal) {
  // 						this.selectedPolishArray.push(val)
  // 						break;
  // 					}
  // 				}
  // 			}
  // 		} else {
  // 			this.selectedPolishArray.indexOf(paraVal) === -1 ? this.selectedPolishArray.push(paraVal) : this.selectedPolishArray.splice(this.selectedPolishArray.indexOf(paraVal), 1);
  // 		}
  // 		console.log(this.selectedPolishArray)
  // 		for (let i in this.selectedPolishArray) {
  // 			let val = this.selectedPolishArray[i];
  // 			paraList.filter(a => a.value == val)[0].isRefined = !paraList.filter(a => a.value == val)[0].isRefined;
  // 		}
  // 		if (this.default.displayCount) {
  // 			this.getCount(this.searchQuery(true));
  // 		}
  // 	} else if (parameter == "Symmetry") {
  // 		//make finish unselect
  // 		this.selectedFinishArray.length = 0;
  // 		this.searchPara.finishings.map(res => res.isRefined = false)
  // 		//--------------//
  // 		paraList.map(res => res.isRefined = false)
  // 		let firstValue: any;
  // 		if (this.selectedSymmetryArray.length == 1) {
  // 			if (this.selectedSymmetryArray[0] == paraVal) {
  // 				this.selectedSymmetryArray.indexOf(paraVal) === -1 ? this.selectedSymmetryArray.push(paraVal) : this.selectedSymmetryArray.splice(this.selectedSymmetryArray.indexOf(paraVal), 1);
  // 			}
  // 			let val1 = this.selectedSymmetryArray[0];
  // 			let arrayIndex = paraList.findIndex(function (object) { return object.value === val1; });
  // 			let paraIndex = paraList.findIndex(function (object) { return object.value === paraVal; });
  // 			if (arrayIndex > paraIndex) {
  // 				this.selectedSymmetryArray.indexOf(paraVal) === -1 ? this.selectedSymmetryArray.push(paraVal) : this.selectedSymmetryArray.splice(this.selectedSymmetryArray.indexOf(paraVal), 1);
  // 			}
  // 			let start = false
  // 			for (let a in paraList) {
  // 				let val = paraList[a].value
  // 				let val1 = this.selectedSymmetryArray[0];
  // 				let checkVal = this.selectedSymmetryArray.indexOf(val) >= 0 ? start = true : false;
  // 				if (start && this.selectedSymmetryArray.indexOf(val) === -1 && arrayIndex < paraIndex) {
  // 					if (val != paraVal) {
  // 						this.selectedSymmetryArray.push(val)
  // 					}
  // 					if (val == paraVal) {
  // 						this.selectedSymmetryArray.push(val)
  // 						break;
  // 					}
  // 				}
  // 			}
  // 		} else {
  // 			this.selectedSymmetryArray.indexOf(paraVal) === -1 ? this.selectedSymmetryArray.push(paraVal) : this.selectedSymmetryArray.splice(this.selectedSymmetryArray.indexOf(paraVal), 1);
  // 		}
  // 		console.log(this.selectedSymmetryArray)
  // 		for (let i in this.selectedSymmetryArray) {
  // 			let val = this.selectedSymmetryArray[i];
  // 			paraList.filter(a => a.value == val)[0].isRefined = !paraList.filter(a => a.value == val)[0].isRefined;
  // 		}
  // 		if (this.default.displayCount) {
  // 			this.getCount(this.searchQuery(true));
  // 		}
  // 	} else if (parameter == "Finish") {
  // 		paraList.map(res => res.isRefined = false)
  // 		//make cut, polish, symmetry unselect
  // 		this.selectedCutArray.length = 0;
  // 		this.selectedPolishArray.length = 0;
  // 		this.selectedSymmetryArray.length = 0;
  // 		this.searchPara.cuts.map(res => res.isRefined = false)
  // 		this.searchPara.polishes.map(res => res.isRefined = false)
  // 		this.searchPara.symmetries.map(res => res.isRefined = false)
  // 		//--------------//
  // 		let firstValue: any;
  // 		if (this.selectedFinishArray.length == 1) {
  // 			if (this.selectedFinishArray[0] == paraVal) {
  // 				this.selectedFinishArray.indexOf(paraVal) === -1 ? this.selectedFinishArray.push(paraVal) : this.selectedFinishArray.splice(this.selectedFinishArray.indexOf(paraVal), 1);
  // 			}
  // 			let val1 = this.selectedFinishArray[0];
  // 			let arrayIndex = paraList.findIndex(function (object) { return object.value === val1; });
  // 			let paraIndex = paraList.findIndex(function (object) { return object.value === paraVal; });
  // 			if (arrayIndex > paraIndex) {
  // 				this.selectedFinishArray.indexOf(paraVal) === -1 ? this.selectedFinishArray.push(paraVal) : this.selectedFinishArray.splice(this.selectedFinishArray.indexOf(paraVal), 1);
  // 			}
  // 			let start = false
  // 			for (let a in paraList) {
  // 				let val = paraList[a].value
  // 				let val1 = this.selectedFinishArray[0];
  // 				let checkVal = this.selectedFinishArray.indexOf(val) >= 0 ? start = true : false;
  // 				if (start && this.selectedFinishArray.indexOf(val) === -1 && arrayIndex < paraIndex) {
  // 					if (val != paraVal) {
  // 						this.selectedFinishArray.push(val)
  // 					}
  // 					if (val == paraVal) {
  // 						this.selectedFinishArray.push(val)
  // 						break;
  // 					}
  // 				}
  // 			}
  // 		} else {
  // 			this.selectedFinishArray.indexOf(paraVal) === -1 ? this.selectedFinishArray.push(paraVal) : this.selectedFinishArray.splice(this.selectedFinishArray.indexOf(paraVal), 1);
  // 		}
  // 		console.log(this.selectedFinishArray)
  // 		for (let i in this.selectedFinishArray) {
  // 			let val = this.selectedFinishArray[i];
  // 			paraList.filter(a => a.value == val)[0].isRefined = !paraList.filter(a => a.value == val)[0].isRefined;
  // 		}
  // 		if (this.default.displayCount) {
  // 			this.getCount(this.searchQuery(true));
  // 		}
  // 	} else {
  // 		paraList.filter(a => a.value == paraVal)[0].isRefined = !paraList.filter(a => a.value == paraVal)[0].isRefined;
  // 		if (this.default.displayCount) {
  // 			this.getCount(this.searchQuery(true));
  // 		}
  // 	}
  // 	// paraList.filter(a => a.value == paraVal)[0].isRefined = !paraList.filter(a => a.value == paraVal)[0].isRefined;
  // 	// if (this.default.displayCount) {
  // 	// 	this.getCount(this.searchQuery(true));
  // 	// }
  // }

  private selectedGirdleChanges() {
    if (!!this.searchPara.selectedGirdleFrom) {
      if (!!this.searchPara.selectedGirdleTo) {
        if (
          this.searchPara.selectedGirdleFrom.value !==
          this.searchPara.selectedGirdleTo.value
        ) {
          this.searchPara.selectedGirdle = `${this.searchPara.selectedGirdleFrom.value} TO ${this.searchPara.selectedGirdleTo.value}`;
        } else {
          this.searchPara.selectedGirdle =
            this.searchPara.selectedGirdleFrom.value;
        }
      } else {
        this.searchPara.selectedGirdle =
          this.searchPara.selectedGirdleFrom.value;
      }
    } else if (!!this.searchPara.selectedGirdleTo) {
      if (!!this.searchPara.selectedGirdleFrom) {
        if (
          this.searchPara.selectedGirdleFrom.value !==
          this.searchPara.selectedGirdleTo.value
        ) {
          this.searchPara.selectedGirdle = `${this.searchPara.selectedGirdleFrom.value} TO ${this.searchPara.selectedGirdleTo.value}`;
        } else {
          this.searchPara.selectedGirdle =
            this.searchPara.selectedGirdleFrom.value;
        }
      }
    }
  }

  private getSelected(selected, qry: any = {}) {
    let match = qry.query.bool.should
      .map((res) => Object.keys(res)[0])
      .indexOf('bool');
    let matches = qry.query.bool.should[match].bool.must.map(
      (res) => Object.keys(res.terms)[0]
    );

    let fixedParameter = [];
    Object.keys(selected).filter((signal) => {
      let matchMatch = matches.indexOf(signal);
      if (matchMatch != -1) {
        let obj = {
          terms: {},
        };
        let old =
          qry.query.bool.should[match].bool.must[matchMatch].terms[signal] ||
          [];
        let newObj = selected || [];
        obj.terms[signal] = old
          .concat(newObj)
          .filter((v, i, a) => a.indexOf(v) === i);
        qry.query.bool.should[match].bool.must[matchMatch] = obj;
      } else {
        let obj = {
          terms: {},
        };
        obj.terms[signal] = selected[signal];
        qry.query.bool.should[match].bool.must.push(obj);
      }
      fixedParameter.push({
        key: signal,
        values: selected[signal],
      });
    });
    return qry;
  }

  searchQuery(qryReturn = false) {
    let array_selected = {};

    if (!!this.userData && !!this.userData.name && !!this.userData.username) {
      array_selected['username'] = this.userData.name;
      array_selected['user'] = this.userData.username;
    }

    let qry: any = {
      query: {
        bool: {
          should: [
            {
              simple_query_string: {
                query: '',
              },
            },
            {
              bool: {
                must: [],
                must_not: [
                  {
                    bool: {
                      should: [
                        {
                          term: {
                            internalStatus: 'sold',
                          },
                        },
                        {
                          term: {
                            Shape: 'ASHOKA',
                          },
                        },
                      ],
                    },
                  },
                  {
                    bool: {
                      must: [
                        {
                          term: {
                            location: 'aspecony',
                          },
                        },
                        {
                          term: {
                            externalStatus: 'On Memo',
                          },
                        },
                      ],
                    },
                  },
                ],
                // must_not: [
                //   // {"term": {"availableForSale": 0}},
                //   // {"term": {"availableForSale": ""}},
                //   // {"term": {"availableForSale": "null"}},
                //   {
                //     match: {
                //       internalStatus: 'Sold',
                //     },
                //   },
                //   {
                //     match: {
                //       ShapeCode: 'ASHOKA',
                //     },
                //   },
                // ],
                should: [],
              },
            },
          ],
        },
      },
      _source: {
        //"include": [ "obj1.*", "obj2.*" ],
        exclude: this.excludeParameters,
      },
      sort: [],
      //"_source": ["stoneName", "lab", "ShapeCode", "cts", "ColorCode", "ClarityCode", "CutCode", "PolishCode", "SymmetryCode", "FluorescenceCode", "Rapnet_plusDiscountPercent", "Rapnet_pluspercarat", "Rapnet_plus", "RAPAPORTpercarat", "externalStatus"]
    };

    try {
      qry = this.getSelected(
        (this.query && this.query.disjunctiveFacetsRefinements) || {},
        qry
      );
    } catch (e) {
      console.error('An error occurred while getting selected:', e);
      // Set a default value for qry or handle the error in some other way
      qry = defaultValue; // Replace defaultValue with the value you want to use as a fallback
    }
    //for pricing greater than 0
    let rapnetFilter = {
      range: {},
    };

    console.log(this.kgPricing);
    rapnetFilter['range'][this.kgPricing] = {
      gt: 0,
    };
    qry.query.bool.should[1].bool.must.push(rapnetFilter);

    const transTypeFilter = {
      terms: {
        transType: ['SS'],
      },
    };

    const departmentFilter = {
      terms: {
        department: ['Sales', 'KAM Sales'],
      },
    };

    let availableStoneFilter = {
      match: {
        availableForSale: 1,
      },
    };
    qry.query.bool.should[1].bool.must.push(
      availableStoneFilter,
      transTypeFilter,
      departmentFilter
    );

    let object = {};

    if (this.default.shape) {
      object['advancedShapes'] = 'ShapeCode';
    }
    if (this.default.shape) {
      object['shapes'] = 'ShapeCode';
    }
    if (this.default.fluorescence) {
      object['fluorescences'] = 'FluorescenceCode';
    }
    if (this.default.lab) {
      object['labs'] = 'lab';
    }
    if (this.default.users) {
      object['Users'] = 'username';
    }
    if (this.default.size) {
      object['AllSize'] = 'Size';
    }
    if (this.default.location) {
      object['location'] = 'location';
    }
    if (this.default.internalStatus) {
      object['InternalStatus'] = 'internalStatus';
    }
    if (this.default.transType) {
      object['TransType'] = 'transType';
    }
    if (this.default.box) {
      object['Box'] = 'Box';
    }
    if (this.default.department) {
      object['Department'] = 'department';
    }
    if (this.default.externalStatus) {
      object['externalStatus'] = 'externalStatus';
    }
    if (this.default.fm) {
      object['fm'] = 'fm';
    }

    if (this.default.traceabilityProtocol) {
      object['traceabilityProtocol'] = 'traceabilityProtocol';
    }
    // console.log(this.searchPara);
    let searchPara = this.searchPara;
    let esTermsQuery = this.esTermsQuery;

    Object.keys(object).filter((res) => {
      console.log(res);
      if (searchPara[res]) {
        console.log(searchPara[res]);

        let tmps = searchPara[res].filter((a) => a.isRefined == true);
        if (!!tmps && tmps.length > 0) {
          let qryObjects = tmps.filter((t) => t.query);
          if (qryObjects && qryObjects.length > 0) {
            for (let qo of qryObjects) {
              for (let q of qo.query) {
                if (res == 'traceabilityProtocol' || res == 'diamondType') {
                  let index = qry.query.bool.should[1].bool.must.find(
                    (x) => x.bool?.should
                  );
                  if (!index) {
                    let obj = {
                      bool: {
                        should: [],
                      },
                    };
                    obj.bool.should.push(q);
                    qry.query.bool.should[1].bool.must.push(obj);
                  } else {
                    qry.query.bool.should[1].bool.must
                      .filter((x) => x.bool?.should)[0]
                      .bool.should.push(q);
                    console.log(qry.query.bool.should[1].bool.must);
                  }
                } else {
                  qry.query.bool.should[1].bool.must.push(q);
                }
              }
            }
          }
          let withoutQryObjects = tmps.filter((t) => !t.query);
          if (!!withoutQryObjects && withoutQryObjects.length > 0) {
            let termsQry: any = this.esTermsQuery(object[res], tmps);
            console.log(termsQry);
            if (res == 'labs') {
              if (!termsQry) {
                /*|||||||||||||| MERGED KG-LAB AND NONE-CERT ||||||||||||||*/
                const noneCertObj = {
                  bool: {
                    should: [
                      {
                        terms: {
                          lab: ['KGLAB', 'KGSU', 'NCSS'],
                        },
                      },
                      {
                        bool: {
                          must_not: {
                            exists: {
                              field: 'lab',
                            },
                          },
                        },
                      },
                    ],
                  },
                };

                qry.query.bool.should[1].bool.must.push(noneCertObj);
                //qry.query.bool.should.push(nonCertObj);
              } else {
                let checkNonCert = tmps
                  .map((x) => x.value)
                  .filter((n) => n == 'NONE CERT');
                let arrayLab = [];
                if (checkNonCert.length > 0) {
                  let n = tmps.flatMap((x) =>
                    x.value !== 'NONE CERT' ? x.value : []
                  );

                  let obj2 = {
                    bool: {
                      should: [
                        {
                          terms: {
                            lab: n,
                          },
                        },
                        {
                          bool: {
                            must_not: {
                              exists: {
                                field: 'lab',
                              },
                            },
                          },
                        },
                      ],
                    },
                  };
                  qry.query.bool.should[1].bool.must.push(obj2);
                } else {
                  qry.query.bool.should[1].bool.must.push(termsQry);
                }
              }
            }

            //mixpanel
            else if (termsQry) {
              array_selected['shape'] = termsQry.terms.ShapeCode;
              if (res == 'labs') {
                let checkLab = qry.query.bool.should[1].bool.must.filter(
                  (x) => {
                    if (!!x.terms && !!x.terms.lab && x.terms.lab.length > 0) {
                      return x;
                    }
                  }
                );
                if (checkLab.length > 0) {
                  qry.query.bool.should[1].bool.must.map((x) => {
                    if (!!x.terms && x.terms.lab.length > 0) {
                      let labs = termsQry.terms.lab;

                      for (let l of labs) {
                        x.terms.lab.push(l);
                      }
                    }
                  });
                } else {
                  qry.query.bool.should[1].bool.must.push(termsQry);
                }
              } else {
                qry.query.bool.should[1].bool.must.push(termsQry);
              }
            }
            let shapeObj = tmps.find(
              (item) => item.value == 'CUSHION Brilliant'
            );
            if (shapeObj) {
              let matchObj = {
                match: {
                  'ShapeDescription.keyword': 'Cushion Brilliant',
                },
              };

              if (qry.query.bool.should[1].bool.must.length > 0) {
                qry.query.bool.should[1].bool.must.push(matchObj);
              } else {
                qry.query.bool.should[1].bool.must.push(matchObj);
              }
            }
          } else {
            return;
          }
        }
      }
    });

    if (this.searchPara.colorType == 'fancy') {
      let obj: any = {
        match: {
          ColorCode: 'FANCY',
        },
      };
      qry.query.bool.should[1].bool.must.push(obj);
    } else {
      let obj: any = {
        match: {
          ColorCode: 'FANCY',
        },
      };
      qry.query.bool.should[1].bool.must_not.push(obj);
    }

    if (
      this.searchPara.stoneIdORCertSelected == 'stoneId' &&
      !!this.searchPara.stoneId &&
      this.searchPara.stoneId.length > 0
    ) {
      let tmp = this.searchPara.stoneId.split('\n');

      //mixpanel
      array_selected['stoneID'] = tmp[0];
      //this.analyticsService.addEvents('Search', array_selected)
      let boolShouldMultiple = {
        bool: {
          must: [],
        },
      };
      let prefixObj: any = {};
      prefixObj = {
        terms: {
          stoneName: [],
        },
      };
      for (let i = 0; i < tmp.length; i++) {
        if (tmp[i] != '') {
          prefixObj['terms']['stoneName'].push(tmp[i].trim().toUpperCase());
        }
      }
      boolShouldMultiple.bool.must.push(prefixObj);
      console.log(boolShouldMultiple.bool.must);
      qry.query.bool.should[1].bool.must.push(boolShouldMultiple);
    }

    if (
      this.searchPara.stoneIdORCertSelected == 'certNo' &&
      !!this.searchPara.certNo &&
      this.searchPara.certNo.length > 0
    ) {
      let tmp = this.searchPara.certNo.split('\n');
      array_selected['Cret No'] = tmp[0];
      for (let i = 0; i < tmp.length; i++) {
        qry.query.bool.should[1].bool.must.push({
          terms: {
            ReportNo: tmp,
          },
        });
      }
    }

    // carat - specific
    if (this.searchPara.caratType == 'specific') {
      if (!!this.searchPara.specificCaratGroup.length) {
        let rangeArr = [];
        this.searchPara.specificCaratGroup.forEach(
          (group: { from: string; to: string }) => {
            let rangeQry = this.esRangeQuery('cts', group.from, group.to);
            if (!!rangeQry) rangeArr.push(rangeQry);
          }
        );

        if (rangeArr.length > 0) {
          if (rangeArr.length > 1) {
            let boolShould = {
              bool: {
                should: rangeArr,
              },
            };
            qry.query.bool.should[1].bool.must.push(boolShould);
          } else {
            qry.query.bool.should[1].bool.must.push(rangeArr[0]);
          }
        }
      } else {
        let rangeQry = this.esRangeQuery(
          'cts',
          this.searchPara.fromCarat,
          this.searchPara.toCarat
        );

        if (!!rangeQry) {
          array_selected['caratType'] = rangeQry.range;
          qry.query.bool.should[1].bool.must.push(rangeQry);
        }
      }
    }

    // carat - groups
    if (this.searchPara.caratType == 'groups') {
      let tmp = this.searchPara.sizeGroups.filter((a) => a.isRefined == true);
      if (tmp.length) {
        array_selected['caratType'] = tmp[0].id;
      }

      let rangeArr = [];
      for (let i = 0; i < tmp.length; i++) {
        let rangeQry = this.esRangeQuery('cts', tmp[i].from, tmp[i].to);
        if (!!rangeQry) rangeArr.push(rangeQry);
      }

      if (rangeArr.length > 0) {
        if (rangeArr.length > 1) {
          let boolShould = {
            bool: {
              should: rangeArr,
            },
          };
          qry.query.bool.should[1].bool.must.push(boolShould);
        } else {
          qry.query.bool.should[1].bool.must.push(rangeArr[0]);
        }
      }
    }

    //colors
    if (this.searchPara.colorType == 'white') {
      let tmp = this.searchPara.colors.filter((a) => a.isRefined == true);
      if (!!tmp && tmp.length > 0) {
        let arr_white = [];
        for (let i = 0; i < tmp.length; i++) {
          arr_white.push(tmp[i].id);
        }
        array_selected['color'] = arr_white;
        let termsQry = this.esTermsQuery('ColorCode', tmp);
        qry.query.bool.should[1].bool.must.push(termsQry);
      }
    }

    let tmp = [];
    // color - fancy
    if (this.searchPara.colorType == 'fancy') {
      let obj_spec = {};
      if (
        !!this.searchPara.selectedFancyColorIntensity.length ||
        !!this.searchPara.selectedFancyColorOvertone.length ||
        !!this.searchPara.selectedFancyColor.length
      ) {
        // fancy color intensity
        if (!!this.searchPara.selectedFancyColorIntensity.length) {
          if (
            this.searchPara.selectedFancyColorIntensity.some(
              (intensity: any) => intensity.value == 'ALL'
            )
          ) {
            tmp = this.searchPara.fancyColorIntensities.filter(
              (a) => a.value != 'ALL'
            );
            //mixpanel
            let arr_specific = [];
            for (let i = 0; i < tmp.length; i++) {
              arr_specific.push(tmp[i].label);
            }
            obj_spec['Intensity'] = arr_specific;
          } else {
            tmp = this.searchPara.fancyColorIntensities.filter(
              (a) => a.isRefined
            );
            obj_spec['Intensity'] = tmp[0].label;
          }
          if (!!tmp && tmp.length > 0) {
            let termsQry = this.esTermsQuery('FancyColorIntensityCode', tmp);
            qry.query.bool.should[1].bool.must.push(termsQry);
          }
        }

        // fancy color overtone
        if (!!this.searchPara.selectedFancyColorOvertone.length) {
          if (
            this.searchPara.selectedFancyColorOvertone.some(
              (overtone: any) => overtone.value == 'ALL'
            )
          ) {
            tmp = this.searchPara.fancyColorOvertones.filter(
              (a) => a.value != 'ALL'
            );
            //mixpanel
            let arr_specific = [];
            for (let i = 0; i < tmp.length; i++) {
              arr_specific.push(tmp[i].label);
            }
            obj_spec['Overtones'] = arr_specific;
          } else {
            tmp = this.searchPara.fancyColorOvertones.filter(
              (a) => a.isRefined
            );
            obj_spec['Overtones'] = tmp[0].label;
          }

          if (!!tmp && tmp.length > 0) {
            let termsQry = this.esTermsQuery('FancyColorOvertoneCode', tmp);
            qry.query.bool.should[1].bool.must.push(termsQry);
          }
        }

        // fancy color
        if (!!this.searchPara.selectedFancyColor.length) {
          let tmp = this.searchPara.fancyColors.filter((a) => a.isRefined);
          if (!!tmp && tmp.length > 0) {
            obj_spec['Color'] = tmp[0].label;
            let termsQry = this.esTermsQuery('FancyColorCode', tmp);
            qry.query.bool.should[1].bool.must.push(termsQry);
          }
        }
      } else {
        let tmp = this.searchPara.fancyColorIntensities.filter(
          (a) => a.isRefined == true
        );

        if (!!tmp && tmp.length > 0) {
          if (tmp.filter((t) => t.value == 'ALL').length > 0) {
            tmp = this.searchPara.fancyColorIntensities.filter(
              (a) => a.value != 'ALL'
            );
          }
          let termsQry = this.esTermsQuery('FancyColorIntensityCode', tmp);
          qry.query.bool.should[1].bool.must.push(termsQry);
        }

        let tmp1 = this.searchPara.fancyColorOvertones.filter(
          (a) => a.isRefined == true
        );
        if (!!tmp1 && tmp1.length > 0) {
          if (tmp1.filter((t) => t.value == 'ALL').length > 0) {
            tmp1 = this.searchPara.fancyColorOvertones.filter(
              (a) => a.value != 'ALL'
            );
          }
          let termsQry = this.esTermsQuery('FancyColorOvertoneCode', tmp1);
          qry.query.bool.should[1].bool.must.push(termsQry);
        }

        let tmp2 = this.searchPara.fancyColors.filter(
          (a) => a.isRefined == true
        );

        if (!!tmp2 && tmp2.length > 0) {
          if (tmp2.filter((t) => t.value == 'ALL').length > 0) {
            tmp2 = this.searchPara.fancyColors.filter((a) => a.value != 'ALL');
          }
          let termsQry = this.esTermsQuery('FancyColorCode', tmp2);
          qry.query.bool.should[1].bool.must.push(termsQry);
        }
      }

      array_selected['fancy'] = obj_spec;
    }

    // clarity - basic
    if (this.searchPara.clarityType == 'basic') {
      //clarities
      let tmp = this.searchPara.clarities.filter((a) => a.isRefined == true);

      if (!!tmp && tmp.length > 0) {
        let arr_basic = [];
        for (let i = 0; i < tmp.length; i++) {
          arr_basic.push(tmp[i].id);
        }
        array_selected['clarity'] = arr_basic;

        let termsQry = this.esTermsQuery('ClarityCode', tmp);
        qry.query.bool.should[1].bool.must.push(termsQry);
      }
    }

    // clarity - advanced
    if (this.searchPara.clarityType == 'advanced') {
      //clarities
      let tmp = this.searchPara.advancedClarities.filter(
        (a) => a.isRefined == true
      );
      if (!!tmp && tmp.length > 0) {
        //mixpanel
        let arr_basic = [];
        for (let i = 0; i < tmp.length; i++) {
          arr_basic.push(tmp[i].id);
        }
        array_selected['clarity'] = arr_basic;

        let termsQry = this.esTermsQuery('ClarityCode', tmp);
        qry.query.bool.should[1].bool.must.push(termsQry);
      }
    }

    // finishing - general
    if (this.searchPara.finishingType == 'general') {
      //finishings
      tmp = this.searchPara.finishings.filter((a) => a.isRefined == true);
      if (!!tmp && tmp.length > 0) {
        let lookup = {};
        let paramArr = [];

        //mixpanel
        let arr_general = [];
        for (let i = 0; i < tmp.length; i++) {
          arr_general.push(tmp[i].label);
        }
        array_selected['finishType'] = arr_general;

        for (let i = 0; i < tmp.length; i++) {
          if (!!tmp[i].para && tmp[i].para.length > 0) {
            for (let j = 0; j < tmp[i].para.length; j++) {
              let label = tmp[i].para[j].label;
              let value = tmp[i].para[j].value;

              if (!(label in lookup)) {
                lookup[label] = 1;
                let jsonObj = {};
                let valueArr = [];
                valueArr.push(value);
                jsonObj[label] = valueArr;
                paramArr.push(jsonObj);
              } else {
                let existingJsonObj = paramArr.find((l) => l[label]);
                existingJsonObj[label].push(value);
              }
            }
          }
          if (!!tmp[i].query && tmp[i].query.length > 0) {
            for (let q of tmp[i].query) {
              qry.query.bool.should[1].bool.must.push(q);
            }
          }
        }
        if (paramArr.length > 0) {
          for (let a in paramArr) {
            let matchQry = {
              terms: paramArr[a],
            };
            qry.query.bool.should[1].bool.must.push(matchQry);
          }
        }
      }
    }

    //cut
    let obj_spec = {};
    if (!this.shapePreferences.isFancyShape) {
      tmp = this.searchPara.cuts.filter((a) => a.isRefined == true);
      if (!!tmp && tmp.length > 0) {
        //mixpanel
        let arr_specific = [];
        for (let i = 0; i < tmp.length; i++) {
          arr_specific.push(tmp[i].label);
        }
        obj_spec['cuts'] = arr_specific;

        let termsQry = this.esTermsQuery('CutCode', tmp);
        qry.query.bool.should[1].bool.must.push(termsQry);
      }
    }

    //polish
    tmp = this.searchPara.polishes.filter((a) => a.isRefined == true);
    if (!!tmp && tmp.length > 0) {
      //mixpanel
      let arr_specific = [];
      for (let i = 0; i < tmp.length; i++) {
        arr_specific.push(tmp[i].label);
      }
      obj_spec['polishes'] = arr_specific;
      let termsQry = this.esTermsQuery('PolishCode', tmp);
      qry.query.bool.should[1].bool.must.push(termsQry);
    }
    //symmetry
    tmp = this.searchPara.symmetries.filter((a) => a.isRefined == true);
    if (!!tmp && tmp.length > 0) {
      //mixpanel
      let arr_specific = [];
      for (let i = 0; i < tmp.length; i++) {
        arr_specific.push(tmp[i].label);
      }
      obj_spec['symmetries'] = arr_specific;

      let termsQry = this.esTermsQuery('SymmetryCode', tmp);
      qry.query.bool.should[1].bool.must.push(termsQry);
    }
    array_selected['Polishing'] = obj_spec;

    // finishing - parameters
    let obj_for_measurements = {};
    // table per
    let tablePerRangeQry = this.esRangeQuery(
      'TablePer',
      this.searchPara.tablePerFrom,
      this.searchPara.tablePerTo
    );
    if (!!tablePerRangeQry) {
      obj_for_measurements['TablePer'] = tablePerRangeQry.range['TablePer'];
      qry.query.bool.should[1].bool.must.push(tablePerRangeQry);
    }
    // depth per
    let depthPerRangeQry = this.esRangeQuery(
      'TotDepth',
      Number(this.searchPara.depthFrom),
      Number(this.searchPara.depthTo)
    );
    if (!!depthPerRangeQry) {
      obj_for_measurements['TotDepth'] = depthPerRangeQry.range['TotDepth'];
      qry.query.bool.should[1].bool.must.push(depthPerRangeQry);
    }
    // length
    let lengthRangeQry = this.esRangeQuery(
      'Length',
      Number(this.searchPara.lengthFrom),
      Number(this.searchPara.lengthTo)
    );
    if (!!lengthRangeQry) {
      obj_for_measurements['Length'] = lengthRangeQry.range['Length'];
      qry.query.bool.should[1].bool.must.push(lengthRangeQry);
    }
    //height
    let heightRangeQry = this.esRangeQuery(
      'TotDepthMm',
      this.searchPara.heightFrom,
      this.searchPara.heightTo
    );
    if (!!heightRangeQry) {
      obj_for_measurements['TotDepthMm'] = heightRangeQry.range['TotDepthMm'];
      qry.query.bool.should[1].bool.must.push(heightRangeQry);
    }
    // Width
    let widthRangeQry = this.esRangeQuery(
      'Width',
      this.searchPara.widthFrom,
      this.searchPara.widthTo
    );
    if (!!widthRangeQry) {
      obj_for_measurements['Width'] = widthRangeQry.range['Width'];
      qry.query.bool.should[1].bool.must.push(widthRangeQry);
    }
    // L/W ratio
    let ratioRangeQry = this.esRangeQuery(
      'L_W',
      this.searchPara.ratioFrom,
      this.searchPara.ratioTo
    );
    if (!!ratioRangeQry) {
      obj_for_measurements['L_W'] = ratioRangeQry.range['L_W'];
      qry.query.bool.should[1].bool.must.push(ratioRangeQry);
    }
    // crown angle
    let crAngleRangeQry = this.esRangeQuery(
      'CrAngle',
      this.searchPara.crownAngleFrom,
      this.searchPara.crownAngleTo
    );
    if (!!crAngleRangeQry) {
      obj_for_measurements['CrAngle'] = crAngleRangeQry.range['CrAngle'];
      qry.query.bool.should[1].bool.must.push(crAngleRangeQry);
    }
    // crown height
    let crHeightRangeQry = this.esRangeQuery(
      'CrHgt',
      this.searchPara.crownHeightFrom,
      this.searchPara.crownHeightTo
    );
    if (!!crHeightRangeQry) {
      obj_for_measurements['CrHgt'] = crHeightRangeQry.range['CrHgt'];
      qry.query.bool.should[1].bool.must.push(crHeightRangeQry);
    }

    //girdle
    this.selectedGirdleChanges();

    if (!!this.searchPara.selectedGirdle) {
      tmp = this.searchPara.girdles.filter((a) => {
        return a.value === this.searchPara.selectedGirdle;
      });
      if (!!tmp && tmp.length > 0) {
        obj_for_measurements['girdle'] = tmp[0].label;
        let termsQry = this.esTermsQuery('GirdleCode', tmp);
        qry.query.bool.should[1].bool.must.push(termsQry);
      }
    }

    // pavilion angle
    let pavAngleRangeQry = this.esRangeQuery(
      'PavAngle',
      this.searchPara.pavilionAngleFrom,
      this.searchPara.pavilionAngleTo
    );
    if (!!pavAngleRangeQry) {
      obj_for_measurements['PavAngle'] = pavAngleRangeQry.range['PavAngle'];
      qry.query.bool.should[1].bool.must.push(pavAngleRangeQry);
    }

    // pavilion height
    let pavheightRangeQry = this.esRangeQuery(
      'PavHgt',
      this.searchPara.pavilionHeightFrom,
      this.searchPara.pavilionHeightTo
    );
    if (!!pavheightRangeQry) {
      obj_for_measurements['PavHgt'] = pavheightRangeQry.range['PavHgt'];
      qry.query.bool.should[1].bool.must.push(pavheightRangeQry);
    }

    // pavilion depth
    // let pavDepthRangeQry = this.esRangeQuery("PavAngle", this.searchPara.pavilionDepthFrom, this.searchPara.pavilionDepthTo);
    // if(!!pavDepthRangeQry)
    //   qry.query.bool.should[1].bool.must.push(pavDepthRangeQry);
    array_selected['parameters'] = obj_for_measurements;

    // PRICE-ROW
    const obj_for_price = {};

    //discount per
    const externalProduct =
      this._companyService.companyObj.config.externalProduct;
    const kgAppliedDiscount = externalProduct.kgAppliedDiscount;
    const discountPerRangeQry = this.esRangeQuery(
      kgAppliedDiscount,
      this.searchPara.discountPerFrom,
      this.searchPara.discountPerTo
    );
    if (!!discountPerRangeQry) {
      obj_for_price[kgAppliedDiscount] =
        discountPerRangeQry.range[kgAppliedDiscount];
      qry.query.bool.should[1].bool.must.push(discountPerRangeQry);
    }

    //discount per
    const kgAppliedPrice = externalProduct.kgAppliedPrice;
    const pricePerRangeQry = this.esRangeQuery(
      kgAppliedPrice,
      this.searchPara.pricePerFrom,
      this.searchPara.pricePerTo
    );
    if (!!pricePerRangeQry) {
      obj_for_price[kgAppliedPrice] = pricePerRangeQry.range[kgAppliedPrice];
      qry.query.bool.should[1].bool.must.push(pricePerRangeQry);
    }

    //discount per
    const kgAppliedAmount = externalProduct.kgAppliedAmount;
    const amtPerRangeQry = this.esRangeQuery(
      kgAppliedAmount,
      this.searchPara.amtPerFrom,
      this.searchPara.amtPerTo
    );
    if (!!amtPerRangeQry) {
      obj_for_price[kgAppliedAmount] = amtPerRangeQry.range[kgAppliedAmount];
      qry.query.bool.should[1].bool.must.push(amtPerRangeQry);
    }

    array_selected['price'] = obj_for_price;

    // console.table(externalProduct);
    // console.log(kgAppliedDiscount, kgAppliedPrice, kgAppliedAmount);
    // console.log(discountPerRangeQry, pricePerRangeQry, amtPerRangeQry);

    //descriptions-pending
    tmp = this.searchPara.descriptions.filter((a) => a.isRefined == true);
    if (!!tmp && tmp.length > 0) {
      //mixpanel
      let arr_general = [];
      for (let i = 0; i < tmp.length; i++) {
        arr_general.push(tmp[i].label);
      }
      array_selected['Descriptions'] = arr_general;

      let lookup = {};
      let paramArr = [];
      for (let i = 0; i < tmp.length; i++) {
        if (!!tmp[i].para && tmp[i].para.length > 0) {
          for (let j = 0; j < tmp[i].para.length; j++) {
            let label = tmp[i].para[j].label;
            let value = tmp[i].para[j].value;

            if (!(label in lookup)) {
              lookup[label] = 1;
              let jsonObj = {};
              let valueArr = [];
              valueArr.push(value);
              jsonObj[label] = valueArr;
              paramArr.push(jsonObj);
            } else {
              let existingJsonObj = paramArr.find((l) => l[label]);
              existingJsonObj[label].push(value);
            }
          }
        }
      }

      let boolShouldMultiple = {
        bool: {
          must: [],
        },
      };
      if (paramArr.length > 0) {
        for (let a in paramArr) {
          let matchQry = {
            terms: paramArr[a],
          };
          boolShouldMultiple.bool.must.push(matchQry);
        }
        qry.query.bool.should[1].bool.must.push(boolShouldMultiple);
      }
    }

    // finishing - general
    if (this.searchPara.finishingType == 'general') {
      //finishings
      tmp = this.searchPara.finishings.filter((a) => a.isRefined == true);
      if (!!tmp && tmp.length > 0) {
        let lookup = {};
        let paramArr = [];
        for (let i = 0; i < tmp.length; i++) {
          if (!!tmp[i].para && tmp[i].para.length > 0) {
            for (let j = 0; j < tmp[i].para.length; j++) {
              let label = tmp[i].para[j].label;
              let value = tmp[i].para[j].value;

              if (!(label in lookup)) {
                lookup[label] = 1;
                let jsonObj = {};
                let valueArr = [];
                valueArr.push(value);
                jsonObj[label] = valueArr;
                paramArr.push(jsonObj);
              } else {
                let existingJsonObj = paramArr.find((l) => l[label]);
                existingJsonObj[label].push(value);
              }
            }
          }
        }
        if (paramArr.length > 0) {
          for (let a in paramArr) {
            let matchQry = {
              terms: paramArr[a],
            };
            qry.query.bool.should[1].bool.must.push(matchQry);
          }
        }
      }
    }

    // finishing- specific
    if (this.searchPara.finishingType == 'specific') {
      //cut
      tmp = this.searchPara.cuts.filter((a) => a.isRefined == true);
      if (!!tmp && tmp.length > 0) {
        let termsQry = this.esTermsQuery('CutCode', tmp);
        qry.query.bool.should[1].bool.must.push(termsQry);
      }

      //polish
      tmp = this.searchPara.polishes.filter((a) => a.isRefined == true);

      if (!!tmp && tmp.length > 0) {
        let termsQry = this.esTermsQuery('PolishCode', tmp);
        qry.query.bool.should[1].bool.must.push(termsQry);
      }
      //symmetry
      tmp = this.searchPara.symmetries.filter((a) => a.isRefined == true);

      if (!!tmp && tmp.length > 0) {
        let termsQry = this.esTermsQuery('SymmetryCode', tmp);
        qry.query.bool.should[1].bool.must.push(termsQry);
      }
    }

    // finishing - parameters
    if (this.searchPara.finishingType == 'parameters') {
      // table per
      let tablePerRangeQry = this.esRangeQuery(
        'TablePer',
        this.searchPara.tablePerFrom,
        this.searchPara.tablePerTo
      );
      if (!!tablePerRangeQry)
        qry.query.bool.should[1].bool.must.push(tablePerRangeQry);

      // depth per
      let depthPerRangeQry = this.esRangeQuery(
        'TotDepth',
        this.searchPara.depthFrom,
        this.searchPara.depthTo
      );
      if (!!depthPerRangeQry)
        qry.query.bool.should[1].bool.must.push(depthPerRangeQry);

      // height per
      let heightRangeQry = this.esRangeQuery(
        'TotDepthMm',
        this.searchPara.heightFrom,
        this.searchPara.heightTo
      );
      if (!!heightRangeQry)
        qry.query.bool.should[1].bool.must.push(heightRangeQry);

      // length
      let lengthRangeQry = this.esRangeQuery(
        'Length',
        this.searchPara.lengthFrom,
        this.searchPara.lengthTo
      );
      if (!!lengthRangeQry)
        qry.query.bool.should[1].bool.must.push(lengthRangeQry);

      // Width
      let widthRangeQry = this.esRangeQuery(
        'Width',
        this.searchPara.widthFrom,
        this.searchPara.widthTo
      );
      if (!!lengthRangeQry)
        qry.query.bool.should[1].bool.must.push(widthRangeQry);

      // L/W ratio
      let ratioRangeQry = this.esRangeQuery(
        'L_W',
        this.searchPara.ratioFrom,
        this.searchPara.ratioTo
      );
      if (!!ratioRangeQry)
        qry.query.bool.should[1].bool.must.push(ratioRangeQry);

      // crown angle
      let crAngleRangeQry = this.esRangeQuery(
        'CrAngle',
        this.searchPara.crownAngleFrom,
        this.searchPara.crownAngleTo
      );
      if (!!crAngleRangeQry)
        qry.query.bool.should[1].bool.must.push(crAngleRangeQry);

      // crown height
      let crHeightRangeQry = this.esRangeQuery(
        'CrHgt',
        this.searchPara.crownHeightFrom,
        this.searchPara.crownHeightTo
      );
      if (!!crHeightRangeQry)
        qry.query.bool.should[1].bool.must.push(crHeightRangeQry);

      //girdle
      this.selectedGirdleChanges();

      if (!!this.searchPara.selectedGirdle) {
        tmp = this.searchPara.girdles.filter(
          (a) => a.value == this.searchPara.selectedGirdle.value
        );
        if (!!tmp && tmp.length > 0) {
          let termsQry = this.esTermsQuery('GirdleCode', tmp);
          qry.query.bool.should[1].bool.must.push(termsQry);
        }
      }

      // pavilion angle
      let pavAngleRangeQry = this.esRangeQuery(
        'PavAngle',
        this.searchPara.pavilionAngleFrom,
        this.searchPara.pavilionAngleTo
      );
      if (!!pavAngleRangeQry)
        qry.query.bool.should[1].bool.must.push(pavAngleRangeQry);

      // pavilion height
      let pavheightRangeQry = this.esRangeQuery(
        'PavHgt',
        this.searchPara.pavilionHeightFrom,
        this.searchPara.pavilionHeightTo
      );
      if (!!pavheightRangeQry)
        qry.query.bool.should[1].bool.must.push(pavheightRangeQry);

      // pavilion depth
      // let pavDepthRangeQry = this.esRangeQuery("PavAngle", this.searchPara.pavilionDepthFrom, this.searchPara.pavilionDepthTo);
      // if(!!pavDepthRangeQry)
      //   qry.query.bool.should[1].bool.must.push(pavDepthRangeQry);
    }

    if (this.filteredPD) {
      let boolShouldMultiple = {
        bool: {
          must: [],
        },
      };
      // console.log('\x1b[41m%s\x1b[0m', 'L3282 filteredPD :', this.filteredPD);
      for (let key in this.filteredPD) {
        if (!!key) {
          let obj = {};
          if (key === 'ShadesCode') {
            obj['ShadesCode.keyword'] = this.filteredPD[key];
          } else {
            obj[key] = this.filteredPD[key];
          }
          boolShouldMultiple.bool.must.push({ terms: obj });
        }
      }
      qry.query.bool.should[1].bool.must.push(boolShouldMultiple);
    }

    let avQry = { exists: { field: 'availableForSale' } };
    qry.query.bool.should[1].bool.must.push(avQry);

    this.savedSearchParameters = this.searchPara;
    // this.storage.set("searchData", this.savedSearchParameters)

    if (this.searchPara.location) {
      console.log();
    }
    qry.query.bool.should[0].simple_query_string.query.replace(
      /[&\/\\#,+()$~%.'":*?<>{}]/g,
      ''
    );

    this.analyticsService.addEvents('Search', array_selected);

    if (qryReturn) {
      return qry;
    } else {
      this.storage.set('searchData', this.savedSearchParameters).then(() => {
        let navigationExtras: NavigationExtras;
        navigationExtras = {
          queryParams: {
            query: JSON.stringify(qry),
          },
        };

        // this.storage.set('queryData', JSON.stringify(qry));

        let url = 'search';

        this.router.navigate(['/' + url], navigationExtras);

        array_selected['email'] =
          !!this.userData && this.userData?.['email']
            ? this.userData['email']
            : '-';
        array_selected['salesperson'] =
          !!this.userData && this.userData?.['parameter']
            ? JSON.parse(this.userData['parameter'])?.['userAccount']?.[
                'salesperson'
              ]?.['name'] || '-'
            : '-';
        array_selected['Stone Count'] = this.searchCount;

        this.analyticsService.addEvents('List View', array_selected);
      });
    }
  }

  esTermsQuery(paramName, valueArr) {
    let termsQry = {
      terms: {},
    };
    termsQry.terms[paramName] = [];
    for (let i = 0; i < valueArr.length; i++) {
      if (
        valueArr[i].value != 'CUSHION Brilliant' &&
        valueArr[i].value != 'FM' &&
        valueArr[i].value != 'NONE CERT'
      ) {
        //termsQry.terms[paramName].push(valueArr[i].value);
        if (!!Array.isArray(valueArr[i].value)) {
          valueArr[i].value.filter((el) => termsQry.terms[paramName].push(el));
        } else if (
          typeof valueArr[i].value === 'object' &&
          !Array.isArray(valueArr[i].value) &&
          valueArr[i].value !== null
        ) {
          if (Array.isArray(valueArr[i].value[valueArr[i].id])) {
            valueArr[i].value[valueArr[i].id].forEach((val: string) => {
              termsQry.terms[paramName].push(val);
            });
          } else
            termsQry.terms[paramName].push(valueArr[i].value[valueArr[i].id]);
        } else {
          termsQry.terms[paramName].push(valueArr[i].value);
        }
      }

      if (valueArr[i].label == 'New York' && paramName == 'location') {
        let val = valueArr[i].value.split(',');
        if (termsQry.terms[paramName].length > 0) {
          termsQry.terms[paramName] = termsQry.terms[paramName].concat(val);
        } else {
          termsQry.terms[paramName] = val;
        }
        termsQry.terms[paramName] = termsQry.terms[paramName].filter(
          (x) => x != 'ny,aspecony'
        );
      }
    }
    if (termsQry.terms[paramName].length > 0) {
      return termsQry;
    } else {
      return false;
    }
  }

  esRangeQuery(paramName, from, to) {
    let rangeQry = {
      range: {},
    };
    rangeQry.range[paramName] = {};
    //from
    if (!!from) rangeQry.range[paramName]['gte'] = from;

    //to size
    if (!!to) rangeQry.range[paramName]['lte'] = to;

    if (!!from || !!to) {
      return rangeQry;
    } else {
      return null;
    }
  }

  filterForSmallScreen(attribute) {
    this.smallScreenFilter = null;
    this.smallScreenFilter = attribute;
  }

  async addRefinements(event) {
    // console.log(" addRefinements ", event, this.default.displayCount);
    if (this.default.displayCount) {
      await this.getCount(this.searchQuery(true));
    }
    await this.searchQuery();
  }

  async openPdFilter() {
    const modal = await this.modalController.create({
      component: PdParametersPage,
      backdropDismiss: false,
      cssClass: 'pd-filter',
      componentProps: {
        filteredPD: this.filteredPD,
        searchParameter: this.searchPara,
      },
    });
    modal.onDidDismiss().then((d: any) => this.handlePdFilterDismiss(d));
    return await modal.present();
  }

  handlePdFilterDismiss(d) {
    if (d.data) {
      this.filteredPD = d.data;
      this.getCount(this.searchQuery(true));
    }
  }

  async toggleShapes() {
    if (this.mobileView) {
      if (!this.show) {
        let count = 0;
        if (this.innerWidth < 330) {
          count = 4;
        } else {
          count = 5;
        }
        let length = this.searchPara.shapes.length - count;
        this.shapeMoreTxt = `+ ` + length + ` more`;
        this.searchPara.shapes = await this.searchPara.shapes.slice(0, count);
      } else {
        this.shapeMoreTxt = 'Show less';
        this.searchPara.shapes = this.allShapes;
      }
    } else {
      this.searchPara.shapes = this.allShapes;
    }
  }

  numberOnly(event): boolean {
    // console.log(event.target.value);
    let val = event.target.value;
    // console.log(val, val.length);
    const charCode = event.which ? event.which : event.keyCode;
    if (val.length > 4) {
      return false;
    }
    if (charCode == 46) {
      return true;
    } else if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    } else {
      return true;
    }
  }

  omit_special_char(event) {
    console.log(event.target.value);
    if (event.target.value) {
      let str = event.target.value.split('\n');
      console.log(str.length);
      for (let i = 0; i < str.length; i++) {
        console.log(str[i]);
        let stoneId = str[i];
        if (stoneId.length > 20) {
          return false;
        }
      }
    }

    var k;
    k = event.charCode; //         k = event.keyCode;  (Both can be used)
    //return ((k > 64 && k < 91) || (k > 96 && k < 109) || (k > 109 && k < 123) || k == 8 || k == 110 || k == 13 || k == 32 || (k >= 48 && k <= 57));
    return (
      (k > 64 && k < 91) ||
      (k > 96 && k < 123) ||
      k == 8 ||
      k == 110 ||
      k == 13 ||
      k == 32 ||
      (k >= 48 && k <= 57) ||
      k == 45
    );
  }

  async validateFromToInput(field, fieldName) {
    const validateRange = (from, to, fromClass, toClass) => {
      if (from && to) {
        document
          .querySelectorAll(`.${fromClass}`)
          .forEach((item) => item.classList.remove('error'));
        document
          .querySelectorAll(`.${toClass}`)
          .forEach((item) => item.classList.remove('error'));

        const fromValue = Number(from);
        const toValue = Number(to);

        if (fromValue <= toValue) {
          return true;
        } else {
          if (fieldName === 'from') {
            document
              .querySelectorAll(`.${fromClass}`)
              .forEach((item) => item.classList.add('error'));
          } else if (fieldName === 'to') {
            document
              .querySelectorAll(`.${toClass}`)
              .forEach((item) => item.classList.add('error'));
          }
        }
      }
      return false;
    };

    switch (field) {
      case 'Table%':
        return validateRange(
          this.searchPara.tablePerFrom,
          this.searchPara.tablePerTo,
          'tablePerFrom',
          'tablePerTo'
        );
      case 'Length':
        return validateRange(
          this.searchPara.lengthFrom,
          this.searchPara.lengthTo,
          'lengthFrom',
          'lengthTo'
        );
      case 'Height':
        return validateRange(
          this.searchPara.heightFrom,
          this.searchPara.heightTo,
          'heightFrom',
          'heightTo'
        );
      case 'Width':
        return validateRange(
          this.searchPara.widthFrom,
          this.searchPara.widthTo,
          'widthFrom',
          'widthTo'
        );
      case 'Depth%':
        return validateRange(
          this.searchPara.depthFrom,
          this.searchPara.depthTo,
          'depthFrom',
          'depthTo'
        );
      case 'L/W':
        return validateRange(
          this.searchPara.ratioFrom,
          this.searchPara.ratioTo,
          'ratioFrom',
          'ratioTo'
        );
      case 'Crown Angle':
        return validateRange(
          this.searchPara.crownAngleFrom,
          this.searchPara.crownAngleTo,
          'crownAngleFrom',
          'crownAngleTo'
        );
      case 'Crown Height':
        return validateRange(
          this.searchPara.crownHeightFrom,
          this.searchPara.crownHeightTo,
          'crownHeightFrom',
          'crownHeightTo'
        );
      case 'Pavilion Angle':
        return validateRange(
          this.searchPara.pavilionAngleFrom,
          this.searchPara.pavilionAngleTo,
          'pavilionAngleFrom',
          'pavilionAngleTo'
        );
      case 'Pavilion Height':
        return validateRange(
          this.searchPara.pavilionHeightFrom,
          this.searchPara.pavilionHeightTo,
          'pavilionHeightFrom',
          'pavilionHeightTo'
        );
      case 'discountPer':
      case 'pricePer':
      case 'amtPer':
        return validateRange(
          this.searchPara[field + 'From'],
          this.searchPara[field + 'To'],
          `${field}From`,
          `${field}To`
        );
      default:
        return false;
    }
  }

  add_removeClass(operation: string, field: string, fieldCategory: string) {
    document.querySelectorAll(`.${field}${fieldCategory}`).forEach((item) => {
      if (operation === 'add') item.classList.add('error');
      else if (operation === 'remove') item.classList.remove('error');
    });
  }

  async deleteSearch(search) {
    this.selectedSearch = '';
    await this.configService.showLoading();
    let res = await this._savedService.deleteSavedSearchById(
      search.id,
      this.userId
    );
    if (!!res && !!res.data) {
      this.configService.presentToast('Saved search removed', 'success');
    }
    await this.configService.hideLoading();
    await this.loadSavedSearches();
    this.resetSearch(true);
  }

  async clearLab() {
    this.searchPara.cuts.map((res) => (res.isRefined = false));
  }

  async splitArray(arrToSplit, comparisonArray) {
    const matchingArray = arrToSplit.filter((element) =>
      comparisonArray.includes(element)
    );
    const nonMatchingArray = arrToSplit.filter(
      (element) => !comparisonArray.includes(element)
    );
    console.log(matchingArray, nonMatchingArray);
    return [matchingArray, nonMatchingArray];
  }

  /* Specific Carat range Addition */
  public addSpecificCarat() {
    const obj: { from: string; to: string } = { from: '', to: '' };
    obj.from = this.searchPara.fromCarat;
    obj.to = this.searchPara.toCarat;

    if (!!obj.from && !!obj.to) {
      const isWithinPrevRange = this.searchPara.specificCaratGroup.some(
        (specificCarat: { from: string; to: string }) => {
          if (
            Number.parseFloat(this.searchPara.fromCarat) >=
              Number.parseFloat(specificCarat.from) &&
            Number.parseFloat(this.searchPara.fromCarat) <=
              Number.parseFloat(specificCarat.to) &&
            Number.parseFloat(this.searchPara.toCarat) <=
              Number.parseFloat(specificCarat.to)
          ) {
            return true;
          }
          return false;
        }
      );

      if (!isWithinPrevRange) {
        this.searchPara.specificCaratGroup.push({ ...obj });
      }
      this.searchPara.fromCarat = '';
      this.searchPara.toCarat = '';
      this.fromCaratInput.setFocus();
    }
  }

  /* Specific Carat range Removal */
  onSpecificCaratRemoved(event: any, field: string, idx: number) {
    this.searchPara.specificCaratGroup.splice(idx, 1);
    this.getCount(this.searchQuery(true));
  }

  /* Fancy Color multiple Selection */
  onColorFancySelected(
    event: {
      component: IonicSelectableComponent;
      value: any;
    },
    field: string
  ) {
    event.component.items.map((intensity: any) => {
      intensity.isRefined = false;
    });
    event.value.map((intensity: any) => {
      intensity.isRefined = true;
    });
  }

  keydownEnter() {
    this.addSpecificCarat();
  }

  //async splitArray
}

// filter_selectedTermValue (in place of)
/*
selectedValue.filter(keys => {
  if (keys['ShapeCode'] && Array.isArray(obj.value)) {
    let n = Array.isArray(this.savedShapes);
    let match = this.savedShapes.filter(x => x.label == obj.label);
    if (match.length > 0) {
      if (
        defaultValue.shapes.filter(x => x.label == match[0].label).length > 0
      ) {
        setTimeout(() => {
          this.searchPara.shapeType = 'generic';
          this.cd.detectChanges();
        }, 1000);
        this.cd.detectChanges();
      } else if (
        defaultValue.advancedShapes.filter(x => x.label == match[0].label)
          .length > 0
      ) {
        setTimeout(() => {
          this.searchPara.shapeType = 'eliteCuts';
          this.cd.detectChanges();
        }, 1000);
      } else {
        console.log('--');
      }
      obj.isRefined = true;
    }
  } else if (keys['cts']) {
    tempObj['fromCarat'] = keys['cts']['gte'];
    tempObj['toCarat'] = keys['cts']['lte'];
  } else if (Object.keys(keys)[0] == object[key]) {
    let data: any = Object.values(keys)[0];
    if (
      typeof obj.value === 'object' &&
      !Array.isArray(obj.value) &&
      obj.value !== null
    ) {
      if (data.indexOf(Object.keys(obj.value)[0]) != -1) {
        obj.isRefined = true;
      } else {
        obj.isRefined = false;
      }
    } else {
      if (data.indexOf(obj.value) != -1) {
        obj.isRefined = true;
      } else {
        obj.isRefined = false;
      }
    }
  }
});
*/
