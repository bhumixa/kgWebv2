import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  HostListener,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnChanges,
} from '@angular/core';
import { format } from 'date-fns/format';
import { Router } from '@angular/router';
import { NavigateService } from '../../service/product/navigate.service';
import dxDataGrid, {
  DataGridScrollMode,
  ScrollbarMode,
} from 'devextreme/ui/data_grid';
import { Storage } from '@ionic/storage-angular';
import { AnalyticsService } from 'src/app/service/analytics.service';
import { CompanyService } from 'src/app/service/company/company.service';
import { SortCodesPipe } from 'src/app/pipes/sort-code/sort-codes.pipe';
import { Platform } from '@ionic/angular';

export interface TotalSelectedSummary {
  cts: 0;
  pcs: 0;
  amount: 0;
  rapValue: 0;
}
@Component({
  selector: 'app-dx-data-grid',
  templateUrl: './dx-data-grid.component.html',
  styleUrls: ['./dx-data-grid.component.scss'],
})
export class DxDataGridComponent implements OnInit {
  // @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;
  checkBoxesMode = 'always';
  dataGridInstance: dxDataGrid;
  dataGridInstanceDesktop: dxDataGrid;
  filterRow: boolean = false;
  @Input() showSummary = false;
  @Input() mode: string = 'single';
  @Input() page: string = '';
  @Input() columns: any = [];
  @Input() rowData: any;
  @Input() totalSummary: any = [];
  @Input() fileName: string;
  @Input() groupTotalSummary: any;
  @Input() showPivotGrid: any;
  @Input() pivotGridDataSource: any;
  @Input() viewDetail: any;
  @Input() detailColumns: any;
  @Input() detailRowData: any;
  @Input() detailGroupTotalSummary: any;
  @Input() detailTotalSummary: any;
  @Input() selected: any = [];
  @Input() orderBook = '';
  @Input() mobileView = false;
  @Input() allowDeleting = false;
  @Input() allowUpdating = false;
  @Input() listOfferApplied = false;
  @Input() pageSize = 50;
  @Input() showCart = false;
  @Input() tableId = 'gridContainer';
  @Input() tableMobileId = 'gridContainer-mobile';
  @Input() refreshGrid = false;
  @Input() refreshMobileGrid = false;
  @Input() remoteOperations = true;
  @Input() disableOffer = false;
  @Input() hideClearSelection: boolean = false;
  @Input() showCheckBox: boolean = true;
  @Input() allowColumnResizing: boolean = true;
  @Input() allowColumnReordering: boolean = true;

  @Output() callFunction: EventEmitter<any> = new EventEmitter();
  @Output() pageFunction: EventEmitter<any> = new EventEmitter();
  @Output() deleteFunction: EventEmitter<any> = new EventEmitter();
  @Output() popOverFunction: EventEmitter<any> = new EventEmitter();
  @Output() viewProductFunction: EventEmitter<any> = new EventEmitter();
  @Output() offerValueUpdate: EventEmitter<any> = new EventEmitter();
  @Output() selectStone: EventEmitter<any> = new EventEmitter();
  @Output() viewCertificateFn: EventEmitter<any> = new EventEmitter();
  @Output() dataSorted: EventEmitter<any> = new EventEmitter();
  @Output() addToCartFunction: EventEmitter<any> = new EventEmitter();
  @Output() discountError: EventEmitter<any> = new EventEmitter();
  @Output() viewOfferInputs: EventEmitter<any> = new EventEmitter();
  @Output() selectionViewData: EventEmitter<any> = new EventEmitter();

  justDeselected: boolean = false;
  public myMesssages = {
    emptyMessage: 'No data to display',
    totalMessage: 'records',
  };
  public headerHeight = 50;
  public userData: any;
  public rowHeight = 30;
  public selectedRowKeys = [];
  public gridHeight = '72vh';
  public gridHeightMobile = 0;
  public selectedRows = 0;
  public innerHeight: any;
  public innerWidth: any;

  public loadSummary = false;
  public columnName = '';

  public totalSelectedSummary: TotalSelectedSummary = {
    cts: 0,
    pcs: 0,
    amount: 0,
    rapValue: 0,
  };
  preventSelection: boolean = false;
  initialSelectedKeys: number[] = [];
  isSelectionRetriggered: boolean = false;
  applyFilterTypes: any;
  currentFilter: any;
  showFilterRow: boolean = true;
  showHeaderFilter: boolean = true;
  locationImages = {
    mumbai: 'assets/images/in.png',
    ny: 'assets/images/ny.png',
    aspecony: 'assets/images/ny.png',
    dmcc: 'assets/images/dubai.png',
    aspeconv: 'assets/images/ae.png',
    hk: 'assets/images/hk.png',
    shanghai: 'assets/images/shanghai.png',
  };

  @HostListener('window:resize', ['$event'])
  scrollingConfig = {
    mode: 'virtual' as DataGridScrollMode, // Assuming 'virtual' is a valid value for DataGridScrollMode
    showScrollbar: 'always' as ScrollbarMode,
    useNative: true,
    scrollByContent: true,
    scrollByThumb: false,
  };

  onResize(event) {
    this.innerHeight = window.innerHeight;
    if (this.page == 'cart') {
      this.gridHeight = '55vh';
      this.update_gridHeightMobile(304);
    } else if (this.page == 'order') {
      this.gridHeight = '65vh';
      this.update_gridHeightMobile(280);
    } else if (this.page == 'order-details' && this.orderBook == 'Offer') {
      this.update_gridHeightMobile(300);
    } else {
      this.update_gridHeightMobile(230);
    }

    this.innerWidth = window.innerWidth;
    if (this.innerWidth <= 500) {
      this.mobileView = true;
    } else if (this.innerWidth > 500) {
      this.mobileView = false;
    }
  }

  constructor(
    public cdRef: ChangeDetectorRef,
    public storage: Storage,
    public _navigateService: NavigateService,
    public analyticsService: AnalyticsService,
    public _companyService: CompanyService,
    private router: Router,
    private sortCodePipe: SortCodesPipe,
    public platform: Platform
  ) {
    this.deleteItem = this.deleteItem.bind(this);
    this.viewOffer = this.viewOffer.bind(this);
    this.calculateCustomSummary = this.calculateCustomSummary.bind(this);

    window.addEventListener(
      'orientationchange',
      function (e) {
        if (this.innerWidth < 1200 && this.innerWidth >= 576) {
          this.gridHeight = '60vh';
        } else {
          this.gridHeight = '72vh';
        }
      }.bind(this)
    );
  }

  update_gridHeightMobile(headerFooter_height: number): void {
    /*|||||||||||||||| WHEN BACK BTN IS IN TOP ||||||||||||||||*/
    this.gridHeightMobile = this.innerHeight - headerFooter_height;

    /*|||||||||||||||| WHEN BACK BTN IS IN BOTTOM ||||||||||||||||*/
    // this.gridHeightMobile = this.innerHeight - (headerFooter_height + 22);
  }

  ngOnChanges(changes) {
    this.innerWidth = window.innerWidth;
    if (this.innerWidth <= 500) {
      this.mobileView = true;
    } else if (this.innerWidth > 500) {
      this.mobileView = false;
    }

    this.innerHeight = window.innerHeight;
    if (this.page == 'cart') {
      this.gridHeight = '75vh';
      if (this.innerWidth < 1200 && this.innerWidth >= 576) {
        this.gridHeight = '64vh';
      }
      this.update_gridHeightMobile(304);
    } else if (this.page == 'order') {
      this.gridHeight = '65vh';
      this.update_gridHeightMobile(280);
    } else if (this.page == 'order-details' && this.orderBook == 'Offer') {
      this.update_gridHeightMobile(300);
    } else {
      if (innerHeight < 600) {
        this.gridHeight = '60vh';
      } else if (innerHeight < 700) {
        this.gridHeight = '64vh';
      } else if (innerHeight < 800) {
        this.gridHeight = '68vh';
      }
      this.update_gridHeightMobile(230);
    }

    if (this.platform.is('ipad') && this.page == 'manage-order') {
      this.gridHeight = '50vh';
    }
    if (!!changes.refreshMobileGrid && changes.refreshMobileGrid.currentValue) {
      this.refreshMobileView();
    }
    if (!!changes.refreshGrid && !!changes.refreshGrid.currentValue) {
      this.refresh();
    }

    if (!!changes.showSummary && changes.showSummary.currentValue) {
      this.calculateSummary();
    }
    if (!!changes.totalSummary && !!changes.totalSummary.currentValue) {
      if (this.totalSummary.length != 0) {
        this.remoteOperations = false;
      }
    }
  }

  async calculateSummary() {
    await this.updateTotalSummary(this.rowData);
  }

  clearFilter() {
    if (!!this.dataGridInstance) {
      this.dataGridInstance.clearFilter();
    }
    if (!!this.dataGridInstanceDesktop) {
      this.dataGridInstanceDesktop.clearFilter();
    }
  }

  saveGridInstance(e) {
    this.dataGridInstanceDesktop = e.component;
  }

  viewOffer(event) {
    this.viewOfferInputs.emit(event.row);
  }

  saveMobileGridInstance(e) {
    if (!this.dataGridInstance) {
      this.dataGridInstance = e.component;
    }
  }

  refreshMobileView() {
    if (!!this.dataGridInstance) {
      this.totalSelectedSummary = {
        cts: 0,
        pcs: 0,
        amount: 0,
        rapValue: 0,
      };
      this.dataGridInstance.clearSelection();
    }
  }

  refresh() {
    this.totalSelectedSummary = {
      cts: 0,
      pcs: 0,
      amount: 0,
      rapValue: 0,
    };

    if (!!this.dataGridInstanceDesktop) {
      this.dataGridInstanceDesktop.clearSelection();
    }
  }

  refreshInstane() {
    if (!!this.dataGridInstanceDesktop) {
      this.dataGridInstanceDesktop.refresh();
    }
  }

  checkBoxValueCHanged(e, d) {
    if (e.value) {
      this.dataGridInstance.selectRows([d.key], e.value);
    } else {
      this.dataGridInstance.deselectRows([d.key]);
    }
  }

  ngOnInit() {
    // console.log("columns ", this.columns, " rows ", this.rowData);
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;
    if (this.innerWidth < 1200) {
      this.gridHeight = '74vh';
    }
    // if (this.page == 'cart') {
    //   this.gridHeight = '70vh';
    //   if (this.innerWidth < 1200 && this.innerWidth >= 576) {
    //     this.gridHeight = '64vh';
    //   }
    //   this.gridHeightMobile = this.innerHeight - 304;
    // } else if (this.page == 'order') {
    //   this.gridHeight = '65vh';
    //   this.gridHeightMobile = this.innerHeight - 280;
    // } else if (this.page == 'order-details' && this.orderBook == 'Offer') {
    //   this.gridHeightMobile = this.innerHeight - 300;
    // } else {
    //   this.gridHeightMobile = this.innerHeight - 230;
    // }
    // console.log(this.innerHeight);
    this.setSelectedRows();
    if (this.page == 'cart') {
      this.columns = this.columns.filter((c) => c.name != 'ADD TO CART');
      this.gridHeight = '75vh';
      if (this.innerWidth < 1200 && this.innerWidth >= 576) {
        this.gridHeight = '64vh';
      }
      this.update_gridHeightMobile(330);
    } else if (this.page == 'order') {
      this.gridHeight = '65vh';
      this.update_gridHeightMobile(280);
    } else if (this.page == 'order-details' && this.orderBook == 'Offer') {
      this.update_gridHeightMobile(300);
    } else {
      this.update_gridHeightMobile(230);
    }
    this.userData = this.storage.get('userData');
  }

  onValueChanged(e, d) {
    // this.dataGrid.instance.selectRows([d.key], true)
    // e.row = e.selectedRowsData[0]; selectedRowsData
    this.call(e);
  }

  calculateCellValue(rowData) {
    // ...
    console.log(rowData);
  }

  customAmount(rowData) {
    if (!!rowData.Rapnet_plus && typeof rowData.Rapnet_plus == 'number') {
      return Math.round(rowData.Rapnet_plus);
    }
  }

  customPrice(rowData) {
    if (
      !!rowData.Rapnet_pluspercarat &&
      typeof rowData.Rapnet_pluspercarat == 'number'
    ) {
      let price = rowData.Rapnet_pluspercarat;
      return Math.round(price);
    }
  }

  call(event) {
    //this.refreshMobileGrid = false;
    console.log('event ', event);
    this.selected = event.row;
    //this.refreshMobileGrid = false;
    // this.event.publish("selectedValue", this.selected);
    console.log('selected', this.selected);
    this.setSelectedRows();
    this.callFunction.emit(event);
  }

  paginationFunction(event) {
    this.pageFunction.emit(event);
  }

  deleteItem(event) {
    console.log(event);
    console.log(event.row.data);
    this.deleteFunction.emit(event.row.data);
  }

  delete(row) {
    this.deleteFunction.emit(row.data);
    this.analyticsService.addEvents('removed from cart', {
      stoneID: row.data.id,
      username: this.userData.__zone_symbol__value.name,
      user: this.userData.__zone_symbol__value.username,
    });
  }
  showStoneId(data) {
    let stoneId = data.value;
    if (!!stoneId && stoneId.toString().indexOf('_') > -1) {
      let index = stoneId.split('/', 3).join('/').length;
      return stoneId
        .split(stoneId.substring(index + 1, stoneId.length))
        .join(
          stoneId
            .substring(index + 1, stoneId.length)
            .slice(0, stoneId.substring(index + 1, stoneId.length).indexOf('_'))
        );
    } else {
      return stoneId;
    }
  }
  showDate(value) {
    if (!!value) {
      return format(new Date(value), 'dd-MM-yyyy');
    }
  }
  beforeOnCellMouseDownFunc = (event, coords, element) => {
    // console.log("beforeOnCellMouseDownFunc ", event, coords, element);
    if (coords.row < 0) {
      event.stopImmediatePropagation();
    }
  };

  customizeSum(data) {
    if (!!data.value) return data.value.toFixed(2);
    else return data.value;
  }

  customizeSumAvg(data) {
    if (!!data.value) {
      if (
        !!data.valueText &&
        data.valueText.length > 0 &&
        data.valueText.split(':').length > 0
      ) {
        let label = data.valueText.split(':')[0];
        return data.value.toFixed(2);
      } else {
        return data.value.toFixed(2);
      }
    } else {
      return data.value;
    }
  }

  onCellPrepared(e) {
    if (e.rowType === 'data' && e.column.dataField === 'quantity') {
      this.loadSummary = true;
    }

    // if (e.rowType === "data" && e.column.caption === "Offer Amt") {
    //     this.totalAmount += e.data.Amount;
    //     this.loadSummary = true
    // }
  }

  onCellPreparedFn(e) {
    if (
      e.rowType === 'data' &&
      e.data['externalStatus']?.toLowerCase() == 'on memo' &&
      e.column.caption?.toLowerCase() === 'stone id'
    ) {
      e.cellElement.style.backgroundColor = 'pink';
    }
  }

  calculateCustomSummary(options) {
    if (options.name === 'Req Price') {
      if (options.summaryProcess === 'start') {
        options.price = 0;
        options.cts = 0;
        options.amount = 0;
      }
      if (options.summaryProcess === 'calculate') {
        options.price += parseFloat(options.value['Req Price']);
        options.cts += parseFloat(options.value['cts']);
        options.amount += parseFloat(options.value['Amount']);
        console.log(options.amount);
        console.log(options.cts);
      }
      if (options.summaryProcess === 'finalize') {
        options.totalValue = (options.amount / options.cts).toFixed(2);
        console.log(options.totalValue);
      }
    }

    // if (options.name === 'listDiscountPrice') {
    //     if (options.summaryProcess === 'start') {
    //         options.price = 0
    //         options.cts = 0;
    //         options.amount = 0;
    //     }
    //     if (options.summaryProcess === 'calculate') {
    //         options.price += parseFloat(options.value['listDiscountPrice'])
    //         options.cts += parseFloat(options.value['cts'])
    //         options.amount +=  parseFloat(options.value['listAmount'])
    //         console.log(options.amount)
    //         console.log(options.cts)
    //     }
    //     if (options.summaryProcess === 'finalize') {
    //         options.totalValue = (options.amount / options.cts).toFixed(2)
    //         console.log(options.totalValue)
    //     }
    // }
  }

  onFocusedCellChanged(event) {
    console.log(event.row);
    if (event.row) {
      if ('Req Discount' == event.column.dataField) {
        event.row = this.updateValue(event.value, 'Disc', event.data);
      } else if ('Req Price' == event.column.dataField) {
        event.row = this.updateValue(event.value, 'Price', event.data);
      } else if ('Amount' == event.column.dataField) {
        event.row = this.updateValue(event.value, 'Amt', event.data);
      }

      if ('discount' == event.column.dataField) {
        event.row = this.updateValue(event.value, 'Disc', event.data);
      } else if ('discountPrice' == event.column.dataField) {
        event.row = this.updateValue(event.value, 'Price', event.data);
      } else if ('priceWithShipCost' == event.column.dataField) {
        event.row = this.updateValue(event.value, 'Amt', event.data);
      }
    }
  }

  updateValue(value, type, product) {
    //    this.listOffer = false;
    this.offerValueUpdate.emit(false);
    console.log(value);
    console.log(product);

    // let product = this.cartData.data.products[rowIndex];
    let cts = parseFloat(product['cts']);
    let rap = parseFloat(product['RAPAPORTpercarat']);
    let listDisc = parseFloat(product['Rapnet_plusDiscountPercent']);
    let listPrice = parseFloat(product['Rapnet_pluspercarat']);
    let listAmt = parseFloat(product['Rapnet_plus']);
    let disc =
      parseFloat(product['Req Discount']) || parseFloat(product['discount']);
    let price =
      parseFloat(product['Req Price']) || parseFloat(product['discountPrice']);
    let amt =
      parseFloat(product['Amount']) || parseFloat(product['priceWithShipCost']);

    if (type == 'Disc') {
      disc = parseFloat(value);
      price = rap - (rap * disc) / 100;
      amt = price * cts;
    } else if (type == 'Price') {
      price = parseFloat(value);
      disc = 100 - (price / rap) * 100;
      amt = price * cts;
    } else if (type == 'Amt') {
      amt = parseFloat(value);
      price = amt / cts;
      disc = 100 - (price / rap) * 100;
    }
    console.log(listDisc);
    console.log(disc, listDisc + 5);
    if (disc <= listDisc + 5) {
      console.log(1);
      if (
        product['Req Discount'] &&
        product['Req Price'] &&
        product['Amount']
      ) {
        product['Req Discount'] = disc.toFixed(2);
        product['Req Price'] = price.toFixed(2);
        product['Amount'] = amt.toFixed(2);
      } else {
        product['discount'] = disc.toFixed(2);
        product['discountPrice'] = price.toFixed(2);
        product['priceWithShipCost'] = amt.toFixed(2);
      }
    } else {
      console.log(2);
      if (
        product['Req Discount'] &&
        product['Req Price'] &&
        product['Amount']
      ) {
        product['Req Discount'] = listDisc.toFixed(2);
        product['Req Price'] = listPrice.toFixed(2);
        product['Amount'] = listAmt.toFixed(2);
      } else {
        product['discount'] = listDisc.toFixed(2);
        product['discountPrice'] = listPrice.toFixed(2);
        product['priceWithShipCost'] = listAmt.toFixed(2);
      }
      console.log('disct exceeded');
      this.discountError.emit(true);
    }
    this.refreshInstane();
    return product;
  }

  handlePropertyChange(e) {
    console.log(e);
    console.log(this.rowData);
    this.dataSorted.emit(this.rowData);
    if (e.name === 'changedProperty') {
      console.log('--->>>>>>>>>>>>>>>>>>>' + e);
      // handle the property change here
    }
  }

  onSelectionChanged = (e) => {
    this.onSelectionChanged_preventSelection(e);
  };
  onCellClick = (e) => {
    this.onCellClick_preventSelection(e);
  };

  onCellClick_preventSelection = (e) => {
    console.log(e);
    if (e.column) {
      if (
        e.column.dataField === 'Req Discount' ||
        e.column.dataField == 'Req Price' ||
        e.column.dataField == 'Amount'
      ) {
        this.initialSelectedKeys = e.component.getSelectedRowKeys();
        this.preventSelection = true;
      } else {
        this.columnName = e.column.name;
        this.preventSelection = false;
      }
    }
  };

  updateTotalSummary(rowsData) {
    this.selectedRows = rowsData.length;
    this.totalSelectedSummary = {
      cts: 0,
      pcs: 0,
      amount: 0,
      rapValue: 0,
    };

    for (let i = 0; i < rowsData.length; i++) {
      const row = rowsData[i];

      this.totalSelectedSummary['cts'] += row['cts'] || 0;
      const companyJson = this._companyService.companyObj.config;

      if (!!companyJson.externalProduct.kgAppliedAmount) {
        const kgPricing = companyJson.externalProduct.kgAppliedAmount;
        this.totalSelectedSummary['amount'] += row[kgPricing] || 0;
        this.totalSelectedSummary['rapValue'] += row['RAPAPORT'] || 0;
      }
    }

    this.totalSelectedSummary['pcs'] = rowsData.length;

    this.selectionViewData.emit({
      totalSelectedSummary: this.totalSelectedSummary,
      hideClearSelection: this.hideClearSelection,
    });
  }

  onSelectionChanged_preventSelection = async (e) => {
    if (this.preventSelection === true && !this.isSelectionRetriggered) {
      // Revert selection state
      this.undoSelectRows(e.currentSelectedRowKeys);

      if (this.initialSelectedKeys.length >= 1) {
        this.undoDeselectRows(e.currentDeselectedRowKeys);
      }
      this.preventSelection = false;
    } else {
      e.row = e.selectedRowsData[0];
      e.columnName = this.columnName;
      console.log('onSelectionChanged event ', event);
      await this.updateTotalSummary(e.selectedRowsData);
      this.call(e);
      // this.columnName = e.column.caption;

      // if (e.rowType != "data")
      //     return;

      // if (e.eventType == "dxclick") {
      //     let selectedCol = this.columns[e.columnIndex - 1];
      //     if (!!selectedCol && !!selectedCol.showPopup && selectedCol.type == 'string') {
      //         // // console.log("onCellHoverChanged ",e);
      //         this.popOverFunction.emit(e);
      //     }
      // }
    }
  };

  undoDeselectRows = (deselectedRowKeys) => {
    this.isSelectionRetriggered = true;
    this.dataGridInstanceDesktop.selectRows(deselectedRowKeys, true); // 2nd parameter is set to "true" to preserve the other selected rows
    this.isSelectionRetriggered = false;
  };

  undoSelectRows = (selectedRowKeys) => {
    this.isSelectionRetriggered = true;
    this.dataGridInstanceDesktop.deselectRows(selectedRowKeys);
    this.isSelectionRetriggered = false;
  };

  // onSelectionChanged(event) {
  //     console.log("onSelectionChanged event ", event);
  //     if (this.columnName != 'Offer Disc') {
  //         this.selectedRows = event.selectedRowsData.length
  //         // var grid = event.component;

  //         // var disabledKeys = event.currentSelectedRowKeys.filter(i => (!i.editingAllowed));

  //         // if (disabledKeys.length > 0) {
  //         //     if (this.justDeselected) {
  //         //         this.justDeselected = false;
  //         //         grid.deselectAll();
  //         //     }
  //         //     else {
  //         //         this.justDeselected = true;
  //         //         grid.deselectRows(disabledKeys);
  //         //     }
  //         // }
  //         event.row = event.selectedRowsData[0];
  //         this.call(event);
  //     }
  // }

  // onCellClick(e) {
  //     this.columnName = e.column.caption;

  //     if (e.rowType != "data")
  //         return;

  //     if (e.eventType == "dxclick") {
  //         let selectedCol = this.columns[e.columnIndex - 1];
  //         if (!!selectedCol && !!selectedCol.showPopup && selectedCol.type == 'string') {
  //             // // console.log("onCellHoverChanged ",e);
  //             this.popOverFunction.emit(e);
  //         }
  //     }
  // }

  viewCertificate(e) {
    this.viewCertificateFn.emit(e.data);
  }

  singleProduct(e) {
    // console.log(e);
    let columnIndex = 0;
    if (!!e.columnIndex) {
      columnIndex = e.columnIndex;
    } else {
      if (!!e.columns) {
        columnIndex = e.columns[1]['index'];
      }
    }

    let i = columnIndex - 1;
    if (i == -1) {
      i = 0;
    }

    let selectedCol = this.columns[i];
    console.log(selectedCol);
    //console.log(e.data)
    if (!!selectedCol) {
      if (!!selectedCol.redirectToOrderPage) {
        this.router.navigate(['/manage-order-details/' + e.data.orderId]);
      } else {
        this.selectStone.emit(e.data);
      }
    }
  }

  setSelectedRows() {
    //console.log(this.selected)
    if (this.selected && this.selected.length > 0) {
      this.refreshGrid = false;
      this.refreshMobileGrid = false;
      this.selectedRowKeys = this.selected.map((r) => r.stoneName);
    }
  }

  addToCart(event) {
    console.log(event.data);
    this.addToCartFunction.emit(event.data);
  }

  action(event, flag) {
    //console.log(event.data)
    event.data['viewData'] = flag;
    //return event.data
    //this.addToCartFunction.emit(event.data);
  }

  customCutCode(cut) {
    let companyJson = this._companyService.companyObj.config;
    if (!!companyJson.shortCodes) {
      let shortCodes = companyJson.shortCodes;
      let cutObj = shortCodes.filter((x) => x.label == cut);
      console.log(cutObj[0].code);
      return cutObj[0].code;
    }
  }

  getCodes(itemData: any, option: string): string {
    let newData: string = '-';
    switch (option) {
      case 'cutCode':
        newData = itemData.CutCode
          ? this.sortCodePipe.transform(itemData.CutCode)
          : '-';
        break;
      case 'polishCode':
        newData = itemData.PolishCode
          ? this.sortCodePipe.transform(itemData.PolishCode)
          : '-';
        break;
      case 'symmetryCode':
        newData = itemData.SymmetryCode
          ? this.sortCodePipe.transform(itemData.SymmetryCode)
          : '-';
        break;
      case 'fluorescenceCode':
        newData = itemData.FluorescenceCode
          ? this.sortCodePipe.transform(itemData.FluorescenceCode)
          : '-';
        break;
    }
    return newData;
  }
}
