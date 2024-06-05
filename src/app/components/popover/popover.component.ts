import { Component, OnInit, Input } from '@angular/core';
import { EsOrderByService } from '../../service/observable/esOrderBy/es-order-by.service';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit {
  @Input() obj: any;
  @Input() row: any;
  @Input() html: any;
  @Input() sortBy: any;
  @Input() selectedBtn: any;
  // @Input() isExcel: boolean = false;

  displayObj = [];
  constructor(private _esOrderByService: EsOrderByService) {}

  ngOnInit() {
    if (!this.html && !this.sortBy) {
      this.obj.popupFields.split(',').filter(res => {
        this.displayObj.push({
          key: res,
          value: this.row[res],
        });
      });
    }
  }

  sortBySelected(btn) {
    this.selectedBtn = btn.id;
    this._esOrderByService.observables.next(btn);
  }
}
