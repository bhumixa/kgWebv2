import { Component, Input, OnInit } from '@angular/core';
// import { Router, NavigationExtras } from "@angular/router";
// import { CompanyService } from '../../service/company/company.service';
// import { Storage } from "@ionic/storage";
import { HeaderFooterService } from "../../service/headerFooter/header-footer.service";


@Component({
  selector: 'app-es-search-box',
  templateUrl: "./es-search-box.component.html",
//   template: `
//   <!--<ion-searchbar
//     #input
//     debounce="2000"
//     showCancelButton="focus"
//     (ionChange)="search()"
//     (keyup.enter)="search()"
//     [(ngModel)]="query"
//   >
//   </ion-searchbar>-->
//   <ion-row>
//     <ion-col size="10" class="marPad0">
//       <ion-searchbar
//         #input
//         showCancelButton="focus"
//         [(ngModel)]="_headerFooterService.query"
//         placeholder="What are you looking for"
//       >
//       </ion-searchbar>
//     </ion-col>
//     <ion-col size="2" class="marPad0">
//         <ion-button class="mTop10" (click)="_headerFooterService.search()">Go</ion-button>
//     </ion-col>
//   </ion-row>
// `,
  styleUrls: ['./es-search-box.component.scss'],
})

export class EsSearchBoxComponent implements OnInit {
  @Input() searchType: any;
  @Input() size = "10";
  // public query = "";
  // public allViewActions: any = this._companyService.allActions;

  constructor(
    // private router: Router, private _companyService: CompanyService, public storage: Storage,
    public _headerFooterService: HeaderFooterService
    ) { }

  async ngOnInit() {
  }

  // search() {
  //   // console.log("search input ", this.query);
  //   // this.state.refine(input.value);
  //   let query = {
  //     "query": {
  //       "bool": {
  //         "should": [
  //           {
  //             "simple_query_string": {
  //               "query": this.query
  //             }
  //           },
  //           {
  //             "bool": {
  //               "must": []
  //             }
  //           }
  //         ]
  //       }
  //     }
  //   };

  //   let navigationExtras: NavigationExtras = {
  //     queryParams: {
  //       query: JSON.stringify(query)
  //     }
  //   };
  //   this.router.navigate(["search"], navigationExtras);
  //   if (this.query) {
  //     this.insertSearchView();
  //   }
  // }

  // async insertSearchView() {
  //   let search = 12;
  //   if (!!this.allViewActions && !!this.allViewActions.search) {
  //     search = this.allViewActions.search;
  //   }
  //   let jsonObj = {
  //     actionId: search,
  //     refProductId: null,
  //     searchTxt: this.query
  //   };

  //   let res: any;

  //   res = await this._companyService.insertView(jsonObj);
  //   if (res.status == 0) {
  //     // console.log("error");
  //   } else {
  //     // console.log("login view insert res", res);
  //   }

  // }
}
