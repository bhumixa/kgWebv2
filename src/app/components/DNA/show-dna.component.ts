import { Component, OnInit } from '@angular/core';
import { waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import {
  AlertController,
  MenuController,
  ModalController,
  NavController,
  PopoverController,
} from '@ionic/angular';
import { CompanyService } from 'src/app/service/company/company.service';
import { ConfigServiceService } from 'src/app/service/config-service.service';
import { ElasticsearchService } from 'src/app/service/elasticsearch/elasticsearch.service';
import { HeaderFooterService } from 'src/app/service/headerFooter/header-footer.service';

import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-show-dna',
  templateUrl: './show-dna.component.html',
  styleUrls: ['./show-dna.component.scss'],
})
export class ShowDNAComponent implements OnInit {
  public excludeParameters;
  public kgPricing;
  public index = environment.INDEX;
  public perPage = environment.RESULTS_PER_PAGE;
  qry;
  foundStones = [];
  public stoneId: any;
  searchedStone;

  constructor(
    public _companyService: CompanyService,
    public _headerFooterService: HeaderFooterService,
    public navCtrl: NavController,
    public _configService: ConfigServiceService,
    private router: Router,
    private menu: MenuController,
    public alertController: AlertController,
    private modalCtrl: ModalController,
    public popoverController: PopoverController,
    private es: ElasticsearchService
  ) {}

  ngOnInit() {
    this.loadCompanyData();
    this.qry = {
      query: {
        match: {
          stoneName: '',
        },
      },
      _source: {
        //"include": [ "obj1.*", "obj2.*" ],
        exclude: this.excludeParameters,
      },
      //"_source": ["stoneName", "lab", "ShapeCode", "cts", "ColorCode", "ClarityCode", "CutCode", "PolishCode", "SymmetryCode", "FluorescenceCode", "Rapnet_plusDiscountPercent", "Rapnet_pluspercarat", "Rapnet_plus", "RAPAPORTpercarat", "externalStatus"]
    };
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
      }
    }
  }

  closeModal() {
    this.popoverController.dismiss();
  }

  show() {
    console.log(this.stoneId.trim().toUpperCase());
    this.stoneId = this.stoneId.trim().toUpperCase();
    // let stoneObj = {
    //   bool: {
    //     should: [
    //       {
    //         prefix: {
    //           stoneName: this.stoneId,
    //         },
    //       },
    //     ],
    //   },
    // };
    this.qry.query.match.stoneName =  this.stoneId
    //for pricing greater than 0
    // let rapnetFilter = {
    // 	'range': {}
    // }
    //  console.log(this.kgPricing)
    // rapnetFilter['range'][this.kgPricing] = {
    // 	"gt": 0
    // }
    // this.qry.query.bool.should[1].bool.must.push(rapnetFilter);

    // let availableStoneFilter = {
    // 	"match": {
    // 		"availableForSale": 1
    // 	}
    // }
    // this.qry.query.bool.should[1].bool.must.push(availableStoneFilter);
    this.search(this.qry, 0);
  }

  algolia(loadOption: any) {
    let wildcard = {},
      must_not = {},
      search = '';
    let indivisualFilter = [],
      searchFilter = '',
      loadOptions: any = loadOption.filter;
    if (!!loadOption.filter) {
      let options: any = loadOptions;
      if (
        loadOptions[1] == 'and' &&
        Array.isArray(options[0]) &&
        Array.isArray(options[2]) &&
        (options[0][1] == 'or' || options[2][1] == 'or')
      ) {
        let first: any = options[0]
          .map(keys => Array.isArray(keys) && keys[2])
          .filter(res => !!res)
          .filter((v, i, a) => a.indexOf(v) === i);
        let secound: any = options[2]
          .map(keys => Array.isArray(keys) && keys[2])
          .filter(res => !!res)
          .filter((v, i, a) => a.indexOf(v) === i);
        if (first.length == 1) {
          searchFilter = first[0];
          indivisualFilter = options[2];
        } else if (secound.length == 1) {
          searchFilter = secound[0];
          indivisualFilter = options[0];
        } else {
          // console.log("======something Wrong ====");
        }
      } else if (!Array.isArray(loadOption.filter[0])) {
        indivisualFilter = [loadOption.filter];
      } else {
        let first: any = options
          .map(keys => Array.isArray(keys) && keys[2])
          .filter(res => !!res)
          .filter((v, i, a) => a.indexOf(v) === i);
        if (first.length == 1) {
          searchFilter = first[0];
        } else {
          indivisualFilter = options;
        }
      }
      if (indivisualFilter.length > 0) {
        indivisualFilter.filter(loadOption => {
          if (loadOption.length > 0) {
            switch (loadOption[1]) {
              case 'contains':
                wildcard[loadOption[0]] = '*' + loadOption[2] + '*';
                break;
              case 'notcontains':
                must_not[loadOption[0]] = '*' + loadOption[2] + '*';
                break;
              case 'startswith':
                wildcard[loadOption[0]] = loadOption[2] + '*';
                break;
              case 'endswith':
                wildcard[loadOption[0]] = '*' + loadOption[2];
                break;
              case '=':
                wildcard[loadOption[0]] = loadOption[2];
                break;
              case '<>':
                must_not[loadOption[0]] = loadOption[2];
                break;
              default:
                break;
            }
          }
        });
      }
      if (searchFilter.length > 0) {
        search = '*' + searchFilter + '*';
      }
    }
    return { wildcard, must_not, search };
  }

  async search(query, from) {
    await this._configService.showLoading();
    this.es.getPaginatedDocuments(query, from, this.index, '').then(async body => {
      let locationnId;
      await this._configService.hideLoading();
      if (!!body.hits.total.value) {
        let data = body.hits.hits;
        let totalHits = body.hits.total.value;
        console.log(data);
        if (!!data && data.length > 0) {
          this.foundStones = data.map(d => d._source);
          if (this.foundStones.length > 1) {
            let mumbaiRecord = this.foundStones.filter(
              x => x.location == 'mumbai'
            );
            if (!!mumbaiRecord) {
              locationnId = mumbaiRecord[0]['currentLocation'];
            }
          } else {
            locationnId = this.foundStones[0]['currentLocation'];
          }
          let stoneObj = {
            stoneName: this.stoneId,
            location: locationnId,
          };
          this.popoverController.dismiss(stoneObj);
        } else {
          this.popoverController.dismiss();
          //this._configService.presentToast("Stone not found.", "error");
          this.navCtrl.navigateForward([
            '/products/' + this.stoneId + '/' + this.stoneId + '/2',
          ]);
        }
      } else {
        this.popoverController.dismiss();
        this.navCtrl.navigateForward([
          '/products/' + this.stoneId + '/' + this.stoneId + '/2',
        ]);
      }
    });

    // let res = await this.es.getPaginatedDocuments(query, 0, index, '', 20);
    // console.log(res)
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
}
