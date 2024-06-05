import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-es-refinement-list',
  templateUrl: './es-refinement-list.component.html',
  styleUrls: ['./es-refinement-list.component.scss'],
})
export class EsRefinementListComponent implements OnInit {
  @Input() attribute: any;
  @Input() operator: any;
  @Input() limit: any;
  @Input() showMoreLimit: any;
  @Input() sortBy: any;
  @Input() items: any;
  @Input() view: any;
  @Input() placeholder: any;
  public showdesc =false;
  public hideItemsMoreThanShowMoreLimit = false;
  public data: any=[];
  public query: any;

  @Output() callFunction: EventEmitter<any> = new EventEmitter();
  @Output() callFunctionValue: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
    if(!!this.items) {
      this.items.filter(i=>{
        // if(this.view!='currentFilters') i.isRefined=false;
        this.data.push(i);
      });
    }
    if(!!this.showMoreLimit && this.showMoreLimit>0){
      this.hideItemsMoreThanShowMoreLimit = true;
    }
    // console.log("refinement ", this.items, this.data);
  }

  showData() {
    if(this.showdesc) {
      this.showdesc = false;
    } else {
      this.showdesc = true;
    }
  }

  refine(value, event) {
    // console.log("refine ",value, this.items, this.data, event.target.value);

    setTimeout(()=>{
      this.data.filter(a=>{
        if(a.id==value.id) {
          a.isRefined=value.isRefined;
        }
      });
      this.callFunction.emit(this.attribute);
    },500); 
  }

  refineValue(value, event) {
    // console.log("refine ",value, this.items, this.data, event.target.value);

    setTimeout(()=>{
      this.data.filter(a=>{
        if(a.id==value.id) {
          a.isRefined=value.isRefined;
        }
      });
      this.callFunctionValue.emit(value);
    },500); 
  }

  toggleShowMore(){
    this.hideItemsMoreThanShowMoreLimit = this.hideItemsMoreThanShowMoreLimit?false:true;
  }

  async search(ev: any) {
    // // console.log("search ", this.items, this.data);
    this.items = this.data;
    let val = ev.target.value;
    if (val && val.trim() !== "") {
      let d = await this.items.filter(function (item) {
        return item.label.toLowerCase().includes(val.toLowerCase());
      });
      this.items = d;
    } else {
      this.items = this.data;
    }
  }

  removeFilter(v,item) {
    v.isRefined = false;
    this.callFunction.emit(item.attribute);
  }
}
